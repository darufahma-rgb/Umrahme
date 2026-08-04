import { useEffect, useMemo, useRef, useState } from 'react';
import { kategoriChecklist, checklistItems, itemsByKategori } from '../data/checklist';
import type { ChecklistItem as ChecklistItemType, KategoriChecklist, KategoriJamaah } from '../types';
import PageHeader from '../components/PageHeader';
import { IconCheck, IconChevron } from '../components/icons';
import { useAuth } from '../context/AuthContext';
import { getJamaahData, setJamaahData } from '../lib/supabase';

const PROFIL_OPTIONS: { id: KategoriJamaah; label: string }[] = [
  { id: 'laki-laki', label: 'Laki-laki' },
  { id: 'perempuan', label: 'Perempuan' },
  { id: 'lansia', label: 'Lansia' },
];

const BADGE_STYLE: Record<KategoriJamaah, string> = {
  'laki-laki': 'border-primary/20 text-primary/70',
  perempuan: 'border-gold/30 text-gold/70',
  lansia: 'border-charcoal/30 text-charcoal/70',
};

const BADGE_LABEL: Record<KategoriJamaah, string> = {
  'laki-laki': 'Pria',
  perempuan: 'Wanita',
  lansia: 'Lansia',
};

function KategoriBadge({ k }: { k: KategoriJamaah }) {
  return (
    <span className={`flex-none self-start rounded-full border px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-wider ${BADGE_STYLE[k]}`}>
      {BADGE_LABEL[k]}
    </span>
  );
}

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
      className={`flex w-full items-start gap-3 rounded-md px-3 py-3 text-left transition ${
        mobile
          ? 'min-h-[56px] active:bg-surface-bone'
          : 'min-h-[52px] active:bg-surface-bone lg:hover:bg-surface-bone'
      }`}
    >
      <span
        className={`mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-md border transition ${
          on ? 'border-primary bg-primary text-on-primary' : 'border-hairline bg-canvas'
        }`}
      >
        {on ? <IconCheck className="h-4 w-4" /> : null}
      </span>
      <span className="min-w-0 flex-1">
        <span
          className={`block text-[15px] leading-snug ${
            on ? 'text-mute line-through' : 'font-medium text-ink'
          }`}
        >
          {item.judul}
        </span>
        {item.catatan ? (
          <span className="mt-0.5 block text-xs leading-relaxed text-charcoal">{item.catatan}</span>
        ) : null}
      </span>
      {item.untukKategori ? item.untukKategori.map((k) => <KategoriBadge key={k} k={k} />) : null}
      {item.tenggat ? (
        <span className="flex-none self-start font-mono text-[11px] text-gold/80">
          {item.tenggat}
        </span>
      ) : null}
    </button>
  );
}

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
    <section className="border-y border-hairline py-4">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-mute">
        Siapa yang berangkat?
      </p>
      <p className="mt-1 text-[13px] text-charcoal">
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
                  ? 'border-primary/40 bg-primary/10 text-primary'
                  : 'border-hairline bg-surface-bone text-mute hover:border-hairline-strong hover:text-body'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
      {profil.length === 0 && (
        <p className="mt-2 text-[11px] text-ash">
          Belum dipilih — menampilkan semua item.
        </p>
      )}
    </section>
  );
}

