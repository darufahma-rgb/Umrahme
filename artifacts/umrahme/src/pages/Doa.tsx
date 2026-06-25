import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { daftarDoa, kategoriDoaMeta, cariDoa, doaByKategori } from '../data/doa';
import type { Doa, KategoriDoa } from '../types';
import { IconSearch, IconChevron, IconDoa, IconBack } from '../components/icons';
import EmptyState from '../components/EmptyState';
import MihrabCard from '../components/MihrabCard';

const accents = ['maroon', 'gold', 'green', 'blue', 'plum'] as const;
const accentMap: Record<string, { tile: string; icon: string; count: string }> = {
  maroon: { tile: 'bg-gradient-to-br from-primary/15 to-primary/5', icon: 'text-primary', count: 'bg-primary/10 text-primary' },
  gold:   { tile: 'bg-gradient-to-br from-gold/20 to-gold/5',       icon: 'text-gold',    count: 'bg-gold/15 text-gold' },
  green:  { tile: 'bg-gradient-to-br from-emerald-500/15 to-emerald-500/5', icon: 'text-emerald-600', count: 'bg-emerald-500/10 text-emerald-600' },
  blue:   { tile: 'bg-gradient-to-br from-sky-500/15 to-sky-500/5', icon: 'text-sky-600', count: 'bg-sky-500/10 text-sky-600' },
  plum:   { tile: 'bg-gradient-to-br from-fuchsia-500/12 to-fuchsia-500/5', icon: 'text-fuchsia-700', count: 'bg-fuchsia-500/10 text-fuchsia-700' },
};

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth >= 1024 : false,
  );
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return isDesktop;
}

function Accordion({
  label,
  children,
  defaultOpen = false,
}: {
  label: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="overflow-hidden rounded-md border border-hairline bg-surface-bone">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex min-h-[52px] w-full items-center justify-between gap-3 px-4 py-3 text-left"
        aria-expanded={open}
      >
        <span className="font-mono text-[11px] uppercase tracking-widest text-primary">
          {label}
        </span>
        <IconChevron
          className={`h-4 w-4 flex-none text-ash transition-transform ${
            open ? 'rotate-90' : ''
          }`}
        />
      </button>
      {open ? (
        <div className="px-4 pb-4 text-[15px] leading-relaxed text-body animate-fade-up">
          {children}
        </div>
      ) : null}
    </div>
  );
}

function DoaDetailContent({ doa }: { doa: Doa }) {
  const katMeta = kategoriDoaMeta.find((k) => k.id === doa.kategori);
  const adaBacaan = Boolean(doa.arab || doa.latin || doa.terjemahan);

  return (
    <div className="space-y-3">
      <p className="font-mono text-[11px] uppercase tracking-widest text-primary">
        {katMeta?.judul ?? 'Doa'}
      </p>
      <h2 className="font-display text-xl font-bold text-ink">{doa.judul}</h2>

      {adaBacaan ? (
        <MihrabCard bodyClassName="px-5 pb-6 pt-3">
          {doa.arab ? (
            <p className="text-center font-arab text-[34px] leading-[2] text-gold" dir="rtl">
              {doa.arab}
            </p>
          ) : null}
          {doa.latin ? (
            <p className="mt-4 text-center text-[15px] italic leading-relaxed text-body">
              {doa.latin}
            </p>
          ) : null}
          {doa.terjemahan ? (
            <p className="mt-3 text-center text-sm leading-relaxed text-charcoal">
              "{doa.terjemahan}"
            </p>
          ) : null}
        </MihrabCard>
      ) : (
        <div className="rounded-md border border-gold/20 bg-gold/5 px-5 py-6 text-center">
          <p className="font-mono text-[11px] uppercase tracking-widest text-gold">
            Konten dalam peninjauan
          </p>
          <p className="mt-2 text-sm leading-relaxed text-body">
            Teks bacaan doa ini belum ditampilkan karena masih perlu diverifikasi oleh ustadz
            sebelum dipublikasikan.
          </p>
        </div>
      )}

      {doa.perluVerifikasi ? (
        <p className="rounded-md border border-gold/20 bg-gold/5 px-4 py-2.5 text-center text-xs leading-relaxed text-gold">
          Sumber masih perlu verifikasi ulama sebelum dijadikan rujukan pasti.
        </p>
      ) : null}

      <div className="mt-1 space-y-2.5">
        {doa.arti ? <Accordion label="Arti / Makna">{doa.arti}</Accordion> : null}
        {doa.dalil ? <Accordion label="Dalil & Sumber">{doa.dalil}</Accordion> : null}
        {doa.cara ? <Accordion label="Cara Mengamalkan">{doa.cara}</Accordion> : null}
        {doa.waktu ? <Accordion label="Waktu Membaca">{doa.waktu}</Accordion> : null}
      </div>
    </div>
  );
}

