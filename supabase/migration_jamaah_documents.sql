CREATE TABLE IF NOT EXISTS public.jamaah_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  jamaah_id UUID NOT NULL REFERENCES public.jamaah_accounts(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL CHECK (document_type IN ('paspor', 'visa', 'tiket', 'foto', 'lainnya')),
  status TEXT NOT NULL DEFAULT 'belum' CHECK (status IN ('belum', 'proses', 'lengkap')),
  note TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (jamaah_id, document_type)
);
ALTER TABLE public.jamaah_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "jamaah_documents_travel_full" ON public.jamaah_documents FOR ALL TO authenticated
  USING (public.is_app_admin() OR EXISTS (SELECT 1 FROM public.tenant_users tu WHERE tu.user_id = auth.uid() AND tu.tenant_id = jamaah_documents.tenant_id))
  WITH CHECK (public.is_app_admin() OR EXISTS (SELECT 1 FROM public.tenant_users tu WHERE tu.user_id = auth.uid() AND tu.tenant_id = jamaah_documents.tenant_id));
