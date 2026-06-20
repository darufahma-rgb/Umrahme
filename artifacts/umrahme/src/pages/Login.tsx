import { useState, type FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validasiKode, KODE_DEMO } from '../data/jamaah';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/beranda';

  const [kode, setKode] = useState('');
  const [nama, setNama] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const hasil = validasiKode(kode, nama);
      if (hasil.ok && hasil.jamaah) {
        login(hasil.jamaah);
        navigate(from, { replace: true });
      } else {
        setError(hasil.error ?? 'Terjadi kesalahan.');
        setLoading(false);
      }
    }, 450);
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: '#f0efed' }}
    >
      {/* ── Card wrapper ── */}
      <div
        className="w-full overflow-hidden"
        style={{
          maxWidth: '400px',
          borderRadius: '28px',
          background: '#ffffff',
          boxShadow: '0 8px 48px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
        }}
      >
        {/* ── Hero image area ── */}
        <div
          className="relative w-full overflow-hidden"
          style={{
            height: '52vw',
            maxHeight: '260px',
            minHeight: '200px',
          }}
        >
          {/* Base gradient: warm golden sunrise → deep sky blue */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(180deg, #f5a623 0%, #e8720c 18%, #c0392b 32%, #7b5ea7 52%, #3a7bd5 72%, #a8d8ea 90%, #f0f8ff 100%)',
            }}
          />

          {/* Soft radial light bloom at top center (sun glow) */}
          <div
            className="pointer-events-none absolute"
            style={{
              top: '-20%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '140%',
              height: '80%',
              background: 'radial-gradient(ellipse at 50% 30%, rgba(255,220,100,0.55) 0%, rgba(255,140,50,0.25) 40%, transparent 70%)',
            }}
          />

          {/* Atmospheric haze in the middle */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background: 'linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.22) 80%, rgba(255,255,255,0.55) 100%)',
            }}
          />

          {/* Subtle cloud wisps */}
          <div
            className="pointer-events-none absolute"
            style={{
              top: '38%',
              left: '-10%',
              width: '55%',
              height: '22%',
              background: 'radial-gradient(ellipse, rgba(255,255,255,0.35) 0%, transparent 70%)',
              borderRadius: '50%',
              filter: 'blur(8px)',
            }}
          />
          <div
            className="pointer-events-none absolute"
            style={{
              top: '30%',
              right: '-5%',
              width: '45%',
              height: '18%',
              background: 'radial-gradient(ellipse, rgba(255,255,255,0.28) 0%, transparent 70%)',
              borderRadius: '50%',
              filter: 'blur(10px)',
            }}
          />

          {/* Arabic calligraphy over gradient */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6"
            style={{ paddingBottom: '12px' }}
          >
            <p
              className="font-arab text-center drop-shadow-sm"
              style={{
                fontSize: 'clamp(26px, 9vw, 40px)',
                direction: 'rtl',
                color: '#1a0a00',
                textShadow: '0 1px 12px rgba(255,220,80,0.50), 0 2px 4px rgba(0,0,0,0.15)',
              }}
            >
              لَبَّيْكَ اللّٰهُمَّ لَبَّيْكَ
            </p>
            <div className="flex items-center gap-3">
              <span className="h-px w-8" style={{ background: 'rgba(80,40,0,0.30)' }} />
              <p
                className="font-mono text-[10px] uppercase tracking-[0.3em]"
                style={{ color: 'rgba(80,40,0,0.60)' }}
              >
                Talbiyah
              </p>
              <span className="h-px w-8" style={{ background: 'rgba(80,40,0,0.30)' }} />
            </div>
          </div>

          {/* Bottom fade into white card body */}
          <div
            className="absolute bottom-0 left-0 right-0 pointer-events-none"
            style={{
              height: '40px',
              background: 'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.85) 100%)',
            }}
          />
        </div>

        {/* ── Card body ── */}
        <div className="px-6 pt-6 pb-7">

          {/* Heading */}
          <h2
            className="font-display font-bold leading-tight text-ink"
            style={{ fontSize: 'clamp(20px, 5vw, 26px)' }}
          >
            Selamat datang di Umrahme,<br />
            Pendamping perjalanan Anda!
          </h2>
          <p className="mt-1.5 text-[13px] text-charcoal">
            Masukkan kode aktivasi dari biro travel Anda.
          </p>

          <form onSubmit={handleSubmit} className="mt-5 space-y-3">

            {/* Kode Aktivasi row — styled like the "photo + upload" row in reference */}
            <div
              className="flex items-center gap-3 rounded-2xl border px-4 py-3"
              style={{ borderColor: 'rgba(32,32,32,0.10)', background: '#fafaf9' }}
            >
              {/* Icon badge */}
              <div
                className="flex-none flex h-10 w-10 items-center justify-center rounded-xl text-[18px]"
                style={{ background: 'linear-gradient(135deg, #2d1e0a 0%, #1a1208 100%)' }}
              >
                <span className="font-arab text-gold text-[14px]">ك</span>
              </div>
              {/* Input */}
              <div className="flex-1 min-w-0">
                <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-mute mb-0.5">
                  Kode Aktivasi
                </p>
                <input
                  id="kode"
                  value={kode}
                  onChange={(e) => setKode(e.target.value.toUpperCase())}
                  placeholder="UMR8X2"
                  autoCapitalize="characters"
                  autoComplete="off"
                  maxLength={6}
                  className="w-full bg-transparent font-mono text-[17px] tracking-[0.35em] text-ink placeholder:text-stone/40 focus:outline-none"
                />
              </div>
              {/* Character counter */}
              {kode.length > 0 && (
                <span
                  className="flex-none flex h-7 w-7 items-center justify-center rounded-full font-mono text-[11px] font-semibold text-primary"
                  style={{ background: 'rgba(234,40,4,0.08)' }}
                >
                  {kode.length}
                </span>
              )}
            </div>

            {/* Nama Jamaah — styled like "Display Name" field in reference */}
            <div style={{ marginTop: '16px' }}>
              <p className="font-mono text-[11px] uppercase tracking-[0.15em] text-mute mb-1.5 px-1">
                Nama Jamaah
              </p>
              <div
                className="flex items-center gap-2 rounded-2xl border px-4 py-3.5"
                style={{ borderColor: 'rgba(32,32,32,0.12)', background: '#fafaf9' }}
              >
                <span className="flex-none font-mono text-[15px] text-stone">@</span>
                <input
                  id="nama"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="nama sesuai paspor"
                  autoComplete="name"
                  className="flex-1 bg-transparent text-[15px] text-ink placeholder:text-stone/50 focus:outline-none"
                />
              </div>
            </div>

            {/* Error */}
            {error ? (
              <div
                role="alert"
                className="flex items-start gap-3 rounded-2xl px-4 py-3 animate-scale-in"
                style={{ background: 'rgba(234,40,4,0.07)', border: '1px solid rgba(234,40,4,0.18)' }}
              >
                <span
                  className="flex-none flex h-5 w-5 items-center justify-center rounded-full font-mono text-[11px] font-bold text-primary"
                  style={{ background: 'rgba(234,40,4,0.12)' }}
                >
                  !
                </span>
                <p className="text-[13px] leading-relaxed text-body">{error}</p>
              </div>
            ) : null}

            {/* Submit — dark pill like reference "Continue" button */}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 flex min-h-[52px] w-full items-center justify-center gap-2.5 rounded-full text-[15px] font-bold tracking-wide transition-all active:scale-[0.98] disabled:opacity-60"
              style={{
                background: loading ? '#444' : '#111111',
                color: '#ffffff',
                boxShadow: loading ? 'none' : '0 4px 16px rgba(0,0,0,0.22)',
                marginTop: '20px',
              }}
            >
              {loading ? (
                <>
                  <svg className="h-4 w-4 animate-spin flex-none" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" />
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
                className="font-mono font-bold text-primary hover:underline underline-offset-2 transition-all"
              >
                {KODE_DEMO}
              </button>
              {' '}+ nama bebas
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
