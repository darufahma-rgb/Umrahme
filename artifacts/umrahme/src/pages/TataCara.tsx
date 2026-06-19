import { Link } from 'react-router-dom';
import { tataCaraSteps } from '../data/tatacara';
import PageHeader from '../components/PageHeader';
import { IconChevron } from '../components/icons';

export default function TataCara() {
  return (
    <div>
      <PageHeader title="Tata Cara Umrah" eyebrow="Panduan" backTo="/panduan" />

      <div className="px-5 pt-5 lg:px-8 lg:max-w-4xl lg:mx-auto">
        <p className="mb-5 text-pretty text-sm leading-relaxed text-mute-500">
          Enam tahap berurutan. Ikuti dari atas ke bawah — beberapa langkah tertaut langsung ke
          fitur yang Anda butuhkan saat itu.
        </p>

        {/* Mobile: timeline vertikal klasik */}
        <ol className="relative space-y-5 pl-2 lg:hidden">
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

        {/* Desktop: nomor step besar + konten berdampingan */}
        <ol className="hidden lg:block space-y-4">
          {tataCaraSteps.map((step) => (
            <li
              key={step.nomor}
              className="grid grid-cols-[80px_1fr] gap-5 rounded-2xl border border-ink-800/70 bg-ink-900/50 p-5 transition-colors hover:border-ink-700"
            >
              {/* Nomor besar */}
              <div className="flex flex-col items-center justify-start pt-0.5">
                <span className="font-display text-4xl font-semibold text-rose-400/30 leading-none">
                  {String(step.nomor).padStart(2, '0')}
                </span>
                {step.nomor < tataCaraSteps.length && (
                  <div className="mt-3 flex-1 w-px bg-ink-800/60" />
                )}
              </div>

              {/* Konten */}
              <div>
                <h2 className="font-display text-xl font-semibold leading-tight text-parchment-100">
                  {step.judul}
                </h2>
                <p className="mt-2 text-[15px] leading-relaxed text-mute-500">{step.deskripsi}</p>
                {step.tautan ? (
                  <Link
                    to={step.tautan}
                    className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-rose-400/30 bg-rose-600/10 px-3.5 py-2 font-mono text-[11px] uppercase tracking-wider text-rose-400 hover:bg-rose-600/15 transition-colors"
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
