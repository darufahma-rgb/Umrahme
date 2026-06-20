import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ritualSteps, TOTAL_STEPS } from '../data/ritualSteps';
import { doaById } from '../data/doa';
import { IconBack, IconReset, IconCheck, IconChevron } from '../components/icons';

const STORAGE = 'umrahme.navigator';

function loadStep(): number {
  const v = Number(localStorage.getItem(STORAGE));
  return Number.isFinite(v) && v >= 0 ? Math.min(v, TOTAL_STEPS) : 0;
}

function saveStep(n: number) {
  localStorage.setItem(STORAGE, String(n));
}

// ── Doa inline ────────────────────────────────
function DoaInline({ doaId }: { doaId: string }) {
  const doa = doaById(doaId);
  if (!doa) return null;
  return (
    <div className="rounded-2xl border border-ink-800/60 bg-ink-900/60 px-4 py-4">
      {doa.perluVerifikasi ? (
        <div className="mb-2.5 flex items-center gap-1.5 rounded-xl border border-gold-400/20 bg-gold-400/5 px-3 py-2">
          <span className="text-[10px] leading-relaxed text-gold-400/80">
            ⚠ Konten ini perlu verifikasi ulama sebelum digunakan secara resmi.
          </span>
        </div>
      ) : null}
      <p className="font-mono text-[10px] uppercase tracking-widest text-gold-400">
        {doa.judul}
      </p>
      {doa.waktu ? (
        <p className="mt-0.5 text-[11px] leading-relaxed text-mute-500">{doa.waktu}</p>
      ) : null}
      <p
        className="mt-3 font-arab text-2xl leading-loose text-gold-400"
        dir="rtl"
        lang="ar"
      >
        {doa.arab}
      </p>
      <p className="mt-2 text-[13px] italic leading-relaxed text-mute-500">{doa.latin}</p>
      <Link
        to={`/doa/${doa.id}`}
        className="mt-2.5 flex items-center gap-1 text-[12px] font-medium text-rose-400/80 hover:text-rose-400"
      >
        Baca artinya & dalil <IconChevron className="h-3 w-3" />
      </Link>
    </div>
  );
}

