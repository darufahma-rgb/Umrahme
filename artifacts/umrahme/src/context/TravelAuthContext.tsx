import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase, type TenantRow } from '../lib/supabase';

interface TravelAuthValue {
  session: Session | null;
  tenant: TenantRow | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const TravelAuthContext = createContext<TravelAuthValue | undefined>(undefined);

export function TravelAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [tenant, setTenant] = useState<TenantRow | null>(null);
  const [loading, setLoading] = useState(true);

  async function fetchTenant(userId: string) {
    const { data: mapping } = await supabase
      .from('tenant_users')
      .select('tenant_id')
      .eq('user_id', userId)
      .single();

    if (!mapping?.tenant_id) {
      setTenant(null);
      return;
    }

    const { data: tenantData } = await supabase
      .from('tenants')
      .select('*')
      .eq('id', mapping.tenant_id)
      .single();

    setTenant((tenantData as TenantRow) ?? null);
  }

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      const s = data.session;
      setSession(s);
      if (s?.user.id) {
        await fetchTenant(s.user.id);
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, s) => {
      setSession(s);
      if (s?.user.id) {
        await fetchTenant(s.user.id);
      } else {
        setTenant(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setTenant(null);
  };

  return (
    <TravelAuthContext.Provider value={{ session, tenant, loading, signOut }}>
      {children}
    </TravelAuthContext.Provider>
  );
}

export function useTravelAuth(): TravelAuthValue {
  const ctx = useContext(TravelAuthContext);
  if (!ctx) throw new Error('useTravelAuth harus dipakai di dalam <TravelAuthProvider>');
  return ctx;
}
