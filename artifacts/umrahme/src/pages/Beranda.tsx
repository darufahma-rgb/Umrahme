import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MihrabCard from '../components/MihrabCard';
import PhaseIndicator from '../components/PhaseIndicator';
import {
  IconDoa,
  IconPanduan,
  IconIbadah,
  IconPeta,
  IconCheck,
  IconSertifikat,
  IconChevron,
} from '../components/icons';

const quickAccess = [
  {
    to: '/doa',
    label: 'Kumpulan Doa',
    Icon: IconDoa,
    desc: 'Talbiyah, doa tawaf, sa\'i & lebih',
  },
  {
    to: '/panduan/tata-cara',
    label: 'Tata Cara',
    Icon: IconPanduan,
    desc: 'Urutan 6 langkah umrah berurutan',
  },
  {
    to: '/panduan/ihram',
    label: 'Panduan Ihram',
    Icon: IconPanduan,
    desc: 'Niat, larangan & cara memakai kain',
  },
  {
    to: '/ibadah/tawaf',
    label: 'Counter Tawaf',
    Icon: IconIbadah,
    desc: 'Hitung 7 putaran dengan satu tap',
  },
  {
    to: '/peta',
    label: 'Peta Lokasi',
    Icon: IconPeta,
    desc: 'Masjid & tempat bersejarah Makkah',
  },
  {
    to: '/profil/persiapan',
    label: 'Persiapan',
    Icon: IconCheck,
    desc: 'Checklist dokumen, barang & kesehatan',
  },
];

function FeaturedCard({ fase }: { fase: string }) {
  if (fase === 'selesai') {
    return (
      <Link to="/profil/sertifikat" className="block active:scale-[0.99]">
        <MihrabCard bodyClassName="px-5 pb-5 pt-2">
          <p className="font-mono text-[11px] uppercase tracking-widest text-gold-400">
            Mabrur, insya Allah
          </p>
          <h2 className="mt-1 font-display text-2xl font-semibold text-parchment-100">
            Lihat Sertifikat Umrah Anda
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-mute-500">
            Rangkaian ibadah telah selesai. Buka kenang-kenangan digital Anda.
          </p>
          <span className="mt-4 inline-flex items-center gap-1 font-medium text-rose-400">
            Buka Sertifikat <IconChevron className="h-4 w-4" />
          </span>
        </MihrabCard>
      </Link>
    );
  }
  if (fase === 'tanah-suci') {
    return (
      <Link to="/ibadah/tawaf" className="block active:scale-[0.99]">
        <MihrabCard bodyClassName="px-5 pb-5 pt-2" fill="#261019">
          <p className="font-mono text-[11px] uppercase tracking-widest text-rose-400">
            Sedang di Tanah Suci
          </p>
          <h2 className="mt-1 font-display text-2xl font-semibold text-parchment-100">
            Mulai Hitung Tawaf
          </h2>
          <p className="mt-1.5 text-sm leading-relaxed text-mute-500">
            Tombol besar, satu tap tiap putaran. Doa muncul otomatis.
          </p>
          <span className="mt-4 inline-flex items-center gap-1 font-medium text-rose-400">
            Buka Counter Tawaf <IconChevron className="h-4 w-4" />
          </span>
        </MihrabCard>
      </Link>
    );
  }
  return (
    <Link to="/profil/persiapan" className="block active:scale-[0.99]">
      <MihrabCard bodyClassName="px-5 pb-5 pt-2">
        <p className="font-mono text-[11px] uppercase tracking-widest text-rose-400">
          Fase Persiapan
        </p>
        <h2 className="mt-1 font-display text-2xl font-semibold text-parchment-100">
          Siapkan Perjalanan Anda
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-mute-500">
          Mulai dari dokumen perjalanan, kesehatan, hingga niat. Centang satu per satu dengan
          tenang.
        </p>
        <span className="mt-4 inline-flex items-center gap-1 font-medium text-rose-400">
          Buka Checklist <IconChevron className="h-4 w-4" />
        </span>
      </MihrabCard>
    </Link>
  );
}

