-- Portal jamaah: status dokumen (paspor, visa, tiket) dilihat jamaah sendiri.
-- Jamaah login memakai token sesi (bukan akun Supabase), jadi baca lewat RPC
-- yang memverifikasi token, sama seperti help_request_create.
-- Tabel jamaah_documents sudah ada (migration_jamaah_documents.sql).

CREATE OR REPLACE FUNCTION public.jamaah_documents_get(
  p_tenant_id UUID,
  p_nomor_jamaah TEXT,
  p_token TEXT
)
RETURNS SETOF public.jamaah_documents
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.verify_jamaah_token(p_tenant_id::text, p_nomor_jamaah, p_token) THEN
    RAISE EXCEPTION 'unauthorized';
  END IF;

  RETURN QUERY
  SELECT d.*
  FROM public.jamaah_documents d
  JOIN public.jamaah_accounts j ON j.id = d.jamaah_id
  WHERE j.tenant_id = p_tenant_id
    AND j.nomor_jamaah = p_nomor_jamaah
    AND d.document_type IN ('paspor', 'visa', 'tiket');
END;
$$;

REVOKE ALL ON FUNCTION public.jamaah_documents_get(UUID, TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.jamaah_documents_get(UUID, TEXT, TEXT) TO anon, authenticated;
