import { createClient } from '@supabase/supabase-js';

declare const __SUPABASE_URL__: string;
declare const __SUPABASE_ANON_KEY__: string;

const supabaseUrl = __SUPABASE_URL__;
const supabaseAnonKey = __SUPABASE_ANON_KEY__;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const SUPABASE_FUNCTIONS_URL = `${supabaseUrl}/functions/v1`;

// ── Types ──────────────────────────────────────────────────────

export type TenantRow = {
  id: string;
  activation_code: string;
  slug: string | null;
  nama_travel: string;
  primary_color: string;
  primary_deep_color: string;
  logo_url: string | null;
  page_title: string;
  tanggal_keberangkatan: string | null;
  tanggal_kepulangan: string | null;
  created_at: string;
  hotel_makkah: string | null;
  hotel_madinah: string | null;
  meeting_point: string | null;
  guide_name: string | null;
  guide_whatsapp: string | null;
  tour_leader_name: string | null;
  tour_leader_whatsapp: string | null;
  emergency_note: string | null;
  fase_override: 'persiapan' | 'tanah-suci' | 'selesai' | null;
  hero_image_url: string | null;
  sertifikat_template_url: string | null;
};

export type KeberangkatanRow = {
  id: string;
  tenant_id: string;
  nama_batch: string;
  tanggal_keberangkatan: string | null;
  tanggal_kepulangan: string | null;
  hotel_makkah: string | null;
  hotel_madinah: string | null;
  meeting_point: string | null;
  guide_name: string | null;
  guide_whatsapp: string | null;
  tour_leader_name: string | null;
  tour_leader_whatsapp: string | null;
  emergency_note: string | null;
  fase_override: 'persiapan' | 'tanah-suci' | 'selesai' | null;
  aktif: boolean;
  created_at: string;
};

export type AgendaItemRow = {
  id: string;
  tenant_id: string;
  keberangkatan_id: string | null;
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
  keberangkatan_id: string | null;
  label: string;
  title: string;
  content: string;
  important: boolean;
  published_at: string;
};

export type JamaahAccountRow = {
  id: string;
  tenant_id: string;
  keberangkatan_id: string | null;
  nama: string;
  nomor_jamaah: string;
  rombongan: string | null;
  nomor_bus: string | null;
  nomor_kamar: string | null;
  nomor_paspor: string | null;
  fase: 'persiapan' | 'tanah-suci' | 'selesai';
  fase_override: 'persiapan' | 'tanah-suci' | 'selesai' | null;
  created_at: string;
};

export type TenantUserRow = {
  id: string;
  user_id: string;
  tenant_id: string;
  created_at: string;
};

// ── Tenants ───────────────────────────────────────────────────

export async function fetchTenants(): Promise<TenantRow[]> {
  const { data, error } = await supabase
    .from('tenants')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data as TenantRow[];
}

export async function fetchTenant(id: string): Promise<TenantRow> {
  const { data, error } = await supabase
    .from('tenants')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw new Error(error.message);
  return data as TenantRow;
}

export async function createTenant(payload: Partial<TenantRow>): Promise<TenantRow> {
  const { data, error } = await supabase
    .from('tenants')
    .insert(payload)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as TenantRow;
}

export async function updateTenant(id: string, payload: Partial<TenantRow>): Promise<TenantRow> {
  const { data, error } = await supabase
    .from('tenants')
    .update(payload)
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as TenantRow;
}

