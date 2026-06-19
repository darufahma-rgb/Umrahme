import type { ChecklistItem, KategoriChecklist, KategoriChecklistMeta } from '../types';

// =============================================================
// DATA CHECKLIST PERSIAPAN
// Timeline H-30 → H-1, dikelompokkan dalam 4 kategori.
// State centang disimpan di local state React (lihat hooks/useChecklist).
// =============================================================

export const kategoriChecklist: KategoriChecklistMeta[] = [
  { id: 'dokumen', judul: 'Dokumen Perjalanan', deskripsi: 'Paspor, visa, dan berkas wajib' },
  { id: 'kesehatan', judul: 'Kesehatan', deskripsi: 'Vaksin & kesiapan fisik' },
  { id: 'barang', judul: 'Barang Bawaan', deskripsi: 'Ihram, obat, kabin & koper' },
  { id: 'mental', judul: 'Mental & Ibadah', deskripsi: 'Niat, ilmu manasik, doa safar' },
];

export const checklistItems: ChecklistItem[] = [
  // ----------------- DOKUMEN
  { id: 'dok-paspor', kategori: 'dokumen', judul: 'Paspor berlaku ≥ 7 bulan', catatan: 'Cek tanggal kedaluwarsa & halaman kosong', tenggat: 'H-30' },
  { id: 'dok-visa', kategori: 'dokumen', judul: 'Visa umrah terbit', catatan: 'Dari travel — pastikan nama sesuai paspor', tenggat: 'H-14' },
  { id: 'dok-tiket', kategori: 'dokumen', judul: 'Tiket pesawat & jadwal', catatan: 'Simpan salinan digital & cetak', tenggat: 'H-7' },
  { id: 'dok-foto', kategori: 'dokumen', judul: 'Pas foto latar putih', catatan: 'Beberapa lembar untuk cadangan', tenggat: 'H-30' },
  { id: 'dok-salinan', kategori: 'dokumen', judul: 'Salinan dokumen penting', catatan: 'Foto paspor & visa di ponsel + cetak', tenggat: 'H-3' },

  // ----------------- KESEHATAN
  { id: 'sehat-meningitis', kategori: 'kesehatan', judul: 'Vaksin meningitis (ICV)', catatan: 'Wajib — kartu kuning dibawa', tenggat: 'H-21' },
  { id: 'sehat-checkup', kategori: 'kesehatan', judul: 'Pemeriksaan kesehatan umum', catatan: 'Terutama jamaah lansia / berisiko', tenggat: 'H-21' },
  { id: 'sehat-obat', kategori: 'kesehatan', judul: 'Obat pribadi & resep', catatan: 'Bawa stok cukup + resep dokter', tenggat: 'H-7' },
  { id: 'sehat-fisik', kategori: 'kesehatan', judul: 'Latihan jalan kaki', catatan: 'Tawaf & sa’i butuh stamina', tenggat: 'H-30' },

  // ----------------- BARANG
  { id: 'brg-ihram', kategori: 'barang', judul: 'Kain ihram (laki-laki) / busana ihram (perempuan)', catatan: 'Siapkan cadangan', tenggat: 'H-7' },
  { id: 'brg-kabin', kategori: 'barang', judul: 'Tas kabin: dokumen, obat, charger', catatan: 'Barang penting jangan di koper bagasi', tenggat: 'H-2' },
  { id: 'brg-koper', kategori: 'barang', judul: 'Koper bagasi: pakaian & perlengkapan', catatan: 'Timbang agar tak lebih bagasi', tenggat: 'H-2' },
  { id: 'brg-perlengkapan', kategori: 'barang', judul: 'Sandal, sajadah tipis, botol minum', catatan: 'Tas kecil untuk sandal di masjid', tenggat: 'H-3' },
  { id: 'brg-uang', kategori: 'barang', judul: 'Uang Riyal & kartu', catatan: 'Tukar sebagian sebelum berangkat', tenggat: 'H-3' },

  // ----------------- MENTAL
  { id: 'mtl-niat', kategori: 'mental', judul: 'Luruskan niat ikhlas karena Allah', catatan: 'Ibadah, bukan wisata', tenggat: 'H-30' },
  { id: 'mtl-manasik', kategori: 'mental', judul: 'Ikuti bimbingan manasik', catatan: 'Pahami urutan: ihram → tawaf → sa’i → tahallul', tenggat: 'H-14' },
  { id: 'mtl-halalbihalal', kategori: 'mental', judul: 'Mohon maaf & pamit keluarga', catatan: 'Bereskan urusan & hutang', tenggat: 'H-3' },
  { id: 'mtl-doa-safar', kategori: 'mental', judul: 'Hafalkan doa safar & talbiyah', catatan: 'Tersedia di menu Doa', tenggat: 'H-7' },
];

export function itemsByKategori(kategori: KategoriChecklist): ChecklistItem[] {
  return checklistItems.filter((i) => i.kategori === kategori);
}
