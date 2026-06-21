import PageHeader from '../components/PageHeader';
import { useAuth } from '../context/AuthContext';
import { getOperationalInfo, whatsappLink } from '../data/travelCompanion';

// ── Ikon lokal ────────────────────────────────────────────────

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

function IconMapPin({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function IconUser({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

// ── Chip kecil ────────────────────────────────────────────────

function Chip({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col items-center rounded-2xl bg-white/[0.13] px-3 py-2.5 text-center backdrop-blur-sm">
      <p className="font-mono text-[7.5px] uppercase tracking-[0.14em] text-white/50">{label}</p>
      <p className="mt-1 text-[13px] font-bold leading-tight text-white">{value}</p>
    </div>
  );
}

// ── Baris info detail ─────────────────────────────────────────

function DetailRow({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 border-b border-hairline py-3.5 last:border-b-0">
      {icon && (
        <div className="flex h-8 w-8 flex-none items-center justify-center rounded-lg bg-surface-bone">
          {icon}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-mute">{label}</p>
        <p className="mt-0.5 text-[13px] font-semibold leading-snug text-ink">{value}</p>
      </div>
    </div>
  );
}

// ── Halaman utama ─────────────────────────────────────────────

export default function KartuJamaah() {
  const { jamaah, tenant } = useAuth();
  if (!jamaah) return null;

  const info = getOperationalInfo(tenant?.id);

  const rombongan = jamaah.rombongan ?? info.groupCode;
  const bus        = jamaah.nomorBus ?? info.busNumber;
  const kamar      = jamaah.nomorKamar ?? info.roomNumber;
  const hotelMakkah  = jamaah.hotelMakkah  ?? info.hotelMakkah;
  const hotelMadinah = jamaah.hotelMadinah ?? info.hotelMadinah;
  const pembimbing   = jamaah.pembimbingNama     ?? info.guideName;
  const pembimbingWa = jamaah.pembimbingWhatsapp ?? info.guideWhatsapp;

  const namaTravel = tenant?.nama_travel ?? jamaah.travel;

  return (
    <div className="min-h-screen bg-canvas">
      <PageHeader
        title="Kartu Jamaah"
        eyebrow={namaTravel}
        backTo="/beranda"
      />

      <div className="px-4 pb-12 pt-3 space-y-3">

        {/* ── KARTU UTAMA ─────────────────────────────────── */}
        <div
          className="relative overflow-hidden rounded-[28px] shadow-drop-lifted"
          style={{ background: 'linear-gradient(145deg, #0c2340 0%, #0a3d62 55%, #0ea5e9 100%)' }}
        >
          {/* Dekorasi bulat */}
          <div className="pointer-events-none absolute -left-12 -top-12 h-48 w-48 rounded-full bg-white/[0.05]" />
          <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/[0.07]" />
          <div className="pointer-events-none absolute -bottom-16 -right-16 h-56 w-56 rounded-full bg-sky-300/[0.08]" />

          {/* Pola garis diagonal dekoratif */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage: 'repeating-linear-gradient(135deg, #fff 0, #fff 1px, transparent 1px, transparent 12px)',
            }}
          />

          {/* Konten kartu */}
          <div className="relative p-5">

            {/* ── Bagian atas: label + logo travel ── */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-sky-300/70">
                  Kartu Jamaah Digital
                </p>
                <p className="mt-0.5 text-[11px] font-semibold text-white/60">{namaTravel}</p>
              </div>
              {tenant?.logo_url ? (
                <img
                  src={tenant.logo_url}
                  alt={namaTravel}
                  className="h-7 w-auto max-w-[100px] flex-none object-contain"
                  style={{ filter: 'brightness(0) invert(1) opacity(0.7)' }}
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                />
              ) : (
                <span className="rounded-lg border border-white/20 px-3 py-1.5 font-mono text-[9px] uppercase tracking-wider text-white/50">
                  {namaTravel.slice(0, 3).toUpperCase()}
                </span>
              )}
            </div>

            {/* ── Foto avatar placeholder + nama jamaah ── */}
            <div className="mt-5 flex items-center gap-4">
              <div className="flex h-[60px] w-[60px] flex-none items-center justify-center rounded-2xl bg-white/[0.12] ring-2 ring-white/20">
                <IconUser className="h-7 w-7 text-white/60" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="font-display text-[22px] font-bold leading-tight tracking-[-0.5px] text-white">
                  {jamaah.nama}
                </h1>
                <p className="mt-0.5 font-mono text-[11px] tracking-[0.06em] text-sky-200/70">
                  {jamaah.nomorJamaah}
                </p>
              </div>
            </div>

            {/* ── Separator garis putus-putus (gaya boarding pass) ── */}
            <div className="relative my-5 flex items-center gap-0">
              <div className="absolute -left-5 h-5 w-5 rounded-full bg-canvas" />
              <div className="flex-1 border-t-2 border-dashed border-white/20" />
              <div className="absolute -right-5 h-5 w-5 rounded-full bg-canvas" />
            </div>

            {/* ── Chip rombongan / bus / kamar ── */}
            <div className="grid grid-cols-3 gap-2">
              <Chip label="Rombongan" value={rombongan} />
              <Chip label="Bus" value={bus} />
              <Chip label="Kamar" value={kamar} />
            </div>

            {/* ── Kode aktivasi ── */}
            <div
              className="mt-3 flex items-center justify-between rounded-2xl px-4 py-3"
              style={{ background: 'rgba(0,0,0,0.22)' }}
            >
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/40">Kode Aktivasi</p>
              <p className="font-mono text-[16px] font-bold tracking-[0.18em] text-white">
                {jamaah.kodeAktivasi}
              </p>
            </div>
          </div>
        </div>

        {/* ── DETAIL AKOMODASI ─────────────────────────────── */}
        <div className="rounded-2xl border border-hairline bg-white px-4 py-1 shadow-drop-card">
          <p className="pt-3 font-mono text-[8.5px] uppercase tracking-[0.22em] text-mute">
            Informasi Akomodasi
          </p>
          <DetailRow
            label="Hotel Makkah"
            value={hotelMakkah}
            icon={<IconMapPin className="h-3.5 w-3.5 text-primary" />}
          />
          <DetailRow
            label="Hotel Madinah"
            value={hotelMadinah}
            icon={<IconMapPin className="h-3.5 w-3.5 text-charcoal" />}
          />
          <DetailRow
            label="Titik Kumpul"
            value={info.meetingPoint}
            icon={<IconMapPin className="h-3.5 w-3.5 text-gold" />}
          />
        </div>

        {/* ── PEMBIMBING ───────────────────────────────────── */}
        <div className="rounded-2xl border border-hairline bg-white px-4 py-1 shadow-drop-card">
          <p className="pt-3 font-mono text-[8.5px] uppercase tracking-[0.22em] text-mute">
            Pembimbing Rombongan
          </p>
          <div className="flex items-center gap-3 py-4">
            <div className="flex h-12 w-12 flex-none items-center justify-center rounded-2xl bg-surface-bone">
              <IconUser className="h-5 w-5 text-charcoal" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-bold text-ink">{pembimbing}</p>
              <p className="text-[12px] text-charcoal">{info.guideRole}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pb-4">
            <a
              href={whatsappLink(pembimbingWa)}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-[13px] font-bold text-white active:scale-[0.97] transition-all"
            >
              <IconWhatsapp className="h-4 w-4" />
              WhatsApp
            </a>
            <a
              href={`tel:${pembimbingWa}`}
              className="flex items-center justify-center gap-2 rounded-xl border border-hairline bg-surface-bone px-4 py-3 text-[13px] font-bold text-ink active:scale-[0.97] transition-all"
            >
              <IconPhone className="h-4 w-4" />
              Telepon
            </a>
          </div>
        </div>

        {/* ── DARURAT ─────────────────────────────────────── */}
        <div
          className="rounded-2xl border px-4 py-4"
          style={{ background: '#fff8ee', borderColor: 'rgba(212,162,78,0.25)' }}
        >
          <div className="flex items-start gap-3">
            <div
              className="flex h-9 w-9 flex-none items-center justify-center rounded-xl text-[18px]"
              style={{ background: 'rgba(212,162,78,0.14)' }}
            >
              ⚠️
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-bold text-amber-800">Jika tersesat atau butuh bantuan</p>
              <p className="mt-1 text-[12px] leading-relaxed text-amber-700">{info.emergencyNote}</p>
            </div>
          </div>
        </div>

        {/* ── Catatan screenshot ──────────────────────────── */}
        <p className="text-center text-[11px] leading-relaxed text-mute">
          Screenshot halaman ini dan simpan offline agar bisa ditunjukkan saat dibutuhkan.
        </p>

      </div>
    </div>
  );
}
