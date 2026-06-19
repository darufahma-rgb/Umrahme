import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { Fase, Jamaah } from '../types';

// =============================================================
// AuthContext — menyimpan state jamaah dummy setelah login.
// Dipersist ke localStorage agar refresh tidak melempar ke login.
// TODO(api): ganti dengan token/session sungguhan saat backend siap.
// =============================================================

const STORAGE_KEY = 'umrahme.jamaah';

interface AuthValue {
  jamaah: Jamaah | null;
  isLoggedIn: boolean;
  login: (j: Jamaah) => void;
  logout: () => void;
  setFase: (f: Fase) => void;
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [jamaah, setJamaah] = useState<Jamaah | null>(() => bacaStorage());

  useEffect(() => {
    try {
      if (jamaah) localStorage.setItem(STORAGE_KEY, JSON.stringify(jamaah));
      else localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* abaikan kuota / mode privat */
    }
  }, [jamaah]);

  const value: AuthValue = {
    jamaah,
    isLoggedIn: !!jamaah,
    login: (j) => setJamaah(j),
    logout: () => setJamaah(null),
    setFase: (f) => setJamaah((prev) => (prev ? { ...prev, fase: f } : prev)),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth harus dipakai di dalam <AuthProvider>');
  return ctx;
}
