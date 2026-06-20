import { useEffect, useMemo, useState } from 'react';
import { kategoriChecklist, checklistItems, itemsByKategori } from '../data/checklist';
import type { ChecklistItem as ChecklistItemType, KategoriChecklist, KategoriJamaah } from '../types';
import PageHeader from '../components/PageHeader';
import { IconCheck, IconChevron } from '../components/icons';

// ──────────────────────────────────────────────
// Konfigurasi profil jamaah
// ──────────────────────────────────────────────
const PROFIL_OPTIONS: { id: KategoriJamaah; label: string }[] = [
  { id: 'laki-laki', label: 'Laki-laki' },
  { id: 'perempuan', label: 'Perempuan' },
  { id: 'lansia', label: 'Lansia' },
];

const BADGE_STYLE: Record<KategoriJamaah, string> = {
  'laki-laki': 'border-sky-500/25 text-sky-400/70',
  perempuan: 'border-rose-400/30 text-rose-400/70',
  lansia: 'border-gold-400/30 text-gold-400/70',
};

const BADGE_LABEL: Record<KategoriJamaah, string> = {
  'laki-laki': 'Pria',
  perempuan: 'Wanita',
  lansia: 'Lansia',
};

// ──────────────────────────────────────────────
// Komponen badge kecil di pojok item
// ──────────────────────────────────────────────
function KategoriBadge({ k }: { k: KategoriJamaah }) {
  return (
    <span
      className={`flex-none self-start rounded-full border px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-wider ${BADGE_STYLE[k]}`}
    >
      {BADGE_LABEL[k]}
    </span>
  );
}

