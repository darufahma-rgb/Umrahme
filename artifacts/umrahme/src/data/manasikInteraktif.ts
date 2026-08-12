// =============================================================
// DATA MANASIK INTERAKTIF
// Semua konten diturunkan dari data yang sudah tervalidasi:
//   - tatacara.ts (6 step alur umrah)
//   - ihram.ts (niatIhram, laranganIhram, tataCaraMemakaiIhram)
//   - doa.ts (kategori ihram, tawaf, sai, tahallul)
//   - Buku Tuntunan Manasik Haji dan Umrah Kementerian Agama RI
//   - Umrah and Visit Guide, Ministry of Hajj and Umrah Saudi Arabia
// TIDAK ada fakta ibadah baru yang dikarang.
// =============================================================

export interface ManasikKartu {
  id: string;
  judul: string;
  penjelasan: string;
  poin?: string[];
  peringatan?: string;
  ilustrasiTipe: 'miqat' | 'ihram-pakaian' | 'talbiyah' | 'larangan' | 'kabah' | 'tawaf-arah' | 'hajar-aswad' | 'maqam-ibrahim' | 'shafa' | 'sai-7' | 'marwah' | 'tahallul' | 'selesai';
}

export interface ManasikUrutanItem {
  id: string;
  teks: string;
  urutanBenar: number;
}

export interface ManasikKuisSoal {
  id: string;
  pertanyaan: string;
  pilihan: string[];
  jawabanBenarIndex: number;
  penjelasanSingkat: string;
}

export interface ManasikSkenarioPilihan {
  teks: string;
  benar: boolean;
  penjelasan: string;
}

export interface ManasikSkenario {
  id: string;
  judul: string;
  situasi: string;
  pertanyaan: string;
  pilihan: ManasikSkenarioPilihan[];
}

export interface ManasikModul {
  id: string;
  judul: string;
  subjudul: string;
  urutan: number;
  warna: 'rose' | 'gold' | 'teal' | 'mute';
  kartuKenali: ManasikKartu[];
  urutanItems: ManasikUrutanItem[];
  skenario: ManasikSkenario[];
  kuisSoal: ManasikKuisSoal[];
}

