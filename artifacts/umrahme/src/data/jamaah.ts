import type { Jamaah } from '../types';
import { supabase } from '../lib/supabase';
import type { TenantRow, KeberangkatanRow } from '../lib/supabase';
import { fetchKeberangkatanById } from '../lib/supabase';

export const KODE_DEMO = 'DEMO01';

/**
 * Hitung fase efektif: fase_override (manual admin) > otomatis dari tanggal > fallback 'persiapan'
 */
export function hitungFaseEfektif(
  faseOverride: string | null | undefined,
  tanggalKeberangkatan: string | null | undefined,
  tanggalKepulangan: string | null | undefined,
): 'persiapan' | 'tanah-suci' | 'selesai' {
  if (faseOverride === 'persiapan' || faseOverride === 'tanah-suci' || faseOverride === 'selesai') {
    return faseOverride;
  }
  if (!tanggalKeberangkatan) return 'persiapan';

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const berangkat = new Date(tanggalKeberangkatan + 'T00:00:00');
  const pulang = tanggalKepulangan ? new Date(tanggalKepulangan + 'T00:00:00') : null;

  if (today < berangkat) return 'persiapan';
  if (pulang && today > pulang) return 'selesai';
  return 'tanah-suci';
}

export interface HasilValidasi {
  ok: boolean;
  jamaah?: Jamaah;
  tenant?: TenantRow;
  keberangkatan?: KeberangkatanRow | null;
  error?: string;
}

export async function validasiKode(kode: string, nama: string): Promise<HasilValidasi> {
  const k = kode.trim().toUpperCase();
  const n = nama.trim();

  if (!n) return { ok: false, error: 'Nama jamaah wajib diisi.' };
  if (!k) return { ok: false, error: 'Kode aktivasi wajib diisi.' };

  const { data: tenant, error: tenantErr } = await supabase
    .from('tenants')
    .select('*')
    .eq('activation_code', k)
    .maybeSingle();

  if (tenantErr || !tenant) {
    return { ok: false, error: 'Kode tidak ditemukan, hubungi travel Anda.' };
  }

  const { data: akun, error: akunErr } = await supabase
    .from('jamaah_accounts')
    .select('*')
    .eq('tenant_id', tenant.id)
    .ilike('nama', n)
    .maybeSingle();

  if (akunErr || !akun) {
    return { ok: false, error: 'Nama tidak ditemukan. Pastikan nama sesuai yang didaftarkan travel Anda.' };
  }

  let kb: KeberangkatanRow | null = null;
  if (akun.keberangkatan_id) {
    kb = await fetchKeberangkatanById(akun.keberangkatan_id).catch(() => null);
  }

  const fase = hitungFaseEfektif(
    akun.fase_override ?? kb?.fase_override ?? null,
    kb?.tanggal_keberangkatan ?? tenant.tanggal_keberangkatan,
    kb?.tanggal_kepulangan ?? tenant.tanggal_kepulangan,
  );

  const jamaah: Jamaah = {
    nama: akun.nama,
    nomorJamaah: akun.nomor_jamaah,
    travel: tenant.nama_travel,
    kodeAktivasi: k,
    fase,
    accessToken: akun.access_token ?? undefined,
    rombongan: akun.rombongan ?? undefined,
    nomorBus: akun.nomor_bus ?? undefined,
    nomorKamar: akun.nomor_kamar ?? undefined,
    nomorPaspor: akun.nomor_paspor ?? undefined,
    hotelMakkah: (kb?.hotel_makkah ?? tenant.hotel_makkah) ?? undefined,
    hotelMadinah: (kb?.hotel_madinah ?? tenant.hotel_madinah) ?? undefined,
    pembimbingNama: (kb?.guide_name ?? tenant.guide_name) ?? undefined,
    pembimbingWhatsapp: (kb?.guide_whatsapp ?? tenant.guide_whatsapp) ?? undefined,
  };

  return { ok: true, jamaah, tenant, keberangkatan: kb };
}

export async function validasiSlug(slug: string, nama: string): Promise<HasilValidasi> {
  const n = nama.trim();
  if (!n) return { ok: false, error: 'Nama jamaah wajib diisi.' };

  const { data: tenant, error: tenantErr } = await supabase
    .from('tenants')
    .select('*')
    .eq('slug', slug.toLowerCase())
    .maybeSingle();

  if (tenantErr || !tenant) {
    return { ok: false, error: 'Travel tidak ditemukan.' };
  }

  const { data: akun, error: akunErr } = await supabase
    .from('jamaah_accounts')
    .select('*')
    .eq('tenant_id', tenant.id)
    .ilike('nama', n)
    .maybeSingle();

  if (akunErr || !akun) {
    return { ok: false, error: 'Nama tidak ditemukan. Pastikan sesuai yang didaftarkan travel Anda.' };
  }

  let kb: KeberangkatanRow | null = null;
  if (akun.keberangkatan_id) {
    kb = await fetchKeberangkatanById(akun.keberangkatan_id).catch(() => null);
  }

  const fase = hitungFaseEfektif(
    akun.fase_override ?? kb?.fase_override ?? null,
    kb?.tanggal_keberangkatan ?? tenant.tanggal_keberangkatan,
    kb?.tanggal_kepulangan ?? tenant.tanggal_kepulangan,
  );

  const jamaah: Jamaah = {
    nama: akun.nama,
    nomorJamaah: akun.nomor_jamaah,
    travel: tenant.nama_travel,
    kodeAktivasi: tenant.activation_code,
    fase,
    accessToken: akun.access_token ?? undefined,
    rombongan: akun.rombongan ?? undefined,
    nomorBus: akun.nomor_bus ?? undefined,
    nomorKamar: akun.nomor_kamar ?? undefined,
    nomorPaspor: akun.nomor_paspor ?? undefined,
    hotelMakkah: (kb?.hotel_makkah ?? tenant.hotel_makkah) ?? undefined,
    hotelMadinah: (kb?.hotel_madinah ?? tenant.hotel_madinah) ?? undefined,
    pembimbingNama: (kb?.guide_name ?? tenant.guide_name) ?? undefined,
    pembimbingWhatsapp: (kb?.guide_whatsapp ?? tenant.guide_whatsapp) ?? undefined,
  };

  return { ok: true, jamaah, tenant, keberangkatan: kb };
}

export const urutanFase: { id: Jamaah['fase']; label: string }[] = [
  { id: 'persiapan', label: 'Persiapan' },
  { id: 'tanah-suci', label: 'Di Tanah Suci' },
  { id: 'selesai', label: 'Selesai' },
];
