-- ==============================================================================
-- BATCH KEBERANGKATAN 02 NOVEMBER 2026 - DREAMMECCA TOUR & TRAVEL
-- Program: Umroh Eksklusif 9D (02 Nov 2026 - 10 Nov 2026), Makkah 4 Malam / Madinah 3 Malam
-- Maskapai: Garuda Indonesia (GA 980 CGK-JED 12:05-17:40 / GA 969 MED-CGK 17:05-06:35+1)
-- Hotels: Makkah (Pullman Zamzam), Madinah (Al-Ansr Golden Tulip)
-- Meeting Point: Terminal 2F Bandara Internasional Soekarno-Hatta
-- Petugas:
--   - Tour Leader: Ust. Hudi Supriyadi Daeng Pabeta, Lc. (+62 812-8537-8788)
--   - Muthowwif: Ust. Sujani Vona Reza, Lc. (+62 821-2891-7313)
--
-- Petunjuk:
-- Salin dan jalankan seluruh script ini di Supabase SQL Editor.
-- Script ini bersifat idempoten (aman dijalankan berulang kali tanpa duplikasi data).
-- Akun dicocokkan berdasarkan nama (unik per tenant). Akun TL & Muthowwif hanya
-- dipindah ke batch ini jika batch mereka sebelumnya sudah selesai; jika masih
-- berjalan (mis. batch 18 Oktober), akun dilewati -> jalankan ulang script ini
-- setelah rombongan sebelumnya pulang.
-- ==============================================================================

DO $$
DECLARE
  v_tenant_id UUID;
  v_batch_id UUID := '5c0aecaa-5f2a-46bd-a59f-53048aed0489'::UUID;
