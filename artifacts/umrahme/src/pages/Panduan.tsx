import React from 'react';
import { Link } from 'react-router-dom';
import { IconPanduan, IconPeta, IconManasikInteraktif } from '../components/icons';

type GuideItem = {
  to: string;
  label: string;
  desc: string;
  Icon: React.FC<{ className?: string; style?: React.CSSProperties }>;
};

export default function Panduan() {
  const items: GuideItem[] = [
    {
      to: '/panduan/manasik-interaktif',
      label: 'Manasik Interaktif',
      desc: 'Kenali urutan ibadah dan uji pemahaman Anda secara interaktif.',
      Icon: IconManasikInteraktif,
    },
    {
      to: '/panduan/tata-cara',
      label: 'Tata Cara Umrah',
      desc: "Miqat, ihram, tawaf, sa'i, hingga tahallul.",
      Icon: IconPanduan,
    },
    {
      to: '/panduan/ihram',
      label: 'Panduan Ihram',
      desc: 'Niat, larangan, dan cara memakai ihram.',
      Icon: IconPanduan,
    },
    {
      to: '/panduan/miqat',
      label: 'Panduan Miqat',
      desc: 'Lima titik miqat dan aturan ihram yang perlu diketahui.',
      Icon: IconPeta,
    },
    {
      to: '/panduan/faq-fikih',
      label: 'Tanya Jawab Fikih',
      desc: 'Jawaban untuk kondisi yang sering ditemui jamaah.',
      Icon: IconPanduan,
    },
    {
      to: '/panduan/glosarium',
      label: 'Glosarium Istilah',
      desc: 'Kamus istilah penting selama perjalanan umrah.',
      Icon: IconPanduan,
    },
    {
      to: '/peta',
      label: 'Peta Lokasi',
      desc: 'Masjid dan tempat bersejarah di sekitar perjalanan Anda.',
      Icon: IconPeta,
    },
  ];
  const [modulUtama, ...panduanLain] = items;

  return (
    <div className="mx-auto max-w-5xl px-5 pb-8 pt-8 lg:px-10 lg:pb-12 lg:pt-10">
      <header>
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">Belajar Umrah</p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-[-1px] text-ink lg:text-4xl">Panduan</h1>
        <p className="mt-2 max-w-md text-[14px] leading-relaxed text-charcoal">
          Materi ringkas untuk menemani persiapan dan ibadah Anda.
        </p>
      </header>

      <Link
        to={modulUtama.to}
        className="group mt-6 flex min-h-[170px] flex-col justify-between rounded-xl p-5 text-white transition-transform active:scale-[0.99] lg:min-h-[190px] lg:p-6"
        style={{ background: 'var(--color-primary-deep)' }}
      >
        <div className="flex items-start justify-between gap-4">
          <span className="flex h-11 w-11 items-center justify-center rounded-lg bg-white/15 ring-1 ring-white/20">
            <modulUtama.Icon className="h-5 w-5 text-white" />
          </span>
          <span className="rounded-full bg-white/15 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-white">Mulai di sini</span>
        </div>
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/60">Modul utama</p>
          <h2 className="mt-1 text-[22px] font-extrabold tracking-[-0.5px]">{modulUtama.label}</h2>
          <p className="mt-1.5 max-w-sm text-[13px] leading-relaxed text-white/75">{modulUtama.desc}</p>
        </div>
      </Link>

      <section className="mt-7">
        <div className="mb-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-mute">Materi lainnya</p>
          <h2 className="mt-1 text-[18px] font-bold text-ink">Pilih sesuai kebutuhan</h2>
        </div>
        <div className="border-y border-hairline sm:grid sm:grid-cols-2 sm:divide-x sm:divide-hairline">
          {panduanLain.map(({ to, label, desc, Icon }, index) => (
            <Link
              key={to}
              to={to}
              className={`group flex min-h-[94px] items-center gap-3 border-b border-hairline py-4 transition-colors hover:bg-surface-bone/60 sm:px-4 sm:odd:pl-0 sm:even:pr-0 ${index >= panduanLain.length - 2 ? 'sm:border-b-0' : ''}`}
            >
              <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-[18px] w-[18px]" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[14px] font-bold text-ink">{label}</span>
                <span className="mt-1 block text-[12px] leading-relaxed text-charcoal">{desc}</span>
              </span>
              <span className="text-[15px] font-medium text-primary transition-transform group-hover:translate-x-0.5">-&gt;</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
