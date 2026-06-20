import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { manasikModulList, getModulProgress, type ModulProgress } from '../data/manasikInteraktif';
import { IconChevron } from '../components/icons';

// -----------------------------------------------------------------------
// Ikon buku interaktif
// -----------------------------------------------------------------------
function IconManasik({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <path d="M9 9h6M9 13h4" />
      <circle cx="17" cy="14" r="2.5" />
      <path d="M19 15.5 20.5 17" />
    </svg>
  );
}

// -----------------------------------------------------------------------
// StatusBadge
// -----------------------------------------------------------------------
function StatusBadge({ progress }: { progress: ModulProgress }) {
  if (progress.selesai) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-600/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-rose-400">
        <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
        Selesai
      </span>
    );
  }
  if (progress.partADone) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-gold-400/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-gold-400/80">
        <span className="h-1.5 w-1.5 rounded-full bg-gold-400/60" />
        Sedang Berjalan
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-ink-800/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-mute-500">
      Belum Dimulai
    </span>
  );
}

// -----------------------------------------------------------------------
// Halaman daftar modul
// -----------------------------------------------------------------------
export default function ManasikInteraktif() {
  const [allProgress, setAllProgress] = useState<ModulProgress[]>(() =>
    manasikModulList.map((m) => getModulProgress(m.id))
  );

  // Refresh saat kembali ke halaman ini (dari detail modul)
  useEffect(() => {
    const refresh = () => {
      setAllProgress(manasikModulList.map((m) => getModulProgress(m.id)));
    };
    window.addEventListener('focus', refresh);
    return () => window.removeEventListener('focus', refresh);
  }, []);

  const modulSelesai = allProgress.filter((p) => p.selesai).length;
  const totalModul = manasikModulList.length;
  const persenKeseluruhan = Math.round((modulSelesai / totalModul) * 100);

  return (
    <div className="pb-24">
      <PageHeader title="Manasik Interaktif" eyebrow="Panduan" backTo="/panduan" />

      {/* Intro */}
      <div className="px-5 pt-5">
        <p className="text-[14px] leading-relaxed text-mute-500">
          Pelajari rangkaian umrah secara interaktif — kenali, urutkan, dan uji paham. Cocok untuk jamaah yang baru pertama kali.
        </p>
      </div>

      {/* Progress keseluruhan */}
      <div
        className="mx-5 mt-4 rounded-2xl border border-ink-800/70 px-4 py-4"
        style={{ background: 'linear-gradient(135deg, #18090F 0%, #0D0509 100%)' }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-mute-500">Progress Belajar</p>
            <p className="mt-0.5 text-[14px] font-semibold text-parchment-100">
              {modulSelesai} dari {totalModul} modul selesai
            </p>
          </div>
          <p className="font-display text-[28px] font-semibold text-parchment-100">{persenKeseluruhan}%</p>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-ink-800">
          <div
            className="h-full rounded-full bg-rose-600 transition-all duration-700"
            style={{ width: `${persenKeseluruhan}%` }}
          />
        </div>
        <div className="mt-2.5 flex gap-1.5">
          {manasikModulList.map((m, i) => (
            <div
              key={m.id}
              className={`h-1 flex-1 rounded-full transition-colors ${
                allProgress[i]?.selesai ? 'bg-rose-400' : allProgress[i]?.partADone ? 'bg-gold-400/40' : 'bg-ink-800'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Daftar modul */}
      <div className="mt-5 space-y-3 px-5">
        {manasikModulList.map((modul, i) => {
          const prog = allProgress[i] ?? getModulProgress(modul.id);
          const bagianDone = (prog.partADone ? 1 : 0) + (prog.partBDone ? 1 : 0) + (prog.partCTotal > 0 ? 1 : 0);
          const prevSelesai = i === 0 || allProgress[i - 1]?.selesai;

          return (
            <Link
              key={modul.id}
              to={`/panduan/manasik-interaktif/${modul.id}`}
              className={`block active:scale-[0.99] transition-transform ${!prevSelesai ? 'opacity-60' : ''}`}
            >
              {/* MihrabCard-style: arch gold di atas */}
              <div className="relative overflow-hidden rounded-2xl">
                <svg viewBox="0 0 100 16" preserveAspectRatio="none" className="block w-full h-[20px]" aria-hidden>
                  <path
                    d="M0,16 L0,9 C0,4 24,0.5 50,0.5 C76,0.5 100,4 100,9 L100,16"
                    fill="#18090F"
                    stroke="#D4A24E"
                    strokeWidth="1"
                    strokeOpacity={prog.selesai ? '0.8' : '0.45'}
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
                <div
                  className="-mt-px rounded-b-2xl px-5 pb-5 pt-3"
                  style={{
                    background: prog.selesai
                      ? 'radial-gradient(ellipse at 90% 0%, rgba(194,24,91,0.07) 0%, transparent 50%), #18090F'
                      : '#18090F',
                  }}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-mute-500/70">
                          Modul {modul.urutan}
                        </p>
                        <StatusBadge progress={prog} />
                      </div>
                      <h2 className="mt-1 font-display text-xl font-semibold text-parchment-100">
                        {modul.judul}
                      </h2>
                      <p className="mt-0.5 text-[13px] text-mute-500">{modul.subjudul}</p>
                    </div>
                    <IconChevron className="h-4 w-4 flex-none text-mute-500 mt-1" />
                  </div>

                  {/* Progress bagian A/B/C */}
                  <div className="mt-4 flex items-center gap-3">
                    {[
                      { label: 'Kenali', done: prog.partADone },
                      { label: 'Urutkan', done: prog.partBDone },
                      { label: 'Uji Paham', done: prog.partCTotal > 0 },
                    ].map(({ label, done }) => (
                      <div key={label} className="flex items-center gap-1.5">
                        <div
                          className={`h-1.5 w-1.5 rounded-full ${done ? 'bg-rose-400' : 'bg-ink-800'}`}
                        />
                        <span className={`font-mono text-[9px] uppercase tracking-wider ${done ? 'text-rose-400/80' : 'text-mute-500/50'}`}>
                          {label}
                        </span>
                      </div>
                    ))}
                    <span className="ml-auto font-mono text-[10px] text-mute-500">
                      {bagianDone}/3
                    </span>
                  </div>

                  {/* Skor kuis jika sudah selesai */}
                  {prog.selesai && prog.partCTotal > 0 && (
                    <p className="mt-2 font-mono text-[11px] text-rose-400/80">
                      Skor kuis: {prog.partCScore}/{prog.partCTotal} benar
                    </p>
                  )}

                  {/* Unlock hint */}
                  {!prevSelesai && (
                    <p className="mt-2 font-mono text-[10px] text-mute-500/60">
                      ↑ Selesaikan modul sebelumnya dulu
                    </p>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Footer note */}
      <p className="mt-5 px-5 text-center text-[11px] leading-relaxed text-mute-500/60">
        Manasik interaktif adalah pelengkap belajar — bukan pengganti panduan tata cara atau bimbingan ustaz.
      </p>
    </div>
  );
}