// -----------------------------------------------------------------------
// Modul 1 — Ihram & Miqat
// Sumber: tatacara.ts step 1-2, ihram.ts, doa.ts (niat-ihram-umrah, talbiyah)
// -----------------------------------------------------------------------
const modulIhram: ManasikModul = {
  id: 'ihram-miqat',
  judul: 'Ihram & Miqat',
  subjudul: 'Pintu masuk rangkaian umrah',
  urutan: 1,
  warna: 'rose',
  kartuKenali: [
    {
      id: 'ihram-1',
      judul: 'Apa itu Miqat?',
      penjelasan:
        'Miqat adalah batas tempat untuk memulai ihram. Jamaah yang hendak umrah harus sudah berniat ketika sejajar dengan miqat dan tidak menundanya sampai tiba di Jeddah atau Makkah.',
      poin: [
        'Dari Madinah, rombongan umumnya mengambil miqat di Dzulhulaifah atau Bir Ali.',
        'Jika terbang langsung menuju Jeddah, kenakan pakaian ihram lebih awal dan berniat saat pesawat mendekati miqat.',
        'Ikuti pengumuman awak pesawat dan arahan pembimbing agar tidak terlambat berniat.',
      ],
      peringatan: 'Jangan menunggu pesawat mendarat di Jeddah untuk berniat jika rute penerbangan sudah melewati miqat.',
      ilustrasiTipe: 'miqat',
    },
    {
      id: 'ihram-2',
      judul: 'Bersiap Sebelum Berihram',
      penjelasan:
        'Mandi, membersihkan diri, memotong kuku, dan merapikan rambut dilakukan sebelum niat. Wewangian boleh dipakai pada badan sebelum ihram, tetapi tidak pada kain ihram dan tidak dipakai lagi setelah berniat.',
      poin: [
        'Siapkan obat, alas kaki, tas kecil, dan kebutuhan toilet sebelum niat.',
        'Perempuan yang sedang haid tetap dapat mandi, mengenakan pakaian ihram, dan berniat di miqat.',
      ],
      ilustrasiTipe: 'ihram-pakaian',
    },
    {
      id: 'ihram-3',
      judul: 'Pakaian Ihram',
      penjelasan:
        'Laki-laki memakai izar dan rida, tidak menutup kepala, serta menggunakan alas kaki yang tidak menutup mata kaki. Perempuan memakai pakaian longgar yang menutup aurat tanpa pakaian khusus, niqab, atau sarung tangan.',
      poin: [
        'Sabuk, jam tangan, kacamata, payung, dan tas tetap boleh digunakan.',
        'Idhtiba atau membuka bahu kanan bukan cara berpakaian sepanjang ihram; dilakukan pria hanya ketika tawaf umrah.',
      ],
      ilustrasiTipe: 'ihram-pakaian',
    },
    {
      id: 'ihram-4',
      judul: 'Niat & Talbiyah',
      penjelasan:
        'Niat berada di dalam hati ketika sejajar dengan miqat, lalu masuk ke dalam ibadah dengan mengucapkan "Labbaika Allahumma umrah". Setelah itu perbanyak talbiyah sampai akan memulai tawaf.',
      poin: [
        'Salat dua rakaat dapat dilakukan bila waktu dan keadaan memungkinkan; jangan sampai membuat rombongan tertinggal.',
        'Laki-laki dapat mengeraskan talbiyah tanpa mengganggu, sedangkan perempuan membacanya dengan suara yang didengar dirinya.',
      ],
      ilustrasiTipe: 'talbiyah',
    },
    {
      id: 'ihram-5',
      judul: 'Larangan Selama Ihram',
      penjelasan:
        'Sejak berniat, hindari wewangian, memotong rambut atau kuku, hubungan suami istri dan pendahuluannya, akad nikah, berburu, berkata kotor, serta bertengkar. Pria juga tidak memakai pakaian yang membentuk anggota tubuh dan tidak menutup kepala.',
      peringatan: 'Jika melanggar karena lupa, tidak sengaja, sakit, atau keadaan darurat, segera catat kejadiannya dan tanyakan kepada pembimbing. Jangan menetapkan dam sendiri.',
      ilustrasiTipe: 'larangan',
    },
  ],
  urutanItems: [
    { id: 'ih-u1', teks: 'Potong kuku & rapikan rambut (terakhir sebelum ihram)', urutanBenar: 1 },
    { id: 'ih-u2', teks: 'Mandi sunnah ihram', urutanBenar: 2 },
    { id: 'ih-u3', teks: 'Mengenakan pakaian ihram', urutanBenar: 3 },
    { id: 'ih-u4', teks: 'Shalat sunnah 2 rakaat di miqat', urutanBenar: 4 },
    { id: 'ih-u5', teks: 'Mengucapkan niat ihram & memulai talbiyah', urutanBenar: 5 },
  ],
  skenario: [
    {
      id: 'ih-s1',
      judul: 'Miqat di Dalam Pesawat',
      situasi: 'Awak pesawat mengumumkan bahwa pesawat akan sejajar dengan miqat dalam 30 menit. Anda belum mengenakan pakaian ihram.',
      pertanyaan: 'Apa tindakan yang paling tepat?',
      pilihan: [
        { teks: 'Segera bersiap dan kenakan ihram sebelum sejajar miqat', benar: true, penjelasan: 'Persiapan dilakukan lebih awal agar niat dapat dimulai tepat ketika sejajar miqat.' },
        { teks: 'Menunggu mendarat di Jeddah agar lebih nyaman', benar: false, penjelasan: 'Jeddah sudah berada setelah batas miqat untuk rute ini. Menunda sampai mendarat berisiko melewati miqat tanpa ihram.' },
        { teks: 'Berniat sekarang lalu mengganti pakaian setelah mendarat', benar: false, penjelasan: 'Pakaian dan kebutuhan ihram sebaiknya disiapkan dahulu, kemudian niat dimulai ketika sejajar miqat.' },
      ],
    },
    {
      id: 'ih-s2',
      judul: 'Haid Saat Tiba di Miqat',
      situasi: 'Seorang jamaah perempuan sedang haid ketika rombongan tiba di Bir Ali.',
      pertanyaan: 'Apa yang harus ia lakukan?',
      pilihan: [
        { teks: 'Tetap mandi, berpakaian ihram, dan berniat di miqat', benar: true, penjelasan: 'Haid tidak menghalangi niat ihram. Tawaf ditunda sampai ia suci sesuai arahan pembimbing.' },
        { teks: 'Menunda niat sampai sudah suci di Makkah', benar: false, penjelasan: 'Niat ihram tetap dilakukan di miqat. Yang belum dilakukan ketika haid adalah tawaf.' },
        { teks: 'Tidak perlu ikut umrah bersama rombongan', benar: false, penjelasan: 'Ia tetap dapat memasuki ihram dan mengikuti perjalanan sambil menunggu waktu yang tepat untuk tawaf.' },
      ],
    },
    {
      id: 'ih-s3',
      judul: 'Tidak Sengaja Memakai Wewangian',
      situasi: 'Setelah berniat ihram, Anda tanpa sengaja memakai sabun hotel yang beraroma kuat.',
      pertanyaan: 'Apa langkah yang aman?',
      pilihan: [
        { teks: 'Hentikan pemakaian, bersihkan bila bisa, lalu laporkan kepada pembimbing', benar: true, penjelasan: 'Jangan mengulang sendiri atau menetapkan dam sendiri. Jelaskan kejadian agar pembimbing dapat memberi arahan yang tepat.' },
        { teks: 'Menganggap umrah langsung batal', benar: false, penjelasan: 'Pelanggaran larangan ihram tidak otomatis membatalkan seluruh umrah. Kondisi dan hukumnya perlu ditanyakan.' },
        { teks: 'Melanjutkan karena sudah terlanjur', benar: false, penjelasan: 'Begitu menyadari, hentikan penggunaan produk beraroma dan cari arahan.' },
      ],
    },
  ],
  kuisSoal: [
    {
      id: 'ih-k1',
      pertanyaan: 'Di mana jamaah harus mulai berihram?',
      pilihan: ['Di dalam pesawat', 'Di Miqat', 'Di Masjidil Haram', 'Di hotel Makkah'],
      jawabanBenarIndex: 1,
      penjelasanSingkat:
        'Miqat adalah titik batas yang ditetapkan. Jamaah wajib berihram sebelum melewatinya (Tata Cara Umrah, langkah 1).',
    },
    {
      id: 'ih-k2',
      pertanyaan: 'Bolehkah memakai wewangian SEBELUM niat ihram?',
      pilihan: ['Ya, boleh pada badan', 'Tidak boleh sama sekali', 'Hanya untuk perempuan', 'Boleh di pakaian saja'],
      jawabanBenarIndex: 0,
      penjelasanSingkat:
        'Wewangian boleh dipakai pada badan sebelum berniat ihram. Setelah niat, memakai wewangian menjadi larangan ihram (Panduan Ihram, bagian "Sebelum Berihram").',
    },
    {
      id: 'ih-k3',
      pertanyaan: 'Bacaan apa yang diperbanyak setelah berihram menuju Makkah?',
      pilihan: ['Doa safar', 'Talbiyah', 'Istighfar', 'Shalawat'],
      jawabanBenarIndex: 1,
      penjelasanSingkat:
        'Talbiyah diperbanyak sejak berniat ihram hingga mulai tawaf. Laki-laki mengeraskan, perempuan melirihkan (Tata Cara Umrah, langkah 2).',
    },
    {
      id: 'ih-k4',
      pertanyaan: 'Larangan ihram mana yang berlaku untuk SEMUA jamaah, baik pria maupun wanita?',
      pilihan: ['Memakai pakaian berjahit', 'Memakai wewangian', 'Menutup kepala', 'Memakai niqab'],
      jawabanBenarIndex: 1,
      penjelasanSingkat:
        'Memakai wewangian termasuk larangan umum (berlaku semua gender). Pakaian berjahit & menutup kepala khusus larangan pria; niqab khusus larangan wanita (Panduan Ihram, larangan ihram).',
    },
    {
      id: 'ih-k5',
      pertanyaan: 'Pesawat menuju Jeddah akan segera sejajar dengan miqat. Apa yang dilakukan?',
      pilihan: ['Menunggu tiba di hotel', 'Berniat umrah saat sejajar miqat', 'Mengganti pakaian setelah mendarat', 'Menunggu masuk Masjidil Haram'],
      jawabanBenarIndex: 1,
      penjelasanSingkat: 'Jamaah harus sudah mengenakan pakaian ihram dan berniat ketika pesawat sejajar dengan miqat, sebelum mendarat di Jeddah.',
    },
  ],
};

