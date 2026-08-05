import type { Jamaah } from '../types';
import { supabase } from '../lib/supabase';
import type { TenantRow, KeberangkatanRow } from '../lib/supabase';

export const KODE_DEMO = 'DEMO01';

export function hitungFaseEfektif(
  tanggalKeberangkatan: string | null | undefined,
  tanggalKepulangan: string | null | undefined,
): 'persiapan' | 'tanah-suci' | 'selesai' {
  if (!tanggalKeberangkatan) return 'persiapan';

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const berangkat = new Date(tanggalKeberangkatan + 'T00:00:00');
  const pulang = tanggalKepulangan ? new Date(tanggalKepulangan + 'T00:00:00') : null;

  if (today < berangkat) return 'persiapan';
  if (pulang && today > pulang) return 'selesai';
  return 'tanah-suci';
}

/**
 * Fase jamaah mengikuti agenda itinerary batch. Tanggal batch hanya digunakan
 * saat itinerary memang belum tersedia.
 */
export function hitungFaseDariItinerary(
  tanggalAgenda: string[],
  tanggalKeberangkatan: string | null | undefined,
  tanggalKepulangan: string | null | undefined,
): 'persiapan' | 'tanah-suci' | 'selesai' {
  const tanggalValid = tanggalAgenda
    .filter((tanggal) => /^\d{4}-\d{2}-\d{2}$/.test(tanggal))
    .sort();

  return hitungFaseEfektif(
    tanggalValid[0] ?? tanggalKeberangkatan,
    tanggalValid[tanggalValid.length - 1] ?? tanggalKepulangan,
  );
}

export interface HasilValidasi {
  ok: boolean;
  jamaah?: Jamaah;
  tenant?: TenantRow;
  keberangkatan?: KeberangkatanRow | null;
  error?: string;
}

async function bangunHasil(
  tenant: TenantRow,
  akun: Record<string, any>,
  kb: KeberangkatanRow | null,
  kodeAktivasi: string,
): Promise<HasilValidasi> {
  const { data: agenda } = kb
    ? await supabase
      .from('agenda_items')
      .select('tanggal')
      .eq('keberangkatan_id', kb.id)
    : { data: [] as { tanggal: string }[] };

  const fase = hitungFaseDariItinerary(
    (agenda ?? []).map((item) => item.tanggal),
    kb?.tanggal_keberangkatan ?? tenant.tanggal_keberangkatan,
    kb?.tanggal_kepulangan ?? tenant.tanggal_kepulangan,
  );

  const jamaah: Jamaah = {
    accountId: akun.id ?? undefined,
    nama: akun.nama,
    nomorJamaah: akun.nomor_jamaah,
    travel: tenant.nama_travel,
    kodeAktivasi,
    fase,
    accessToken: akun.access_token ?? undefined,
    rombongan: akun.rombongan ?? undefined,
    nomorBus: akun.nomor_bus ?? undefined,
    nomorKamar: akun.nomor_kamar ?? undefined,
    nomorPaspor: akun.nomor_paspor ?? undefined,
    hotelMakkah: (akun.hotel_makkah ?? kb?.hotel_makkah ?? tenant.hotel_makkah) ?? undefined,
    hotelMadinah: (akun.hotel_madinah ?? kb?.hotel_madinah ?? tenant.hotel_madinah) ?? undefined,
    pembimbingNama: (kb?.guide_name ?? tenant.guide_name) ?? undefined,
    pembimbingWhatsapp: (kb?.guide_whatsapp ?? tenant.guide_whatsapp) ?? undefined,
  };

  return { ok: true, jamaah, tenant, keberangkatan: kb };
}

export async function validasiKode(kode: string, nama: string): Promise<HasilValidasi> {
  const k = kode.trim().toUpperCase();
  const n = nama.trim();
  if (!n) return { ok: false, error: 'Nama jamaah wajib diisi.' };
  if (!k) return { ok: false, error: 'Kode aktivasi wajib diisi.' };

  const { data, error } = await supabase.rpc('validate_jamaah_login', {
    p_code: k, p_slug: null, p_nama: n,
  });

  if (error) return { ok: false, error: 'Terjadi kesalahan. Coba lagi.' };
  if (!data?.ok) return { ok: false, error: data?.error ?? 'Login gagal.' };

  return await bangunHasil(
    data.tenant as TenantRow,
    data.jamaah,
    (data.keberangkatan ?? null) as KeberangkatanRow | null,
    k,
  );
}

export async function validasiSlug(slug: string, nama: string): Promise<HasilValidasi> {
  const n = nama.trim();
  if (!n) return { ok: false, error: 'Nama jamaah wajib diisi.' };

  const { data, error } = await supabase.rpc('validate_jamaah_login', {
    p_code: null, p_slug: slug.toLowerCase(), p_nama: n,
  });

  if (error) return { ok: false, error: 'Terjadi kesalahan. Coba lagi.' };
  if (!data?.ok) return { ok: false, error: data?.error ?? 'Login gagal.' };

  const tenant = data.tenant as TenantRow;
  return await bangunHasil(
    tenant,
    data.jamaah,
    (data.keberangkatan ?? null) as KeberangkatanRow | null,
    tenant.activation_code,
  );
}

export const urutanFase: { id: Jamaah['fase']; label: string }[] = [
  { id: 'persiapan', label: 'Persiapan' },
  { id: 'tanah-suci', label: 'Di Tanah Suci' },
  { id: 'selesai', label: 'Selesai' },
];
