# Umrahme

Aplikasi pendamping digital untuk jamaah umrah (B2B, white-label). MVP frontend —
seluruh data memakai mock/dummy di `src/data/*`, siap disambungkan ke API nyata.

**Stack:** React 18 · Vite 5 · TypeScript · Tailwind CSS 3 · React Router 6.

## Menjalankan

```bash
npm install
npm run dev          # http://localhost:5173
```

## Build & Deploy (Vercel)

```bash
npm run build        # output ke /dist
npm run typecheck    # opsional, cek tipe (tsc --noEmit)
```

Deploy ke Vercel: import repo ini, Vercel auto-deteksi Vite.
`vercel.json` sudah mengatur SPA rewrite agar deep-link (mis. `/doa/talbiyah`) tidak 404.

## Login demo

Kode aktivasi **`DEMO01`** + nama apa pun → sukses. Kode lain → error.

## Struktur

```
src/
  data/          # SEMUA konten (doa, lokasi, checklist, panduan, ihram, jamaah)
  types/         # interface TypeScript — kontrak data untuk API nanti
  context/       # AuthContext (state jamaah, persist ke localStorage)
  components/    # MihrabCard (signature), BottomNav, PageHeader, dll
  pages/         # 1 file per halaman, dipetakan ke 5 slot nav di App.tsx
```

## Navigasi (5 slot)

`Beranda · Panduan · [Ibadah] · Doa · Profil` — slot **Ibadah** (tengah) elevated,
pintu cepat ke Counter Tawaf. Peta Lokasi diakses dari Beranda & Panduan (bukan slot nav).

## Menyambung ke API

Ganti isi `src/data/*.ts` dengan hasil `fetch` yang mengembalikan bentuk sama
(lihat `src/types/index.ts`). Komponen UI tidak perlu diubah. Cari penanda
`TODO(api)` dan `TODO(maps)` untuk titik integrasi.

## Catatan konten

Field bertanda `perluVerifikasi: true` dan komentar `// TODO: verifikasi konten oleh ustadz`
**wajib direview ulama** sebelum production. Konten doa yang belum pasti sengaja
dikosongkan, bukan dikarang.
