import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { adminLogin } from '../lib/api';
import { verifyAdminToken } from '../lib/adminAuth';

interface AdminAuthValue {
  email: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AdminAuthContext = createContext<AdminAuthValue | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    verifyAdminToken().then(({ valid, email: verifiedEmail }) => {
      if (valid && verifiedEmail) {
        setEmail(verifiedEmail);
        localStorage.setItem('umrahme.admin_email', verifiedEmail);
      } else {
        localStorage.removeItem('umrahme.admin_token');
        localStorage.removeItem('umrahme.admin_email');
        setEmail(null);
      }
    }).finally(() => setLoading(false));
  }, []);

  const login = async (emailInput: string, password: string) => {
    const result = await adminLogin(emailInput, password);
    localStorage.setItem('umrahme.admin_token', result.token);
    localStorage.setItem('umrahme.admin_email', result.email);
    setEmail(result.email);
  };

  const signOut = () => {
    localStorage.removeItem('umrahme.admin_token');
    localStorage.removeItem('umrahme.admin_email');
    setEmail(null);
  };

  return (
    <AdminAuthContext.Provider value={{ email, loading, login, signOut }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth(): AdminAuthValue {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth harus dipakai di dalam <AdminAuthProvider>');
  return ctx;
}
