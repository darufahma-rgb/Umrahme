import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpenCheck, ChevronRight, CirclePlay, Footprints, RotateCcw, ShieldCheck } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import {
  getModulProgress,
  manasikModulList,
  syncManasikFromCloud,
  type ModulProgress,
} from '../data/manasikInteraktif';
import { useAuth } from '../context/AuthContext';

function getProgressPercent(progress: ModulProgress) {
  const kenali = progress.partADone ? 1 : 0;
  const urutkan = progress.partBDone ? 1 : 0;
  const simulasi = progress.partSimulasiTotal > 0
    ? progress.partSimulasiScore / progress.partSimulasiTotal
    : 0;
  const kuis = progress.partCTotal > 0 ? progress.partCScore / progress.partCTotal : 0;
  return Math.round(((kenali + urutkan + simulasi + kuis) / 4) * 100);
}

function getReadinessLabel(percent: number) {
  if (percent >= 85) return 'Siap dipraktikkan';
  if (percent >= 55) return 'Teruskan latihan';
  if (percent > 0) return 'Sedang membangun dasar';
  return 'Mulai dari dasar';
}

export default function ManasikInteraktif() {
  const { jamaah, tenant } = useAuth();
  const tenantId = tenant?.id;
  const nomor = jamaah?.nomorJamaah;
  const [allProgress, setAllProgress] = useState<ModulProgress[]>(() =>
    manasikModulList.map((modul) => getModulProgress(modul.id)),
  );

  const refreshProgress = () => {
    setAllProgress(manasikModulList.map((modul) => getModulProgress(modul.id)));
  };

  useEffect(() => {
    if (!tenantId || !nomor) return;
    syncManasikFromCloud(tenantId, nomor).then(refreshProgress).catch(() => {});
  }, [tenantId, nomor]);

  useEffect(() => {
    window.addEventListener('focus', refreshProgress);
    return () => window.removeEventListener('focus', refreshProgress);
  }, []);

  const modulePercents = useMemo(() => allProgress.map(getProgressPercent), [allProgress]);
  const readiness = Math.round(
    modulePercents.reduce((total, value) => total + value, 0) / manasikModulList.length,
  );
  const completedModules = allProgress.filter((progress) => progress.selesai).length;
  const allComplete = completedModules === manasikModulList.length;
  const nextModuleIndex = Math.max(0, allProgress.findIndex((progress) => !progress.selesai));
  const nextModule = manasikModulList[nextModuleIndex] ?? manasikModulList[0];
  const hasStarted = allProgress.some((progress) => progress.partADone);

  const quickPractice = [
    { to: '/ibadah/tawaf', label: 'Simulasi Tawaf', detail: 'Counter 7 putaran', icon: RotateCcw },
    { to: '/ibadah/sai', label: "Simulasi Sa'i", detail: 'Counter 7 lintasan', icon: Footprints },
    { to: '/doa', label: 'Hafalan Doa', detail: 'Bacaan tiap rangkaian', icon: BookOpenCheck },
  ];

  return (
    <div className="pb-28">
      <PageHeader title="Manasik Interaktif" eyebrow="Pusat Latihan" backTo="/panduan" />

      <section className="relative overflow-hidden border-b border-hairline bg-ink text-white">
        <img
          src="/lokasi/masjidil-haram.jpg"
          alt="Masjidil Haram"
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-ink/60" aria-hidden />
        <div className="relative px-5 py-7">
          <div className="flex items-start justify-between gap-5">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/65">
                Kesiapan Manasik
              </p>
              <p className="mt-2 text-[18px] font-bold leading-snug">{getReadinessLabel(readiness)}</p>
              <p className="mt-1 text-[12px] text-white/70">
                {completedModules} dari {manasikModulList.length} modul selesai
              </p>
            </div>
            <div className="flex h-20 w-20 flex-none items-center justify-center rounded-full border-4 border-white/25 bg-black/20">
              <span className="text-2xl font-extrabold">{readiness}%</span>
            </div>
          </div>

          <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/20">
            <div className="h-full rounded-full bg-gold transition-all duration-700" style={{ width: `${readiness}%` }} />
          </div>

          <Link
            to={`/panduan/manasik-interaktif/${nextModule.id}`}
            className="mt-5 flex min-h-12 items-center justify-between rounded-md bg-white px-4 py-3 text-ink active:scale-[0.99]"
          >
            <div className="flex items-center gap-3">
              <CirclePlay className="h-5 w-5 text-primary" aria-hidden />
              <div>
                <p className="text-[11px] font-medium text-mute">
                  {allComplete ? 'Ulangi latihan' : hasStarted ? 'Lanjutkan latihan' : 'Mulai latihan'}
                </p>
                <p className="text-[14px] font-bold">{nextModule.judul}</p>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-mute" aria-hidden />
          </Link>
        </div>
      </section>

      <section className="px-5 pt-6">
        <div className="mb-3 flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">Kurikulum</p>
            <h2 className="mt-1 text-xl font-bold text-ink">Empat rangkaian utama</h2>
          </div>
          <p className="text-right text-[11px] leading-snug text-mute">Kenali, urutkan,<br />simulasi, lalu uji</p>
        </div>

        <div className="divide-y divide-hairline border-y border-hairline">
          {manasikModulList.map((modul, index) => {
            const progress = allProgress[index] ?? getModulProgress(modul.id);
            const percent = modulePercents[index] ?? 0;
            const unlocked = index === 0 || allProgress[index - 1]?.selesai;
            const row = (
              <div className={`flex min-h-[92px] items-center gap-4 py-4 ${unlocked ? '' : 'opacity-45'}`}>
                <div className="relative flex h-12 w-12 flex-none items-center justify-center rounded-full border border-hairline bg-white">
                  <span className="text-sm font-bold text-ink">{String(index + 1).padStart(2, '0')}</span>
                  {progress.selesai && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-badge-success text-white">
                      <ShieldCheck className="h-3 w-3" aria-hidden />
                    </span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-[15px] font-bold text-ink">{modul.judul}</h3>
                      <p className="mt-0.5 text-[12px] text-charcoal">{unlocked ? modul.subjudul : 'Selesaikan modul sebelumnya'}</p>
                    </div>
                    {unlocked && <ChevronRight className="h-5 w-5 flex-none text-ash" aria-hidden />}
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-bone">
                      <div className="h-full rounded-full bg-primary" style={{ width: `${percent}%` }} />
                    </div>
                    <span className="w-9 text-right text-[10px] font-semibold text-mute">{percent}%</span>
                  </div>
                </div>
              </div>
            );

            return unlocked ? (
              <Link key={modul.id} to={`/panduan/manasik-interaktif/${modul.id}`} className="block active:bg-surface-bone/50">
                {row}
              </Link>
            ) : (
              <div key={modul.id} aria-disabled="true">{row}</div>
            );
          })}
        </div>
      </section>

      <section className="px-5 pt-7">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">Latihan Cepat</p>
        <h2 className="mt-1 text-xl font-bold text-ink">Ulangi sampai terbiasa</h2>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {quickPractice.map(({ to, label, detail, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="flex min-h-[126px] flex-col justify-between rounded-md border border-hairline bg-surface-card p-3 shadow-drop-card active:scale-[0.98]"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Icon className="h-4 w-4" aria-hidden />
              </span>
              <span>
                <span className="block text-[12px] font-bold leading-snug text-ink">{label}</span>
                <span className="mt-1 block text-[10px] leading-snug text-mute">{detail}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <p className="px-6 pt-7 text-center text-[11px] leading-relaxed text-ash">
        Materi ini membantu latihan mandiri dan tetap perlu didampingi pembimbing manasik atau ustaz.
      </p>
    </div>
  );
}
