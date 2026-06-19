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
    // Simulasi panggilan jaringan singkat (dummy).
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
    <div className="mx-auto flex min-h-screen max-w-app flex-col bg-ink-950 px-6">
      {/* Pembuka emosional */}
      <div className="flex flex-1 flex-col justify-center pt-16">
        <p className="font-arab text-3xl leading-loose text-gold-400" dir="rtl">
          لَبَّيْكَ اللّٰهُمَّ لَبَّيْكَ
        </p>
        <h1 className="mt-5 font-display text-4xl font-semibold leading-tight text-parchment-100">
          Umrahme
        </h1>
        <p className="mt-3 max-w-[32ch] text-pretty text-[15px] leading-relaxed text-mute-500">
          Pendamping ibadah umrah Anda — menenangkan langkah dari rumah hingga ke
          hadapan Baitullah. Mari mulai dengan tenang.
        </p>
      </div>

      {/* Form aktivasi */}
      <MihrabCard className="mb-10 mt-8" bodyClassName="px-5 pb-6 pt-2">
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
  );
}
