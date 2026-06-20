---
name: Doa data integration
description: Skema data doa lengkap (45 doa, 9 kategori) — perubahan ID, exports, dan catatan konsistensi lintas file.
---

## Kategori baru (9)
`persiapan | madinah | ihram | makkah | tawaf | sai | tahallul | wada | harian`

Sebelumnya 7 kategori (`ziarah` diganti `madinah` + `makkah`; ditambah `wada`).

## File yang diubah
- `src/types/index.ts` — `KategoriDoa` diperbarui ke 9 kategori
- `src/data/doa.ts` — diganti penuh; source of truth dari PDF Tunas Tours
- `src/data/ritualSteps.ts` — 4 `doaTerkaitId` diupdate ke ID baru

## Pemetaan ID lama → baru (ritualSteps)
| Lama | Baru |
|------|------|
| `niat-ihram-umrah` | `ihram-niat-umrah` |
| `talbiyah` | `ihram-talbiyah` |
| `doa-masuk-masjidil-haram` | `makkah-masuk-masjidil-haram` |
| `doa-melihat-kabah` | `makkah-melihat-kabah` |

## Exports dari doa.ts
- `daftarDoa` — alias ke `semuaDoa` (backward-compat untuk Doa.tsx)
- `kategoriDoaMeta` — array `{id, judul, deskripsi}` (backward-compat)
- `doaById(id)`, `doaByKategori(kat)`, `cariDoa(q)`, `kategoriTersedia()`
- `KATEGORI_LABEL` — Record<KategoriDoa, string>

## Flag perluVerifikasi
3 doa ditandai `perluVerifikasi: true`:
- `makkah-melihat-kabah` (sumber daring, sanad diperselisihkan)
- `makkah-minum-zamzam` (sumber daring)
- `harian-doa-multazam` (sumber daring)

**Why:** UI DoaDetail sudah menampilkan peringatan gold untuk entri ini.
Jangan hapus flag tanpa verifikasi manusia (ustadz/pembimbing).
