import { urutanFase } from '../data/jamaah';
import type { Fase } from '../types';

// Indikator fase jamaah: Persiapan → Di Tanah Suci → Selesai.
// Visual via ukuran & kontras, bukan warna ramai.
export default function PhaseIndicator({ fase }: { fase: Fase }) {
  const idxAktif = urutanFase.findIndex((f) => f.id === fase);

  return (
    <div className="flex items-center gap-1.5">
      {urutanFase.map((f, i) => {
        const done = i < idxAktif;
        const active = i === idxAktif;
        return (
          <div key={f.id} className="flex flex-1 items-center gap-1.5">
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={`flex h-2.5 w-2.5 items-center justify-center rounded-full ${
                  active
                    ? 'bg-rose-400 shadow-glow'
                    : done
                      ? 'bg-rose-600'
                      : 'bg-ink-800'
                }`}
              />
            </div>
            <span
              className={`font-mono text-[10px] uppercase tracking-wider ${
                active ? 'text-parchment-100' : done ? 'text-mute-500' : 'text-mute-500/60'
              }`}
            >
              {f.label}
            </span>
            {i < urutanFase.length - 1 ? (
              <span
                className={`mx-1 h-px flex-1 ${i < idxAktif ? 'bg-rose-600/60' : 'bg-ink-800'}`}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
