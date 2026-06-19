import { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/PageHeader';
import EmptyState from '../components/EmptyState';
import { IconSertifikat, IconDownload, IconShare } from '../components/icons';

function nomorSertifikat(nomorJamaah: string): string {
  const tahun = new Date().getFullYear();
  const seed = nomorJamaah.replace(/\D/g, '').slice(-4) || '0000';
  return `UMR-CERT-${tahun}-${seed}`;
}

const tanggalSekarang = new Date().toLocaleDateString('id-ID', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

export default function Sertifikat() {
  const { jamaah, setFase } = useAuth();
  const certRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);
  if (!jamaah) return null;

  const selesai = jamaah.fase === 'selesai';

  if (!selesai) {
    return (
      <div>
        <PageHeader title="Sertifikat" eyebrow="Profil" backTo="/profil" />
        <EmptyState
          icon={<IconSertifikat className="h-7 w-7" />}
          title="Sertifikat belum tersedia"
          desc="Sertifikat akan terbit setelah seluruh rangkaian ibadah umrah Anda selesai. Selesaikan tawaf, sa'i, dan tahallul terlebih dahulu."
          action={
            <button
              type="button"
              onClick={() => setFase('selesai')}
              className="min-h-[48px] rounded-xl bg-rose-600 px-6 font-semibold text-parchment-100 shadow-glow active:scale-[0.99]"
            >
              Tandai Umrah Selesai
            </button>
          }
        />
        <p className="px-8 text-center text-[11px] leading-relaxed text-mute-500">
          (Tombol untuk demo. Pada versi final, sertifikat terbit otomatis setelah ibadah
          terkonfirmasi selesai.)
        </p>
      </div>
    );
  }

  async function unduh() {
    if (!certRef.current) return;
    setBusy(true);
    try {
      const dataUrl = await toPng(certRef.current, {
        pixelRatio: 2,
        backgroundColor: '#0D0509',
      });
      const a = document.createElement('a');
      a.download = `Sertifikat-Umrah-${jamaah!.nama.replace(/\s+/g, '-')}.png`;
      a.href = dataUrl;
      a.click();
    } catch {
      /* abaikan kegagalan render */
    } finally {
      setBusy(false);
    }
  }

  async function bagikan() {
    if (!certRef.current) return;
    setBusy(true);
    try {
      const dataUrl = await toPng(certRef.current, { pixelRatio: 2, backgroundColor: '#0D0509' });
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], 'sertifikat-umrah.png', { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: 'Sertifikat Umrah' });
      } else {
        await unduh();
      }
    } catch {
      /* dibatalkan / tidak didukung */
    } finally {
      setBusy(false);
    }
  }

  const certCard = (
    <div
      ref={certRef}
      className="relative overflow-hidden rounded-3xl bg-ink-950 px-7 py-9 animate-fade-up"
      style={{
        backgroundImage:
          'radial-gradient(120% 60% at 50% 0%, rgba(212,162,78,0.10), rgba(13,5,9,0) 60%)',
      }}
    >
      <div className="pointer-events-none absolute inset-3 rounded-2xl border border-gold-400/40" />
      <div className="pointer-events-none absolute inset-[18px] rounded-xl border border-gold-400/15" />
      {['left-2 top-2', 'right-2 top-2', 'left-2 bottom-2', 'right-2 bottom-2'].map((p) => (
        <span
          key={p}
          className={`pointer-events-none absolute ${p} h-2 w-2 rotate-45 bg-gold-400/70`}
        />
      ))}

      <div className="relative text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold-400">
          Sertifikat Pelaksanaan
        </p>
        <h2 className="mt-1.5 font-display text-2xl font-semibold text-parchment-100">
          Ibadah Umrah
        </h2>

        <div className="mx-auto my-5 flex items-center justify-center gap-3">
          <span className="h-px w-10 bg-gold-400/40" />
          <span className="h-1.5 w-1.5 rotate-45 bg-gold-400/70" />
          <span className="h-px w-10 bg-gold-400/40" />
        </div>

        <p className="text-[11px] uppercase tracking-widest text-mute-500">
          Dengan ini menerangkan bahwa
        </p>
        <p className="mt-2 font-display text-3xl font-semibold leading-tight text-parchment-100">
          {jamaah.nama}
        </p>
        <p className="mt-3 max-w-[34ch] mx-auto text-pretty text-sm leading-relaxed text-mute-500">
          telah menunaikan rangkaian ibadah umrah ke Baitullah Al-Haram dengan penuh khusyuk.
          Semoga menjadi umrah yang mabrur.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3 text-left">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-gold-400/80">
              Tanggal
            </p>
            <p className="mt-0.5 text-sm text-parchment-100">{tanggalSekarang}</p>
          </div>
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-gold-400/80">
              No. Sertifikat
            </p>
            <p className="mt-0.5 font-mono text-sm text-parchment-100">
              {nomorSertifikat(jamaah.nomorJamaah)}
            </p>
          </div>
        </div>

        <div className="mt-6 border-t border-ink-800 pt-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-mute-500">
            Diselenggarakan oleh
          </p>
          <p className="mt-0.5 font-display text-base font-semibold text-parchment-100">
            {jamaah.travel}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <PageHeader title="Sertifikat Umrah" eyebrow="Profil" backTo="/profil" />

      {/* ===================== MOBILE (< lg) ===================== */}
      <div className="lg:hidden px-5 pt-5">
        <p className="mb-4 text-center font-arab text-2xl leading-loose text-gold-400" dir="rtl">
          تَقَبَّلَ اللّٰهُ مِنَّا وَمِنْكُمْ
        </p>
        {certCard}
        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={unduh}
            disabled={busy}
            className="flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-xl bg-rose-600 font-semibold text-parchment-100 shadow-glow active:scale-[0.99] disabled:opacity-60"
          >
            <IconDownload className="h-5 w-5" /> Unduh PNG
          </button>
          <button
            type="button"
            onClick={bagikan}
            disabled={busy}
            className="flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-xl border border-ink-800 font-medium text-parchment-100 active:scale-[0.99] disabled:opacity-60"
          >
            <IconShare className="h-5 w-5" /> Bagikan
          </button>
        </div>
        {busy ? (
          <p className="mt-3 text-center font-mono text-[11px] uppercase tracking-wider text-mute-500">
            Menyiapkan gambar…
          </p>
        ) : null}
      </div>

      {/* ===================== DESKTOP (≥ lg) ===================== */}
      <div className="hidden lg:block px-8 py-8 max-w-5xl mx-auto">
        <p className="mb-6 text-center font-arab text-3xl leading-loose text-gold-400" dir="rtl">
          تَقَبَّلَ اللّٰهُ مِنَّا وَمِنْكُمْ
        </p>

        <div className="grid grid-cols-[1fr_300px] gap-8 items-start">
          {/* Sertifikat */}
          <div>{certCard}</div>

          {/* Panel info samping */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-gold-400/20 bg-gold-400/5 px-5 py-5">
              <p className="font-mono text-[10px] uppercase tracking-widest text-gold-400 mb-3">
                Informasi Sertifikat
              </p>
              <div className="space-y-4">
                <div>
                  <p className="text-[11px] text-mute-500 uppercase tracking-wider font-mono">
                    Nama
                  </p>
                  <p className="mt-0.5 text-[15px] font-semibold text-parchment-100">
                    {jamaah.nama}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-mute-500 uppercase tracking-wider font-mono">
                    No. Jamaah
                  </p>
                  <p className="mt-0.5 font-mono text-sm text-parchment-100">
                    {jamaah.nomorJamaah}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-mute-500 uppercase tracking-wider font-mono">
                    No. Sertifikat
                  </p>
                  <p className="mt-0.5 font-mono text-sm text-parchment-100">
                    {nomorSertifikat(jamaah.nomorJamaah)}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] text-mute-500 uppercase tracking-wider font-mono">
                    Tanggal
                  </p>
                  <p className="mt-0.5 text-sm text-parchment-100">{tanggalSekarang}</p>
                </div>
                <div>
                  <p className="text-[11px] text-mute-500 uppercase tracking-wider font-mono">
                    Travel
                  </p>
                  <p className="mt-0.5 text-sm text-parchment-100">{jamaah.travel}</p>
                </div>
              </div>
            </div>

            {/* Aksi */}
            <button
              type="button"
              onClick={unduh}
              disabled={busy}
              className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-rose-600 font-semibold text-parchment-100 shadow-glow transition active:scale-[0.99] disabled:opacity-60"
            >
              <IconDownload className="h-5 w-5" /> Unduh PNG
            </button>
            <button
              type="button"
              onClick={bagikan}
              disabled={busy}
              className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl border border-ink-800 font-medium text-parchment-100 transition hover:border-ink-700 active:scale-[0.99] disabled:opacity-60"
            >
              <IconShare className="h-5 w-5" /> Bagikan
            </button>

            {busy ? (
              <p className="text-center font-mono text-[11px] uppercase tracking-wider text-mute-500">
                Menyiapkan gambar…
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
