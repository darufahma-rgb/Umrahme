import type { Lokasi } from '../types';

// =============================================================
// DATA LOKASI — Masjid & Tempat Bersejarah
// Jarak (jarakKm) adalah dummy representatif dari area hotel.
// TODO(maps): tambahkan koordinat lat/lng & integrasi Google Maps
// (mis. embed iframe atau deep-link ke aplikasi Maps) di LokasiDetail.
// =============================================================

export const daftarLokasi: Lokasi[] = [
  // --------------------------------------------------- MASJID
  {
    id: 'masjidil-haram',
    tipe: 'masjid',
    nama: 'Masjidil Haram',
    kota: 'Makkah',
    jarakKm: 0.4,
    jamKunjungan: 'Buka 24 jam',
    ringkas: 'Masjid teragung dalam Islam, mengelilingi Ka’bah — kiblat seluruh umat.',
    sejarah:
      'Masjidil Haram adalah masjid tertua sekaligus terbesar di dunia, berpusat pada Ka’bah yang menurut Al-Qur’an dibangun kembali oleh Nabi Ibrahim dan putranya Ismail ‘alaihimas-salam. Di dalam kompleksnya terdapat Hajar Aswad, Maqam Ibrahim, sumur Zamzam, serta bukit Shafa dan Marwah tempat pelaksanaan sa’i. Sepanjang sejarah masjid ini mengalami perluasan besar, dari masa Khalifah hingga era Saudi modern, untuk menampung jutaan jamaah haji dan umrah setiap tahun.',
  },
  {
    id: 'masjid-nabawi',
    tipe: 'masjid',
    nama: 'Masjid Nabawi',
    kota: 'Madinah',
    jarakKm: 1.1,
    jamKunjungan: 'Buka 24 jam · Raudhah dengan tasrih/janji temu',
    ringkas: 'Masjid yang dibangun Rasulullah ﷺ, tempat makam beliau berada.',
    sejarah:
      'Masjid Nabawi didirikan oleh Nabi Muhammad ﷺ sesaat setelah hijrah ke Madinah pada tahun 622 M, berdampingan dengan kediaman beliau. Di sinilah terdapat makam Rasulullah ﷺ bersama dua sahabat, Abu Bakar dan Umar radhiyallahu ‘anhuma. Masjid ini juga memuat Raudhah, area antara mimbar dan rumah Nabi yang disebut sebagai “salah satu taman surga”. Dari masjid sederhana berdinding pelepah kurma, kini menjadi salah satu masjid terbesar di dunia.',
  },
  {
    id: 'masjid-quba',
    tipe: 'masjid',
    nama: 'Masjid Quba',
    kota: 'Madinah',
    jarakKm: 5.0,
    jamKunjungan: '04.00 – 22.00 (waktu setempat)',
    ringkas: 'Masjid pertama yang dibangun dalam sejarah Islam.',
    sejarah:
      'Masjid Quba adalah masjid pertama yang dibangun oleh Rasulullah ﷺ saat tiba di pinggiran Madinah dalam perjalanan hijrah. Al-Qur’an memuji masjid ini sebagai masjid yang “didirikan atas dasar takwa sejak hari pertama”. Terdapat keutamaan bahwa siapa yang bersuci di rumahnya lalu datang dan shalat di Masjid Quba, ia memperoleh pahala seperti umrah (HR. Ibnu Majah & Tirmidzi). Banyak jamaah menyempatkan ziarah ke sini saat berada di Madinah.',
  },

  // --------------------------------------------------- TEMPAT BERSEJARAH
  {
    id: 'jabal-nur',
    tipe: 'sejarah',
    nama: 'Jabal Nur (Gua Hira)',
    kota: 'Makkah',
    jarakKm: 6.5,
    jamKunjungan: 'Disarankan pagi hari · pendakian berat, butuh fisik prima',
    ringkas: 'Bukit tempat Gua Hira, lokasi turunnya wahyu pertama.',
    sejarah:
      'Jabal Nur (“Gunung Cahaya”) adalah bukit di utara Makkah yang memuat Gua Hira. Di gua inilah Nabi Muhammad ﷺ kerap menyendiri dan menerima wahyu pertama berupa ayat-ayat awal surah Al-‘Alaq melalui Malaikat Jibril. Pendakian ke puncaknya cukup menantang dan memakan waktu, sehingga jamaah lansia disarankan cukup menyaksikannya dari kejauhan. Ziarah ke sini bersifat menambah penghayatan sejarah, bukan ibadah yang disyariatkan secara khusus.',
  },
  {
    id: 'jabal-rahmah',
    tipe: 'sejarah',
    nama: 'Jabal Rahmah',
    kota: 'Arafah',
    jarakKm: 22.0,
    jamKunjungan: 'Ramai saat musim haji · area terbuka',
    ringkas: 'Bukit di Padang Arafah, dikaitkan dengan khutbah Wada’.',
    sejarah:
      'Jabal Rahmah (“Bukit Kasih Sayang”) terletak di Padang Arafah. Di kawasan Arafah inilah Rasulullah ﷺ menyampaikan Khutbah Wada’ (haji perpisahan) di hadapan puluhan ribu sahabat. Arafah menjadi inti pelaksanaan ibadah haji (wukuf), meski tidak termasuk rangkaian wajib umrah. Banyak riwayat rakyat mengaitkan bukit ini dengan pertemuan kembali Adam dan Hawa, namun kisah tersebut tidak memiliki dasar yang kuat — ziarah ke sini bernilai sejarah, bukan ritual.',
  },
  {
    id: 'jabal-uhud',
    tipe: 'sejarah',
    nama: 'Jabal Uhud',
    kota: 'Madinah',
    jarakKm: 4.5,
    jamKunjungan: '06.00 – 18.00 (waktu setempat)',
    ringkas: 'Gunung tempat Perang Uhud dan makam para syuhada.',
    sejarah:
      'Jabal Uhud adalah gunung terbesar di Madinah dan menjadi saksi Perang Uhud pada tahun ke-3 Hijriah antara kaum muslimin dan pasukan Quraisy. Di kakinya dimakamkan para syuhada Uhud, termasuk Hamzah bin Abdul Muthalib, paman Nabi ﷺ. Rasulullah ﷺ bersabda bahwa “Uhud adalah gunung yang mencintai kami dan kami mencintainya” (HR. Bukhari). Jamaah kerap berziarah untuk mendoakan para syuhada dan mengenang perjuangan awal Islam.',
  },
];

export function lokasiByTipe(tipe: Lokasi['tipe']): Lokasi[] {
  return daftarLokasi.filter((l) => l.tipe === tipe);
}

export function lokasiById(id: string): Lokasi | undefined {
  return daftarLokasi.find((l) => l.id === id);
}
