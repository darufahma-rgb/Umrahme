-- Token penerbitan jamaah. Satu token dapat membawa kuota jamaah tertentu.

DROP FUNCTION IF EXISTS public.travel_access_token_validate(TEXT);
DROP FUNCTION IF EXISTS public.admin_travel_token_revoke(UUID);
DROP FUNCTION IF EXISTS public.admin_travel_token_create(UUID, TEXT, TIMESTAMPTZ);
DROP TABLE IF EXISTS public.travel_access_tokens;

CREATE TABLE public.jamaah_issue_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,
  token_hint TEXT NOT NULL,
  label TEXT NOT NULL DEFAULT 'Kuota penerbitan jamaah',
  quota INTEGER NOT NULL CHECK (quota > 0),
  used_count INTEGER NOT NULL DEFAULT 0 CHECK (used_count >= 0 AND used_count <= quota),
  expires_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_jamaah_issue_tokens_tenant ON public.jamaah_issue_tokens(tenant_id, created_at DESC);
ALTER TABLE public.jamaah_issue_tokens ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.token_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price INTEGER NOT NULL DEFAULT 35000 CHECK (unit_price = 35000),
  status TEXT NOT NULL DEFAULT 'menunggu_pembayaran' CHECK (status IN ('menunggu_pembayaran', 'lunas', 'dibatalkan')),
  note TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.token_orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "token_orders_admin_full" ON public.token_orders;
CREATE POLICY "token_orders_admin_full" ON public.token_orders FOR ALL TO authenticated USING (public.is_app_admin()) WITH CHECK (public.is_app_admin());

DROP POLICY IF EXISTS "jamaah_issue_tokens_admin_read" ON public.jamaah_issue_tokens;
CREATE POLICY "jamaah_issue_tokens_admin_read" ON public.jamaah_issue_tokens FOR SELECT TO authenticated USING (public.is_app_admin());

CREATE OR REPLACE FUNCTION public.admin_jamaah_token_create(p_tenant_id UUID, p_label TEXT, p_quota INTEGER, p_expires_at TIMESTAMPTZ DEFAULT NULL)
RETURNS TABLE(id UUID, token TEXT, quota INTEGER, expires_at TIMESTAMPTZ)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_token TEXT; v_id UUID;
BEGIN
  IF NOT public.is_app_admin() THEN RAISE EXCEPTION 'forbidden'; END IF;
  IF p_quota IS NULL OR p_quota < 1 THEN RAISE EXCEPTION 'kuota minimal 1'; END IF;
  IF p_expires_at IS NOT NULL AND p_expires_at <= now() THEN RAISE EXCEPTION 'masa berlaku token harus di masa depan'; END IF;
  v_token := 'UMR-' || upper(encode(gen_random_bytes(18), 'hex'));
  INSERT INTO public.jamaah_issue_tokens (tenant_id, token_hash, token_hint, label, quota, expires_at)
  VALUES (p_tenant_id, encode(digest(v_token, 'sha256'), 'hex'), right(v_token, 6), coalesce(nullif(trim(p_label), ''), 'Kuota penerbitan jamaah'), p_quota, p_expires_at)
  RETURNING jamaah_issue_tokens.id INTO v_id;
  RETURN QUERY SELECT v_id, v_token, p_quota, p_expires_at;
END; $$;

CREATE OR REPLACE FUNCTION public.admin_jamaah_token_revoke(p_token_id UUID)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.is_app_admin() THEN RAISE EXCEPTION 'forbidden'; END IF;
  UPDATE public.jamaah_issue_tokens SET revoked_at = now() WHERE id = p_token_id AND revoked_at IS NULL;
END; $$;

CREATE OR REPLACE FUNCTION public.admin_token_order_create(p_tenant_id UUID, p_quantity INTEGER, p_note TEXT DEFAULT NULL)
RETURNS public.token_orders
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_order public.token_orders%ROWTYPE;
BEGIN
  IF NOT public.is_app_admin() THEN RAISE EXCEPTION 'forbidden'; END IF;
  IF p_quantity IS NULL OR p_quantity < 1 THEN RAISE EXCEPTION 'jumlah token minimal 1'; END IF;
  INSERT INTO public.token_orders (tenant_id, quantity, note) VALUES (p_tenant_id, p_quantity, nullif(trim(p_note), '')) RETURNING * INTO v_order;
  RETURN v_order;
END; $$;

CREATE OR REPLACE FUNCTION public.admin_token_order_mark_paid(p_order_id UUID)
RETURNS TABLE(token TEXT, quantity INTEGER)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_order public.token_orders%ROWTYPE; v_token TEXT;
BEGIN
  IF NOT public.is_app_admin() THEN RAISE EXCEPTION 'forbidden'; END IF;
  SELECT * INTO v_order FROM public.token_orders WHERE id = p_order_id FOR UPDATE;
  IF v_order.id IS NULL THEN RAISE EXCEPTION 'tagihan tidak ditemukan'; END IF;
  IF v_order.status <> 'menunggu_pembayaran' THEN RAISE EXCEPTION 'tagihan sudah diproses'; END IF;
  v_token := 'UMR-' || upper(encode(gen_random_bytes(18), 'hex'));
  INSERT INTO public.jamaah_issue_tokens (tenant_id, token_hash, token_hint, label, quota)
  VALUES (v_order.tenant_id, encode(digest(v_token, 'sha256'), 'hex'), right(v_token, 6), 'Order token ' || v_order.id::text, v_order.quantity);
  UPDATE public.token_orders SET status = 'lunas', paid_at = now() WHERE id = v_order.id;
  RETURN QUERY SELECT v_token, v_order.quantity;
