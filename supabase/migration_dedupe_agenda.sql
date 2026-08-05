-- Bersihkan agenda itinerary yang identik akibat impor berulang.
-- Simpan satu baris pertama pada setiap kombinasi aktivitas yang sama.
WITH ranked AS (
  SELECT
    id,
    row_number() OVER (
      PARTITION BY keberangkatan_id, tanggal, COALESCE(jam_mulai::text, ''), judul,
                   COALESCE(lokasi, ''), COALESCE(deskripsi, '')
      ORDER BY created_at, id
    ) AS position
  FROM public.agenda_items
)
DELETE FROM public.agenda_items
WHERE id IN (SELECT id FROM ranked WHERE position > 1);
