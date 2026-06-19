import { useParams } from 'react-router-dom';
import { lokasiById } from '../data/lokasi';
import PageHeader from '../components/PageHeader';
import EmptyState from '../components/EmptyState';
import { IconPeta } from '../components/icons';

export default function LokasiDetail() {
  const { id } = useParams();
  const lokasi = id ? lokasiById(id) : undefined;

  if (!lokasi) {
    return (
      <div>
        <PageHeader title="Lokasi" eyebrow="Peta Lokasi" backTo="/peta" />
        <EmptyState
          icon={<IconPeta className="h-7 w-7" />}
          title="Lokasi tidak ditemukan"
          desc="Tempat yang Anda cari tidak tersedia."
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={lokasi.nama}
        eyebrow={lokasi.tipe === 'masjid' ? 'Masjid' : 'Tempat Bersejarah'}
        backTo="/peta"
      />

      <div className="px-5 pt-4">
        {/* Placeholder peta lokasi — TODO(maps): embed Google Maps via lat/lng */}
        <div className="relative mb-4 flex h-40 items-center justify-center overflow-hidden rounded-2xl border border-ink-800/70 bg-ink-900/60">
          <div
            className="absolute inset-0 opacity-[0.15]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(45deg, #C2185B 0 1px, transparent 1px 14px)',
            }}
            aria-hidden
          />
          <div className="relative text-center">
            <IconPeta className="mx-auto h-7 w-7 text-rose-400" />
            <p className="mt-1.5 font-mono text-[11px] uppercase tracking-wider text-mute-500">
              {lokasi.kota} · {lokasi.jarakKm} km dari hotel
            </p>
          </div>
        </div>

        {/* Metadata */}
        <div className="mb-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-ink-800/70 bg-ink-900/50 px-4 py-3">
            <p className="font-mono text-[10px] uppercase tracking-widest text-mute-500">Jarak</p>
            <p className="mt-1 font-mono text-lg text-parchment-100">{lokasi.jarakKm} km</p>
          </div>
          <div className="rounded-2xl border border-ink-800/70 bg-ink-900/50 px-4 py-3">
            <p className="font-mono text-[10px] uppercase tracking-widest text-mute-500">
              Kunjungan
            </p>
            <p className="mt-1 text-sm leading-tight text-parchment-100">{lokasi.jamKunjungan}</p>
          </div>
        </div>

        {/* Sejarah */}
        <div className="rounded-2xl border border-ink-800/70 bg-ink-900/40 px-5 py-5">
          <h2 className="mb-2 font-display text-lg font-semibold text-parchment-100">
            Sejarah Singkat
          </h2>
          <p className="text-pretty text-[15px] leading-relaxed text-parchment-100/90">
            {lokasi.sejarah}
          </p>
        </div>
      </div>
    </div>
  );
}