function DoaRow({
  doa,
  selected,
  onSelect,
}: {
  doa: Doa;
  selected?: boolean;
  onSelect?: (doa: Doa) => void;
}) {
  const inner = (
    <>
      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-medium leading-tight text-ink">{doa.judul}</p>
        {doa.latin ? (
          <p className="mt-0.5 truncate text-xs italic text-charcoal">{doa.latin}</p>
        ) : (
          <p className="mt-0.5 font-mono text-[11px] uppercase tracking-wider text-gold/80">
            Perlu verifikasi ustadz
          </p>
        )}
      </div>
      <IconChevron className="h-4 w-4 flex-none text-ash" />
    </>
  );

  if (onSelect) {
    return (
      <button
        type="button"
        onClick={() => onSelect(doa)}
        className={`flex w-full items-center gap-3 rounded-md border px-4 py-3.5 text-left transition-colors ${
          selected
            ? 'border-primary/20 bg-primary/5'
            : 'border-hairline bg-surface-card hover:bg-surface-bone'
        }`}
      >
        {inner}
      </button>
    );
  }

  return (
    <Link
      to={`/doa/${doa.id}`}
      className="flex items-center gap-3 rounded-md border border-hairline bg-surface-card px-4 py-3.5 active:scale-[0.99] hover:bg-surface-bone"
    >
      {inner}
    </Link>
  );
}

