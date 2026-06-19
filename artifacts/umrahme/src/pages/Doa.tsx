import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { daftarDoa, kategoriDoaMeta, cariDoa, doaByKategori } from '../data/doa';
import type { Doa, KategoriDoa } from '../types';
import { IconSearch, IconChevron, IconDoa, IconBack } from '../components/icons';
import EmptyState from '../components/EmptyState';
import MihrabCard from '../components/MihrabCard';

// -----------------------------------------------------------------------
// Hook: deteksi viewport desktop (≥ 1024px)
// -----------------------------------------------------------------------
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

// -----------------------------------------------------------------------
// Sub-komponen: satu accordion (dipakai di panel detail desktop)
// -----------------------------------------------------------------------
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
    <div className="overflow-hidden rounded-2xl border border-ink-800/70 bg-ink-900/40">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex min-h-[52px] w-full items-center justify-between gap-3 px-4 py-3 text-left"
        aria-expanded={open}
      >
        <span className="font-mono text-[11px] uppercase tracking-widest text-rose-400">
          {label}
        </span>
        <IconChevron
          className={`h-4 w-4 flex-none text-mute-500 transition-transform ${
            open ? 'rotate-90' : ''
          }`}
        />
      </button>
      {open ? (
        <div className="px-4 pb-4 text-[15px] leading-relaxed text-parchment-100/90 animate-fade-up">
          {children}
        </div>
      ) : null}
    </div>
  );
}

