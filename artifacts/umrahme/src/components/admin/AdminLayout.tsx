import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { signOut, session } = useAdminAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/admin" className="font-bold text-gray-900 text-sm">
            ⚙️ Admin Panel
          </Link>
          <nav className="flex items-center gap-4">
            <Link
              to="/admin"
              className={`text-sm ${location.pathname === '/admin' ? 'text-blue-600 font-medium' : 'text-gray-500 hover:text-gray-800'}`}
            >
              Daftar Tenant
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 hidden sm:block">{session?.user.email}</span>
          <button
            onClick={signOut}
            className="text-xs px-3 py-1.5 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Keluar
          </button>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
