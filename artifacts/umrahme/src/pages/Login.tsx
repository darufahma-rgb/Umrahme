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
    <div className="min-h-screen bg-canvas lg:flex">

      {/* ═══════════════════ LEFT PANEL — desktop ═══════════════════ */}
      <div className="hidden lg:flex lg:w-[46%] xl:w-[48%] flex-col justify-between px-14 py-14 border-r border-hairline bg-surface-bone relative overflow-hidden">

        {/* Fine dot pattern */}
        <div className="pointer-events-none absolute inset-0 bg-dot-gold opacity-100" />

        {/* Radial vignette so dots fade at edges */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(80% 80% at 50% 50%, transparent 40%, #f3f0e8 100%)' }}
        />

        {/* Brand */}
        <div className="relative">
          <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-primary/80">
            Pendamping Umrah
          </p>
          <h1 className="mt-2 font-display text-[52px] font-bold leading-none tracking-[-2.5px] text-ink">
            Umrahme
          </h1>
        </div>

        {/* Center content */}
        <div className="relative space-y-10">
          {/* Arabic calligraphy */}
          <div className="text-center">
            <p className="font-arab text-[58px] leading-[1.65] text-gold drop-shadow-sm" dir="rtl">
              لَبَّيْكَ اللّٰهُمَّ لَبَّيْكَ
            </p>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.25em] text-gold/60">
              Talbiyah
            </p>
          </div>

          {/* Tagline */}
          <div>
            <p className="font-display text-[22px] font-bold leading-snug text-ink">
              Menenangkan langkah dari rumah hingga ke hadapan Baitullah.
            </p>
            <div className="mt-5 space-y-3">
              {[
                'Kumpulan doa & dzikir ibadah lengkap',
                'Panduan tata cara umrah berurutan',
                'Counter tawaf & sa\'i otomatis',
              ].map((feat) => (
                <div key={feat} className="flex items-center gap-3">
                  <span className="h-[3px] w-5 rounded-full bg-primary flex-none" />
                  <span className="text-[14px] text-body">{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative flex items-center gap-4">
          <span className="h-px flex-1 bg-hairline" />
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-ash">
            Barakah Mulia Wisata
          </span>
          <span className="h-px flex-1 bg-hairline" />
        </div>
      </div>

      {/* ═══════════════════ RIGHT / MOBILE PANEL ═══════════════════ */}
      <div className="flex flex-1 flex-col lg:justify-center">

        {/* Mobile hero — hidden on desktop */}
        <div
          className="lg:hidden relative overflow-hidden bg-surface-bone"
          style={{ paddingTop: 'max(3.5rem, env(safe-area-inset-top))' }}
        >
          {/* Dot pattern */}
          <div className="pointer-events-none absolute inset-0 bg-dot-gold" />
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: 'radial-gradient(70% 70% at 50% 60%, transparent 30%, #f3f0e8 100%)' }}
          />

          {/* Content */}
          <div className="relative px-8 pb-10 pt-2 text-center">
            {/* Arabic */}
            <p className="font-arab text-[44px] leading-[1.7] text-gold" dir="rtl">
              لَبَّيْكَ اللّٰهُمَّ لَبَّيْكَ
            </p>

            {/* Gold ornament */}
            <div className="mx-auto mt-5 mb-4 flex items-center justify-center gap-3">
              <span className="h-px w-10 bg-gold/35" />
              <span className="h-[5px] w-[5px] rotate-45 bg-gold/50" />
              <span className="h-px w-10 bg-gold/35" />
            </div>

            {/* Brand */}
            <p className="font-mono text-[10px] uppercase tracking-[0.35em] text-primary/80">
              Pendamping Umrah
            </p>
            <h1 className="mt-1 font-display text-[42px] font-bold leading-none tracking-[-2px] text-ink">
              Umrahme
            </h1>
          </div>

          {/* Bottom curve */}
          <svg viewBox="0 0 390 28" preserveAspectRatio="none" className="block w-full h-7 -mt-1" aria-hidden>
            <path d="M0,28 L0,8 Q195,0 390,8 L390,28 Z" fill="#f9f7f3" />
          </svg>
        </div>

        {/* Form area */}
        <div className="flex flex-1 flex-col justify-center px-6 py-8 lg:px-14 lg:py-0">
          <div className="w-full max-w-sm mx-auto lg:max-w-md">

            {/* Desktop heading */}
            <div className="hidden lg:block mb-10">
              <h2 className="font-display text-[34px] font-bold leading-none tracking-[-1px] text-ink">
                Masuk
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-charcoal">
                Masukkan kode aktivasi dari biro travel Anda untuk memulai.
              </p>
            </div>

            {/* Mobile heading */}
            <div className="lg:hidden mb-6">
              <h2 className="font-display text-2xl font-bold text-ink">Masuk</h2>
              <p className="mt-1.5 text-[14px] leading-relaxed text-charcoal">
                Masukkan kode aktivasi dari biro travel Anda.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Kode aktivasi */}
              <div>
                <label
                  htmlFor="kode"
                  className="mb-2 block font-mono text-[11px] uppercase tracking-[0.18em] text-mute"
                >
                  Kode Aktivasi
                </label>
                <input
                  id="kode"
                  value={kode}
                  onChange={(e) => setKode(e.target.value.toUpperCase())}
                  placeholder="UMR8X2"
                  autoCapitalize="characters"
                  autoComplete="off"
                  maxLength={6}
                  className="w-full rounded-2xl border border-hairline bg-surface-card px-5 py-4 font-mono text-xl tracking-[0.35em] text-ink placeholder:text-stone focus:border-primary/40 focus:ring-[3px] focus:ring-primary/12 transition-all"
                />
              </div>

              {/* Nama */}
              <div>
                <label
                  htmlFor="nama"
                  className="mb-2 block font-mono text-[11px] uppercase tracking-[0.18em] text-mute"
                >
                  Nama Jamaah
                </label>
                <input
                  id="nama"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Nama sesuai paspor"
                  autoComplete="name"
                  className="w-full rounded-2xl border border-hairline bg-surface-card px-5 py-4 text-[15px] text-ink placeholder:text-stone focus:border-primary/40 focus:ring-[3px] focus:ring-primary/12 transition-all"
                />
              </div>

              {/* Error */}
              {error ? (
                <div
                  role="alert"
                  className="flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary/6 px-4 py-3.5 animate-fade-in"
                >
                  <span className="mt-0.5 h-4 w-4 flex-none rounded-full border border-primary/40 bg-primary/10 text-center font-mono text-[10px] leading-4 text-primary">!</span>
                  <p className="text-[13px] leading-relaxed text-body">{error}</p>
                </div>
              ) : null}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="flex min-h-[54px] w-full items-center justify-center gap-2 rounded-full bg-primary px-6 text-[15px] font-bold tracking-wide text-on-primary shadow-glow-primary transition-all active:scale-[0.99] active:shadow-none disabled:opacity-60 disabled:shadow-none"
              >
                {loading ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" />
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    Memeriksa…
                  </>
                ) : 'Masuk'}
              </button>

              {/* Demo hint */}
              <p className="text-center text-[12px] leading-relaxed text-ash">
                Demo:{' '}
                <button
                  type="button"
                  onClick={() => setKode(KODE_DEMO)}
                  className="font-mono font-bold text-primary underline-offset-2 hover:underline"
                >
                  {KODE_DEMO}
                </button>
                {' '}+ nama bebas
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
