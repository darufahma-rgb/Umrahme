CREATE TABLE IF NOT EXISTS public.itinerary_addons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  keberangkatan_id UUID NOT NULL REFERENCES public.keberangkatan(id) ON DELETE CASCADE,
  nama TEXT NOT NULL,
  deskripsi TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.itinerary_addon_jamaah (
  addon_id UUID NOT NULL REFERENCES public.itinerary_addons(id) ON DELETE CASCADE,
  jamaah_id UUID NOT NULL REFERENCES public.jamaah_accounts(id) ON DELETE CASCADE,
  PRIMARY KEY (addon_id, jamaah_id)
);

CREATE TABLE IF NOT EXISTS public.itinerary_addon_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  addon_id UUID NOT NULL REFERENCES public.itinerary_addons(id) ON DELETE CASCADE,
  tanggal DATE NOT NULL,
  jam_mulai TIME,
  judul TEXT NOT NULL,
  deskripsi TEXT,
  lokasi TEXT,
  urutan INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS itinerary_addon_items_addon_date_idx ON public.itinerary_addon_items(addon_id, tanggal, jam_mulai);
CREATE INDEX IF NOT EXISTS itinerary_addon_jamaah_jamaah_idx ON public.itinerary_addon_jamaah(jamaah_id);

-- Seed Dreammecca: 12 jamaah dengan hotel Madinah dan trip AlUla berbeda.
DO $$
DECLARE v_tenant UUID; v_batch UUID; v_addon UUID;
BEGIN
  SELECT id INTO v_tenant FROM public.tenants WHERE lower(nama_travel) LIKE '%dreammecca%' LIMIT 1;
  SELECT id INTO v_batch FROM public.keberangkatan WHERE tenant_id = v_tenant AND tanggal_keberangkatan >= DATE '2026-08-01' AND tanggal_keberangkatan < DATE '2026-09-01' ORDER BY tanggal_keberangkatan LIMIT 1;
  IF v_tenant IS NULL OR v_batch IS NULL THEN RAISE EXCEPTION 'Batch Dreammecca Agustus 2026 tidak ditemukan'; END IF;

  UPDATE public.jamaah_accounts
  SET hotel_makkah = 'Pullman Zamzam', hotel_madinah = 'Worth Peninsula'
  WHERE tenant_id = v_tenant AND keberangkatan_id = v_batch
    AND regexp_replace(upper(nama), '[^A-Z0-9]+', '', 'g') IN ('SHEILLASYLVIA','ROMLIUDINSUHENDI','EDIHUDIN','LILISUDINMISNA','LENIHERLINA','NANANGSUHERMAN','WINAKARLINA','NAUFALFADHILMUHAMAD','CORINNAFITRIANASITIROHIDA','MRHESTURAMADHAN','MRHEZAPAHLEVI','ERIKASHAQUEENAMECCA');

  -- AlUla bukan itinerary rombongan utama. Hapus hanya kegiatan yang memang
  -- terkait AlUla dari agenda batch, kemudian tampilkan via addon.
  DELETE FROM public.agenda_items
  WHERE keberangkatan_id = v_batch
    AND (
      judul ILIKE '%al ula%'
      OR judul ILIKE '%al-ula%'
      OR judul ILIKE '%alula%'
      OR lokasi ILIKE '%al ula%'
      OR lokasi ILIKE '%al-ula%'
      OR lokasi ILIKE '%alula%'
      OR deskripsi ILIKE '%al ula%'
      OR deskripsi ILIKE '%al-ula%'
      OR deskripsi ILIKE '%alula%'
    );

  SELECT id INTO v_addon FROM public.itinerary_addons WHERE keberangkatan_id = v_batch AND nama = 'Trip AlUla' LIMIT 1;
  IF v_addon IS NULL THEN
    INSERT INTO public.itinerary_addons (tenant_id, keberangkatan_id, nama, deskripsi) VALUES (v_tenant, v_batch, 'Trip AlUla', 'Itinerary khusus jamaah peserta AlUla') RETURNING id INTO v_addon;
  END IF;

  DELETE FROM public.itinerary_addon_items WHERE addon_id = v_addon;
  INSERT INTO public.itinerary_addon_items (addon_id, tanggal, jam_mulai, judul, deskripsi, lokasi, urutan) VALUES
    (v_addon,'2026-08-22','07:30','City Tour Al-Ula','Perjalanan menuju Al-Ula.','Madinah - Al Ula',1),
    (v_addon,'2026-08-22','15:00','Kembali Ke Madinah dari Al-Ula','Perjalanan pulang ke Madinah.','Al Ula - Hotel Madinah',2),
    (v_addon,'2026-08-22','15:30','Sholat Ashar, Maghrib, Isya & Kajian Bahasa Indonesia','Sholat berjamaah di Masjid Nabawi, kajian Bahasa Indonesia, makan malam, dan istirahat.','Masjid Nabawi Madinah',3);

  DELETE FROM public.itinerary_addon_jamaah WHERE addon_id = v_addon;
  INSERT INTO public.itinerary_addon_jamaah (addon_id, jamaah_id)
  SELECT v_addon, id FROM public.jamaah_accounts
  WHERE tenant_id = v_tenant AND keberangkatan_id = v_batch
    AND regexp_replace(upper(nama), '[^A-Z0-9]+', '', 'g') IN ('SHEILLASYLVIA','ROMLIUDINSUHENDI','EDIHUDIN','LILISUDINMISNA','LENIHERLINA','NANANGSUHERMAN','WINAKARLINA','NAUFALFADHILMUHAMAD','CORINNAFITRIANASITIROHIDA','MRHESTURAMADHAN','MRHEZAPAHLEVI','ERIKASHAQUEENAMECCA')
  ON CONFLICT DO NOTHING;
END $$;
