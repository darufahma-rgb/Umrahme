import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';
import DesktopSidebar from './DesktopSidebar';

export default function Layout() {
  return (
    <div className="min-h-screen bg-ink-950 lg:flex">
      {/* Sidebar — muncul hanya di desktop */}
      <DesktopSidebar />

      {/*
        Area konten:
        - Mobile (< lg): kartu max-w-app di tengah, BottomNav fixed di bawah
        - Desktop (≥ lg): mengisi sisa ruang di kanan sidebar, tanpa BottomNav
      */}
      <div className="relative mx-auto flex min-h-screen w-full max-w-app flex-col bg-ink-950 shadow-[0_0_80px_-20px_rgba(0,0,0,0.8)] lg:max-w-none lg:flex-1 lg:shadow-none">
        <main className="flex-1 pb-28 lg:pb-0">
          <Outlet />
        </main>

        {/* BottomNav — mobile saja */}
        <div className="lg:hidden">
          <BottomNav />
        </div>
      </div>
    </div>
  );
}
