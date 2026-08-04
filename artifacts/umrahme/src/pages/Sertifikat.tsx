import { useRef, useState } from 'react';
import { toPng } from 'html-to-image';
import { useAuth } from '../context/AuthContext';
import PageHeader from '../components/PageHeader';
import EmptyState from '../components/EmptyState';
import { IconSertifikat, IconDownload, IconShare } from '../components/icons';
import { DEFAULT_SERTIFIKAT_LAYOUT, type SertifikatField } from '../lib/supabase';

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

function fontFamilyToCss(f: SertifikatField['fontFamily']): string {
  switch (f) {
    case 'display': return "'Plus Jakarta Sans', sans-serif";
    case 'mono':    return "'Plus Jakarta Sans', sans-serif";
    case 'arab':    return "'Amiri', serif";
    default:        return "'Plus Jakarta Sans', sans-serif";
  }
}

export default function Sertifikat() {
  const { jamaah, tenant } = useAuth();
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
          desc="Sertifikat akan terbit otomatis setelah seluruh tanggal agenda itinerary batch telah berlalu."
        />
      </div>
    );
  }

  const hasTemplate = Boolean(tenant?.sertifikat_template_url);
  const layout = tenant?.sertifikat_layout ?? DEFAULT_SERTIFIKAT_LAYOUT;

  const fieldValue: Record<string, string> = {
    nama:             jamaah.nama,
    nomor:            jamaah.nomorJamaah,
    tanggal:          tanggalSekarang,
    nomor_sertifikat: nomorSertifikat(jamaah.nomorJamaah),
    nama_travel:      tenant?.nama_travel ?? jamaah.travel,
    judul:            'Sertifikat Umrah',
    subjudul:         'Dengan ini menerangkan bahwa',
    keterangan:       'telah menunaikan ibadah umrah ke Baitullah dengan khusyuk',
  };

  async function unduh() {
    if (!certRef.current) return;
    setBusy(true);
    try {
      const dataUrl = await toPng(certRef.current, {
        pixelRatio: 2,
        backgroundColor: '#f7f5f0',
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
      const dataUrl = await toPng(certRef.current, { pixelRatio: 2, backgroundColor: '#f7f5f0' });
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
      className={`relative overflow-hidden animate-fade-up ${hasTemplate ? 'rounded-2xl' : ''}`}
      style={{
        aspectRatio: '210 / 297',
        background: hasTemplate ? 'transparent' : '#f7f5f0',
        containerType: 'inline-size',
      } as React.CSSProperties}
    >
      {/* Background template image */}
      {hasTemplate && (
        <img
          src={tenant!.sertifikat_template_url!}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-contain"
          crossOrigin="anonymous"
        />
      )}

      {/* Overlay gelap tipis supaya teks tetap terbaca */}
      {hasTemplate && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'rgba(0,0,0,0.18)' }}
        />
      )}

      {/* Sertifikat default minimal */}
      {!hasTemplate && (
        <div className="pointer-events-none absolute inset-[4%] border border-black/15" />
      )}

      {/* Konten teks — layout absolut bila ada template, default bila tidak */}
      {hasTemplate ? (
        layout.fields.filter(f => f.visible).map(f => (
          <div
            key={f.key}
            className="pointer-events-none absolute whitespace-nowrap"
            style={{
              left: `${f.x}%`,
              top: `${f.y}%`,
              transform: `translate(${f.align === 'center' ? '-50%' : f.align === 'right' ? '-100%' : '0'}, -50%)`,
              fontSize: `${f.fontSize / 10}cqw`,
              color: f.color,
              fontWeight: f.bold ? 700 : 400,
              fontFamily: fontFamilyToCss(f.fontFamily),
              textShadow: '0 1px 4px rgba(0,0,0,0.25)',
            }}
          >
            {fieldValue[f.key] ?? ''}
          </div>
        ))
      ) : (
        <div className="relative grid h-full grid-cols-[26%_1fr] px-[9%] py-[10%] text-[#171717]">
          <div className="flex border-r border-black/25 pr-[12%]">
            <p
              className="text-[10cqw] font-extralight leading-none tracking-[-0.08em]"
              style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
            >
              sertifikat
            </p>
          </div>

          <div className="flex min-w-0 flex-col pl-[12%]">
            <p className="text-[2.4cqw] font-semibold uppercase tracking-[0.18em] text-black/55">
              Sertifikat Umrah
            </p>
            <p className="mt-[8%] text-left font-arab text-[3.8cqw] leading-none text-black/80" dir="rtl">
              بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
            </p>
            <h2 className="mt-[10%] text-[5.5cqw] font-bold leading-[1.05] tracking-[-0.05em]">
              Ibadah Umrah
            </h2>

            <div className="mt-[19%]">
              <p className="text-[2.6cqw] leading-relaxed text-black/55">
                Dengan ini menerangkan bahwa
              </p>
              <p
                className="mt-[4%] border-b border-black/40 pb-[3%] text-[4.7cqw] font-extrabold leading-tight tracking-[-0.04em]"
                style={{ color: tenant?.primary_color ?? 'var(--color-primary)' }}
              >
                {jamaah.nama}
              </p>
              <p className="mt-[4%] max-w-[27ch] text-[2.5cqw] leading-relaxed text-black/60">
                telah menunaikan rangkaian ibadah umrah ke Baitullah Al-Haram.
                Semoga Allah SWT menerima amal ibadahnya dan menjadikannya umrah yang mabrur.
              </p>
              <div className="mt-[7%] border-l border-black/25 pl-[5%]">
                <p className="text-left font-arab text-[3.2cqw] leading-relaxed text-black/80" dir="rtl">
                  رَبَّنَا تَقَبَّلْ مِنَّا إِنَّكَ أَنتَ السَّمِيعُ الْعَلِيمُ
                </p>
                <p className="mt-[2%] text-[2cqw] leading-relaxed text-black/45">
                  Ya Allah, terimalah ibadah kami. Sesungguhnya Engkaulah Yang Maha Mendengar lagi Maha Mengetahui.
                </p>
              </div>
            </div>

            <div className="mt-auto flex flex-col items-start gap-[8%] pt-[12%]">
              <div>
                <p className="text-[1.8cqw] font-semibold uppercase tracking-[0.14em] text-black/45">Diselenggarakan oleh</p>
                <p className="mt-[3%] text-[2.7cqw] font-bold leading-tight">{tenant?.nama_travel ?? jamaah.travel}</p>
              </div>
              <div>
                <p className="text-[1.8cqw] uppercase tracking-[0.12em] text-black/45">{tanggalSekarang}</p>
                <p className="mt-[4%] text-[1.8cqw] font-medium tracking-[0.08em] text-black/55">{nomorSertifikat(jamaah.nomorJamaah)}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div>
      <PageHeader title="Sertifikat Umrah" eyebrow="Profil" backTo="/profil" />

      {/* MOBILE (< lg) */}
      <div className="lg:hidden px-5 pt-5 pb-8">
        <p className="mb-4 text-center font-arab text-2xl leading-loose text-gold" dir="rtl">
          تَقَبَّلَ اللّٰهُ مِنَّا وَمِنْكُمْ
        </p>
        {certCard}
        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={unduh}
            disabled={busy}
            className="flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-full bg-primary font-semibold text-on-primary active:scale-[0.99] disabled:opacity-60"
          >
            <IconDownload className="h-5 w-5" /> Unduh PNG
          </button>
          <button
            type="button"
            onClick={bagikan}
            disabled={busy}
            className="flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-full border border-hairline-strong font-medium text-ink active:scale-[0.99] disabled:opacity-60"
          >
            <IconShare className="h-5 w-5" /> Bagikan
          </button>
        </div>
        {busy ? (
          <p className="mt-3 text-center font-mono text-[11px] uppercase tracking-wider text-mute">
            Menyiapkan gambar…
          </p>
        ) : null}
      </div>

      {/* DESKTOP (≥ lg) */}
      <div className="hidden lg:block px-8 py-8 max-w-5xl mx-auto">
        <p className="mb-6 text-center font-arab text-3xl leading-loose text-gold" dir="rtl">
          تَقَبَّلَ اللّٰهُ مِنَّا وَمِنْكُمْ
        </p>

        <div className="grid grid-cols-[1fr_300px] gap-8 items-start">
          <div>{certCard}</div>

          <div className="space-y-4">
            <div className="rounded-md border border-gold/20 bg-gold/5 px-5 py-5">
              <p className="font-mono text-[10px] uppercase tracking-widest text-gold mb-3">
                Informasi Sertifikat
              </p>
              <div className="space-y-4">
                {[
                  { label: 'Nama', value: jamaah.nama },
                  { label: 'No. Jamaah', value: jamaah.nomorJamaah, mono: true },
                  { label: 'No. Sertifikat', value: nomorSertifikat(jamaah.nomorJamaah), mono: true },
                  { label: 'Tanggal', value: tanggalSekarang },
                  { label: 'Travel', value: tenant?.nama_travel ?? jamaah.travel },
                ].map(({ label, value, mono }) => (
                  <div key={label}>
                    <p className="font-mono text-[11px] uppercase tracking-wider text-mute">{label}</p>
                    <p className={`mt-0.5 text-sm text-ink ${mono ? 'font-mono' : ''}`}>{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={unduh}
              disabled={busy}
              className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full bg-primary font-semibold text-on-primary transition active:scale-[0.99] disabled:opacity-60"
            >
              <IconDownload className="h-5 w-5" /> Unduh PNG
            </button>
            <button
              type="button"
              onClick={bagikan}
              disabled={busy}
              className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-full border border-hairline-strong font-medium text-ink transition hover:bg-surface-bone active:scale-[0.99] disabled:opacity-60"
            >
              <IconShare className="h-5 w-5" /> Bagikan
            </button>

            {busy ? (
              <p className="text-center font-mono text-[11px] uppercase tracking-wider text-mute">
                Menyiapkan gambar…
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