// ── Overlay peta semua tahap ──────────────────
function PetaOverlay({
  currentIdx,
  onClose,
  onJump,
}: {
  currentIdx: number;
  onClose: () => void;
  onJump: (idx: number) => void;
}) {
  const selesai = currentIdx >= TOTAL_STEPS;
  return (
    <div className="fixed inset-0 z-50 flex items-end bg-ink-950/70 backdrop-blur-sm lg:items-center lg:justify-center">
      <div className="w-full max-h-[85vh] overflow-y-auto rounded-t-3xl border-t border-ink-800 bg-ink-900 px-5 pb-10 pt-5 motion-safe:animate-fade-up lg:max-w-md lg:rounded-3xl lg:border lg:border-ink-800">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-parchment-100">
            Semua Tahap Umrah
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-ink-800 px-3 py-1 text-xs text-mute-500 active:bg-ink-800"
          >
            Tutup
          </button>
        </div>
        <div className="space-y-1.5">
          {ritualSteps.map((step, idx) => {
            const done = selesai || idx < currentIdx;
            const active = !selesai && idx === currentIdx;
            const locked = !selesai && idx > currentIdx;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => !locked && onJump(idx)}
                disabled={locked}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${
                  active
                    ? 'border border-rose-600/40 bg-rose-600/10'
                    : done
                      ? 'opacity-60 hover:opacity-100 hover:bg-ink-800/30'
                      : 'opacity-30 cursor-not-allowed'
                }`}
              >
                <span
                  className={`flex h-7 w-7 flex-none items-center justify-center rounded-full border text-[11px] font-mono ${
                    done
                      ? 'border-gold-400/50 bg-gold-400/10 text-gold-400'
                      : active
                        ? 'border-rose-600/60 bg-rose-600/20 text-rose-400'
                        : 'border-ink-800 text-mute-500'
                  }`}
                >
                  {done ? <IconCheck className="h-3.5 w-3.5" /> : step.urutan}
                </span>
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-[14px] font-medium leading-snug ${
                      active ? 'text-parchment-100' : done ? 'text-parchment-100' : 'text-mute-500'
                    }`}
                  >
                    {step.judul}
                  </p>
                  {active ? (
                    <p className="mt-0.5 font-mono text-[9px] uppercase tracking-widest text-rose-400">
                      Sedang berjalan
                    </p>
                  ) : null}
                </div>
                {done ? (
                  <IconChevron className="h-3.5 w-3.5 flex-none -rotate-90 text-mute-500/50" />
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Konfirmasi reset ──────────────────────────
function ResetOverlay({
  onConfirm,
  onCancel,
}: {
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end bg-ink-950/70 backdrop-blur-sm lg:items-center lg:justify-center">
      <div className="w-full rounded-t-3xl border-t border-ink-800 bg-ink-900 p-6 pb-8 motion-safe:animate-fade-up lg:max-w-sm lg:rounded-3xl lg:border">
        <h3 className="font-display text-xl font-semibold text-parchment-100">
          Reset Navigator?
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-mute-500">
          Semua progres akan dihapus dan kembali ke tahap pertama. Gunakan jika ingin memulai umrah dari awal (mis. umrah sunnah kedua).
        </p>
        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="min-h-[48px] flex-1 rounded-xl border border-ink-800 font-medium text-parchment-100 active:scale-[0.99]"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="min-h-[48px] flex-1 rounded-xl bg-rose-600 font-semibold text-parchment-100 active:scale-[0.99]"
          >
            Ya, reset
          </button>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════
// Halaman utama: Ritual Navigator
// ════════════════════════════════════════════════
export default function RitualNavigator() {
  const navigate = useNavigate();
  const [stepIdx, setStepIdx] = useState<number>(() => loadStep());
  const [showPeta, setShowPeta] = useState(false);
  const [showReset, setShowReset] = useState(false);

  useEffect(() => {
    saveStep(stepIdx);
  }, [stepIdx]);

  const selesai = stepIdx >= TOTAL_STEPS;
  const step = selesai ? null : ritualSteps[stepIdx];
  const isLast = stepIdx === TOTAL_STEPS - 1;

  function maju() {
    setStepIdx((i) => i + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function mundur() {
    setStepIdx((i) => Math.max(0, i - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function reset() {
    setStepIdx(0);
    setShowReset(false);
    setShowPeta(false);
  }

  function jumpTo(idx: number) {
    if (idx <= stepIdx || selesai) {
      setStepIdx(idx);
      setShowPeta(false);
    }
  }

  // ── Layar selesai ────────────────────────────
  if (selesai) {
    return (
      <div className="flex min-h-[calc(100vh-7rem)] flex-col lg:min-h-screen lg:items-center lg:justify-center">
        <div className="w-full lg:max-w-sm">
          {/* Chrome */}
          <div
            className="flex items-center justify-between px-4 pt-4"
            style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}
          >
            <button
              type="button"
              onClick={() => navigate(-1)}
              aria-label="Kembali"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-800 bg-ink-900 text-parchment-100 active:scale-95"
            >
              <IconBack className="h-5 w-5" />
            </button>
            <span />
          </div>

          {/* Konten selesai */}
          <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 text-center motion-safe:animate-fade-up">
            <div className="flex h-24 w-24 items-center justify-center rounded-full border border-gold-400/50 bg-ink-900 text-gold-400">
              <IconCheck className="h-12 w-12" />
            </div>
            <p className="mt-6 font-mono text-xs uppercase tracking-widest text-gold-400">
              10 dari 10 tahap selesai
            </p>
            <h1 className="mt-2 font-display text-4xl font-semibold text-parchment-100">
              Umrah Selesai
            </h1>
            <p className="mt-3 max-w-[30ch] text-pretty text-[15px] leading-relaxed text-mute-500">
              Alhamdulillah — semoga ibadah Anda diterima Allah dan menjadi umrah yang mabrur.
            </p>

            <Link
              to="/profil/sertifikat"
              className="mt-8 flex min-h-[64px] w-full max-w-xs items-center justify-center gap-2 rounded-2xl bg-rose-600 text-[17px] font-semibold text-parchment-100 active:scale-[0.99]"
            >
              Lihat Sertifikat Digital <IconChevron className="h-5 w-5" />
            </Link>

            <Link
              to="/ibadah"
              className="mt-3 flex min-h-[48px] w-full max-w-xs items-center justify-center rounded-xl border border-ink-800 text-sm text-mute-500 active:scale-[0.99]"
            >
              Kembali ke Ibadah
            </Link>

            <button
              type="button"
              onClick={() => setShowReset(true)}
              className="mt-5 font-mono text-xs uppercase tracking-wider text-mute-500/60 underline-offset-4 hover:underline"
            >
              Mulai ulang (umrah sunnah)
            </button>
          </div>
        </div>

        {showReset ? (
          <ResetOverlay onConfirm={reset} onCancel={() => setShowReset(false)} />
        ) : null}
      </div>
    );
  }

  // ── Layar tahap aktif ────────────────────────
  return (
    <div className="flex min-h-[calc(100vh-7rem)] flex-col lg:min-h-screen lg:items-center lg:justify-start">
      <div className="w-full lg:max-w-lg">
        {/* Chrome atas */}
        <div
          className="flex items-center justify-between px-4 pt-4"
          style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}
        >
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Kembali ke Ibadah"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-800 bg-ink-900 text-parchment-100 active:scale-95"
          >
            <IconBack className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowPeta(true)}
              className="rounded-full border border-ink-800 px-3 py-2 font-mono text-[11px] uppercase tracking-wider text-mute-500 active:scale-95"
            >
              Lihat semua
            </button>
            <button
              type="button"
              onClick={() => setShowReset(true)}
              aria-label="Reset Navigator"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-800 text-mute-500 active:scale-95"
            >
              <IconReset className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Konten tahap */}
        <div className="px-5 pb-6 pt-4 lg:px-8">
          {/* Progress */}
          <div className="mb-5">
            <div className="mb-2 flex items-center justify-between">
              <p className="font-mono text-[11px] uppercase tracking-widest text-rose-400">
                Tahap {step!.urutan} dari {TOTAL_STEPS}
              </p>
              <p className="font-mono text-[11px] text-mute-500">
                {TOTAL_STEPS - step!.urutan} lagi
              </p>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-ink-800">
              <div
                className="h-full rounded-full bg-rose-600 transition-all duration-500"
                style={{ width: `${((stepIdx) / TOTAL_STEPS) * 100}%` }}
              />
            </div>

            {/* Dot indikator */}
            <div className="mt-2.5 flex items-center gap-1.5">
              {ritualSteps.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 flex-1 rounded-full transition-colors ${
                    i < stepIdx
                      ? 'bg-rose-400/60'
                      : i === stepIdx
                        ? 'bg-rose-400'
                        : 'bg-ink-800'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Kartu tahap aktif */}
          <div className="rounded-2xl border border-ink-800/60 bg-ink-900/50 px-5 py-5">
            <h1 className="font-display text-3xl font-semibold leading-tight text-parchment-100">
              {step!.judul}
            </h1>
            <p className="mt-3 text-[15px] leading-relaxed text-parchment-100/80">
              {step!.deskripsiSingkat}
            </p>

            {/* Catatan penting */}
            {step!.catatanPenting ? (
              <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-gold-400/20 bg-gold-400/5 px-3.5 py-3">
                <span className="mt-0.5 text-[14px] text-gold-400">⚑</span>
                <p className="text-[13px] leading-relaxed text-gold-400/90">
                  {step!.catatanPenting}
                </p>
              </div>
            ) : null}
          </div>

          {/* Doa terkait */}
          {step!.doaTerkaitId ? (
            <div className="mt-3">
              <DoaInline doaId={step!.doaTerkaitId} />
            </div>
          ) : null}

          {/* Tombol buka fitur terkait */}
          {step!.linkKeFitur ? (
            <Link
              to={step!.linkKeFitur}
              className="mt-3 flex min-h-[52px] w-full items-center justify-between rounded-xl border border-rose-600/30 bg-rose-600/8 px-5 text-[15px] font-medium text-rose-400 active:scale-[0.99]"
            >
              <span>{step!.linkKeFiturLabel ?? 'Buka fitur terkait'}</span>
              <IconChevron className="h-4 w-4 flex-none" />
            </Link>
          ) : null}
        </div>

        {/* Tombol navigasi — sticky bawah */}
        <div
          className="sticky bottom-0 border-t border-ink-800/50 bg-ink-950/95 px-5 py-4 backdrop-blur-sm"
          style={{ paddingBottom: 'max(1rem, env(safe-area-inset-bottom))' }}
        >
          <button
            type="button"
            onClick={maju}
            className="flex min-h-[64px] w-full items-center justify-center gap-2 rounded-2xl bg-rose-600 text-[17px] font-semibold text-parchment-100 active:scale-[0.99]"
          >
            {isLast ? 'Selesaikan Umrah' : 'Tahap Selanjutnya'}
            <IconChevron className="h-5 w-5" />
          </button>

          {stepIdx > 0 ? (
            <button
              type="button"
              onClick={mundur}
              className="mt-2.5 flex w-full items-center justify-center gap-1.5 py-2 font-mono text-[11px] uppercase tracking-wider text-mute-500 active:text-parchment-100"
            >
              <IconChevron className="h-3.5 w-3.5 rotate-180" /> Kembali ke tahap sebelumnya
            </button>
          ) : null}
        </div>
      </div>

      {/* Overlay peta semua tahap */}
      {showPeta ? (
        <PetaOverlay
          currentIdx={stepIdx}
          onClose={() => setShowPeta(false)}
          onJump={jumpTo}
        />
      ) : null}

      {/* Overlay konfirmasi reset */}
      {showReset ? (
        <ResetOverlay onConfirm={reset} onCancel={() => setShowReset(false)} />
      ) : null}
    </div>
  );
}
