# Rancangan Pembaharuan dan Pemeliharaan Umrahme

Dokumen ini adalah arah kerja produk dan teknis Umrahme untuk 6 bulan ke depan. Tujuannya sederhana: jamaah cepat menemukan informasi yang mereka butuhkan saat perjalanan, sementara travel dapat mengelola data dengan aman tanpa risiko informasi antar-batch tertukar.

## 1. Sasaran Produk

| Sasaran | Ukuran keberhasilan |
| --- | --- |
| Jamaah mandiri saat perjalanan | Mayoritas kebutuhan utama dapat dibuka dari Beranda dalam maksimal dua ketukan |
| Informasi akurat per keberangkatan | Hotel, agenda, pembimbing, dan pengumuman selalu terikat pada `keberangkatan_id` |
| Operasional travel lebih cepat | Admin dapat menyiapkan satu batch dari template tanpa input ulang yang panjang |
| Layanan darurat jelas | Jamaah dapat menghubungi pembimbing, membuka titik kumpul, dan menampilkan kartu identitas dalam satu layar |
| Sistem stabil | Error penting terdeteksi cepat, data dibackup, dan perubahan aplikasi bisa ditelusuri |

## 2. Prinsip Rancangan

1. `Keberangkatan` adalah sumber data utama operasional. Data pada tenant hanya menjadi fallback untuk data lama.
2. Setiap layar jamaah harus memprioritaskan kondisi perjalanan saat ini: persiapan, di Tanah Suci, atau selesai.
3. Informasi penting harus tetap bisa dibuka pada koneksi lemah. Halaman inti, kartu jamaah, agenda terakhir, hotel, dan kontak darurat disimpan untuk akses offline.
4. Admin tidak boleh perlu memahami struktur database untuk memperbaiki data harian.
5. Data pribadi jamaah diperlakukan sebagai data sensitif: akses dibatasi per tenant dan semua perubahan operasional punya jejak audit.

## 3. Ruang Lingkup Pembaharuan Produk

### A. Beranda Jamaah: pusat aksi perjalanan

Beranda menjadi layar operasional, bukan sekadar ringkasan.

- Akses utama berubah berdasarkan fase perjalanan.
  - Persiapan: checklist, jadwal, tata cara, tanya travel.
  - Tanah Suci: kartu jamaah, agenda hari ini, counter tawaf/sai, bantuan cepat.
  - Selesai: jurnal, sertifikat, doa, dokumentasi perjalanan.
- Tampilkan blok tetap untuk hotel Makkah, hotel Madinah, titik kumpul, dan kontak pembimbing.
- Tambahkan status tugas persiapan agar jamaah tahu apa yang belum selesai.
- Tambahkan notifikasi perubahan agenda dan pengumuman prioritas di atas daftar konten biasa.

Status: panel "Akses Utama" sudah mulai diterapkan pada Beranda dan menjadi pola untuk fitur berikutnya.

### B. Mode Darurat dan Bantuan Cepat

Satu layar khusus yang dapat dibuka dari Beranda dan Kartu Jamaah.

- Tombol WhatsApp dan telepon pembimbing utama serta pendamping.
- Lokasi titik kumpul dan hotel dengan tautan navigasi.
- Identitas jamaah: nama, nomor paspor yang disamarkan, nomor kamar, grup/bus, dan kontak keluarga.
- Tombol "Saya butuh bantuan" untuk mengirim lokasi, nama jamaah, dan jenis kendala ke petugas.
- Catatan darurat: alergi, kebutuhan medis, dan kontak keluarga hanya tampil untuk jamaah dan petugas berwenang.

### C. Agenda, Rombongan, dan Kehadiran

- Agenda harian menampilkan jam, lokasi, dress code/perlengkapan, penanggung jawab, dan tindakan cepat untuk navigasi.
- Admin membuat agenda dari template perjalanan, lalu menyesuaikan per batch.
- Check-in kehadiran rombongan lewat daftar sederhana atau QR. Petugas melihat jamaah yang belum hadir.
- Perubahan agenda memiliki status: dibuat, diperbarui, dibatalkan, dan dibaca jamaah.

### D. Portal Travel yang Lebih Operasional

