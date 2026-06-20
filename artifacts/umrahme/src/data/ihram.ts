import type { LaranganIhram, IhramSection } from '../types';

// =============================================================
// DATA PANDUAN IHRAM
// Larangan dipisah per gender (laki-laki / perempuan / umum)
// karena aturannya berbeda. Disusun ringkas & akurat.
// =============================================================

/** Bacaan niat ihram per jenis (fokus umrah untuk MVP). */
export const niatIhram: { id: string; judul: string; arab: string; latin: string; arti: string }[] = [
  {
    id: 'niat-umrah',
    judul: 'Niat Umrah (Ifrad — umrah saja)',
    arab: 'لَبَّيْكَ اللّٰهُمَّ عُمْرَةً',
    latin: "Labbaika Allāhumma 'umratan",
    arti: 'Aku penuhi panggilan-Mu ya Allah untuk berumrah.',
  },
  {
    id: 'niat-badal',
    judul: 'Niat Umrah Badal (mewakili orang lain)',
    arab: 'لَبَّيْكَ اللّٰهُمَّ عُمْرَةً عَنْ فُلَانٍ',
    latin: "Labbaika Allāhumma 'umratan 'an [nama]",
    arti: 'Aku penuhi panggilan-Mu ya Allah untuk berumrah atas nama [nama orang yang diwakilkan]. Ganti "fulān" dengan nama lengkap orang tersebut saat melafalkan niat.',
  },
];

export const larganganIhram: LaranganIhram[] = [
  // ---------------- LAKI-LAKI
  {
    id: 'lk-pakaian-jahit',
    gender: 'lakilaki',
    judul: 'Memakai pakaian berjahit',
    keterangan: 'Dilarang mengenakan baju, celana, kaus, atau pakaian yang dijahit membentuk lekuk tubuh. Hanya kain ihram tak berjahit.',
  },
  {
    id: 'lk-tutup-kepala',
    gender: 'lakilaki',
    judul: 'Menutup kepala',
    keterangan: 'Dilarang menutup kepala dengan kopiah, sorban, atau penutup yang menempel langsung di kepala. Payung & atap kendaraan diperbolehkan.',
  },
  {
    id: 'lk-alas-kaki-tertutup',
    gender: 'lakilaki',
    judul: 'Alas kaki yang menutup mata kaki',
    keterangan: 'Disunnahkan memakai sandal yang menampakkan punggung kaki & tumit, bukan sepatu tertutup.',
  },

  // ---------------- PEREMPUAN
  {
    id: 'pr-niqab',
    gender: 'perempuan',
    judul: 'Menutup wajah dengan cadar (niqab)',
    keterangan: 'Saat ihram, perempuan tidak menutup wajah dengan niqab dan tidak memakai sarung tangan. Boleh menutupkan kain dari kepala bila ada laki-laki non-mahram lewat.',
  },
  {
    id: 'pr-sarung-tangan',
    gender: 'perempuan',
    judul: 'Memakai sarung tangan (qufaz)',
    keterangan: 'Dilarang mengenakan sarung tangan khusus. Perempuan tetap memakai pakaian biasa yang menutup aurat (bukan kain ihram laki-laki).',
  },

  // ---------------- UMUM (berlaku untuk keduanya)
  {
    id: 'um-wewangian',
    gender: 'umum',
    judul: 'Memakai wewangian',
    keterangan: 'Dilarang memakai parfum pada badan atau pakaian setelah berihram. Wewangian sebelum niat ihram diperbolehkan.',
  },
  {
    id: 'um-rambut-kuku',
    gender: 'umum',
    judul: 'Memotong rambut & kuku',
    keterangan: 'Dilarang mencabut/memotong rambut dari seluruh tubuh dan memotong kuku selama ihram.',
  },
  {
    id: 'um-nikah',
    gender: 'umum',
    judul: 'Akad nikah & melamar',
    keterangan: 'Dilarang menikah, menikahkan, atau melamar selama dalam keadaan ihram.',
  },
  {
    id: 'um-jima',
    gender: 'umum',
    judul: 'Hubungan suami istri & pendahuluannya',
    keterangan: 'Dilarang berhubungan badan beserta segala pendahuluannya. Ini termasuk larangan terberat yang dapat merusak ibadah.',
  },
  {
    id: 'um-berburu',
    gender: 'umum',
    judul: 'Berburu binatang darat',
    keterangan: 'Dilarang memburu, membunuh, atau membantu memburu binatang buruan darat yang liar.',
  },
  {
    id: 'um-tumbuhan',
    gender: 'umum',
    judul: 'Mencabut tanaman tanah haram',
    keterangan: 'Dilarang memotong atau mencabut pepohonan & tumbuhan di tanah haram.',
  },
  {
    id: 'um-rafats',
    gender: 'umum',
    judul: 'Rafats, fusuq, & jidal',
    keterangan: 'Menjauhi ucapan/perbuatan kotor, kefasikan, dan pertengkaran. Jagalah lisan & emosi selama ihram.',
  },
];

export const tataCaraMemakaiIhram: IhramSection[] = [
  {
    id: 'sebelum',
    judul: 'Sebelum Berihram',
    langkah: [
      'Memotong kuku, merapikan rambut, dan membersihkan diri sebelum ihram (karena setelahnya dilarang).',
      'Mandi sunnah ihram, lalu boleh memakai wewangian pada badan SEBELUM berniat.',
      'Bagi laki-laki: melepas seluruh pakaian berjahit.',
    ],
  },
  {
    id: 'memakai',
    judul: 'Memakai Kain Ihram (Laki-laki)',
    langkah: [
      "Kenakan dua helai kain putih tak berjahit: izar (bawahan, dililitkan di pinggang) dan rida' (atasan, disampirkan di bahu).",
      'Pastikan aurat tertutup sempurna saat ruku & sujud.',
      'Kepala dibiarkan terbuka; gunakan sandal yang menampakkan punggung kaki.',
    ],
  },
  {
    id: 'memakai-pr',
    judul: 'Busana Ihram (Perempuan)',
    langkah: [
      'Mengenakan pakaian biasa yang menutup aurat, tidak ketat, dan tidak mencolok.',
      'Tidak memakai niqab (penutup wajah) dan sarung tangan.',
      'Boleh memilih warna pakaian apa pun yang sopan.',
    ],
  },
  {
    id: 'niat',
    judul: 'Berniat di Miqat',
    langkah: [
      'Shalat sunnah dua rakaat bila memungkinkan.',
      "Berniat ihram umrah: \"Labbaika Allāhumma 'umratan\".",
      'Mulai memperbanyak talbiyah hingga tiba di Makkah.',
    ],
  },
];
