import { useState, type ReactNode } from 'react';
import { niatIhram, larganganIhram, tataCaraMemakaiIhram } from '../data/ihram';
import type { GenderLarangan } from '../types';
import PageHeader from '../components/PageHeader';
import MihrabCard from '../components/MihrabCard';
import { IconChevron } from '../components/icons';

const tabs: { id: GenderLarangan; label: string }[] = [
  { id: 'lakilaki', label: 'Laki-laki' },
  { id: 'perempuan', label: 'Perempuan' },
  { id: 'umum', label: 'Berlaku Umum' },
];

function Section({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="overflow-hidden rounded-2xl border border-ink-800/70 bg-ink-900/40">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex min-h-[56px] w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
        aria-expanded={open}
      >
        <span className="font-display text-base font-semibold text-parchment-100">{title}</span>
        <IconChevron
          className={`h-4 w-4 flex-none text-mute-500 transition-transform ${open ? 'rotate-90' : ''}`}
        />
      </button>
      {open ? <div className="px-4 pb-4 animate-fade-up">{children}</div> : null}
    </div>
  );
}

export default function PanduanIhram() {
  const [tab, setTab] = useState<GenderLarangan>('lakilaki');
  const larangan = larganganIhram.filter((l) => l.gender === tab);

  return (
    <div>
      <PageHeader title="Panduan Ihram" eyebrow="Panduan" backTo="/panduan" />

      <div className="space-y-5 px-5 pt-5">
        {/* Niat ihram */}
        <div>
          <h2 className="mb-2.5 font-mono text-[11px] uppercase tracking-widest text-mute-500">
            Niat Ihram
          </h2>
          <div className="space-y-3">
            {niatIhram.map((n) => (
              <MihrabCard key={n.id} bodyClassName="px-5 pb-5 pt-2">
                <p className="text-xs font-medium text-rose-400">{n.judul}</p>
                <p className="mt-2 text-center font-arab text-[26px] leading-loose text-gold-400" dir="rtl">
                  {n.arab}
                </p>
                <p className="mt-2 text-center text-sm italic text-parchment-100">{n.latin}</p>
                <p className="mt-2 text-center text-xs leading-relaxed text-mute-500">{n.arti}</p>
              </MihrabCard>
            ))}
          </div>
        </div>

        {/* Larangan ihram — dipisah per gender */}
        <div>
          <h2 className="mb-2.5 font-mono text-[11px] uppercase tracking-widest text-mute-500">
            Larangan Ihram
          </h2>
          <div className="mb-3 flex gap-1.5 rounded-xl border border-ink-800 bg-ink-900/60 p-1">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`min-h-[40px] flex-1 rounded-lg px-2 text-[13px] font-medium transition ${
                  tab === t.id
                    ? 'bg-rose-600 text-parchment-100'
                    : 'text-mute-500 active:bg-ink-800'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <ul className="space-y-2.5">
            {larangan.map((l) => (
              <li
                key={l.id}
                className="rounded-2xl border border-ink-800/70 bg-ink-900/50 px-4 py-3.5"
              >
                <div className="flex items-start gap-3">
                  <span className="mt-1 h-1.5 w-1.5 flex-none rotate-45 bg-rose-400" aria-hidden />
                  <div>
                    <p className="text-[15px] font-semibold text-parchment-100">{l.judul}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-mute-500">{l.keterangan}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Tata cara memakai ihram — accordion */}
        <div>
          <h2 className="mb-2.5 font-mono text-[11px] uppercase tracking-widest text-mute-500">
            Cara Memakai Ihram
          </h2>
          <div className="space-y-2.5">
            {tataCaraMemakaiIhram.map((s, i) => (
              <Section key={s.id} title={s.judul} defaultOpen={i === 0}>
                <ol className="space-y-2">
                  {s.langkah.map((lk, j) => (
                    <li key={j} className="flex gap-3 text-sm leading-relaxed text-parchment-100/90">
                      <span className="font-mono text-xs text-rose-400">{j + 1}.</span>
                      <span>{lk}</span>
                    </li>
                  ))}
                </ol>
              </Section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
