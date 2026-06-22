import { supabase, type TenantRow, type TravelAnnouncementRow } from '../lib/supabase';
import type { Fase } from '../types';

// ── Tipe ──────────────────────────────────────────────────────

export type TravelAnnouncement = {
  id: string;
  label: string;
  title: string;
  content: string;
  important?: boolean;
  publishedAt: string;
};

export type TravelOperationalInfo = {
  groupCode: string;
  busNumber: string;
  roomNumber: string;
  hotelMakkah: string;
  hotelMadinah: string;
  meetingPoint: string;
  guideName: string;
  guideRole: string;
  guideWhatsapp: string;
  tourLeaderName: string;
  tourLeaderRole: string;
  tourLeaderWhatsapp: string;
  travelWhatsapp: string;
  emergencyNote: string;
};

export type DailyInstruction = {
  id: string;
  title: string;
  meetingTime: string;
  meetingPoint: string;
  dressCode: string;
  bringItems: string[];
  note: string;
};

// ── Default / fallback ─────────────────────────────────────────

const DEFAULT_OPERATIONAL_INFO: TravelOperationalInfo = {
  groupCode:          'Rombongan A',
  busNumber:          'Bus 3',
  roomNumber:         '804',
  hotelMakkah:        'Swissôtel Makkah',
  hotelMadinah:       'Maden Hotel Madinah',
  meetingPoint:       'Lobby utama hotel',
  guideName:          'Ust. Muthowwif',
  guideRole:          'Muthowwif Rombongan',
  guideWhatsapp:      '6281234567890',
  tourLeaderName:     'Bpk. Tour Leader',
  tourLeaderRole:     'Tour Leader',
  tourLeaderWhatsapp: '6289876543210',
  travelWhatsapp:     '6281234567890',
  emergencyNote:      'Jika tersesat, tetap tenang. Hubungi pembimbing dan tunjukkan Kartu Jamaah Digital kepada petugas terdekat.',
};

// ── Fungsi sync ────────────────────────────────────────────────

/** Gabungkan data tenant dari DB dengan fallback DEFAULT per field. */
export function getOperationalInfo(tenant: TenantRow | null): TravelOperationalInfo {
  if (!tenant) return DEFAULT_OPERATIONAL_INFO;
  return {
    groupCode:          DEFAULT_OPERATIONAL_INFO.groupCode,
    busNumber:          DEFAULT_OPERATIONAL_INFO.busNumber,
    roomNumber:         DEFAULT_OPERATIONAL_INFO.roomNumber,
    hotelMakkah:        tenant.hotel_makkah        ?? DEFAULT_OPERATIONAL_INFO.hotelMakkah,
    hotelMadinah:       tenant.hotel_madinah       ?? DEFAULT_OPERATIONAL_INFO.hotelMadinah,
    meetingPoint:       tenant.meeting_point       ?? DEFAULT_OPERATIONAL_INFO.meetingPoint,
    guideName:          tenant.guide_name          ?? DEFAULT_OPERATIONAL_INFO.guideName,
    guideRole:          'Muthowwif Rombongan',
    guideWhatsapp:      tenant.guide_whatsapp      ?? DEFAULT_OPERATIONAL_INFO.guideWhatsapp,
    tourLeaderName:     tenant.tour_leader_name    ?? DEFAULT_OPERATIONAL_INFO.tourLeaderName,
    tourLeaderRole:     'Tour Leader',
    tourLeaderWhatsapp: tenant.tour_leader_whatsapp ?? DEFAULT_OPERATIONAL_INFO.tourLeaderWhatsapp,
    travelWhatsapp:     tenant.guide_whatsapp      ?? DEFAULT_OPERATIONAL_INFO.travelWhatsapp,
    emergencyNote:      tenant.emergency_note      ?? DEFAULT_OPERATIONAL_INFO.emergencyNote,
  };
}

/** Instruksi harian untuk dashboard. Sumber: nanti dari DB, sekarang static placeholder. */
export function getTodayInstruction(_tenantId?: string | null): DailyInstruction {
  return {
    id: 'instruction-1',
    title: 'Persiapan kegiatan hari ini',
    meetingTime: '04.30',
    meetingPoint: 'Lobby utama hotel',
    dressCode: 'Pakaian ihram / seragam sesuai arahan pembimbing',
    bringItems: ['Sandal', 'Tas kecil', 'Kartu jamaah', 'Botol minum'],
    note: 'Tetap bersama rombongan dan ikuti arahan pembimbing.',
  };
}

// ── Fungsi async (query Supabase) ──────────────────────────────

function rowToAnnouncement(row: TravelAnnouncementRow): TravelAnnouncement {
  return {
    id:          row.id,
    label:       row.label,
    title:       row.title,
    content:     row.content,
    important:   row.important,
    publishedAt: row.published_at,
  };
}

export async function getLatestAnnouncement(tenantId: string | null): Promise<TravelAnnouncement | null> {
  if (!tenantId) return null;
  const { data, error } = await supabase
    .from('travel_announcements')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('published_at', { ascending: false })
    .limit(1)
    .single();
  if (error || !data) return null;
  return rowToAnnouncement(data as TravelAnnouncementRow);
}

export async function getAllAnnouncements(tenantId: string | null): Promise<TravelAnnouncement[]> {
  if (!tenantId) return [];
  const { data, error } = await supabase
    .from('travel_announcements')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('published_at', { ascending: false });
  if (error || !data) return [];
  return (data as TravelAnnouncementRow[]).map(rowToAnnouncement);
}

// ── Helper UI ──────────────────────────────────────────────────

export function getFocusByFase(fase: Fase): {
  title: string; description: string; ctaLabel: string; ctaTo: string;
} {
  if (fase === 'tanah-suci') {
    return {
      title: 'Fokus ibadah hari ini',
      description: "Ikuti arahan pembimbing, buka panduan ibadah, dan gunakan counter saat tawaf atau sa'i.",
      ctaLabel: 'Buka Navigator',
      ctaTo: '/ibadah/navigator',
    };
  }
  if (fase === 'selesai') {
    return {
      title: 'Jaga kenangan perjalanan',
      description: 'Lengkapi jurnal, simpan sertifikat, dan terus jaga amal setelah pulang.',
      ctaLabel: 'Buka Jurnal',
      ctaTo: '/profil/jurnal',
    };
  }
  return {
    title: 'Persiapkan keberangkatan',
    description: 'Lengkapi checklist, dokumen, perlengkapan, dan pahami tata cara umrah sebelum berangkat.',
    ctaLabel: 'Cek Persiapan',
    ctaTo: '/profil/persiapan',
  };
}

export function whatsappLink(phone: string, message = "Assalamu'alaikum, saya butuh bantuan selama perjalanan umrah."): string {
  const clean = phone.replace(/\D/g, '');
  const normalized = clean.startsWith('0') ? `62${clean.slice(1)}` : clean;
  return `https://wa.me/${normalized}?text=${encodeURIComponent(message)}`;
}
