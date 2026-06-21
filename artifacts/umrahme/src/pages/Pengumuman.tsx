import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getAllAnnouncements } from '../data/travelCompanion';
import { IconChevron } from '../components/icons';

function IconBell({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function formatRelativeTime(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 60) return `${minutes} menit lalu`;
  if (hours < 24) return `${hours} jam lalu`;
  return `${days} hari lalu`;
}

export default function Pengumuman() {
  const { tenant } = useAuth();
  const announcements = getAllAnnouncements(tenant?.id);

  return (
    <div className="min-h-screen bg-canvas">

      {/* ───── MOBILE ───── */}
      <div className="lg:hidden">
        {/* Header */}
        <header
          className="px-5 pb-5"
          style={{ paddingTop: 'max(2.5rem, env(safe-area-inset-top))' }}
        >
          <Link to="/beranda" className="inline-flex items-center gap-1 mb-4 text-primary font-mono text-[10px] uppercase tracking-wider">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3 w-3 rotate-180">
              <path d="M9 18l6-6-6-6" />
            </svg>
            Kembali
          </Link>
          <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-primary mb-1">Dari Travel</p>
          <h1
            className="font-display font-bold text-ink"
            style={{ fontSize: 'clamp(26px, 7vw, 32px)', letterSpacing: '-0.5px', lineHeight: 1 }}
          >
            Pengumuman
          </h1>
          <p className="mt-1.5 text-[11px] text-charcoal">
            Informasi & arahan terbaru dari {tenant?.nama_travel ?? 'travel Anda'}.
          </p>
        </header>

        {/* List */}
        <section className="px-4 pb-8 space-y-3">
          {announcements.length === 0 && (
            <div className="rounded-2xl border border-hairline bg-white p-8 text-center shadow-drop-card">
              <IconBell className="h-8 w-8 mx-auto text-ash mb-3" />
              <p className="text-[13px] font-semibold text-ink">Belum ada pengumuman</p>
              <p className="mt-1 text-[11px] text-charcoal">Pengumuman dari travel akan tampil di sini.</p>
            </div>
          )}

          {announcements.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-2xl border shadow-drop-card"
              style={{
                background: item.important ? 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)' : '#ffffff',
                borderColor: item.important ? 'rgba(212,162,78,0.28)' : 'rgba(0,0,0,0.07)',
              }}
            >
              <div className="p-4">
                {/* Top row */}
                <div className="flex items-start gap-3">
                  <div
                    className="flex h-9 w-9 flex-none items-center justify-center rounded-xl"
                    style={{
                      background: item.important ? 'rgba(212,162,78,0.15)' : 'rgba(14,165,233,0.08)',
                      border: `1px solid ${item.important ? 'rgba(212,162,78,0.25)' : 'rgba(14,165,233,0.15)'}`,
                    }}
                  >
                    <IconBell className={`h-4 w-4 ${item.important ? 'text-[#a07828]' : 'text-primary'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="rounded-full px-2 py-0.5 font-mono text-[7.5px] font-bold uppercase tracking-[0.15em]"
                        style={item.important
                          ? { background: 'rgba(212,162,78,0.18)', color: '#a07828' }
                          : { background: 'rgba(14,165,233,0.12)', color: '#0284c7' }
                        }
                      >
                        {item.label}
                      </span>
                      <span className="font-mono text-[7.5px] uppercase tracking-[0.12em] text-mute">
                        {formatRelativeTime(item.publishedAt)}
                      </span>
                    </div>
                    <h3 className="mt-1.5 text-[14px] font-bold leading-snug text-ink">{item.title}</h3>
                  </div>
                </div>

                {/* Content */}
                <p className="mt-3 text-[12px] leading-relaxed text-charcoal pl-12">
                  {item.content}
                </p>
              </div>
            </div>
          ))}
        </section>
      </div>

      {/* ───── DESKTOP ───── */}
      <div className="hidden lg:block px-10 pb-10">
        <header className="pt-10 pb-6">
          <Link to="/beranda" className="inline-flex items-center gap-1 mb-4 text-primary font-mono text-[10px] uppercase tracking-wider">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-3 w-3 rotate-180">
              <path d="M9 18l6-6-6-6" />
            </svg>
            Kembali
          </Link>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary mb-1">Dari Travel</p>
          <h1 className="font-display text-4xl font-bold text-ink" style={{ letterSpacing: '-1px' }}>Pengumuman</h1>
          <p className="mt-1 text-sm text-charcoal">Informasi & arahan terbaru dari {tenant?.nama_travel ?? 'travel Anda'}.</p>
        </header>

        <div className="max-w-2xl space-y-3">
          {announcements.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-2xl border shadow-drop-card"
              style={{
                background: item.important ? 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)' : '#ffffff',
                borderColor: item.important ? 'rgba(212,162,78,0.28)' : 'rgba(0,0,0,0.07)',
              }}
            >
              <div className="p-5">
                <div className="flex items-start gap-3">
                  <div
                    className="flex h-9 w-9 flex-none items-center justify-center rounded-xl"
                    style={{
                      background: item.important ? 'rgba(212,162,78,0.15)' : 'rgba(14,165,233,0.08)',
                      border: `1px solid ${item.important ? 'rgba(212,162,78,0.25)' : 'rgba(14,165,233,0.15)'}`,
                    }}
                  >
                    <IconBell className={`h-4 w-4 ${item.important ? 'text-[#a07828]' : 'text-primary'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className="rounded-full px-2 py-0.5 font-mono text-[7.5px] font-bold uppercase tracking-[0.15em]"
                        style={item.important
                          ? { background: 'rgba(212,162,78,0.18)', color: '#a07828' }
                          : { background: 'rgba(14,165,233,0.12)', color: '#0284c7' }
                        }
                      >
                        {item.label}
                      </span>
                      <span className="font-mono text-[7.5px] uppercase tracking-[0.12em] text-mute">
                        {formatRelativeTime(item.publishedAt)}
                      </span>
                    </div>
                    <h3 className="mt-1.5 text-[15px] font-bold leading-snug text-ink">{item.title}</h3>
                    <p className="mt-2 text-[13px] leading-relaxed text-charcoal">{item.content}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
