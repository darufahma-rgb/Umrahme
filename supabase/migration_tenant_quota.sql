-- Saldo kuota penerbitan jamaah, dikelola hanya oleh master admin.
CREATE TABLE IF NOT EXISTS public.tenant_quota_balances (
  tenant_id UUID PRIMARY KEY REFERENCES public.tenants(id) ON DELETE CASCADE,
  balance INTEGER NOT NULL DEFAULT 0 CHECK (balance >= 0),
  total_issued INTEGER NOT NULL DEFAULT 0 CHECK (total_issued >= 0),
  total_used INTEGER NOT NULL DEFAULT 0 CHECK (total_used >= 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.tenant_quota_balances ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "tenant_quota_admin_full" ON public.tenant_quota_balances;
CREATE POLICY "tenant_quota_admin_full" ON public.tenant_quota_balances FOR ALL TO authenticated USING (public.is_app_admin()) WITH CHECK (public.is_app_admin());
DROP POLICY IF EXISTS "tenant_quota_travel_read" ON public.tenant_quota_balances;
CREATE POLICY "tenant_quota_travel_read" ON public.tenant_quota_balances FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.tenant_users tu WHERE tu.user_id = auth.uid() AND tu.tenant_id = tenant_quota_balances.tenant_id));

DROP FUNCTION IF EXISTS public.admin_token_order_mark_paid(UUID);
CREATE FUNCTION public.admin_token_order_mark_paid(p_order_id UUID)
RETURNS TABLE(quantity INTEGER, balance INTEGER)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_order public.token_orders%ROWTYPE; v_balance INTEGER;
BEGIN
  IF NOT public.is_app_admin() THEN RAISE EXCEPTION 'forbidden'; END IF;
  SELECT * INTO v_order FROM public.token_orders WHERE id = p_order_id FOR UPDATE;
  IF v_order.id IS NULL OR v_order.status <> 'menunggu_pembayaran' THEN RAISE EXCEPTION 'tagihan tidak dapat diproses'; END IF;
  INSERT INTO public.tenant_quota_balances (tenant_id, balance, total_issued)
  VALUES (v_order.tenant_id, v_order.quantity, v_order.quantity)
  ON CONFLICT (tenant_id) DO UPDATE SET balance = tenant_quota_balances.balance + EXCLUDED.balance, total_issued = tenant_quota_balances.total_issued + EXCLUDED.total_issued, updated_at = now()
  RETURNING tenant_quota_balances.balance INTO v_balance;
  UPDATE public.token_orders SET status = 'lunas', paid_at = now() WHERE id = v_order.id;
  RETURN QUERY SELECT v_order.quantity, v_balance;
END; $$;

CREATE OR REPLACE FUNCTION public.jamaah_create_with_quota(p_tenant_id UUID, p_keberangkatan_id UUID, p_payload JSONB)
RETURNS public.jamaah_accounts
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_jamaah public.jamaah_accounts%ROWTYPE;
BEGIN
  IF NOT public.is_app_admin() AND NOT EXISTS (SELECT 1 FROM public.tenant_users WHERE user_id = auth.uid() AND tenant_id = p_tenant_id) THEN RAISE EXCEPTION 'forbidden'; END IF;
  UPDATE public.tenant_quota_balances SET balance = balance - 1, total_used = total_used + 1, updated_at = now() WHERE tenant_id = p_tenant_id AND balance > 0;
  IF NOT FOUND THEN RAISE EXCEPTION 'kuota penerbitan habis. Hubungi Umrahme untuk top up.'; END IF;
  INSERT INTO public.jamaah_accounts (tenant_id, keberangkatan_id, nama, nomor_jamaah, rombongan, nomor_bus, nomor_kamar, nomor_paspor, hotel_makkah, hotel_madinah, fase)
  VALUES (p_tenant_id, p_keberangkatan_id, trim(p_payload->>'nama'), trim(p_payload->>'nomor_jamaah'), nullif(trim(p_payload->>'rombongan'), ''), nullif(trim(p_payload->>'nomor_bus'), ''), nullif(trim(p_payload->>'nomor_kamar'), ''), nullif(trim(p_payload->>'nomor_paspor'), ''), nullif(trim(p_payload->>'hotel_makkah'), ''), nullif(trim(p_payload->>'hotel_madinah'), ''), coalesce(nullif(p_payload->>'fase', ''), 'persiapan')) RETURNING * INTO v_jamaah;
  RETURN v_jamaah;
END; $$;
REVOKE ALL ON FUNCTION public.jamaah_create_with_quota(UUID, UUID, JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.jamaah_create_with_quota(UUID, UUID, JSONB) TO authenticated;

CREATE OR REPLACE FUNCTION public.jamaah_bulk_create_with_quota(p_tenant_id UUID, p_keberangkatan_id UUID, p_items JSONB)
RETURNS INTEGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_count INTEGER; v_item JSONB;
BEGIN
  IF NOT public.is_app_admin() AND NOT EXISTS (SELECT 1 FROM public.tenant_users WHERE user_id = auth.uid() AND tenant_id = p_tenant_id) THEN RAISE EXCEPTION 'forbidden'; END IF;
  SELECT count(*) INTO v_count FROM jsonb_array_elements(p_items);
  IF v_count < 1 THEN RAISE EXCEPTION 'tidak ada jamaah untuk diterbitkan'; END IF;
  UPDATE public.tenant_quota_balances SET balance = balance - v_count, total_used = total_used + v_count, updated_at = now() WHERE tenant_id = p_tenant_id AND balance >= v_count;
  IF NOT FOUND THEN RAISE EXCEPTION 'kuota tidak mencukupi untuk menerbitkan % jamaah. Hubungi Umrahme untuk top up.', v_count; END IF;
  FOR v_item IN SELECT value FROM jsonb_array_elements(p_items) LOOP
    INSERT INTO public.jamaah_accounts (tenant_id, keberangkatan_id, nama, nomor_jamaah, nomor_paspor, hotel_makkah, hotel_madinah, fase)
    VALUES (p_tenant_id, p_keberangkatan_id, trim(v_item->>'nama'), trim(v_item->>'nomor_jamaah'), nullif(trim(v_item->>'nomor_paspor'), ''), nullif(trim(v_item->>'hotel_makkah'), ''), nullif(trim(v_item->>'hotel_madinah'), ''), 'persiapan');
  END LOOP;
  RETURN v_count;
END; $$;
REVOKE ALL ON FUNCTION public.jamaah_bulk_create_with_quota(UUID, UUID, JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.jamaah_bulk_create_with_quota(UUID, UUID, JSONB) TO authenticated;
