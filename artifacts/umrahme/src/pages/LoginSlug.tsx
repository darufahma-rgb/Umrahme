import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validasiSlug } from '../data/jamaah';
import { fetchTenantBySlug, type TenantRow } from '../lib/supabase';
import heroBg from '@assets/photo-1635829576353-1a14caec2f6f_1781969073425.avif';

export default function LoginSlug() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { login } = useAuth();

  const [tenant, setTenant] = useState<TenantRow | null>(null);
  const [tenantLoading, setTenantLoading] = useState(true);
  const [nama, setNama] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!slug) return;
    fetchTenantBySlug(slug)
      .then((t) => setTenant(t))
      .catch(() => setTenant(null))
      .finally(() => setTenantLoading(false));
  }, [slug]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!slug) return;
    setLoading(true);
    setError('');
    try {
      const hasil = await validasiSlug(slug, nama);
      if (hasil.ok && hasil.jamaah && hasil.tenant) {
        login(hasil.jamaah, hasil.tenant, hasil.keberangkatan ?? null);
        navigate('/beranda', { replace: true });
      } else {
        setError(hasil.error ?? 'Gagal masuk.');
        setLoading(false);
      }
    } catch {
      setError('Tidak dapat terhubung. Periksa koneksi internet Anda.');
      setLoading(false);
    }
  }

  if (tenantLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0efed]">
        <p className="font-mono text-[13px] tracking-widest text-stone-400 uppercase animate-pulse">Memuat…</p>
      </div>
    );
  }

  if (!tenant) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#f0efed] text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone-400 mb-3">404</p>
        <h1 className="text-[20px] font-bold text-stone-800 mb-2">Travel tidak ditemukan</h1>
        <p className="text-[14px] text-stone-500 max-w-xs">
          Periksa kembali link yang Anda terima dari travel Anda.
        </p>
      </div>
    );
  }

  const brandColor = tenant.primary_color || '#111111';
  const brandDeep  = tenant.primary_deep_color || '#111111';

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f2ef] p-0 sm:p-8">
      <div className="relative w-full sm:max-w-[430px] min-h-screen sm:min-h-0 sm:rounded-[20px] sm:shadow-[0_22px_60px_rgba(28,35,32,0.16)] overflow-hidden" style={{ background: '#fff' }}>

        {/* Background foto Masjidil Haram */}
        <img
          src={tenant.hero_image_url || heroBg}
          alt=""
          aria-hidden
          className="relative block h-auto w-full pointer-events-none"
          style={{ objectPosition: 'center top', background: brandDeep }}
        />

        {/* Gradient gelap di atas */}
        <div className="hidden"
          style={{ background: 'linear-gradient(180deg, rgba(10,24,25,0.74) 0%, rgba(10,24,25,0.28) 65%, rgba(10,24,25,0.02) 100%)' }}
        />

        {/* Header — logo + nama travel */}
        <div className="hidden">
          {tenant.logo_url && (
            <img
              src={tenant.logo_url}
              alt={tenant.nama_travel}
              className="h-12 w-auto object-contain drop-shadow-md"
            />
          )}
          <div className="text-center">
            <p className="font-mono text-[9px] uppercase tracking-[0.28em]"
              style={{ color: 'rgba(255,255,255,0.60)', textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
              Aplikasi Jamaah
            </p>
            <h1 className="font-bold text-white mt-2"
              style={{ fontSize: 'clamp(21px, 5.7vw, 27px)', textShadow: '0 2px 12px rgba(0,0,0,0.45)' }}>
              {tenant.nama_travel}
            </h1>
          </div>
        </div>

        {/* Spacer — jendela foto */}

        {/* Form sheet putih */}
        <div className="relative flex flex-col px-7 pb-8 pt-8 sm:px-8"
          style={{ marginTop: '-26px', borderRadius: '20px 20px 0 0', background: '#fff', zIndex: 1 }}>

          <div className="text-center mb-4">
            <h2 className="font-sans font-bold text-ink" style={{ fontSize: 'clamp(23px, 6vw, 29px)' }}>
              Selamat Datang!
            </h2>
            <p className="mt-0.5 text-[13px] text-charcoal">Masukkan nama Anda untuk masuk.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 flex-1">

            {/* Input nama */}
            <div className="rounded-xl border px-4 py-3.5"
              style={{ borderColor: 'rgba(0,0,0,0.14)', background: '#fff' }}>
              <p className="font-mono text-[8.5px] uppercase tracking-[0.20em] text-mute mb-1.5">
                Nama Jamaah
              </p>
              <input
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="nama sesuai paspor"
                autoComplete="name"
                autoFocus
                className="w-full bg-transparent text-[15px] text-ink placeholder:text-stone-300 focus:outline-none"
              />
            </div>

            {/* Error */}
            {error && (
              <div role="alert"
                className="flex items-start gap-2.5 rounded-2xl px-4 py-3"
                style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.16)' }}>
                <span className="flex-none mt-0.5 h-4 w-4 flex items-center justify-center rounded-full bg-red-500/15 text-red-500 font-bold text-[10px]">!</span>
                <p className="text-[12.5px] leading-relaxed text-red-700">{error}</p>
              </div>
            )}

            {/* Tombol masuk */}
            <button
              type="submit"
              disabled={loading || !nama.trim()}
              className="w-full flex items-center justify-center gap-2 rounded-xl text-[15px] font-bold text-white transition-all active:scale-[0.98] disabled:opacity-40"
              style={{
                minHeight: '52px',
                background: loading || !nama.trim() ? 'rgba(0,0,0,0.18)' : brandColor,
                boxShadow: loading || !nama.trim() ? 'none' : `0 4px 16px ${brandDeep}55`,
              }}
            >
              {loading ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Memeriksa…
                </>
              ) : 'Masuk'}
            </button>

            {/* Link ke login kode aktivasi */}
            <p className="text-center text-[12px] text-ash pt-1">
              Punya kode aktivasi?{' '}
              <a href="/login" className="font-semibold hover:underline underline-offset-2" style={{ color: brandColor }}>
                Login di sini
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
