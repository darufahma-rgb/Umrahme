import type { Jamaah } from '../types';
import { supabase } from '../lib/supabase';
import type { TenantRow } from '../lib/supabase';

// =============================================================
// AUTH — validasi kode aktivasi jamaah via tabel `tenants` di Supabase.
// Kode diperiksa ke database setiap kali jamaah mencoba login.
// =============================================================

export const KODE_DEMO = 'DEMO01';

export interface HasilValidasi {
  ok: boolean;
  jamaah?: Jamaah;
  tenant?: TenantRow;
  error?: string;
}

let nomorUrut = 142;

export async function validasiKode(kode: string, nama: string): Promise<HasilValidasi> {
  const k = kode.trim().toUpperCase();
  const n = nama.trim();

  if (!n) {
    return { ok: false, error: 'Nama jamaah wajib diisi.' };
  }

  const { data, error } = await supabase
    .from('tenants')
    .select('*')
    .eq('activation_code', k)
    .maybeSingle();

  if (error || !data) {
    return { ok: false, error: 'Kode tidak ditemukan, hubungi travel Anda.' };
  }

  const tahun = new Date().getFullYear();
  const jamaah: Jamaah = {
    nama: n,
    nomorJamaah: `UMR-${tahun}-${String(nomorUrut++).padStart(4, '0')}`,
    travel: data.nama_travel,
    kodeAktivasi: k,
    fase: 'persiapan',
  };

  return { ok: true, jamaah, tenant: data };
}

/** Urutan fase untuk indikator visual. */
export const urutanFase: { id: Jamaah['fase']; label: string }[] = [
  { id: 'persiapan', label: 'Persiapan' },
  { id: 'tanah-suci', label: 'Di Tanah Suci' },
  { id: 'selesai', label: 'Selesai' },
];
