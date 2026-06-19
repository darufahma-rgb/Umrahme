import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';

// Container mobile-first, max-width di desktop (tidak melar penuh layar).
// Memberi ruang bawah agar konten tidak tertutup BottomNav.
export default function Layout() {
  return (
    <div className="relative mx-auto flex min-h-screen max-w-app flex-col bg-ink-950 shadow-[0_0_80px_-20px_rgba(0,0,0,0.8)] sm:my-0">
      <main className="flex-1 pb-28">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
}
