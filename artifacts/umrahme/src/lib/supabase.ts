import { createClient } from '@supabase/supabase-js';

declare const __SUPABASE_URL__: string;
declare const __SUPABASE_ANON_KEY__: string;

const supabaseUrl = __SUPABASE_URL__;
const supabaseAnonKey = __SUPABASE_ANON_KEY__;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const SUPABASE_FUNCTIONS_URL = `${supabaseUrl}/functions/v1`;

// ── Types ──────────────────────────────────────────────────────

export interface SertifikatField {
  key: 'nama' | 'nomor' | 'tanggal' | 'nomor_sertifikat' | 'nama_travel' | 'judul' | 'subjudul' | 'keterangan';
  label: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  align: 'left' | 'center' | 'right';
  fontFamily: 'display' | 'sans' | 'mono' | 'arab';
  bold: boolean;
  visible: boolean;
}

export interface SertifikatLayout {
  fields: SertifikatField[];
}

export const DEFAULT_SERTIFIKAT_LAYOUT: SertifikatLayout = {
  fields: [
    { key: 'nama',             label: 'Nama Jamaah',    x: 50, y: 50, fontSize: 40, color: '#1a1a1a', align: 'center', fontFamily: 'display', bold: true,  visible: true  },
    { key: 'nomor',            label: 'Nomor Jamaah',   x: 50, y: 60, fontSize: 18, color: '#666666', align: 'center', fontFamily: 'mono',    bold: false, visible: true  },
    { key: 'tanggal',          label: 'Tanggal',        x: 30, y: 80, fontSize: 16, color: '#333333', align: 'center', fontFamily: 'sans',    bold: false, visible: false },
    { key: 'nomor_sertifikat', label: 'No. Sertifikat', x: 70, y: 80, fontSize: 16, color: '#333333', align: 'center', fontFamily: 'mono',    bold: false, visible: false },
    { key: 'nama_travel',      label: 'Nama Travel',    x: 50, y: 90, fontSize: 18, color: '#1a1a1a', align: 'center', fontFamily: 'display', bold: true,  visible: false },
    { key: 'judul',            label: 'Judul',          x: 50, y: 20, fontSize: 28, color: '#1a1a1a', align: 'center', fontFamily: 'display', bold: true,  visible: false },
    { key: 'subjudul',         label: 'Sub Judul',      x: 50, y: 30, fontSize: 16, color: '#666666', align: 'center', fontFamily: 'sans',    bold: false, visible: false },
    { key: 'keterangan',       label: 'Keterangan',     x: 50, y: 70, fontSize: 14, color: '#444444', align: 'center', fontFamily: 'sans',    bold: false, visible: false },
  ],
};

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
  hero_text_color: string | null;
  sertifikat_template_url: string | null;
  sertifikat_layout: SertifikatLayout | null;
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

export type TravelContractRow = {
  id: string;
  tenant_id: string;
  contract_number: string;
  package_name: string;
  status: 'draft' | 'active' | 'expired' | 'terminated';
  starts_at: string | null;
  ends_at: string | null;
  annual_fee: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type ItineraryAddonRow = { id: string; tenant_id: string; keberangkatan_id: string; nama: string; deskripsi: string | null; created_at: string };
export type ItineraryAddonItemRow = {
  id: string;
  addon_id: string;
  tanggal: string;
  jam_mulai: string | null;
  judul: string;
  deskripsi: string | null;
  lokasi: string | null;
  urutan: number;
  created_at: string;
};
export async function fetchItineraryAddons(keberangkatanId: string): Promise<ItineraryAddonRow[]> {
  const { data, error } = await supabase.from('itinerary_addons').select('*').eq('keberangkatan_id', keberangkatanId).order('created_at');
  if (error) throw new Error(error.message); return data as ItineraryAddonRow[];
}
export async function createItineraryAddon(tenantId: string, keberangkatanId: string, nama: string, deskripsi: string): Promise<ItineraryAddonRow> {
  const { data, error } = await supabase.from('itinerary_addons').insert({ tenant_id: tenantId, keberangkatan_id: keberangkatanId, nama, deskripsi: deskripsi || null }).select().single();
  if (error) throw new Error(error.message); return data as ItineraryAddonRow;
}

export async function fetchItineraryAddonMembers(addonId: string): Promise<string[]> {
  const { data, error } = await supabase.from('itinerary_addon_jamaah').select('jamaah_id').eq('addon_id', addonId);
  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => row.jamaah_id as string);
}