// -----------------------------------------------------------------------
// Modul 2 — Tawaf
// Sumber: tatacara.ts step 3-4, doa.ts (tawaf-putaran-1..7, tawaf-rabbana-atina)
// -----------------------------------------------------------------------
const modulTawaf: ManasikModul = {
  id: 'tawaf',
  judul: 'Tawaf',
  subjudul: 'Mengelilingi Ka\'bah 7 putaran',
  urutan: 2,
  warna: 'rose',
  kartuKenali: [
    {
      id: 'tw-1',
      judul: "Apa itu Tawaf?",
      penjelasan:
        "Tawaf adalah mengelilingi Ka'bah tujuh putaran dengan Ka'bah selalu di sebelah kiri. Mulai dan akhir setiap putaran berada pada garis sejajar Hajar Aswad.",
      poin: [
        'Tutup aurat dan pastikan kondisi bersuci sebelum memulai sesuai arahan pembimbing.',
        'Satu kali kembali ke garis Hajar Aswad dihitung satu putaran.',
        'Tawaf dapat dilakukan di pelataran mataf atau lantai atas sesuai kondisi fisik dan kepadatan.',
      ],
      ilustrasiTipe: 'kabah',
    },
    {
      id: 'tw-2',
      judul: 'Mulai dari Hajar Aswad',
      penjelasan:
        "Saat sejajar dengan Hajar Aswad, hadapkan badan bila memungkinkan, ucapkan 'Bismillahi Allahu Akbar', lalu mulai bergerak mengikuti arus. Bila jauh atau padat, cukup memberi isyarat tanpa memaksa mendekat.",
      peringatan: 'Mencium atau menyentuh Hajar Aswad adalah sunnah. Jangan mendorong, menyakiti, atau memotong arus jamaah untuk melakukannya.',
      ilustrasiTipe: 'hajar-aswad',
    },
    {
      id: 'tw-3',
      judul: "Ka'bah Selalu di Sebelah Kiri",
      penjelasan:
        "Ikuti arah berlawanan jarum jam dengan Ka'bah di sebelah kiri dan tetap berada di luar Hijir Ismail. Berjalan melewati bagian dalam Hijir Ismail membuat lintasan tidak mengelilingi seluruh Ka'bah.",
      poin: [
        'Bergerak searah arus dan jangan berhenti mendadak untuk berfoto atau membaca doa.',
        'Pria dapat melakukan raml pada tiga putaran awal jika mampu dan tidak membahayakan orang lain.',
        'Tetapkan titik temu bersama rombongan sebelum mulai agar tidak panik bila terpisah.',
      ],
      peringatan: 'Jika ragu jumlah putaran, gunakan jumlah yang paling sedikit dan yakini, atau segera minta arahan pembimbing.',
      ilustrasiTipe: 'tawaf-arah',
    },
    {
      id: 'tw-4',
      judul: 'Doa Tidak Harus Berbeda Tiap Putaran',
      penjelasan:
        'Jamaah boleh berdzikir, membaca Al-Quran, atau berdoa dengan bahasa yang dipahami selama tawaf. Daftar doa per putaran di Umrahme adalah bantuan hafalan, bukan syarat sah tawaf.',
      poin: [
        "Di antara Rukun Yamani dan Hajar Aswad dianjurkan membaca 'Rabbana atina fid-dunya hasanah...'.",
        'Utamakan kekhusyukan dan keselamatan; membaca dari ponsel tidak boleh membuat langkah berhenti atau menabrak jamaah lain.',
      ],
      ilustrasiTipe: 'kabah',
    },
    {
      id: 'tw-5',
      judul: 'Setelah Tawaf Selesai',
      penjelasan:
        "Setelah tujuh putaran, keluar perlahan mengikuti arus. Salat sunnah dua rakaat dilakukan di belakang Maqam Ibrahim bila memungkinkan, atau di bagian lain Masjidil Haram jika area padat, lalu minum zamzam sebelum menuju Sa'i.",
      peringatan: 'Jangan salat tepat di jalur padat karena dapat menghalangi dan membahayakan jamaah lain.',
      ilustrasiTipe: 'maqam-ibrahim',
    },
  ],
  urutanItems: [
    { id: 'tw-u1', teks: 'Pastikan sudah berwudhu (tawaf harus dalam keadaan suci)', urutanBenar: 1 },
    { id: 'tw-u2', teks: "Masuk Masjidil Haram, mendahulukan kaki kanan", urutanBenar: 2 },
    { id: 'tw-u3', teks: "Menuju posisi sejajar Hajar Aswad untuk memulai", urutanBenar: 3 },
    { id: 'tw-u4', teks: "Mulai tawaf — Ka'bah di sebelah kiri, berputar berlawanan jarum jam", urutanBenar: 4 },
    { id: 'tw-u5', teks: "Selesaikan 7 putaran sambil berdoa di tiap putaran", urutanBenar: 5 },
    { id: 'tw-u6', teks: 'Shalat sunnah 2 rakaat di belakang Maqam Ibrahim & minum zamzam', urutanBenar: 6 },
  ],
  skenario: [
    {
      id: 'tw-s1',
      judul: 'Hajar Aswad Sangat Padat',
      situasi: 'Saat memulai putaran berikutnya, area Hajar Aswad penuh dan jamaah saling berhimpitan.',
      pertanyaan: 'Apa yang sebaiknya dilakukan?',
      pilihan: [
        { teks: 'Memberi isyarat dari jarak aman lalu terus mengikuti arus', benar: true, penjelasan: 'Menyentuh Hajar Aswad adalah sunnah. Keselamatan dan tidak menyakiti jamaah lain harus diutamakan.' },
        { teks: 'Mendorong perlahan sampai berhasil menyentuhnya', benar: false, penjelasan: 'Mendorong tetap dapat menyakiti dan mengganggu jamaah lain.' },
        { teks: 'Berhenti di jalur sampai kerumunan berkurang', benar: false, penjelasan: 'Berhenti di jalur tawaf menahan arus dan meningkatkan risiko tabrakan.' },
      ],
    },
    {
      id: 'tw-s2',
      judul: 'Ragu Jumlah Putaran',
      situasi: 'Di tengah tawaf Anda ragu apakah baru menyelesaikan empat atau lima putaran.',
      pertanyaan: 'Hitungan mana yang digunakan?',
      pilihan: [
        { teks: 'Ambil jumlah yang paling sedikit, yaitu empat', benar: true, penjelasan: 'Gunakan jumlah yang paling diyakini agar tujuh putaran dapat diselesaikan dengan pasti.' },
        { teks: 'Ambil lima agar lebih cepat selesai', benar: false, penjelasan: 'Mengambil angka yang lebih besar saat ragu berisiko membuat jumlah putaran kurang.' },
        { teks: 'Batalkan seluruh tawaf dan mulai besok', benar: false, penjelasan: 'Keraguan hitungan dapat diselesaikan dengan mengambil jumlah yang paling sedikit dan melanjutkan.' },
      ],
    },
    {
      id: 'tw-s3',
      judul: 'Masuk ke Hijir Ismail',
      situasi: 'Karena mengikuti orang di depan, Anda melewati bagian dalam pagar Hijir Ismail pada satu putaran.',
      pertanyaan: 'Apa yang perlu dilakukan?',
      pilihan: [
        { teks: 'Ulangi putaran tersebut melalui sisi luar Hijir Ismail', benar: true, penjelasan: 'Hijir Ismail termasuk bagian Ka\'bah sehingga lintasan harus melewati sisi luarnya.' },
        { teks: 'Tetap hitung karena masih berjalan mengelilingi area', benar: false, penjelasan: 'Lintasan melalui bagian dalam Hijir Ismail tidak mengelilingi seluruh bagian Ka\'bah.' },
        { teks: 'Cukup menambah doa pada putaran berikutnya', benar: false, penjelasan: 'Doa tidak menggantikan putaran yang lintasannya belum benar.' },
      ],
    },
  ],
  kuisSoal: [
    {
      id: 'tw-k1',
      pertanyaan: "Berapa kali jamaah mengelilingi Ka'bah dalam satu tawaf?",
      pilihan: ['5 kali', '7 kali', '3 kali', '9 kali'],
      jawabanBenarIndex: 1,
      penjelasanSingkat:
        "Tawaf dilakukan 7 putaran — ini adalah ketentuan baku yang tidak boleh dikurangi (Tata Cara Umrah, langkah 3).",
    },
    {
      id: 'tw-k2',
      pertanyaan: 'Tawaf dilakukan dengan arah...',
      pilihan: [
        'Searah jarum jam',
        'Berlawanan arah jarum jam',
        'Boleh pilih arah sendiri',
        'Arah berganti tiap putaran',
      ],
      jawabanBenarIndex: 1,
      penjelasanSingkat:
        "Tawaf selalu berlawanan arah jarum jam sehingga Ka'bah berada di sebelah kiri jamaah (Tata Cara Umrah, langkah 3).",
    },
    {
      id: 'tw-k3',
      pertanyaan: 'Doa apa yang dibaca di antara Rukun Yamani dan Hajar Aswad pada setiap putaran?',
      pilihan: ['Talbiyah', 'Istighfar', 'Rabbana Atina', "Doa melihat Ka'bah"],
      jawabanBenarIndex: 2,
      penjelasanSingkat:
        '"Rabbana atina fid-dunya hasanah..." dibaca di antara Rukun Yamani dan Hajar Aswad pada setiap putaran (Kumpulan Doa — Doa Tawaf: Doa Antara Rukun Yamani & Hajar Aswad).',
    },
    {
      id: 'tw-k4',
      pertanyaan: 'Apa yang dilakukan langsung setelah selesai 7 putaran tawaf?',
      pilihan: [
        "Langsung lanjut Sa'i",
        'Shalat sunnah di Maqam Ibrahim & minum zamzam',
        'Kembali ke hotel',
        'Tahallul',
      ],
      jawabanBenarIndex: 1,
      penjelasanSingkat:
        "Setelah tawaf selesai, jamaah shalat sunnah 2 rakaat di belakang Maqam Ibrahim bila memungkinkan, lalu minum air zamzam (Tata Cara Umrah, langkah 4).",
    },
    {
      id: 'tw-k5',
      pertanyaan: 'Area Hajar Aswad sangat padat. Apa pilihan yang tepat?',
      pilihan: ['Mendorong sampai bisa menyentuh', 'Menunggu dengan menghalangi arus', 'Memberi isyarat dari jarak aman', 'Membatalkan tawaf'],
      jawabanBenarIndex: 2,
      penjelasanSingkat: 'Bila tidak memungkinkan mendekat, cukup memberi isyarat. Menjaga keselamatan dan tidak menyakiti jamaah lain harus diutamakan.',
    },
    {
      id: 'tw-k6',
      pertanyaan: 'Bolehkah memotong jalur tawaf melalui bagian dalam Hijir Ismail?',
      pilihan: ['Boleh saat padat', 'Boleh pada putaran terakhir', 'Tidak boleh', 'Hanya boleh bagi lansia'],
      jawabanBenarIndex: 2,
      penjelasanSingkat: 'Hijir Ismail termasuk bagian Ka\'bah. Tawaf harus melewati sisi luar pagar agar benar-benar mengelilingi seluruh Ka\'bah.',
    },
  ],
};

