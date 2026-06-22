-- ============================================================
-- SEED DATA DEMO: Al-Fajr Wisata (kode DEMO01)
-- Jalankan di Supabase SQL Editor untuk setup demo.
-- ============================================================

-- 1. Upsert tenant
INSERT INTO tenants (
  id,
  nama_travel,
  activation_code,
  tanggal_keberangkatan,
  tanggal_kepulangan,
  hotel_makkah,
  hotel_madinah,
  meeting_point,
  guide_name,
  guide_whatsapp,
  tour_leader_name,
  tour_leader_whatsapp,
  emergency_note,
  fase_override
) VALUES (
  'demo01-tenant-uuid',                    -- ganti dengan UUID nyata
  'Al-Fajr Wisata',
  'DEMO01',
  CURRENT_DATE - INTERVAL '3 days',        -- sudah di tanah suci
  CURRENT_DATE + INTERVAL '6 days',
  'Al Marwa Rayhaan by Rotana, Makkah',
  'Dar Al Iman InterContinental, Madinah',
  'Lobby utama hotel — lantai dasar dekat resepsionis',
  'Ust. Ahmad Fauzi, Lc.',
  '6281312345678',
  'Bpk. Hendra Setiawan',
  '6281298765432',
  'Jika tersesat atau memerlukan bantuan mendesak, tetap tenang dan hubungi Ust. Ahmad Fauzi. Tunjukkan Kartu Jamaah Digital kepada petugas masjid atau polisi terdekat.',
  'tanah-suci'
)
ON CONFLICT (activation_code) DO UPDATE SET
  nama_travel            = EXCLUDED.nama_travel,
  hotel_makkah           = EXCLUDED.hotel_makkah,
  hotel_madinah          = EXCLUDED.hotel_madinah,
  meeting_point          = EXCLUDED.meeting_point,
  guide_name             = EXCLUDED.guide_name,
  guide_whatsapp         = EXCLUDED.guide_whatsapp,
  tour_leader_name       = EXCLUDED.tour_leader_name,
  tour_leader_whatsapp   = EXCLUDED.tour_leader_whatsapp,
  emergency_note         = EXCLUDED.emergency_note,
  fase_override          = EXCLUDED.fase_override;

-- 2. Jamaah demo (3 orang)
-- Ganti tenant_id dengan UUID nyata dari hasil INSERT di atas.

INSERT INTO jamaah_accounts (
  tenant_id, nama, nomor_jamaah,
  rombongan, nomor_bus, nomor_kamar, fase_override
) VALUES
  ('demo01-tenant-uuid', 'Ahmad Fathoni',   'ALF-2026-001', 'Rombongan Al-Fajr 2026', 'Bus 2', '714', NULL),
  ('demo01-tenant-uuid', 'Siti Rahmawati',  'ALF-2026-002', 'Rombongan Al-Fajr 2026', 'Bus 2', '715', NULL),
  ('demo01-tenant-uuid', 'Budi Santoso',    'ALF-2026-003', 'Rombongan Al-Fajr 2026', 'Bus 2', '716', NULL)
ON CONFLICT DO NOTHING;

-- 3. Pengumuman contoh
INSERT INTO travel_announcements (
  tenant_id, label, title, content, important, published_at
) VALUES
  (
    'demo01-tenant-uuid',
    'Info Hari Ini',
    'Jadwal Tawaf Malam Ini',
    'Rombongan Al-Fajr berangkat ke Masjidil Haram pukul 22.30 WAS dari lobby hotel. Harap sudah berwudhu dan berpakaian ihram sebelum turun. Ust. Ahmad Fauzi akan memimpin langsung.',
    true,
    NOW()
  ),
  (
    'demo01-tenant-uuid',
    'Pengingat',
    'Simpan Kartu Jamaah Digital Anda',
    'Pastikan aplikasi Umrahme terinstall dan Kartu Jamaah Digital bisa dibuka offline. Kartu ini wajib ditunjukkan jika ada keperluan dengan petugas.',
    false,
    NOW() - INTERVAL '1 day'
  )
ON CONFLICT DO NOTHING;
