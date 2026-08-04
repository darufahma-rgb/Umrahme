-- =============================================================
-- Umrahme - Jamaah Care Center
-- Laporan bantuan aman dari aplikasi jamaah ke portal travel.
-- =============================================================

CREATE TABLE IF NOT EXISTS public.help_requests (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id         UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  keberangkatan_id  UUID REFERENCES public.keberangkatan(id) ON DELETE SET NULL,
  jamaah_id         UUID REFERENCES public.jamaah_accounts(id) ON DELETE SET NULL,
  nomor_jamaah      TEXT NOT NULL,
  nama_jamaah       TEXT NOT NULL,
  kategori          TEXT NOT NULL CHECK (kategori IN ('tersesat', 'kesehatan', 'rombongan', 'lainnya')),
  pesan             TEXT NOT NULL CHECK (char_length(trim(pesan)) BETWEEN 1 AND 500),
  status            TEXT NOT NULL DEFAULT 'baru' CHECK (status IN ('baru', 'ditangani', 'selesai')),
  handled_by        TEXT,
  handled_at        TIMESTAMPTZ,
  resolved_at       TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_help_requests_batch_status
  ON public.help_requests(tenant_id, keberangkatan_id, status, created_at DESC);

CREATE OR REPLACE FUNCTION public.touch_help_request_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_help_requests_updated_at ON public.help_requests;
CREATE TRIGGER trg_help_requests_updated_at
BEFORE UPDATE ON public.help_requests
FOR EACH ROW EXECUTE FUNCTION public.touch_help_request_updated_at();

ALTER TABLE public.help_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "help_requests_travel_select" ON public.help_requests;
CREATE POLICY "help_requests_travel_select"
  ON public.help_requests FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.tenant_users tu
      WHERE tu.user_id = auth.uid() AND tu.tenant_id = help_requests.tenant_id
    )
  );

DROP POLICY IF EXISTS "help_requests_travel_update" ON public.help_requests;
CREATE POLICY "help_requests_travel_update"
  ON public.help_requests FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.tenant_users tu
      WHERE tu.user_id = auth.uid() AND tu.tenant_id = help_requests.tenant_id
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.tenant_users tu
      WHERE tu.user_id = auth.uid() AND tu.tenant_id = help_requests.tenant_id
    )
  );

CREATE OR REPLACE FUNCTION public.help_request_create(
  p_tenant_id UUID,
  p_nomor_jamaah TEXT,
  p_token TEXT,
  p_kategori TEXT,
  p_pesan TEXT
)
RETURNS public.help_requests
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_jamaah public.jamaah_accounts%ROWTYPE;
  v_request public.help_requests%ROWTYPE;
BEGIN
  IF NOT public.verify_jamaah_token(p_tenant_id::text, p_nomor_jamaah, p_token) THEN
    RAISE EXCEPTION 'unauthorized';
  END IF;

  SELECT * INTO v_jamaah
  FROM public.jamaah_accounts
  WHERE tenant_id = p_tenant_id AND nomor_jamaah = p_nomor_jamaah
  LIMIT 1;

  IF v_jamaah.id IS NULL THEN
    RAISE EXCEPTION 'Jamaah tidak ditemukan';
  END IF;

  INSERT INTO public.help_requests (
    tenant_id, keberangkatan_id, jamaah_id, nomor_jamaah, nama_jamaah, kategori, pesan
  ) VALUES (
    v_jamaah.tenant_id, v_jamaah.keberangkatan_id, v_jamaah.id,
    v_jamaah.nomor_jamaah, v_jamaah.nama, p_kategori, trim(p_pesan)
  ) RETURNING * INTO v_request;

  RETURN v_request;
END;
$$;

REVOKE ALL ON FUNCTION public.help_request_create(UUID, TEXT, TEXT, TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.help_request_create(UUID, TEXT, TEXT, TEXT, TEXT) TO anon, authenticated;
