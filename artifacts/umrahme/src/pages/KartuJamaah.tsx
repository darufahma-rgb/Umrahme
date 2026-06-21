import PageHeader from '../components/PageHeader';
import { useAuth } from '../context/AuthContext';
import { getOperationalInfo, whatsappLink } from '../data/travelCompanion';

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-hairline py-3 last:border-b-0">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute">{label}</p>
      <p className="max-w-[60%] text-right text-[13px] font-semibold leading-snug text-ink">{value}</p>
    </div>
  );
}

export default function KartuJamaah() {
  const { jamaah, tenant } = useAuth();
  if (!jamaah) return null;

  const info = getOperationalInfo(tenant?.id);

  const rombongan = jamaah.rombongan ?? info.groupCode;
  const bus = jamaah.nomorBus ?? info.busNumber;
  const kamar = jamaah.nomorKamar ?? info.roomNumber;
  const hotelMakkah = jamaah.hotelMakkah ?? info.hotelMakkah;
  const hotelMadinah = jamaah.hotelMadinah ?? info.hotelMadinah;
  const pembimbing = jamaah.pembimbingNama ?? info.guideName;
  const pembimbingWa = jamaah.pembimbingWhatsapp ?? info.guideWhatsapp;

  return (
    <div className="min-h-screen bg-canvas">
      <PageHeader
        title="Kartu Jamaah"
        eyebrow={tenant?.nama_travel ?? jamaah.travel}
        backTo="/beranda"
      />

      <div className="px-4 pb-10 pt-4">
        <div
          className="relative overflow-hidden rounded-[28px] p-5 text-white shadow-drop-lifted"
          style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-deep) 100%)' }}
        >
          <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -right-4 -bottom-20 h-48 w-48 rounded-full bg-black/10" />

          <div className="relative">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/60">Kartu Jamaah Digital</p>
                <h1 className="mt-2 font-display text-[28px] font-bold leading-tight tracking-[-0.8px]">{jamaah.nama}</h1>
                <p className="mt-1 text-[13px] text-white/70">{tenant?.nama_travel ?? jamaah.travel}</p>
              </div>

              {tenant?.logo_url && (
                <img
                  src={tenant.logo_url}
                  alt={tenant.nama_travel}
                  className="h-8 w-auto max-w-[110px] object-contain"
                  style={{ filter: 'brightness(0) invert(1)' }}
                />
              )}
            </div>

            <div className="mt-8 grid grid-cols-3 gap-2">
              <div className="rounded-2xl bg-white/[0.12] px-3 py-3 backdrop-blur">
                <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/50">Rombongan</p>
                <p className="mt-1 text-[13px] font-bold">{rombongan}</p>
              </div>
              <div className="rounded-2xl bg-white/[0.12] px-3 py-3 backdrop-blur">
                <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/50">Bus</p>
                <p className="mt-1 text-[13px] font-bold">{bus}</p>
              </div>
              <div className="rounded-2xl bg-white/[0.12] px-3 py-3 backdrop-blur">
                <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/50">Kamar</p>
                <p className="mt-1 text-[13px] font-bold">{kamar}</p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl bg-black/[0.14] px-4 py-3">
              <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/45">Kode Aktivasi</p>
              <p className="mt-1 font-mono text-[15px] font-bold tracking-[0.12em]">{jamaah.kodeAktivasi}</p>
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-hairline bg-white px-5 py-2 shadow-drop-card">
          <InfoRow label="Nomor Jamaah" value={jamaah.nomorJamaah} />
          <InfoRow label="Hotel Makkah" value={hotelMakkah} />
          <InfoRow label="Hotel Madinah" value={hotelMadinah} />
          <InfoRow label="Titik Kumpul" value={info.meetingPoint} />
          <InfoRow label="Pembimbing" value={pembimbing} />
        </div>

        <div className="mt-4 rounded-2xl border border-red-100 bg-red-50 px-5 py-4">
          <p className="text-[14px] font-bold text-red-700">Jika tersesat atau butuh bantuan</p>
          <p className="mt-1 text-[12px] leading-relaxed text-red-600">{info.emergencyNote}</p>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <a
              href={whatsappLink(pembimbingWa)}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center rounded-xl bg-red-600 px-4 py-3 text-[12px] font-bold text-white active:scale-[0.98]"
            >
              WhatsApp
            </a>
            <a
              href={`tel:${pembimbingWa}`}
              className="flex items-center justify-center rounded-xl border border-red-200 bg-white px-4 py-3 text-[12px] font-bold text-red-600 active:scale-[0.98]"
            >
              Telepon
            </a>
          </div>
        </div>

        <p className="mt-4 text-center text-[11px] leading-relaxed text-mute">
          Simpan halaman ini atau screenshot kartu jamaah agar mudah ditunjukkan saat dibutuhkan.
        </p>
      </div>
    </div>
  );
}
