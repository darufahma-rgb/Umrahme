import type { ReactNode } from 'react';

// =============================================================
// MihrabCard — elemen signature Umrahme.
// Kartu dengan lengkung halus (siluet mihrab) di tepi atas,
// dengan GARIS TIPIS GOLD hanya pada lengkungan itu — bukan di
// seluruh tepi kartu. Dipakai konsisten untuk konten ibadah.
// =============================================================

interface MihrabCardProps {
  children: ReactNode;
  className?: string;
  /** padding badan kartu */
  bodyClassName?: string;
  /** warna isi kartu; default surface ink-900 */
  fill?: string;
}

export default function MihrabCard({
  children,
  className = '',
  bodyClassName = 'px-5 pb-5 pt-1',
  fill = '#18090F',
}: MihrabCardProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Tudung lengkung mihrab — garis gold hanya mengikuti kurva atas */}
      <svg
        viewBox="0 0 100 22"
        preserveAspectRatio="none"
        className="block w-full h-[26px]"
        aria-hidden="true"
      >
        <path
          d="M0,22 L0,13 C0,5 24,0.6 50,0.6 C76,0.6 100,5 100,13 L100,22"
          fill={fill}
          stroke="#D4A24E"
          strokeWidth="1"
          strokeOpacity="0.8"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {/* Badan kartu — menyambung mulus dengan tudung */}
      <div
        className={`-mt-px rounded-b-2xl ${bodyClassName}`}
        style={{ backgroundColor: fill }}
      >
        {children}
      </div>
    </div>
  );
}