export async function deleteTenant(id: string): Promise<void> {
  await supabase.from('agenda_items').delete().eq('tenant_id', id);
  await supabase.from('travel_announcements').delete().eq('tenant_id', id);
  await supabase.from('jamaah_accounts').delete().eq('tenant_id', id);
  await supabase.from('tenant_users').delete().eq('tenant_id', id);
  const { error } = await supabase.from('tenants').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export async function fetchTenantBySlug(slug: string): Promise<TenantRow | null> {
  const { data, error } = await supabase
    .from('tenants')
    .select('*')
    .eq('slug', slug.toLowerCase())
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data as TenantRow | null;
}

export async function checkActivationCode(code: string, excludeId?: string): Promise<{ taken: boolean }> {
  const { data, error } = await supabase
    .from('tenants')
    .select('id')
    .eq('activation_code', code);
  if (error) throw new Error(error.message);
  const taken = (data ?? []).some((r: { id: string }) => r.id !== excludeId);
  return { taken };
}

// ── Keberangkatan ─────────────────────────────────────────────

export async function fetchKeberangkatan(tenantId: string): Promise<KeberangkatanRow[]> {
  const { data, error } = await supabase
    .from('keberangkatan')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as KeberangkatanRow[];
}

export async function fetchKeberangkatanById(id: string): Promise<KeberangkatanRow | null> {
  const { data, error } = await supabase
    .from('keberangkatan')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data as KeberangkatanRow | null;
}

export async function createKeberangkatan(tenantId: string, payload: Partial<KeberangkatanRow>): Promise<KeberangkatanRow> {
  const { data, error } = await supabase
    .from('keberangkatan')
    .insert({ tenant_id: tenantId, ...payload })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as KeberangkatanRow;
}

export async function updateKeberangkatan(id: string, payload: Partial<KeberangkatanRow>): Promise<KeberangkatanRow> {
  const { data, error } = await supabase
    .from('keberangkatan')
    .update(payload)
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as KeberangkatanRow;
}

export async function deleteKeberangkatan(id: string): Promise<void> {
  const { error } = await supabase.from('keberangkatan').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

// ── Agenda ────────────────────────────────────────────────────

export async function fetchAgenda(keberangkatanId: string): Promise<AgendaItemRow[]> {
  const { data, error } = await supabase
    .from('agenda_items')
    .select('*')
    .eq('keberangkatan_id', keberangkatanId)
    .order('tanggal', { ascending: true })
    .order('jam_mulai', { ascending: true })
    .order('urutan', { ascending: true });
  if (error) throw new Error(error.message);
  return data as AgendaItemRow[];
}

export async function createAgenda(tenantId: string, keberangkatanId: string, payload: object): Promise<AgendaItemRow> {
  const { data, error } = await supabase
    .from('agenda_items')
    .insert({ ...payload, tenant_id: tenantId, keberangkatan_id: keberangkatanId })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as AgendaItemRow;
}

export async function bulkInsertAgenda(tenantId: string, keberangkatanId: string, items: object[]): Promise<{ inserted: number }> {
  const rows = items.map((item) => ({ ...item, tenant_id: tenantId, keberangkatan_id: keberangkatanId }));
  const { data, error } = await supabase.from('agenda_items').insert(rows).select();
  if (error) throw new Error(error.message);
  return { inserted: (data ?? []).length };
}

export async function deleteAgenda(tenantId: string, agendaId: string): Promise<{ ok: boolean }> {
  const { error } = await supabase
    .from('agenda_items')
    .delete()
    .eq('id', agendaId)
    .eq('tenant_id', tenantId);
  if (error) throw new Error(error.message);
  return { ok: true };
}

// ── Announcements ─────────────────────────────────────────────

export async function fetchAnnouncements(keberangkatanId: string): Promise<TravelAnnouncementRow[]> {
  const { data, error } = await supabase
    .from('travel_announcements')
    .select('*')
    .eq('keberangkatan_id', keberangkatanId)
    .order('published_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data as TravelAnnouncementRow[];
}

export async function createAnnouncement(tenantId: string, keberangkatanId: string, payload: object): Promise<TravelAnnouncementRow> {
  const { data, error } = await supabase
    .from('travel_announcements')
    .insert({ ...payload, tenant_id: tenantId, keberangkatan_id: keberangkatanId })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as TravelAnnouncementRow;
}

export async function deleteAnnouncement(tenantId: string, annId: string): Promise<{ ok: boolean }> {
  const { error } = await supabase
    .from('travel_announcements')
    .delete()
    .eq('id', annId)
    .eq('tenant_id', tenantId);
  if (error) throw new Error(error.message);
  return { ok: true };
}

// ── Jamaah ────────────────────────────────────────────────────

export async function fetchJamaah(keberangkatanId: string): Promise<JamaahAccountRow[]> {
  const { data, error } = await supabase
    .from('jamaah_accounts')
    .select('*')
    .eq('keberangkatan_id', keberangkatanId)
    .order('nama', { ascending: true });
  if (error) throw new Error(error.message);
  return data as JamaahAccountRow[];
}

export async function bulkInsertJamaah(tenantId: string, keberangkatanId: string, items: object[]): Promise<{ inserted: number }> {
  const rows = items.map((item) => ({ ...item, tenant_id: tenantId, keberangkatan_id: keberangkatanId }));
  const { data, error } = await supabase.from('jamaah_accounts').insert(rows).select();
  if (error) throw new Error(error.message);
  return { inserted: (data ?? []).length };
}

export async function createJamaah(tenantId: string, keberangkatanId: string, payload: object): Promise<JamaahAccountRow> {
  const { data, error } = await supabase
    .from('jamaah_accounts')
    .insert({ ...payload, tenant_id: tenantId, keberangkatan_id: keberangkatanId })
    .select()
    .single();
  if (error) {
    const msg = error.message;
    if (msg.includes('unique') || msg.includes('duplicate')) {
      throw new Error(`Nama sudah terdaftar di tenant ini.`);
    }
    throw new Error(msg);
  }
  return data as JamaahAccountRow;
}

export async function updateJamaah(tenantId: string, jamaahId: string, payload: object): Promise<JamaahAccountRow> {
  const { data, error } = await supabase
    .from('jamaah_accounts')
    .update(payload)
    .eq('id', jamaahId)
    .eq('tenant_id', tenantId)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as JamaahAccountRow;
}

export async function deleteJamaah(tenantId: string, jamaahId: string): Promise<{ ok: boolean }> {
  const { error } = await supabase
    .from('jamaah_accounts')
    .delete()
    .eq('id', jamaahId)
    .eq('tenant_id', tenantId);
  if (error) throw new Error(error.message);
  return { ok: true };
}

// ── Travel Accounts ───────────────────────────────────────────

export async function fetchTravelAccounts(tenantId: string): Promise<TenantUserRow[]> {
  const { data, error } = await supabase
    .from('tenant_users')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data as TenantUserRow[];
}

export async function createTravelAccount(
  tenantId: string,
  email: string,
  password: string,
): Promise<{ success: boolean; user_id: string; email: string }> {
  const { data, error } = await supabase.functions.invoke('create-travel-user', {
    body: { email, password, tenant_id: tenantId },
  });
  if (error) throw new Error(error.message ?? 'Gagal membuat akun travel.');
  if (data?.error) throw new Error(data.error);
  return data as { success: boolean; user_id: string; email: string };
}

export async function revokeTravelAccess(tenantId: string, mappingId: string): Promise<{ ok: boolean }> {
  const { error } = await supabase
    .from('tenant_users')
    .delete()
    .eq('id', mappingId)
    .eq('tenant_id', tenantId);
  if (error) throw new Error(error.message);
  return { ok: true };
}

// ── Logo Upload ───────────────────────────────────────────────

export async function uploadLogo(file: File): Promise<string> {
  const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';
  const filename = `logos/${crypto.randomUUID()}.${ext}`;
  const { data, error } = await supabase.storage
    .from('logos')
    .upload(filename, file, { upsert: false, contentType: file.type });
  if (error) throw new Error(error.message);
  const { data: { publicUrl } } = supabase.storage.from('logos').getPublicUrl(data.path);
  return publicUrl;
}

// ── Sertifikat Template Upload ────────────────────────────────

export async function uploadSertifikatTemplate(file: File): Promise<string> {
  const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';
  const filename = `sertifikat/${crypto.randomUUID()}.${ext}`;
  const { data, error } = await supabase.storage
    .from('logos')
    .upload(filename, file, { upsert: false, contentType: file.type });
  if (error) throw new Error(error.message);
  const { data: { publicUrl } } = supabase.storage.from('logos').getPublicUrl(data.path);
  return publicUrl;
}

// ── Hero Image Upload ──────────────────────────────────────────

export async function uploadHeroImage(file: File): Promise<string> {
  const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';
  const filename = `hero/${crypto.randomUUID()}.${ext}`;
  const { data, error } = await supabase.storage
    .from('logos')
    .upload(filename, file, { upsert: false, contentType: file.type });
  if (error) throw new Error(error.message);
  const { data: { publicUrl } } = supabase.storage.from('logos').getPublicUrl(data.path);
  return publicUrl;
}
