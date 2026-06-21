import type { Jamaah } from '../types';
import { activeTenant } from '../config/tenants';

// =============================================================
// MOCK AUTH — sistem kode aktivasi jamaah (UI only, belum backend)
// -------------------------------------------------------------
// Validasi dummy: kode "DEMO01" + nama apa pun = sukses login.
// Kode lain → error "Kode tidak ditemukan, hubungi travel Anda".
// TODO(api): ganti validasiKode() dengan POST /auth/activate.
// =============================================================

/** Nama travel dari tenant aktif — di-set via VITE_TENANT_ID saat build. */
export const NAMA_TRAVEL = activeTenant.namaTravel;

export const KODE_DEMO = 'DEMO01';

export interface HasilValidasi {
  ok: boolean;
  jamaah?: Jamaah;
  error?: string;
}

let nomorUrut = 142; // dummy, untuk membentuk nomor jamaah unik

export function validasiKode(kode: string, nama: string): HasilValidasi {
  const k = kode.trim().toUpperCase();
  const n = nama.trim();

  if (!n) {
    return { ok: false, error: 'Nama jamaah wajib diisi.' };
  }
  if (k !== KODE_DEMO) {
    return { ok: false, error: 'Kode tidak ditemukan, hubungi travel Anda.' };
  }

  const tahun = new Date().getFullYear();
  const jamaah: Jamaah = {
    nama: n,
    nomorJamaah: `UMR-${tahun}-${String(nomorUrut++).padStart(4, '0')}`,
    travel: NAMA_TRAVEL,
    kodeAktivasi: k,
    fase: 'persiapan',
  };
  return { ok: true, jamaah };
}

/** Urutan fase untuk indikator visual. */
export const urutanFase: { id: Jamaah['fase']; label: string }[] = [
  { id: 'persiapan', label: 'Persiapan' },
  { id: 'tanah-suci', label: 'Di Tanah Suci' },
  { id: 'selesai', label: 'Selesai' },
];
