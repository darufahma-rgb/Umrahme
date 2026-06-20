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
    <div className="overflow-hidden rounded-md border border-hairline bg-surface-card">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex min-h-[56px] w-full items-center justify-between gap-3 px-4 py-3.5 text-left"
        aria-expanded={open}
      >
        <span className="font-display text-base font-bold text-ink">{title}</span>
        <IconChevron
          className={`h-4 w-4 flex-none text-ash transition-transform ${open ? 'rotate-90' : ''}`}
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

      <div className="space-y-5 px-5 pt-5 pb-8 lg:px-8 lg:max-w-5xl lg:mx-auto">
        {/* Niat ihram */}
        <div>
          <h2 className="mb-2.5 font-mono text-[11px] uppercase tracking-widest text-mute">
            Niat Ihram
          </h2>
          <div className="space-y-3 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-3">
            {niatIhram.map((n) => (
              <MihrabCard key={n.id} bodyClassName="px-5 pb-5 pt-2">
                <p className="text-xs font-semibold text-primary">{n.judul}</p>
                <p className="mt-2 text-center font-arab text-[26px] leading-loose text-gold" dir="rtl">
                  {n.arab}
                </p>
                <p className="mt-2 text-center text-sm italic text-body">{n.latin}</p>
                <p className="mt-2 text-center text-xs leading-relaxed text-charcoal">{n.arti}</p>
              </MihrabCard>
            ))}
          </div>
        </div>

        {/* Larangan ihram */}
        <div>
          <h2 className="mb-2.5 font-mono text-[11px] uppercase tracking-widest text-mute">
            Larangan Ihram
          </h2>
          <div className="mb-3 flex gap-1.5 rounded-full border border-hairline bg-surface-bone p-1">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`min-h-[36px] flex-1 rounded-full px-2 text-[13px] font-medium transition ${
                  tab === t.id
                    ? 'bg-primary text-on-primary'
                    : 'text-mute active:bg-surface-card hover:text-body'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <ul className="space-y-2.5 lg:grid lg:grid-cols-2 lg:gap-2.5 lg:space-y-0">
            {larangan.map((l) => (
              <li
                key={l.id}
                className="rounded-md border border-hairline bg-surface-card px-4 py-3.5"
              >
                <div className="flex items-start gap-3">
                  <span className="mt-1.5 h-1.5 w-1.5 flex-none rotate-45 bg-primary" aria-hidden />
                  <div>
                    <p className="text-[15px] font-semibold text-ink">{l.judul}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-charcoal">{l.keterangan}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Cara memakai ihram */}
        <div>
          <h2 className="mb-2.5 font-mono text-[11px] uppercase tracking-widest text-mute">
            Cara Memakai Ihram
          </h2>
          <div className="space-y-2.5 lg:grid lg:grid-cols-2 lg:gap-2.5 lg:space-y-0">
            {tataCaraMemakaiIhram.map((s, i) => (
              <Section key={s.id} title={s.judul} defaultOpen={i === 0}>
                <ol className="space-y-2">
                  {s.langkah.map((lk, j) => (
                    <li key={j} className="flex gap-3 text-sm leading-relaxed text-body">
                      <span className="font-mono text-xs text-primary">{j + 1}.</span>
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
