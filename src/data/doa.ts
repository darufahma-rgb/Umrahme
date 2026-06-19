import type { Doa, KategoriDoa } from '../types';

// =============================================================
// DATA DOA
// -------------------------------------------------------------
// 4 doa inti diisi LENGKAP & berdasarkan riwayat yang masyhur
// (Talbiyah & "Rabbana atina" sahih; doa lihat Ka'bah ditandai
// perluVerifikasi karena sanadnya diperdebatkan).
//
// Kategori lain berisi entri dengan struktur lengkap; field
// konten yang belum pasti DIKOSONGKAN dan ditandai
// perluVerifikasi: true + dalil "perlu verifikasi ulama".
// JANGAN isi konten doa kompleks tanpa kepastian.
// =============================================================

export const kategoriDoaMeta: { id: KategoriDoa; judul: string; deskripsi: string }[] = [
  { id: 'persiapan', judul: 'Persiapan & Safar', deskripsi: 'Doa sebelum & selama perjalanan' },
  { id: 'ihram', judul: 'Ihram', deskripsi: 'Niat & talbiyah' },
  { id: 'tawaf', judul: 'Tawaf', deskripsi: 'Bacaan mengelilingi Ka’bah' },
  { id: 'sai', judul: "Sa'i", deskripsi: 'Antara Shafa & Marwah' },
  { id: 'tahallul', judul: 'Tahallul', deskripsi: 'Mencukur / memotong rambut' },
  { id: 'ziarah', judul: 'Ziarah', deskripsi: 'Madinah & tempat bersejarah' },
  { id: 'harian', judul: 'Harian', deskripsi: 'Doa sehari-hari di Tanah Suci' },
];

