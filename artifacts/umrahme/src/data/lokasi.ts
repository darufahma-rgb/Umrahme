import type { Lokasi } from '../types';

// =============================================================
// DATA LOKASI — Masjid & Tempat Bersejarah (riset lengkap)
// jarakKm: estimasi representatif dari area hotel jamaah.
// koordinat: dipakai untuk deep-link Google Maps di LokasiDetail.
// =============================================================

export const daftarLokasi: Lokasi[] = [
  // ===================================================== MASJID
  {
    id: 'masjidil-haram',
    tipe: 'masjid',
    nama: 'Masjidil Haram',
    namaArab: 'المسجد الحرام',
    kota: 'Makkah',
    jarakKm: 0.4,
    jamKunjungan: 'Buka 24 jam',
    ringkas: 'Masjid teragung dalam Islam, mengelilingi Ka\u2019bah \u2014 kiblat seluruh umat.',
    gambar: '/lokasi/masjidil-haram.jpg',
    koordinat: { lat: 21.4225, lng: 39.8262 },
    sejarah:
      'Masjidil Haram adalah masjid tertua sekaligus terbesar di dunia, berpusat pada Ka\u2019bah yang dalam tradisi Islam dibangun kembali oleh Nabi Ibrahim dan putranya Ismail \u2018alaihimas-salam, lalu mengalami perluasan besar dari masa para Khalifah hingga era Saudi modern.',
    sejarahSeksi: [
      {
        judul: 'Asal Mula Ka\u2019bah',
        isi: 'Dalam tradisi Islam, Ka\u2019bah adalah bangunan pertama yang didirikan untuk beribadah kepada Allah. Setelah hilang akibat banjir besar pada masa Nabi Nuh, Allah memerintahkan Nabi Ibrahim bersama putranya Ismail untuk membangunnya kembali di lokasi semula. Keduanya pula yang meletakkan Hajar Aswad dan menandai Maqam Ibrahim di sekitar Ka\u2019bah.',
      },
      {
        judul: 'Peristiwa Hajar Aswad & Gelar Al-Amin',
        isi: 'Saat Ka\u2019bah diperbaiki karena banjir di masa muda Nabi Muhammad \ufdfa, kabilah-kabilah Quraisy berselisih tentang siapa yang berhak meletakkan Hajar Aswad. Nabi \ufdfa menengahi dengan meletakkan batu di atas kain yang setiap ujungnya dipegang pemimpin kabilah, lalu mengangkatnya bersama. Atas kebijaksanaan ini beliau digelari Al-Amin (yang terpercaya).',
      },
      {
        judul: 'Perluasan dari Masa ke Masa',
        isi: 'Di zaman Nabi \ufdfa, area tawaf hanyalah halaman luas dikelilingi rumah penduduk seluas \u00b11.500\u20132.000 m\u00b2. Khalifah Umar bin Khattab membangun tembok pertama; Utsman bin Affan menambahkan serambi beratap. Perluasan berlanjut di masa Umayyah, Abbasiyah, hingga era Saudi modern yang kini menampung lebih dari dua juta jamaah.',
      },
      {
        judul: 'Titik-Titik Penting di Dalamnya',
        isi: 'Selain Ka\u2019bah, di dalam kompleks terdapat Hajar Aswad di sudut Ka\u2019bah, Maqam Ibrahim (batu pijakan Nabi Ibrahim saat membangun Ka\u2019bah \u2014 bukan kuburan), Hijir Ismail, Multazam, sumur Zamzam di sisi timur Ka\u2019bah, serta bukit Shafa dan Marwah tempat sa\u2019i yang kini berada di dalam masjid.',
      },
    ],
    tokoh: [
      { nama: 'Nabi Ibrahim \ufdfa', peran: 'Membangun kembali Ka\u2019bah bersama putranya' },
      { nama: 'Nabi Ismail \ufdfa', peran: 'Membantu pembangunan & peletakan Hajar Aswad' },
      { nama: 'Nabi Muhammad \ufdfa', peran: 'Menengahi peletakan Hajar Aswad, membersihkan Ka\u2019bah dari berhala saat Fathu Makkah' },
    ],
    keutamaan: [
      'Shalat di Masjidil Haram bernilai 100.000 kali lipat dibanding masjid lain.',
      'Ka\u2019bah adalah kiblat shalat seluruh umat Islam di dunia.',
      'Pusat pelaksanaan tawaf dalam ibadah haji dan umrah.',
      'Sumur Zamzam adalah sumber air yang terus mengalir sejak zaman Nabi Ismail.',
    ],
    dalil: [
      {
        sumber: 'QS. Ali \u2018Imran: 96',
        teks: 'Sesungguhnya rumah yang mula-mula dibangun untuk (tempat ibadah) manusia ialah Baitullah di Bakkah (Makkah) yang diberkahi dan menjadi petunjuk bagi semesta alam.',
      },
    ],
    adab: [
      'Jaga kekhusyukan dan perbanyak doa, terutama di Multazam dan saat menatap Ka\u2019bah.',
      'Hati-hati terhadap \u201cjoki\u201d Hajar Aswad yang meminta uang; mencium Hajar Aswad sunnah tetapi jangan sampai menyakiti atau berdesakan membahayakan.',
      'Perhatikan sistem lampu pintu (hijau = ada ruang, merah = penuh).',
    ],
  },
  {
    id: 'masjid-nabawi',
    tipe: 'masjid',
    nama: 'Masjid Nabawi',
    namaArab: 'المسجد النبوي',
    kota: 'Madinah',
    jarakKm: 1.1,
    jamKunjungan: 'Buka 24 jam \u00b7 Raudhah perlu tasrih/janji temu via aplikasi Nusuk',
    ringkas: 'Masjid yang dibangun Rasulullah \ufdfa, tempat makam beliau berada.',
    gambar: '/lokasi/masjid-nabawi.jpg',
    koordinat: { lat: 24.4672, lng: 39.6111 },
    sejarah:
      'Masjid Nabawi didirikan Nabi Muhammad \ufdfa sesaat setelah hijrah ke Madinah pada 622 M, berdampingan dengan kediaman beliau. Di dalamnya terdapat makam Rasulullah \ufdfa bersama Abu Bakar dan Umar, serta Raudhah yang disebut \u201ctaman surga\u201d.',
    sejarahSeksi: [
      {
        judul: 'Dibangun Saat Hijrah',
        isi: 'Ketika Rasulullah \ufdfa hijrah ke Madinah pada 622 M, beliau membangun masjid ini sebagai pusat ibadah dan kegiatan sosial umat Islam. Strukturnya sangat sederhana: dinding dari batu bata, tiang dari batang kurma, dan atap dari pelepah kurma, tanpa kubah.',
      },
      {
        judul: 'Raudhah \u2014 Taman Surga',
        isi: 'Raudhah adalah area antara mimbar dan bekas rumah Nabi \ufdfa. Rasulullah \ufdfa bersabda bahwa area antara rumah dan mimbar beliau adalah \u201ctaman dari taman-taman surga\u201d. Luasnya sekitar 330 m\u00b2 (\u00b122 m \u00d7 15 m), ditandai dengan karpet dan tiang putih. Kini akses Raudhah diatur dengan tasrih (izin) melalui aplikasi Nusuk.',
      },
      {
        judul: 'Makam Rasulullah \ufdfa & Dua Sahabat',
        isi: 'Makam Nabi \ufdfa berada di bekas kamar Aisyah (Hujrah asy-Syarifah) di sisi timur Raudhah, sesuai sabda beliau bahwa nabi dimakamkan di tempat ia wafat. Di sampingnya dimakamkan Abu Bakar Ash-Shiddiq lalu Umar bin Khattab, keduanya atas izin Aisyah. Karena perluasan masjid, ketiga makam kini berada di dalam masjid.',
      },
      {
        judul: 'Kubah Hijau',
        isi: 'Kubah Hijau menandai lokasi makam Nabi \ufdfa. Kubah pertama dibangun era Mamluk oleh Sultan Al-Mansur Qalawun (678 H / 1279 M), awalnya dari kayu berlapis timah. Warna hijau yang dikenal sekarang baru diberikan pada masa Sultan Mahmud II dari Utsmaniyah (1817 M). Kubah ini menjadi ikon Madinah dan simbol kecintaan umat kepada Rasulullah \ufdfa.',
      },
    ],
    tokoh: [
      { nama: 'Nabi Muhammad \ufdfa', peran: 'Pendiri masjid, dimakamkan di dalamnya' },
      { nama: 'Abu Bakar Ash-Shiddiq', peran: 'Khalifah pertama, dimakamkan di samping Nabi \ufdfa' },
      { nama: 'Umar bin Khattab', peran: 'Khalifah kedua, dimakamkan di sisi Abu Bakar' },
      { nama: 'Bilal bin Rabah', peran: 'Muadzin Rasulullah \ufdfa' },
    ],
    keutamaan: [
      'Shalat di Masjid Nabawi bernilai 1.000 kali lipat dibanding masjid lain (selain Masjidil Haram).',
      'Berdoa di Raudhah termasuk tempat yang sangat dianjurkan.',
      'Disunnahkan mengucapkan salam kepada Rasulullah \ufdfa dan dua sahabatnya saat ziarah.',
    ],
    dalil: [
      {
        sumber: 'HR. Bukhari & Muslim',
        teks: 'Antara rumahku dan mimbarku terdapat taman dari taman-taman surga.',
      },
    ],
    adab: [
      'Untuk masuk Raudhah, pesan tasrih lebih dulu lewat aplikasi Nusuk sesuai jadwal.',
      'Ucapkan salam dengan tenang saat melewati makam; jangan mengusap pagar atau meminta kepada penghuni kubur.',
      'Jaga ketertiban \u2014 area Raudhah sangat padat.',
    ],
  },
  {
    id: 'masjid-quba',
    tipe: 'masjid',
    nama: 'Masjid Quba',
    namaArab: 'مسجد قباء',
    kota: 'Madinah',
    jarakKm: 5.0,
    jamKunjungan: 'Buka 24 jam (waktu setempat)',
    ringkas: 'Masjid pertama yang dibangun dalam sejarah Islam.',
    gambar: '/lokasi/masjid-quba.jpg',
    koordinat: { lat: 24.4395, lng: 39.6175 },
    sejarah:
      'Masjid Quba adalah masjid pertama yang dibangun Rasulullah \ufdfa saat tiba di pinggiran Madinah dalam perjalanan hijrah, dibangun di atas dasar takwa. Shalat di dalamnya berpahala seperti umrah.',
    sejarahSeksi: [
      {
        judul: 'Masjid Pertama dalam Islam',
        isi: 'Saat hijrah dari Makkah, Rasulullah \ufdfa singgah di perkampungan Quba dan membangun masjid ini dengan tangannya sendiri bersama para sahabat. Dibangun pada 8 Rabiul Awwal tahun pertama Hijriah (23 September 622 M) di atas tanah \u00b11.200 m\u00b2. Peletakan batu pertama di mihrab dilakukan Rasulullah \ufdfa, diikuti Abu Bakar, Umar, dan Utsman.',
      },
      {
        judul: 'Dibangun di Atas Takwa',
        isi: 'Al-Qur\u2019an memuji masjid ini sebagai masjid yang \u201cdidirikan atas dasar takwa sejak hari pertama\u201d. Di sinilah shalat berjamaah pertama setelah hijrah dilakukan, dengan kiblat masih ke arah Baitul Maqdis, dan azan pertama di Madinah dikumandangkan Bilal bin Rabah.',
      },
      {
        judul: 'Kebiasaan Rasulullah \ufdfa',
        isi: 'Rasulullah \ufdfa rutin mengunjungi Masjid Quba, terutama setiap hari Sabtu, kadang berjalan kaki kadang berkendara. Kini masjid telah diperluas hingga mampu menampung puluhan ribu jamaah, dikelilingi kebun kurma dan empat menara putih.',
      },
    ],
    tokoh: [
      { nama: 'Nabi Muhammad \ufdfa', peran: 'Membangun masjid dengan tangannya sendiri' },
      { nama: 'Bilal bin Rabah', peran: 'Mengumandangkan azan pertama di Madinah' },
    ],
    keutamaan: [
      'Bersuci di rumah lalu shalat di Masjid Quba berpahala seperti umrah.',
      'Masjid pertama yang dibangun atas dasar takwa.',
      'Tempat shalat berjamaah pertama dalam sejarah Islam.',
    ],
    dalil: [
      {
        sumber: 'QS. At-Taubah: 108',
        teks: 'Sungguh, masjid yang didirikan atas dasar takwa sejak hari pertama lebih pantas engkau melaksanakan shalat di dalamnya.',
      },
      {
        sumber: 'HR. Ibnu Majah',
        teks: 'Barangsiapa bersuci di rumahnya lalu mendatangi Masjid Quba dan shalat di dalamnya, ia memperoleh pahala seperti umrah.',
      },
    ],
    adab: [
      'Disunnahkan bersuci/berwudhu dari hotel sebelum berangkat agar meraih keutamaan hadits.',
      'Datang di luar jam padat agar lebih leluasa shalat sunnah.',
    ],
  },

  {
    id: 'masjid-jin',
    tipe: 'masjid',
    nama: 'Masjid Jin',
    namaArab: '\u0645\u0633\u062c\u062f \u0627\u0644\u062c\u0646',
    kota: 'Makkah',
    jarakKm: 1.2,
    jamKunjungan: 'Buka saat waktu shalat',
    ringkas: 'Tempat serombongan jin memeluk Islam setelah mendengar bacaan Al-Qur\u2019an Nabi \ufdfa.',
    gambar: '/lokasi/masjid-jin.jpg',
    koordinat: { lat: 21.4333, lng: 39.8289 },
    sejarah:
      'Masjid Jin terletak di distrik Ma\u2019la, dekat pemakaman Jannatul Mu\u2019alla, sekitar 1,2 km di utara Masjidil Haram. Masjid ini menandai lokasi peristiwa yang diabadikan dalam Surah Al-Jinn: serombongan jin mendengar Nabi \ufdfa membaca Al-Qur\u2019an, lalu beriman.',
    sejarahSeksi: [
      {
        judul: 'Peristiwa Para Jin Beriman',
        isi: 'Dalam riwayat yang masyhur, ketika Nabi \ufdfa membaca Al-Qur\u2019an di kawasan ini, serombongan jin yang sedang melintas berhenti dan mendengarkan dengan saksama. Mereka terkesan oleh kebenaran wahyu lalu beriman, dan kembali kepada kaumnya untuk menyampaikan dakwah tauhid. Peristiwa ini begitu penting hingga diabadikan dalam satu surah utuh, yaitu Surah Al-Jinn (surah ke-72).',
      },
      {
        judul: 'Nama-Nama Lain',
        isi: 'Masjid ini juga dikenal sebagai Masjid Al-Bai\u2019ah (Masjid Baiat) karena dikaitkan dengan baiat para jin, dan Masjid Al-Haras (Masjid Penjaga) karena dahulu menjadi batas patroli penjaga kota Makkah. Di dalamnya terdapat titik yang dikenal sebagai \u201cMaudhi\u2019 al-Khath\u201d (tempat penulisan), dikaitkan dengan riwayat Abdullah bin Mas\u2019ud.',
      },
    ],
    tokoh: [
      { nama: 'Nabi Muhammad \ufdfa', peran: 'Membaca Al-Qur\u2019an yang didengar para jin' },
      { nama: 'Abdullah bin Mas\u2019ud \u0631\u0636\u064a \u0627\u0644\u0644\u0647 \u0639\u0646\u0647', peran: 'Sahabat yang diriwayatkan menyertai Nabi \ufdfa pada peristiwa ini' },
    ],
    keutamaan: [
      'Mengingatkan bahwa risalah Islam ditujukan bukan hanya kepada manusia, tetapi juga kepada jin.',
      'Menjadi pengingat keagungan Al-Qur\u2019an yang mampu menggerakkan hati makhluk yang tak terlihat.',
    ],
    dalil: [
      {
        sumber: 'QS. Al-Jinn: 1\u20132',
        teks: 'Katakanlah (Muhammad), \u201cTelah diwahyukan kepadaku bahwa sekumpulan jin telah mendengarkan (Al-Qur\u2019an), lalu mereka berkata, \u2018Kami telah mendengarkan Al-Qur\u2019an yang menakjubkan, (yang) memberi petunjuk kepada jalan yang benar, lalu kami beriman kepadanya.\u2019\u201d',
      },
    ],
    adab: [
      'Masjid ini hanya untuk shalat \u2014 tidak ada ritual khusus di dalamnya.',
      'Jaga adab dan kekhusyukan, hormati jamaah setempat yang shalat sehari-hari.',
      'Ziarah ke sini bersifat sunnah/anjuran, bukan bagian dari rangkaian wajib umrah.',
    ],
    catatan: 'Ziarah ke Masjid Jin bersifat opsional (bukan rukun atau wajib umrah). Tujuannya untuk mengambil pelajaran sejarah, bukan ritual tertentu.',
  },
  {
    id: 'masjid-ghamamah',
    tipe: 'masjid',
    nama: 'Masjid Ghamamah',
    namaArab: '\u0645\u0633\u062c\u062f \u0627\u0644\u063a\u0645\u0627\u0645\u0629',
    kota: 'Madinah',
    jarakKm: 0.3,
    jamKunjungan: 'Kadang dibuka sore hari',
    ringkas: 'Tempat Rasulullah \ufdfa pertama kali memimpin shalat Id dan shalat Istisqa (minta hujan).',
    gambar: '',
    koordinat: { lat: 24.4681, lng: 39.6097 },
    sejarah:
      'Masjid Ghamamah terletak sekitar 300 meter di barat daya Masjid Nabawi. Dahulu kawasan ini adalah tanah lapang (al-Mushalla) tempat Rasulullah \ufdfa dan para sahabat menunaikan shalat Id dan shalat Istisqa. Nama \u201cGhamamah\u201d berarti awan/mendung, merujuk peristiwa turunnya hujan setelah Nabi \ufdfa memimpin shalat Istisqa.',
    sejarahSeksi: [
      {
        judul: 'Shalat Istisqa & Turunnya Hujan',
        isi: 'Ketika Madinah dilanda kekeringan, penduduk meminta Nabi \ufdfa berdoa memohon hujan. Beliau mengajak mereka ke tanah lapang ini, menunaikan shalat dua rakaat dengan suara keras sambil membalik selendangnya, lalu berdoa menghadap kiblat. Tidak lama, awan (ghamamah) berkumpul dan hujan pun turun. Peristiwa ini diriwayatkan dalam Shahih Bukhari dari Abdullah bin Zaid.',
      },
      {
        judul: 'Tempat Shalat Id Pertama',
        isi: 'Masjid Ghamamah juga menjadi tempat Rasulullah \ufdfa pertama kali memimpin shalat Idul Fitri, sekitar tahun ke-2 Hijriah. Karena shalat Id disunnahkan di tanah lapang, kawasan terbuka ini menjadi tempat khas pelaksanaan shalat hari raya. Bangunan masjid sekarang adalah peninggalan era Utsmaniyah (Sultan Abdul Majid) yang kemudian direnovasi pada masa Raja Fahd.',
      },
    ],
    tokoh: [
      { nama: 'Nabi Muhammad \ufdfa', peran: 'Memimpin shalat Istisqa dan shalat Id pertama di sini' },
      { nama: 'Khalifah Umar bin Khattab \u0631\u0636\u064a \u0627\u0644\u0644\u0647 \u0639\u0646\u0647', peran: 'Diriwayatkan membangun masjid di tempat shalat Nabi \ufdfa' },
    ],
    keutamaan: [
      'Mengenang ijabah doa Nabi \ufdfa saat memohon hujan untuk umat.',
      'Tempat bersejarah pelaksanaan shalat Id pertama dalam Islam.',
      'Berada sangat dekat dengan Masjid Nabawi, mudah dijangkau berjalan kaki.',
    ],
    dalil: [
      {
        sumber: 'HR. Bukhari (dari Abdullah bin Zaid)',
        teks: 'Nabi \ufdfa keluar ke tanah lapang untuk memohon hujan. Beliau menghadap kiblat, membalik selendangnya, lalu shalat dua rakaat (mengeraskan bacaan). Kemudian Allah menurunkan hujan.',
      },
    ],
    adab: [
      'Jika masjid dibuka, shalat dua rakaat tahiyyatul masjid dengan tertib.',
      'Tidak ada ritual khusus; cukup ambil pelajaran sejarahnya.',
      'Jaga ketenangan, masjid ini tidak selalu dibuka untuk umum.',
    ],
  },
  {
    id: 'masjid-abu-bakar',
    tipe: 'masjid',
    nama: 'Masjid Abu Bakar Ash-Shiddiq',
    namaArab: '\u0645\u0633\u062c\u062f \u0623\u0628\u064a \u0628\u0643\u0631 \u0627\u0644\u0635\u062f\u064a\u0642',
    kota: 'Madinah',
    jarakKm: 0.33,
    jamKunjungan: 'Umumnya terkunci, untuk ziarah luar',
    ringkas: 'Masjid bersejarah dekat Masjid Nabawi, dikaitkan dengan Khalifah Abu Bakar \u0631\u0636\u064a \u0627\u0644\u0644\u0647 \u0639\u0646\u0647.',
    gambar: '',
    koordinat: { lat: 24.4676, lng: 39.6101 },
    sejarah:
      'Masjid Abu Bakar Ash-Shiddiq adalah salah satu dari masjid-masjid tua bersejarah di barat daya Masjid Nabawi, berjarak sekitar 330 meter. Masjid ini dikaitkan dengan dua hal: tempat Abu Bakar \u0631\u0636\u064a \u0627\u0644\u0644\u0647 \u0639\u0646\u0647 pernah memimpin shalat Id, dan lokasi yang dinisbahkan kepada beliau.',
    sejarahSeksi: [
      {
        judul: 'Dinisbahkan kepada Abu Bakar \u0631\u0636\u064a \u0627\u0644\u0644\u0647 \u0639\u0646\u0647',
        isi: 'Diriwayatkan bahwa Khalifah Abu Bakar Ash-Shiddiq \u0631\u0636\u064a \u0627\u0644\u0644\u0647 \u0639\u0646\u0647 pernah memimpin shalat Id di tempat ini pada masa kekhalifahannya. Masjid ini termasuk dalam kompleks masjid tua di sekitar Masjid Ghamamah, sebagai pengingat jejak para Khalifah Rasyidin.',
      },
    ],
    tokoh: [
      { nama: 'Abu Bakar Ash-Shiddiq \u0631\u0636\u064a \u0627\u0644\u0644\u0647 \u0639\u0646\u0647', peran: 'Khalifah pertama, dinisbahkan kepada masjid ini' },
    ],
    keutamaan: [
      'Mengenang Abu Bakar \u0631\u0636\u064a \u0627\u0644\u0644\u0647 \u0639\u0646\u0647, sahabat terdekat dan Khalifah pertama.',
      'Menguatkan kecintaan pada generasi awal Islam (Khulafaur Rasyidin).',
    ],
    dalil: [
      {
        sumber: 'QS. At-Taubah: 40',
        teks: '\u201c\u2026ketika dia berkata kepada sahabatnya, \u2018Jangan engkau bersedih, sesungguhnya Allah bersama kita.\u2019\u201d (tentang Abu Bakar yang menemani Nabi \ufdfa saat hijrah).',
      },
    ],
    adab: [
      'Masjid umumnya terkunci; cukup ziarah dan ambil pelajaran dari luar.',
      'Tidak ada ritual khusus di tempat ini.',
    ],
  },
  {
    id: 'masjid-ali',
    tipe: 'masjid',
    nama: 'Masjid Ali bin Abi Thalib',
    namaArab: '\u0645\u0633\u062c\u062f \u0639\u0644\u064a \u0628\u0646 \u0623\u0628\u064a \u0637\u0627\u0644\u0628',
    kota: 'Madinah',
    jarakKm: 0.3,
    jamKunjungan: 'Kadang dibuka untuk peziarah',
    ringkas: 'Masjid bersejarah dekat Masjid Nabawi, dinisbahkan kepada Ali bin Abi Thalib \u0631\u0636\u064a \u0627\u0644\u0644\u0647 \u0639\u0646\u0647.',
    gambar: '',
    koordinat: { lat: 24.4679, lng: 39.6094 },
    sejarah:
      'Masjid Ali bin Abi Thalib terletak sekitar 300 meter di arah barat Masjid Nabawi, di kawasan masjid-masjid tua bersama Masjid Ghamamah dan Masjid Abu Bakar. Masjid ini dinisbahkan kepada Ali bin Abi Thalib \u0631\u0636\u064a \u0627\u0644\u0644\u0647 \u0639\u0646\u0647 dan pernah digunakan untuk shalat Id.',
    sejarahSeksi: [
      {
        judul: 'Dinisbahkan kepada Ali \u0631\u0636\u064a \u0627\u0644\u0644\u0647 \u0639\u0646\u0647',
        isi: 'Masjid ini dikaitkan dengan Ali bin Abi Thalib \u0631\u0636\u064a \u0627\u0644\u0644\u0647 \u0639\u0646\u0647, sepupu sekaligus menantu Nabi \ufdfa dan Khalifah keempat. Masjid ini juga pernah dipakai untuk pelaksanaan shalat Id pada masa awal Islam, dan menjadi bagian dari rangkaian ziarah masjid bersejarah di sekitar Masjid Nabawi.',
      },
    ],
    tokoh: [
      { nama: 'Ali bin Abi Thalib \u0631\u0636\u064a \u0627\u0644\u0644\u0647 \u0639\u0646\u0647', peran: 'Sepupu & menantu Nabi \ufdfa, Khalifah keempat' },
    ],
    keutamaan: [
      'Mengenang Ali \u0631\u0636\u064a \u0627\u0644\u0644\u0647 \u0639\u0646\u0647, salah satu yang pertama masuk Islam.',
      'Bagian dari rangkaian ziarah masjid bersejarah dekat Masjid Nabawi.',
    ],
    dalil: [],
    adab: [
      'Jika dibuka, shalat sunnah dua rakaat dengan tertib.',
      'Tidak ada ritual khusus; ambil pelajaran dari sejarahnya.',
    ],
  },
  {
    id: 'sabu-masajid',
    tipe: 'masjid',
    nama: 'Sab\u2019u Masajid (Tujuh Masjid)',
    namaArab: '\u0627\u0644\u0645\u0633\u0627\u062c\u062f \u0627\u0644\u0633\u0628\u0639\u0629',
    kota: 'Madinah',
    jarakKm: 3,
    jamKunjungan: 'Area terbuka, masjid utama buka',
    ringkas: 'Kompleks masjid kecil bersejarah di lokasi Perang Khandaq (Perang Parit).',
    gambar: '',
    koordinat: { lat: 24.4847, lng: 39.6028 },
    sejarah:
      'Sab\u2019u Masajid (\u201cTujuh Masjid\u201d) adalah kompleks beberapa masjid kecil bersejarah di sisi barat Gunung Sala\u2019, Madinah. Lokasi ini terhubung dengan Perang Khandaq (Perang Parit) tahun 5 H/627 M, ketika kaum muslimin menggali parit untuk mempertahankan Madinah dari pasukan gabungan (Al-Ahzab).',
    sejarahSeksi: [
      {
        judul: 'Perang Khandaq (Perang Parit)',
        isi: 'Atas usul Salman Al-Farisi \u0631\u0636\u064a \u0627\u0644\u0644\u0647 \u0639\u0646\u0647, kaum muslimin menggali parit di sekeliling sisi Madinah yang rawan. Strategi ini berhasil menahan pasukan gabungan Quraisy dan sekutunya. Masjid-masjid kecil dibangun di titik-titik tempat Nabi \ufdfa dan para sahabat shalat serta bertahan selama pengepungan.',
      },
      {
        judul: 'Masjid-Masjid dalam Kompleks',
        isi: 'Meski dinamai \u201cTujuh\u201d, kini terdapat sekitar enam masjid kecil: Masjid Al-Fath (terbesar, tempat Nabi \ufdfa berdoa memohon kemenangan), Masjid Salman Al-Farisi, Masjid Abu Bakar, Masjid Umar bin Khattab, Masjid Ali bin Abi Thalib, dan Masjid Fatimah. Banyak peziarah menambahkan Masjid Qiblatain sehingga genap disebut tujuh.',
      },
    ],
    tokoh: [
      { nama: 'Salman Al-Farisi \u0631\u0636\u064a \u0627\u0644\u0644\u0647 \u0639\u0646\u0647', peran: 'Pengusul strategi menggali parit' },
      { nama: 'Nabi Muhammad \ufdfa', peran: 'Memimpin pertahanan & berdoa di Masjid Al-Fath' },
    ],
    keutamaan: [
      'Mengenang strategi & keteguhan kaum muslimin dalam Perang Khandaq.',
      'Salah satu kompleks masjid tertua yang dibangun di titik bersejarah.',
    ],
    dalil: [
      {
        sumber: 'QS. Al-Ahzab: 9',
        teks: 'Wahai orang-orang yang beriman! Ingatlah akan nikmat Allah (yang diberikan) kepadamu ketika bala tentara datang kepadamu, lalu Kami kirimkan kepada mereka angin topan dan bala tentara yang tidak dapat kamu melihatnya.',
      },
    ],
    adab: [
      'Hanya untuk mengambil pelajaran sejarah; tidak ada ritual khusus.',
      'Masjid Al-Fath umumnya dibuka, masjid kecil lainnya kadang terkunci.',
      'Ziarah ke kompleks ini bersifat anjuran, bukan rukun umrah.',
    ],
    catatan: 'Keutamaan khusus shalat di masjid-masjid ini tidak berdasar hadis sahih tertentu. Ziarah cukup untuk mengenang sejarah Perang Khandaq, bukan mencari keberkahan khusus dari tempatnya.',
  },

  // ============================================ TEMPAT BERSEJARAH
  {
    id: 'jabal-nur',
    tipe: 'sejarah',
    nama: 'Jabal Nur (Gua Hira)',
    namaArab: 'جبل النور',
    kota: 'Makkah',
    jarakKm: 6.5,
    jamKunjungan: 'Disarankan pagi hari \u00b7 pendakian berat, butuh fisik prima',
    ringkas: 'Bukit tempat Gua Hira, lokasi turunnya wahyu pertama.',
    gambar: '/lokasi/jabal-nur.jpg',
    koordinat: { lat: 21.4577, lng: 39.8617 },
    sejarah:
      'Jabal Nur (\u201cGunung Cahaya\u201d) di timur laut Makkah memuat Gua Hira, tempat Nabi Muhammad \ufdfa menerima wahyu pertama berupa lima ayat awal Surah Al-\u2018Alaq melalui Malaikat Jibril.',
    sejarahSeksi: [
      {
        judul: 'Tempat Wahyu Pertama',
        isi: 'Sebelum diangkat menjadi nabi, Rasulullah \ufdfa kerap menyendiri dan bertafakkur di Gua Hira. Pada usia \u00b140 tahun, di bulan Ramadan (sekitar 610 M), Malaikat Jibril datang dan memerintahkan \u201cIqra\u2019 (Bacalah)\u201d. Setelah tiga kali dekapan, turunlah lima ayat pertama Surah Al-\u2018Alaq \u2014 penanda dimulainya kenabian.',
      },
      {
        judul: 'Lokasi & Pendakian',
        isi: 'Jabal Nur terletak sekitar 4\u20137 km di timur laut Masjidil Haram dengan ketinggian \u00b1640 m dpl. Gua Hira sendiri kecil (\u00b13,5 m \u00d7 1,5 m), berada dekat puncak menghadap ke arah Ka\u2019bah. Mendaki ke puncak melewati ratusan anak tangga terjal dan bisa memakan 30\u201360 menit atau lebih, sehingga butuh fisik prima.',
      },
    ],
    tokoh: [
      { nama: 'Nabi Muhammad \ufdfa', peran: 'Menerima wahyu pertama di Gua Hira' },
      { nama: 'Malaikat Jibril', peran: 'Menyampaikan wahyu pertama' },
    ],
    keutamaan: [
      'Tempat turunnya wahyu pertama dan dimulainya risalah Islam.',
      'Simbol pentingnya tafakkur, ilmu, dan membaca (Iqra\u2019).',
    ],
    dalil: [
      {
        sumber: 'QS. Al-\u2018Alaq: 1\u20135',
        teks: 'Bacalah dengan (menyebut) nama Tuhanmu yang menciptakan\u2026 Dia mengajarkan manusia apa yang tidak diketahuinya.',
      },
    ],
    adab: [
      'Gunakan alas kaki nyaman, bawa air cukup, berangkat pagi/sore agar tidak terlalu panas.',
      'Jamaah lansia atau berisiko cukup menyaksikan dari kejauhan.',
      'Ziarah ini bernilai mengambil pelajaran (ibrah), bukan ibadah khusus yang disyariatkan.',
    ],
    catatan:
      'Mendaki Gua Hira tidak termasuk rangkaian wajib umrah/haji; niatkan sebagai napak tilas sejarah, bukan ritual.',
  },
  {
    id: 'jabal-tsur',
    tipe: 'sejarah',
    nama: 'Jabal Tsur (Gua Tsur)',
    namaArab: 'جبل ثور',
    kota: 'Makkah',
    jarakKm: 7.0,
    jamKunjungan: 'Pagi hari \u00b7 pendakian terjal & panjang',
    ringkas: 'Gunung tempat Nabi \ufdfa dan Abu Bakar bersembunyi saat hijrah.',
    gambar: '/lokasi/jabal-tsur.jpg',
    koordinat: { lat: 21.3733, lng: 39.8628 },
    sejarah:
      'Jabal Tsur di selatan Makkah memuat Gua Tsur, tempat Nabi Muhammad \ufdfa dan Abu Bakar Ash-Shiddiq bersembunyi tiga hari dari kejaran Quraisy di awal perjalanan hijrah ke Madinah.',
    sejarahSeksi: [
      {
        judul: 'Benteng Perlindungan Saat Hijrah',
        isi: 'Sekitar 7 km di selatan Masjidil Haram, di puncak Jabal Tsur terdapat Gua Tsur tempat Rasulullah \ufdfa dan Abu Bakar berlindung selama tiga hari sebelum melanjutkan hijrah pada sekitar 16 Juli 622 M. Saat Abu Bakar khawatir musuh menemukan mereka, Nabi \ufdfa menenangkannya bahwa Allah bersama mereka.',
      },
      {
        judul: 'Jabal Nur vs Jabal Tsur',
        isi: 'Keduanya sering tertukar. Jabal Nur (utara/timur laut Makkah) adalah tempat wahyu pertama \u2014 pintu awal kenabian. Jabal Tsur (selatan Makkah) adalah tempat persembunyian saat hijrah \u2014 benteng yang menjaga kelangsungan risalah.',
      },
    ],
    tokoh: [
      { nama: 'Nabi Muhammad \ufdfa', peran: 'Bersembunyi di Gua Tsur saat hijrah' },
      { nama: 'Abu Bakar Ash-Shiddiq', peran: 'Sahabat yang menemani hijrah' },
    ],
    keutamaan: [
      'Saksi keteguhan iman dan tawakal di momen kritis hijrah.',
      'Diabadikan dalam Al-Qur\u2019an sebagai bukti pertolongan Allah.',
    ],
    dalil: [
      {
        sumber: 'QS. At-Taubah: 40',
        teks: 'Ketika dia berkata kepada sahabatnya, \u201cJangan bersedih, sesungguhnya Allah bersama kita.\u201d',
      },
    ],
    adab: [
      'Pendakian Jabal Tsur lebih berat dari Jabal Nur; perlu persiapan fisik baik.',
      'Berangkat pagi, bawa air cukup, hindari kerumunan padat.',
    ],
    catatan:
      'Mendaki gua bukan bagian dari ritual umrah; bernilai sebagai pelajaran sejarah.',
  },
  {
    id: 'jabal-rahmah',
    tipe: 'sejarah',
    nama: 'Jabal Rahmah',
    namaArab: 'جبل الرحمة',
    kota: 'Arafah',
    jarakKm: 22.0,
    jamKunjungan: 'Ramai saat musim haji \u00b7 area terbuka',
    ringkas: 'Bukit di Padang Arafah, dikaitkan dengan Khutbah Wada\u2019.',
    gambar: '/lokasi/jabal-rahmah.jpg',
    koordinat: { lat: 21.3549, lng: 39.9843 },
    sejarah:
      'Jabal Rahmah (\u201cBukit Kasih Sayang\u201d) di Padang Arafah. Di kawasan Arafah inilah Rasulullah \ufdfa menyampaikan Khutbah Wada\u2019 di hadapan puluhan ribu sahabat.',
    sejarahSeksi: [
      {
        judul: 'Padang Arafah & Khutbah Wada\u2019',
        isi: 'Arafah adalah inti pelaksanaan ibadah haji \u2014 di sinilah jamaah haji melaksanakan wukuf. Di kawasan ini Rasulullah \ufdfa menyampaikan Khutbah Wada\u2019 (haji perpisahan), berisi pesan tentang persaudaraan, hak-hak manusia, dan penyempurnaan agama.',
      },
      {
        judul: 'Tugu Penanda',
        isi: 'Di puncak Jabal Rahmah terdapat tugu/monumen penanda. Banyak peziarah naik ke bukit ini saat berada di Arafah, terutama di luar musim haji.',
      },
    ],
    tokoh: [
      { nama: 'Nabi Muhammad \ufdfa', peran: 'Menyampaikan Khutbah Wada\u2019 di Arafah' },
    ],
    keutamaan: [
      'Arafah adalah rukun haji (wukuf) \u2014 \u201cHaji itu (wukuf di) Arafah\u201d.',
      'Tempat bersejarah penyampaian Khutbah Wada\u2019.',
    ],
    adab: [
      'Tidak termasuk rangkaian wajib umrah; biasanya dikunjungi saat city tour Makkah.',
      'Area terbuka & panas \u2014 bawa pelindung matahari dan air.',
    ],
    catatan:
      'Kisah pertemuan Nabi Adam dan Hawa di bukit ini populer di masyarakat, namun TIDAK memiliki dasar riwayat yang kuat. Kunjungan bernilai sejarah, bukan ritual.',
  },
  {
    id: 'jabal-uhud',
    tipe: 'sejarah',
    nama: 'Jabal Uhud',
    namaArab: 'جبل أحد',
    kota: 'Madinah',
    jarakKm: 4.5,
    jamKunjungan: '06.00 \u2013 18.00 (waktu setempat)',
    ringkas: 'Gunung tempat Perang Uhud dan makam para syuhada.',
    gambar: '/lokasi/jabal-uhud.jpg',
    koordinat: { lat: 24.5018, lng: 39.6157 },
    sejarah:
      'Jabal Uhud, gunung batu kemerahan \u00b15 km di utara Madinah, menjadi saksi Perang Uhud (3 H / 625 M). Di kakinya dimakamkan para syuhada Uhud, termasuk Hamzah bin Abdul Muthalib.',
    sejarahSeksi: [
      {
        judul: 'Perang Uhud',
        isi: 'Perang Uhud terjadi pada 15 Syawal 3 Hijriah (sekitar Maret 625 M), pembalasan Quraisy atas kekalahan di Badar. \u00b1700 pasukan muslim menghadapi \u00b13.000 pasukan Quraisy. Kemenangan nyaris diraih, namun sebagian pasukan pemanah meninggalkan pos di Bukit Rumat karena tergiur harta rampasan. Khalid bin Walid (saat itu di pihak Quraisy) memanfaatkannya untuk menyerang balik, dan 70 sahabat gugur sebagai syuhada.',
      },
      {
        judul: 'Makam Para Syuhada',
        isi: 'Rasulullah \ufdfa memerintahkan agar para syuhada dimakamkan di tempat mereka gugur, di antara Jabal Uhud dan Bukit Rumat. Yang paling utama adalah makam Hamzah bin Abdul Muthalib, paman Nabi \ufdfa yang bergelar \u201cSinga Allah\u201d (Asadullah), gugur ditombak Wahsyi. Kompleks makam kini dipagari dan menjadi tujuan ziarah utama di Madinah.',
      },
      {
        judul: 'Gunung yang Dicintai Nabi \ufdfa',
        isi: 'Rasulullah \ufdfa bersabda bahwa Uhud adalah gunung yang mencintai beliau dan beliau mencintainya. Dalam riwayat lain disebutkan Uhud termasuk salah satu gunung di surga.',
      },
    ],
    tokoh: [
      { nama: 'Hamzah bin Abdul Muthalib', peran: 'Paman Nabi \ufdfa, \u201cSinga Allah\u201d, syahid di Uhud' },
      { nama: 'Mush\u2019ab bin Umair', peran: 'Sahabat pembawa panji, syahid di Uhud' },
      { nama: 'Nabi Muhammad \ufdfa', peran: 'Memimpin pasukan, terluka dalam perang' },
    ],
    keutamaan: [
      'Tempat mengenang pengorbanan para syuhada dan mengambil pelajaran ketaatan pada pemimpin.',
      'Disebut sebagai salah satu gunung yang dicintai Rasulullah \ufdfa.',
    ],
    dalil: [
      {
        sumber: 'HR. Bukhari',
        teks: 'Uhud adalah gunung yang mencintai kami dan kami mencintainya.',
      },
    ],
    adab: [
      'Berdiri di luar pagar makam dengan khidmat, ucapkan salam, dan doakan para syuhada.',
      'Hindari mengusap pagar, mengambil tanah untuk \u201cberkah\u201d, atau meminta kepada penghuni kubur.',
      'Naik ke Bukit Rumat (Bukit Pemanah) untuk merenungi medan perang.',
    ],
  },
  {
    id: 'jannatul-baqi',
    tipe: 'sejarah',
    nama: 'Jannatul Baqi\u2019',
    namaArab: 'جنة البقيع',
    kota: 'Madinah',
    jarakKm: 1.2,
    jamKunjungan: 'Dibuka untuk ziarah pada waktu tertentu setelah shalat',
    ringkas: 'Pemakaman utama umat Islam sejak zaman Nabi \ufdfa.',
    gambar: '/lokasi/jannatul-baqi.jpg',
    koordinat: { lat: 24.4672, lng: 39.6147 },
    sejarah:
      'Jannatul Baqi\u2019 adalah kompleks pemakaman utama di sisi tenggara Masjid Nabawi, tempat bersemayam ribuan sahabat, keluarga, dan ahlul bait Rasulullah \ufdfa.',
    sejarahSeksi: [
      {
        judul: 'Pemakaman Para Sahabat',
        isi: 'Sejak zaman Nabi \ufdfa, Baqi\u2019 menjadi pemakaman penduduk Madinah. Di sini dimakamkan banyak sahabat dan keluarga Rasulullah \ufdfa, di antaranya istri-istri beliau (termasuk Aisyah), putri-putri beliau, Utsman bin Affan, serta banyak tabiin.',
      },
      {
        judul: 'Adab Ziarah',
        isi: 'Menziarahi Baqi\u2019 dianjurkan untuk merenungkan kehidupan akhirat dan mendoakan para pendahulu. Rasulullah \ufdfa sendiri sering mendatangi Baqi\u2019 untuk mendoakan ahli kubur.',
      },
    ],
    tokoh: [
      { nama: 'Utsman bin Affan', peran: 'Khalifah ketiga, dimakamkan di Baqi\u2019' },
      { nama: 'Aisyah binti Abu Bakar', peran: 'Istri Nabi \ufdfa, Ummul Mukminin' },
      { nama: 'Ibrahim bin Muhammad', peran: 'Putra Rasulullah \ufdfa' },
    ],
    keutamaan: [
      'Tempat dimakamkannya ribuan sahabat dan ahlul bait Nabi \ufdfa.',
      'Ziarah mengingatkan pada kematian dan akhirat.',
    ],
    adab: [
      'Ucapkan salam kepada ahli kubur dan doakan mereka.',
      'Saat ini umumnya hanya jamaah pria yang dapat masuk; ikuti aturan waktu buka.',
      'Hindari perbuatan yang tidak dicontohkan seperti mengusap atau meminta kepada kubur.',
    ],
  },
  {
    id: 'masjid-qiblatain',
    tipe: 'sejarah',
    nama: 'Masjid Qiblatain',
    namaArab: 'مسجد القبلتين',
    kota: 'Madinah',
    jarakKm: 5.5,
    jamKunjungan: 'Buka 24 jam',
    ringkas: 'Masjid \u201cdua kiblat\u201d, saksi perpindahan arah kiblat ke Ka\u2019bah.',
    gambar: '/lokasi/masjid-qiblatain.jpg',
    koordinat: { lat: 24.4842, lng: 39.5779 },
    sejarah:
      'Masjid Qiblatain (\u201cMasjid Dua Kiblat\u201d) di barat laut Madinah adalah tempat turunnya perintah memindahkan kiblat dari Baitul Maqdis ke Ka\u2019bah saat shalat berlangsung.',
    sejarahSeksi: [
      {
        judul: 'Perpindahan Kiblat',
        isi: 'Awalnya bernama Masjid Bani Salamah, dibangun Sawad bin Ghanam bin Ka\u2019ab pada tahun 2 H. Setelah Nabi \ufdfa shalat menghadap Baitul Maqdis selama sekitar 16 bulan di Madinah, turun wahyu memerintahkan menghadap Ka\u2019bah. Saat shalat sedang berlangsung, imam dan jamaah berputar mengubah arah kiblat \u2014 sehingga masjid ini memiliki dua arah kiblat dalam satu peristiwa.',
      },
    ],
    tokoh: [
      { nama: 'Nabi Muhammad \ufdfa', peran: 'Menerima perintah perpindahan kiblat' },
      { nama: 'Sawad bin Ghanam bin Ka\u2019ab', peran: 'Membangun masjid (Masjid Bani Salamah)' },
    ],
    keutamaan: [
      'Saksi peristiwa besar perpindahan arah kiblat umat Islam.',
      'Simbol ketaatan penuh para sahabat terhadap perintah Allah.',
    ],
    dalil: [
      {
        sumber: 'QS. Al-Baqarah: 144',
        teks: 'Maka palingkanlah wajahmu ke arah Masjidil Haram. Dan di mana saja kamu berada, palingkanlah wajahmu ke arahnya.',
      },
    ],
    adab: [
      'Biasanya dikunjungi dalam city tour Madinah bersama Masjid Quba dan Jabal Uhud.',
    ],
  },
  {
    id: 'jannatul-mualla',
    tipe: 'sejarah',
    nama: 'Jannatul Mu\u2019alla',
    namaArab: '\u062c\u0646\u0629 \u0627\u0644\u0645\u0639\u0644\u0627\u0629',
    kota: 'Makkah',
    jarakKm: 1.5,
    jamKunjungan: 'Ziarah dari luar pagar',
    ringkas: 'Pemakaman bersejarah Makkah, tempat dimakamkannya Sayyidah Khadijah \u0631\u0636\u064a \u0627\u0644\u0644\u0647 \u0639\u0646\u0647\u0627.',
    gambar: '/lokasi/jannatul-mualla.jpg',
    koordinat: { lat: 21.4314, lng: 39.8294 },
    sejarah:
      'Jannatul Mu\u2019alla (juga disebut Maqbarah Al-Ma\u2019la) adalah pemakaman tua di distrik Al-Hujun, Makkah, tidak jauh dari Masjid Jin. Di sinilah dimakamkan istri pertama Nabi \ufdfa, Sayyidah Khadijah binti Khuwailid, beserta sejumlah kerabat dan keluarga beliau.',
    sejarahSeksi: [
      {
        judul: 'Tempat Peristirahatan Sayyidah Khadijah',
        isi: 'Jannatul Mu\u2019alla dikenal sebagai tempat dimakamkannya Sayyidah Khadijah \u0631\u0636\u064a \u0627\u0644\u0644\u0647 \u0639\u0646\u0647\u0627, istri pertama Nabi \ufdfa dan wanita pertama yang beriman. Ia wafat di Makkah sebelum peristiwa hijrah. Di pemakaman ini juga dimakamkan sejumlah anggota keluarga dan kerabat Nabi \ufdfa, termasuk kakek beliau Abdul Muthalib.',
      },
      {
        judul: 'Pemakaman Bersejarah Makkah',
        isi: 'Sebagaimana Jannatul Baqi di Madinah, Jannatul Mu\u2019alla menjadi pemakaman utama bagi penduduk Makkah sejak masa awal Islam. Banyak sahabat dan tabi\u2019in dimakamkan di sini. Peziarah dianjurkan mendoakan ahli kubur dari luar pagar tanpa melakukan ritual yang berlebihan.',
      },
    ],
    tokoh: [
      { nama: 'Sayyidah Khadijah \u0631\u0636\u064a \u0627\u0644\u0644\u0647 \u0639\u0646\u0647\u0627', peran: 'Istri pertama Nabi \ufdfa, dimakamkan di sini' },
      { nama: 'Abdul Muthalib', peran: 'Kakek Nabi \ufdfa' },
    ],
    keutamaan: [
      'Mengingatkan pada pengorbanan Sayyidah Khadijah yang mendukung dakwah di masa-masa tersulit.',
      'Tempat untuk merenungkan kematian dan mendoakan kaum muslimin yang telah wafat.',
    ],
    dalil: [
      {
        sumber: 'HR. Muslim',
        teks: 'Nabi \ufdfa mengajarkan doa ziarah kubur: \u201cAss-sal\u0101mu \u2018alaikum ahlad-diy\u0101r minal-mu\u2019min\u012bna wal-muslim\u012bn, wa inn\u0101 in sy\u0101\u2019all\u0101hu bikum l\u0101\u1e25iq\u016bn.\u201d (Salam sejahtera atas kalian wahai penghuni kubur dari kaum mukminin dan muslimin.)',
      },
    ],
    adab: [
      'Ziarah dilakukan dari luar pagar; mendoakan ahli kubur, bukan meminta kepada mereka.',
      'Hindari menyentuh, mengusap, atau menjadikan kuburan sebagai tempat memohon.',
      'Jaga ketertiban dan kekhusyukan saat berdoa.',
    ],
    catatan: 'Ziarah kubur disyariatkan untuk mengingat akhirat dan mendoakan yang wafat. Hindari praktik yang tidak sesuai tuntunan seperti meminta kepada ahli kubur.',
  },
  {
    id: 'jabal-qubais',
    tipe: 'sejarah',
    nama: 'Jabal Abu Qubais',
    namaArab: '\u062c\u0628\u0644 \u0623\u0628\u064a \u0642\u0628\u064a\u0633',
    kota: 'Makkah',
    jarakKm: 0.5,
    jamKunjungan: 'Dilihat dari area Masjidil Haram',
    ringkas: 'Bukit di sebelah timur Masjidil Haram, saksi mukjizat terbelahnya bulan.',
    gambar: '/lokasi/jabal-qubais.jpg',
    koordinat: { lat: 21.4231, lng: 39.8305 },
    sejarah:
      'Jabal Abu Qubais adalah salah satu bukit tertua di Makkah, terletak di sebelah timur Masjidil Haram dekat bukit Shafa. Dalam tradisi Islam, bukit ini dikaitkan dengan peristiwa mukjizat terbelahnya bulan (syaqqul qamar) di hadapan kaum Quraisy.',
    sejarahSeksi: [
      {
        judul: 'Mukjizat Terbelahnya Bulan',
        isi: 'Diriwayatkan bahwa kaum musyrikin Quraisy meminta Nabi \ufdfa menunjukkan tanda kenabian. Maka atas izin Allah, bulan terbelah menjadi dua \u2014 satu bagian terlihat di atas Jabal Abu Qubais dan bagian lain di arah seberang. Peristiwa ini disinggung dalam Surah Al-Qamar.',
      },
    ],
    tokoh: [
      { nama: 'Nabi Muhammad \ufdfa', peran: 'Menunjukkan mukjizat terbelahnya bulan atas izin Allah' },
    ],
    keutamaan: [
      'Menjadi pengingat salah satu mukjizat besar Nabi \ufdfa yang disaksikan kaum Quraisy.',
    ],
    dalil: [
      {
        sumber: 'QS. Al-Qamar: 1',
        teks: 'Telah dekat hari Kiamat dan bulan pun telah terbelah.',
      },
    ],
    adab: [
      'Cukup mengambil pelajaran dari sejarahnya; tidak ada ritual khusus.',
      'Area sekitarnya kini banyak dikelilingi bangunan modern.',
    ],
  },
  {
    id: 'masjid-aisyah-tanim',
    tipe: 'sejarah',
    nama: 'Masjid Aisyah (Tan\u2019im)',
    namaArab: 'مسجد عائشة',
    kota: 'Makkah',
    jarakKm: 7.5,
    jamKunjungan: 'Buka 24 jam \u00b7 titik miqat',
    ringkas: 'Miqat terdekat dari Makkah untuk memulai ihram umrah.',
    gambar: '/lokasi/masjid-aisyah-tanim.jpg',
    koordinat: { lat: 21.4486, lng: 39.7656 },
    sejarah:
      'Masjid Aisyah di Tan\u2019im adalah salah satu titik miqat terdekat dari Makkah, sekitar 7,5 km dari Masjidil Haram, tempat banyak jamaah mengambil ihram untuk umrah.',
    sejarahSeksi: [
      {
        judul: 'Miqat Sayyidah Aisyah',
        isi: 'Setelah haji wada\u2019, Aisyah radhiyallahu \u2018anha ingin melaksanakan umrah. Rasulullah \ufdfa menyuruhnya berangkat ke Tan\u2019im dan memulai ihram dari sana. Karena itu masjid ini dikenal sebagai Masjid Aisyah, dan Tan\u2019im menjadi salah satu batas tanah haram yang lazim digunakan penduduk Makkah untuk miqat umrah.',
      },
    ],
    tokoh: [
      { nama: 'Aisyah binti Abu Bakar', peran: 'Mengambil miqat umrah dari Tan\u2019im' },
    ],
    keutamaan: [
      'Titik miqat terdekat dari Makkah untuk ihram umrah.',
      'Banyak dipakai jamaah untuk umrah sunnah tambahan.',
    ],
    adab: [
      'Berniat ihram dan mulai talbiyah dari sini saat hendak umrah lagi.',
      'Sediakan kain ihram sebelum berangkat.',
    ],
  },
  {
    id: 'jabal-sala',
    tipe: 'sejarah',
    nama: 'Jabal Sala\u2019 (Gunung Sala)',
    namaArab: '\u062c\u0628\u0644 \u0633\u0644\u0639',
    kota: 'Madinah',
    jarakKm: 1.5,
    jamKunjungan: 'Dilihat dari area sekitar',
    ringkas: 'Gunung di pusat Madinah, titik strategis pertahanan dalam Perang Khandaq.',
    gambar: '',
    koordinat: { lat: 24.4772, lng: 39.6053 },
    sejarah:
      'Jabal Sala\u2019 adalah gunung yang terletak di bagian dalam Kota Madinah, dekat kompleks Sab\u2019u Masajid. Gunung ini menjadi titik strategis pertahanan kaum muslimin saat Perang Khandaq, karena parit digali di sisi-sisi yang rawan sementara Jabal Sala\u2019 menjadi benteng alami di belakang pasukan.',
    sejarahSeksi: [
      {
        judul: 'Benteng Alami Perang Khandaq',
        isi: 'Saat Perang Khandaq (5 H), pasukan muslimin memposisikan diri dengan Jabal Sala\u2019 di belakang mereka sebagai pelindung alami, sementara parit (khandaq) digali di sisi yang terbuka. Strategi ini, atas usul Salman Al-Farisi, membuat Madinah sulit ditembus pasukan gabungan.',
      },
    ],
    tokoh: [
      { nama: 'Nabi Muhammad \ufdfa', peran: 'Memimpin pertahanan Madinah dengan Jabal Sala\u2019 sebagai benteng' },
    ],
    keutamaan: [
      'Saksi bisu keteguhan dan strategi kaum muslimin dalam Perang Khandaq.',
    ],
    dalil: [],
    adab: [
      'Cukup untuk mengambil pelajaran sejarah; tidak ada ritual khusus.',
    ],
  },
];

export function lokasiByTipe(tipe: Lokasi['tipe']): Lokasi[] {
  return daftarLokasi.filter((l) => l.tipe === tipe);
}

export function lokasiById(id: string): Lokasi | undefined {
  return daftarLokasi.find((l) => l.id === id);
}

export type KotaFilter = 'Makkah' | 'Madinah';

export function lokasiByKota(kota: KotaFilter): Lokasi[] {
  return daftarLokasi.filter((l) => {
    if (kota === 'Makkah') return l.kota === 'Makkah' || l.kota === 'Arafah';
    return l.kota === 'Madinah';
  });
}

/** Bangun deep-link Google Maps dari koordinat (membuka app Maps di HP, web di desktop). */
export function gmapsUrl(l: Lokasi): string {
  const q = encodeURIComponent(`${l.nama} ${l.kota}`);
  return `https://www.google.com/maps/search/?api=1&query=${l.koordinat.lat},${l.koordinat.lng}(${q})`;
}
