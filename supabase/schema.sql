-- =============================================================
-- Umrahme — Dokumentasi Skema Database
-- Dikelola via Drizzle ORM (lib/db/src/schema/index.ts)
-- File ini HANYA dokumentasi — tidak dieksekusi otomatis
-- =============================================================

-- Tabel tenant (satu tenant = satu travel umrah)
CREATE TABLE tenants (
  id                    TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  activation_code       TEXT NOT NULL UNIQUE,           -- kode login jamaah (mis. "UMR8X2")
  nama_travel           TEXT NOT NULL,
  primary_color         TEXT NOT NULL DEFAULT '#0ea5e9', -- warna tema hex
  primary_deep_color    TEXT NOT NULL DEFAULT '#0284c7',
  logo_url              TEXT,
  page_title            TEXT NOT NULL DEFAULT 'Pendamping Umrah',
  tanggal_keberangkatan TEXT,                           -- format YYYY-MM-DD
  tanggal_kepulangan    TEXT,
  hotel_makkah          TEXT,
  hotel_madinah         TEXT,
  meeting_point         TEXT,
  guide_name            TEXT,
  guide_whatsapp        TEXT,
  tour_leader_name      TEXT,
  tour_leader_whatsapp  TEXT,
  emergency_note        TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Akun jamaah (satu jamaah per tenant)
CREATE TABLE jamaah_accounts (
  id            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  tenant_id     TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  nama          TEXT NOT NULL,
  nomor_jamaah  TEXT NOT NULL,
  rombongan     TEXT,
  nomor_bus     TEXT,
  nomor_kamar   TEXT,
  fase          TEXT NOT NULL DEFAULT 'persiapan'
                  CHECK (fase IN ('persiapan', 'tanah-suci', 'selesai')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Agenda perjalanan per tenant
CREATE TABLE agenda_items (
  id          TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  tenant_id   TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  tanggal     TEXT NOT NULL,   -- format YYYY-MM-DD
  jam_mulai   TEXT,            -- format HH:MM
  judul       TEXT NOT NULL,
  deskripsi   TEXT,
  lokasi      TEXT,
  urutan      INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Pengumuman dari travel ke jamaah
CREATE TABLE travel_announcements (
  id           TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  tenant_id    TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  label        TEXT NOT NULL DEFAULT 'Info',
  title        TEXT NOT NULL,
  content      TEXT NOT NULL,
  important    BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Relasi user ↔ tenant (untuk akun travel/pembimbing)
CREATE TABLE tenant_users (
  id         TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id    TEXT NOT NULL,
  tenant_id  TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Akun admin super (login ke /admin)
CREATE TABLE admin_users (
  id            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Akun travel (login ke /travel-dashboard)
CREATE TABLE travel_users (
  id            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  tenant_id     TEXT NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
