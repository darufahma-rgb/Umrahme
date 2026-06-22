import type { Jamaah } from '../types';
import { supabase } from '../lib/supabase';
import type { TenantRow } from '../lib/supabase';

export const KODE_DEMO = 'DEMO01';

export interface HasilValidasi {
  ok: boolean;
  jamaah?: Jamaah;
  tenant?: TenantRow;
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

  const jamaah: Jamaah = {
    nama: akun.nama,
    nomorJamaah: akun.nomor_jamaah,
    travel: tenant.nama_travel,
    kodeAktivasi: k,
    fase: akun.fase,
    rombongan: akun.rombongan ?? undefined,
    nomorBus: akun.nomor_bus ?? undefined,
    nomorKamar: akun.nomor_kamar ?? undefined,
    hotelMakkah: tenant.hotel_makkah ?? undefined,
    hotelMadinah: tenant.hotel_madinah ?? undefined,
    pembimbingNama: tenant.guide_name ?? undefined,
    pembimbingWhatsapp: tenant.guide_whatsapp ?? undefined,
  };

  return { ok: true, jamaah, tenant };
}

export const urutanFase: { id: Jamaah['fase']; label: string }[] = [
  { id: 'persiapan', label: 'Persiapan' },
  { id: 'tanah-suci', label: 'Di Tanah Suci' },
  { id: 'selesai', label: 'Selesai' },
];
