import { useState, type ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import { doaById, kategoriDoaMeta } from '../data/doa';
import PageHeader from '../components/PageHeader';
import MihrabCard from '../components/MihrabCard';
import EmptyState from '../components/EmptyState';
import { IconChevron, IconDoa } from '../components/icons';

function Accordion({
  label,
  children,
  defaultOpen = false,
}: {
  label: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="overflow-hidden rounded-2xl border border-ink-800/70 bg-ink-900/40">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex min-h-[52px] w-full items-center justify-between gap-3 px-4 py-3 text-left"
        aria-expanded={open}
      >
        <span className="font-mono text-[11px] uppercase tracking-widest text-rose-400">
          {label}
        </span>
        <IconChevron
          className={`h-4 w-4 flex-none text-mute-500 transition-transform ${
            open ? 'rotate-90' : ''
          }`}
        />
      </button>
      {open ? (
        <div className="px-4 pb-4 text-[15px] leading-relaxed text-parchment-100/90 animate-fade-up">
          {children}
        </div>
      ) : null}
    </div>
  );
}

export default function DoaDetail() {
  const { id } = useParams();
  const doa = id ? doaById(id) : undefined;

  if (!doa) {
    return (
      <div>
        <PageHeader title="Doa" eyebrow="Kumpulan Doa" backTo="/doa" />
        <EmptyState
          icon={<IconDoa className="h-7 w-7" />}
          title="Doa tidak ditemukan"
          desc="Doa yang Anda cari mungkin telah dipindahkan."
        />
      </div>
    );
  }

  const katMeta = kategoriDoaMeta.find((k) => k.id === doa.kategori);
  const adaBacaan = Boolean(doa.arab || doa.latin || doa.terjemahan);

  return (
    <div>
      <PageHeader
        title={doa.judul}
        eyebrow={katMeta?.judul ?? 'Doa'}
        backTo={`/doa?kategori=${doa.kategori}`}
      />

      <div className="space-y-3 px-5 pt-4">
        {/* BACAAN — prioritas utama: Arab → Latin → Terjemahan */}
        {adaBacaan ? (
          <MihrabCard bodyClassName="px-5 pb-6 pt-3">
            {doa.arab ? (
              <p
                className="text-center font-arab text-[34px] leading-[2] text-gold-400"
                dir="rtl"
              >
                {doa.arab}
              </p>
            ) : null}
            {doa.latin ? (
              <p className="mt-4 text-center text-[15px] italic leading-relaxed text-parchment-100">
                {doa.latin}
              </p>
            ) : null}
            {doa.terjemahan ? (
              <p className="mt-3 text-center text-sm leading-relaxed text-mute-500">
                “{doa.terjemahan}”
              </p>
            ) : null}
          </MihrabCard>
        ) : (
          <div className="rounded-2xl border border-gold-400/30 bg-gold-400/5 px-5 py-6 text-center">
            <p className="font-mono text-[11px] uppercase tracking-widest text-gold-400">
              Konten dalam peninjauan
            </p>
            <p className="mt-2 text-sm leading-relaxed text-parchment-100/90">
              Teks bacaan doa ini belum ditampilkan karena masih perlu diverifikasi oleh
              ustadz sebelum dipublikasikan. Lihat catatan praktik di bawah.
            </p>
          </div>
        )}

        {/* Badge perlu verifikasi */}
        {doa.perluVerifikasi ? (
          <p className="rounded-xl border border-gold-400/25 bg-gold-400/5 px-4 py-2.5 text-center text-xs leading-relaxed text-gold-400/90">
            Sumber masih perlu verifikasi ulama sebelum dijadikan rujukan pasti.
          </p>
        ) : null}

        {/* Detail tambahan — accordion, tidak membanjiri layar pertama */}
        <div className="mt-1 space-y-2.5">
          {doa.arti ? <Accordion label="Arti / Makna">{doa.arti}</Accordion> : null}
          {doa.dalil ? <Accordion label="Dalil & Sumber">{doa.dalil}</Accordion> : null}
          {doa.cara ? <Accordion label="Cara Mengamalkan">{doa.cara}</Accordion> : null}
          {doa.waktu ? <Accordion label="Waktu Membaca">{doa.waktu}</Accordion> : null}
        </div>
      </div>
    </div>
  );
}
