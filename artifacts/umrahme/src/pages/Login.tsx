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
      <div className="w-full sm:max-w-[390px] h-screen sm:h-auto flex flex-col sm:rounded-[32px] sm:shadow-[0_16px_64px_rgba(0,0,0,0.14),0_4px_16px_rgba(0,0,0,0.08)] overflow-hidden bg-white">

        {/* Hero — image + gradient fade, no hard bottom edge */}
        <div className="relative w-full flex-shrink-0" style={{ height: 'clamp(260px, 56vw, 340px)' }}>
          <img
            src={heroBg}
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: 'center 35%', transform: 'scale(1.08)', transformOrigin: 'center 38%' }}
          />
          {/* Dark overlay for top text readability */}
          <div className="pointer-events-none absolute inset-0"
            style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.44) 0%, rgba(0,0,0,0.12) 38%, transparent 58%)' }} />
          {/* Smooth white fade covers the entire bottom half */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0"
            style={{ height: '60%', background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.55) 30%, rgba(255,255,255,0.88) 58%, rgba(255,255,255,1) 78%, rgba(255,255,255,1) 100%)' }} />

          {/* Arabic calligraphy — positioned in top 55% */}
          <div className="absolute inset-x-0 top-0 flex flex-col items-center justify-center gap-2 px-8" style={{ height: '55%' }}>
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
        </div>

        {/* Form area — overlaps hero with negative margin for seamless flow */}
        <div className="flex flex-col flex-1 px-6 pb-6 bg-white" style={{ marginTop: '-56px', position: 'relative', zIndex: 10, paddingTop: '0' }}>

          {/* Heading */}
          <div className="text-center mb-5">
            <h2 className="font-display font-bold text-ink" style={{ fontSize: 'clamp(22px, 6.5vw, 28px)', letterSpacing: '-0.5px' }}>
              Selamat Datang!
            </h2>
            <p className="mt-1 text-[13px] text-charcoal">Masukkan kode aktivasi untuk melanjutkan.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 flex-1">

            {/* Kode Aktivasi */}
            <div className="rounded-2xl border px-4 py-3.5"
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
            <div className="rounded-2xl border px-4 py-3.5"
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
                background: loading || !kode || !nama ? '#9ca3af' : '#111111',
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