END; $$;

CREATE OR REPLACE FUNCTION public.admin_token_order_cancel(p_order_id UUID)
RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT public.is_app_admin() THEN RAISE EXCEPTION 'forbidden'; END IF;
  UPDATE public.token_orders SET status = 'dibatalkan' WHERE id = p_order_id AND status = 'menunggu_pembayaran';
END; $$;

CREATE OR REPLACE FUNCTION public.jamaah_create_with_token(p_tenant_id UUID, p_keberangkatan_id UUID, p_token TEXT, p_payload JSONB)
RETURNS public.jamaah_accounts
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_jamaah public.jamaah_accounts%ROWTYPE; v_token_id UUID;
BEGIN
  IF NOT public.is_app_admin() AND NOT EXISTS (SELECT 1 FROM public.tenant_users WHERE user_id = auth.uid() AND tenant_id = p_tenant_id) THEN RAISE EXCEPTION 'forbidden'; END IF;
  UPDATE public.jamaah_issue_tokens SET used_count = used_count + 1
  WHERE tenant_id = p_tenant_id AND token_hash = encode(digest(trim(p_token), 'sha256'), 'hex')
    AND revoked_at IS NULL AND used_count < quota AND (expires_at IS NULL OR expires_at > now())
  RETURNING id INTO v_token_id;
  IF v_token_id IS NULL THEN RAISE EXCEPTION 'token tidak valid, habis, kedaluwarsa, atau sudah dicabut'; END IF;
  INSERT INTO public.jamaah_accounts (tenant_id, keberangkatan_id, nama, nomor_jamaah, rombongan, nomor_bus, nomor_kamar, nomor_paspor, hotel_makkah, hotel_madinah, fase)
  VALUES (p_tenant_id, p_keberangkatan_id, trim(p_payload->>'nama'), trim(p_payload->>'nomor_jamaah'), nullif(trim(p_payload->>'rombongan'), ''), nullif(trim(p_payload->>'nomor_bus'), ''), nullif(trim(p_payload->>'nomor_kamar'), ''), nullif(trim(p_payload->>'nomor_paspor'), ''), nullif(trim(p_payload->>'hotel_makkah'), ''), nullif(trim(p_payload->>'hotel_madinah'), ''), coalesce(nullif(p_payload->>'fase', ''), 'persiapan'))
  RETURNING * INTO v_jamaah;
  RETURN v_jamaah;
END; $$;

REVOKE ALL ON FUNCTION public.admin_jamaah_token_create(UUID, TEXT, INTEGER, TIMESTAMPTZ) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.admin_jamaah_token_revoke(UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.jamaah_create_with_token(UUID, UUID, TEXT, JSONB) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.admin_token_order_create(UUID, INTEGER, TEXT) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.admin_token_order_mark_paid(UUID) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.admin_token_order_cancel(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_jamaah_token_create(UUID, TEXT, INTEGER, TIMESTAMPTZ) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_jamaah_token_revoke(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.jamaah_create_with_token(UUID, UUID, TEXT, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_token_order_create(UUID, INTEGER, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_token_order_mark_paid(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_token_order_cancel(UUID) TO authenticated;

-- Jamaah baru wajib diterbitkan lewat RPC yang mengonsumsi token.
DROP POLICY IF EXISTS "jamaah_accounts_insert" ON public.jamaah_accounts;
DROP POLICY IF EXISTS "jamaah_accounts_update" ON public.jamaah_accounts;
DROP POLICY IF EXISTS "jamaah_accounts_delete" ON public.jamaah_accounts;
DROP POLICY IF EXISTS "travel_agency_write_jamaah" ON public.jamaah_accounts;
DROP POLICY IF EXISTS "travel_own_jamaah" ON public.jamaah_accounts;
CREATE POLICY "travel_agency_update_jamaah" ON public.jamaah_accounts FOR UPDATE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.tenant_users tu WHERE tu.user_id = auth.uid() AND tu.tenant_id = jamaah_accounts.tenant_id))
  WITH CHECK (EXISTS (SELECT 1 FROM public.tenant_users tu WHERE tu.user_id = auth.uid() AND tu.tenant_id = jamaah_accounts.tenant_id));
CREATE POLICY "travel_agency_delete_jamaah" ON public.jamaah_accounts FOR DELETE TO authenticated
  USING (EXISTS (SELECT 1 FROM public.tenant_users tu WHERE tu.user_id = auth.uid() AND tu.tenant_id = jamaah_accounts.tenant_id));