BEGIN
  -- 1. Pastikan Tenant Dreammecca ada
  SELECT id INTO v_tenant_id
  FROM public.tenants
  WHERE lower(slug) = 'dreammecca'
  LIMIT 1;

  IF v_tenant_id IS NULL THEN
    RAISE EXCEPTION 'Tenant Dreammecca tidak ditemukan!';
  END IF;

  -- 2. Upsert Data Batch Keberangkatan November 2026
  IF EXISTS (SELECT 1 FROM public.keberangkatan WHERE id = v_batch_id) THEN
    UPDATE public.keberangkatan
    SET
      tenant_id = v_tenant_id,
      nama_batch = 'Umroh Eksklusif 9D - 02 November 2026',
      tanggal_keberangkatan = '2026-11-02',
      tanggal_kepulangan = '2026-11-09',
      hotel_makkah = 'Pullman Zamzam',
      hotel_madinah = 'Al-Ansr Golden Tulip',
      meeting_point = 'Terminal 2F Bandara Internasional Soekarno-Hatta',
      guide_name = 'Ust. Sujani Vona Reza, Lc.',
      guide_whatsapp = '6282128917313',
      tour_leader_name = 'Ust. Hudi Supriyadi Daeng Pabeta, Lc.',
      tour_leader_whatsapp = '6281285378788',
      emergency_note = 'Jika tersesat atau memerlukan bantuan mendesak, tetap tenang dan hubungi Ust. Sujani Vona Reza, Lc. (+62 821-2891-7313) atau Ust. Hudi Supriyadi Daeng Pabeta, Lc. (+62 812-8537-8788). Tunjukkan Kartu Jamaah Digital kepada petugas masjid atau polisi terdekat.',
      aktif = true
    WHERE id = v_batch_id;
  ELSE
    INSERT INTO public.keberangkatan (
      id, tenant_id, nama_batch, tanggal_keberangkatan, tanggal_kepulangan,
      hotel_makkah, hotel_madinah, meeting_point,
      guide_name, guide_whatsapp, tour_leader_name, tour_leader_whatsapp,
      emergency_note, aktif
    ) VALUES (
      v_batch_id, v_tenant_id, 'Umroh Eksklusif 9D - 02 November 2026', '2026-11-02', '2026-11-09',
      'Pullman Zamzam', 'Al-Ansr Golden Tulip', 'Terminal 2F Bandara Internasional Soekarno-Hatta',
      'Ust. Sujani Vona Reza, Lc.', '6282128917313',
      'Ust. Hudi Supriyadi Daeng Pabeta, Lc.', '6281285378788',
      'Jika tersesat atau memerlukan bantuan mendesak, tetap tenang dan hubungi Ust. Sujani Vona Reza, Lc. (+62 821-2891-7313) atau Ust. Hudi Supriyadi Daeng Pabeta, Lc. (+62 812-8537-8788). Tunjukkan Kartu Jamaah Digital kepada petugas masjid atau polisi terdekat.',
      true
    );
  END IF;

  -- 3. Upsert 23 Jamaah (Title Case) + 2 Petugas

  -- Jamaah #1: Jonaidi Salim Wahab (Pullman Zamzam - Al-Ansr Golden Tulip)
  IF EXISTS (SELECT 1 FROM public.jamaah_accounts WHERE tenant_id = v_tenant_id AND lower(trim(nama)) = lower('Jonaidi Salim Wahab')) THEN
    UPDATE public.jamaah_accounts
    SET
      keberangkatan_id = v_batch_id,
      nama = 'Jonaidi Salim Wahab',
      nomor_jamaah = 'DM-NOV-001',
      rombongan = 'Rombongan Umroh Eksklusif 02 November 2026',
      hotel_makkah = 'Pullman Zamzam',
      hotel_madinah = 'Al-Ansr Golden Tulip',
      fase = 'persiapan'
    WHERE tenant_id = v_tenant_id AND lower(trim(nama)) = lower('Jonaidi Salim Wahab');
  ELSE
    INSERT INTO public.jamaah_accounts (
      tenant_id, keberangkatan_id, nama, nomor_jamaah, rombongan,
      hotel_makkah, hotel_madinah, fase, access_token
    ) VALUES (
      v_tenant_id, v_batch_id, 'Jonaidi Salim Wahab', 'DM-NOV-001',
      'Rombongan Umroh Eksklusif 02 November 2026',
      'Pullman Zamzam', 'Al-Ansr Golden Tulip',
      'persiapan', gen_random_uuid()
    );
  END IF;

  -- Jamaah #2: Nurhayati Adry (Pullman Zamzam - Al-Ansr Golden Tulip)
  IF EXISTS (SELECT 1 FROM public.jamaah_accounts WHERE tenant_id = v_tenant_id AND lower(trim(nama)) = lower('Nurhayati Adry')) THEN
    UPDATE public.jamaah_accounts
    SET
      keberangkatan_id = v_batch_id,
      nama = 'Nurhayati Adry',
      nomor_jamaah = 'DM-NOV-002',
      rombongan = 'Rombongan Umroh Eksklusif 02 November 2026',
      hotel_makkah = 'Pullman Zamzam',
      hotel_madinah = 'Al-Ansr Golden Tulip',
      fase = 'persiapan'
    WHERE tenant_id = v_tenant_id AND lower(trim(nama)) = lower('Nurhayati Adry');
  ELSE
    INSERT INTO public.jamaah_accounts (
      tenant_id, keberangkatan_id, nama, nomor_jamaah, rombongan,
      hotel_makkah, hotel_madinah, fase, access_token
    ) VALUES (
      v_tenant_id, v_batch_id, 'Nurhayati Adry', 'DM-NOV-002',
      'Rombongan Umroh Eksklusif 02 November 2026',
      'Pullman Zamzam', 'Al-Ansr Golden Tulip',
      'persiapan', gen_random_uuid()
    );
  END IF;

  -- Jamaah #3: Tiara Gumilang Ramadhani (Pullman Zamzam - Al-Ansr Golden Tulip)
  IF EXISTS (SELECT 1 FROM public.jamaah_accounts WHERE tenant_id = v_tenant_id AND lower(trim(nama)) = lower('Tiara Gumilang Ramadhani')) THEN
    UPDATE public.jamaah_accounts
    SET
      keberangkatan_id = v_batch_id,
      nama = 'Tiara Gumilang Ramadhani',
      nomor_jamaah = 'DM-NOV-003',
      rombongan = 'Rombongan Umroh Eksklusif 02 November 2026',
      hotel_makkah = 'Pullman Zamzam',
      hotel_madinah = 'Al-Ansr Golden Tulip',
      fase = 'persiapan'
    WHERE tenant_id = v_tenant_id AND lower(trim(nama)) = lower('Tiara Gumilang Ramadhani');
  ELSE
    INSERT INTO public.jamaah_accounts (
      tenant_id, keberangkatan_id, nama, nomor_jamaah, rombongan,
      hotel_makkah, hotel_madinah, fase, access_token
    ) VALUES (
      v_tenant_id, v_batch_id, 'Tiara Gumilang Ramadhani', 'DM-NOV-003',
      'Rombongan Umroh Eksklusif 02 November 2026',
      'Pullman Zamzam', 'Al-Ansr Golden Tulip',
      'persiapan', gen_random_uuid()
    );
  END IF;

  -- Jamaah #4: Nida Nafila Attamimi (Pullman Zamzam - Al-Ansr Golden Tulip)
  IF EXISTS (SELECT 1 FROM public.jamaah_accounts WHERE tenant_id = v_tenant_id AND lower(trim(nama)) = lower('Nida Nafila Attamimi')) THEN
    UPDATE public.jamaah_accounts
    SET
      keberangkatan_id = v_batch_id,
      nama = 'Nida Nafila Attamimi',
      nomor_jamaah = 'DM-NOV-004',
      rombongan = 'Rombongan Umroh Eksklusif 02 November 2026',
      hotel_makkah = 'Pullman Zamzam',
      hotel_madinah = 'Al-Ansr Golden Tulip',
      fase = 'persiapan'
    WHERE tenant_id = v_tenant_id AND lower(trim(nama)) = lower('Nida Nafila Attamimi');
  ELSE
    INSERT INTO public.jamaah_accounts (
      tenant_id, keberangkatan_id, nama, nomor_jamaah, rombongan,
      hotel_makkah, hotel_madinah, fase, access_token
    ) VALUES (
      v_tenant_id, v_batch_id, 'Nida Nafila Attamimi', 'DM-NOV-004',
      'Rombongan Umroh Eksklusif 02 November 2026',
      'Pullman Zamzam', 'Al-Ansr Golden Tulip',
      'persiapan', gen_random_uuid()
    );
  END IF;

  -- Jamaah #5: Fauzi Attamimi (Pullman Zamzam - Al-Ansr Golden Tulip)
  IF EXISTS (SELECT 1 FROM public.jamaah_accounts WHERE tenant_id = v_tenant_id AND lower(trim(nama)) = lower('Fauzi Attamimi')) THEN
    UPDATE public.jamaah_accounts
    SET
      keberangkatan_id = v_batch_id,
      nama = 'Fauzi Attamimi',
      nomor_jamaah = 'DM-NOV-005',
      rombongan = 'Rombongan Umroh Eksklusif 02 November 2026',
      hotel_makkah = 'Pullman Zamzam',
      hotel_madinah = 'Al-Ansr Golden Tulip',
      fase = 'persiapan'
    WHERE tenant_id = v_tenant_id AND lower(trim(nama)) = lower('Fauzi Attamimi');
  ELSE
    INSERT INTO public.jamaah_accounts (
      tenant_id, keberangkatan_id, nama, nomor_jamaah, rombongan,
      hotel_makkah, hotel_madinah, fase, access_token
    ) VALUES (
      v_tenant_id, v_batch_id, 'Fauzi Attamimi', 'DM-NOV-005',
      'Rombongan Umroh Eksklusif 02 November 2026',
      'Pullman Zamzam', 'Al-Ansr Golden Tulip',
      'persiapan', gen_random_uuid()
    );
  END IF;

  -- Jamaah #6: Fauzia Assagaf (Pullman Zamzam - Al-Ansr Golden Tulip)
  IF EXISTS (SELECT 1 FROM public.jamaah_accounts WHERE tenant_id = v_tenant_id AND lower(trim(nama)) = lower('Fauzia Assagaf')) THEN
    UPDATE public.jamaah_accounts
    SET
      keberangkatan_id = v_batch_id,
      nama = 'Fauzia Assagaf',
      nomor_jamaah = 'DM-NOV-006',
      rombongan = 'Rombongan Umroh Eksklusif 02 November 2026',
      hotel_makkah = 'Pullman Zamzam',
      hotel_madinah = 'Al-Ansr Golden Tulip',
      fase = 'persiapan'
    WHERE tenant_id = v_tenant_id AND lower(trim(nama)) = lower('Fauzia Assagaf');
  ELSE
    INSERT INTO public.jamaah_accounts (
      tenant_id, keberangkatan_id, nama, nomor_jamaah, rombongan,
      hotel_makkah, hotel_madinah, fase, access_token
    ) VALUES (
      v_tenant_id, v_batch_id, 'Fauzia Assagaf', 'DM-NOV-006',
      'Rombongan Umroh Eksklusif 02 November 2026',
      'Pullman Zamzam', 'Al-Ansr Golden Tulip',
      'persiapan', gen_random_uuid()
    );
  END IF;

  -- Jamaah #7: Tatang Sumantri (Pullman Zamzam - Al-Ansr Golden Tulip)
  IF EXISTS (SELECT 1 FROM public.jamaah_accounts WHERE tenant_id = v_tenant_id AND lower(trim(nama)) = lower('Tatang Sumantri')) THEN
    UPDATE public.jamaah_accounts
    SET
      keberangkatan_id = v_batch_id,
      nama = 'Tatang Sumantri',
      nomor_jamaah = 'DM-NOV-007',
      rombongan = 'Rombongan Umroh Eksklusif 02 November 2026',
      hotel_makkah = 'Pullman Zamzam',
      hotel_madinah = 'Al-Ansr Golden Tulip',
      fase = 'persiapan'
    WHERE tenant_id = v_tenant_id AND lower(trim(nama)) = lower('Tatang Sumantri');
  ELSE
    INSERT INTO public.jamaah_accounts (
      tenant_id, keberangkatan_id, nama, nomor_jamaah, rombongan,
      hotel_makkah, hotel_madinah, fase, access_token
    ) VALUES (
      v_tenant_id, v_batch_id, 'Tatang Sumantri', 'DM-NOV-007',
      'Rombongan Umroh Eksklusif 02 November 2026',
      'Pullman Zamzam', 'Al-Ansr Golden Tulip',
      'persiapan', gen_random_uuid()
    );
  END IF;

  -- Jamaah #8: Ida Hermawati (Pullman Zamzam - Al-Ansr Golden Tulip)
  IF EXISTS (SELECT 1 FROM public.jamaah_accounts WHERE tenant_id = v_tenant_id AND lower(trim(nama)) = lower('Ida Hermawati')) THEN
    UPDATE public.jamaah_accounts
    SET
      keberangkatan_id = v_batch_id,
      nama = 'Ida Hermawati',
      nomor_jamaah = 'DM-NOV-008',
      rombongan = 'Rombongan Umroh Eksklusif 02 November 2026',
      hotel_makkah = 'Pullman Zamzam',
      hotel_madinah = 'Al-Ansr Golden Tulip',
      fase = 'persiapan'
    WHERE tenant_id = v_tenant_id AND lower(trim(nama)) = lower('Ida Hermawati');
  ELSE
    INSERT INTO public.jamaah_accounts (
      tenant_id, keberangkatan_id, nama, nomor_jamaah, rombongan,
      hotel_makkah, hotel_madinah, fase, access_token
    ) VALUES (
      v_tenant_id, v_batch_id, 'Ida Hermawati', 'DM-NOV-008',
      'Rombongan Umroh Eksklusif 02 November 2026',
      'Pullman Zamzam', 'Al-Ansr Golden Tulip',
      'persiapan', gen_random_uuid()
    );
  END IF;

  -- Jamaah #9: Ubaedillah Ahmad (Pullman Zamzam - Al-Ansr Golden Tulip)
  IF EXISTS (SELECT 1 FROM public.jamaah_accounts WHERE tenant_id = v_tenant_id AND lower(trim(nama)) = lower('Ubaedillah Ahmad')) THEN
    UPDATE public.jamaah_accounts
    SET
      keberangkatan_id = v_batch_id,
      nama = 'Ubaedillah Ahmad',
      nomor_jamaah = 'DM-NOV-009',
      rombongan = 'Rombongan Umroh Eksklusif 02 November 2026',
      hotel_makkah = 'Pullman Zamzam',
      hotel_madinah = 'Al-Ansr Golden Tulip',
      fase = 'persiapan'
    WHERE tenant_id = v_tenant_id AND lower(trim(nama)) = lower('Ubaedillah Ahmad');
  ELSE
    INSERT INTO public.jamaah_accounts (
      tenant_id, keberangkatan_id, nama, nomor_jamaah, rombongan,
      hotel_makkah, hotel_madinah, fase, access_token
    ) VALUES (
      v_tenant_id, v_batch_id, 'Ubaedillah Ahmad', 'DM-NOV-009',
      'Rombongan Umroh Eksklusif 02 November 2026',
      'Pullman Zamzam', 'Al-Ansr Golden Tulip',
      'persiapan', gen_random_uuid()
    );
  END IF;

  -- Jamaah #10: Ferry Mulyanto (Pullman Zamzam - Al-Ansr Golden Tulip)
  IF EXISTS (SELECT 1 FROM public.jamaah_accounts WHERE tenant_id = v_tenant_id AND lower(trim(nama)) = lower('Ferry Mulyanto')) THEN
    UPDATE public.jamaah_accounts
    SET
      keberangkatan_id = v_batch_id,
      nama = 'Ferry Mulyanto',
      nomor_jamaah = 'DM-NOV-010',
      rombongan = 'Rombongan Umroh Eksklusif 02 November 2026',
      hotel_makkah = 'Pullman Zamzam',
      hotel_madinah = 'Al-Ansr Golden Tulip',
      fase = 'persiapan'
    WHERE tenant_id = v_tenant_id AND lower(trim(nama)) = lower('Ferry Mulyanto');
  ELSE
    INSERT INTO public.jamaah_accounts (
      tenant_id, keberangkatan_id, nama, nomor_jamaah, rombongan,
      hotel_makkah, hotel_madinah, fase, access_token
    ) VALUES (
      v_tenant_id, v_batch_id, 'Ferry Mulyanto', 'DM-NOV-010',
      'Rombongan Umroh Eksklusif 02 November 2026',
      'Pullman Zamzam', 'Al-Ansr Golden Tulip',
      'persiapan', gen_random_uuid()
    );
  END IF;

  -- Jamaah #11: Jihan Widyawati Sifa (Pullman Zamzam - Al-Ansr Golden Tulip)
  IF EXISTS (SELECT 1 FROM public.jamaah_accounts WHERE tenant_id = v_tenant_id AND lower(trim(nama)) = lower('Jihan Widyawati Sifa')) THEN
    UPDATE public.jamaah_accounts
    SET
      keberangkatan_id = v_batch_id,
      nama = 'Jihan Widyawati Sifa',
      nomor_jamaah = 'DM-NOV-011',
      rombongan = 'Rombongan Umroh Eksklusif 02 November 2026',
      hotel_makkah = 'Pullman Zamzam',
      hotel_madinah = 'Al-Ansr Golden Tulip',
      fase = 'persiapan'
    WHERE tenant_id = v_tenant_id AND lower(trim(nama)) = lower('Jihan Widyawati Sifa');
  ELSE
    INSERT INTO public.jamaah_accounts (
      tenant_id, keberangkatan_id, nama, nomor_jamaah, rombongan,
      hotel_makkah, hotel_madinah, fase, access_token
    ) VALUES (
      v_tenant_id, v_batch_id, 'Jihan Widyawati Sifa', 'DM-NOV-011',
      'Rombongan Umroh Eksklusif 02 November 2026',
      'Pullman Zamzam', 'Al-Ansr Golden Tulip',
      'persiapan', gen_random_uuid()
    );
  END IF;

  -- Jamaah #12: Meirani Rahmania (Pullman Zamzam - Al-Ansr Golden Tulip)
  IF EXISTS (SELECT 1 FROM public.jamaah_accounts WHERE tenant_id = v_tenant_id AND lower(trim(nama)) = lower('Meirani Rahmania')) THEN
    UPDATE public.jamaah_accounts
    SET
      keberangkatan_id = v_batch_id,
      nama = 'Meirani Rahmania',
      nomor_jamaah = 'DM-NOV-012',
      rombongan = 'Rombongan Umroh Eksklusif 02 November 2026',
      hotel_makkah = 'Pullman Zamzam',
      hotel_madinah = 'Al-Ansr Golden Tulip',
      fase = 'persiapan'
    WHERE tenant_id = v_tenant_id AND lower(trim(nama)) = lower('Meirani Rahmania');
  ELSE
    INSERT INTO public.jamaah_accounts (
      tenant_id, keberangkatan_id, nama, nomor_jamaah, rombongan,
      hotel_makkah, hotel_madinah, fase, access_token
    ) VALUES (
      v_tenant_id, v_batch_id, 'Meirani Rahmania', 'DM-NOV-012',
      'Rombongan Umroh Eksklusif 02 November 2026',
      'Pullman Zamzam', 'Al-Ansr Golden Tulip',
      'persiapan', gen_random_uuid()
    );
  END IF;

  -- Jamaah #13: Suci Yuni Siswati Syiffa (Pullman Zamzam - Al-Ansr Golden Tulip)
  IF EXISTS (SELECT 1 FROM public.jamaah_accounts WHERE tenant_id = v_tenant_id AND lower(trim(nama)) = lower('Suci Yuni Siswati Syiffa')) THEN
    UPDATE public.jamaah_accounts
    SET
      keberangkatan_id = v_batch_id,
      nama = 'Suci Yuni Siswati Syiffa',
      nomor_jamaah = 'DM-NOV-013',
      rombongan = 'Rombongan Umroh Eksklusif 02 November 2026',
      hotel_makkah = 'Pullman Zamzam',
      hotel_madinah = 'Al-Ansr Golden Tulip',
      fase = 'persiapan'
    WHERE tenant_id = v_tenant_id AND lower(trim(nama)) = lower('Suci Yuni Siswati Syiffa');
  ELSE
    INSERT INTO public.jamaah_accounts (
      tenant_id, keberangkatan_id, nama, nomor_jamaah, rombongan,
      hotel_makkah, hotel_madinah, fase, access_token
    ) VALUES (
      v_tenant_id, v_batch_id, 'Suci Yuni Siswati Syiffa', 'DM-NOV-013',
      'Rombongan Umroh Eksklusif 02 November 2026',
      'Pullman Zamzam', 'Al-Ansr Golden Tulip',
      'persiapan', gen_random_uuid()
    );
  END IF;

  -- Jamaah #14: Nur Aisyah Ahmad (Pullman Zamzam - Al-Ansr Golden Tulip)
  IF EXISTS (SELECT 1 FROM public.jamaah_accounts WHERE tenant_id = v_tenant_id AND lower(trim(nama)) = lower('Nur Aisyah Ahmad')) THEN
    UPDATE public.jamaah_accounts
    SET
      keberangkatan_id = v_batch_id,
      nama = 'Nur Aisyah Ahmad',
      nomor_jamaah = 'DM-NOV-014',
      rombongan = 'Rombongan Umroh Eksklusif 02 November 2026',
      hotel_makkah = 'Pullman Zamzam',
      hotel_madinah = 'Al-Ansr Golden Tulip',
      fase = 'persiapan'
    WHERE tenant_id = v_tenant_id AND lower(trim(nama)) = lower('Nur Aisyah Ahmad');
  ELSE
    INSERT INTO public.jamaah_accounts (
      tenant_id, keberangkatan_id, nama, nomor_jamaah, rombongan,
      hotel_makkah, hotel_madinah, fase, access_token
    ) VALUES (
      v_tenant_id, v_batch_id, 'Nur Aisyah Ahmad', 'DM-NOV-014',
      'Rombongan Umroh Eksklusif 02 November 2026',
      'Pullman Zamzam', 'Al-Ansr Golden Tulip',
      'persiapan', gen_random_uuid()
    );
  END IF;

  -- Jamaah #15: Andri Yuliawan (Pullman Zamzam - Al-Ansr Golden Tulip)
  IF EXISTS (SELECT 1 FROM public.jamaah_accounts WHERE tenant_id = v_tenant_id AND lower(trim(nama)) = lower('Andri Yuliawan')) THEN
    UPDATE public.jamaah_accounts
    SET
      keberangkatan_id = v_batch_id,
      nama = 'Andri Yuliawan',
      nomor_jamaah = 'DM-NOV-015',
      rombongan = 'Rombongan Umroh Eksklusif 02 November 2026',
      hotel_makkah = 'Pullman Zamzam',
      hotel_madinah = 'Al-Ansr Golden Tulip',
      fase = 'persiapan'
    WHERE tenant_id = v_tenant_id AND lower(trim(nama)) = lower('Andri Yuliawan');
  ELSE
    INSERT INTO public.jamaah_accounts (
      tenant_id, keberangkatan_id, nama, nomor_jamaah, rombongan,
      hotel_makkah, hotel_madinah, fase, access_token
    ) VALUES (
      v_tenant_id, v_batch_id, 'Andri Yuliawan', 'DM-NOV-015',
      'Rombongan Umroh Eksklusif 02 November 2026',
      'Pullman Zamzam', 'Al-Ansr Golden Tulip',
      'persiapan', gen_random_uuid()
    );
  END IF;

  -- Jamaah #16: Dwi Novi Kusuma Wardany (Pullman Zamzam - Al-Ansr Golden Tulip)
  IF EXISTS (SELECT 1 FROM public.jamaah_accounts WHERE tenant_id = v_tenant_id AND lower(trim(nama)) = lower('Dwi Novi Kusuma Wardany')) THEN
    UPDATE public.jamaah_accounts
    SET
      keberangkatan_id = v_batch_id,
      nama = 'Dwi Novi Kusuma Wardany',
      nomor_jamaah = 'DM-NOV-016',
      rombongan = 'Rombongan Umroh Eksklusif 02 November 2026',
      hotel_makkah = 'Pullman Zamzam',
      hotel_madinah = 'Al-Ansr Golden Tulip',
      fase = 'persiapan'
    WHERE tenant_id = v_tenant_id AND lower(trim(nama)) = lower('Dwi Novi Kusuma Wardany');
  ELSE
    INSERT INTO public.jamaah_accounts (
      tenant_id, keberangkatan_id, nama, nomor_jamaah, rombongan,
      hotel_makkah, hotel_madinah, fase, access_token
    ) VALUES (
      v_tenant_id, v_batch_id, 'Dwi Novi Kusuma Wardany', 'DM-NOV-016',
      'Rombongan Umroh Eksklusif 02 November 2026',
      'Pullman Zamzam', 'Al-Ansr Golden Tulip',
      'persiapan', gen_random_uuid()
    );
  END IF;

  -- Jamaah #17: Aqil Zufar Zayyaan Al Rasyid (Pullman Zamzam - Al-Ansr Golden Tulip)
  IF EXISTS (SELECT 1 FROM public.jamaah_accounts WHERE tenant_id = v_tenant_id AND lower(trim(nama)) = lower('Aqil Zufar Zayyaan Al Rasyid')) THEN
    UPDATE public.jamaah_accounts
    SET
      keberangkatan_id = v_batch_id,
      nama = 'Aqil Zufar Zayyaan Al Rasyid',
      nomor_jamaah = 'DM-NOV-017',
      rombongan = 'Rombongan Umroh Eksklusif 02 November 2026',
      hotel_makkah = 'Pullman Zamzam',
      hotel_madinah = 'Al-Ansr Golden Tulip',
      fase = 'persiapan'
    WHERE tenant_id = v_tenant_id AND lower(trim(nama)) = lower('Aqil Zufar Zayyaan Al Rasyid');
  ELSE
    INSERT INTO public.jamaah_accounts (
      tenant_id, keberangkatan_id, nama, nomor_jamaah, rombongan,
      hotel_makkah, hotel_madinah, fase, access_token
    ) VALUES (
      v_tenant_id, v_batch_id, 'Aqil Zufar Zayyaan Al Rasyid', 'DM-NOV-017',
      'Rombongan Umroh Eksklusif 02 November 2026',
      'Pullman Zamzam', 'Al-Ansr Golden Tulip',
      'persiapan', gen_random_uuid()
    );
  END IF;

  -- Jamaah #18: Bagus Dwi Ananda (Pullman Zamzam - Al-Ansr Golden Tulip)
  IF EXISTS (SELECT 1 FROM public.jamaah_accounts WHERE tenant_id = v_tenant_id AND lower(trim(nama)) = lower('Bagus Dwi Ananda')) THEN
    UPDATE public.jamaah_accounts
    SET
      keberangkatan_id = v_batch_id,
      nama = 'Bagus Dwi Ananda',
      nomor_jamaah = 'DM-NOV-018',
      rombongan = 'Rombongan Umroh Eksklusif 02 November 2026',
      hotel_makkah = 'Pullman Zamzam',
      hotel_madinah = 'Al-Ansr Golden Tulip',
      fase = 'persiapan'
    WHERE tenant_id = v_tenant_id AND lower(trim(nama)) = lower('Bagus Dwi Ananda');
  ELSE
    INSERT INTO public.jamaah_accounts (
      tenant_id, keberangkatan_id, nama, nomor_jamaah, rombongan,
      hotel_makkah, hotel_madinah, fase, access_token
    ) VALUES (
      v_tenant_id, v_batch_id, 'Bagus Dwi Ananda', 'DM-NOV-018',
      'Rombongan Umroh Eksklusif 02 November 2026',
      'Pullman Zamzam', 'Al-Ansr Golden Tulip',
      'persiapan', gen_random_uuid()
    );
  END IF;

  -- Jamaah #19: Bambang Setyawan (Pullman Zamzam - Al-Ansr Golden Tulip)
  IF EXISTS (SELECT 1 FROM public.jamaah_accounts WHERE tenant_id = v_tenant_id AND lower(trim(nama)) = lower('Bambang Setyawan')) THEN
    UPDATE public.jamaah_accounts
    SET
      keberangkatan_id = v_batch_id,
      nama = 'Bambang Setyawan',
      nomor_jamaah = 'DM-NOV-019',
      rombongan = 'Rombongan Umroh Eksklusif 02 November 2026',
      hotel_makkah = 'Pullman Zamzam',
      hotel_madinah = 'Al-Ansr Golden Tulip',
      fase = 'persiapan'
    WHERE tenant_id = v_tenant_id AND lower(trim(nama)) = lower('Bambang Setyawan');
  ELSE
    INSERT INTO public.jamaah_accounts (
      tenant_id, keberangkatan_id, nama, nomor_jamaah, rombongan,
      hotel_makkah, hotel_madinah, fase, access_token
    ) VALUES (
      v_tenant_id, v_batch_id, 'Bambang Setyawan', 'DM-NOV-019',
      'Rombongan Umroh Eksklusif 02 November 2026',
      'Pullman Zamzam', 'Al-Ansr Golden Tulip',
      'persiapan', gen_random_uuid()
    );
  END IF;

  -- Jamaah #20: Soemiraning Kasiadi (Pullman Zamzam - Al-Ansr Golden Tulip)
  IF EXISTS (SELECT 1 FROM public.jamaah_accounts WHERE tenant_id = v_tenant_id AND lower(trim(nama)) = lower('Soemiraning Kasiadi')) THEN
    UPDATE public.jamaah_accounts
    SET
      keberangkatan_id = v_batch_id,
      nama = 'Soemiraning Kasiadi',
      nomor_jamaah = 'DM-NOV-020',
      rombongan = 'Rombongan Umroh Eksklusif 02 November 2026',
      hotel_makkah = 'Pullman Zamzam',
      hotel_madinah = 'Al-Ansr Golden Tulip',
      fase = 'persiapan'
    WHERE tenant_id = v_tenant_id AND lower(trim(nama)) = lower('Soemiraning Kasiadi');
  ELSE
    INSERT INTO public.jamaah_accounts (
      tenant_id, keberangkatan_id, nama, nomor_jamaah, rombongan,
      hotel_makkah, hotel_madinah, fase, access_token
    ) VALUES (
      v_tenant_id, v_batch_id, 'Soemiraning Kasiadi', 'DM-NOV-020',
      'Rombongan Umroh Eksklusif 02 November 2026',
      'Pullman Zamzam', 'Al-Ansr Golden Tulip',
      'persiapan', gen_random_uuid()
    );
  END IF;

  -- Jamaah #21: Nursilawati Nurdin (Pullman Zamzam - Al-Ansr Golden Tulip)
  IF EXISTS (SELECT 1 FROM public.jamaah_accounts WHERE tenant_id = v_tenant_id AND lower(trim(nama)) = lower('Nursilawati Nurdin')) THEN
    UPDATE public.jamaah_accounts
    SET
      keberangkatan_id = v_batch_id,
      nama = 'Nursilawati Nurdin',
      nomor_jamaah = 'DM-NOV-021',
      rombongan = 'Rombongan Umroh Eksklusif 02 November 2026',
      hotel_makkah = 'Pullman Zamzam',
      hotel_madinah = 'Al-Ansr Golden Tulip',
      fase = 'persiapan'
    WHERE tenant_id = v_tenant_id AND lower(trim(nama)) = lower('Nursilawati Nurdin');
  ELSE
    INSERT INTO public.jamaah_accounts (
      tenant_id, keberangkatan_id, nama, nomor_jamaah, rombongan,
      hotel_makkah, hotel_madinah, fase, access_token
    ) VALUES (
      v_tenant_id, v_batch_id, 'Nursilawati Nurdin', 'DM-NOV-021',
      'Rombongan Umroh Eksklusif 02 November 2026',
      'Pullman Zamzam', 'Al-Ansr Golden Tulip',
      'persiapan', gen_random_uuid()
    );
  END IF;

  -- Jamaah #22: Rifqi Wisnu Wardhana (Pullman Zamzam - Al-Ansr Golden Tulip)
  IF EXISTS (SELECT 1 FROM public.jamaah_accounts WHERE tenant_id = v_tenant_id AND lower(trim(nama)) = lower('Rifqi Wisnu Wardhana')) THEN
    UPDATE public.jamaah_accounts
    SET
      keberangkatan_id = v_batch_id,
      nama = 'Rifqi Wisnu Wardhana',
      nomor_jamaah = 'DM-NOV-022',
      rombongan = 'Rombongan Umroh Eksklusif 02 November 2026',
      hotel_makkah = 'Pullman Zamzam',
      hotel_madinah = 'Al-Ansr Golden Tulip',
      fase = 'persiapan'
    WHERE tenant_id = v_tenant_id AND lower(trim(nama)) = lower('Rifqi Wisnu Wardhana');
  ELSE
    INSERT INTO public.jamaah_accounts (
      tenant_id, keberangkatan_id, nama, nomor_jamaah, rombongan,
      hotel_makkah, hotel_madinah, fase, access_token
    ) VALUES (
      v_tenant_id, v_batch_id, 'Rifqi Wisnu Wardhana', 'DM-NOV-022',
      'Rombongan Umroh Eksklusif 02 November 2026',
      'Pullman Zamzam', 'Al-Ansr Golden Tulip',
      'persiapan', gen_random_uuid()
    );
  END IF;

  -- Jamaah #23: Nurfadilah M Rajab (Pullman Zamzam - Al-Ansr Golden Tulip)
  IF EXISTS (SELECT 1 FROM public.jamaah_accounts WHERE tenant_id = v_tenant_id AND lower(trim(nama)) = lower('Nurfadilah M Rajab')) THEN
    UPDATE public.jamaah_accounts
    SET
      keberangkatan_id = v_batch_id,
      nama = 'Nurfadilah M Rajab',
      nomor_jamaah = 'DM-NOV-023',
      rombongan = 'Rombongan Umroh Eksklusif 02 November 2026',
      hotel_makkah = 'Pullman Zamzam',
      hotel_madinah = 'Al-Ansr Golden Tulip',
      fase = 'persiapan'
    WHERE tenant_id = v_tenant_id AND lower(trim(nama)) = lower('Nurfadilah M Rajab');
  ELSE
    INSERT INTO public.jamaah_accounts (
      tenant_id, keberangkatan_id, nama, nomor_jamaah, rombongan,
      hotel_makkah, hotel_madinah, fase, access_token
    ) VALUES (
      v_tenant_id, v_batch_id, 'Nurfadilah M Rajab', 'DM-NOV-023',
      'Rombongan Umroh Eksklusif 02 November 2026',
      'Pullman Zamzam', 'Al-Ansr Golden Tulip',
      'persiapan', gen_random_uuid()
    );
  END IF;

  -- Tour Leader (Pullman Zamzam - Al-Ansr Golden Tulip)
  IF EXISTS (
    SELECT 1 FROM public.jamaah_accounts ja
    JOIN public.keberangkatan k ON k.id = ja.keberangkatan_id
    WHERE ja.tenant_id = v_tenant_id AND lower(trim(ja.nama)) = lower('Ust. Hudi Supriyadi Daeng Pabeta, Lc.')
      AND ja.keberangkatan_id <> v_batch_id
      AND k.tanggal_kepulangan + 1 >= current_date
  ) THEN
    RAISE NOTICE 'Akun % masih bertugas di batch lain yang belum selesai, dilewati. Jalankan ulang script setelah batch tersebut pulang.', 'Ust. Hudi Supriyadi Daeng Pabeta, Lc.';
  ELSIF EXISTS (SELECT 1 FROM public.jamaah_accounts WHERE tenant_id = v_tenant_id AND lower(trim(nama)) = lower('Ust. Hudi Supriyadi Daeng Pabeta, Lc.')) THEN
    UPDATE public.jamaah_accounts
    SET
      keberangkatan_id = v_batch_id,
      nama = 'Ust. Hudi Supriyadi Daeng Pabeta, Lc.',
      nomor_jamaah = 'TL-NOV-001',
      rombongan = 'Rombongan Umroh Eksklusif 02 November 2026',
      hotel_makkah = 'Pullman Zamzam',
      hotel_madinah = 'Al-Ansr Golden Tulip',
      fase = 'persiapan'
    WHERE tenant_id = v_tenant_id AND lower(trim(nama)) = lower('Ust. Hudi Supriyadi Daeng Pabeta, Lc.');
  ELSE
    INSERT INTO public.jamaah_accounts (
      tenant_id, keberangkatan_id, nama, nomor_jamaah, rombongan,
      hotel_makkah, hotel_madinah, fase, access_token
    ) VALUES (
      v_tenant_id, v_batch_id, 'Ust. Hudi Supriyadi Daeng Pabeta, Lc.', 'TL-NOV-001',
      'Rombongan Umroh Eksklusif 02 November 2026',
      'Pullman Zamzam', 'Al-Ansr Golden Tulip',
      'persiapan', gen_random_uuid()
    );
  END IF;

  -- Muthowwif (Pullman Zamzam - Al-Ansr Golden Tulip)
  IF EXISTS (
    SELECT 1 FROM public.jamaah_accounts ja
    JOIN public.keberangkatan k ON k.id = ja.keberangkatan_id
    WHERE ja.tenant_id = v_tenant_id AND lower(trim(ja.nama)) = lower('Ust. Sujani Vona Reza, Lc.')
      AND ja.keberangkatan_id <> v_batch_id
      AND k.tanggal_kepulangan + 1 >= current_date
  ) THEN
    RAISE NOTICE 'Akun % masih bertugas di batch lain yang belum selesai, dilewati. Jalankan ulang script setelah batch tersebut pulang.', 'Ust. Sujani Vona Reza, Lc.';
  ELSIF EXISTS (SELECT 1 FROM public.jamaah_accounts WHERE tenant_id = v_tenant_id AND lower(trim(nama)) = lower('Ust. Sujani Vona Reza, Lc.')) THEN
    UPDATE public.jamaah_accounts
    SET
      keberangkatan_id = v_batch_id,
      nama = 'Ust. Sujani Vona Reza, Lc.',
      nomor_jamaah = 'MUT-NOV-001',
      rombongan = 'Rombongan Umroh Eksklusif 02 November 2026',
      hotel_makkah = 'Pullman Zamzam',
      hotel_madinah = 'Al-Ansr Golden Tulip',
      fase = 'persiapan'
    WHERE tenant_id = v_tenant_id AND lower(trim(nama)) = lower('Ust. Sujani Vona Reza, Lc.');
  ELSE
    INSERT INTO public.jamaah_accounts (
      tenant_id, keberangkatan_id, nama, nomor_jamaah, rombongan,
      hotel_makkah, hotel_madinah, fase, access_token
    ) VALUES (
      v_tenant_id, v_batch_id, 'Ust. Sujani Vona Reza, Lc.', 'MUT-NOV-001',
      'Rombongan Umroh Eksklusif 02 November 2026',
      'Pullman Zamzam', 'Al-Ansr Golden Tulip',
      'persiapan', gen_random_uuid()
    );
  END IF;

  -- 4. Bersihkan Agenda Lama Batch ini jika ada, agar 100% sinkron
  DELETE FROM public.agenda_items WHERE keberangkatan_id = v_batch_id;

  -- 5. Masukkan Seluruh Agenda Perjalanan 9 Hari (Sesuai PDF Itinerary 02 Nov 2026)
  INSERT INTO public.agenda_items (tenant_id, keberangkatan_id, tanggal, jam_mulai, judul, deskripsi, lokasi, urutan)
  VALUES (v_tenant_id, v_batch_id, '2026-11-02', '07:00:00', 'Kumpul di Terminal 2F Bandara Soekarno-Hatta', 'Jamaah Dreammecca berkumpul di Terminal 2F untuk pengumpulan koper kepada tim handling Dreammecca. Paspor dibagikan kembali di bandara, mohon dijaga dan selalu dalam pengawasan pribadi.', 'Terminal 2F Bandara Internasional Soekarno-Hatta', 1);
  INSERT INTO public.agenda_items (tenant_id, keberangkatan_id, tanggal, jam_mulai, judul, deskripsi, lokasi, urutan)
  VALUES (v_tenant_id, v_batch_id, '2026-11-02', '08:00:00', 'Briefing & Pengarahan oleh Tour Leader', 'Briefing oleh tour leader Dreammecca untuk memastikan seluruh rangkaian perjalanan ibadah berjalan tertib, lancar, nyaman, aman, dan penuh keberkahan.', 'Terminal 2F Bandara Soekarno-Hatta', 2);
  INSERT INTO public.agenda_items (tenant_id, keberangkatan_id, tanggal, jam_mulai, judul, deskripsi, lokasi, urutan)
  VALUES (v_tenant_id, v_batch_id, '2026-11-02', '08:30:00', 'Makan Bersama, Persiapan Profiling & Pakaian Ihram', 'Setelah briefing, jamaah makan bersama. Persiapan menuju counter check-in untuk proses profiling. Koper bagasi dibawa lebih awal ke counter check-in. Pastikan barang kabin dipisahkan, terutama pakaian ihram bagi jamaah ikhwan.', 'Terminal 2F Bandara Soekarno-Hatta', 3);
  INSERT INTO public.agenda_items (tenant_id, keberangkatan_id, tanggal, jam_mulai, judul, deskripsi, lokasi, urutan)
  VALUES (v_tenant_id, v_batch_id, '2026-11-02', '09:30:00', 'Check-in, Pemeriksaan Imigrasi & Boarding', 'Proses check-in tiket, bagasi, pemeriksaan imigrasi, dan boarding ke pesawat Garuda Indonesia GA 980.', 'Terminal 2F Bandara Soekarno-Hatta', 4);
  INSERT INTO public.agenda_items (tenant_id, keberangkatan_id, tanggal, jam_mulai, judul, deskripsi, lokasi, urutan)
  VALUES (v_tenant_id, v_batch_id, '2026-11-02', '12:05:00', 'Take Off Jakarta (CGK) Menuju Jeddah (JED) - Garuda Indonesia GA 980', 'Penerbangan langsung (direct tanpa transit) menuju Bandara Internasional King Abdulaziz, Jeddah dengan Garuda Indonesia GA 980.', 'Pesawat Garuda Indonesia GA 980', 5);
  INSERT INTO public.agenda_items (tenant_id, keberangkatan_id, tanggal, jam_mulai, judul, deskripsi, lokasi, urutan)
  VALUES (v_tenant_id, v_batch_id, '2026-11-02', '16:30:00', 'Pengambilan Miqat di Yalamlam (Di Atas Pesawat)', 'Pengambilan miqat di Yalamlam (di atas pesawat). Jamaah laki-laki sudah siap dengan pakaian ihram, dilanjutkan berniat umrah bersama dipandu Muthowwif dan Tour Leader.', 'Yalamlam (Udara)', 6);
  INSERT INTO public.agenda_items (tenant_id, keberangkatan_id, tanggal, jam_mulai, judul, deskripsi, lokasi, urutan)
  VALUES (v_tenant_id, v_batch_id, '2026-11-02', '17:40:00', 'Tiba di Bandara King Abdulaziz Jeddah & Perjalanan ke Makkah', 'Tiba di Bandara Internasional King Abdulaziz Jeddah, proses imigrasi Saudi, pengambilan bagasi, dan melanjutkan perjalanan darat dengan bus menuju Makkah Al-Mukarramah.', 'Bandara Internasional King Abdulaziz Jeddah : Makkah', 7);
  INSERT INTO public.agenda_items (tenant_id, keberangkatan_id, tanggal, jam_mulai, judul, deskripsi, lokasi, urutan)
  VALUES (v_tenant_id, v_batch_id, '2026-11-02', '21:00:00', 'Check-in Hotel Makkah, Makan Malam & Pelaksanaan Umrah Pertama', 'Check-in hotel di Makkah, makan malam, dan bersama-sama melaksanakan rangkaian Umrah Pertama (Tawaf, Sa''i, dan Tahallul) di Masjidil Haram dibimbing oleh Muthowwif dan Tour Leader. Setelah selesai, istirahat.', 'Hotel Makkah & Masjidil Haram', 8);
  INSERT INTO public.agenda_items (tenant_id, keberangkatan_id, tanggal, jam_mulai, judul, deskripsi, lokasi, urutan)
  VALUES (v_tenant_id, v_batch_id, '2026-11-03', '04:30:00', 'Sholat Subuh di Masjidil Haram', 'Melaksanakan Sholat Subuh berjamaah di Masjidil Haram, dilanjutkan sarapan di hotel.', 'Masjidil Haram Makkah', 1);
  INSERT INTO public.agenda_items (tenant_id, keberangkatan_id, tanggal, jam_mulai, judul, deskripsi, lokasi, urutan)
  VALUES (v_tenant_id, v_batch_id, '2026-11-03', '07:00:00', 'Memperbanyak Ibadah Mandiri Sepanjang Hari', 'Hari bebas untuk memperbanyak ibadah: thawaf sunnah, tilawah Al-Qur''an, dzikir, dan doa di Masjidil Haram.', 'Masjidil Haram Makkah', 2);
  INSERT INTO public.agenda_items (tenant_id, keberangkatan_id, tanggal, jam_mulai, judul, deskripsi, lokasi, urutan)
  VALUES (v_tenant_id, v_batch_id, '2026-11-03', '12:00:00', 'Sholat Berjamaah Lima Waktu di Masjidil Haram', 'Sholat Dzuhur, Ashar, Maghrib, dan Isya berjamaah di Masjidil Haram.', 'Masjidil Haram Makkah', 3);
  INSERT INTO public.agenda_items (tenant_id, keberangkatan_id, tanggal, jam_mulai, judul, deskripsi, lokasi, urutan)
  VALUES (v_tenant_id, v_batch_id, '2026-11-03', '20:30:00', 'Makan Malam di Hotel & Istirahat', 'Makan malam di restoran hotel dan istirahat.', 'Hotel Makkah', 4);
  INSERT INTO public.agenda_items (tenant_id, keberangkatan_id, tanggal, jam_mulai, judul, deskripsi, lokasi, urutan)
  VALUES (v_tenant_id, v_batch_id, '2026-11-04', '04:30:00', 'Sholat Subuh & Sarapan Pagi', 'Sholat Subuh berjamaah di Masjidil Haram dan sarapan pagi di hotel.', 'Masjidil Haram & Hotel Makkah', 1);
  INSERT INTO public.agenda_items (tenant_id, keberangkatan_id, tanggal, jam_mulai, judul, deskripsi, lokasi, urutan)
  VALUES (v_tenant_id, v_batch_id, '2026-11-04', '07:00:00', 'City Tour Makkah & Ziarah Lokasi Bersejarah (Tentatif)', 'Ziarah ke Jabal Tsur, Padang Arafah, Jabal Rahmah, Muzdalifah, Mina, Jamarat, dan Universitas Ummul Quro.', 'Makkah Al-Mukarramah', 2);
  INSERT INTO public.agenda_items (tenant_id, keberangkatan_id, tanggal, jam_mulai, judul, deskripsi, lokasi, urutan)
  VALUES (v_tenant_id, v_batch_id, '2026-11-04', '10:30:00', 'Pengambilan Miqat Umroh ke-2', 'Bagi jamaah yang berniat melaksanakan Umroh kedua, pengambilan miqat serta pelaksanaan umroh didampingi Muthawwif dan Tour Leader.', 'Makkah Al-Mukarramah', 3);
  INSERT INTO public.agenda_items (tenant_id, keberangkatan_id, tanggal, jam_mulai, judul, deskripsi, lokasi, urutan)
  VALUES (v_tenant_id, v_batch_id, '2026-11-04', '12:15:00', 'Sholat Dzuhur di Masjidil Haram (Tentatif) & Makan Siang', 'Lokasi Sholat Dzuhur bersifat tentatif, disesuaikan dengan kondisi waktu saat kegiatan mazarat. Dilanjutkan makan siang dan memperbanyak ibadah.', 'Masjidil Haram Makkah', 4);
  INSERT INTO public.agenda_items (tenant_id, keberangkatan_id, tanggal, jam_mulai, judul, deskripsi, lokasi, urutan)
  VALUES (v_tenant_id, v_batch_id, '2026-11-04', '14:00:00', 'Pelaksanaan Umroh Kedua (Tawaf, Sa''i, Tahallul)', 'Pelaksanaan ibadah Umroh kedua di Masjidil Haram didampingi Muthawwif dan Tour Leader.', 'Masjidil Haram Makkah', 5);
  INSERT INTO public.agenda_items (tenant_id, keberangkatan_id, tanggal, jam_mulai, judul, deskripsi, lokasi, urutan)
  VALUES (v_tenant_id, v_batch_id, '2026-11-04', '18:00:00', 'Sholat Berjamaah di Masjidil Haram, Makan Malam & Istirahat', 'Sholat Maghrib dan Isya berjamaah di Masjidil Haram, dilanjutkan makan malam di hotel dan istirahat.', 'Masjidil Haram & Hotel Makkah', 6);
  INSERT INTO public.agenda_items (tenant_id, keberangkatan_id, tanggal, jam_mulai, judul, deskripsi, lokasi, urutan)
  VALUES (v_tenant_id, v_batch_id, '2026-11-05', '04:30:00', 'Sholat Subuh & Sarapan Pagi', 'Sholat Subuh berjamaah di Masjidil Haram dan sarapan pagi di hotel.', 'Masjidil Haram & Hotel Makkah', 1);
  INSERT INTO public.agenda_items (tenant_id, keberangkatan_id, tanggal, jam_mulai, judul, deskripsi, lokasi, urutan)
  VALUES (v_tenant_id, v_batch_id, '2026-11-05', '07:00:00', 'Perjalanan City Tour Kota Thoif (Wisata Alam & Sejarah)', 'Perjalanan menuju Kota Thoif. Wisata alam dan napak tilas sejarah dakwah Nabi SAW di Thoif.', 'Kota Thoif', 2);
  INSERT INTO public.agenda_items (tenant_id, keberangkatan_id, tanggal, jam_mulai, judul, deskripsi, lokasi, urutan)
  VALUES (v_tenant_id, v_batch_id, '2026-11-05', '10:30:00', 'Menaiki Kereta Gantung / Teleferic Thoif (Free Include Travel)', 'Menikmati pemandangan pegunungan Thoif dari ketinggian dengan kereta gantung (teleferic), gratis termasuk dalam program Dreammecca.', 'Kereta Gantung Teleferic Thoif', 3);
  INSERT INTO public.agenda_items (tenant_id, keberangkatan_id, tanggal, jam_mulai, judul, deskripsi, lokasi, urutan)
  VALUES (v_tenant_id, v_batch_id, '2026-11-05', '12:30:00', 'Makan Siang Nasi Mandhi Bersama & Sholat Jama'' Qashar', 'Menikmati hidangan khas Arab Nasi Mandhi bersama seluruh jamaah, dilanjutkan Sholat Dzuhur dan Ashar jama'' qashar.', 'Restoran Tradisional Thoif', 4);
  INSERT INTO public.agenda_items (tenant_id, keberangkatan_id, tanggal, jam_mulai, judul, deskripsi, lokasi, urutan)
  VALUES (v_tenant_id, v_batch_id, '2026-11-05', '15:00:00', 'Perjalanan Kembali ke Makkah (Fasilitasi Miqat Umroh ke-3)', 'Perjalanan kembali ke Makkah. Bagi jamaah yang ingin melaksanakan Umroh ketiga, Dreammecca memfasilitasi pengambilan miqat. Adapun pelaksanaan umroh bersifat mandiri (pembimbing TL dan Mutawwif tidak mendampingi).', 'Thoif : Makkah', 5);
  INSERT INTO public.agenda_items (tenant_id, keberangkatan_id, tanggal, jam_mulai, judul, deskripsi, lokasi, urutan)
  VALUES (v_tenant_id, v_batch_id, '2026-11-05', '18:00:00', 'Sholat Maghrib & Isya di Masjidil Haram, Makan Malam & Istirahat', 'Sholat Maghrib dan Isya berjamaah di Masjidil Haram, dilanjutkan makan malam di hotel dan istirahat.', 'Masjidil Haram & Hotel Makkah', 6);
  INSERT INTO public.agenda_items (tenant_id, keberangkatan_id, tanggal, jam_mulai, judul, deskripsi, lokasi, urutan)
  VALUES (v_tenant_id, v_batch_id, '2026-11-06', '04:30:00', 'Sholat Subuh & Thawaf Wada'' (Perpisahan Makkah)', 'Sholat Subuh berjamaah dan melaksanakan Thawaf Wada'' sebagai tanda perpisahan dengan Baitullah.', 'Masjidil Haram Makkah', 1);
  INSERT INTO public.agenda_items (tenant_id, keberangkatan_id, tanggal, jam_mulai, judul, deskripsi, lokasi, urutan)
  VALUES (v_tenant_id, v_batch_id, '2026-11-06', '07:00:00', 'Sarapan Pagi di Hotel', 'Sarapan pagi di restoran hotel.', 'Restoran Hotel Makkah', 2);
  INSERT INTO public.agenda_items (tenant_id, keberangkatan_id, tanggal, jam_mulai, judul, deskripsi, lokasi, urutan)
  VALUES (v_tenant_id, v_batch_id, '2026-11-06', '09:00:00', 'Persiapan Check-out & Koper di Depan Kamar', 'Koper bagasi diletakkan di depan kamar masing-masing pukul 09:00. Koper dibawa dengan bus yang tiba belakangan di Madinah, siapkan pakaian ganti di tas kabin untuk dibawa ke kereta cepat.', 'Hotel Makkah', 3);
  INSERT INTO public.agenda_items (tenant_id, keberangkatan_id, tanggal, jam_mulai, judul, deskripsi, lokasi, urutan)
  VALUES (v_tenant_id, v_batch_id, '2026-11-06', '11:30:00', 'Sholat Jum''at Berjamaah di Masjidil Haram', 'Berangkat lebih awal ke Masjidil Haram untuk melaksanakan Sholat Jum''at berjamaah.', 'Masjidil Haram Makkah', 4);
  INSERT INTO public.agenda_items (tenant_id, keberangkatan_id, tanggal, jam_mulai, judul, deskripsi, lokasi, urutan)
  VALUES (v_tenant_id, v_batch_id, '2026-11-06', '14:00:00', 'Check-out Hotel & Menuju Stasiun Kereta Cepat Haramain', 'Proses check-out hotel Makkah pukul 14:00, berkumpul di lobby hotel dan bersama-sama menuju Stasiun Kereta Cepat Haramain Makkah.', 'Stasiun Kereta Cepat Makkah (HHR)', 5);
  INSERT INTO public.agenda_items (tenant_id, keberangkatan_id, tanggal, jam_mulai, judul, deskripsi, lokasi, urutan)
  VALUES (v_tenant_id, v_batch_id, '2026-11-06', '15:30:00', 'Perjalanan Kereta Cepat Haramain Express Makkah ke Madinah', 'Perjalanan dengan Haramain Express menuju Madinah Al-Munawwarah.', 'Kereta Cepat Haramain Express', 6);
  INSERT INTO public.agenda_items (tenant_id, keberangkatan_id, tanggal, jam_mulai, judul, deskripsi, lokasi, urutan)
  VALUES (v_tenant_id, v_batch_id, '2026-11-06', '18:00:00', 'Tiba di Madinah, Transfer ke Hotel, Makan Malam & Istirahat', 'Tiba di Stasiun Madinah, transfer menuju hotel, pembagian kamar, makan malam, dan istirahat.', 'Hotel Madinah', 7);
  INSERT INTO public.agenda_items (tenant_id, keberangkatan_id, tanggal, jam_mulai, judul, deskripsi, lokasi, urutan)
  VALUES (v_tenant_id, v_batch_id, '2026-11-07', '04:30:00', 'Sholat Subuh di Masjid Nabawi', 'Sholat Subuh berjamaah di Masjid Nabawi.', 'Masjid Nabawi Madinah', 1);
  INSERT INTO public.agenda_items (tenant_id, keberangkatan_id, tanggal, jam_mulai, judul, deskripsi, lokasi, urutan)
  VALUES (v_tenant_id, v_batch_id, '2026-11-07', '07:00:00', 'Sarapan Pagi & Ziarah Sekitar Masjid Nabawi', 'Sarapan pagi di hotel, dilanjutkan ziarah seputar Masjid Nabawi: Saqifah Bani Sa''idah, Masjid Ali, dan Masjid Ghamamah dibimbing Muthowwif.', 'Sekitar Masjid Nabawi Madinah', 2);
  INSERT INTO public.agenda_items (tenant_id, keberangkatan_id, tanggal, jam_mulai, judul, deskripsi, lokasi, urutan)
  VALUES (v_tenant_id, v_batch_id, '2026-11-07', '12:15:00', 'Sholat Dzuhur Berjamaah & Makan Siang', 'Sholat Dzuhur berjamaah di Masjid Nabawi, dilanjutkan makan siang di hotel.', 'Masjid Nabawi & Hotel Madinah', 3);
  INSERT INTO public.agenda_items (tenant_id, keberangkatan_id, tanggal, jam_mulai, judul, deskripsi, lokasi, urutan)
  VALUES (v_tenant_id, v_batch_id, '2026-11-07', '13:30:00', 'Raudhah Ikhwan (Tentatif)', 'Memasuki Raudhah Asy-Syarifah bagi jamaah ikhwan sesuai jadwal Tasreh resmi.', 'Raudhah Asy-Syarifah Masjid Nabawi', 4);
  INSERT INTO public.agenda_items (tenant_id, keberangkatan_id, tanggal, jam_mulai, judul, deskripsi, lokasi, urutan)
  VALUES (v_tenant_id, v_batch_id, '2026-11-07', '15:30:00', 'Sholat Ashar Berjamaah di Masjid Nabawi', 'Melaksanakan Sholat Ashar berjamaah di Masjid Nabawi.', 'Masjid Nabawi Madinah', 5);
  INSERT INTO public.agenda_items (tenant_id, keberangkatan_id, tanggal, jam_mulai, judul, deskripsi, lokasi, urutan)
  VALUES (v_tenant_id, v_batch_id, '2026-11-07', '18:00:00', 'Sholat Maghrib & Isya Berjamaah di Masjid Nabawi', 'Melaksanakan Sholat Maghrib dan Isya berjamaah di Masjid Nabawi.', 'Masjid Nabawi Madinah', 6);
  INSERT INTO public.agenda_items (tenant_id, keberangkatan_id, tanggal, jam_mulai, judul, deskripsi, lokasi, urutan)
  VALUES (v_tenant_id, v_batch_id, '2026-11-07', '19:30:00', 'Raudhah Akhwat (Tentatif) & Kajian Bahasa Indonesia (Pintu 19)', 'Raudhah bagi jamaah akhwat sesuai jadwal Tasreh (tentatif). Jamaah ikhwan mengikuti kajian Bahasa Indonesia di Masjid Nabawi sekitar Pintu 19.', 'Masjid Nabawi Pintu 19', 7);
  INSERT INTO public.agenda_items (tenant_id, keberangkatan_id, tanggal, jam_mulai, judul, deskripsi, lokasi, urutan)
  VALUES (v_tenant_id, v_batch_id, '2026-11-07', '21:00:00', 'Makan Malam di Hotel & Istirahat', 'Makan malam di restoran hotel dan istirahat.', 'Hotel Madinah', 8);
  INSERT INTO public.agenda_items (tenant_id, keberangkatan_id, tanggal, jam_mulai, judul, deskripsi, lokasi, urutan)
  VALUES (v_tenant_id, v_batch_id, '2026-11-08', '04:30:00', 'Sholat Subuh & Sarapan Pagi', 'Sholat Subuh berjamaah di Masjid Nabawi dan sarapan pagi di hotel.', 'Masjid Nabawi & Hotel Madinah', 1);
  INSERT INTO public.agenda_items (tenant_id, keberangkatan_id, tanggal, jam_mulai, judul, deskripsi, lokasi, urutan)
  VALUES (v_tenant_id, v_batch_id, '2026-11-08', '07:00:00', 'City Tour Kota Madinah (Ziarah Luar)', 'Ziarah ke Jabal Uhud, Masjid Quba, Pasar Kurma, Masjid Khandaq, dan Masjid Qiblatain (tentatif).', 'Jabal Uhud & Masjid Quba Madinah', 2);
  INSERT INTO public.agenda_items (tenant_id, keberangkatan_id, tanggal, jam_mulai, judul, deskripsi, lokasi, urutan)
  VALUES (v_tenant_id, v_batch_id, '2026-11-08', '12:15:00', 'Sholat Dzuhur Berjamaah, Makan Siang & Istirahat', 'Sholat Dzuhur berjamaah, makan siang, dan istirahat di hotel.', 'Hotel Madinah', 3);
  INSERT INTO public.agenda_items (tenant_id, keberangkatan_id, tanggal, jam_mulai, judul, deskripsi, lokasi, urutan)
  VALUES (v_tenant_id, v_batch_id, '2026-11-08', '15:30:00', 'Sholat Ashar Berjamaah di Masjid Nabawi', 'Sholat Ashar berjamaah di Masjid Nabawi.', 'Masjid Nabawi Madinah', 4);
  INSERT INTO public.agenda_items (tenant_id, keberangkatan_id, tanggal, jam_mulai, judul, deskripsi, lokasi, urutan)
  VALUES (v_tenant_id, v_batch_id, '2026-11-08', '16:30:00', 'Pasar Serba 1 Riyal & Berbelanja Oleh-oleh (Tentatif)', 'Mengunjungi Pasar Serba 1 Riyal untuk berbelanja oleh-oleh.', 'Pusat Perbelanjaan Madinah', 5);
  INSERT INTO public.agenda_items (tenant_id, keberangkatan_id, tanggal, jam_mulai, judul, deskripsi, lokasi, urutan)
  VALUES (v_tenant_id, v_batch_id, '2026-11-08', '18:00:00', 'Sholat Maghrib & Isya Berjamaah, Kajian & Ibadah Malam', 'Sholat Maghrib dan Isya berjamaah di Masjid Nabawi, dilanjutkan kajian serta ibadah malam.', 'Masjid Nabawi Madinah', 6);
  INSERT INTO public.agenda_items (tenant_id, keberangkatan_id, tanggal, jam_mulai, judul, deskripsi, lokasi, urutan)
  VALUES (v_tenant_id, v_batch_id, '2026-11-08', '20:30:00', 'Makan Malam & Istirahat', 'Makan malam di restoran hotel dan istirahat.', 'Hotel Madinah', 7);
  INSERT INTO public.agenda_items (tenant_id, keberangkatan_id, tanggal, jam_mulai, judul, deskripsi, lokasi, urutan)
  VALUES (v_tenant_id, v_batch_id, '2026-11-09', '04:30:00', 'Sholat Subuh Berjamaah & Koper di Depan Kamar', 'Sholat Subuh berjamaah di Masjid Nabawi. Koper bagasi sudah dipacking dan diletakkan di depan kamar setelah Subuh.', 'Masjid Nabawi & Hotel Madinah', 1);
  INSERT INTO public.agenda_items (tenant_id, keberangkatan_id, tanggal, jam_mulai, judul, deskripsi, lokasi, urutan)
  VALUES (v_tenant_id, v_batch_id, '2026-11-09', '07:00:00', 'Sarapan Pagi & Persiapan Check-out Hotel', 'Sarapan pagi di hotel dan pengecekan akhir barang-barang pribadi agar tidak ada yang tertinggal.', 'Hotel Madinah', 2);
  INSERT INTO public.agenda_items (tenant_id, keberangkatan_id, tanggal, jam_mulai, judul, deskripsi, lokasi, urutan)
  VALUES (v_tenant_id, v_batch_id, '2026-11-09', '10:00:00', 'Check-out Hotel Madinah', 'Proses check-out hotel pukul 10:00 dan seluruh jamaah berkumpul di lobby hotel.', 'Lobby Hotel Madinah', 3);
  INSERT INTO public.agenda_items (tenant_id, keberangkatan_id, tanggal, jam_mulai, judul, deskripsi, lokasi, urutan)
  VALUES (v_tenant_id, v_batch_id, '2026-11-09', '12:00:00', 'Makan Siang di Restoran Romansia & Ramah Tamah', 'Makan siang bersama seluruh rombongan di Restoran Romansia serta ramah tamah.', 'Restoran Romansia Madinah', 4);
  INSERT INTO public.agenda_items (tenant_id, keberangkatan_id, tanggal, jam_mulai, judul, deskripsi, lokasi, urutan)
  VALUES (v_tenant_id, v_batch_id, '2026-11-09', '13:30:00', 'Perjalanan Menuju Bandara Jeddah', 'Perjalanan dengan bus menuju Bandara Internasional King Abdulaziz Jeddah.', 'Madinah : Bandara Internasional King Abdulaziz Jeddah', 5);
  INSERT INTO public.agenda_items (tenant_id, keberangkatan_id, tanggal, jam_mulai, judul, deskripsi, lokasi, urutan)
  VALUES (v_tenant_id, v_batch_id, '2026-11-09', '14:30:00', 'Proses Imigrasi & Check-in', 'Drop bagasi, check-in tiket pesawat, pemeriksaan imigrasi kepulangan, dan menuju gate boarding.', 'Bandara Internasional King Abdulaziz Jeddah', 6);
  INSERT INTO public.agenda_items (tenant_id, keberangkatan_id, tanggal, jam_mulai, judul, deskripsi, lokasi, urutan)
  VALUES (v_tenant_id, v_batch_id, '2026-11-09', '17:05:00', 'Take Off Menuju Jakarta (CGK) - Garuda Indonesia GA 969', 'Penerbangan langsung (direct) menuju Jakarta dengan Garuda Indonesia GA 969.', 'Pesawat Garuda Indonesia GA 969', 7);
  INSERT INTO public.agenda_items (tenant_id, keberangkatan_id, tanggal, jam_mulai, judul, deskripsi, lokasi, urutan)
  VALUES (v_tenant_id, v_batch_id, '2026-11-10', '06:35:00', 'Landing di Bandara Internasional Soekarno-Hatta (CGK) Terminal 2', 'Pesawat Garuda Indonesia GA 969 mendarat di Bandara Internasional Soekarno-Hatta Terminal 2.', 'Bandara Internasional Soekarno-Hatta Terminal 2 (CGK)', 1);
  INSERT INTO public.agenda_items (tenant_id, keberangkatan_id, tanggal, jam_mulai, judul, deskripsi, lokasi, urutan)
  VALUES (v_tenant_id, v_batch_id, '2026-11-10', '07:30:00', 'Pemeriksaan Imigrasi Kedatangan & Pengambilan Bagasi', 'Pemeriksaan paspor di imigrasi kedatangan dan pengambilan koper bagasi.', 'Baggage Claim Terminal 2 Soekarno-Hatta', 2);
  INSERT INTO public.agenda_items (tenant_id, keberangkatan_id, tanggal, jam_mulai, judul, deskripsi, lokasi, urutan)
  VALUES (v_tenant_id, v_batch_id, '2026-11-10', '08:30:00', 'Penutup Perjalanan, Pembagian Air Zamzam & Doa Bersama', 'Pembagian air Zamzam dan bingkisan dokumentasi Dreammecca, ucapan perpisahan dan doa penutup. Jamaah kembali ke rumah masing-masing.', 'Terminal 2 Soekarno-Hatta', 3);

