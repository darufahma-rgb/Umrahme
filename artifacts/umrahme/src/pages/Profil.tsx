import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PhaseIndicator from '../components/PhaseIndicator';
import { IconCheck, IconSertifikat, IconChevron, IconJurnal } from '../components/icons';
import { getJamaahData, setJamaahData, submitJamaahFeedback } from '../lib/supabase';

export default function Profil() {
  const { jamaah, tenant, logout } = useAuth();
  const navigate = useNavigate();
  const photoInputRef = useRef<HTMLInputElement>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState('');
  const [rating, setRating] = useState(0);
  const [komentar, setKomentar] = useState('');
  const [feedbackState, setFeedbackState] = useState('');
  useEffect(() => {
    if (!tenant?.id || !jamaah?.nomorJamaah) return;
    getJamaahData<string>(tenant.id, jamaah.nomorJamaah, 'foto_profil')
      .then((foto) => setPhotoUrl(foto))
      .catch(() => {});
  }, [tenant?.id, jamaah?.nomorJamaah]);

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setPhotoError('');
    if (!file.type.startsWith('image/') || file.size > 1024 * 1024) {
      setPhotoError('Gunakan foto JPG, PNG, atau WebP dengan ukuran maksimal 1 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const foto = typeof reader.result === 'string' ? reader.result : null;
      if (!foto) return;
      setPhotoUrl(foto);
      if (tenant?.id && jamaah?.nomorJamaah) setJamaahData(tenant.id, jamaah.nomorJamaah, 'foto_profil', foto).catch(() => {
        setPhotoError('Foto tersimpan di perangkat, tetapi belum tersinkron.');
      });
    };
    reader.readAsDataURL(file);
  };

  if (!jamaah) return null;

  const kirimFeedback = async () => {
    if (!tenant?.id || !rating) return;
    setFeedbackState('Mengirim...');
    try {
      await submitJamaahFeedback(tenant.id, jamaah.nomorJamaah, rating, komentar);
      setFeedbackState('Terima kasih, penilaian Anda sudah diterima.');
    } catch {
      setFeedbackState('Penilaian belum terkirim. Coba lagi.');
    }
  };

  const inisial = jamaah.nama
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  const menuItems = [
    {
      to: '/profil/persiapan',
      Icon: IconCheck,
      label: 'Persiapan',
      desc: 'Checklist sebelum berangkat',
    },
    {
      to: '/profil/jurnal',
      Icon: IconJurnal,
      label: 'Jurnal & Kenangan',
      desc: 'Catatan harian & galeri foto perjalanan',
    },
    {
      to: '/profil/sertifikat',
      Icon: IconSertifikat,
      label: 'Sertifikat Digital',
      desc: 'Kenang-kenangan umrah',
    },
  ];

  const faseLabel =
    jamaah.fase === 'persiapan'
      ? 'Persiapan Keberangkatan'
      : jamaah.fase === 'tanah-suci'
        ? 'Di Tanah Suci'
        : 'Ibadah Selesai';

  return (
    <div className="mx-auto max-w-5xl px-5 pb-8 pt-8 lg:px-10 lg:pb-12 lg:pt-10">
      <header className="mb-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">Akun Jamaah</p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-[-1px] text-ink lg:text-4xl">Profil</h1>
      </header>

      <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr] lg:gap-6">
        <section className="rounded-xl p-5 text-white lg:p-6" style={{ background: 'var(--color-primary-deep)' }}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-center gap-3.5">
              <button
                type="button"
                onClick={() => photoInputRef.current?.click()}
                className="relative flex h-14 w-14 flex-none items-center justify-center overflow-hidden rounded-full bg-white/15 text-lg font-extrabold text-white ring-1 ring-white/20"
                aria-label="Ubah foto profil"
              >
                {photoUrl ? <img src={photoUrl} alt="" className="h-full w-full object-cover" /> : inisial}
                <span className="absolute inset-x-0 bottom-0 bg-black/40 py-0.5 text-[7px] font-semibold uppercase tracking-wide">Ubah</span>
              </button>
              <input ref={photoInputRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handlePhotoChange} />
              <div className="min-w-0">
                <h2 className="truncate text-[20px] font-extrabold leading-tight">{jamaah.nama}</h2>
                <p className="mt-1 text-[11px] font-medium tracking-[0.12em] text-white/65">{jamaah.nomorJamaah}</p>
              </div>
            </div>
            <span className="flex-none rounded-full bg-white/15 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-white">
              Aktif
            </span>
          </div>
          <div className="mt-6 border-t border-white/20 pt-3">
            <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-white/55">Travel Anda</p>
            <p className="mt-1 text-[14px] font-semibold text-white">{tenant?.nama_travel ?? jamaah.travel}</p>
            {photoError && <p className="mt-2 text-[11px] leading-relaxed text-white/75">{photoError}</p>}
          </div>
        </section>

        <section className="border border-hairline bg-surface-card px-5 py-5 lg:px-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-mute">Perjalanan Anda</p>
              <p className="mt-1 text-[16px] font-bold text-ink">{faseLabel}</p>
            </div>
            <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold text-primary">Fase aktif</span>
          </div>
          <div className="mt-5">
            <PhaseIndicator fase={jamaah.fase} />
          </div>
          <p className="mt-4 border-t border-hairline pt-3 text-[12px] leading-relaxed text-charcoal">
            Status perjalanan diperbarui mengikuti jadwal dari travel.
          </p>
        </section>
      </div>

      <section className="mt-7">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-mute">Ruang Pribadi</p>
            <h2 className="mt-1 text-[18px] font-bold text-ink">Perjalanan Anda</h2>
          </div>
        </div>
        <div className="grid border-y border-hairline sm:grid-cols-3 sm:divide-x sm:divide-hairline">
          {menuItems.map(({ to, Icon, label, desc }, index) => (
            <Link
              key={to}
              to={to}
              className={`group flex min-h-[112px] items-start gap-3 border-b border-hairline py-4 transition-colors hover:bg-surface-bone/60 sm:border-b-0 sm:px-4 sm:first:pl-0 sm:last:pr-0 ${index === 2 ? 'border-b-0' : ''}`}
            >
              <span className="flex h-9 w-9 flex-none items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="h-[18px] w-[18px]" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[14px] font-bold text-ink">{label}</span>
                <span className="mt-1 block text-[12px] leading-relaxed text-charcoal">{desc}</span>
              </span>
              <IconChevron className="mt-1 h-4 w-4 flex-none text-ash transition-transform group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-7 border-y border-hairline py-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">Penilaian Aplikasi</p>
        <h2 className="mt-1 text-[18px] font-bold text-ink">Bagaimana pengalaman Anda?</h2>
        <div className="mt-4 flex gap-1">
          {[1, 2, 3, 4, 5].map((nilai) => (
            <button key={nilai} type="button" onClick={() => setRating(nilai)} className="h-10 w-10 text-[23px] leading-none" style={{ color: nilai <= rating ? 'var(--color-primary)' : '#d1d5db' }}>{nilai <= rating ? '★' : '☆'}</button>
          ))}
        </div>
        <textarea value={komentar} onChange={(event) => setKomentar(event.target.value)} maxLength={500} placeholder="Tulis masukan bila ada (opsional)" className="mt-3 min-h-[78px] w-full border border-hairline bg-transparent p-3 text-[13px] text-ink outline-none focus:border-primary/40" />
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-[11px] text-mute">{feedbackState}</p>
          <button type="button" disabled={!rating} onClick={() => void kirimFeedback()} className="min-h-[40px] px-4 text-[12px] font-semibold text-white disabled:opacity-40" style={{ background: 'var(--color-primary)' }}>Kirim penilaian</button>
        </div>
      </section>

      <button
        type="button"
        onClick={() => { logout(); navigate('/login', { replace: true }); }}
        className="mt-8 min-h-[44px] text-[13px] font-semibold text-mute transition-colors hover:text-ink"
      >
        Keluar dari akun
      </button>
    </div>
  );
}
