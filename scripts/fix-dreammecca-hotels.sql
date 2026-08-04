-- Final hotel mapping for tenant /t/dreammecca.
--
-- Run this in Supabase SQL Editor. It is idempotent and uses UUID variables,
-- so it is safe to re-run. It only changes the named jamaah below.

ALTER TABLE public.jamaah_accounts
  ADD COLUMN IF NOT EXISTS hotel_makkah TEXT,
  ADD COLUMN IF NOT EXISTS hotel_madinah TEXT;

DO $$
DECLARE
  v_tenant_id UUID;
  v_default_id UUID;
  v_sofwah_id UUID;
  v_millenium_id UUID;
BEGIN
  SELECT id INTO v_tenant_id
  FROM public.tenants
  WHERE lower(slug) = 'dreammecca'
  LIMIT 1;

  IF v_tenant_id IS NULL THEN
    RAISE EXCEPTION 'Tenant with slug dreammecca was not found';
  END IF;

  -- Default hotel pair for the 18 named jamaah below.
  SELECT id INTO v_default_id
  FROM public.keberangkatan
  WHERE tenant_id = v_tenant_id
    AND nama_batch = 'Umroh Eksklusif - Pullman Zamzam & Al Ansor'
  LIMIT 1;

  IF v_default_id IS NULL THEN
    INSERT INTO public.keberangkatan (
      tenant_id, nama_batch, tanggal_keberangkatan, tanggal_kepulangan,
      hotel_makkah, hotel_madinah, meeting_point, aktif
    ) VALUES (
      v_tenant_id, 'Umroh Eksklusif - Pullman Zamzam & Al Ansor',
      '2026-08-17', '2026-08-25',
      'Makkah Pullman Zamzam', 'Madinah Al Ansor Golden Tulip',
      'Lobby Utama Hotel', true
    ) RETURNING id INTO v_default_id;
  ELSE
    UPDATE public.keberangkatan
    SET hotel_makkah = 'Makkah Pullman Zamzam',
        hotel_madinah = 'Madinah Al Ansor Golden Tulip',
        aktif = true
    WHERE id = v_default_id;
  END IF;

  SELECT id INTO v_sofwah_id
  FROM public.keberangkatan
  WHERE tenant_id = v_tenant_id
    AND nama_batch = 'Umroh Eksklusif (17 - 25 Agustus 2026)'
  LIMIT 1;

  IF v_sofwah_id IS NULL THEN
    RAISE EXCEPTION 'Sofwah batch was not found';
  END IF;

  UPDATE public.keberangkatan
  SET hotel_makkah = 'Makkah Sofwah The First Tower Hotel',
      hotel_madinah = 'Madinah Al-Ansr Golden Tulip',
      aktif = true
  WHERE id = v_sofwah_id;

  SELECT id INTO v_millenium_id
  FROM public.keberangkatan
  WHERE tenant_id = v_tenant_id
    AND nama_batch = 'Umroh Eksklusif Plus Al - Ula (17 - 25 Agustus 2026)'
  LIMIT 1;

  IF v_millenium_id IS NULL THEN
    RAISE EXCEPTION 'Millenium batch was not found';
  END IF;

  UPDATE public.keberangkatan
  SET hotel_makkah = 'Makkah Pullman Zamzam',
      hotel_madinah = 'Madinah Millenium Al-Aqeeq',
      aktif = true
  WHERE id = v_millenium_id;

  -- 18 names from the supplied list: Pullman Zamzam + Al Ansor Golden Tulip.
  UPDATE public.jamaah_accounts
  SET keberangkatan_id = v_default_id,
      hotel_makkah = NULL,
      hotel_madinah = NULL
  WHERE tenant_id = v_tenant_id
    AND upper(regexp_replace(trim(nama), '\s+', ' ', 'g')) IN (
      'OHORELLA ABDULLAH SUKUR',
      'SHEILLA SYLVIA',
      'ROMLI UDIN SUHENDI',
      'EDIH UDIN',
      'LILIS UDIN MISNA',
      'LENI HERLINA',
      'NANANG SUHERMAN',
      'WINA KARLINA',
      'NAUFAL FADHIL MUHAMAD',
      'CORINNA FITRIANA SITI ROHIDA',
      'M. RHESTU RAMADHAN',
      'M. RHEZA PAHLEVI',
      'ERIKA SHAQUEENA MECCA',
      'KURNIAWAN BANDARUDIN',
      'NATALIA INDHARINI',
      'INTAN DWI LESTARI',
      'NUR ASIYAH',
      'DREAMMECCA'
    );

  -- Named exceptions.
  UPDATE public.jamaah_accounts
  SET keberangkatan_id = v_sofwah_id,
      hotel_makkah = NULL,
      hotel_madinah = NULL
  WHERE tenant_id = v_tenant_id
    AND upper(regexp_replace(trim(nama), '\s+', ' ', 'g')) IN (
      'RENI SEPTIANA',
      'NABILA DWI PUTRI'
    );

  UPDATE public.jamaah_accounts
  SET keberangkatan_id = v_millenium_id,
      hotel_makkah = NULL,
      hotel_madinah = NULL
  WHERE tenant_id = v_tenant_id
    AND upper(regexp_replace(trim(nama), '\s+', ' ', 'g')) = 'DARMIATI AIDA EFFENDI';
END $$;

-- Verification of the 20 listed names plus Darmiati.
SELECT
  j.nama,
  k.nama_batch,
  COALESCE(j.hotel_makkah, k.hotel_makkah, t.hotel_makkah) AS effective_hotel_makkah,
  COALESCE(j.hotel_madinah, k.hotel_madinah, t.hotel_madinah) AS effective_hotel_madinah
FROM public.jamaah_accounts j
JOIN public.tenants t ON t.id = j.tenant_id
LEFT JOIN public.keberangkatan k ON k.id = j.keberangkatan_id
WHERE lower(t.slug) = 'dreammecca'
  AND upper(regexp_replace(trim(j.nama), '\s+', ' ', 'g')) IN (
    'OHORELLA ABDULLAH SUKUR', 'SHEILLA SYLVIA', 'ROMLI UDIN SUHENDI',
    'EDIH UDIN', 'LILIS UDIN MISNA', 'LENI HERLINA', 'NANANG SUHERMAN',
    'WINA KARLINA', 'NAUFAL FADHIL MUHAMAD', 'CORINNA FITRIANA SITI ROHIDA',
    'M. RHESTU RAMADHAN', 'M. RHEZA PAHLEVI', 'ERIKA SHAQUEENA MECCA',
    'RENI SEPTIANA', 'NABILA DWI PUTRI', 'KURNIAWAN BANDARUDIN',
    'NATALIA INDHARINI', 'INTAN DWI LESTARI', 'NUR ASIYAH', 'DREAMMECCA',
    'DARMIATI AIDA EFFENDI'
  )
ORDER BY j.nama;
