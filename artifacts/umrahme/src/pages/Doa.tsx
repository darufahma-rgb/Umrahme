import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { daftarDoa, kategoriDoaMeta, cariDoa, doaByKategori } from '../data/doa';
import type { Doa, KategoriDoa } from '../types';
import { IconSearch, IconChevron, IconDoa, IconBack } from '../components/icons';
import EmptyState from '../components/EmptyState';

function DoaRow({ doa }: { doa: Doa }) {
  return (
    <Link
      to={`/doa/${doa.id}`}
      className="flex items-center gap-3 rounded-2xl border border-ink-800/70 bg-ink-900/50 px-4 py-3.5 active:scale-[0.99]"
    >
      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-medium leading-tight text-parchment-100">{doa.judul}</p>
        {doa.latin ? (
          <p className="mt-0.5 truncate text-xs italic text-mute-500">{doa.latin}</p>
        ) : (
          <p className="mt-0.5 font-mono text-[11px] uppercase tracking-wider text-gold-400/80">
            Perlu verifikasi ustadz
          </p>
        )}
      </div>
      <IconChevron className="h-4 w-4 flex-none text-mute-500" />
    </Link>
  );
}

export default function DoaPage() {
  const [params, setParams] = useSearchParams();
  const kategori = params.get('kategori') as KategoriDoa | null;
  const [q, setQ] = useState('');

  const hasil = useMemo(() => (q.trim() ? cariDoa(q) : []), [q]);
  const katMeta = kategori ? kategoriDoaMeta.find((k) => k.id === kategori) : null;
  const doaKategori = kategori ? doaByKategori(kategori) : [];

  // ---------------- MODE: hasil pencarian ----------------
  if (q.trim()) {
    return (
      <div>
        <SearchHeader q={q} setQ={setQ} />
        <div className="space-y-3 px-5 pt-4">
          <p className="font-mono text-[11px] uppercase tracking-widest text-mute-500">
            {hasil.length} hasil untuk “{q}”
          </p>
          {hasil.length ? (
            hasil.map((d) => <DoaRow key={d.id} doa={d} />)
          ) : (
            <EmptyState
              icon={<IconSearch className="h-7 w-7" />}
              title="Doa tidak ditemukan"
              desc="Coba kata kunci lain, atau jelajahi berdasarkan kategori."
            />
          )}
        </div>
      </div>
    );
  }

  // ---------------- MODE: satu kategori ----------------
  if (kategori && katMeta) {
    return (
      <div>
        <header
          className="sticky top-0 z-30 border-b border-ink-800/70 bg-ink-950/90 px-4 pb-3 pt-4 backdrop-blur-md"
          style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}
        >
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setParams({})}
              aria-label="Kembali ke kategori"
              className="flex h-11 w-11 flex-none items-center justify-center rounded-full border border-ink-800 bg-ink-900 text-parchment-100 active:scale-95"
            >
              <IconBack className="h-5 w-5" />
            </button>
            <div>
              <p className="font-mono text-[11px] uppercase tracking-widest text-rose-400">
                Kumpulan Doa
              </p>
              <h1 className="font-display text-xl font-semibold text-parchment-100">
                {katMeta.judul}
              </h1>
            </div>
          </div>
        </header>
        <div className="space-y-3 px-5 pt-4">
          {doaKategori.length ? (
            doaKategori.map((d) => <DoaRow key={d.id} doa={d} />)
          ) : (
            <EmptyState
              icon={<IconDoa className="h-7 w-7" />}
              title="Belum ada doa"
              desc="Konten untuk kategori ini sedang disiapkan."
            />
          )}
        </div>
      </div>
    );
  }

  // ---------------- MODE: daftar kategori (default) ----------------
  return (
    <div>
      <header
        className="px-5 pb-1 pt-8"
        style={{ paddingTop: 'max(2rem, env(safe-area-inset-top))' }}
      >
        <h1 className="font-display text-3xl font-semibold text-parchment-100">
          Kumpulan Doa
        </h1>
        <p className="mt-1 text-sm text-mute-500">
          Cari cepat, atau jelajahi per tahapan ibadah.
        </p>
      </header>

      <div className="px-5 pt-4">
        <SearchBox q={q} setQ={setQ} />
      </div>

      <div className="mt-5 space-y-3 px-5">
        {kategoriDoaMeta.map((k) => {
          const jumlah = daftarDoa.filter((d) => d.kategori === k.id).length;
          return (
            <button
              key={k.id}
              type="button"
              onClick={() => setParams({ kategori: k.id })}
              className="flex w-full items-center gap-3 rounded-2xl border border-ink-800/70 bg-ink-900/50 px-4 py-4 text-left active:scale-[0.99]"
            >
              <div className="min-w-0 flex-1">
                <p className="text-[15px] font-semibold text-parchment-100">{k.judul}</p>
                <p className="truncate text-xs text-mute-500">{k.deskripsi}</p>
              </div>
              <span className="font-mono text-xs text-mute-500">{jumlah}</span>
              <IconChevron className="h-4 w-4 flex-none text-mute-500" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function SearchBox({ q, setQ }: { q: string; setQ: (v: string) => void }) {
  return (
    <div className="relative">
      <IconSearch className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-mute-500" />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Cari doa… (mis. talbiyah, ka'bah)"
        className="w-full rounded-xl border border-ink-800 bg-ink-900 py-3.5 pl-12 pr-4 text-[15px] text-parchment-100 placeholder:text-mute-500/60 focus:border-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-400"
      />
    </div>
  );
}

function SearchHeader({ q, setQ }: { q: string; setQ: (v: string) => void }) {
  return (
    <header
      className="sticky top-0 z-30 border-b border-ink-800/70 bg-ink-950/90 px-5 pb-3 pt-4 backdrop-blur-md"
      style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}
    >
      <SearchBox q={q} setQ={setQ} />
    </header>
  );
}