export async function replaceItineraryAddonMembers(addonId: string, jamaahIds: string[]): Promise<void> {
  const { error: deleteError } = await supabase.from('itinerary_addon_jamaah').delete().eq('addon_id', addonId);
  if (deleteError) throw new Error(deleteError.message);
  if (jamaahIds.length === 0) return;
  const { error } = await supabase.from('itinerary_addon_jamaah').insert(jamaahIds.map((jamaah_id) => ({ addon_id: addonId, jamaah_id })));
  if (error) throw new Error(error.message);
}

export async function fetchItineraryAddonItems(addonId: string): Promise<ItineraryAddonItemRow[]> {
  const { data, error } = await supabase
    .from('itinerary_addon_items')
    .select('*')
    .eq('addon_id', addonId)
    .order('tanggal')
    .order('jam_mulai')
    .order('urutan');
  if (error) throw new Error(error.message);
  return (data ?? []) as ItineraryAddonItemRow[];
}

export async function createItineraryAddonItem(addonId: string, payload: Omit<ItineraryAddonItemRow, 'id' | 'addon_id' | 'created_at'>): Promise<ItineraryAddonItemRow> {
  const { data, error } = await supabase.from('itinerary_addon_items').insert({ addon_id: addonId, ...payload }).select().single();
  if (error) throw new Error(error.message);
  return data as ItineraryAddonItemRow;
}

export async function fetchTravelContracts(): Promise<TravelContractRow[]> {
  const { data, error } = await supabase.from('travel_contracts').select('*').order('ends_at', { ascending: true, nullsFirst: false });
  if (error) throw new Error(error.message);
  return data as TravelContractRow[];
}

export async function fetchTravelContract(tenantId: string): Promise<TravelContractRow | null> {
  const { data, error } = await supabase.from('travel_contracts').select('*').eq('tenant_id', tenantId).maybeSingle();
  if (error) throw new Error(error.message);
  return data as TravelContractRow | null;
}

export async function upsertTravelContract(payload: Omit<TravelContractRow, 'id' | 'created_at' | 'updated_at'>): Promise<TravelContractRow> {
  const { data, error } = await supabase.from('travel_contracts').upsert(payload, { onConflict: 'tenant_id' }).select().single();
  if (error) throw new Error(error.message);
  return data as TravelContractRow;
}

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

export type HelpRequestStatus = 'baru' | 'ditangani' | 'selesai';
export type HelpRequestCategory = 'tersesat' | 'kesehatan' | 'rombongan' | 'lainnya';

export type HelpRequestRow = {
  id: string;
  tenant_id: string;
  keberangkatan_id: string | null;
  jamaah_id: string | null;
  nomor_jamaah: string;
  nama_jamaah: string;
  kategori: HelpRequestCategory;
  pesan: string;
  status: HelpRequestStatus;
  handled_by: string | null;
  handled_at: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
};

export type EquipmentCatalogRow = {
  id: string;
  tenant_id: string;
  keberangkatan_id: string;
  label: string;
  category: string;
  sort_order: number;
  active: boolean;
  created_at: string;
};