END $$;

-- ==============================================================================
-- QUERY VERIFIKASI HASIL
-- ==============================================================================

-- 1. Verifikasi Batch Keberangkatan November 2026
SELECT id, nama_batch, tanggal_keberangkatan, tanggal_kepulangan, hotel_makkah, hotel_madinah, meeting_point, guide_name, tour_leader_name, aktif
FROM public.keberangkatan
WHERE id = '5c0aecaa-5f2a-46bd-a59f-53048aed0489'::UUID;

-- 2. Verifikasi 23 Jamaah + 2 Petugas
SELECT nomor_jamaah, nama, hotel_makkah, hotel_madinah, rombongan, fase
FROM public.jamaah_accounts
WHERE keberangkatan_id = '5c0aecaa-5f2a-46bd-a59f-53048aed0489'::UUID
ORDER BY nomor_jamaah ASC;

-- 3. Verifikasi Jumlah Agenda per Hari (Total 9 Hari)
SELECT tanggal, count(*) AS jumlah_kegiatan, min(jam_mulai) AS jam_pertama, max(jam_mulai) AS jam_terakhir
FROM public.agenda_items
WHERE keberangkatan_id = '5c0aecaa-5f2a-46bd-a59f-53048aed0489'::UUID
GROUP BY tanggal
ORDER BY tanggal ASC;
