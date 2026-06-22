import { useParams } from 'react-router-dom';
import { lokasiById, gmapsUrl } from '../data/lokasi';
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

  const mapsUrl = gmapsUrl(lokasi);

  return (
    <div>
      <PageHeader
        title={lokasi.nama}
        eyebrow={lokasi.tipe === 'masjid' ? 'Masjid' : 'Tempat Bersejarah'}
        backTo="/peta"
      />

      {/* Nama Arab di bawah judul */}
      {lokasi.namaArab && (
        <p
          className="px-5 pb-1 text-right font-arab text-xl text-gold leading-loose"
          dir="rtl"
        >
          {lokasi.namaArab}
        </p>
      )}

      <div className="px-5 pt-3 pb-24 space-y-4">

        {/* ── Kartu Peta → Google Maps ── */}
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="relative flex h-36 items-end overflow-hidden rounded-md border border-hairline bg-surface-bone active:scale-[0.99] hover:shadow-drop-soft transition-all block"
        >
          <div
            className="absolute inset-0 opacity-[0.22]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(45deg, #0ea5e9 0 1px, transparent 1px 14px)',
            }}
            aria-hidden
          />
          <div className="relative w-full px-4 pb-4">
            <div className="flex items-center gap-2 mb-1">
              <IconPeta className="h-4 w-4 text-primary flex-none" />
              <span className="text-[14px] font-semibold text-ink">Lihat di Google Maps</span>
              <svg className="h-3.5 w-3.5 text-ash flex-none ml-auto" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </div>
            <p className="font-mono text-[10px] text-mute">
              {lokasi.kota} · {lokasi.jarakKm} km dari hotel · {lokasi.koordinat.lat.toFixed(4)}, {lokasi.koordinat.lng.toFixed(4)}
            </p>
          </div>
        </a>

        {/* ── Metadata: Jarak & Jam Kunjungan ── */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-md border border-hairline bg-surface-card px-4 py-3 shadow-drop-card">
            <p className="font-mono text-[10px] uppercase tracking-widest text-mute">Jarak</p>
            <p className="mt-1 font-mono text-lg text-ink">{lokasi.jarakKm} km</p>
          </div>
          <div className="rounded-md border border-hairline bg-surface-card px-4 py-3 shadow-drop-card">
            <p className="font-mono text-[10px] uppercase tracking-widest text-mute">Kunjungan</p>
            <p className="mt-1 text-sm leading-tight text-ink">{lokasi.jamKunjungan}</p>
          </div>
        </div>

        {/* ── Keutamaan & Fakta ── */}
        {lokasi.keutamaan && lokasi.keutamaan.length > 0 && (
          <div className="rounded-md border border-hairline bg-surface-card px-5 py-5 shadow-drop-card">
            <h2 className="mb-3 font-display text-base font-bold text-ink">Keutamaan & Fakta</h2>
            <ul className="space-y-2">
              {lokasi.keutamaan.map((k, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="mt-[5px] h-1.5 w-1.5 flex-none rounded-full bg-gold" />
                  <p className="text-[14px] leading-relaxed text-body">{k}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ── Sejarah ── */}
        <div className="rounded-md border border-hairline bg-surface-card px-5 py-5 shadow-drop-card">
          <h2 className="mb-3 font-display text-base font-bold text-ink">Sejarah</h2>
          {lokasi.sejarahSeksi && lokasi.sejarahSeksi.length > 0 ? (
            <div className="space-y-4">
              {lokasi.sejarahSeksi.map((seksi, i) => (
                <div key={i}>
                  <h3 className="mb-1.5 text-[13px] font-semibold text-ink">{seksi.judul}</h3>
                  <p className="text-pretty text-[14px] leading-relaxed text-body">{seksi.isi}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-pretty text-[14px] leading-relaxed text-body">{lokasi.sejarah}</p>
          )}
        </div>

        {/* ── Tokoh Bersejarah ── */}
        {lokasi.tokoh && lokasi.tokoh.length > 0 && (
          <div className="rounded-md border border-hairline bg-surface-card px-5 py-5 shadow-drop-card">
            <h2 className="mb-3 font-display text-base font-bold text-ink">Tokoh Bersejarah</h2>
            <ul className="space-y-3">
              {lokasi.tokoh.map((t, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-gold/10 font-mono text-[10px] font-bold text-gold">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-[14px] font-semibold text-ink">{t.nama}</p>
                    <p className="text-sm text-charcoal">{t.peran}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ── Dalil Terkait ── */}
        {lokasi.dalil && lokasi.dalil.length > 0 && (
          <div className="rounded-md border border-hairline bg-surface-card px-5 py-5 shadow-drop-card">
            <h2 className="mb-3 font-display text-base font-bold text-ink">Dalil Terkait</h2>
            <ul className="space-y-4">
              {lokasi.dalil.map((d, i) => (
                <li key={i}>
                  <p className="text-[14px] italic leading-relaxed text-body">"{d.teks}"</p>
                  <p className="mt-1 font-mono text-[11px] text-gold">— {d.sumber}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ── Adab & Tips ── */}
        {lokasi.adab && lokasi.adab.length > 0 && (
          <div className="rounded-md border border-hairline bg-surface-card px-5 py-5 shadow-drop-card">
            <h2 className="mb-3 font-display text-base font-bold text-ink">Adab & Tips Kunjungan</h2>
            <ul className="space-y-2">
              {lokasi.adab.map((a, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="mt-[5px] h-1.5 w-1.5 flex-none rounded-full bg-primary" />
                  <p className="text-[14px] leading-relaxed text-body">{a}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ── Catatan (riwayat lemah / disclaimer) ── */}
        {lokasi.catatan && (
          <div className="rounded-md border border-hairline bg-surface-bone px-4 py-4">
            <div className="flex items-start gap-2.5">
              <svg className="mt-0.5 h-4 w-4 flex-none text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <p className="text-sm leading-relaxed text-charcoal">
                <span className="font-semibold text-gold">Catatan: </span>
                {lokasi.catatan}
              </p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