export type EquipmentAssignmentStatus = 'belum' | 'sudah' | 'tidak_perlu';
export type EquipmentAssignmentRow = {
  id: string;
  tenant_id: string;
  keberangkatan_id: string;
  jamaah_id: string;
  equipment_id: string;
  status: EquipmentAssignmentStatus;
  received_at: string | null;
  updated_by: string | null;
  updated_at: string;
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
  hotel_makkah?: string | null;
  hotel_madinah?: string | null;
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

export type TokenOrderStatus = 'menunggu_pembayaran' | 'lunas' | 'dibatalkan';
export type TokenOrderRow = { id: string; tenant_id: string; quantity: number; unit_price: number; status: TokenOrderStatus; note: string | null; paid_at: string | null; created_at: string };
export type TenantQuotaBalance = { tenant_id: string; balance: number; total_issued: number; total_used: number; updated_at: string };
export type JamaahDocumentStatus = 'belum' | 'proses' | 'lengkap';
export type JamaahDocumentRow = { id: string; tenant_id: string; jamaah_id: string; document_type: 'paspor' | 'visa' | 'tiket' | 'foto' | 'lainnya'; status: JamaahDocumentStatus; note: string | null; updated_at: string };
export type TravelLeadRow = { id: string; tenant_id: string; nama: string; whatsapp: string | null; source: string; status: 'baru'|'follow_up'|'minat'|'booking'|'lunas'|'diterbitkan'|'batal'; batch_id: string | null; next_follow_up_at: string | null; note: string | null; created_at: string; updated_at: string };
export async function fetchTravelLeads(tenantId: string): Promise<TravelLeadRow[]> { const { data, error } = await supabase.from('travel_leads').select('*').eq('tenant_id', tenantId).order('next_follow_up_at'); if (error) throw new Error(error.message); return (data ?? []) as TravelLeadRow[]; }
export async function createTravelLead(tenantId: string, payload: Partial<TravelLeadRow>): Promise<TravelLeadRow> { const { data, error } = await supabase.from('travel_leads').insert({ tenant_id: tenantId, ...payload }).select().single(); if (error) throw new Error(error.message); return data as TravelLeadRow; }
export async function updateTravelLead(id: string, payload: Partial<TravelLeadRow>): Promise<TravelLeadRow> { const { data, error } = await supabase.from('travel_leads').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', id).select().single(); if (error) throw new Error(error.message); return data as TravelLeadRow; }

export type AdminTenantMetrics = {
  jamaahCount: number;
  operatorCount: number;
  openHelpCount: number;
  activeBatch: KeberangkatanRow | null;
  upcomingBatch: KeberangkatanRow | null;
  batchCount: number;
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

export async function fetchAdminTenantMetrics(tenantIds: string[]): Promise<Record<string, AdminTenantMetrics>> {
  const empty: Record<string, AdminTenantMetrics> = {};
  if (tenantIds.length === 0) return empty;

  const [batchesResult, jamaahResult, operatorsResult, helpResult] = await Promise.all([
    supabase.from('keberangkatan').select('*').in('tenant_id', tenantIds),
    supabase.from('jamaah_accounts').select('tenant_id, keberangkatan_id').in('tenant_id', tenantIds),
    supabase.from('tenant_users').select('tenant_id').in('tenant_id', tenantIds),
    supabase.from('help_requests').select('tenant_id, status').in('tenant_id', tenantIds),
  ]);

  const errors = [batchesResult.error, jamaahResult.error, operatorsResult.error, helpResult.error].filter(Boolean);
  if (errors.length > 0) throw new Error(errors[0]?.message ?? 'Gagal memuat ringkasan travel.');

  const today = new Date().toLocaleDateString('en-CA');
  const batches = (batchesResult.data ?? []) as KeberangkatanRow[];
  const jamaah = (jamaahResult.data ?? []) as Pick<JamaahAccountRow, 'tenant_id' | 'keberangkatan_id'>[];
  const operators = (operatorsResult.data ?? []) as Pick<TenantUserRow, 'tenant_id'>[];
  const help = (helpResult.data ?? []) as Pick<HelpRequestRow, 'tenant_id' | 'status'>[];

  for (const tenantId of tenantIds) {
    const tenantBatches = batches.filter((batch) => batch.tenant_id === tenantId);
    const activeBatches = tenantBatches.filter((batch) => (
      batch.aktif && batch.fase_override !== 'selesai' && (!batch.tanggal_kepulangan || batch.tanggal_kepulangan >= today)
    ));
    const futureBatches = tenantBatches.filter((batch) => batch.tanggal_keberangkatan && batch.tanggal_keberangkatan >= today);
    const byDeparture = (a: KeberangkatanRow, b: KeberangkatanRow) => (a.tanggal_keberangkatan ?? '9999-12-31').localeCompare(b.tanggal_keberangkatan ?? '9999-12-31');

    empty[tenantId] = {
      jamaahCount: jamaah.filter((row) => row.tenant_id === tenantId).length,
      operatorCount: operators.filter((row) => row.tenant_id === tenantId).length,
      openHelpCount: help.filter((row) => row.tenant_id === tenantId && row.status !== 'selesai').length,
      activeBatch: activeBatches.sort(byDeparture)[0] ?? null,
      upcomingBatch: futureBatches.sort(byDeparture)[0] ?? null,
      batchCount: tenantBatches.length,
    };
  }

  return empty;
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
  // Agenda dapat pernah diimpor ulang oleh travel. Satu aktivitas dengan
  // waktu dan detail yang sama hanya perlu ditampilkan sekali ke jamaah.
  const seen = new Set<string>();
  return (data as AgendaItemRow[]).filter((item) => {
    const key = [item.tanggal, item.jam_mulai ?? '', item.judul, item.lokasi ?? '', item.deskripsi ?? ''].join('|');
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export async function fetchAgendaForJamaah(
  tenantId: string,
  keberangkatanId: string,
  identity: { accountId?: string; nomorJamaah: string; nama: string },
): Promise<AgendaItemRow[]> {
  // AlUla adalah itinerary addon, bukan agenda umum. Filter ini melindungi
  // jamaah reguler dari data agenda lama yang belum sempat dibersihkan.
  const isAlUlaAgenda = (item: Pick<AgendaItemRow, 'judul' | 'deskripsi' | 'lokasi'>) =>
    `${item.judul} ${item.deskripsi ?? ''} ${item.lokasi ?? ''}`.toLowerCase().replace(/[^a-z0-9]+/g, '').includes('alula');
  const normalizeName = (name: string) => name.toUpperCase().replace(/[^A-Z0-9]+/g, '');
  const alUlaParticipantNames = new Set([
    'SHEILLASYLVIA', 'ROMLIUDINSUHENDI', 'EDIHUDIN', 'LILISUDINMISNA',
    'LENIHERLINA', 'NANANGSUHERMAN', 'WINAKARLINA', 'NAUFALFADHILMUHAMAD',
    'CORINNAFITRIANASITIROHIDA', 'MRHESTURAMADHAN', 'MRHEZAPAHLEVI',
    'ERIKASHAQUEENAMECCA',
  ]);
  const isKnownAlUlaParticipant = alUlaParticipantNames.has(normalizeName(identity.nama));
  const baseAgenda = (await fetchAgenda(keberangkatanId)).filter((item) => !isAlUlaAgenda(item));
  let accountQuery = supabase
    .from('jamaah_accounts')
    .select('id')
    .eq('tenant_id', tenantId)
    .eq('keberangkatan_id', keberangkatanId);
  if (identity.accountId) accountQuery = accountQuery.eq('id', identity.accountId);
  else accountQuery = accountQuery.eq('nama', identity.nama);
  const { data: jamaah, error: jamaahError } = await accountQuery.maybeSingle();
  if (jamaahError || !jamaah) return isKnownAlUlaParticipant ? appendAlUlaFallback(baseAgenda, tenantId, keberangkatanId) : baseAgenda;

  const { data: memberships, error: membershipError } = await supabase
    .from('itinerary_addon_jamaah')
    .select('addon_id')
    .eq('jamaah_id', jamaah.id);
  const hasAddonMembership = !membershipError && Boolean(memberships?.length);
  if (!hasAddonMembership && !isKnownAlUlaParticipant) return baseAgenda;
  if (!hasAddonMembership) return appendAlUlaFallback(baseAgenda, tenantId, keberangkatanId);

  const addonIds = memberships.map((row) => row.addon_id as string);
  const { data: addonItems, error: addonError } = await supabase
    .from('itinerary_addon_items')
    .select('*')
    .in('addon_id', addonIds)
    .order('tanggal')
    .order('jam_mulai')
    .order('urutan');
  if (addonError || !addonItems?.length) return appendAlUlaFallback(baseAgenda, tenantId, keberangkatanId);

  // Peserta AlUla tidak mengikuti agenda istirahat reguler pada jam yang sama.
  const agendaForAddonMember = baseAgenda.filter((item) => !(item.tanggal === '2026-08-22' && item.jam_mulai?.slice(0, 5) === '07:30' && item.judul === 'Istirahat di Hotel Madinah'));
  const merged = [...agendaForAddonMember, ...(addonItems as ItineraryAddonItemRow[]).map((item) => ({
    id: `addon-${item.id}`,
    tenant_id: tenantId,
    keberangkatan_id: keberangkatanId,
    tanggal: item.tanggal,
    jam_mulai: item.jam_mulai,
    judul: item.judul,
    deskripsi: item.deskripsi,
    lokasi: item.lokasi,
    urutan: item.urutan,
    created_at: item.created_at,
  }))];
  return merged.sort((a, b) => [a.tanggal, a.jam_mulai ?? '', a.urutan].join('|').localeCompare([b.tanggal, b.jam_mulai ?? '', b.urutan].join('|')));
}

function appendAlUlaFallback(baseAgenda: AgendaItemRow[], tenantId: string, keberangkatanId: string): AgendaItemRow[] {
  const agendaForAddonMember = baseAgenda.filter((item) => !(item.tanggal === '2026-08-22' && item.jam_mulai?.slice(0, 5) === '07:30' && item.judul === 'Istirahat di Hotel Madinah'));
  const items: AgendaItemRow[] = [
    { id: 'fallback-alula-city-tour', tenant_id: tenantId, keberangkatan_id: keberangkatanId, tanggal: '2026-08-22', jam_mulai: '07:30', judul: 'City Tour Al-Ula', deskripsi: 'Perjalanan menuju Al-Ula.', lokasi: 'Madinah - Al Ula', urutan: 1, created_at: '' },
    { id: 'fallback-alula-return', tenant_id: tenantId, keberangkatan_id: keberangkatanId, tanggal: '2026-08-22', jam_mulai: '15:00', judul: 'Kembali Ke Madinah dari Al-Ula', deskripsi: 'Perjalanan pulang ke Madinah.', lokasi: 'Al Ula - Hotel Madinah', urutan: 2, created_at: '' },
    { id: 'fallback-alula-kajian', tenant_id: tenantId, keberangkatan_id: keberangkatanId, tanggal: '2026-08-22', jam_mulai: '15:30', judul: 'Sholat Ashar, Maghrib, Isya & Kajian Bahasa Indonesia', deskripsi: 'Sholat berjamaah di Masjid Nabawi, kajian Bahasa Indonesia, makan malam, dan istirahat.', lokasi: 'Masjid Nabawi Madinah', urutan: 3, created_at: '' },
  ];
  return [...agendaForAddonMember, ...items].sort((a, b) => [a.tanggal, a.jam_mulai ?? '', a.urutan].join('|').localeCompare([b.tanggal, b.jam_mulai ?? '', b.urutan].join('|')));
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

// â”€â”€ Jamaah Care Center â”€â”€

export async function fetchHelpRequests(keberangkatanId: string): Promise<HelpRequestRow[]> {
  const { data, error } = await supabase
    .from('help_requests')
    .select('*')
    .eq('keberangkatan_id', keberangkatanId)
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as HelpRequestRow[];
}

export async function updateHelpRequestStatus(
  tenantId: string,
  requestId: string,
  status: HelpRequestStatus,
  handledBy?: string | null,
): Promise<HelpRequestRow> {
  const now = new Date().toISOString();
  const payload = status === 'ditangani'
    ? { status, handled_by: handledBy ?? null, handled_at: now, resolved_at: null }
    : status === 'selesai'
      ? { status, resolved_at: now }
      : { status, handled_by: null, handled_at: null, resolved_at: null };
  const { data, error } = await supabase
    .from('help_requests')
    .update(payload)
    .eq('id', requestId)
    .eq('tenant_id', tenantId)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as HelpRequestRow;
}

// â”€â”€ Perlengkapan Jamaah â”€â”€

export async function fetchEquipmentCatalog(keberangkatanId: string): Promise<EquipmentCatalogRow[]> {
  const { data, error } = await supabase.from('equipment_catalog').select('*').eq('keberangkatan_id', keberangkatanId).eq('active', true).order('sort_order');
  if (error) throw new Error(error.message);
  return (data ?? []) as EquipmentCatalogRow[];
}

export async function fetchEquipmentAssignments(keberangkatanId: string): Promise<EquipmentAssignmentRow[]> {
  const { data, error } = await supabase.from('equipment_assignments').select('*').eq('keberangkatan_id', keberangkatanId);
  if (error) throw new Error(error.message);
  return (data ?? []) as EquipmentAssignmentRow[];
}

export async function createEquipmentCatalogItem(tenantId: string, keberangkatanId: string, payload: { label: string; sort_order: number; category?: string }): Promise<EquipmentCatalogRow> {
  const { data, error } = await supabase.from('equipment_catalog').insert({ ...payload, tenant_id: tenantId, keberangkatan_id: keberangkatanId, category: payload.category ?? 'umum' }).select().single();
  if (error) throw new Error(error.message);
  return data as EquipmentCatalogRow;
}

export async function updateEquipmentAssignment(
  tenantId: string,
  keberangkatanId: string,
  jamaahId: string,
  equipmentId: string,
  status: EquipmentAssignmentStatus,
  updatedBy?: string | null,
): Promise<EquipmentAssignmentRow> {
  const payload = { tenant_id: tenantId, keberangkatan_id: keberangkatanId, jamaah_id: jamaahId, equipment_id: equipmentId, status, updated_by: updatedBy ?? null, received_at: status === 'sudah' ? new Date().toISOString() : null, updated_at: new Date().toISOString() };
  const { data, error } = await supabase.from('equipment_assignments').upsert(payload, { onConflict: 'jamaah_id,equipment_id' }).select().single();
  if (error) throw new Error(error.message);
  return data as EquipmentAssignmentRow;
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

export async function bulkCreateJamaahWithQuota(tenantId: string, keberangkatanId: string, items: object[]): Promise<{ inserted: number }> {
  const { data, error } = await supabase.rpc('jamaah_bulk_create_with_quota', { p_tenant_id: tenantId, p_keberangkatan_id: keberangkatanId, p_items: items });
  if (error) throw new Error(error.message);
  return { inserted: Number(data) };
}

export async function createJamaah(tenantId: string, keberangkatanId: string | null, payload: object): Promise<JamaahAccountRow> {
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

export async function createJamaahWithQuota(tenantId: string, keberangkatanId: string, payload: object): Promise<JamaahAccountRow> {
  const { data, error } = await supabase.rpc('jamaah_create_with_quota', {
    p_tenant_id: tenantId,
    p_keberangkatan_id: keberangkatanId,
    p_payload: payload,
  });
  if (error) throw new Error(error.message);
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

export async function fetchJamaahDocuments(tenantId: string, jamaahIds: string[]): Promise<JamaahDocumentRow[]> {
  if (jamaahIds.length === 0) return [];
  const { data, error } = await supabase.from('jamaah_documents').select('*').eq('tenant_id', tenantId).in('jamaah_id', jamaahIds);
  if (error) throw new Error(error.message);
  return (data ?? []) as JamaahDocumentRow[];
}

export async function updateJamaahDocument(tenantId: string, jamaahId: string, documentType: JamaahDocumentRow['document_type'], status: JamaahDocumentStatus): Promise<JamaahDocumentRow> {
  const { data, error } = await supabase.from('jamaah_documents').upsert({ tenant_id: tenantId, jamaah_id: jamaahId, document_type: documentType, status, updated_at: new Date().toISOString() }, { onConflict: 'jamaah_id,document_type' }).select().single();
  if (error) throw new Error(error.message);
  return data as JamaahDocumentRow;
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

export async function fetchTokenOrders(tenantId: string): Promise<TokenOrderRow[]> {
  const { data, error } = await supabase.from('token_orders').select('*').eq('tenant_id', tenantId).order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as TokenOrderRow[];
}

export async function fetchTenantQuotaBalance(tenantId: string): Promise<TenantQuotaBalance | null> {
  const { data, error } = await supabase.from('tenant_quota_balances').select('*').eq('tenant_id', tenantId).maybeSingle();
  if (error) throw new Error(error.message);
  return data as TenantQuotaBalance | null;
}

export async function createTokenOrder(tenantId: string, quantity: number, note: string): Promise<TokenOrderRow> {
  const { data, error } = await supabase.rpc('admin_token_order_create', { p_tenant_id: tenantId, p_quantity: quantity, p_note: note || null });
  if (error) throw new Error(error.message);
  return data as TokenOrderRow;
}

export async function markTokenOrderPaid(orderId: string): Promise<{ quantity: number; balance: number }> {
  const { data, error } = await supabase.rpc('admin_token_order_mark_paid', { p_order_id: orderId });
  if (error) throw new Error(error.message);
  const row = Array.isArray(data) ? data[0] : data;
  return row as { quantity: number; balance: number };
}

export async function cancelTokenOrder(orderId: string): Promise<void> {
  const { error } = await supabase.rpc('admin_token_order_cancel', { p_order_id: orderId });
  if (error) throw new Error(error.message);
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

// ── Jamaah Data (key-value sinkronisasi per-jamaah) ────────────

function getJamaahToken(): string | null {
  try {
    const raw = localStorage.getItem('umrahme.jamaah');
    if (!raw) return null;
    const j = JSON.parse(raw) as { accessToken?: string };
    return j?.accessToken ?? null;
  } catch {
    return null;
  }
}

export async function createHelpRequest(
  tenantId: string,
  nomorJamaah: string,
  payload: { kategori: HelpRequestCategory; pesan: string },
): Promise<HelpRequestRow> {
  const token = getJamaahToken();
  if (!token) throw new Error('Sesi tidak valid. Silakan login ulang.');
  const { data, error } = await supabase.rpc('help_request_create', {
    p_tenant_id: tenantId,
    p_nomor_jamaah: nomorJamaah,
    p_token: token,
    p_kategori: payload.kategori,
    p_pesan: payload.pesan.trim(),
  });
  if (error) throw new Error(error.message);
  return data as HelpRequestRow;
}

export async function getJamaahData<T = unknown>(
  tenantId: string,
  nomorJamaah: string,
  key: string,
): Promise<T | null> {
  const token = getJamaahToken();
  if (!token) return null;
  const { data, error } = await supabase.rpc('jamaah_data_get', {
    p_tenant_id: tenantId,
    p_nomor_jamaah: nomorJamaah,
    p_token: token,
    p_key: key,
  });
  if (error) throw new Error(error.message);
  return (data as T) ?? null;
}

export async function setJamaahData(
  tenantId: string,
  nomorJamaah: string,
  key: string,
  value: unknown,
): Promise<void> {
  const token = getJamaahToken();
  if (!token) return;
  const { error } = await supabase.rpc('jamaah_data_set', {
    p_tenant_id: tenantId,
    p_nomor_jamaah: nomorJamaah,
    p_token: token,
    p_key: key,
    p_value: value,
  });
  if (error) throw new Error(error.message);
}

export async function submitJamaahFeedback(
  tenantId: string, nomorJamaah: string, rating: number, komentar: string,
): Promise<void> {
  const token = getJamaahToken();
  if (!token) throw new Error('Sesi tidak valid. Silakan login ulang.');
  const { error } = await supabase.rpc('jamaah_feedback_submit', {
    p_tenant_id: tenantId, p_nomor_jamaah: nomorJamaah, p_token: token,
    p_rating: rating, p_komentar: komentar || null,
  });
  if (error) throw new Error(error.message);
}

// ── Jurnal Entries ─────────────────────────────────────────────

export type JurnalRow = {
  id: string;
  tenant_id: string;
  nomor_jamaah: string;
  tanggal: string;
  judul: string | null;
  isi: string;
  lokasi: string | null;
  created_at: string;
  updated_at: string;
};

export async function fetchJurnal(tenantId: string, nomorJamaah: string): Promise<JurnalRow[]> {
  const token = getJamaahToken();
  if (!token) return [];
  const { data, error } = await supabase.rpc('jurnal_list', {
    p_tenant_id: tenantId,
    p_nomor_jamaah: nomorJamaah,
    p_token: token,
  });
  if (error) throw new Error(error.message);
  return (data ?? []) as JurnalRow[];
}

export async function createJurnal(
  tenantId: string,
  nomorJamaah: string,
  payload: { tanggal: string; judul?: string | null; isi: string; lokasi?: string | null }
): Promise<JurnalRow> {
  const token = getJamaahToken();
  if (!token) throw new Error('Sesi tidak valid. Silakan login ulang.');
  const { data, error } = await supabase.rpc('jurnal_create', {
    p_tenant_id: tenantId,
    p_nomor_jamaah: nomorJamaah,
    p_token: token,
    p_tanggal: payload.tanggal,
    p_judul: payload.judul ?? null,
    p_isi: payload.isi,
    p_lokasi: payload.lokasi ?? null,
  });
  if (error) throw new Error(error.message);
  return data as JurnalRow;
}

export async function deleteJurnal(
  id: string,
  tenantId: string,
  nomorJamaah: string,
): Promise<void> {
  const token = getJamaahToken();
  if (!token) throw new Error('Sesi tidak valid. Silakan login ulang.');
  const { error } = await supabase.rpc('jurnal_delete', {
    p_id: id,
    p_tenant_id: tenantId,
    p_nomor_jamaah: nomorJamaah,
    p_token: token,
  });
  if (error) throw new Error(error.message);
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
