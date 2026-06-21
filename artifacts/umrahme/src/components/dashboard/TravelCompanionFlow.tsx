import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  getFocusByFase,
  getLatestAnnouncement,
  getOperationalInfo,
  whatsappLink,
} from '../../data/travelCompanion';
import { IconChevron } from '../icons';

// ── Ikon lokal ────────────────────────────────────────────────

function IconBell({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function IconPhone({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.74a16 16 0 0 0 6.26 6.26l1.28-1.28a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function IconIdCard({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="9" cy="12" r="2" />
      <path d="M14 10h4M14 14h3M7 16c.6-1.2 3.4-1.2 4 0" />
    </svg>
  );
}

function IconRoute({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="6" cy="19" r="2" />
      <circle cx="18" cy="5" r="2" />
      <path d="M8 19h3a4 4 0 0 0 0-8H9a4 4 0 0 1 0-8h7" />
    </svg>
  );
}

function IconBuilding({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 22V12h6v10M9 7h.01M15 7h.01M9 11h.01M15 11h.01" />
    </svg>
  );
}

// ── 1. TripIdentityCard ───────────────────────────────────────
// Menampilkan identitas perjalanan: travel, rombongan, bus, kamar, hotel

export function TripIdentityCard({ desktop = false }: { desktop?: boolean }) {
  const { jamaah, tenant } = useAuth();
  if (!jamaah) return null;

  const info = getOperationalInfo(tenant?.id);
  const rombongan = jamaah.rombongan ?? info.groupCode;
  const bus = jamaah.nomorBus ?? info.busNumber;
  const kamar = jamaah.nomorKamar ?? info.roomNumber;
  const hotelMakkah = jamaah.hotelMakkah ?? info.hotelMakkah;
  const hotelMadinah = jamaah.hotelMadinah ?? info.hotelMadinah;
  const firstName = jamaah.nama.split(' ')[0];

  if (desktop) {
    return (
      <div className="rounded-2xl border border-hairline bg-white p-5 shadow-drop-card">
        <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-mute">Identitas Perjalanan</p>
        <h3 className="mt-1 text-[17px] font-bold text-ink">{jamaah.nama}</h3>
        <p className="mt-0.5 text-[12px] text-charcoal">{tenant?.nama_travel ?? jamaah.travel}</p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {[
            { l: 'Rombongan', v: rombongan },
            { l: 'Bus', v: bus },
            { l: 'Kamar', v: kamar },
          ].map(({ l, v }) => (
            <div key={l} className="rounded-xl bg-surface-bone px-3 py-2">
              <p className="font-mono text-[8px] uppercase tracking-[0.15em] text-mute">{l}</p>
              <p className="mt-0.5 text-[12px] font-bold text-ink">{v}</p>
            </div>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {[
            { l: 'Hotel Makkah', v: hotelMakkah },
            { l: 'Hotel Madinah', v: hotelMadinah },
          ].map(({ l, v }) => (
            <div key={l} className="rounded-xl bg-surface-bone px-3 py-2">
              <p className="font-mono text-[8px] uppercase tracking-[0.15em] text-mute">{l}</p>
              <p className="mt-0.5 text-[11px] font-semibold leading-snug text-ink">{v}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-hairline bg-white p-4 shadow-drop-card">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-mute">Identitas Perjalanan</p>
          <h3 className="mt-1 text-[16px] font-bold leading-snug text-ink">
            Assalamu'alaikum, {firstName}
          </h3>
          <p className="mt-0.5 text-[12px] font-semibold text-primary">
            {tenant?.nama_travel ?? jamaah.travel}
          </p>
          <p className="mt-1 text-[11px] text-charcoal">
            {rombongan} · {bus} · Kamar {kamar}
          </p>
        </div>
        <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-surface-bone">
          <IconBuilding className="h-5 w-5 text-charcoal" />
        </div>
      </div>

      {/* Hotel info */}
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-xl bg-surface-bone px-3 py-2">
          <p className="font-mono text-[8px] uppercase tracking-[0.15em] text-mute">Hotel Makkah</p>
          <p className="mt-0.5 text-[11px] font-semibold leading-snug text-ink">{hotelMakkah}</p>
        </div>
        <div className="rounded-xl bg-surface-bone px-3 py-2">
          <p className="font-mono text-[8px] uppercase tracking-[0.15em] text-mute">Hotel Madinah</p>
          <p className="mt-0.5 text-[11px] font-semibold leading-snug text-ink">{hotelMadinah}</p>
        </div>
      </div>
    </div>
  );
}

// ── 2. TripFocusCard ──────────────────────────────────────────
// Menampilkan arahan fokus perjalanan berdasarkan fase

export function TripFocusCard({ desktop = false }: { desktop?: boolean }) {
  const { jamaah } = useAuth();
  if (!jamaah) return null;

  const focus = getFocusByFase(jamaah.fase);

  return (
    <div className={`rounded-2xl border border-hairline bg-white shadow-drop-card ${desktop ? 'p-5' : 'p-4'}`}>
      <div className="flex items-start gap-3">
        <div
          className="flex h-10 w-10 flex-none items-center justify-center rounded-xl"
          style={{
            background: 'linear-gradient(135deg, rgba(14,165,233,0.10) 0%, rgba(14,165,233,0.04) 100%)',
            border: '1.5px solid rgba(14,165,233,0.16)',
          }}
        >
          <IconRoute className="h-4 w-4 text-primary" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-mute">Fokus Perjalanan</p>
          <h3 className={`mt-0.5 font-bold leading-snug text-ink ${desktop ? 'text-[16px]' : 'text-[14px]'}`}>{focus.title}</h3>
          <p className={`mt-1 leading-relaxed text-charcoal ${desktop ? 'text-[13px]' : 'text-[12px]'}`}>{focus.description}</p>
          <Link
            to={focus.ctaTo}
            className="mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-[11px] font-bold text-white active:scale-[0.97] transition-all"
          >
            {focus.ctaLabel} <IconChevron className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── 3. TravelAnnouncementCard ─────────────────────────────────
// Menampilkan pengumuman penting dari travel

export function TravelAnnouncementCard({ desktop = false }: { desktop?: boolean }) {
  const { tenant } = useAuth();
  const announcement = getLatestAnnouncement(tenant?.id);

  if (!announcement) return null;

  return (
    <div
      className={`rounded-2xl border shadow-drop-card ${desktop ? 'p-5' : 'p-4'}`}
      style={{
        background: announcement.important ? '#fff8ee' : '#ffffff',
        borderColor: announcement.important ? 'rgba(212,162,78,0.28)' : 'rgba(0,0,0,0.06)',
      }}
    >
      <div className="flex items-start gap-3">
        <div
          className="flex h-10 w-10 flex-none items-center justify-center rounded-xl"
          style={{
            background: 'linear-gradient(135deg, #fffcf0 0%, #fdf0d8 100%)',
            border: '1.5px solid rgba(212,162,78,0.26)',
          }}
        >
          <IconBell className="h-4 w-4 text-gold" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className="inline-flex items-center rounded-full px-2 py-0.5 font-mono text-[8px] font-semibold uppercase tracking-[0.15em]"
              style={{ background: 'rgba(212,162,78,0.14)', color: '#a07828' }}
            >
              {announcement.label}
            </span>
            <p className="font-mono text-[8px] uppercase tracking-[0.15em] text-mute">Dari Travel</p>
          </div>
          <h3 className={`mt-1 font-bold leading-snug text-ink ${desktop ? 'text-[15px]' : 'text-[13px]'}`}>{announcement.title}</h3>
          <p className={`mt-1 leading-relaxed text-charcoal ${desktop ? 'text-[13px]' : 'text-[12px]'}`}>{announcement.content}</p>
        </div>
      </div>
    </div>
  );
}

// ── 4. EmergencyGuideCard ─────────────────────────────────────
// Kontak pembimbing + tombol bantuan darurat

export function EmergencyGuideCard({ desktop = false }: { desktop?: boolean }) {
  const { jamaah, tenant } = useAuth();
  if (!jamaah) return null;

  const info = getOperationalInfo(tenant?.id);
  const pembimbing = jamaah.pembimbingNama ?? info.guideName;
  const pembimbingWa = jamaah.pembimbingWhatsapp ?? info.guideWhatsapp;

  return (
    <div className={`rounded-2xl border border-hairline bg-white shadow-drop-card ${desktop ? 'p-5' : 'p-4'}`}>
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-red-50">
          <IconPhone className="h-4 w-4 text-red-500" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-mute">Butuh Bantuan?</p>
          <h3 className={`mt-0.5 font-bold leading-snug text-ink ${desktop ? 'text-[16px]' : 'text-[14px]'}`}>{pembimbing}</h3>
          <p className="mt-0.5 text-[11px] text-charcoal">{info.guideRole} · {info.meetingPoint}</p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <a
          href={whatsappLink(pembimbingWa)}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-[12px] font-bold text-white active:scale-[0.97] transition-all"
        >
          <IconPhone className="h-3.5 w-3.5" />
          WhatsApp
        </a>
        <a
          href={`tel:${pembimbingWa}`}
          className="flex items-center justify-center gap-2 rounded-xl border border-hairline bg-surface-bone px-4 py-3 text-[12px] font-bold text-ink active:scale-[0.97] transition-all"
        >
          <IconPhone className="h-3.5 w-3.5" />
          Telepon
        </a>
      </div>
    </div>
  );
}

// ── 5. DigitalJamaahCardPreview ───────────────────────────────
// Preview kartu jamaah digital — klik buka /profil/kartu

export function DigitalJamaahCardPreview() {
  const { jamaah, tenant } = useAuth();
  if (!jamaah) return null;

  const info = getOperationalInfo(tenant?.id);
  const rombongan = jamaah.rombongan ?? info.groupCode;
  const bus = jamaah.nomorBus ?? info.busNumber;
  const kamar = jamaah.nomorKamar ?? info.roomNumber;

  return (
    <Link
      to="/profil/kartu"
      className="block active:scale-[0.99] transition-all"
    >
      <div
        className="relative overflow-hidden rounded-2xl p-4 text-white shadow-drop-lifted"
        style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-deep) 100%)' }}
      >
        <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -right-2 bottom-0 h-20 w-20 rounded-full bg-black/10" />

        <div className="relative">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <IconIdCard className="h-4 w-4 text-white/70" />
                <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/60">Kartu Jamaah Digital</p>
              </div>
              <h3 className="mt-1.5 text-[17px] font-bold leading-tight">{jamaah.nama}</h3>
              <p className="mt-0.5 text-[12px] text-white/70">{tenant?.nama_travel ?? jamaah.travel}</p>
            </div>

            {tenant?.logo_url && (
              <img
                src={tenant.logo_url}
                alt={tenant.nama_travel}
                className="h-7 w-auto max-w-[90px] flex-none object-contain"
                style={{ filter: 'brightness(0) invert(1)' }}
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
              />
            )}
          </div>

          <div className="mt-4 flex items-center gap-2">
            {[
              { l: 'Rombongan', v: rombongan },
              { l: 'Bus', v: bus },
              { l: 'Kamar', v: kamar },
            ].map(({ l, v }) => (
              <div key={l} className="flex-1 rounded-xl bg-white/[0.12] px-2.5 py-2 text-center">
                <p className="font-mono text-[7px] uppercase tracking-[0.1em] text-white/50">{l}</p>
                <p className="mt-0.5 text-[12px] font-bold">{v}</p>
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between">
            <p className="text-[11px] text-white/60">Tap untuk buka kartu lengkap</p>
            <span className="inline-flex items-center gap-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-white/80">
              Buka <IconChevron className="h-3 w-3" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// ── TravelCompanionFlow — gabungan semua section ──────────────

export function TravelCompanionFlow({ desktop = false }: { desktop?: boolean }) {
  if (desktop) {
    return (
      <div className="mb-6 grid grid-cols-3 gap-4">
        <TripIdentityCard desktop />
        <div className="flex flex-col gap-4">
          <TripFocusCard desktop />
          <TravelAnnouncementCard desktop />
        </div>
        <EmergencyGuideCard desktop />
      </div>
    );
  }

  return (
    <section className="px-5 pb-4 space-y-3">
      <TripIdentityCard />
      <TripFocusCard />
      <TravelAnnouncementCard />
      <EmergencyGuideCard />
      <DigitalJamaahCardPreview />
    </section>
  );
}
