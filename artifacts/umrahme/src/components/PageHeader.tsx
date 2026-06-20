import { useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { IconBack } from './icons';

interface PageHeaderProps {
  title: string;
  eyebrow?: string;
  backTo?: string;
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
      } border-b border-hairline bg-canvas/95 px-4 pb-3 pt-4 backdrop-blur-md`}
      style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => (backTo ? navigate(backTo) : navigate(-1))}
          aria-label="Kembali"
          className="flex h-11 w-11 flex-none items-center justify-center rounded-full border border-hairline bg-surface-card text-ink active:scale-95 shadow-drop-card"
        >
          <IconBack className="h-5 w-5" />
        </button>
        <div className="min-w-0 flex-1">
          {eyebrow ? (
            <p className="truncate font-mono text-[11px] uppercase tracking-widest text-primary">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="truncate font-display text-xl font-bold leading-tight text-ink">
            {title}
          </h1>
        </div>
        {action ? <div className="flex-none">{action}</div> : null}
      </div>
    </header>
  );
}
