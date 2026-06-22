import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { travelLogin, type TenantRow } from '../lib/api';

interface TravelAuthValue {
  email: string | null;
  tenant: TenantRow | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const TravelAuthContext = createContext<TravelAuthValue | undefined>(undefined);

export function TravelAuthProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState<string | null>(null);
  const [tenant, setTenant] = useState<TenantRow | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('umrahme.travel_token');
    const savedEmail = localStorage.getItem('umrahme.travel_email');
    const savedTenant = localStorage.getItem('umrahme.travel_tenant');
    if (token && savedEmail && savedTenant) {
      setEmail(savedEmail);
      try { setTenant(JSON.parse(savedTenant)); } catch { /* ignore */ }
    }
    setLoading(false);
  }, []);

  const login = async (emailInput: string, password: string) => {
    const result = await travelLogin(emailInput, password);
    localStorage.setItem('umrahme.travel_token', result.token);
    localStorage.setItem('umrahme.travel_email', result.email);
    localStorage.setItem('umrahme.travel_tenant', JSON.stringify(result.tenant));
    setEmail(result.email);
    setTenant(result.tenant);
  };

  const signOut = () => {
    localStorage.removeItem('umrahme.travel_token');
    localStorage.removeItem('umrahme.travel_email');
    localStorage.removeItem('umrahme.travel_tenant');
    setEmail(null);
    setTenant(null);
  };

  return (
    <TravelAuthContext.Provider value={{ email, tenant, loading, login, signOut }}>
      {children}
    </TravelAuthContext.Provider>
  );
}

export function useTravelAuth(): TravelAuthValue {
  const ctx = useContext(TravelAuthContext);
  if (!ctx) throw new Error('useTravelAuth harus dipakai di dalam <TravelAuthProvider>');
  return ctx;
}
