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

      <div className="px-5 pt-4 pb-8">
        {/* Placeholder peta lokasi */}
        <div className="relative mb-4 flex h-40 items-center justify-center overflow-hidden rounded-md border border-hairline bg-surface-bone">
          <div
            className="absolute inset-0 opacity-[0.25]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(45deg, #0ea5e9 0 1px, transparent 1px 14px)',
            }}
            aria-hidden
          />
          <div className="relative text-center">
            <IconPeta className="mx-auto h-7 w-7 text-primary" />
            <p className="mt-1.5 font-mono text-[11px] uppercase tracking-wider text-mute">
              {lokasi.kota} · {lokasi.jarakKm} km dari hotel
            </p>
          </div>
        </div>

        {/* Metadata */}
        <div className="mb-4 grid grid-cols-2 gap-3">
          <div className="rounded-md border border-hairline bg-surface-card px-4 py-3 shadow-drop-card">
            <p className="font-mono text-[10px] uppercase tracking-widest text-mute">Jarak</p>
            <p className="mt-1 font-mono text-lg text-ink">{lokasi.jarakKm} km</p>
          </div>
          <div className="rounded-md border border-hairline bg-surface-card px-4 py-3 shadow-drop-card">
            <p className="font-mono text-[10px] uppercase tracking-widest text-mute">
              Kunjungan
            </p>
            <p className="mt-1 text-sm leading-tight text-ink">{lokasi.jamKunjungan}</p>
          </div>
        </div>

        {/* Sejarah */}
        <div className="rounded-md border border-hairline bg-surface-card px-5 py-5 shadow-drop-card">
          <h2 className="mb-2 font-display text-lg font-bold text-ink">
            Sejarah Singkat
          </h2>
          <p className="text-pretty text-[15px] leading-relaxed text-body">
            {lokasi.sejarah}
          </p>
        </div>
      </div>
    </div>
  );
}