export default function Persiapan() {
  const { jamaah, tenant } = useAuth();
  const tenantId = tenant?.id;
  const nomor = jamaah?.nomorJamaah;

  const [checked, setChecked] = useState<Set<string>>(() => {
    try {
      const raw = localStorage.getItem('umrahme.persiapan');
      return raw ? new Set<string>(JSON.parse(raw) as string[]) : new Set();
    } catch {
      return new Set();
    }
  });

  const [profil, setProfil] = useState<KategoriJamaah[]>(() => {
    try {
      const raw = localStorage.getItem('umrahme.persiapan.profil');
      return raw ? (JSON.parse(raw) as KategoriJamaah[]) : [];
    } catch {
      return [];
    }
  });

  const [openCat, setOpenCat] = useState<KategoriChecklist | null>(
    () => kategoriChecklist[0]?.id ?? null,
  );

  const cloudLoadedRef = useRef(false);
  useEffect(() => {
    if (!tenantId || !nomor || cloudLoadedRef.current) return;
    cloudLoadedRef.current = true;
    (async () => {
      try {
        const [cloudChecked, cloudProfil] = await Promise.all([
          getJamaahData<string[]>(tenantId, nomor, 'persiapan'),
          getJamaahData<KategoriJamaah[]>(tenantId, nomor, 'persiapan.profil'),
        ]);
        if (cloudChecked !== null) {
          setChecked(new Set(cloudChecked));
          localStorage.setItem('umrahme.persiapan', JSON.stringify(cloudChecked));
        }
        if (cloudProfil !== null) {
          setProfil(cloudProfil);
          localStorage.setItem('umrahme.persiapan.profil', JSON.stringify(cloudProfil));
        }
      } catch { /* offline — localStorage tetap dipakai */ }
    })();
  }, [tenantId, nomor]);

  useEffect(() => {
    const arr = [...checked];
    localStorage.setItem('umrahme.persiapan', JSON.stringify(arr));
    if (tenantId && nomor) setJamaahData(tenantId, nomor, 'persiapan', arr).catch(() => {});
  }, [checked, tenantId, nomor]);

  useEffect(() => {
    localStorage.setItem('umrahme.persiapan.profil', JSON.stringify(profil));
    if (tenantId && nomor) setJamaahData(tenantId, nomor, 'persiapan.profil', profil).catch(() => {});
  }, [profil, tenantId, nomor]);

  const toggle = (id: string) =>
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const visibleBarangItems = useMemo(
    () => itemsByKategori('barang', profil.length > 0 ? profil : undefined),
    [profil],
  );

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

  const statPerKategori = useMemo(
    () =>
      kategoriChecklist.map((k) => {
        const items = k.id === 'barang' ? visibleBarangItems : itemsByKategori(k.id);
        const done = items.filter((i) => checked.has(i.id)).length;
        return { ...k, total: items.length, done, complete: done === items.length };
      }),
    [checked, visibleBarangItems],
  );

  const laggingKategoriId = useMemo(() => {
    const incomplete = statPerKategori.filter((x) => !x.complete);
    if (!incomplete.length) return null;
    const minRasio = Math.min(...incomplete.map((x) => (x.total > 0 ? x.done / x.total : 0)));
    const allSame = incomplete.every((x) => (x.total > 0 ? x.done / x.total : 0) === minRasio);
    if (allSame) return null;
    return incomplete.find((x) => (x.total > 0 ? x.done / x.total : 0) === minRasio)?.id ?? null;
  }, [statPerKategori]);

  useEffect(() => {
    if (!openCat) return;
    const cur = statPerKategori.find((k) => k.id === openCat);
    if (cur?.complete) {
      const next = statPerKategori.find((k) => !k.complete);
      setOpenCat(next ? next.id : null);
    }
  }, [statPerKategori, openCat]);

  const visibleItemsFor = (kategoriId: KategoriChecklist) =>
    kategoriId === 'barang' ? visibleBarangItems : itemsByKategori(kategoriId);

  return (
    <div>
      <PageHeader title="Persiapan" eyebrow="Profil" backTo="/profil" />

      {/* ===================== MOBILE (< lg) ===================== */}
      <div className="px-5 pt-4 lg:hidden">
        <section className="border-b border-hairline pb-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
                Kesiapan Anda
              </p>
              <p className="mt-1 text-4xl font-extrabold tracking-[-1px] text-ink">
                {persen}%
              </p>
            </div>
            <p className="pb-1 text-[13px] font-medium text-mute">{totalDone} dari {totalItem} selesai</p>
          </div>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-surface-bone">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${persen}%` }}
            />
          </div>
          {totalDone === 0 ? (
            <p className="mt-3 text-[13px] leading-relaxed text-charcoal">
              Mulai dari <span className="font-semibold text-ink">Dokumen Perjalanan</span>.
            </p>
          ) : null}
        </section>

        <div className="mt-5">
          <ProfilSelector profil={profil} onChange={setProfil} />
        </div>

        <div className="mt-5 pb-8">
          {statPerKategori.map((k) => {
            const open = openCat === k.id;
            const items = visibleItemsFor(k.id);
            return (
              <div key={k.id} className="border-b border-hairline">
                <button
                  type="button"
                  onClick={() => setOpenCat(open ? null : k.id)}
                  className="flex min-h-[64px] w-full items-center gap-3 py-3 text-left"
                  aria-expanded={open}
                >
                  <span className={`flex h-8 w-8 flex-none items-center justify-center rounded-full ${
                    k.complete ? 'bg-primary text-on-primary' : 'bg-surface-bone text-mute'
                  }`}>
                    {k.complete ? (
                      <IconCheck className="h-4 w-4" />
                    ) : (
                      <span className="font-mono text-[11px]">
                        {k.done}/{k.total}
                      </span>
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[15px] font-semibold text-ink">{k.judul}</p>
                    <p className="truncate text-xs text-charcoal">
                      {k.complete ? 'Selesai — semua tugas tercentang' : k.deskripsi}
                    </p>
                  </div>
                  <IconChevron
                    className={`h-4 w-4 flex-none text-ash transition-transform ${
                      open ? 'rotate-90' : ''
                    }`}
                  />
                </button>

                {open ? (
                  <ul className="mb-3 space-y-1 rounded-lg bg-surface-bone/60 px-2 py-1 animate-fade-up">
                    {items.map((item) => (
                      <li key={item.id}>
                        <ItemRow item={item} on={checked.has(item.id)} onToggle={() => toggle(item.id)} mobile />
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
      <div className="hidden lg:block max-w-5xl mx-auto px-8 py-6">
        <section className="mb-5 border-b border-hairline pb-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">
                Kesiapan Anda
              </p>
              <p className="mt-1 text-5xl font-extrabold tracking-[-1px] text-ink">
                {persen}%
              </p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-ink">{totalDone}/{totalItem}</p>
              <p className="text-sm text-charcoal">tugas selesai</p>
            </div>
          </div>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-surface-bone">
            <div
              className="h-full rounded-full bg-primary transition-all duration-500"
              style={{ width: `${persen}%` }}
            />
          </div>
        </section>

        <div className="mb-5">
          <ProfilSelector profil={profil} onChange={setProfil} />
        </div>

        <div className="grid grid-cols-2 gap-x-8">
          {statPerKategori.map((k) => {
            const rasioProgress = k.total > 0 ? k.done / k.total : 1;
            const isLaggingBehind = !k.complete && k.id === laggingKategoriId && rasioProgress < 1;
            const items = visibleItemsFor(k.id);

            return (
              <div
                key={k.id}
                className="border-b border-hairline"
              >
                <div
                  className="flex items-center gap-3 py-3.5"
                >
                  <span
                    className={`flex h-8 w-8 flex-none items-center justify-center rounded-full ${
                      k.complete
                        ? 'bg-primary text-on-primary'
                        : isLaggingBehind
                          ? 'bg-primary/10 text-primary'
                          : 'bg-surface-bone text-mute'
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
                    <p className="text-[15px] font-semibold text-ink">{k.judul}</p>
                    <p className="truncate text-xs text-charcoal">
                      {k.complete
                        ? 'Selesai — semua tugas tercentang'
                        : isLaggingBehind
                          ? 'Butuh perhatian — belum banyak tercentang'
                          : k.deskripsi}
                    </p>
                  </div>
                  {isLaggingBehind && (
                    <span className="flex-none font-mono text-[9px] uppercase tracking-wider text-primary/80">
                      Prioritas
                    </span>
                  )}
                </div>

                <ul className="mb-3 space-y-1 rounded-lg bg-surface-bone/60 px-2 py-1">
                  {items.map((item) => (
                    <li key={item.id}>
                      <ItemRow item={item} on={checked.has(item.id)} onToggle={() => toggle(item.id)} />
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
