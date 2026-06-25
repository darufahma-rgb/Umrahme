import { useState } from 'react';
import PageHeader from '../components/PageHeader';
import { faqKategori } from '../data/faqFikih';
import type { FaqItem } from '../data/faqFikih';
import { IconChevron } from '../components/icons';

const accentMap: Record<string, { header: string; badge: string; note: string; dot: string }> = {
  primary: {
    header: 'from-primary/15 to-primary/5 border-primary/20',
    badge: 'bg-primary/10 text-primary',
    note: 'border-primary/20 bg-primary/5 text-primary',
    dot: 'bg-primary',
  },
  gold: {
    header: 'from-gold/15 to-gold/5 border-gold/20',
    badge: 'bg-gold/10 text-gold',
    note: 'border-gold/20 bg-gold/5 text-gold',
    dot: 'bg-gold',
  },
  blue: {
    header: 'from-blue-500/15 to-blue-500/5 border-blue-500/20',
    badge: 'bg-blue-500/10 text-blue-600',
    note: 'border-blue-500/20 bg-blue-500/5 text-blue-700',
    dot: 'bg-blue-500',
  },
  green: {
    header: 'from-emerald-500/15 to-emerald-500/5 border-emerald-500/20',
    badge: 'bg-emerald-500/10 text-emerald-700',
    note: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-700',
    dot: 'bg-emerald-500',
  },
};

function FaqAccordion({ item, accent }: { item: FaqItem; accent: string }) {
  const [open, setOpen] = useState(false);
  const a = accentMap[accent] ?? accentMap['primary'];

  return (
    <div className="overflow-hidden rounded-xl border border-hairline bg-surface-card">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex min-h-[52px] w-full items-start justify-between gap-3 px-4 py-3.5 text-left"
        aria-expanded={open}
      >
        <div className="flex items-start gap-2.5 min-w-0">
          <span className={`mt-1.5 h-1.5 w-1.5 flex-none rounded-full ${a.dot}`} aria-hidden />
          <span className="text-[14px] font-semibold leading-snug text-ink">{item.tanya}</span>
        </div>
        <IconChevron
          className={`mt-1 h-4 w-4 flex-none text-ash transition-transform ${open ? 'rotate-90' : ''}`}
        />
      </button>

      {open ? (
        <div className="animate-fade-up px-4 pb-4">
          <div className="border-t border-hairline pt-3">
            <p className="text-[13px] leading-relaxed text-charcoal">{item.jawab}</p>
            {item.catatan ? (
              <div className={`mt-2.5 rounded-lg border px-3 py-2.5 ${a.note}`}>
                <p className="text-[11.5px] leading-relaxed">
                  <span className="font-semibold">Catatan: </span>
                  {item.catatan}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function FaqFikih() {
  return (
    <div className="pb-10">
      <PageHeader title="Tanya Jawab Fikih" eyebrow="Panduan" backTo="/panduan" />

      <div className="space-y-6 px-5 pt-5 lg:px-8 lg:max-w-5xl lg:mx-auto">

        {/* Pengantar */}
        <p className="text-[13px] leading-relaxed text-charcoal">
          Kumpulan pertanyaan yang sering muncul seputar ibadah umrah. Jawaban bersifat panduan umum — untuk kasus spesifik, selalu tanyakan kepada <span className="font-semibold text-ink">pembimbing/muthowif atau ulama terpercaya</span>.
        </p>

        {/* Kategori */}
        {faqKategori.map((kat) => {
          const a = accentMap[kat.accent] ?? accentMap['primary'];
          return (
            <section key={kat.id}>
              {/* Header kategori */}
              <div className={`mb-3 rounded-xl border bg-gradient-to-r px-4 py-3 ${a.header}`}>
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-wider ${a.badge}`}>
                    {kat.items.length} pertanyaan
                  </span>
                </div>
                <h2 className="mt-1 font-display text-[15px] font-bold text-ink">{kat.nama}</h2>
                <p className="text-[12px] text-charcoal">{kat.ringkas}</p>
              </div>

              {/* Accordion items */}
              <div className="space-y-2">
                {kat.items.map((item) => (
                  <FaqAccordion key={item.id} item={item} accent={kat.accent} />
                ))}
              </div>
            </section>
          );
        })}

        {/* Penutup */}
        <div className="rounded-xl border border-hairline bg-surface-bone px-4 py-3.5">
          <p className="font-mono text-[9px] uppercase tracking-widest text-mute mb-1.5">Catatan Penting</p>
          <p className="text-[12.5px] leading-relaxed text-charcoal">
            Jawaban di atas mengikuti pendapat yang umum dipakai di Indonesia (banyak merujuk mazhab Syafi'i & jumhur ulama). Masalah yang bersifat khilafiyah sudah diberi keterangan. App ini tidak memberikan fatwa final untuk kasus spesifik — selalu konsultasikan kepada pembimbing ibadah atau ulama yang Anda percaya.
          </p>
        </div>

      </div>
    </div>
  );
}
