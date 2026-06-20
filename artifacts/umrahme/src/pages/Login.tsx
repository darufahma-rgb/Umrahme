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
      {/* Panel dekoratif kiri — desktop saja */}
      <div
        className="hidden lg:flex lg:w-[45%] xl:w-[50%] flex-col justify-between px-16 py-16 border-r border-hairline bg-surface-bone"
      >
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">
            Pendamping Umrah
          </p>
          <h1 className="mt-2 font-display text-5xl font-bold leading-[1.0] tracking-[-1.8px] text-ink">
            Umrahme
          </h1>
        </div>

        <div className="space-y-8">
          <p className="font-arab text-[52px] leading-[1.6] text-gold" dir="rtl">
            لَبَّيْكَ اللّٰهُمَّ لَبَّيْكَ
          </p>
          <div>
            <p className="font-display text-xl font-semibold leading-relaxed text-ink">
              Menenangkan langkah dari rumah hingga ke hadapan Baitullah.
            </p>
            <p className="mt-2 max-w-[38ch] text-pretty text-[15px] leading-relaxed text-charcoal">
              Doa, panduan, dan counter tawaf — semua yang Anda butuhkan dalam satu tempat yang
              tenang.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-hairline" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-ash">
            Barakah Mulia Wisata
          </span>
          <span className="h-px flex-1 bg-hairline" />
        </div>
      </div>

      {/* Panel form */}
      <div className="flex flex-1 flex-col justify-center px-6 py-10 lg:px-16 lg:py-0">
        <div className="lg:hidden mb-8">
          <p className="font-arab text-3xl leading-loose text-gold" dir="rtl">
            لَبَّيْكَ اللّٰهُمَّ لَبَّيْكَ
          </p>
          <h1 className="mt-4 font-display text-4xl font-bold leading-[1.0] tracking-[-1px] text-ink">
            Umrahme
          </h1>
          <p className="mt-3 max-w-[32ch] text-pretty text-[15px] leading-relaxed text-charcoal">
            Pendamping ibadah umrah Anda — menenangkan langkah dari rumah hingga ke hadapan
            Baitullah. Mari mulai dengan tenang.
          </p>
        </div>

        <div className="hidden lg:block mb-8">
          <h2 className="font-display text-3xl font-bold leading-[1.0] tracking-[-0.5px] text-ink">Masuk</h2>
          <p className="mt-2 text-[15px] text-charcoal">
            Masukkan kode aktivasi dari travel Anda untuk memulai.
          </p>
        </div>

        <div className="w-full max-w-sm lg:max-w-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="kode"
                className="mb-2 block font-mono text-[11px] uppercase tracking-widest text-mute"
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
                className="w-full rounded-full border border-hairline bg-surface-card px-5 py-3.5 font-mono text-lg tracking-[0.3em] text-ink placeholder:text-ash focus:border-hairline-strong focus:outline-none focus:ring-2 focus:ring-[rgba(59,130,246,0.5)]"
              />
            </div>
            <div>
              <label
                htmlFor="nama"
                className="mb-2 block font-mono text-[11px] uppercase tracking-widest text-mute"
              >
                Nama Jamaah
              </label>
              <input
                id="nama"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Nama sesuai paspor"
                autoComplete="name"
                className="w-full rounded-full border border-hairline bg-surface-card px-5 py-3.5 text-[15px] text-ink placeholder:text-ash focus:border-hairline-strong focus:outline-none focus:ring-2 focus:ring-[rgba(59,130,246,0.5)]"
              />
            </div>

            {error ? (
              <p
                role="alert"
                className="rounded-md border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-body"
              >
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="flex min-h-[44px] w-full items-center justify-center rounded-full bg-primary px-6 font-semibold text-on-primary transition active:scale-[0.99] disabled:opacity-60"
            >
              {loading ? 'Memeriksa…' : 'Masuk'}
            </button>

            <p className="text-center text-xs leading-relaxed text-mute">
              Coba demo dengan kode{' '}
              <button
                type="button"
                onClick={() => setKode(KODE_DEMO)}
                className="font-mono font-semibold text-primary underline-offset-2 hover:underline"
              >
                {KODE_DEMO}
              </button>{' '}
              dan nama bebas.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
