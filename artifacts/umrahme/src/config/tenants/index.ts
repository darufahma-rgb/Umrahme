import type { TenantConfig } from '../tenant.types';
import defaultTenant from './default';
import barakahMulia from './barakah-mulia';
import contohHijau from './contoh-hijau';

// =============================================================
// TENANT REGISTRY — daftarkan semua tenant di sini
// -------------------------------------------------------------
// Key = VITE_TENANT_ID yang diset saat build.
// Untuk menambah tenant baru: buat file ts-nya, import di sini,
// dan tambahkan entri di registry ini.
// =============================================================

const registry: Record<string, TenantConfig> = {
  default: defaultTenant,
  'barakah-mulia': barakahMulia,
  'contoh-hijau': contohHijau,
};

const tenantId = import.meta.env.VITE_TENANT_ID as string | undefined;

function resolveTenant(): TenantConfig {
  if (!tenantId) {
    if (import.meta.env.DEV) {
      console.warn('[tenant] VITE_TENANT_ID tidak diset — menggunakan tenant "default".');
    }
    return defaultTenant;
  }

  const found = registry[tenantId];
  if (!found) {
    console.warn(
      `[tenant] ID "${tenantId}" tidak ditemukan di registry — fallback ke tenant "default".`,
    );
    return defaultTenant;
  }

  return found;
}

/** Tenant aktif untuk build ini — ditentukan oleh VITE_TENANT_ID saat build. */
export const activeTenant: TenantConfig = resolveTenant();

export default registry;
