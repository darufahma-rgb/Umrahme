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
  {
    id: 'announcement-2',
    label: 'Info',
    title: 'Jadwal keberangkatan ke Madinah',
    content: 'Bus berangkat pukul 08.00 WAS dari lobby hotel. Pastikan jamaah sudah siap 30 menit sebelumnya dengan seluruh barang bawaan.',
    important: false,
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
  },
  {
    id: 'announcement-3',
    label: 'Penting',
    title: 'Pengumpulan paspor untuk proses visa',
    content: 'Mohon kumpulkan paspor kepada ketua rombongan masing-masing paling lambat malam ini pukul 21.00.',
    important: true,
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: 'announcement-4',
    label: 'Info',
    title: 'Pembagian makan malam di hotel',
    content: 'Makan malam tersedia di restoran lantai 2 mulai pukul 19.00 s/d 21.00. Tunjukkan gelang jamaah saat masuk.',
    important: false,
    publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
  },
];

export function getOperationalInfo(_tenantId?: string | null): TravelOperationalInfo {
  return DEFAULT_OPERATIONAL_INFO;
}

export function getLatestAnnouncement(_tenantId?: string | null): TravelAnnouncement | null {
  return DEFAULT_ANNOUNCEMENTS[0] ?? null;
}

export function getAllAnnouncements(_tenantId?: string | null): TravelAnnouncement[] {
  return DEFAULT_ANNOUNCEMENTS;
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
