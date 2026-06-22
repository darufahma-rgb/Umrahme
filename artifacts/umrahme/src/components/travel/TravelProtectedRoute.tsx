import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useTravelAuth } from '../../context/TravelAuthContext';

export default function TravelProtectedRoute({ children }: { children: ReactNode }) {
  const { session, loading } = useTravelAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500 text-sm">Memuat...</div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/travel/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