- Wizard pembuatan batch: identitas program, tanggal, hotel, penerbangan, pembimbing, titik kumpul, dan agenda awal.
- Duplikasi batch dari program sebelumnya untuk menghemat input.
- Impor jamaah dari Excel dengan preview, validasi kolom, penanda data ganda, dan laporan baris gagal.
- Detail jamaah menampilkan riwayat perubahan, batch aktif, status dokumen, kamar, bus, dan kontak.
- Dashboard ringkas: jumlah jamaah, kelengkapan data, agenda hari ini, pengumuman belum dibaca, dan permintaan bantuan terbuka.

### E. Dokumen dan Komunikasi

- Pusat dokumen per batch: itinerary, manasik, daftar barang, boarding pass, dan dokumen yang diizinkan travel.
- Pengumuman mendukung prioritas, jadwal tayang, target batch, dan status dibaca.
- Template WhatsApp untuk pengingat pembayaran, manasik, keberangkatan, perubahan agenda, dan kepulangan.
- Semua tautan dan dokumen diatur dari portal travel, bukan dari kode aplikasi.

## 4. Rancangan Data dan Akses

```text
tenant
  └─ keberangkatan (sumber operasional per program/tanggal)
       ├─ jamaah_accounts
       ├─ agenda_items
       ├─ announcements
       ├─ documents
       ├─ room_assignments
       ├─ attendance_records
       └─ help_requests
```

Aturan data yang wajib dijaga:

- Kolom operasional seperti `hotel_makkah`, `hotel_madinah`, pembimbing, tanggal, dan titik kumpul disimpan di `keberangkatan`.
- Override pada `jamaah_accounts` hanya untuk pengecualian individual dan harus terlihat jelas di portal admin.
- Semua query jamaah, agenda, pengumuman, dokumen, dan bantuan wajib memfilter `tenant_id` dan `keberangkatan_id`.
- Terapkan Row Level Security Supabase untuk memastikan akun travel hanya dapat membaca dan mengubah tenant miliknya.
- Tambahkan tabel `audit_logs` untuk perubahan data sensitif: siapa, kapan, entitas, nilai lama, dan nilai baru.
- Gunakan constraint dan indeks untuk mencegah duplikasi serta mempercepat akses:
  - indeks gabungan `(tenant_id, keberangkatan_id)` pada tabel operasional;
  - unique key pada kode aktivasi jamaah;
  - validasi tanggal pulang tidak boleh lebih awal dari tanggal berangkat.

## 5. Sprint Implementasi 1 Hari

Target sprint ini adalah rilis perbaikan yang benar-benar berguna untuk batch aktif, bukan menyelesaikan seluruh visi 6 bulan dalam satu hari. Fokusnya: data batch akurat, jamaah cepat mengakses kebutuhan penting, dan admin bisa memeriksa data tanpa SQL.

| Slot | Hasil yang dikerjakan | Keluaran |
| --- | --- | --- |
| 09.00-10.30 | Audit dan perbaikan data batch | Validasi `keberangkatan_id`, hotel, pembimbing, serta skrip pengecekan data salah/kurang |
| 10.30-12.00 | Kontrol data untuk admin | Tampilan ringkas batch aktif dan penanda jamaah yang belum memiliki data operasional lengkap |
| 13.00-14.30 | Akses cepat jamaah | Beranda berbasis fase, kartu jamaah, agenda, hotel, titik kumpul, dan kontak pembimbing |
| 14.30-16.00 | Bantuan cepat | Tombol WhatsApp/telepon pembimbing, navigasi ke hotel/titik kumpul, dan informasi identitas penting |
| 16.00-17.00 | Keandalan dan rilis | Verifikasi mobile, typecheck, build, backup sebelum perubahan, dan catatan rilis |

### Definisi Selesai Sprint

- Nabila, Reni, Darmiati, dan jamaah lain selalu membaca hotel dari batch yang benar.
- Beranda menampilkan akses yang relevan dengan fase perjalanan.
- Jamaah bisa membuka kartu, hotel, lokasi titik kumpul, agenda, dan pembimbing tanpa mencari-cari menu.
- Admin memiliki indikator bila data batch atau data jamaah belum lengkap.
- Perubahan database terdokumentasi dalam migration SQL dan aplikasi lolos typecheck/build.

