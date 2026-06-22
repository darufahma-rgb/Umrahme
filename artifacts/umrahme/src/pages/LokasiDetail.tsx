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

  return (
    <div>
      <PageHeader
        title={lokasi.nama}
        eyebrow={lokasi.tipe === 'masjid' ? 'Masjid' : 'Tempat Bersejarah'}
        backTo="/peta"
      />

      <div className="px-5 pt-4 pb-28 space-y-3">

        {/* 1. NAMA ARAB — hanya tampil jika ada */}
        {lokasi.namaArab && (
          <p className="text-right font-arab text-[22px] text-gold leading-relaxed">
            {lokasi.namaArab}
          </p>
        )}

        {/* 2. BOX GAMBAR — antara nama Arab dan kartu Maps */}
        {lokasi.gambar ? (
          <div className="rounded-md overflow-hidden border border-hairline">
            <img
              src={lokasi.gambar}
              alt={lokasi.nama}
              className="w-full h-52 object-cover"
            />
          </div>
        ) : (
          <div className="relative flex h-52 items-center justify-center overflow-hidden rounded-md border border-dashed border-hairline-strong bg-surface-bone">
            <div
              className="absolute inset-0 opacity-[0.12]"
              style={{ backgroundImage: 'repeating-linear-gradient(45deg, #d4a24e 0 1px, transparent 1px 18px)' }}
              aria-hidden
            />
            <div className="relative flex flex-col items-center gap-2 text-center px-6">
              <div className="h-10 w-10 rounded-full bg-surface-bone border border-hairline flex items-center justify-center">
                <svg
                  className="h-5 w-5 text-ash"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </div>
              <p className="font-mono text-[11px] uppercase tracking-wider text-mute leading-tight">
                Foto belum tersedia
              </p>
            </div>
          </div>
        )}

        {/* 3. KARTU PETA / GOOGLE MAPS — selalu tampil */}
        {lokasi.koordinat ? (
          <a
            href={gmapsUrl(lokasi)}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-md border border-hairline bg-surface-card overflow-hidden active:scale-[0.99] hover:shadow-drop-soft transition-shadow"
            aria-label={`Lihat ${lokasi.nama} di Google Maps`}
          >
            {/* Motif diagonal placeholder */}
            <div className="relative h-[100px] bg-surface-bone overflow-hidden">
              <div
                className="absolute inset-0 opacity-[0.18]"
                style={{ backgroundImage: 'repeating-linear-gradient(45deg, #0ea5e9 0 1px, transparent 1px 14px)' }}
                aria-hidden
              />
              {/* Pin tengah */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center gap-0.5">
                  <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center shadow-glow-primary">
                    <IconPeta className="h-[18px] w-[18px] text-on-primary" />
                  </div>
                  <div className="h-1.5 w-1.5 rounded-full bg-primary/30" />
                </div>
              </div>
              {/* Chip kanan atas */}
              <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 bg-white/90 border border-hairline rounded-sm px-2 py-1">
                <svg className="h-3 w-3 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                <span className="font-mono text-[10px] font-medium text-primary">Buka Maps</span>
              </div>
            </div>
            {/* Row info bawah */}
            <div className="flex items-center justify-between px-4 py-2.5 border-t border-hairline">
              <div className="flex items-center gap-2">
                <svg className="h-3.5 w-3.5 text-gold flex-shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                <span className="text-[13px] font-medium text-ink">Lihat di Google Maps</span>
              </div>
              <span className="font-mono text-[11px] text-mute">
                {lokasi.kota} · {lokasi.jarakKm} km
              </span>
            </div>
          </a>
        ) : (
          /* Fallback placeholder jika tidak ada koordinat */
          <div className="relative flex h-28 items-center justify-center overflow-hidden rounded-md border border-hairline bg-surface-bone">
            <div className="absolute inset-0 opacity-[0.25]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #0ea5e9 0 1px, transparent 1px 14px)' }} aria-hidden />
            <div className="relative text-center">
              <IconPeta className="mx-auto h-7 w-7 text-primary" />
              <p className="mt-1.5 font-mono text-[11px] uppercase tracking-wider text-mute">
                {lokasi.kota} · {lokasi.jarakKm} km dari hotel
              </p>
            </div>
          </div>
        )}

        {/* 3. METADATA: Jarak + Kunjungan */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="rounded-md border border-hairline bg-surface-card px-4 py-3 shadow-drop-card">
            <p className="font-mono text-[10px] uppercase tracking-widest text-mute">Jarak</p>
            <p className="mt-1 font-mono text-[20px] font-bold text-ink leading-none">
              {lokasi.jarakKm}
              <span className="text-[13px] font-normal text-charcoal ml-0.5">km</span>
            </p>
          </div>
          <div className="rounded-md border border-hairline bg-surface-card px-4 py-3 shadow-drop-card">
            <p className="font-mono text-[10px] uppercase tracking-widest text-mute">Kunjungan</p>
            <p className="mt-1 text-[13px] font-medium leading-tight text-ink">{lokasi.jamKunjungan}</p>
          </div>
        </div>

        {/* 4. KEUTAMAAN & FAKTA — hanya jika ada */}
        {lokasi.keutamaan && lokasi.keutamaan.length > 0 && (
          <div className="rounded-md border border-hairline bg-surface-card px-5 py-4 shadow-drop-card">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="h-7 w-7 rounded-sm flex items-center justify-center bg-gold/10 flex-shrink-0">
                <svg className="h-4 w-4 text-gold" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <h2 className="font-display text-[14px] font-bold text-ink">Keutamaan & Fakta</h2>
            </div>
            <ul className="space-y-2.5">
              {lokasi.keutamaan.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="mt-[7px] h-1.5 w-1.5 rounded-full bg-gold flex-shrink-0" />
                  <span className="text-[13.5px] leading-relaxed text-body">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 5. SEJARAH — seksi berstruktur jika ada, fallback ke sejarah biasa */}
        <div className="rounded-md border border-hairline bg-surface-card px-5 py-4 shadow-drop-card">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="h-7 w-7 rounded-sm flex items-center justify-center bg-primary/10 flex-shrink-0">
              <svg className="h-4 w-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
              </svg>
            </div>
            <h2 className="font-display text-[14px] font-bold text-ink">Sejarah</h2>
          </div>

          {lokasi.sejarahSeksi && lokasi.sejarahSeksi.length > 0 ? (
            <div className="space-y-3.5">
              {lokasi.sejarahSeksi.map((seksi, i) => (
                <div key={i}>
                  {i > 0 && <div className="h-px bg-hairline mb-3.5" />}
                  <p className="font-mono text-[11px] font-medium uppercase tracking-[0.06em] text-primary mb-1.5">
                    {seksi.judul}
                  </p>
                  <p className="text-[13.5px] leading-[1.65] text-body">{seksi.isi}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-[13.5px] leading-[1.65] text-body">{lokasi.sejarah}</p>
          )}
        </div>

        {/* 6. TOKOH BERSEJARAH — hanya jika ada */}
        {lokasi.tokoh && lokasi.tokoh.length > 0 && (
          <div className="rounded-md border border-hairline bg-surface-card px-5 py-4 shadow-drop-card">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="h-7 w-7 rounded-sm flex items-center justify-center bg-surface-bone flex-shrink-0">
                <svg className="h-4 w-4 text-charcoal" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h2 className="font-display text-[14px] font-bold text-ink">Tokoh Bersejarah</h2>
            </div>
            <div className="space-y-2.5">
              {lokasi.tokoh.map((t, i) => (
                <div key={i}>
                  {i > 0 && <div className="h-px bg-hairline mb-2.5 ml-[42px]" />}
                  <div className="flex items-start gap-2.5">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      i % 2 === 0 ? 'bg-primary/10' : 'bg-gold/10'
                    }`}>
                      <svg className={`h-3.5 w-3.5 ${i % 2 === 0 ? 'text-primary' : 'text-gold'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[13.5px] font-semibold text-ink leading-tight">{t.nama}</p>
                      <p className="text-[12px] text-charcoal mt-0.5 leading-snug">{t.peran}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. DALIL TERKAIT — hanya jika ada */}
        {lokasi.dalil && lokasi.dalil.length > 0 && (
          <div className="rounded-md border border-hairline bg-surface-card px-5 py-4 shadow-drop-card">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="h-7 w-7 rounded-sm flex items-center justify-center bg-gold/10 flex-shrink-0">
                <svg className="h-4 w-4 text-gold" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
                  <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
                </svg>
              </div>
              <h2 className="font-display text-[14px] font-bold text-ink">Dalil Terkait</h2>
            </div>
            <div className="space-y-3">
              {lokasi.dalil.map((d, i) => (
                <div key={i} className="border-l-2 border-gold/40 pl-3">
                  <p className="text-[13.5px] italic leading-[1.65] text-body mb-1.5">"{d.teks}"</p>
                  <p className="font-mono text-[11px] font-medium text-gold">— {d.sumber}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 8. ADAB & TIPS — hanya jika ada */}
        {lokasi.adab && lokasi.adab.length > 0 && (
          <div className="rounded-md border border-hairline bg-surface-card px-5 py-4 shadow-drop-card">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="h-7 w-7 rounded-sm flex items-center justify-center bg-badge-success/10 flex-shrink-0">
                <svg className="h-4 w-4 text-badge-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M9 11l3 3L22 4" />
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                </svg>
              </div>
              <h2 className="font-display text-[14px] font-bold text-ink">Adab & Tips</h2>
            </div>
            <ul className="space-y-2.5">
              {lokasi.adab.map((tip, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <svg className="h-3.5 w-3.5 text-badge-success mt-[3px] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span className="text-[13.5px] leading-relaxed text-body">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 9. CATATAN (riwayat lemah / pelurusan info) — hanya jika ada */}
        {lokasi.catatan && (
          <div className="rounded-md border border-hairline bg-surface-bone px-4 py-3 flex items-start gap-2.5">
            <svg className="h-4 w-4 text-gold mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p className="text-[12.5px] leading-relaxed text-charcoal">
              <span className="font-semibold text-gold">Catatan: </span>
              {lokasi.catatan}
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
