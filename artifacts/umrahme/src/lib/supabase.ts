import { createClient } from '@supabase/supabase-js';

declare const __SUPABASE_URL__: string;
declare const __SUPABASE_ANON_KEY__: string;

const supabaseUrl = __SUPABASE_URL__;
const supabaseAnonKey = __SUPABASE_ANON_KEY__;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type TenantRow = {
  id: string;
  activation_code: string;
  nama_travel: string;
  primary_color: string;
  primary_deep_color: string;
  logo_url: string | null;
  page_title: string;
  tanggal_keberangkatan: string | null;
  tanggal_kepulangan: string | null;
  created_at: string;
  // Kolom operasional (nullable — admin mungkin belum mengisi)
  hotel_makkah: string | null;
  hotel_madinah: string | null;
  meeting_point: string | null;
  guide_name: string | null;
  guide_whatsapp: string | null;
  tour_leader_name: string | null;
  tour_leader_whatsapp: string | null;
  emergency_note: string | null;
};

export type AgendaItemRow = {
  id: string;
  tenant_id: string;
  tanggal: string;
  jam_mulai: string | null;
  judul: string;
  deskripsi: string | null;
  lokasi: string | null;
  urutan: number;
  created_at: string;
};

export type TravelAnnouncementRow = {
  id: string;
  tenant_id: string;
  label: string;
  title: string;
  content: string;
  important: boolean;
  published_at: string;
};
