CREATE TABLE IF NOT EXISTS public.travel_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  nama TEXT NOT NULL,
  whatsapp TEXT,
  source TEXT NOT NULL DEFAULT 'manual',
  status TEXT NOT NULL DEFAULT 'baru' CHECK (status IN ('baru','follow_up','minat','booking','lunas','diterbitkan','batal')),
  batch_id UUID REFERENCES public.keberangkatan(id) ON DELETE SET NULL,
  next_follow_up_at TIMESTAMPTZ,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.travel_leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "travel_leads_access" ON public.travel_leads FOR ALL TO authenticated
USING (public.is_app_admin() OR EXISTS (SELECT 1 FROM public.tenant_users tu WHERE tu.user_id = auth.uid() AND tu.tenant_id = travel_leads.tenant_id))
WITH CHECK (public.is_app_admin() OR EXISTS (SELECT 1 FROM public.tenant_users tu WHERE tu.user_id = auth.uid() AND tu.tenant_id = travel_leads.tenant_id));

CREATE TABLE IF NOT EXISTS public.travel_broadcasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  keberangkatan_id UUID REFERENCES public.keberangkatan(id) ON DELETE SET NULL,
  audience TEXT NOT NULL CHECK (audience IN ('semua','berkas_belum_lengkap','paspor_belum','visa_belum','kuota')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.travel_broadcasts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "travel_broadcasts_access" ON public.travel_broadcasts FOR ALL TO authenticated
USING (public.is_app_admin() OR EXISTS (SELECT 1 FROM public.tenant_users tu WHERE tu.user_id = auth.uid() AND tu.tenant_id = travel_broadcasts.tenant_id))
WITH CHECK (public.is_app_admin() OR EXISTS (SELECT 1 FROM public.tenant_users tu WHERE tu.user_id = auth.uid() AND tu.tenant_id = travel_broadcasts.tenant_id));
