// =============================================================
// Tipe data inti Umrahme.
// Semua konten app memakai tipe ini. Saat backend siap, cukup
// ganti sumber data di src/data/* dengan hasil fetch API yang
// mengembalikan bentuk yang sama — komponen UI tidak perlu diubah.
// =============================================================

/** Fase perjalanan jamaah. Logic transisi masih dummy untuk MVP. */
export type Fase = 'persiapan' | 'tanah-suci' | 'selesai';

/** Data jamaah yang disimpan setelah login via kode aktivasi. */
export interface Jamaah {
  nama: string;
  nomorJamaah: string; // contoh: "UMR-2026-0142"
  travel: string; // nama travel (white-label)
  kodeAktivasi: string;
  fase: Fase;
}

/** Kategori doa pada Kumpulan Doa. */
export type KategoriDoa =
  | 'persiapan'
  | 'ihram'
  | 'tawaf'
  | 'sai'
  | 'tahallul'
  | 'ziarah'
  | 'harian';

export interface Doa {
  id: string;
  kategori: KategoriDoa;
  judul: string;
  /** Teks Arab lengkap dengan harakat. */
  arab: string;
  /** Transliterasi Latin. */
  latin: string;
  /** Terjemahan bahasa Indonesia. */
  terjemahan: string;
  /** Penjelasan singkat makna doa. */
  arti?: string;
  /** Sumber hadits/ayat yang melandasi. */
  dalil?: string;
  /** Kapan & bagaimana doa ini dibaca dalam praktiknya. */
  cara?: string;
  /** Kapan tepatnya dalam rangkaian ibadah. */
  waktu?: string;
  /**
   * true bila konten masih perlu diverifikasi ulama sebelum production.
   * Field konten yang belum pasti dikosongkan, BUKAN dikarang.
   */
  perluVerifikasi?: boolean;
}

export type TipeLokasi = 'masjid' | 'sejarah';

export interface Lokasi {
  id: string;
  tipe: TipeLokasi;
  nama: string;
  kota: string;
  /** Jarak dummy dari hotel (km). Ganti dengan data nyata via API. */
  jarakKm: number;
  /** Jam buka / adab kunjungan. */
  jamKunjungan: string;
  ringkas: string;
  sejarah: string;
  // TODO(maps): tambahkan { lat: number; lng: number } untuk integrasi Google Maps.
}

export type KategoriChecklist = 'dokumen' | 'kesehatan' | 'barang' | 'mental';

export interface ChecklistItem {
  id: string;
  kategori: KategoriChecklist;
  judul: string;
  catatan?: string;
  /** Window waktu indikatif, mis. "H-30" — ditampilkan sebagai metadata. */
  tenggat?: string;
}

export interface KategoriChecklistMeta {
  id: KategoriChecklist;
  judul: string;
  deskripsi: string;
}

/** Satu langkah pada Panduan Tata Cara Umrah. */
export interface TataCaraStep {
  nomor: number;
  judul: string;
  deskripsi: string;
  /** Route internal terkait, mis. "/ibadah/tawaf". */
  tautan?: string;
  tautanLabel?: string;
}

export type GenderLarangan = 'lakilaki' | 'perempuan' | 'umum';

export interface LaranganIhram {
  id: string;
  gender: GenderLarangan;
  judul: string;
  keterangan: string;
}

export interface IhramSection {
  id: string;
  judul: string;
  langkah: string[];
}
