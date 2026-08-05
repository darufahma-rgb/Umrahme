CREATE TABLE IF NOT EXISTS public.jamaah_app_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  nomor_jamaah TEXT NOT NULL,
  rating SMALLINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  komentar TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (tenant_id, nomor_jamaah)
);

CREATE OR REPLACE FUNCTION public.jamaah_feedback_submit(
  p_tenant_id UUID, p_nomor_jamaah TEXT, p_token TEXT, p_rating SMALLINT, p_komentar TEXT DEFAULT NULL
) RETURNS VOID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.jamaah_accounts
    WHERE tenant_id = p_tenant_id AND nomor_jamaah = p_nomor_jamaah AND access_token = p_token
  ) THEN RAISE EXCEPTION 'Sesi jamaah tidak valid'; END IF;
  INSERT INTO public.jamaah_app_feedback (tenant_id, nomor_jamaah, rating, komentar)
  VALUES (p_tenant_id, p_nomor_jamaah, p_rating, NULLIF(trim(p_komentar), ''))
  ON CONFLICT (tenant_id, nomor_jamaah) DO UPDATE
  SET rating = EXCLUDED.rating, komentar = EXCLUDED.komentar, updated_at = now();
END; $$;

GRANT EXECUTE ON FUNCTION public.jamaah_feedback_submit(UUID, TEXT, TEXT, SMALLINT, TEXT) TO anon, authenticated;