// -----------------------------------------------------------------------
// Sub-komponen: konten detail satu doa (dipakai di panel desktop & DoaDetail)
// -----------------------------------------------------------------------
function DoaDetailContent({ doa }: { doa: Doa }) {
  const katMeta = kategoriDoaMeta.find((k) => k.id === doa.kategori);
  const adaBacaan = Boolean(doa.arab || doa.latin || doa.terjemahan);

  return (
    <div className="space-y-3">
      {/* Eyebrow */}
      <p className="font-mono text-[11px] uppercase tracking-widest text-rose-400">
        {katMeta?.judul ?? 'Doa'}
      </p>
      <h2 className="font-display text-xl font-semibold text-parchment-100">{doa.judul}</h2>

      {/* Bacaan utama */}
      {adaBacaan ? (
        <MihrabCard bodyClassName="px-5 pb-6 pt-3">
          {doa.arab ? (
            <p
              className="text-center font-arab text-[34px] leading-[2] text-gold-400"
              dir="rtl"
            >
              {doa.arab}
            </p>
          ) : null}
          {doa.latin ? (
            <p className="mt-4 text-center text-[15px] italic leading-relaxed text-parchment-100">
              {doa.latin}
            </p>
          ) : null}
          {doa.terjemahan ? (
            <p className="mt-3 text-center text-sm leading-relaxed text-mute-500">
              "{doa.terjemahan}"
            </p>
          ) : null}
        </MihrabCard>
      ) : (
        <div className="rounded-2xl border border-gold-400/30 bg-gold-400/5 px-5 py-6 text-center">
          <p className="font-mono text-[11px] uppercase tracking-widest text-gold-400">
            Konten dalam peninjauan
          </p>
          <p className="mt-2 text-sm leading-relaxed text-parchment-100/90">
            Teks bacaan doa ini belum ditampilkan karena masih perlu diverifikasi oleh ustadz
            sebelum dipublikasikan. Lihat catatan praktik di bawah.
          </p>
        </div>
      )}

      {doa.perluVerifikasi ? (
        <p className="rounded-xl border border-gold-400/25 bg-gold-400/5 px-4 py-2.5 text-center text-xs leading-relaxed text-gold-400/90">
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

// -----------------------------------------------------------------------
// DoaRow — mobile: Link ke /doa/:id; desktop: tombol yang memilih di panel
// -----------------------------------------------------------------------
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
    </>
  );

  if (onSelect) {
    return (
      <button
        type="button"
        onClick={() => onSelect(doa)}
        className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3.5 text-left transition-colors ${
          selected
            ? 'border-rose-400/40 bg-rose-600/10'
            : 'border-ink-800/70 bg-ink-900/50 hover:border-ink-700 hover:bg-ink-900'
        }`}
      >
        {inner}
      </button>
    );
  }

  return (
    <Link
      to={`/doa/${doa.id}`}
      className="flex items-center gap-3 rounded-2xl border border-ink-800/70 bg-ink-900/50 px-4 py-3.5 active:scale-[0.99]"
    >
      {inner}
    </Link>
  );
}

// -----------------------------------------------------------------------
// SearchBox — reusable input pencarian
// -----------------------------------------------------------------------
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

// -----------------------------------------------------------------------
// Halaman utama
// -----------------------------------------------------------------------
export default function DoaPage() {
  const [params, setParams] = useSearchParams();
  const kategori = params.get('kategori') as KategoriDoa | null;
  const [q, setQ] = useState('');
  const [selectedDoa, setSelectedDoa] = useState<Doa | null>(null);
  const isDesktop = useIsDesktop();

  const hasil = useMemo(() => (q.trim() ? cariDoa(q) : []), [q]);
  const katMeta = kategori ? kategoriDoaMeta.find((k) => k.id === kategori) : null;
  const doaKategori = kategori ? doaByKategori(kategori) : [];

  // Reset selectedDoa jika kategori berubah
  useEffect(() => {
    setSelectedDoa(null);
  }, [kategori, q]);

  // Auto-pilih doa pertama di desktop saat kategori berubah
  useEffect(() => {
    if (isDesktop && kategori && doaKategori.length > 0 && !selectedDoa) {
      setSelectedDoa(doaKategori[0]);
    }
  }, [isDesktop, kategori, doaKategori.length]);

  // ====================== MOBILE — sama seperti sebelumnya ======================
  if (!isDesktop) {
    // Mode pencarian
    if (q.trim()) {
      return (
        <div>
          <header
            className="sticky top-0 z-30 border-b border-ink-800/70 bg-ink-950/90 px-5 pb-3 pt-4 backdrop-blur-md"
            style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}
          >
            <SearchBox q={q} setQ={setQ} />
          </header>
          <div className="space-y-3 px-5 pt-4">
            <p className="font-mono text-[11px] uppercase tracking-widest text-mute-500">
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

    // Mode satu kategori
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

    // Mode daftar kategori (default)
    return (
      <div>
        <header
          className="px-5 pb-1 pt-8"
          style={{ paddingTop: 'max(2rem, env(safe-area-inset-top))' }}
        >
          <h1 className="font-display text-3xl font-semibold text-parchment-100">Kumpulan Doa</h1>
          <p className="mt-1 text-sm text-mute-500">Cari cepat, atau jelajahi per tahapan ibadah.</p>
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

  // ====================== DESKTOP — master-detail dua kolom ======================
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Panel kiri — scroll list kategori + doa */}
      <div className="w-[340px] flex-none border-r border-ink-800/60 overflow-y-auto bg-ink-950">
        {/* Header panel kiri */}
        <div className="sticky top-0 z-10 bg-ink-950/95 px-5 py-5 backdrop-blur-md border-b border-ink-800/40">
          <h1 className="font-display text-2xl font-semibold text-parchment-100">Kumpulan Doa</h1>
          <p className="mt-0.5 text-sm text-mute-500">Per tahapan ibadah</p>
          <div className="mt-3">
            <SearchBox q={q} setQ={setQ} />
          </div>
        </div>

        <div className="px-4 py-4">
          {q.trim() ? (
            // Hasil pencarian
            <div className="space-y-2.5">
              <p className="font-mono text-[11px] uppercase tracking-widest text-mute-500 mb-3">
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
            // Daftar kategori + doa per kategori
            <div className="space-y-5">
              {kategoriDoaMeta.map((k) => {
                const doaList = doaByKategori(k.id);
                if (!doaList.length) return null;
                return (
                  <div key={k.id}>
                    {/* Header kategori */}
                    <button
                      type="button"
                      onClick={() => {
                        setParams({ kategori: k.id });
                        setSelectedDoa(doaList[0]);
                      }}
                      className={`mb-2 flex w-full items-center justify-between px-1 ${
                        kategori === k.id ? 'text-parchment-100' : 'text-mute-500 hover:text-parchment-100/70'
                      } transition-colors`}
                    >
                      <span className="font-mono text-[11px] uppercase tracking-widest">
                        {k.judul}
                      </span>
                      <span className="font-mono text-[11px] text-mute-500/60">{doaList.length}</span>
                    </button>

                    {/* List doa dalam kategori ini */}
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

      {/* Panel kanan — detail doa terpilih */}
      <div className="flex-1 overflow-y-auto">
        {selectedDoa ? (
          <div className="px-8 py-8 max-w-2xl">
            <DoaDetailContent doa={selectedDoa} />
          </div>
        ) : (
          /* Placeholder saat belum ada doa dipilih */
          <div className="flex h-full flex-col items-center justify-center px-12 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-ink-800/70 bg-ink-900/50 text-mute-500">
              <IconDoa className="h-7 w-7" />
            </div>
            <p className="mt-4 font-display text-xl font-semibold text-parchment-100">
              Pilih doa dari panel kiri
            </p>
            <p className="mt-2 max-w-[32ch] text-pretty text-sm leading-relaxed text-mute-500">
              Klik salah satu doa untuk menampilkan bacaan Arab, transliterasi, dan keterangannya
              di sini.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
