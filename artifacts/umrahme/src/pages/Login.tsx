import { useState, type FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validasiKode, KODE_DEMO } from '../data/jamaah';
import heroBg from '@assets/photo-1635829576353-1a14caec2f6f_1781969073425.avif';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/beranda';

  const [kode, setKode] = useState('');
  const [nama, setNama] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const hasil = await validasiKode(kode, nama);
      if (hasil.ok && hasil.jamaah && hasil.tenant) {
        login(hasil.jamaah, hasil.tenant);
        navigate(from, { replace: true });
      } else {
        setError(hasil.error ?? 'Terjadi kesalahan.');
        setLoading(false);
      }
    } catch {
      setError('Tidak dapat terhubung. Periksa koneksi internet Anda.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0efed] p-0 sm:p-6">
      {/* Card — image is absolute background, content flows on top, no split sections */}
      <div className="relative w-full sm:max-w-[390px] h-screen sm:h-auto flex flex-col sm:rounded-[32px] sm:shadow-[0_16px_64px_rgba(0,0,0,0.14),0_4px_16px_rgba(0,0,0,0.08)] overflow-hidden">

        {/* Background image fills entire card — positioned to show dome + minaret */}
        <img
          src={heroBg}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{ objectPosition: 'center 45%', transform: 'scale(1.04)', transformOrigin: 'center 45%' }}
        />

        {/* Fix 1 — gradient hanya gelap di atas, transparan penuh di bawah */}
        <div className="pointer-events-none absolute inset-0"
          style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.10) 60%, transparent 100%)' }}
        />

        {/* Arabic calligraphy — top section over image */}
        <div className="relative flex flex-col items-center justify-center gap-2 px-8 pt-12 pb-4" style={{ zIndex: 1 }}>
          <p className="font-arab text-center text-white"
            style={{ fontSize: 'clamp(20px, 6vw, 28px)', direction: 'rtl', textShadow: '0 2px 12px rgba(0,0,0,0.6)', lineHeight: 1.7 }}>
            لَبَّيْكَ اللّٰهُمَّ لَبَّيْكَ
          </p>
          <div className="flex items-center gap-2.5">
            <span className="h-px w-6 bg-white/35" />
            <p className="font-mono text-[8.5px] uppercase tracking-[0.30em]" style={{ color: 'rgba(255,255,255,0.60)', textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}>
              Talbiyah
            </p>
            <span className="h-px w-6 bg-white/35" />
          </div>
        </div>

        {/* Spacer — this is the "image window": dome + building shows here */}
        <div className="flex-shrink-0" style={{ height: 'clamp(130px, 30vw, 190px)' }} />

        {/* Fix 2 — form overlap ke atas foto dengan white sheet */}
        <div className="relative flex flex-col flex-1 px-6 pb-6" style={{ paddingTop: '20px', marginTop: '-16px', borderRadius: '24px 24px 0 0', background: 'white', position: 'relative', zIndex: 1 }}>

          {/* Fix 3 — kurangi gap heading */}
          <div className="text-center mb-4">
            <h2 className="font-display font-bold text-ink" style={{ fontSize: 'clamp(22px, 6.5vw, 28px)', letterSpacing: '-0.5px' }}>
              Selamat Datang!
            </h2>
            <p className="mt-0.5 text-[13px] text-charcoal">Masukkan kode aktivasi untuk melanjutkan.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 flex-1">

            {/* Kode Aktivasi */}
            <div className="rounded-2xl border px-4 py-3"
              style={{ borderColor: 'rgba(0,0,0,0.10)', background: '#fafaf9' }}>
              <p className="font-mono text-[8.5px] uppercase tracking-[0.20em] text-mute mb-1.5">Kode Aktivasi</p>
              <input
                id="kode"
                value={kode}
                onChange={(e) => setKode(e.target.value.toUpperCase().trim())}
                placeholder="UMR8X2"
                autoCapitalize="characters"
                autoComplete="off"
                maxLength={20}
                className="w-full bg-transparent font-mono text-[20px] tracking-[0.40em] text-ink placeholder:text-stone/35 focus:outline-none"
              />
            </div>

            {/* Nama Jamaah */}
            <div className="rounded-2xl border px-4 py-3"
              style={{ borderColor: 'rgba(0,0,0,0.10)', background: '#fafaf9' }}>
              <p className="font-mono text-[8.5px] uppercase tracking-[0.20em] text-mute mb-1.5">Nama Jamaah</p>
              <input
                id="nama"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="nama sesuai paspor"
                autoComplete="name"
                className="w-full bg-transparent text-[15px] text-ink placeholder:text-stone/45 focus:outline-none"
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

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !kode || !nama}
              className="w-full flex items-center justify-center gap-2 rounded-2xl text-[15px] font-bold text-white transition-all active:scale-[0.98] disabled:opacity-50"
              style={{
                minHeight: '52px',
                background: loading || !kode || !nama ? 'rgba(0,0,0,0.18)' : '#111111',
                boxShadow: loading || !kode || !nama ? 'none' : '0 4px 16px rgba(0,0,0,0.20)',
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

            {/* Demo hint */}
            <p className="text-center text-[12px] text-ash pt-1">
              Demo:{' '}
              <button
                type="button"
                onClick={() => setKode(KODE_DEMO)}
                className="font-mono font-bold text-primary hover:underline underline-offset-2"
              >
                {KODE_DEMO}
              </button>
              {' '}+ nama terdaftar
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
