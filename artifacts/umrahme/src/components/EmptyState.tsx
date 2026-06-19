import type { ReactNode } from 'react';

// Empty state yang DIDESAIN — bukan layar kosong. Selalu ada ajakan jelas.
export default function EmptyState({
  icon,
  title,
  desc,
  action,
}: {
  icon?: ReactNode;
  title: string;
  desc: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center px-8 py-12 text-center">
      {icon ? (
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-ink-800 bg-ink-900 text-rose-400">
          {icon}
        </div>
      ) : null}
      <h3 className="font-display text-lg font-semibold text-parchment-100">{title}</h3>
      <p className="mt-1.5 max-w-[26ch] text-pretty text-sm leading-relaxed text-mute-500">
        {desc}
      </p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