export const daftarDoa: Doa[] = [
  // ----------------------------------------------------------- IHRAM (inti, lengkap)
  {
    id: 'niat-ihram-umrah',
    kategori: 'ihram',
    judul: 'Niat Ihram Umrah',
    arab: 'لَبَّيْكَ اللّٰهُمَّ عُمْرَةً',
    latin: "Labbaika Allāhumma ‘umratan",
    terjemahan: 'Aku penuhi panggilan-Mu, ya Allah, untuk berumrah.',
    arti:
      'Pernyataan niat memulai ibadah umrah. Diucapkan saat hendak memasuki ihram dari miqat, menandai dimulainya rangkaian ibadah dan berlakunya larangan-larangan ihram.',
    dalil:
      'Berdasarkan praktik Nabi ﷺ yang melafalkan jenis ibadah saat ihram (HR. Muslim dari Anas bin Malik). Sebagian ulama menambahkan lafal "Nawaitul ‘umrata wa aḥramtu bihā lillāhi ta‘ālā".',
    cara:
      'Dibaca sekali setelah berihram (mandi, memakai kain ihram, shalat sunnah bila memungkinkan) tepat saat hendak berniat di miqat. Setelah ini langsung memperbanyak talbiyah.',
    waktu: 'Di miqat, sebelum bertolak menuju Makkah.',
  },
  {
    id: 'talbiyah',
    kategori: 'ihram',
    judul: 'Talbiyah',
    arab:
      'لَبَّيْكَ اللّٰهُمَّ لَبَّيْكَ، لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ، لَا شَرِيكَ لَكَ',
    latin:
      "Labbaika Allāhumma labbaik, labbaika lā syarīka laka labbaik, innal-ḥamda wan-ni‘mata laka wal-mulk, lā syarīka lak",
    terjemahan:
      'Aku penuhi panggilan-Mu ya Allah, aku penuhi panggilan-Mu. Aku penuhi panggilan-Mu, tiada sekutu bagi-Mu, aku penuhi panggilan-Mu. Sesungguhnya segala puji, nikmat, dan kerajaan adalah milik-Mu, tiada sekutu bagi-Mu.',
    arti:
      'Pengakuan tauhid dan kesiapan memenuhi panggilan Allah. Inilah syiar utama orang yang berihram.',
    dalil:
      'Hadis sahih riwayat al-Bukhari (no. 1549) dan Muslim (no. 1184) dari Ibnu ‘Umar radhiyallahu ‘anhuma, dari Nabi ﷺ.',
    cara:
      'Diperbanyak dengan suara dikeraskan bagi laki-laki dan dilirihkan bagi perempuan. Diulang-ulang sejak berihram, terutama saat berganti keadaan (naik kendaraan, menanjak, bertemu rombongan).',
    waktu: 'Sejak berniat ihram hingga mulai tawaf (talbiyah berhenti saat menyentuh/menghadap Hajar Aswad untuk memulai tawaf).',
  },
  {
    id: 'doa-masuk-masjidil-haram',
    kategori: 'persiapan',
    judul: 'Doa Memasuki Masjidil Haram',
    arab:
      'بِسْمِ اللّٰهِ، وَالصَّلَاةُ وَالسَّلَامُ عَلَىٰ رَسُولِ اللّٰهِ، اللّٰهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
    latin:
      "Bismillāh, waṣ-ṣalātu was-salāmu ‘alā rasūlillāh. Allāhummaftaḥ lī abwāba raḥmatik",
    terjemahan:
      'Dengan nama Allah, shalawat dan salam atas Rasulullah. Ya Allah, bukakanlah untukku pintu-pintu rahmat-Mu.',
    arti:
      'Doa masuk masjid secara umum yang juga dibaca saat memasuki Masjidil Haram, memohon dibukakan pintu rahmat Allah.',
    dalil:
      'Lafal "Allāhummaftaḥ lī abwāba raḥmatik" adalah doa masuk masjid riwayat Muslim (no. 713) dari Abu Humaid/Abu Usaid. Para ulama menyebut tidak ada doa khusus tersendiri saat masuk Masjidil Haram selain doa masuk masjid pada umumnya.',
    cara:
      'Mendahulukan kaki kanan saat masuk, lalu membaca doa ini. Disunnahkan masuk melalui mana saja, dan bagi pelaku umrah segera menuju tawaf.',
    waktu: 'Saat melangkah masuk ke dalam Masjidil Haram.',
  },
  {
    id: 'doa-melihat-kabah',
    kategori: 'persiapan',
    judul: "Doa Melihat Ka'bah Pertama Kali",
    arab:
      'اللّٰهُمَّ زِدْ هٰذَا الْبَيْتَ تَشْرِيفًا وَتَعْظِيمًا وَتَكْرِيمًا وَمَهَابَةً',
    latin:
      "Allāhumma zid hādzal-baita tasyrīfan wa ta‘ẓīman wa takrīman wa mahābah",
    terjemahan:
      'Ya Allah, tambahkanlah kemuliaan, keagungan, kehormatan, dan kewibawaan pada Baitullah ini.',
    arti:
      'Ungkapan pengagungan terhadap Baitullah saat pertama kali memandangnya.',
    dalil:
      'Riwayat ini masyhur di kalangan masyarakat namun sanadnya diperbincangkan (sebagian ulama menilainya mursal/lemah). Sebagian ulama (mis. Syaikh Ibnu Baz) menyatakan tidak ada doa khusus yang sahih saat melihat Ka’bah, dan jamaah boleh berdoa/bertakbir dengan doa apa pun yang baik. — perlu verifikasi ulama.',
    cara:
      'Boleh mengangkat tangan, bertakbir, dan memperbanyak doa kebaikan dengan lafal apa pun. Tidak mengapa membaca lafal di atas tanpa meyakininya sebagai sunnah yang pasti.',
    waktu: 'Saat pandangan pertama tertuju pada Ka’bah.',
    perluVerifikasi: true,
  },

  // ----------------------------------------------------------- TAWAF
  {
    id: 'doa-antara-dua-rukun',
    kategori: 'tawaf',
    judul: 'Doa Antara Rukun Yamani & Hajar Aswad',
    arab:
      'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
    latin:
      "Rabbanā ātinā fid-dunyā ḥasanah, wa fil-ākhirati ḥasanah, wa qinā ‘adzāban-nār",
    terjemahan:
      'Ya Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat, dan lindungilah kami dari azab neraka.',
    arti:
      'Doa ringkas yang menghimpun kebaikan dunia dan akhirat. Dibaca di antara Rukun Yamani dan Hajar Aswad pada setiap putaran tawaf.',
    dalil:
      'Ayat QS. al-Baqarah: 201. Praktik membacanya di antara dua rukun diriwayatkan Abu Dawud (no. 1892) dari Abdullah bin as-Sa’ib.',
    cara:
      'Dibaca pada setiap putaran ketika berada di antara Rukun Yamani dan Hajar Aswad. Selebihnya, sepanjang tawaf tidak ada doa wajib tertentu — boleh berzikir & berdoa dengan bahasa apa pun.',
    waktu: 'Setiap putaran tawaf, di sisi akhir menjelang Hajar Aswad.',
  },
  {
    id: 'tawaf-zikir-umum',
    kategori: 'tawaf',
    judul: 'Zikir & Doa Umum Saat Tawaf',
    arab: '',
    latin: '',
    terjemahan: '',
    dalil: 'TODO: verifikasi konten oleh ustadz.',
    cara: 'Tidak ada doa khusus yang wajib tiap putaran selain antara dua rukun; jamaah dianjurkan memperbanyak zikir, istighfar, dan doa pribadi.',
    waktu: 'Sepanjang tujuh putaran tawaf.',
    perluVerifikasi: true,
  },

  // ----------------------------------------------------------- SA'I
  {
    id: 'sai-di-shafa',
    kategori: 'sai',
    judul: "Bacaan di Bukit Shafa & Marwah",
    arab: 'إِنَّ الصَّفَا وَالْمَرْوَةَ مِنْ شَعَائِرِ اللّٰهِ',
    latin: "Innaṣ-ṣafā wal-marwata min sya‘ā’irillāh",
    terjemahan: 'Sesungguhnya Shafa dan Marwah adalah sebagian dari syiar (agama) Allah.',
    arti: 'Ayat yang dibaca saat mendekati Shafa untuk memulai sa’i. Selebihnya, lafal takbir & doa di atas bukit perlu dirujuk ke panduan ustadz.',
    dalil:
      'Awal ayat QS. al-Baqarah: 158, dibaca Nabi ﷺ saat mendekati Shafa (HR. Muslim). Rincian takbir & doa di atas bukit — TODO: verifikasi konten oleh ustadz.',
    cara: 'Dibaca sekali saat hendak memulai sa’i di Shafa.',
    waktu: 'Sebelum memulai putaran pertama sa’i.',
    perluVerifikasi: true,
  },
  {
    id: 'sai-doa-perjalanan',
    kategori: 'sai',
    judul: "Doa di Sepanjang Sa'i",
    arab: '',
    latin: '',
    terjemahan: '',
    dalil: 'TODO: verifikasi konten oleh ustadz.',
    cara: 'Tidak ada doa wajib tertentu sepanjang lintasan sa’i; perbanyak zikir & doa pribadi.',
    waktu: 'Antara Shafa dan Marwah, 7 kali lintasan.',
    perluVerifikasi: true,
  },

  // ----------------------------------------------------------- TAHALLUL
  {
    id: 'tahallul-niat',
    kategori: 'tahallul',
    judul: 'Bacaan Saat Tahallul',
    arab: '',
    latin: '',
    terjemahan: '',
    dalil: 'TODO: verifikasi konten oleh ustadz.',
    cara: 'Mencukur (gundul, lebih utama bagi laki-laki) atau memendekkan rambut secara merata. Bagi perempuan cukup memotong seujung jari dari rambutnya.',
    waktu: 'Setelah sa’i selesai, menandai berakhirnya ihram umrah.',
    perluVerifikasi: true,
  },
  {
    id: 'tahallul-syukur',
    kategori: 'tahallul',
    judul: 'Doa Syukur Selesai Umrah',
    arab: '',
    latin: '',
    terjemahan: '',
    dalil: 'TODO: verifikasi konten oleh ustadz.',
    cara: 'Memperbanyak hamdalah & syukur atas selesainya rangkaian umrah.',
    waktu: 'Setelah tahallul.',
    perluVerifikasi: true,
  },

  // ----------------------------------------------------------- ZIARAH
  {
    id: 'ziarah-salam-nabi',
    kategori: 'ziarah',
    judul: 'Salam Saat Ziarah Makam Rasulullah ﷺ',
    arab: 'السَّلَامُ عَلَيْكَ يَا رَسُولَ اللّٰهِ',
    latin: "As-salāmu ‘alaika yā rasūlallāh",
    terjemahan: 'Salam sejahtera atasmu, wahai Rasulullah.',
    arti: 'Salam yang diucapkan saat berziarah ke makam Nabi ﷺ di Masjid Nabawi. Lafal lengkap & adab rinci — perlu dirujuk ke panduan ustadz.',
    dalil: 'Adab ziarah & lafal lengkap — TODO: verifikasi konten oleh ustadz.',
    cara: 'Mengucap salam dengan tenang & suara lirih sambil menghadap makam, lalu bergeser memberi salam kepada Abu Bakar & Umar radhiyallahu ‘anhuma.',
    waktu: 'Saat ziarah ke Masjid Nabawi, Madinah.',
    perluVerifikasi: true,
  },
  {
    id: 'ziarah-doa-masuk-madinah',
    kategori: 'ziarah',
    judul: 'Doa Memasuki Kota Madinah',
    arab: '',
    latin: '',
    terjemahan: '',
    dalil: 'TODO: verifikasi konten oleh ustadz.',
    cara: 'Memperbanyak shalawat saat memasuki Madinah.',
    waktu: 'Saat tiba di Madinah.',
    perluVerifikasi: true,
  },

  // ----------------------------------------------------------- HARIAN
  {
    id: 'doa-safar',
    kategori: 'harian',
    judul: 'Doa Naik Kendaraan / Safar',
    arab:
      'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ، وَإِنَّا إِلَىٰ رَبِّنَا لَمُنْقَلِبُونَ',
    latin:
      "Subḥānalladzī sakhkhara lanā hādzā wa mā kunnā lahū muqrinīn, wa innā ilā rabbinā lamunqalibūn",
    terjemahan:
      'Mahasuci Allah yang telah menundukkan kendaraan ini untuk kami, padahal kami sebelumnya tidak mampu menguasainya. Dan sesungguhnya kami akan kembali kepada Tuhan kami.',
    arti: 'Doa saat menaiki kendaraan dalam perjalanan, mengingat nikmat & tempat kembali kepada Allah.',
    dalil: 'QS. az-Zukhruf: 13–14; dibaca Nabi ﷺ saat menaiki tunggangan (HR. Muslim no. 1342 dari Ibnu ‘Umar).',
    cara: 'Dibaca setelah duduk di kendaraan, didahului takbir tiga kali.',
    waktu: 'Setiap memulai perjalanan dengan kendaraan.',
  },
  {
    id: 'doa-minum-zamzam',
    kategori: 'harian',
    judul: 'Doa Minum Air Zamzam',
    arab: '',
    latin: '',
    terjemahan: '',
    dalil: 'Riwayat doa khusus zamzam diperbincangkan keabsahannya — TODO: verifikasi konten oleh ustadz.',
    cara: 'Disunnahkan minum sambil berdiri, menghadap kiblat, dengan tiga tarikan napas, dan berdoa dengan hajat apa pun yang baik.',
    waktu: 'Saat meminum air zamzam.',
    perluVerifikasi: true,
  },
];

export function doaByKategori(kategori: KategoriDoa): Doa[] {
  return daftarDoa.filter((d) => d.kategori === kategori);
}

export function doaById(id: string): Doa | undefined {
  return daftarDoa.find((d) => d.id === id);
}

export function cariDoa(query: string): Doa[] {
  const q = query.trim().toLowerCase();
  if (!q) return daftarDoa;
  return daftarDoa.filter(
    (d) =>
      d.judul.toLowerCase().includes(q) ||
      d.latin.toLowerCase().includes(q) ||
      d.terjemahan.toLowerCase().includes(q),
  );
}
