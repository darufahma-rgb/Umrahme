import PageHeader from '../components/PageHeader';
import { useAuth } from '../context/AuthContext';
import { getOperationalInfo, whatsappLink } from '../data/travelCompanion';

function IconWhatsapp({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

function IconPhone({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.74a16 16 0 0 0 6.26 6.26l1.28-1.28a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function IconUser({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

export default function KartuJamaah() {
  const { jamaah, tenant } = useAuth();
  if (!jamaah) return null;

  const info = getOperationalInfo(tenant ?? null);
  const hotelMakkah  = jamaah.hotelMakkah  ?? info.hotelMakkah;
  const hotelMadinah = jamaah.hotelMadinah ?? info.hotelMadinah;
  const pembimbing   = jamaah.pembimbingNama     ?? info.guideName;
  const pembimbingWa = jamaah.pembimbingWhatsapp ?? info.guideWhatsapp;
  const namaTravel   = tenant?.nama_travel ?? jamaah.travel;

  return (
    <div className="min-h-screen bg-canvas">
      <PageHeader title="Kartu Jamaah" eyebrow={namaTravel} backTo="/beranda" />

      <div className="px-4 pb-12 pt-3 space-y-3">

        {/* ── KARTU UTAMA ─────────────────────────────────────────── */}
        <div
          className="relative overflow-hidden rounded-[28px] shadow-drop-lifted"
          style={{ background: 'linear-gradient(150deg, #0b1f3a 0%, #0d3156 45%, #0c4a82 80%, #1565a8 100%)' }}
        >
          {/* Dekorasi lingkaran */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(99,179,237,0.12) 0%, transparent 70%)' }} />
          <div className="pointer-events-none absolute -left-10 bottom-0 h-40 w-40 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(14,165,233,0.10) 0%, transparent 70%)' }} />

          {/* Pola diagonal halus */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.025]"
            style={{ backgroundImage: 'repeating-linear-gradient(135deg,#fff 0,#fff 1px,transparent 1px,transparent 14px)' }} />

          <div className="relative px-5 pt-5 pb-5">

            {/* Header: label + logo */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-[8px] uppercase tracking-[0.32em] text-sky-300/60">
                  Kartu Jamaah Digital
                </p>
                <p className="mt-0.5 text-[12px] font-semibold text-white/50">{namaTravel}</p>
              </div>
              {tenant?.logo_url ? (
                <img src={tenant.logo_url} alt={namaTravel}
                  className="h-7 w-auto max-w-[90px] flex-none object-contain"
                  style={{ filter: 'brightness(0) invert(1) opacity(0.55)' }}
                  onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }} />
              ) : (
                <div className="rounded-xl border border-white/10 px-3 py-1.5 backdrop-blur-sm"
                  style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <span className="font-mono text-[9px] uppercase tracking-widest text-white/40">
                    {namaTravel.slice(0, 4).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Avatar + nama */}
            <div className="mt-5 flex items-center gap-4">
              <div className="relative flex-none">
                <div
                  className="flex h-[56px] w-[56px] items-center justify-center rounded-[18px]"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.05) 100%)',
                    border: '1.5px solid rgba(255,255,255,0.14)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <IconUser className="h-6 w-6 text-white/50" />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="font-display text-[24px] font-bold leading-tight text-white" style={{ letterSpacing: '-0.5px' }}>
                  {jamaah.nama}
                </h1>
                <p className="mt-0.5 font-mono text-[10px] tracking-[0.1em] text-sky-200/50">
                  {jamaah.nomorJamaah}
                </p>
              </div>
            </div>

            {/* Separator boarding-pass */}
            <div className="relative my-5 flex items-center">
              <div className="absolute -left-5 h-4 w-4 rounded-full" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.06)' }} />
              <div className="flex-1 border-t border-dashed border-white/10" />
              <div className="absolute -right-5 h-4 w-4 rounded-full" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.06)' }} />
            </div>

            {/* Hotel Makkah + Madinah — gaya SISKOPATUH */}
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { kota: 'Makkah Al-Mukarramah', hotel: hotelMakkah, dot: '#60a5fa' },
                { kota: 'Madinah Al-Munawwarah', hotel: hotelMadinah, dot: '#86efac' },
              ].map(({ kota, hotel, dot }) => (
                <div
                  key={kota}
                  className="rounded-2xl px-3.5 py-3"
                  style={{
                    background: 'rgba(0,0,0,0.22)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    backdropFilter: 'blur(6px)',
                  }}
                >
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <div className="h-1.5 w-1.5 rounded-full flex-none" style={{ background: dot }} />
                    <p className="font-mono text-[7px] uppercase tracking-[0.16em] text-white/35 leading-none">{kota}</p>
                  </div>
                  <p className="text-[11.5px] font-bold leading-snug text-white/90">{hotel}</p>
                </div>
              ))}
            </div>

            {/* Kode aktivasi */}
            <div
              className="mt-2.5 flex items-center justify-between rounded-2xl px-4 py-3"
              style={{ background: 'rgba(0,0,0,0.28)', border: '1px solid rgba(255,255,255,0.05)' }}
            >
              <p className="font-mono text-[8px] uppercase tracking-[0.22em] text-white/30">Kode Aktivasi</p>
              <p className="font-mono text-[17px] font-bold tracking-[0.2em] text-white">
                {jamaah.kodeAktivasi}
              </p>
            </div>
          </div>
        </div>

        {/* ── PEMBIMBING ───────────────────────────────────────────── */}
        <div className="rounded-2xl border border-hairline bg-white shadow-drop-card overflow-hidden">
          <div className="px-5 pt-4 pb-3">
            <p className="font-mono text-[8.5px] uppercase tracking-[0.22em] text-mute mb-3">Pembimbing Rombongan</p>
            <div className="flex items-center gap-3">
              <div
                className="flex h-11 w-11 flex-none items-center justify-center rounded-xl"
                style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', border: '1px solid rgba(14,165,233,0.14)' }}
              >
                <IconUser className="h-5 w-5 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-bold leading-tight text-ink">{pembimbing}</p>
                <p className="text-[11px] text-charcoal mt-0.5">{info.guideRole}</p>
              </div>
            </div>
          </div>
          <div className="h-px bg-hairline mx-5" />
          <div className="grid grid-cols-2 gap-2 px-5 py-3">
            <a href={whatsappLink(pembimbingWa)} target="_blank" rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl py-3 text-[13px] font-bold text-white active:scale-[0.97] transition-all"
              style={{ background: '#25D366' }}>
              <IconWhatsapp className="h-4 w-4" />
              WhatsApp
            </a>
            <a href={`tel:${pembimbingWa}`}
              className="flex items-center justify-center gap-2 rounded-xl border border-hairline bg-surface-bone py-3 text-[13px] font-bold text-ink active:scale-[0.97] transition-all">
              <IconPhone className="h-4 w-4" />
              Telepon
            </a>
          </div>
        </div>

        {/* ── DARURAT ─────────────────────────────────────────────── */}
        <div
          className="rounded-2xl px-4 py-4"
          style={{ background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)', border: '1px solid rgba(212,162,78,0.22)' }}
        >
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 flex-none items-center justify-center rounded-xl text-[16px]"
              style={{ background: 'rgba(212,162,78,0.14)' }}>
              ⚠️
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-bold text-amber-800">Jika tersesat atau butuh bantuan</p>
              <p className="mt-1 text-[11.5px] leading-relaxed text-amber-700">{info.emergencyNote}</p>
            </div>
          </div>
        </div>

        <p className="text-center text-[10.5px] leading-relaxed text-mute pt-1">
          Screenshot halaman ini dan simpan offline agar bisa ditunjukkan saat dibutuhkan.
        </p>

      </div>
    </div>
  );
}
