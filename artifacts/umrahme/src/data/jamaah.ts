import type { Jamaah } from '../types';
import { jamaahLogin, type TenantRow, type JamaahAccountRow } from '../lib/api';

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

  try {
    const result = await jamaahLogin(k, n);
    const akun: JamaahAccountRow = result.jamaah;
    const tenant: TenantRow = result.tenant;

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
  } catch (err: unknown) {
    return { ok: false, error: err instanceof Error ? err.message : 'Terjadi kesalahan.' };
  }
}

export const urutanFase: { id: Jamaah['fase']; label: string }[] = [
  { id: 'persiapan', label: 'Persiapan' },
  { id: 'tanah-suci', label: 'Di Tanah Suci' },
  { id: 'selesai', label: 'Selesai' },
];
