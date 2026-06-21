# Menambah Tenant Baru

1. Duplikat `barakah-mulia.ts` → beri nama sesuai ID tenant (mis. `nama-travel.ts`).
2. Isi semua field: `id`, `namaTravel`, `theme`, `logoPath`, `pageTitle`.
3. Daftarkan di `index.ts` — import file baru, tambahkan ke objek `registry`.
4. Upload logo SVG ke `public/logos/<id-tenant>.svg`.
5. Set environment variable `VITE_TENANT_ID=<id-tenant>` di platform deploy.
6. Build & deploy — satu build = satu tenant.
