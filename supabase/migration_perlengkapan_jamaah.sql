-- =============================================================
-- Umrahme - Perlengkapan Jamaah per Batch
-- =============================================================

CREATE TABLE IF NOT EXISTS public.equipment_catalog (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id         UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  keberangkatan_id  UUID NOT NULL REFERENCES public.keberangkatan(id) ON DELETE CASCADE,
  label             TEXT NOT NULL CHECK (char_length(trim(label)) BETWEEN 1 AND 80),
  category          TEXT NOT NULL DEFAULT 'umum',
  sort_order        INTEGER NOT NULL DEFAULT 0,
  active            BOOLEAN NOT NULL DEFAULT true,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (keberangkatan_id, label)
);

CREATE TABLE IF NOT EXISTS public.equipment_assignments (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id         UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  keberangkatan_id  UUID NOT NULL REFERENCES public.keberangkatan(id) ON DELETE CASCADE,
  jamaah_id         UUID NOT NULL REFERENCES public.jamaah_accounts(id) ON DELETE CASCADE,
  equipment_id      UUID NOT NULL REFERENCES public.equipment_catalog(id) ON DELETE CASCADE,
  status            TEXT NOT NULL DEFAULT 'belum' CHECK (status IN ('belum', 'sudah', 'tidak_perlu')),
  received_at       TIMESTAMPTZ,
  updated_by        TEXT,
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (jamaah_id, equipment_id)
);

CREATE INDEX IF NOT EXISTS idx_equipment_catalog_batch
  ON public.equipment_catalog(tenant_id, keberangkatan_id, active, sort_order);
CREATE INDEX IF NOT EXISTS idx_equipment_assignments_batch
  ON public.equipment_assignments(tenant_id, keberangkatan_id, jamaah_id);

ALTER TABLE public.equipment_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment_assignments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "equipment_catalog_travel_all" ON public.equipment_catalog;
CREATE POLICY "equipment_catalog_travel_all" ON public.equipment_catalog FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.tenant_users tu WHERE tu.user_id = auth.uid() AND tu.tenant_id = equipment_catalog.tenant_id))
WITH CHECK (EXISTS (SELECT 1 FROM public.tenant_users tu WHERE tu.user_id = auth.uid() AND tu.tenant_id = equipment_catalog.tenant_id));

DROP POLICY IF EXISTS "equipment_assignments_travel_all" ON public.equipment_assignments;
CREATE POLICY "equipment_assignments_travel_all" ON public.equipment_assignments FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM public.tenant_users tu WHERE tu.user_id = auth.uid() AND tu.tenant_id = equipment_assignments.tenant_id))
WITH CHECK (EXISTS (SELECT 1 FROM public.tenant_users tu WHERE tu.user_id = auth.uid() AND tu.tenant_id = equipment_assignments.tenant_id));
