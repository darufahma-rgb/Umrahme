CREATE TABLE IF NOT EXISTS public.travel_contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL UNIQUE REFERENCES public.tenants(id) ON DELETE CASCADE,
  contract_number TEXT NOT NULL UNIQUE,
  package_name TEXT NOT NULL DEFAULT 'Starter',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'expired', 'terminated')),
  starts_at DATE,
  ends_at DATE,
  annual_fee INTEGER NOT NULL DEFAULT 0 CHECK (annual_fee >= 0),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS travel_contracts_status_ends_at_idx ON public.travel_contracts(status, ends_at);

