import { pgTable, text, boolean, timestamp, integer, jsonb } from "drizzle-orm/pg-core";

export const tenantsTable = pgTable("tenants", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  activation_code: text("activation_code").notNull().unique(),
  slug: text("slug"),
  nama_travel: text("nama_travel").notNull(),
  primary_color: text("primary_color").notNull().default("#0ea5e9"),
  primary_deep_color: text("primary_deep_color").notNull().default("#0284c7"),
  logo_url: text("logo_url"),
  page_title: text("page_title").notNull().default("Pendamping Umrah"),
  tanggal_keberangkatan: text("tanggal_keberangkatan"),
  tanggal_kepulangan: text("tanggal_kepulangan"),
  hotel_makkah: text("hotel_makkah"),
  hotel_madinah: text("hotel_madinah"),
  meeting_point: text("meeting_point"),
  guide_name: text("guide_name"),
  guide_whatsapp: text("guide_whatsapp"),
  tour_leader_name: text("tour_leader_name"),
  tour_leader_whatsapp: text("tour_leader_whatsapp"),
  emergency_note: text("emergency_note"),
  fase_override: text("fase_override", { enum: ["persiapan", "tanah-suci", "selesai"] }),
  hero_image_url: text("hero_image_url"),
  sertifikat_template_url: text("sertifikat_template_url"),
  sertifikat_layout: jsonb("sertifikat_layout"),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const keberangkatanTable = pgTable("keberangkatan", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenant_id: text("tenant_id").notNull().references(() => tenantsTable.id, { onDelete: "cascade" }),
  nama_batch: text("nama_batch").notNull(),
  tanggal_keberangkatan: text("tanggal_keberangkatan"),
  tanggal_kepulangan: text("tanggal_kepulangan"),
  hotel_makkah: text("hotel_makkah"),
  hotel_madinah: text("hotel_madinah"),
  meeting_point: text("meeting_point"),
  guide_name: text("guide_name"),
  guide_whatsapp: text("guide_whatsapp"),
  tour_leader_name: text("tour_leader_name"),
  tour_leader_whatsapp: text("tour_leader_whatsapp"),
  emergency_note: text("emergency_note"),
  fase_override: text("fase_override", { enum: ["persiapan", "tanah-suci", "selesai"] }),
  aktif: boolean("aktif").notNull().default(true),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const jamaahAccountsTable = pgTable("jamaah_accounts", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenant_id: text("tenant_id").notNull().references(() => tenantsTable.id, { onDelete: "cascade" }),
  keberangkatan_id: text("keberangkatan_id").references(() => keberangkatanTable.id, { onDelete: "set null" }),
  nama: text("nama").notNull(),
  nomor_jamaah: text("nomor_jamaah").notNull(),
  rombongan: text("rombongan"),
  nomor_bus: text("nomor_bus"),
  nomor_kamar: text("nomor_kamar"),
  nomor_paspor: text("nomor_paspor"),
  fase: text("fase", { enum: ["persiapan", "tanah-suci", "selesai"] }).notNull().default("persiapan"),
  fase_override: text("fase_override", { enum: ["persiapan", "tanah-suci", "selesai"] }),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const agendaItemsTable = pgTable("agenda_items", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenant_id: text("tenant_id").notNull().references(() => tenantsTable.id, { onDelete: "cascade" }),
  keberangkatan_id: text("keberangkatan_id").references(() => keberangkatanTable.id, { onDelete: "set null" }),
  tanggal: text("tanggal").notNull(),
  jam_mulai: text("jam_mulai"),
  judul: text("judul").notNull(),
  deskripsi: text("deskripsi"),
  lokasi: text("lokasi"),
  urutan: integer("urutan").notNull().default(0),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const travelAnnouncementsTable = pgTable("travel_announcements", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenant_id: text("tenant_id").notNull().references(() => tenantsTable.id, { onDelete: "cascade" }),
  keberangkatan_id: text("keberangkatan_id").references(() => keberangkatanTable.id, { onDelete: "set null" }),
  label: text("label").notNull().default("Info"),
  title: text("title").notNull(),
  content: text("content").notNull(),
  important: boolean("important").notNull().default(false),
  published_at: timestamp("published_at").defaultNow().notNull(),
});

export const tenantUsersTable = pgTable("tenant_users", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  user_id: text("user_id").notNull(),
  tenant_id: text("tenant_id").notNull().references(() => tenantsTable.id, { onDelete: "cascade" }),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const adminUsersTable = pgTable("admin_users", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text("email").notNull().unique(),
  password_hash: text("password_hash").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const travelUsersTable = pgTable("travel_users", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  email: text("email").notNull().unique(),
  password_hash: text("password_hash").notNull(),
  tenant_id: text("tenant_id").notNull().references(() => tenantsTable.id, { onDelete: "cascade" }),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const jamaahDataTable = pgTable("jamaah_data", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenant_id: text("tenant_id").notNull().references(() => tenantsTable.id, { onDelete: "cascade" }),
  nomor_jamaah: text("nomor_jamaah").notNull(),
  data_key: text("data_key").notNull(),
  data_value: jsonb("data_value").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const jurnalEntriesTable = pgTable("jurnal_entries", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  tenant_id: text("tenant_id").notNull().references(() => tenantsTable.id, { onDelete: "cascade" }),
  nomor_jamaah: text("nomor_jamaah").notNull(),
  tanggal: text("tanggal").notNull(),
  judul: text("judul"),
  isi: text("isi").notNull(),
  lokasi: text("lokasi"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});