### Backlog Setelah Sprint

QR absensi, notifikasi terjadwal, pusat dokumen, template WhatsApp, audit log lengkap, dan analitik penggunaan tetap penting, tetapi dikerjakan setelah rilis satu hari ini stabil.

## 6. Standar Pemeliharaan Sistem

### Harian

- Pantau error aplikasi, permintaan bantuan terbuka, dan kegagalan login.
- Cek pengumuman atau perubahan agenda yang belum tersampaikan.
- Verifikasi batch yang aktif memiliki hotel, pembimbing, kontak darurat, dan agenda hari ini.

### Mingguan

- Review data jamaah yang belum memiliki batch, kode aktivasi ganda, atau data hotel kosong.
- Uji alur login, kartu jamaah, agenda, dan tombol bantuan cepat pada perangkat mobile.
- Review audit log perubahan hotel, batch, dan data identitas.
- Update dependensi keamanan yang kritis setelah diuji di staging.

### Bulanan

- Restore test dari backup database untuk membuktikan backup benar-benar dapat dipakai.
- Review performa query Supabase dan indeks tabel yang paling aktif.
- Review akun admin/travel yang masih aktif dan cabut akses yang tidak diperlukan.
- Rilis pembaharuan minor dengan catatan perubahan yang singkat.

### Sebelum Setiap Keberangkatan

- Lock data operasional H-7: hotel, penerbangan, pembimbing, kamar, bus, dan titik kumpul.
- Lakukan dry run dengan satu akun jamaah untuk semua alur utama.
- Buat snapshot/backup batch sebelum perubahan besar.
- Siapkan kontak eskalasi teknis dan SOP jika koneksi jamaah bermasalah.

## 7. Kualitas, Keamanan, dan Rilis

- Pisahkan lingkungan development, staging, dan production. Perubahan skema diuji di staging sebelum SQL dijalankan di production.
- Semua perubahan database harus berupa migration SQL yang tersimpan di repository, bukan hanya query sekali pakai di dashboard.
- Jalankan typecheck dan build untuk setiap perubahan frontend; tambah pengujian alur kritis untuk login, pemetaan batch, dan tampilan data hotel.
- Pasang pemantauan error frontend dan backend, termasuk alert untuk kegagalan login massal atau error query meningkat.
- Jangan pernah membagikan connection string database di chat atau repository. Credential yang pernah dibagikan harus dirotasi.
- Buat changelog operasional: versi rilis, isi perubahan, risiko, cara rollback, dan PIC.

## 8. KPI yang Dipantau

| Area | KPI |
| --- | --- |
| Penggunaan jamaah | Persentase jamaah aktif, pembukaan agenda, penggunaan bantuan cepat |
| Ketepatan operasional | Jumlah koreksi hotel/batch setelah publikasi, agenda berubah, data tanpa batch |
| Dukungan | Waktu respons bantuan, jumlah tiket per 100 jamaah, penyelesaian hari yang sama |
| Keandalan | Error rate, waktu muat layar utama, keberhasilan login, keberhasilan backup restore |
| Admin | Waktu membuat batch, waktu impor jamaah, jumlah baris impor gagal |

## 9. Urutan Eksekusi Pertama

1. Kunci aturan data `keberangkatan_id` dan buat audit log agar kasus data hotel tertukar tidak berulang.
2. Selesaikan mode bantuan cepat dan offline cache untuk data inti jamaah.
3. Buat wizard batch serta impor Excel yang tervalidasi untuk tim travel.
4. Tambahkan kehadiran rombongan setelah data batch dan jamaah sudah konsisten.
5. Jalankan review bulanan atas KPI dan masukan pembimbing/jamaah untuk menentukan iterasi berikutnya.

## 10. Keputusan yang Dibutuhkan Sebelum Implementasi Penuh

- Apakah fitur bantuan cepat cukup mengarahkan ke WhatsApp, atau perlu tiket internal yang dipantau petugas?
- Apakah nomor kamar, bus, dan informasi kesehatan akan dikelola di Umrahme atau dari sistem travel lain?
- Siapa PIC setiap tenant yang boleh mengunci/mengubah data batch H-7 sampai kepulangan?
- Berapa lama data dan dokumen jamaah harus disimpan setelah perjalanan selesai?