// -----------------------------------------------------------------------
// Modul 3 — Sa'i
// Sumber: tatacara.ts step 5, doa.ts sai-putaran-1..7 (field waktu & cara)
// -----------------------------------------------------------------------
const modulSai: ManasikModul = {
  id: 'sai',
  judul: "Sa'i",
  subjudul: 'Berjalan antara Shafa & Marwah',
  urutan: 3,
  warna: 'gold',
  kartuKenali: [
    {
      id: 'sai-1',
      judul: "Apa itu Sa'i?",
      penjelasan:
        "Sa'i adalah berjalan antara Shafa dan Marwah sebanyak tujuh lintasan untuk mengenang ikhtiar Siti Hajar mencari air bagi Nabi Ismail. Sa'i dimulai setelah tawaf selesai.",
      poin: [
        'Masuk ke jalur Sa’i dengan mengikuti petunjuk arah dan arus jamaah.',
        'Kursi roda atau skuter elektrik dapat digunakan pada jalur yang telah ditentukan.',
      ],
      ilustrasiTipe: 'shafa',
    },
    {
      id: 'sai-2',
      judul: 'Dimulai dari Bukit Shafa',
      penjelasan:
        "Mulai di Shafa dengan menghadap arah Ka'bah bila dapat melihat atau memperkirakan arahnya. Bertakbir, berdzikir, dan berdoa, kemudian berjalan menuju Marwah sebagai lintasan pertama.",
      peringatan: 'Jangan memulai hitungan dari Marwah. Shafa ke Marwah adalah lintasan pertama.',
      ilustrasiTipe: 'shafa',
    },
    {
      id: 'sai-3',
      judul: '7 Lintasan, Bukan 7 Putaran',
      penjelasan:
        "Shafa ke Marwah dihitung satu lintasan. Kembali dari Marwah ke Shafa menjadi lintasan kedua. Lintasan ketujuh berakhir di Marwah, bukan kembali lagi ke Shafa.",
      poin: [
        'Nomor ganjil berakhir di Marwah dan nomor genap berakhir di Shafa.',
        'Gunakan counter Sa’i Umrahme bila mudah lupa, tetapi tetap perhatikan arus berjalan.',
      ],
      ilustrasiTipe: 'sai-7',
    },
    {
      id: 'sai-4',
      judul: 'Lampu Hijau & Doa',
      penjelasan:
        "Laki-laki disunnahkan berlari kecil di antara dua tanda lampu hijau jika mampu dan kondisi aman. Perempuan tetap berjalan biasa. Di sepanjang Sa'i, jamaah bebas berdzikir dan berdoa dengan bacaan yang dipahami.",
      poin: [
        'Doa per lintasan di Umrahme adalah panduan, bukan syarat sah Sa’i.',
        'Tidak perlu memaksakan lari kecil jika lanjut usia, sakit, memakai kursi roda, atau jalur sangat padat.',
      ],
      peringatan: 'Jangan berhenti berkelompok di ujung Shafa atau Marwah karena dapat menghambat arus jamaah.',
      ilustrasiTipe: 'marwah',
    },
  ],
  urutanItems: [
    { id: 'sai-u1', teks: 'Naik ke bukit Shafa, menghadap Ka\'bah', urutanBenar: 1 },
    { id: 'sai-u2', teks: 'Membaca takbir (Allahu Akbar) dan berdoa', urutanBenar: 2 },
    { id: 'sai-u3', teks: 'Berjalan menuju bukit Marwah — itu lintasan ke-1', urutanBenar: 3 },
    { id: 'sai-u4', teks: 'Dari Marwah, kembali ke Shafa — itu lintasan ke-2', urutanBenar: 4 },
    { id: 'sai-u5', teks: 'Ulangi hingga lintasan ke-7 — selesai di Marwah', urutanBenar: 5 },
  ],
  skenario: [
    {
      id: 'sai-s1',
      judul: 'Tiba Pertama Kali di Marwah',
      situasi: 'Anda berangkat dari Shafa dan sekarang baru tiba di Marwah untuk pertama kali.',
      pertanyaan: 'Berapa hitungan lintasan saat ini?',
      pilihan: [
        { teks: 'Satu lintasan', benar: true, penjelasan: 'Shafa ke Marwah dihitung satu lintasan penuh.' },
        { teks: 'Setengah lintasan', benar: false, penjelasan: 'Pergi dari satu bukit ke bukit lainnya sudah dihitung satu lintasan, bukan setengah.' },
        { teks: 'Dua lintasan', benar: false, penjelasan: 'Lintasan kedua baru selesai setelah kembali dari Marwah ke Shafa.' },
      ],
    },
    {
      id: 'sai-s2',
      judul: 'Lampu Hijau & Kondisi Fisik',
      situasi: 'Seorang jamaah laki-laki lanjut usia tiba di area lampu hijau dan mulai merasa sesak.',
      pertanyaan: 'Apa tindakan yang tepat?',
      pilihan: [
        { teks: 'Tetap berjalan biasa sesuai kemampuan', benar: true, penjelasan: 'Lari kecil adalah sunnah bagi laki-laki yang mampu. Keselamatan dan kondisi kesehatan lebih utama.' },
        { teks: 'Memaksakan lari agar Sa’i tetap sah', benar: false, penjelasan: 'Sa’i tetap sah tanpa berlari kecil. Tidak perlu memaksakan amalan sunnah.' },
        { teks: 'Menghentikan seluruh Sa’i dan langsung tahallul', benar: false, penjelasan: 'Ia dapat beristirahat atau meminta bantuan, kemudian melanjutkan lintasan sesuai kemampuan.' },
      ],
    },
    {
      id: 'sai-s3',
      judul: 'Lupa Doa Lintasan',
      situasi: 'Di lintasan keempat Anda lupa bacaan doa yang tersedia di buku panduan.',
      pertanyaan: 'Apa yang dilakukan?',
      pilihan: [
        { teks: 'Tetap berjalan sambil berdzikir atau berdoa dengan bacaan yang dipahami', benar: true, penjelasan: 'Doa berbeda pada setiap lintasan bukan syarat sah Sa’i.' },
        { teks: 'Kembali ke Shafa dan mengulang dari awal', benar: false, penjelasan: 'Lupa bacaan tidak membatalkan lintasan dan tidak mengharuskan mengulang.' },
        { teks: 'Berhenti di tengah jalur sampai berhasil menghafal', benar: false, penjelasan: 'Berhenti di jalur dapat menghambat jamaah lain. Teruskan dengan dzikir atau doa yang dikuasai.' },
      ],
    },
  ],
  kuisSoal: [
    {
      id: 'sai-k1',
      pertanyaan: "Sa'i dimulai dari bukit apa?",
      pilihan: ['Marwah', 'Shafa', 'Maqam Ibrahim', 'Arafah'],
      jawabanBenarIndex: 1,
      penjelasanSingkat:
        "Sa'i selalu dimulai dari bukit Shafa dan diakhiri di Marwah (Tata Cara Umrah, langkah 5; Doa Sa'i Lintasan 1 — Shafa ke Marwah).",
    },
    {
      id: 'sai-k2',
      pertanyaan: "Berapa lintasan total dalam Sa'i?",
      pilihan: ['5 lintasan', '9 lintasan', '7 lintasan', '14 lintasan'],
      jawabanBenarIndex: 2,
      penjelasanSingkat:
        "Sa'i dilakukan 7 lintasan (bukan 7 putaran). Dimulai Shafa, selesai di Marwah (Tata Cara Umrah, langkah 5).",
    },
    {
      id: 'sai-k3',
      pertanyaan: "Sa'i berakhir di bukit apa?",
      pilihan: ['Shafa', 'Marwah', 'Di tengah jalan', 'Hajar Aswad'],
      jawabanBenarIndex: 1,
      penjelasanSingkat:
        "Lintasan ke-7 (angka ganjil, Shafa→Marwah) selesai di Marwah — bukan kembali ke Shafa (Tata Cara Umrah, langkah 5: 'diakhiri di Marwah').",
    },
    {
      id: 'sai-k4',
      pertanyaan: "Doa apa yang pertama dibaca di awal setiap lintasan Sa'i?",
      pilihan: ['Talbiyah', 'Takbir — Allahu Akbar', 'Rabbana Atina', 'Doa masuk masjid'],
      jawabanBenarIndex: 1,
      penjelasanSingkat:
        "Setiap lintasan sa'i dibuka dengan takbir: 'Allaahu Akbar, Allaahu Akbar, Allaahu Akbar...' (Kumpulan Doa — Sa'i Lintasan 1 s.d. 7).",
    },
    {
      id: 'sai-k5',
      pertanyaan: "Siapa yang disunnahkan berlari kecil di antara dua lampu hijau saat Sa'i?",
      pilihan: ['Semua jamaah', 'Laki-laki yang mampu', 'Perempuan saja', 'Hanya pembimbing'],
      jawabanBenarIndex: 1,
      penjelasanSingkat: 'Laki-laki yang mampu disunnahkan berlari kecil di area lampu hijau. Perempuan berjalan biasa, dan keselamatan tetap diutamakan.',
    },
    {
      id: 'sai-k6',
      pertanyaan: "Apakah doa yang berbeda pada setiap lintasan menjadi syarat sah Sa'i?",
      pilihan: ['Ya, wajib hafal semuanya', 'Tidak, jamaah boleh berdzikir dan berdoa', 'Hanya wajib lintasan pertama', 'Wajib jika memakai counter'],
      jawabanBenarIndex: 1,
      penjelasanSingkat: 'Tidak ada kewajiban menghafal doa berbeda untuk setiap lintasan. Bacaan di aplikasi membantu latihan dan kekhusyukan.',
    },
  ],
};

