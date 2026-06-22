-- ============================================================
-- Migration: tambah kolom operasional ke tabel tenants
--            + buat tabel travel_announcements
-- Jalankan di: Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Kolom operasional di tabel tenants
ALTER TABLE tenants
  ADD COLUMN IF NOT EXISTS hotel_makkah          TEXT,
  ADD COLUMN IF NOT EXISTS hotel_madinah         TEXT,
  ADD COLUMN IF NOT EXISTS meeting_point         TEXT,
  ADD COLUMN IF NOT EXISTS guide_name            TEXT,
  ADD COLUMN IF NOT EXISTS guide_whatsapp        TEXT,
  ADD COLUMN IF NOT EXISTS tour_leader_name      TEXT,
  ADD COLUMN IF NOT EXISTS tour_leader_whatsapp  TEXT,
  ADD COLUMN IF NOT EXISTS emergency_note        TEXT;

-- 2. Tabel pengumuman travel
CREATE TABLE IF NOT EXISTS travel_announcements (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id    UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  label        TEXT NOT NULL DEFAULT 'Info',
  title        TEXT NOT NULL,
  content      TEXT NOT NULL,
  important    BOOLEAN NOT NULL DEFAULT FALSE,
  published_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS travel_announcements_tenant_id_idx
  ON travel_announcements (tenant_id, published_at DESC);

-- 3. RLS untuk travel_announcements
ALTER TABLE travel_announcements ENABLE ROW LEVEL SECURITY;

-- Jamaah: baca pengumuman milik tenant mereka
CREATE POLICY IF NOT EXISTS "travel_announcements_select"
  ON travel_announcements FOR SELECT
  USING (true);

-- Admin (service role) dapat insert/update/delete — tidak perlu policy khusus

-- 4. Verifikasi kolom berhasil ditambahkan
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'tenants'
  AND column_name IN (
    'hotel_makkah','hotel_madinah','meeting_point',
    'guide_name','guide_whatsapp',
    'tour_leader_name','tour_leader_whatsapp','emergency_note'
  )
ORDER BY column_name;
