import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  getFocusByFase,
  getLatestAnnouncement,
  getOperationalInfo,
  whatsappLink,
} from '../../data/travelCompanion';
import { IconChevron } from '../icons';

// ── Ikon ─────────────────────────────────────────────────────

function IconBell({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
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

function IconWhatsapp({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
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

// ── 1. Identity Band ─────────────────────────────────────────
// Kartu identitas bergaya "boarding pass" — left accent stripe

export function TripIdentityCard({ desktop = false }: { desktop?: boolean }) {
  const { jamaah, tenant } = useAuth();
  if (!jamaah) return null;

  const info = getOperationalInfo(tenant?.id);
  const hotelMakkah  = jamaah.hotelMakkah  ?? info.hotelMakkah;
  const hotelMadinah = jamaah.hotelMadinah ?? info.hotelMadinah;
  const firstName  = jamaah.nama.split(' ')[0];

  return (
    <div className={`overflow-hidden rounded-2xl border border-hairline bg-white shadow-drop-card ${desktop ? '' : ''}`}>
      {/* Left accent bar + content */}
      <div className="flex">
        {/* Accent stripe */}
        <div className="w-1 flex-none" style={{ background: 'linear-gradient(to bottom, #0ea5e9, #0284c7)' }} />

        <div className="flex-1 p-4">
          {/* Top row */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="font-mono text-[8.5px] uppercase tracking-[0.22em] text-mute">Identitas Perjalanan</p>
              <p className="mt-0.5 text-[16px] font-bold leading-tight text-ink">{firstName}</p>
              <p className="mt-0.5 text-[12px] font-semibold text-primary">{tenant?.nama_travel ?? jamaah.travel}</p>
            </div>
            <Link
              to="/profil/kartu"
              className="flex-none rounded-xl bg-surface-bone px-3 py-2 text-[11px] font-semibold text-charcoal active:scale-[0.96] transition-all hover:bg-primary/10 hover:text-primary"
            >
              Kartu →
            </Link>
          </div>

          {/* Hotel */}
          <div className="mt-2 grid grid-cols-2 gap-2">
            {[
              { l: 'Hotel Makkah',  v: hotelMakkah,  icon: <IconMapPin className="h-3 w-3 text-primary" /> },
              { l: 'Hotel Madinah', v: hotelMadinah, icon: <IconMapPin className="h-3 w-3 text-charcoal" /> },
            ].map(({ l, v, icon }) => (
              <div key={l} className="flex items-start gap-1.5 rounded-xl bg-surface-bone px-2.5 py-2">
                <span className="mt-0.5 flex-none">{icon}</span>
                <div className="min-w-0">
                  <p className="font-mono text-[7px] uppercase tracking-[0.12em] text-ash">{l}</p>
                  <p className="mt-0.5 text-[11px] font-semibold leading-snug text-ink">{v}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 2. Focus Card ─────────────────────────────────────────────
// Editorial — full width, besar, jelas

export function TripFocusCard({ desktop = false }: { desktop?: boolean }) {
  const { jamaah } = useAuth();
  if (!jamaah) return null;

  const focus = getFocusByFase(jamaah.fase);

  return (
    <div
      className="relative overflow-hidden rounded-2xl p-4"
      style={{ background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', border: '1.5px solid rgba(14,165,233,0.18)' }}
    >
      {/* Dekorasi halus */}
      <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-primary/[0.07]" />

      <div className="relative">
        <p className="font-mono text-[8.5px] uppercase tracking-[0.22em] text-primary/60">Fokus Perjalanan</p>
        <h3 className={`mt-1 font-display font-bold leading-tight text-ink ${desktop ? 'text-[18px]' : 'text-[17px]'}`}>
          {focus.title}
        </h3>
        <p className={`mt-1.5 leading-relaxed text-charcoal ${desktop ? 'text-[13px]' : 'text-[12px]'}`}>
          {focus.description}
        </p>
        <Link
          to={focus.ctaTo}
          className="mt-3 inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-[12px] font-bold text-white active:scale-[0.97] transition-all shadow-[0_4px_12px_rgba(14,165,233,0.3)]"
          style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)' }}
        >
          {focus.ctaLabel} <IconChevron className="h-3 w-3" />
        </Link>
      </div>
    </div>
  );
}

// ── 3. Announcement Strip ─────────────────────────────────────
// Bukan card penuh — strip ringkas dengan badge

export function TravelAnnouncementCard({ desktop = false, compact = false }: { desktop?: boolean; compact?: boolean }) {
  const { tenant } = useAuth();
  const announcement = getLatestAnnouncement(tenant?.id);
  if (!announcement) return null;

  if (compact) {
    return (
      <Link
        to="/pengumuman"
        className="flex flex-col rounded-2xl p-3.5 h-full active:scale-[0.97] transition-transform"
        style={{
          background: announcement.important ? 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)' : '#ffffff',
          border: `1.5px solid ${announcement.important ? 'rgba(212,162,78,0.3)' : 'rgba(0,0,0,0.07)'}`,
        }}
      >
        <div
          className="flex h-8 w-8 flex-none items-center justify-center rounded-xl mb-2.5"
          style={{ background: 'rgba(212,162,78,0.14)', border: '1px solid rgba(212,162,78,0.22)' }}
        >
          <IconBell className="h-3.5 w-3.5 text-gold" />
        </div>
        <span
          className="mb-1 self-start rounded-full px-2 py-0.5 font-mono text-[7px] font-bold uppercase tracking-[0.15em]"
          style={{ background: 'rgba(212,162,78,0.18)', color: '#a07828' }}
        >
          {announcement.label}
        </span>
        <p className="font-mono text-[7px] uppercase tracking-[0.12em] text-mute">Dari Travel</p>
        <p className="mt-1 text-[12px] font-semibold leading-snug text-ink line-clamp-2">
          {announcement.title}
        </p>
        <span className="mt-auto pt-2 inline-flex items-center gap-1 font-mono text-[8px] font-semibold uppercase tracking-wider text-[#a07828]">
          Lihat Semua <IconChevron className="h-2.5 w-2.5" />
        </span>
      </Link>
    );
  }

  return (
    <div
      className="flex items-start gap-3 rounded-2xl p-4"
      style={{
        background: announcement.important ? 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)' : '#ffffff',
        border: `1.5px solid ${announcement.important ? 'rgba(212,162,78,0.3)' : 'rgba(0,0,0,0.07)'}`,
      }}
    >
      <div
        className="flex h-9 w-9 flex-none items-center justify-center rounded-xl"
        style={{ background: 'rgba(212,162,78,0.14)', border: '1px solid rgba(212,162,78,0.22)' }}
      >
        <IconBell className="h-4 w-4 text-gold" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="rounded-full px-2 py-0.5 font-mono text-[7.5px] font-bold uppercase tracking-[0.15em]"
            style={{ background: 'rgba(212,162,78,0.18)', color: '#a07828' }}
          >
            {announcement.label}
          </span>
          <span className="font-mono text-[7.5px] uppercase tracking-[0.12em] text-mute">Dari Travel</span>
        </div>
        <p className={`mt-1 font-semibold leading-snug text-ink ${desktop ? 'text-[14px]' : 'text-[13px]'}`}>
          {announcement.title}
        </p>
        <p className={`mt-0.5 leading-relaxed text-charcoal ${desktop ? 'text-[13px]' : 'text-[11px]'}`}>
          {announcement.content}
        </p>
      </div>
    </div>
  );
}

// ── 4. Emergency / Guide Contact ──────────────────────────────
// Compact contact strip dengan tombol WA + Telepon

export function EmergencyGuideCard({ desktop = false, compact = false }: { desktop?: boolean; compact?: boolean }) {
  const { jamaah, tenant } = useAuth();
  if (!jamaah) return null;

  const info         = getOperationalInfo(tenant?.id);
  const pembimbing   = jamaah.pembimbingNama     ?? info.guideName;
  const pembimbingWa = jamaah.pembimbingWhatsapp ?? info.guideWhatsapp;

  if (compact) {
    return (
      <div className="flex flex-col rounded-2xl border border-hairline bg-white shadow-drop-card p-3.5 h-full">
        <div className="flex h-8 w-8 flex-none items-center justify-center rounded-xl bg-red-50 mb-2.5">
          <IconPhone className="h-3.5 w-3.5 text-red-400" />
        </div>
        <p className="font-mono text-[7px] uppercase tracking-[0.2em] text-mute">Butuh Bantuan?</p>
        <p className="mt-1 text-[12px] font-bold leading-snug text-ink">{pembimbing}</p>
        <p className="mt-0.5 text-[10px] text-charcoal">{info.guideRole}</p>
        <a
          href={whatsappLink(pembimbingWa)}
          target="_blank"
          rel="noreferrer"
          className="mt-auto pt-3 flex items-center justify-center gap-1.5 rounded-xl py-2 text-[11px] font-bold text-white active:scale-[0.97] transition-all"
          style={{ background: '#25D366' }}
        >
          <IconWhatsapp className="h-3.5 w-3.5" />
          WA
        </a>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border border-hairline bg-white shadow-drop-card ${desktop ? 'p-4' : 'p-4'}`}>
      <div className="flex items-center gap-3 mb-3">
        <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-red-50">
          <IconPhone className="h-4 w-4 text-red-400" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[8.5px] uppercase tracking-[0.2em] text-mute">Butuh Bantuan?</p>
          <p className={`mt-0.5 font-bold text-ink ${desktop ? 'text-[15px]' : 'text-[14px]'}`}>{pembimbing}</p>
          <p className="text-[11px] text-charcoal">{info.guideRole}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <a
          href={whatsappLink(pembimbingWa)}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 rounded-xl py-2.5 text-[12px] font-bold text-white active:scale-[0.97] transition-all"
          style={{ background: '#25D366' }}
        >
          <IconWhatsapp className="h-4 w-4" />
          WhatsApp
        </a>
        <a
          href={`tel:${pembimbingWa}`}
          className="flex items-center justify-center gap-2 rounded-xl border border-hairline bg-surface-bone py-2.5 text-[12px] font-bold text-ink active:scale-[0.97] transition-all"
        >
          <IconPhone className="h-3.5 w-3.5" />
          Telepon
        </a>
      </div>
    </div>
  );
}

// ── TravelCompanionFlow — gabungan ────────────────────────────

export function TravelCompanionFlow({ desktop = false }: { desktop?: boolean }) {
  if (desktop) {
    return (
      <div className="grid grid-cols-3 gap-4">
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
    <div className="space-y-3">
      <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-mute">Perjalanan Saya</p>
      <TripIdentityCard />
      <TripFocusCard />
      <div className="grid grid-cols-2 gap-3 items-stretch">
        <TravelAnnouncementCard compact />
        <EmergencyGuideCard compact />
      </div>
    </div>
  );
}
