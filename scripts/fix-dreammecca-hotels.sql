-- Final mapping hotel Dreammecca, Agustus 2026.
-- Semua 21 jamaah di bawah berada dalam SATU batch Agustus.
-- Hotel batch adalah default; tiga pengecualian memakai override per jamaah.

ALTER TABLE public.jamaah_accounts
  ADD COLUMN IF NOT EXISTS hotel_makkah TEXT,
  ADD COLUMN IF NOT EXISTS hotel_madinah TEXT;

DO $$
DECLARE
  v_tenant_id UUID;
  v_batch_id UUID;
BEGIN
  SELECT id INTO v_tenant_id
  FROM public.tenants
  WHERE lower(slug) = 'dreammecca'
  LIMIT 1;

  IF v_tenant_id IS NULL THEN
    RAISE EXCEPTION 'Tenant dreammecca was not found';
  END IF;

  SELECT id INTO v_batch_id
  FROM public.keberangkatan
  WHERE tenant_id = v_tenant_id
    AND nama_batch = 'Umroh Eksklusif - Pullman Zamzam & Al Ansor'
  LIMIT 1;

  IF v_batch_id IS NULL THEN
    INSERT INTO public.keberangkatan (
      tenant_id, nama_batch, tanggal_keberangkatan, tanggal_kepulangan,
      hotel_makkah, hotel_madinah, meeting_point, aktif
    ) VALUES (
      v_tenant_id, 'Umroh Eksklusif - Pullman Zamzam & Al Ansor',
      '2026-08-17', '2026-08-25',
      'Makkah Pullman Zamzam', 'Madinah Al Ansor Golden Tulip',
      'Lobby Utama Hotel', true
    ) RETURNING id INTO v_batch_id;
  ELSE
    UPDATE public.keberangkatan
    SET tanggal_keberangkatan = '2026-08-17',
        tanggal_kepulangan = '2026-08-25',
        hotel_makkah = 'Makkah Pullman Zamzam',
        hotel_madinah = 'Madinah Al Ansor Golden Tulip',
        aktif = true
    WHERE id = v_batch_id;
  END IF;

  -- 18 jamaah mengikuti hotel default batch.
  UPDATE public.jamaah_accounts
  SET keberangkatan_id = v_batch_id, hotel_makkah = NULL, hotel_madinah = NULL
  WHERE tenant_id = v_tenant_id
    AND upper(regexp_replace(trim(nama), '\s+', ' ', 'g')) IN (
      'OHORELLA ABDULLAH SUKUR', 'SHEILLA SYLVIA', 'ROMLI UDIN SUHENDI',
      'EDIH UDIN', 'LILIS UDIN MISNA', 'LENI HERLINA', 'NANANG SUHERMAN',
      'WINA KARLINA', 'NAUFAL FADHIL MUHAMAD', 'CORINNA FITRIANA SITI ROHIDA',
      'M. RHESTU RAMADHAN', 'M. RHEZA PAHLEVI', 'ERIKA SHAQUEENA MECCA',
      'KURNIAWAN BANDARUDIN', 'NATALIA INDHARINI', 'INTAN DWI LESTARI',
      'NUR ASIYAH', 'DREAMMECCA'
    );

  -- Tiga pengecualian tetap di batch yang sama, hotelnya per jamaah.
  UPDATE public.jamaah_accounts
  SET keberangkatan_id = v_batch_id,
      hotel_makkah = 'Makkah Sofwah The First Tower Hotel',
      hotel_madinah = 'Madinah Al-Ansr Golden Tulip'
  WHERE tenant_id = v_tenant_id
    AND upper(regexp_replace(trim(nama), '\s+', ' ', 'g')) IN ('RENI SEPTIANA', 'NABILA DWI PUTRI');

  UPDATE public.jamaah_accounts
  SET keberangkatan_id = v_batch_id,
      hotel_makkah = 'Makkah Pullman Zamzam',
      hotel_madinah = 'Madinah Millenium Al-Aqeeq'
  WHERE tenant_id = v_tenant_id
    AND upper(regexp_replace(trim(nama), '\s+', ' ', 'g')) = 'DARMIATI AIDA EFFENDI';
END $$;

-- Verifikasi: ketiga nama harus memakai batch Agustus yang sama.
SELECT j.nama, k.nama_batch, k.tanggal_keberangkatan, k.tanggal_kepulangan,
  COALESCE(j.hotel_makkah, k.hotel_makkah) AS hotel_makkah,
  COALESCE(j.hotel_madinah, k.hotel_madinah) AS hotel_madinah
FROM public.jamaah_accounts j
JOIN public.keberangkatan k ON k.id = j.keberangkatan_id
WHERE lower(j.nama) IN ('reni septiana', 'nabila dwi putri', 'darmiati aida effendi')
ORDER BY j.nama;
