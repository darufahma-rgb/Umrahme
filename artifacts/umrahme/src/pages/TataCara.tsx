import { Link } from 'react-router-dom';
import { tataCaraSteps } from '../data/tatacara';
import PageHeader from '../components/PageHeader';
import { IconChevron } from '../components/icons';

export default function TataCara() {
  return (
    <div>
      <PageHeader title="Tata Cara Umrah" eyebrow="Panduan" backTo="/panduan" />
      <main className="mx-auto max-w-4xl px-5 pb-8 pt-5 lg:px-8">
        <section className="mb-6 border-b border-hairline pb-5">
          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">Urutan Ibadah</p>
          <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-charcoal">
            Enam tahap berurutan, dari miqat hingga tahallul. Ikuti langkahnya satu per satu.
          </p>
        </section>
        <ol className="border-t border-hairline">
          {tataCaraSteps.map((step) => (
            <li key={step.nomor} className="grid grid-cols-[42px_1fr] gap-3 border-b border-hairline py-5 sm:grid-cols-[56px_1fr] sm:gap-5">
              <span className="pt-0.5 text-xl font-extrabold leading-none text-primary sm:text-2xl">
                {String(step.nomor).padStart(2, '0')}
              </span>
              <div>
                <h2 className="text-[17px] font-bold leading-tight text-ink">{step.judul}</h2>
                <p className="mt-2 text-[14px] leading-relaxed text-charcoal">{step.deskripsi}</p>
                {step.tautan && (
                  <Link to={step.tautan} className="mt-3 inline-flex items-center gap-1 text-[12px] font-semibold text-primary">
                    {step.tautanLabel} <IconChevron className="h-3.5 w-3.5" />
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ol>
      </main>
    </div>
  );
}
