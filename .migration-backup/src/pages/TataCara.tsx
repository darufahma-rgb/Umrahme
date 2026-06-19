import { Link } from 'react-router-dom';
import { tataCaraSteps } from '../data/tatacara';
import PageHeader from '../components/PageHeader';
import { IconChevron } from '../components/icons';

// Tata Cara Umrah — timeline vertikal bernomor.
export default function TataCara() {
  return (
    <div>
      <PageHeader title="Tata Cara Umrah" eyebrow="Panduan" backTo="/panduan" />

      <div className="px-5 pt-5">
        <p className="mb-5 text-pretty text-sm leading-relaxed text-mute-500">
          Enam tahap berurutan. Ikuti dari atas ke bawah — beberapa langkah tertaut
          langsung ke fitur yang Anda butuhkan saat itu.
        </p>

        <ol className="relative space-y-5 pl-2">
          {/* garis timeline */}
          <span className="absolute bottom-4 left-[22px] top-4 w-px bg-ink-800" aria-hidden />

          {tataCaraSteps.map((step) => (
            <li key={step.nomor} className="relative flex gap-4">
              <span className="z-10 flex h-11 w-11 flex-none items-center justify-center rounded-full border border-rose-400/40 bg-ink-900 font-mono text-sm font-medium text-rose-400">
                {String(step.nomor).padStart(2, '0')}
              </span>
              <div className="flex-1 rounded-2xl border border-ink-800/70 bg-ink-900/50 px-4 py-3.5">
                <h2 className="font-display text-lg font-semibold leading-tight text-parchment-100">
                  {step.judul}
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-mute-500">{step.deskripsi}</p>
                {step.tautan ? (
                  <Link
                    to={step.tautan}
                    className="mt-3 inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-wider text-rose-400"
                  >
                    {step.tautanLabel} <IconChevron className="h-3.5 w-3.5" />
                  </Link>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
