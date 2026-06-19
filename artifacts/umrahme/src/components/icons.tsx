// =============================================================
// Set ikon minimal & konsisten (stroke 1.6, rounded).
// Sengaja sederhana — bukan ilustrasi. Dipakai di nav & kartu.
// =============================================================
import type { SVGProps } from 'react';

type P = SVGProps<SVGSVGElement>;

const base = (props: P) => ({
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  ...props,
});

export function IconBeranda(p: P) {
  return (
    <svg {...base(p)}>
      <path d="M4 11.5 12 4l8 7.5" />
      <path d="M6 10v9h12v-9" />
    </svg>
  );
}

export function IconPanduan(p: P) {
  return (
    <svg {...base(p)}>
      <path d="M5 4h9a3 3 0 0 1 3 3v13" />
      <path d="M5 4v16h9a3 3 0 0 1 3-1" />
      <path d="M8 9h6M8 13h6" />
    </svg>
  );
}

// Ka'bah-ish: kubus dengan pita melingkar — sederhana
export function IconIbadah(p: P) {
  return (
    <svg {...base(p)}>
      <path d="M12 3 4 7v10l8 4 8-4V7l-8-4Z" />
      <path d="M4 9.5h16" />
    </svg>
  );
}

export function IconDoa(p: P) {
  return (
    <svg {...base(p)}>
      <path d="M12 5c2-2 5-2 6 0s0 5-6 9C6 10 5 7 6 5s4-2 6 0Z" />
    </svg>
  );
}

export function IconProfil(p: P) {
  return (
    <svg {...base(p)}>
      <circle cx="12" cy="8" r="3.4" />
      <path d="M5.5 19a6.5 6.5 0 0 1 13 0" />
    </svg>
  );
}

export function IconBack(p: P) {
  return (
    <svg {...base(p)}>
      <path d="M15 5l-7 7 7 7" />
    </svg>
  );
}

export function IconSearch(p: P) {
  return (
    <svg {...base(p)}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

export function IconPeta(p: P) {
  return (
    <svg {...base(p)}>
      <path d="M12 21s-6.5-6-6.5-10.5a6.5 6.5 0 0 1 13 0C18.5 15 12 21 12 21Z" />
      <circle cx="12" cy="10.5" r="2.2" />
    </svg>
  );
}

export function IconCheck(p: P) {
  return (
    <svg {...base(p)}>
      <path d="m5 12.5 4.5 4.5L19 6" />
    </svg>
  );
}

export function IconSertifikat(p: P) {
  return (
    <svg {...base(p)}>
      <circle cx="12" cy="9" r="5" />
      <path d="M8.5 13 7 21l5-2.5L17 21l-1.5-8" />
    </svg>
  );
}

export function IconChevron(p: P) {
  return (
    <svg {...base(p)}>
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

export function IconReset(p: P) {
  return (
    <svg {...base(p)}>
      <path d="M4 8a8 8 0 1 1-1.5 5" />
      <path d="M3 4v4h4" />
    </svg>
  );
}

export function IconShare(p: P) {
  return (
    <svg {...base(p)}>
      <circle cx="6" cy="12" r="2.5" />
      <circle cx="18" cy="6" r="2.5" />
      <circle cx="18" cy="18" r="2.5" />
      <path d="m8.2 10.8 7.6-3.6M8.2 13.2l7.6 3.6" />
    </svg>
  );
}

export function IconDownload(p: P) {
  return (
    <svg {...base(p)}>
      <path d="M12 4v11m0 0 4-4m-4 4-4-4" />
      <path d="M5 19h14" />
    </svg>
  );
}