// -----------------------------------------------------------------------
// Modul 4 — Tahallul & Penutup
// Sumber: tatacara.ts step 6, ihram.ts larangan, doa.ts (kategori tahallul)
// -----------------------------------------------------------------------
const modulTahallul: ManasikModul = {
  id: 'tahallul',
  judul: 'Tahallul & Penutup',
  subjudul: 'Tanda selesainya ihram',
  urutan: 4,
  warna: 'mute',
  kartuKenali: [
    {
      id: 'th-1',
      judul: 'Apa itu Tahallul?',
      penjelasan:
        "Tahallul adalah mencukur atau memendekkan rambut setelah lintasan ketujuh Sa'i selesai di Marwah. Inilah tindakan terakhir yang mengakhiri keadaan ihram.",
      peringatan: 'Jangan berganti ke pakaian biasa, memakai wewangian, atau melakukan larangan ihram sebelum rambut selesai dicukur atau dipotong.',
      ilustrasiTipe: 'tahallul',
    },
    {
      id: 'th-2',
      judul: 'Perbedaan Pria & Wanita',
      penjelasan:
        'Pria mencukur habis rambut kepala atau memendekkannya secara merata dari seluruh bagian kepala. Wanita mengumpulkan ujung rambut lalu memotong kira-kira sepanjang satu ruas ujung jari.',
      poin: [
        'Mencukur habis lebih utama bagi pria; memendekkan tetap diperbolehkan.',
        'Wanita tidak mencukur habis kepala dan sebaiknya memotong rambut di tempat yang menjaga privasi.',
      ],
      ilustrasiTipe: 'tahallul',
    },
    {
      id: 'th-3',
      judul: 'Semua Larangan Terangkat',
      penjelasan:
        'Setelah rambut selesai dicukur atau dipotong, larangan ihram terangkat dan rangkaian umrah selesai. Jamaah dapat berganti pakaian, mandi, dan memakai wewangian kembali.',
      poin: [
        'Gunakan tempat cukur resmi di sekitar sisi Marwah, pusat perbelanjaan, atau hotel.',
        'Pastikan alat cukur bersih dan tidak berbagi pisau untuk menghindari penularan penyakit.',
        'Jika ragu apakah potongan sudah mencukupi, tanyakan pembimbing sebelum meninggalkan area.',
      ],
      ilustrasiTipe: 'selesai',
    },
  ],
  urutanItems: [
    { id: 'th-u1', teks: "Selesaikan lintasan ke-7 Sa'i di bukit Marwah", urutanBenar: 1 },
    { id: 'th-u2', teks: 'Menuju tempat cukur/potong rambut', urutanBenar: 2 },
    { id: 'th-u3', teks: 'Mencukur merata (pria) atau memotong ujung rambut (wanita)', urutanBenar: 3 },
    { id: 'th-u4', teks: 'Pastikan proses potong rambut telah selesai', urutanBenar: 4 },
    { id: 'th-u5', teks: 'Larangan ihram terangkat — umrah selesai', urutanBenar: 5 },
  ],
  skenario: [
    {
      id: 'th-s1',
      judul: 'Ingin Segera Berganti Pakaian',
      situasi: "Setelah menyelesaikan lintasan ketujuh Sa'i, Anda ingin langsung mengganti kain ihram sebelum mencari tempat cukur.",
      pertanyaan: 'Apa yang seharusnya dilakukan?',
      pilihan: [
        { teks: 'Tetap dalam larangan ihram sampai tahallul selesai', benar: true, penjelasan: 'Keadaan ihram baru berakhir setelah rambut dicukur atau dipotong sesuai ketentuan.' },
        { teks: 'Berganti pakaian karena Sa’i sudah selesai', benar: false, penjelasan: 'Selesainya Sa’i belum otomatis mengakhiri ihram. Tahallul masih harus dilakukan.' },
        { teks: 'Memakai parfum dulu lalu mencari tempat cukur', benar: false, penjelasan: 'Wewangian masih termasuk larangan sampai tahallul selesai.' },
      ],
    },
    {
      id: 'th-s2',
      judul: 'Tahallul Jamaah Perempuan',
      situasi: 'Seorang jamaah perempuan sudah selesai Sa’i dan berada bersama pendamping perempuan di tempat yang menjaga privasi.',
      pertanyaan: 'Bagaimana ia melakukan tahallul?',
      pilihan: [
        { teks: 'Mengumpulkan ujung rambut dan memotong kira-kira satu ruas ujung jari', benar: true, penjelasan: 'Perempuan memendekkan ujung rambut dan tidak mencukur habis kepala.' },
        { teks: 'Mencukur seluruh kepala seperti jamaah pria', benar: false, penjelasan: 'Mencukur habis kepala bukan cara tahallul bagi perempuan.' },
        { teks: 'Cukup menyisir rambut tanpa memotongnya', benar: false, penjelasan: 'Tahallul dilakukan dengan benar-benar memotong ujung rambut.' },
      ],
    },
    {
      id: 'th-s3',
      judul: 'Memilih Tempat Cukur',
      situasi: 'Ada orang tidak dikenal menawarkan cukur murah dengan pisau yang tampak sudah dipakai.',
      pertanyaan: 'Apa pilihan yang aman?',
      pilihan: [
        { teks: 'Gunakan tempat resmi dengan alat baru atau disterilkan', benar: true, penjelasan: 'Kebersihan alat mencegah luka dan penularan penyakit.' },
        { teks: 'Terima saja agar tahallul lebih cepat', benar: false, penjelasan: 'Kecepatan tidak boleh mengorbankan kebersihan dan keselamatan.' },
        { teks: 'Berbagi pisau dengan anggota rombongan', benar: false, penjelasan: 'Pisau cukur tidak boleh dipakai bergantian karena risiko penularan melalui darah.' },
      ],
    },
  ],
  kuisSoal: [
    {
      id: 'th-k1',
      pertanyaan: 'Apa yang dilakukan jamaah saat tahallul?',
      pilihan: ['Potong kuku', 'Memotong atau mencukur rambut', 'Mandi wajib', 'Berpuasa'],
      jawabanBenarIndex: 1,
      penjelasanSingkat:
        "Tahallul adalah mencukur (gundul, lebih utama bagi pria) atau memotong rambut. Ini adalah tanda sah-nya keluar dari ihram (Tata Cara Umrah, langkah 6).",
    },
    {
      id: 'th-k2',
      pertanyaan: 'Berapa banyak rambut yang minimal dipotong oleh jamaah wanita saat tahallul?',
      pilihan: ['Gundul seperti pria', 'Setengah panjang rambut', 'Seujung jari', 'Tidak perlu potong rambut'],
      jawabanBenarIndex: 2,
      penjelasanSingkat:
        "Wanita mengumpulkan ujung rambut lalu memotongnya kira-kira sepanjang satu ruas ujung jari (Tata Cara Umrah, langkah 6).",
    },
    {
      id: 'th-k3',
      pertanyaan: 'Apa yang terjadi setelah tahallul?',
      pilihan: [
        'Larangan ihram terangkat sepenuhnya',
        'Harus shalat sunnah 4 rakaat',
        'Harus berwudhu ulang',
        'Perlu pergi ke Masjid Nabawi',
      ],
      jawabanBenarIndex: 0,
      penjelasanSingkat:
        "Tahallul menandai berakhirnya ihram. Semua larangan (wewangian, pakaian berjahit, dll.) terangkat setelah tahallul (Tata Cara Umrah, langkah 6; Panduan Ihram).",
    },
    {
      id: 'th-k4',
      pertanyaan: 'Urutan rangkaian umrah yang benar adalah...',
      pilihan: [
        "Ihram → Sa'i → Tawaf → Tahallul",
        "Ihram → Tawaf → Sa'i → Tahallul",
        "Tawaf → Ihram → Sa'i → Tahallul",
        "Tawaf → Sa'i → Ihram → Tahallul",
      ],
      jawabanBenarIndex: 1,
      penjelasanSingkat:
        "Urutan baku umrah: (1) Ihram di Miqat → (2) Tawaf 7 putaran → (3) Sa'i 7 lintasan → (4) Tahallul. Ini tidak boleh ditukar (Tata Cara Umrah, 6 langkah).",
    },
    {
      id: 'th-k5',
      pertanyaan: "Kapan jamaah boleh berganti pakaian ihram setelah Sa'i?",
      pilihan: ['Begitu keluar dari jalur Sa’i', 'Setelah tahallul selesai', 'Setelah minum zamzam', 'Saat kembali ke hotel'],
      jawabanBenarIndex: 1,
      penjelasanSingkat: 'Larangan ihram baru berakhir setelah tahallul selesai, yaitu setelah rambut dicukur atau dipotong sesuai ketentuan.',
    },
  ],
};

