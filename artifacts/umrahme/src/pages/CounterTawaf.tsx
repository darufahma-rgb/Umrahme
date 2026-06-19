import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { doaById } from '../data/doa';
import { IconBack, IconReset, IconCheck, IconChevron } from '../components/icons';

const TOTAL = 7;
const STORAGE = 'umrahme.tawaf';

// Doa yang dianjurkan dibaca antara Rukun Yamani & Hajar Aswad.
const doaPutaran = doaById('doa-antara-dua-rukun');

export default function CounterTawaf() {
  const navigate = useNavigate();
  const [count, setCount] = useState<number>(() => {
    const v = Number(localStorage.getItem(STORAGE));
    return Number.isFinite(v) && v >= 0 && v <= TOTAL ? v : 0;
  });
  const [konfirmasiReset, setKonfirmasiReset] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE, String(count));
  }, [count]);

  const selesai = count >= TOTAL;

  function tap() {
    if (selesai) return;
    setCount((c) => Math.min(TOTAL, c + 1));
    // Getaran ringan (jika didukung perangkat).
    if (navigator.vibrate) navigator.vibrate(35);
  }

  function reset() {
    setCount(0);
    setKonfirmasiReset(false);
  }

  // progress ring via conic-gradient
  const persen = (count / TOTAL) * 100;

  return (
    <div className="flex min-h-[calc(100vh-7rem)] flex-col">
      {/* Chrome minimal: back kiri, reset kecil kanan */}
      <div
        className="flex items-center justify-between px-4 pt-4"
        style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}
      >
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Kembali"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-ink-800 bg-ink-900 text-parchment-100 active:scale-95"
        >
          <IconBack className="h-5 w-5" />
        </button>

        {!selesai ? (
          <button
            type="button"
            onClick={() => setKonfirmasiReset(true)}
            className="flex items-center gap-1.5 rounded-full border border-ink-800 px-3 py-2 font-mono text-[11px] uppercase tracking-wider text-mute-500 active:scale-95"
          >
            <IconReset className="h-3.5 w-3.5" /> Reset
          </button>
        ) : (
          <span className="w-11" />
        )}
      </div>

      {selesai ? (
        // ---------------- STATE SELESAI (berubah total) ----------------
        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center animate-fade-up">
          <div className="flex h-24 w-24 items-center justify-center rounded-full border border-gold-400/50 bg-ink-900 text-gold-400 shadow-glow-soft">
            <IconCheck className="h-12 w-12" />
          </div>
          <p className="mt-6 font-mono text-xs uppercase tracking-widest text-gold-400">
            7 dari 7 putaran
          </p>
          <h1 className="mt-2 font-display text-4xl font-semibold text-parchment-100">
            Tawaf Selesai
          </h1>
          <p className="mt-2 max-w-[28ch] text-pretty text-[15px] leading-relaxed text-mute-500">
            Alhamdulillah. Setelah tawaf, lanjutkan dengan shalat di Maqam Ibrahim
            lalu menuju Sa’i antara Shafa & Marwah.
          </p>

          <Link
            to="/doa?kategori=sai"
            className="mt-8 flex min-h-[64px] w-full max-w-xs items-center justify-center gap-2 rounded-2xl bg-rose-600 text-lg font-semibold text-parchment-100 shadow-glow active:scale-[0.99]"
          >
            Lanjut ke Sa’i <IconChevron className="h-5 w-5" />
          </Link>
          <button
            type="button"
            onClick={() => setKonfirmasiReset(true)}
            className="mt-4 font-mono text-xs uppercase tracking-wider text-mute-500 underline-offset-4 hover:underline"
          >
            Ulangi dari awal
          </button>
        </div>
      ) : (
        // ---------------- STATE BERJALAN ----------------
        <div className="flex flex-1 flex-col items-center px-6">
          {/* Orientasi: "saya sedang di mana, harus apa" */}
          <p className="mt-2 font-mono text-xs uppercase tracking-widest text-rose-400">
            Tawaf · Mengelilingi Ka’bah
          </p>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-display text-[88px] font-semibold leading-none text-parchment-100">
              {count}
            </span>
            <span className="font-display text-3xl text-mute-500">/ {TOTAL}</span>
          </div>
          <p className="mt-1 text-sm text-mute-500">putaran selesai</p>

          {/* 7 dots progress */}
          <div className="mt-4 flex items-center gap-2">
            {Array.from({ length: TOTAL }).map((_, i) => (
              <span
                key={i}
                className={`h-2.5 w-2.5 rounded-full transition-colors ${
                  i < count ? 'bg-rose-400' : 'bg-ink-800'
                }`}
              />
            ))}
          </div>

          {/* Doa inline (tidak menutup tombol utama) */}
          {doaPutaran ? (
            <div className="mt-5 w-full rounded-2xl border border-ink-800/70 bg-ink-900/50 px-4 py-3 text-center">
              <p className="font-mono text-[10px] uppercase tracking-widest text-gold-400">
                Dibaca antara Rukun Yamani & Hajar Aswad
              </p>
              <p className="mt-2 font-arab text-2xl leading-relaxed text-gold-400" dir="rtl">
                {doaPutaran.arab}
              </p>
              <p className="mt-1.5 text-xs italic leading-relaxed text-mute-500">
                {doaPutaran.latin}
              </p>
            </div>
          ) : null}

          {/* TOMBOL TAP RAKSASA — aksi utama dominan */}
          <button
            type="button"
            onClick={tap}
            aria-label={`Tap untuk menambah putaran. Saat ini ${count} dari ${TOTAL}.`}
            className="relative mt-auto mb-6 flex h-56 w-56 select-none items-center justify-center rounded-full active:scale-[0.98]"
            style={{
              background: `conic-gradient(#E91E8C ${persen}%, #261019 ${persen}%)`,
              padding: '8px',
            }}
          >
            <span className="flex h-full w-full flex-col items-center justify-center rounded-full bg-rose-600 text-parchment-100 shadow-glow">
              <span className="font-display text-2xl font-semibold">TAP</span>
              <span className="mt-1 font-mono text-[11px] uppercase tracking-widest text-parchment-100/80">
                tiap putaran
              </span>
            </span>
          </button>
        </div>
      )}

      {/* Konfirmasi reset — sengaja butuh konfirmasi agar tak terhapus tak sengaja */}
      {konfirmasiReset ? (
        <div className="fixed inset-0 z-50 mx-auto flex max-w-app items-end bg-ink-950/70 backdrop-blur-sm">
          <div className="w-full rounded-t-3xl border-t border-ink-800 bg-ink-900 p-6 pb-8 animate-fade-up">
            <h3 className="font-display text-xl font-semibold text-parchment-100">
              Ulangi hitungan tawaf?
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-mute-500">
              Progress {count} putaran akan dihapus dan kembali ke 0. Tindakan ini tidak
              bisa dibatalkan.
            </p>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                onClick={() => setKonfirmasiReset(false)}
                className="min-h-[48px] flex-1 rounded-xl border border-ink-800 font-medium text-parchment-100 active:scale-[0.99]"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={reset}
                className="min-h-[48px] flex-1 rounded-xl bg-rose-600 font-semibold text-parchment-100 active:scale-[0.99]"
              >
                Ya, ulangi
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