function SearchBox({ q, setQ }: { q: string; setQ: (v: string) => void }) {
  return (
    <div className="relative">
      <IconSearch className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-mute" />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Cari doa… (mis. talbiyah, ka'bah)"
        className="w-full rounded-full border border-hairline bg-surface-card px-4 py-3 pl-12 text-[15px] text-ink placeholder:text-ash shadow-drop-soft focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}

export default function DoaPage() {
  const [params, setParams] = useSearchParams();
  const kategori = params.get('kategori') as KategoriDoa | null;
  const [q, setQ] = useState('');
  const [selectedDoa, setSelectedDoa] = useState<Doa | null>(null);
  const isDesktop = useIsDesktop();

  const hasil = useMemo(() => (q.trim() ? cariDoa(q) : []), [q]);
  const katMeta = kategori ? kategoriDoaMeta.find((k) => k.id === kategori) : null;
  const doaKategori = kategori ? doaByKategori(kategori) : [];

  useEffect(() => {
    setSelectedDoa(null);
  }, [kategori, q]);

  useEffect(() => {
    if (isDesktop && kategori && doaKategori.length > 0 && !selectedDoa) {
      setSelectedDoa(doaKategori[0]);
    }
  }, [isDesktop, kategori, doaKategori.length]);

  if (!isDesktop) {
    if (q.trim()) {
      return (
        <div>
          <header
            className="sticky top-0 z-30 border-b border-hairline bg-canvas/95 px-5 pb-3 pt-4 backdrop-blur-md"
            style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}
          >
            <SearchBox q={q} setQ={setQ} />
          </header>
          <div className="space-y-3 px-5 pt-4">
            <p className="font-mono text-[11px] uppercase tracking-widest text-mute">
              {hasil.length} hasil untuk "{q}"
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

    if (kategori && katMeta) {
      return (
        <div>
          <header
            className="sticky top-0 z-30 border-b border-hairline bg-canvas/95 px-4 pb-3 pt-4 backdrop-blur-md"
            style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}
          >
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setParams({})}
                aria-label="Kembali ke kategori"
                className="flex h-11 w-11 flex-none items-center justify-center rounded-full border border-hairline bg-surface-card text-ink active:scale-95 shadow-drop-card"
              >
                <IconBack className="h-5 w-5" />
              </button>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-widest text-primary">
                  Kumpulan Doa
                </p>
                <h1 className="font-display text-xl font-bold text-ink">
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

    return (
      <div>
        <header
          className="px-5 pb-1 pt-8"
          style={{ paddingTop: 'max(2rem, env(safe-area-inset-top))' }}
        >
          <h1 className="font-display text-3xl font-bold text-ink">Kumpulan Doa</h1>
          <p className="mt-1 text-sm text-charcoal">Cari cepat, atau jelajahi per tahapan ibadah.</p>
        </header>
        <div className="px-5 pt-4">
          <SearchBox q={q} setQ={setQ} />
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3 px-5 pb-6">
          {kategoriDoaMeta.map((k) => {
            const jumlah = daftarDoa.filter((d) => d.kategori === k.id).length;
            return (
              <button
                key={k.id}
                type="button"
                onClick={() => setParams({ kategori: k.id })}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-hairline bg-surface-card text-left shadow-drop-soft transition-all hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98] bg-gradient-to-br from-primary/10 via-primary/5 to-primary/5"
              >
                <span className="absolute left-0 top-0 h-0.5 w-full bg-gradient-to-r from-primary/40 to-primary/10" aria-hidden />

                <div className="flex flex-col gap-2.5 p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/70 shadow-sm backdrop-blur-sm">
                      <IconDoa className="h-5 w-5 text-primary" />
                    </div>
                    <span className="rounded-full bg-primary/10 px-1.5 py-0.5 font-mono text-[10px] font-bold text-primary">{jumlah}</span>
                  </div>
                  <div>
                    <h2 className="font-display text-[13px] font-bold leading-tight text-ink">{k.judul}</h2>
                    <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-charcoal">{k.deskripsi}</p>
                  </div>
                </div>

                <div className="mt-auto flex items-center justify-end px-4 pb-3">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-primary opacity-60 transition-opacity group-hover:opacity-100">
                    Buka →
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-[340px] flex-none border-r border-hairline overflow-y-auto bg-canvas">
        <div className="sticky top-0 z-10 bg-canvas/95 px-5 py-5 backdrop-blur-md border-b border-hairline">
          <h1 className="font-display text-2xl font-bold text-ink">Kumpulan Doa</h1>
          <p className="mt-0.5 text-sm text-charcoal">Per tahapan ibadah</p>
          <div className="mt-3">
            <SearchBox q={q} setQ={setQ} />
          </div>
        </div>

        <div className="px-4 py-4">
          {q.trim() ? (
            <div className="space-y-2.5">
              <p className="font-mono text-[11px] uppercase tracking-widest text-mute mb-3">
                {hasil.length} hasil untuk "{q}"
              </p>
              {hasil.length ? (
                hasil.map((d) => (
                  <DoaRow
                    key={d.id}
                    doa={d}
                    selected={selectedDoa?.id === d.id}
                    onSelect={setSelectedDoa}
                  />
                ))
              ) : (
                <EmptyState
                  icon={<IconSearch className="h-6 w-6" />}
                  title="Tidak ditemukan"
                  desc="Coba kata kunci lain."
                />
              )}
            </div>
          ) : (
            <div className="space-y-5">
              {kategoriDoaMeta.map((k, i) => {
                const doaList = doaByKategori(k.id);
                if (!doaList.length) return null;
                const a = accentMap[accents[i % accents.length]];
                return (
                  <div key={k.id}>
                    <button
                      type="button"
                      onClick={() => {
                        setParams({ kategori: k.id });
                        setSelectedDoa(doaList[0]);
                      }}
                      className={`mb-2 flex w-full items-center justify-between px-1 ${
                        kategori === k.id ? 'text-ink' : 'text-mute hover:text-body'
                      } transition-colors`}
                    >
                      <span className={`font-mono text-[11px] uppercase tracking-widest ${kategori === k.id ? a.icon : ''}`}>
                        {k.judul}
                      </span>
                      <span className={`rounded-full px-1.5 py-0.5 font-mono text-[10px] font-semibold ${kategori === k.id ? a.count : 'text-ash'}`}>{doaList.length}</span>
                    </button>

                    <div className="space-y-2">
                      {doaList.map((d) => (
                        <DoaRow
                          key={d.id}
                          doa={d}
                          selected={selectedDoa?.id === d.id}
                          onSelect={(doa) => {
                            setSelectedDoa(doa);
                            setParams({ kategori: k.id });
                          }}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-surface-bone">
        {selectedDoa ? (
          <div className="px-8 py-8 max-w-2xl">
            <DoaDetailContent doa={selectedDoa} />
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center px-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-hairline bg-gradient-to-br from-primary/15 to-primary/5 text-primary shadow-drop-card">
              <IconDoa className="h-7 w-7" />
            </div>
            <p className="mt-4 font-display text-xl font-bold text-ink">
              Pilih doa dari panel kiri
            </p>
            <p className="mt-2 max-w-[32ch] text-pretty text-sm leading-relaxed text-charcoal">
              Klik salah satu doa untuk menampilkan bacaan Arab, transliterasi, dan keterangannya
              di sini.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