export const manasikModulList: ManasikModul[] = [
  modulIhram,
  modulTawaf,
  modulSai,
  modulTahallul,
];

export function getModulById(id: string): ManasikModul | undefined {
  return manasikModulList.find((m) => m.id === id);
}

// -----------------------------------------------------------------------
// Progress localStorage helper
// Key: umrahme.manasik.{modulId}
// -----------------------------------------------------------------------
export interface ModulProgress {
  partADone: boolean;
  partBDone: boolean;
  partBBenar: boolean;
  partSimulasiDone: boolean;
  partSimulasiScore: number;
  partSimulasiTotal: number;
  partCScore: number;
  partCTotal: number;
  selesai: boolean;
}

const defaultProgress = (): ModulProgress => ({
  partADone: false,
  partBDone: false,
  partBBenar: false,
  partSimulasiDone: false,
  partSimulasiScore: 0,
  partSimulasiTotal: 0,
  partCScore: 0,
  partCTotal: 0,
  selesai: false,
});

export function getModulProgress(modulId: string): ModulProgress {
  try {
    const raw = localStorage.getItem(`umrahme.manasik.${modulId}`);
    return raw ? { ...defaultProgress(), ...(JSON.parse(raw) as Partial<ModulProgress>) } : defaultProgress();
  } catch {
    return defaultProgress();
  }
}

