import { useState, type FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { validasiKode, KODE_DEMO } from '../data/jamaah';
import MihrabCard from '../components/MihrabCard';

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
    <div className="min-h-screen bg-ink-950 lg:flex">
      {/* Panel dekoratif kiri — desktop saja */}
      <div className="hidden lg:flex lg:w-[45%] xl:w-[50%] flex-col justify-between px-16 py-16 border-r border-ink-800/40"
        style={{
          backgroundImage:
            'radial-gradient(80% 60% at 30% 40%, rgba(194,24,91,0.10), rgba(13,5,9,0) 70%)',
        }}
      >
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-rose-400">
            Pendamping Umrah
          </p>
          <h1 className="mt-2 font-display text-5xl font-semibold leading-tight text-parchment-100">
            Umrahme
          </h1>
        </div>

        <div className="space-y-8">
          {/* Kaligrafi besar */}
          <p className="font-arab text-[52px] leading-[1.6] text-gold-400" dir="rtl">
            لَبَّيْكَ اللّٰهُمَّ لَبَّيْكَ
          </p>
          <div>
            <p className="font-display text-xl font-medium leading-relaxed text-parchment-100">
              Menenangkan langkah dari rumah hingga ke hadapan Baitullah.
            </p>
            <p className="mt-2 max-w-[38ch] text-pretty text-[15px] leading-relaxed text-mute-500">
              Doa, panduan, dan counter tawaf — semua yang Anda butuhkan dalam satu tempat yang
              tenang.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-ink-800" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-mute-500/60">
            Barakah Mulia Wisata
          </span>
          <span className="h-px flex-1 bg-ink-800" />
        </div>
      </div>

      {/* Panel form — center di mobile, kanan di desktop */}
      <div className="flex flex-1 flex-col justify-center px-6 py-10 lg:px-16 lg:py-0">
        {/* Judul mobile saja */}
        <div className="lg:hidden mb-6">
          <p className="font-arab text-3xl leading-loose text-gold-400" dir="rtl">
            لَبَّيْكَ اللّٰهُمَّ لَبَّيْكَ
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-parchment-100">
            Umrahme
          </h1>
          <p className="mt-3 max-w-[32ch] text-pretty text-[15px] leading-relaxed text-mute-500">
            Pendamping ibadah umrah Anda — menenangkan langkah dari rumah hingga ke hadapan
            Baitullah. Mari mulai dengan tenang.
          </p>
        </div>

        {/* Judul desktop saja */}
        <div className="hidden lg:block mb-8">
          <h2 className="font-display text-2xl font-semibold text-parchment-100">Masuk</h2>
          <p className="mt-1 text-sm text-mute-500">
            Masukkan kode aktivasi dari travel Anda untuk memulai.
          </p>
        </div>

        <MihrabCard className="w-full max-w-sm lg:max-w-md" bodyClassName="px-5 pb-6 pt-2">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="kode"
                className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-mute-500"
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
                className="w-full rounded-xl border border-ink-800 bg-ink-950 px-4 py-3.5 font-mono text-lg tracking-[0.3em] text-parchment-100 placeholder:text-mute-500/40 focus:border-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-400"
              />
            </div>
            <div>
              <label
                htmlFor="nama"
                className="mb-1.5 block font-mono text-[11px] uppercase tracking-widest text-mute-500"
              >
                Nama Jamaah
              </label>
              <input
                id="nama"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Nama sesuai paspor"
                autoComplete="name"
                className="w-full rounded-xl border border-ink-800 bg-ink-950 px-4 py-3.5 text-[15px] text-parchment-100 placeholder:text-mute-500/40 focus:border-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-400"
              />
            </div>

            {error ? (
              <p
                role="alert"
                className="rounded-xl border border-rose-600/40 bg-rose-600/10 px-4 py-3 text-sm text-parchment-100"
              >
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="flex min-h-[52px] w-full items-center justify-center rounded-xl bg-rose-600 font-semibold text-parchment-100 shadow-glow transition active:scale-[0.99] disabled:opacity-60"
            >
              {loading ? 'Memeriksa…' : 'Masuk'}
            </button>

            <p className="text-center text-xs leading-relaxed text-mute-500">
              Coba demo dengan kode{' '}
              <button
                type="button"
                onClick={() => setKode(KODE_DEMO)}
                className="font-mono font-medium text-rose-400 underline-offset-2 hover:underline"
              >
                {KODE_DEMO}
              </button>{' '}
              dan nama bebas.
            </p>
          </form>
        </MihrabCard>
      </div>
    </div>
  );
}