// ──────────────────────────────────────────────
// Satu baris item checklist (reusable)
// ──────────────────────────────────────────────
function ItemRow({
  item,
  on,
  onToggle,
  mobile = false,
}: {
  item: ChecklistItemType;
  on: boolean;
  onToggle: () => void;
  mobile?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition ${
        mobile
          ? 'min-h-[56px] active:bg-ink-800/50'
          : 'min-h-[52px] active:bg-ink-800/50 lg:hover:bg-ink-800/30'
      }`}
    >
      <span
        className={`mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-md border transition ${
          on ? 'border-rose-400 bg-rose-600 text-parchment-100' : 'border-ink-800 bg-ink-950'
        }`}
      >
        {on ? <IconCheck className="h-4 w-4" /> : null}
      </span>
      <span className="min-w-0 flex-1">
        <span
          className={`block text-[15px] leading-snug ${
            on ? 'text-mute-500 line-through' : 'font-medium text-parchment-100'
          }`}
        >
          {item.judul}
        </span>
        {item.catatan ? (
          <span className="mt-0.5 block text-xs leading-relaxed text-mute-500">{item.catatan}</span>
        ) : null}
      </span>
      {/* Badge profil spesifik */}
      {item.untukKategori
        ? item.untukKategori.map((k) => <KategoriBadge key={k} k={k} />)
        : null}
      {/* Tenggat */}
      {item.tenggat ? (
        <span className="flex-none self-start font-mono text-[11px] text-gold-400/80">
          {item.tenggat}
        </span>
      ) : null}
    </button>
  );
}

// ──────────────────────────────────────────────
// Selector profil jamaah (chip multi-select)
// ──────────────────────────────────────────────
function ProfilSelector({
  profil,
  onChange,
}: {
  profil: KategoriJamaah[];
  onChange: (p: KategoriJamaah[]) => void;
}) {
  const toggle = (id: KategoriJamaah) => {
    if (profil.includes(id)) {
      onChange(profil.filter((x) => x !== id));
    } else {
      onChange([...profil, id]);
    }
  };

  return (
    <div className="rounded-2xl border border-ink-800/70 bg-ink-900/40 px-4 py-4">
      <p className="font-mono text-[10px] uppercase tracking-widest text-mute-500">
        Siapa yang berangkat?
      </p>
      <p className="mt-0.5 text-[13px] text-parchment-100/70">
        Checklist Barang Bawaan akan menyesuaikan profil Anda.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {PROFIL_OPTIONS.map((opt) => {
          const active = profil.includes(opt.id);
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => toggle(opt.id)}
              className={`rounded-full border px-4 py-1.5 text-[13px] font-medium transition ${
                active
                  ? 'border-gold-400/60 bg-gold-400/10 text-gold-400'
                  : 'border-ink-800/80 bg-ink-950/60 text-mute-500 hover:border-ink-800 hover:text-parchment-100/70'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
      {profil.length === 0 && (
        <p className="mt-2 text-[11px] text-mute-500/60">
          Belum dipilih — menampilkan semua item.
        </p>
      )}
    </div>
  );
}

// ──────────────────────────────────────────────
// Halaman Persiapan
// ──────────────────────────────────────────────
export default function Persiapan() {
  // ── State: centang item
  const [checked, setChecked] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem('umrahme.persiapan');
      return raw ? new Set<string>(JSON.parse(raw) as string[]) : new Set();
    } catch {
      return new Set();
    }
  });

  // ── State: profil jamaah (Smart Packing)
  const [profil, setProfil] = useState<KategoriJamaah[]>(() => {
    try {
      const raw = localStorage.getItem('umrahme.persiapan.profil');
      return raw ? (JSON.parse(raw) as KategoriJamaah[]) : [];
    } catch {
      return [];
    }
  });

  // ── State: accordion aktif (mobile)
  const [openCat, setOpenCat] = useState<KategoriChecklist | null>(
    () => kategoriChecklist[0]?.id ?? null,
  );

  // ── Persist ke localStorage
  useEffect(() => {
    localStorage.setItem('umrahme.persiapan', JSON.stringify([...checked]));
  }, [checked]);

  useEffect(() => {
    localStorage.setItem('umrahme.persiapan.profil', JSON.stringify(profil));
  }, [profil]);

  const toggle = (id: string) =>
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  // ── Item barang yang terfilter (profil kosong = tampilkan semua)
  const visibleBarangItems = useMemo(
    () => itemsByKategori('barang', profil.length > 0 ? profil : undefined),
    [profil],
  );

  // ── Semua item yang terlihat user (non-barang selalu penuh)
  const allVisibleItems = useMemo(() => {
    const nonBarang = checklistItems.filter((i) => i.kategori !== 'barang');
    return [...nonBarang, ...visibleBarangItems];
  }, [visibleBarangItems]);

  const totalItem = allVisibleItems.length;
  const totalDone = useMemo(
    () => allVisibleItems.filter((i) => checked.has(i.id)).length,
    [allVisibleItems, checked],
  );
  const persen = totalItem > 0 ? Math.round((totalDone / totalItem) * 100) : 0;

  // ── Statistik per kategori
  const statPerKategori = useMemo(
    () =>
      kategoriChecklist.map((k) => {
        const items =
          k.id === 'barang'
            ? visibleBarangItems
            : itemsByKategori(k.id);
        const done = items.filter((i) => checked.has(i.id)).length;
        return { ...k, total: items.length, done, complete: done === items.length };
      }),
    [checked, visibleBarangItems],
  );

  // ── Kategori desktop paling tertinggal
  const laggingKategoriId = useMemo(() => {
    const incomplete = statPerKategori.filter((x) => !x.complete);
    if (!incomplete.length) return null;
    const minRasio = Math.min(...incomplete.map((x) => (x.total > 0 ? x.done / x.total : 0)));
    const allSame = incomplete.every((x) => (x.total > 0 ? x.done / x.total : 0) === minRasio);
    if (allSame) return null;
    return incomplete.find((x) => (x.total > 0 ? x.done / x.total : 0) === minRasio)?.id ?? null;
  }, [statPerKategori]);

  // ── Auto-pindah accordion saat kategori selesai
  useEffect(() => {
    if (!openCat) return;
    const cur = statPerKategori.find((k) => k.id === openCat);
    if (cur?.complete) {
      const next = statPerKategori.find((k) => !k.complete);
      setOpenCat(next ? next.id : null);
    }
  }, [statPerKategori, openCat]);

  // ── Helper: ambil item yang tampil untuk suatu kategori
  const visibleItemsFor = (kategoriId: KategoriChecklist) =>
    kategoriId === 'barang' ? visibleBarangItems : itemsByKategori(kategoriId);

  // ──────────────────────────────────────────────
  return (
    <div>
      <PageHeader title="Persiapan" eyebrow="Profil" backTo="/profil" />

      {/* ===================== MOBILE (< lg) ===================== */}
      <div className="px-5 pt-4 lg:hidden">
        {/* Overview progress */}
        <div className="rounded-2xl border border-ink-800/70 bg-ink-900/50 px-5 py-5">
          <div className="flex items-end justify-between">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-widest text-rose-400">
                Kesiapan Anda
              </p>
              <p className="mt-1 font-display text-4xl font-semibold text-parchment-100">
                {persen}%
              </p>
            </div>
            <p className="font-mono text-sm text-mute-500">
              {totalDone}/{totalItem} tugas
            </p>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-ink-800">
            <div
              className="h-full rounded-full bg-rose-600 transition-all duration-500"
              style={{ width: `${persen}%` }}
            />
          </div>
          {totalDone === 0 ? (
            <p className="mt-3 text-sm leading-relaxed text-mute-500">
              Belum ada yang dicentang. Mulai dari{' '}
              <span className="font-medium text-parchment-100">Dokumen Perjalanan</span> di bawah.
            </p>
          ) : null}
        </div>

        {/* Profil selector (Smart Packing) */}
        <div className="mt-4">
          <ProfilSelector profil={profil} onChange={setProfil} />
        </div>

        {/* Kategori accordion */}
        <div className="mt-4 space-y-3 pb-8">
          {statPerKategori.map((k) => {
            const open = openCat === k.id;
            const items = visibleItemsFor(k.id);
            return (
              <div
                key={k.id}
                className={`overflow-hidden rounded-2xl border bg-ink-900/40 transition-colors ${
                  k.complete ? 'border-gold-400/30' : 'border-ink-800/70'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenCat(open ? null : k.id)}
                  className="flex min-h-[60px] w-full items-center gap-3 px-4 py-3.5 text-left"
                  aria-expanded={open}
                >
                  <span
                    className={`flex h-8 w-8 flex-none items-center justify-center rounded-full border ${
                      k.complete
                        ? 'border-gold-400/50 bg-gold-400/10 text-gold-400'
                        : 'border-ink-800 bg-ink-950 text-mute-500'
                    }`}
                  >
                    {k.complete ? (
                      <IconCheck className="h-4 w-4" />
                    ) : (
                      <span className="font-mono text-[11px]">
                        {k.done}/{k.total}
                      </span>
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-semibold text-parchment-100">{k.judul}</p>
                    <p className="truncate text-xs text-mute-500">
                      {k.complete ? 'Selesai — semua tugas tercentang' : k.deskripsi}
                    </p>
                  </div>
                  <IconChevron
                    className={`h-4 w-4 flex-none text-mute-500 transition-transform ${
                      open ? 'rotate-90' : ''
                    }`}
                  />
                </button>

                {open ? (
                  <ul className="space-y-1 px-3 pb-3 animate-fade-up">
                    {items.map((item) => (
                      <li key={item.id}>
                        <ItemRow
                          item={item}
                          on={checked.has(item.id)}
                          onToggle={() => toggle(item.id)}
                          mobile
                        />
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>

      {/* ===================== DESKTOP (≥ lg) ===================== */}
      <div className="hidden lg:block px-8 py-6 max-w-5xl mx-auto">
        {/* Progress bar header */}
        <div
          className="mb-5 overflow-hidden rounded-2xl border border-ink-800/70 px-6 py-5"
          style={{
            background:
              'radial-gradient(ellipse at 5% 50%, rgba(194,24,91,0.07) 0%, transparent 50%), linear-gradient(135deg, #18090F 0%, #0D0509 100%)',
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-widest text-rose-400">
                Kesiapan Anda
              </p>
              <p className="mt-1 font-display text-5xl font-semibold text-parchment-100">
                {persen}%
              </p>
            </div>
            <div className="text-right">
              <p className="font-mono text-lg text-parchment-100">
                {totalDone}/{totalItem}
              </p>
              <p className="text-sm text-mute-500">tugas selesai</p>
            </div>
          </div>
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-ink-800/80">
            <div
              className="h-full rounded-full bg-rose-600 transition-all duration-500"
              style={{ width: `${persen}%` }}
            />
          </div>
        </div>

        {/* Profil selector (Smart Packing) — full width desktop */}
        <div className="mb-5">
          <ProfilSelector profil={profil} onChange={setProfil} />
        </div>

        {/* Kategori — 2 kolom */}
        <div className="grid grid-cols-2 gap-4">
          {statPerKategori.map((k) => {
            const rasioProgress = k.total > 0 ? k.done / k.total : 1;
            const isLaggingBehind = !k.complete && k.id === laggingKategoriId && rasioProgress < 1;
            const items = visibleItemsFor(k.id);

            return (
              <div
                key={k.id}
                className={`overflow-hidden rounded-2xl border transition-all ${
                  k.complete
                    ? 'border-gold-400/25'
                    : isLaggingBehind
                      ? 'border-rose-600/30'
                      : 'border-ink-800/60'
                }`}
                style={{
                  background: k.complete
                    ? 'linear-gradient(155deg, #1A0E08 0%, #0D0509 100%)'
                    : isLaggingBehind
                      ? 'radial-gradient(ellipse at 100% 0%, rgba(194,24,91,0.08) 0%, transparent 55%), linear-gradient(155deg, #1A080F 0%, #0D0509 100%)'
                      : 'linear-gradient(155deg, #18090F 0%, #0D0509 100%)',
                }}
              >
                {/* Header kategori */}
                <div
                  className={`flex items-center gap-3 border-b px-4 py-3.5 ${
                    k.complete ? 'border-gold-400/15' : 'border-ink-800/50'
                  }`}
                >
                  <span
                    className={`flex h-8 w-8 flex-none items-center justify-center rounded-full border ${
                      k.complete
                        ? 'border-gold-400/50 bg-gold-400/10 text-gold-400'
                        : isLaggingBehind
                          ? 'border-rose-600/40 bg-rose-600/10 text-rose-400'
                          : 'border-ink-800 bg-ink-950/80 text-mute-500'
                    }`}
                  >
                    {k.complete ? (
                      <IconCheck className="h-4 w-4" />
                    ) : (
                      <span className="font-mono text-[11px]">
                        {k.done}/{k.total}
                      </span>
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-semibold text-parchment-100">{k.judul}</p>
                    <p className="truncate text-xs text-mute-500">
                      {k.complete
                        ? 'Selesai — semua tugas tercentang'
                        : isLaggingBehind
                          ? 'Butuh perhatian — belum banyak tercentang'
                          : k.deskripsi}
                    </p>
                  </div>
                  {isLaggingBehind && (
                    <span className="flex-none font-mono text-[9px] uppercase tracking-wider text-rose-400/80">
                      Prioritas
                    </span>
                  )}
                </div>

                {/* Items — selalu terbuka di desktop */}
                <ul className="space-y-1 px-3 py-2">
                  {items.map((item) => (
                    <li key={item.id}>
                      <ItemRow
                        item={item}
                        on={checked.has(item.id)}
                        onToggle={() => toggle(item.id)}
                      />
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
