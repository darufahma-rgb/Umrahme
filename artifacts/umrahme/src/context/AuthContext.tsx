// @refresh reset
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Jamaah } from '../types';
import { supabase, type TenantRow, type KeberangkatanRow } from '../lib/supabase';
import { hitungFaseDariItinerary, hitungFaseEfektif } from '../data/jamaah';

const STORAGE_KEY = 'umrahme.jamaah';
const TENANT_STORAGE_KEY = 'umrahme.tenant';
const KEBERANGKATAN_STORAGE_KEY = 'umrahme.keberangkatan';

const DEFAULT_PRIMARY = '#0ea5e9';
const DEFAULT_PRIMARY_DEEP = '#0284c7';

interface AuthValue {
  jamaah: Jamaah | null;
  tenant: TenantRow | null;
  keberangkatan: KeberangkatanRow | null;
  isLoggedIn: boolean;
  login: (j: Jamaah, t: TenantRow, kb: KeberangkatanRow | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthValue | undefined>(undefined);

function bacaStorage(): Jamaah | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Jamaah) : null;
  } catch {
    return null;
  }
}

function bacaTenant(): TenantRow | null {
  try {
    const raw = localStorage.getItem(TENANT_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as TenantRow) : null;
  } catch {
    return null;
  }
}

function bacaKeberangkatan(): KeberangkatanRow | null {
  try {
    const raw = localStorage.getItem(KEBERANGKATAN_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as KeberangkatanRow) : null;
  } catch {
    return null;
  }
}

function applyTenantTheme(tenant: TenantRow | null) {
  const root = document.documentElement;
  root.style.setProperty('--color-primary', tenant?.primary_color ?? DEFAULT_PRIMARY);
  root.style.setProperty('--color-primary-deep', tenant?.primary_deep_color ?? DEFAULT_PRIMARY_DEEP);
  document.title = tenant?.page_title ?? 'Pendamping Umrah';
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [jamaah, setJamaah] = useState<Jamaah | null>(() => {
    const saved = bacaStorage();
    const savedKeberangkatan = bacaKeberangkatan();
    if (saved && savedKeberangkatan) {
      return {
        ...saved,
        fase: hitungFaseEfektif(
          savedKeberangkatan.tanggal_keberangkatan,
          savedKeberangkatan.tanggal_kepulangan,
        ),
      };
    }
    if (saved) {
      const savedTenant = bacaTenant();
      if (savedTenant) {
        return {
          ...saved,
          fase: hitungFaseEfektif(
            savedTenant.tanggal_keberangkatan,
            savedTenant.tanggal_kepulangan,
          ),
        };
      }
    }
    return saved;
  });
  const [tenant, setTenant] = useState<TenantRow | null>(() => bacaTenant());
  const [keberangkatan, setKeberangkatan] = useState<KeberangkatanRow | null>(() => bacaKeberangkatan());

  useEffect(() => {
    try {
      if (jamaah) localStorage.setItem(STORAGE_KEY, JSON.stringify(jamaah));
      else localStorage.removeItem(STORAGE_KEY);
    } catch { /* abaikan */ }
  }, [jamaah]);

  useEffect(() => {
    try {
      if (tenant) localStorage.setItem(TENANT_STORAGE_KEY, JSON.stringify(tenant));
      else localStorage.removeItem(TENANT_STORAGE_KEY);
    } catch { /* abaikan */ }
    applyTenantTheme(tenant);
  }, [tenant]);

  useEffect(() => {
    if (!keberangkatan?.id) return;
    let cancelled = false;

    supabase
      .from('agenda_items')
      .select('tanggal')
      .eq('keberangkatan_id', keberangkatan.id)
      .then(({ data }) => {
        if (cancelled) return;
        const fase = hitungFaseDariItinerary(
          (data ?? []).map((item) => item.tanggal),
          keberangkatan.tanggal_keberangkatan,
          keberangkatan.tanggal_kepulangan,
        );
        setJamaah((prev) => (prev && prev.fase !== fase ? { ...prev, fase } : prev));
      });

    return () => { cancelled = true; };
  }, [keberangkatan?.id, keberangkatan?.tanggal_keberangkatan, keberangkatan?.tanggal_kepulangan]);

  useEffect(() => {
    try {
      if (keberangkatan) localStorage.setItem(KEBERANGKATAN_STORAGE_KEY, JSON.stringify(keberangkatan));
      else localStorage.removeItem(KEBERANGKATAN_STORAGE_KEY);
    } catch { /* abaikan */ }
  }, [keberangkatan]);

  useEffect(() => {
    setJamaah((prev) => {
      if (!prev) return prev;
      const namaTravel = tenant?.nama_travel ?? prev.travel;
      if (prev.travel === namaTravel) return prev;
      return { ...prev, travel: namaTravel };
    });
  }, [tenant]);

  useEffect(() => {
    if (!jamaah?.nomorJamaah || !tenant?.id) return;
    supabase
      .from('jamaah_accounts')
      .select('*')
      .eq('tenant_id', tenant.id)
      .eq('nomor_jamaah', jamaah.nomorJamaah)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          setJamaah(prev => prev ? {
            ...prev,
            hotelMakkah: (data.hotel_makkah ?? keberangkatan?.hotel_makkah ?? tenant.hotel_makkah) ?? undefined,
            hotelMadinah: (data.hotel_madinah ?? keberangkatan?.hotel_madinah ?? tenant.hotel_madinah) ?? undefined,
            rombongan: data.rombongan ?? prev.rombongan,
          } : prev);
        }
      });
  }, [jamaah?.nomorJamaah, tenant?.id, keberangkatan?.id]);

  const value: AuthValue = {
    jamaah,
    tenant,
    keberangkatan,
    isLoggedIn: !!jamaah,
    login: (j, t, kb) => { setJamaah(j); setTenant(t); setKeberangkatan(kb); },
    logout: () => { setJamaah(null); setTenant(null); setKeberangkatan(null); },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth harus dipakai di dalam <AuthProvider>');
  return ctx;
}
