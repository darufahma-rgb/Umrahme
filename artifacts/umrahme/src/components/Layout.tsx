import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';
import DesktopSidebar from './DesktopSidebar';

export default function Layout() {
  return (
    <div className="min-h-screen bg-canvas lg:flex">
      <DesktopSidebar />

      <div className="relative mx-auto flex min-h-screen w-full max-w-app flex-col bg-canvas lg:max-w-none lg:flex-1">
        <main className="flex-1 pb-28 lg:pb-0">
          <Outlet />
        </main>

        <div className="lg:hidden">
          <BottomNav />
        </div>
      </div>
    </div>
  );
}