export function saveModulProgress(modulId: string, progress: Partial<ModulProgress>): void {
  try {
    const current = getModulProgress(modulId);
    localStorage.setItem(`umrahme.manasik.${modulId}`, JSON.stringify({ ...current, ...progress }));
  } catch {
    // localStorage not available
  }
}

export function resetModulProgress(modulId: string): void {
  try {
    localStorage.removeItem(`umrahme.manasik.${modulId}`);
  } catch {
    // localStorage not available
  }
}

// ── Sinkronisasi Manasik ke Supabase ─────────────────────────
// Import lazy (di dalam fungsi) agar tidak menyebabkan circular-dep saat tree shaking

export async function syncManasikFromCloud(tenantId: string, nomor: string): Promise<void> {
  const { getJamaahData } = await import('../lib/supabase');
  const cloud = await getJamaahData<Record<string, ModulProgress>>(tenantId, nomor, 'manasik');
  if (!cloud) return;
  Object.entries(cloud).forEach(([modulId, prog]) => {
    try {
      localStorage.setItem(`umrahme.manasik.${modulId}`, JSON.stringify(prog));
    } catch { /* noop */ }
  });
}

export async function pushManasikToCloud(tenantId: string, nomor: string): Promise<void> {
  const { setJamaahData } = await import('../lib/supabase');
  const all: Record<string, ModulProgress> = {};
  for (const m of manasikModulList) {
    all[m.id] = getModulProgress(m.id);
  }
  await setJamaahData(tenantId, nomor, 'manasik', all);
}
