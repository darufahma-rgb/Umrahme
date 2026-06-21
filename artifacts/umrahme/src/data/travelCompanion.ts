import type { Fase } from '../types';

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
  travelWhatsapp: string;
  emergencyNote: string;
};

const DEFAULT_OPERATIONAL_INFO: TravelOperationalInfo = {
  groupCode: 'Rombongan A',
  busNumber: 'Bus 3',
  roomNumber: '804',
  hotelMakkah: 'Hotel Makkah — diisi travel',
  hotelMadinah: 'Hotel Madinah — diisi travel',
  meetingPoint: 'Lobby hotel / titik kumpul dari pembimbing',
  guideName: 'Ust. Pembimbing',
  guideRole: 'Pembimbing Rombongan',
  guideWhatsapp: '6281234567890',
  travelWhatsapp: '6281234567890',
  emergencyNote: 'Jika tersesat, tetap tenang. Hubungi pembimbing dan tunjukkan Kartu Jamaah Digital.',
};

const DEFAULT_ANNOUNCEMENTS: TravelAnnouncement[] = [
  {
    id: 'announcement-1',
    label: 'Penting',
    title: 'Perhatikan titik kumpul hari ini',
    content: 'Jamaah dimohon berkumpul sesuai arahan pembimbing. Bawa sandal, tas kecil, kartu jamaah, dan tetap bersama rombongan.',
    important: true,
    publishedAt: new Date().toISOString(),
  },
];

export function getOperationalInfo(_tenantId?: string | null): TravelOperationalInfo {
  return DEFAULT_OPERATIONAL_INFO;
}

export function getLatestAnnouncement(_tenantId?: string | null): TravelAnnouncement | null {
  return DEFAULT_ANNOUNCEMENTS[0] ?? null;
}

export function getFocusByFase(fase: Fase): {
  title: string;
  description: string;
  ctaLabel: string;
  ctaTo: string;
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