export default function Beranda() {
  const { jamaah } = useAuth();
  if (!jamaah) return null;

  return (
    <>
      {/* ===================== MOBILE (< lg) ===================== */}
      <div className="lg:hidden">
        <header
          className="px-5 pb-2 pt-8"
          style={{ paddingTop: 'max(2rem, env(safe-area-inset-top))' }}
        >
          <p className="font-arab text-xl text-gold-400" dir="rtl">
            السَّلَامُ عَلَيْكُمْ
          </p>
          <h1 className="mt-1 font-display text-3xl font-semibold leading-tight text-parchment-100">
            {jamaah.nama.split(' ')[0]}
          </h1>
          <p className="mt-1 text-sm text-mute-500">
            Disediakan oleh <span className="text-parchment-100">{jamaah.travel}</span>
          </p>
        </header>

        <div className="mx-5 mt-3 rounded-xl border border-ink-800/70 bg-ink-900/50 px-4 py-3">
          <PhaseIndicator fase={jamaah.fase} />
        </div>

        <section className="mt-6 px-5">
          <FeaturedCard fase={jamaah.fase} />
        </section>

        <section className="mt-7 px-5">
          <h3 className="mb-3 font-mono text-[11px] uppercase tracking-widest text-mute-500">
            Akses Cepat
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {quickAccess.map(({ to, label, Icon }) => (
              <Link
                key={to + label}
                to={to}
                className="flex min-h-[92px] flex-col items-center justify-center gap-2 rounded-2xl border border-ink-800/70 bg-ink-900/60 px-2 py-3 text-center active:scale-[0.97]"
              >
                <Icon className="h-6 w-6 text-rose-400" />
                <span className="text-[12px] font-medium leading-tight text-parchment-100">
                  {label}
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-4 px-5">
          <Link
            to="/profil/sertifikat"
            className="flex items-center gap-3 rounded-2xl border border-ink-800/70 bg-ink-900/40 px-4 py-3.5 active:scale-[0.99]"
          >
            <IconSertifikat className="h-5 w-5 flex-none text-gold-400" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-parchment-100">Sertifikat Digital</p>
              <p className="truncate text-xs text-mute-500">Terbit setelah ibadah selesai</p>
            </div>
            <IconChevron className="h-4 w-4 flex-none text-mute-500" />
          </Link>
        </section>
      </div>

      {/* ===================== DESKTOP (≥ lg) ===================== */}
      <div className="hidden lg:block px-8 py-8 max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-7">
          <p className="font-arab text-2xl text-gold-400" dir="rtl">
            السَّلَامُ عَلَيْكُمْ
          </p>
          <h1 className="mt-1 font-display text-4xl font-semibold leading-tight text-parchment-100">
            {jamaah.nama.split(' ')[0]}
          </h1>
          <p className="mt-1.5 text-sm text-mute-500">
            Selamat datang di Umrahme — Disediakan oleh{' '}
            <span className="text-parchment-100">{jamaah.travel}</span>
          </p>
        </header>

        {/* Dua kolom utama */}
        <div className="grid grid-cols-5 gap-7">
          {/* Kolom kiri — fase + featured card */}
          <div className="col-span-3 space-y-5">
            <div className="rounded-xl border border-ink-800/70 bg-ink-900/50 px-5 py-4">
              <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-mute-500">
                Fase Perjalanan
              </p>
              <PhaseIndicator fase={jamaah.fase} />
            </div>
            <FeaturedCard fase={jamaah.fase} />
          </div>

          {/* Kolom kanan — akses cepat dengan deskripsi + sertifikat */}
          <div className="col-span-2 flex flex-col gap-5">
            <div>
              <h3 className="mb-3 font-mono text-[11px] uppercase tracking-widest text-mute-500">
                Akses Cepat
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {quickAccess.map(({ to, label, Icon, desc }) => (
                  <Link
                    key={to + label}
                    to={to}
                    className="group flex flex-col gap-2.5 rounded-2xl border border-ink-800/70 bg-ink-900/60 px-4 py-4 transition-colors hover:border-ink-700 hover:bg-ink-900 active:scale-[0.98]"
                  >
                    <Icon className="h-6 w-6 text-rose-400" />
                    <div>
                      <p className="text-[13px] font-semibold leading-tight text-parchment-100">
                        {label}
                      </p>
                      <p className="mt-0.5 text-[12px] leading-relaxed text-mute-500">{desc}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <Link
              to="/profil/sertifikat"
              className="flex items-center gap-3 rounded-2xl border border-ink-800/70 bg-ink-900/40 px-4 py-4 transition-colors hover:border-ink-700 active:scale-[0.99]"
            >
              <IconSertifikat className="h-5 w-5 flex-none text-gold-400" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-parchment-100">Sertifikat Digital</p>
                <p className="text-xs text-mute-500">Terbit setelah rangkaian ibadah selesai</p>
              </div>
              <IconChevron className="h-4 w-4 flex-none text-mute-500" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
