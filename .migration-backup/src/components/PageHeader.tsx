import { useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { IconBack } from './icons';

// =============================================================
// PageHeader — header halaman dalam, dengan tombol KEMBALI yang
// posisinya KONSISTEN di pojok kiri atas semua halaman.
// `eyebrow` = teks orientasi "saya di mana" (tampil sebelum judul).
// =============================================================

interface PageHeaderProps {
  title: string;
  eyebrow?: string;
  /** ke mana tombol kembali pergi; default: history back */
  backTo?: string;
  /** elemen aksi di kanan (opsional) */
  action?: ReactNode;
  sticky?: boolean;
}

export default function PageHeader({
  title,
  eyebrow,
  backTo,
  action,
  sticky = true,
}: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <header
      className={`${
        sticky ? 'sticky top-0 z-30' : ''
      } border-b border-ink-800/70 bg-ink-950/90 px-4 pb-3 pt-4 backdrop-blur-md`}
      style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => (backTo ? navigate(backTo) : navigate(-1))}
          aria-label="Kembali"
          className="flex h-11 w-11 flex-none items-center justify-center rounded-full border border-ink-800 bg-ink-900 text-parchment-100 active:scale-95"
        >
          <IconBack className="h-5 w-5" />
        </button>
        <div className="min-w-0 flex-1">
          {eyebrow ? (
            <p className="truncate font-mono text-[11px] uppercase tracking-widest text-rose-400">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="truncate font-display text-xl font-semibold leading-tight text-parchment-100">
            {title}
          </h1>
        </div>
        {action ? <div className="flex-none">{action}</div> : null}
      </div>
    </header>
  );
}
