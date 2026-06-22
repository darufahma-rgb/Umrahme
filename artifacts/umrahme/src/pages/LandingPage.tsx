import { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const WA_NUMBER = '6281234567890';
const WA_MESSAGE = encodeURIComponent(
  "Assalamu'alaikum, saya pemilik travel umrah dan tertarik dengan Umrahme. Boleh minta info demo?"
);
const WA_LINK = `https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`;

function FadeIn({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

const features = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
      </svg>
    ),
    title: 'Kumpulan doa lengkap',
    desc: "55+ doa per tahapan ibadah, dari ihram sampai tawaf wada'. Arab, latin, terjemahan.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
      </svg>
    ),
    title: 'Manasik interaktif',
    desc: 'Modul belajar tata cara umrah lengkap, bisa dipelajari jamaah sebelum berangkat.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
      </svg>
    ),
    title: 'Counter tawaf & sa\'i',
    desc: 'Penghitung putaran otomatis dengan doa per putaran. Tidak salah hitung lagi.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
      </svg>
    ),
    title: 'Ritual navigator',
    desc: 'Pemandu langkah demi langkah saat ibadah berlangsung.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
      </svg>
    ),
    title: 'Peta lokasi ziarah',
    desc: '10 lokasi bersejarah lengkap dengan sejarah & Google Maps (Masjidil Haram, Nabawi, Quba, Uhud, dll).',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
      </svg>
    ),
    title: 'Agenda perjalanan',
    desc: 'Jadwal harian yang diatur travel, tampil otomatis di HP jamaah sesuai fase perjalanan.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
      </svg>
    ),
    title: 'Kartu jamaah digital',
    desc: 'Identitas digital: nama, rombongan, hotel, kontak pembimbing. Berguna saat darurat.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    ),
    title: 'Jadwal sholat',
    desc: 'Waktu sholat akurat sesuai lokasi jamaah di Makkah & Madinah.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
      </svg>
    ),
    title: 'Sertifikat & jurnal',
    desc: 'Sertifikat umrah digital + jurnal kenangan perjalanan ibadah.',
  },
];

const benefits = [
  {
    icon: '✦',
    title: 'Brand travel Anda makin kuat',
    desc: 'Nama, logo, dan warna travel tampil di seluruh aplikasi. Jamaah memegang aplikasi bermerek travel Anda setiap hari selama perjalanan — promosi berjalan sepanjang umrah.',
  },
  {
    icon: '✦',
    title: 'Pengganti buku doa cetak',
    desc: '55+ doa lengkap dengan teks Arab, latin, dan terjemahan dalam genggaman. Hemat biaya cetak, tidak hilang, selalu terbawa. Saat muthowif menjelaskan, jamaah bisa ikuti langsung di aplikasi.',
  },
  {
    icon: '✦',
    title: 'Beban muthowif & tim lebih ringan',
    desc: 'Pertanyaan berulang seperti "jadwal hari ini apa?", "doanya bagaimana?", "hotel kita di mana?" terjawab sendiri lewat aplikasi. Muthowif fokus membimbing, bukan mengulang informasi.',
  },
  {
    icon: '✦',
    title: 'Jamaah lebih puas, lebih banyak referral',
    desc: 'Jamaah yang terlayani dengan baik merekomendasikan travel Anda. Pengalaman digital yang rapi jadi pembeda dari travel lain yang masih manual.',
  },
];

const steps = [
  {
    num: '01',
    title: 'Atur branding & data lewat portal travel',
    desc: 'Login ke portal, atur nama travel, logo, warna, data hotel, pembimbing, dan agenda keberangkatan. Semua dalam kendali Anda.',
  },
  {
    num: '02',
    title: 'Bagikan kode aktivasi ke jamaah',
    desc: 'Setiap keberangkatan dapat kode unik. Jamaah cukup buka link, masukkan kode & nama — langsung masuk tanpa install dari Play Store.',
  },
  {
    num: '03',
    title: 'Kirim pengumuman kapan saja',
    desc: 'Ada perubahan jadwal atau info penting? Kirim langsung dari portal, muncul di HP semua jamaah. Tidak perlu broadcast WhatsApp satu per satu.',
  },
];

export default function LandingPage() {
  useEffect(() => {
    document.title = 'Umrahme — Digitalisasi layanan jamaah travel Anda';
  }, []);

  return (
    <div
      className="min-h-screen font-sans antialiased"
      style={{ backgroundColor: '#faf8f4', color: '#1a1a1a' }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Amiri:wght@400;700&family=Inter:wght@400;500;600&display=swap');
        .font-display { font-family: 'Playfair Display', Georgia, serif; }
        .font-amiri { font-family: 'Amiri', serif; }
        .font-body { font-family: 'Inter', system-ui, sans-serif; }
        .gold { color: #b8860b; }
        .gold-light { color: #d4a24e; }
        .bg-gold { background-color: #b8860b; }
        .bg-gold-light { background-color: #d4a24e; }
        .border-gold { border-color: #d4a24e; }
        .navy { color: #1a2744; }
        .bg-navy { background-color: #1a2744; }
        .bg-cream { background-color: #faf8f4; }
        .bg-cream-deep { background-color: #f0e9da; }
        .btn-gold {
          background: linear-gradient(135deg, #b8860b 0%, #d4a24e 50%, #b8860b 100%);
          background-size: 200% 100%;
          transition: background-position 0.4s ease, transform 0.2s ease, box-shadow 0.2s ease;
          box-shadow: 0 4px 16px rgba(184,134,11,0.3);
        }
        .btn-gold:hover {
          background-position: right center;
          transform: translateY(-1px);
          box-shadow: 0 6px 24px rgba(184,134,11,0.4);
        }
        .btn-outline {
          border: 1.5px solid #b8860b;
          color: #b8860b;
          transition: all 0.2s ease;
        }
        .btn-outline:hover {
          background-color: #b8860b;
          color: #fff;
          transform: translateY(-1px);
        }
        .btn-outline-light {
          border: 1.5px solid rgba(212,162,78,0.7);
          color: #d4a24e;
          transition: all 0.2s ease;
        }
        .btn-outline-light:hover {
          background-color: rgba(212,162,78,0.15);
          border-color: #d4a24e;
        }
        .card-feature {
          background: #fff;
          border: 1px solid rgba(212,162,78,0.15);
          transition: all 0.25s ease;
        }
        .card-feature:hover {
          border-color: rgba(184,134,11,0.35);
          transform: translateY(-3px);
          box-shadow: 0 8px 32px rgba(184,134,11,0.1);
        }
        .section-divider {
          width: 48px;
          height: 2px;
          background: linear-gradient(90deg, #b8860b, #d4a24e);
          border-radius: 2px;
        }
      `}</style>

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 bg-cream border-b border-gold border-opacity-20" style={{ borderColor: 'rgba(212,162,78,0.2)' }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-display text-xl font-bold" style={{ color: '#1a2744' }}>Umrahme</span>
            <span className="hidden sm:block text-xs px-2 py-0.5 rounded-full font-body font-medium" style={{ backgroundColor: 'rgba(184,134,11,0.1)', color: '#b8860b' }}>for Travel</span>
          </div>
          <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold text-white text-sm font-body font-semibold px-5 py-2 rounded-full"
          >
            Minta Demo
          </a>
        </div>
      </nav>

      {/* ══════════════════════════════════════════
          SECTION 1 — HERO
      ══════════════════════════════════════════ */}
      <section className="relative overflow-hidden pt-20 pb-24 px-6">
        {/* subtle background pattern */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(212,162,78,0.08) 0%, transparent 60%), radial-gradient(circle at 10% 80%, rgba(26,39,68,0.04) 0%, transparent 50%)',
          }}
        />
        <div className="relative max-w-4xl mx-auto text-center">
          {/* arabic salam */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="font-amiri text-2xl mb-4"
            style={{ color: '#b8860b', letterSpacing: '0.02em' }}
          >
            السَّلامُ عَلَيْكُم
          </motion.p>

          {/* badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 font-body text-sm font-medium"
            style={{ backgroundColor: 'rgba(26,39,68,0.06)', color: '#1a2744', border: '1px solid rgba(26,39,68,0.1)' }}
          >
            <span style={{ color: '#b8860b' }}>◆</span>
            Untuk Pemilik Travel Umrah
          </motion.div>

          {/* headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="font-display font-bold mb-6 leading-tight"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', color: '#1a2744' }}
          >
            Digitalisasi layanan jamaah Anda —{' '}
            <span style={{ color: '#b8860b' }}>tampil dengan nama travel Anda sendiri</span>
          </motion.h1>

          {/* subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6 }}
            className="font-body text-lg leading-relaxed mb-10 max-w-2xl mx-auto"
            style={{ color: '#4a4a4a' }}
          >
            Umrahme adalah aplikasi pendamping umrah yang bisa Anda white-label sepenuhnya. Jamaah melihatnya sebagai aplikasi milik travel Anda — bukan kami. Satu pendamping untuk seluruh perjalanan ibadah mereka.
          </motion.p>

          {/* pills */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            className="flex flex-wrap justify-center gap-3 mb-10"
          >
            {['White-label penuh', 'Ganti buku doa cetak', 'Tanpa perlu install'].map((pill) => (
              <span
                key={pill}
                className="font-body text-sm font-medium px-4 py-1.5 rounded-full"
                style={{ backgroundColor: '#fff', border: '1.5px solid rgba(184,134,11,0.3)', color: '#5a3e00' }}
              >
                {pill}
              </span>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold text-white font-body font-semibold px-8 py-3.5 rounded-full text-base"
            >
              Minta Demo Gratis
            </a>
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline font-body font-semibold px-8 py-3.5 rounded-full text-base flex items-center justify-center gap-2"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.554 4.122 1.526 5.852L.057 23.143a.75.75 0 0 0 .916.944l5.458-1.445A11.944 11.944 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.9 0-3.7-.502-5.263-1.381l-.378-.214-3.928 1.04 1.072-3.835-.234-.393A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
              </svg>
              Hubungi via WhatsApp
            </a>
          </motion.div>

          {/* phone mockup */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mt-16 flex justify-center"
          >
            <div
              className="relative rounded-[2.5rem] shadow-2xl"
              style={{
                width: 260,
                height: 520,
                background: 'linear-gradient(160deg, #1a2744 0%, #0f1928 100%)',
                border: '6px solid #2a3a5e',
                boxShadow: '0 40px 80px rgba(26,39,68,0.3), 0 0 0 1px rgba(212,162,78,0.15)',
              }}
            >
              {/* notch */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-1.5 rounded-full" style={{ backgroundColor: '#2a3a5e' }} />
              {/* screen content */}
              <div className="absolute inset-3 rounded-[1.8rem] overflow-hidden" style={{ backgroundColor: '#f5f0e8' }}>
                {/* app header */}
                <div className="px-4 pt-5 pb-3" style={{ background: 'linear-gradient(135deg, #1a2744, #2a3a5e)' }}>
                  <p className="font-amiri text-center text-base" style={{ color: '#d4a24e' }}>بِسْمِ اللهِ</p>
                  <p className="font-body text-center text-white text-xs mt-0.5 font-medium">Travel Barokah Mandiri</p>
                </div>
                {/* mock greeting */}
                <div className="px-4 py-4">
                  <p className="font-body text-xs" style={{ color: '#888' }}>Selamat datang,</p>
                  <p className="font-body text-sm font-semibold" style={{ color: '#1a2744' }}>Ahmad Fauzi</p>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {['Doa Harian', 'Jadwal', 'Counter', 'Peta'].map((item) => (
                      <div key={item} className="rounded-xl p-2.5 text-center" style={{ backgroundColor: '#fff', border: '1px solid rgba(212,162,78,0.2)' }}>
                        <div className="w-6 h-6 rounded-full mx-auto mb-1" style={{ background: 'linear-gradient(135deg, #b8860b, #d4a24e)' }} />
                        <p className="font-body text-xs font-medium" style={{ color: '#1a2744' }}>{item}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 rounded-xl p-3" style={{ backgroundColor: '#fff', border: '1px solid rgba(212,162,78,0.2)' }}>
                    <p className="font-body text-xs font-semibold mb-1" style={{ color: '#b8860b' }}>Agenda Hari Ini</p>
                    <p className="font-body text-xs" style={{ color: '#444' }}>07:00 — Tawaf Qudum</p>
                    <p className="font-body text-xs" style={{ color: '#444' }}>09:00 — Sa'i</p>
                  </div>
                </div>
              </div>
              {/* gold glow */}
              <div
                className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle, rgba(212,162,78,0.3) 0%, transparent 70%)' }}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 2 — MANFAAT BISNIS
      ══════════════════════════════════════════ */}
      <section className="py-24 px-6" style={{ backgroundColor: '#fff' }}>
        <div className="max-w-6xl mx-auto">
          <FadeIn className="text-center mb-16">
            <div className="section-divider mx-auto mb-6" />
            <h2 className="font-display font-bold mb-4" style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', color: '#1a2744' }}>
              Nilai tambah nyata untuk bisnis travel Anda
            </h2>
            <p className="font-body text-base max-w-xl mx-auto" style={{ color: '#666' }}>
              Lebih dari sekadar aplikasi — ini investasi pada kepuasan jamaah dan reputasi travel Anda.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((b, i) => (
              <FadeIn key={b.title} delay={i * 0.1}>
                <div className="card-feature rounded-2xl p-8 h-full">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 text-sm font-bold"
                    style={{ background: 'linear-gradient(135deg, rgba(184,134,11,0.12), rgba(212,162,78,0.2))', color: '#b8860b' }}
                  >
                    {b.icon}
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-3" style={{ color: '#1a2744' }}>{b.title}</h3>
                  <p className="font-body text-sm leading-relaxed" style={{ color: '#555' }}>{b.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 3 — FITUR
      ══════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-cream">
        <div className="max-w-6xl mx-auto">
          <FadeIn className="text-center mb-16">
            <div className="section-divider mx-auto mb-6" />
            <h2 className="font-display font-bold mb-4" style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', color: '#1a2744' }}>
              Pendamping lengkap dari persiapan hingga pulang
            </h2>
            <p className="font-body text-base max-w-xl mx-auto" style={{ color: '#666' }}>
              Semua fitur sudah jadi dan siap pakai — tinggal aktifkan untuk jamaah Anda.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <FadeIn key={f.title} delay={Math.floor(i / 3) * 0.1 + (i % 3) * 0.07}>
                <div className="card-feature rounded-2xl p-6 h-full bg-cream">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: 'linear-gradient(135deg, #1a2744, #2a3a5e)', color: '#d4a24e' }}
                  >
                    {f.icon}
                  </div>
                  <h3 className="font-body font-semibold text-base mb-2" style={{ color: '#1a2744' }}>{f.title}</h3>
                  <p className="font-body text-sm leading-relaxed" style={{ color: '#666' }}>{f.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 4 — CARA KERJA
      ══════════════════════════════════════════ */}
      <section className="py-24 px-6" style={{ backgroundColor: '#fff' }}>
        <div className="max-w-6xl mx-auto">
          <FadeIn className="text-center mb-16">
            <div className="section-divider mx-auto mb-6" />
            <h2 className="font-display font-bold mb-4" style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', color: '#1a2744' }}>
              Travel pegang kendali penuh lewat portal
            </h2>
            <p className="font-body text-base max-w-xl mx-auto" style={{ color: '#666' }}>
              Setup mudah, tanpa pengetahuan teknis. Siap dalam hitungan menit.
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <FadeIn key={s.num} delay={i * 0.12}>
                <div className="relative text-center md:text-left">
                  {/* connector line desktop */}
                  {i < steps.length - 1 && (
                    <div
                      className="hidden md:block absolute top-7 left-[calc(50%+1.5rem)] w-full h-px"
                      style={{ background: 'linear-gradient(90deg, rgba(184,134,11,0.4), transparent)', width: 'calc(100% - 3rem)' }}
                    />
                  )}
                  <div
                    className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-6 font-display font-bold text-xl"
                    style={{ background: 'linear-gradient(135deg, #b8860b, #d4a24e)', color: '#fff', boxShadow: '0 8px 24px rgba(184,134,11,0.3)' }}
                  >
                    {s.num}
                  </div>
                  <h3 className="font-display font-semibold text-lg mb-3" style={{ color: '#1a2744' }}>{s.title}</h3>
                  <p className="font-body text-sm leading-relaxed" style={{ color: '#555' }}>{s.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 5 — HARGA
      ══════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-cream">
        <div className="max-w-3xl mx-auto text-center">
          <FadeIn>
            <div className="section-divider mx-auto mb-6" />
            <h2 className="font-display font-bold mb-4" style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.4rem)', color: '#1a2744' }}>
              Cukup 10 SAR per jamaah. Itu saja.
            </h2>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div
              className="mt-10 rounded-3xl p-12"
              style={{
                background: '#fff',
                border: '1px solid rgba(212,162,78,0.25)',
                boxShadow: '0 20px 60px rgba(184,134,11,0.08)',
              }}
            >
              {/* big price */}
              <div className="flex items-end justify-center gap-3 mb-2">
                <span
                  className="font-display font-bold leading-none"
                  style={{ fontSize: 'clamp(5rem, 15vw, 8rem)', color: '#b8860b', lineHeight: 1 }}
                >
                  10
                </span>
                <div className="pb-3">
                  <span className="font-display font-bold text-3xl" style={{ color: '#b8860b' }}>SAR</span>
                </div>
              </div>
              <p className="font-body text-base mb-8" style={{ color: '#888' }}>per jamaah per keberangkatan</p>

              <div
                className="inline-block px-6 py-1.5 rounded-full font-body text-sm font-medium mb-8"
                style={{ backgroundColor: 'rgba(184,134,11,0.08)', color: '#7a5200' }}
              >
                Tanpa biaya bulanan &nbsp;·&nbsp; Tanpa biaya setup &nbsp;·&nbsp; Bayar hanya untuk jamaah yang berangkat
              </div>

              <p className="font-body text-base italic" style={{ color: '#555', maxWidth: '480px', margin: '0 auto' }}>
                "Lebih murah dari biaya cetak buku doa per jamaah — tapi nilai yang jamaah terima jauh lebih besar."
              </p>

              <div className="mt-10">
                <a
                  href={WA_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold text-white font-body font-semibold px-10 py-4 rounded-full text-base inline-block"
                >
                  Minta Demo Gratis
                </a>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SECTION 6 — CTA PENUTUP
      ══════════════════════════════════════════ */}
      <section
        className="py-24 px-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0f1928 0%, #1a2744 60%, #0f1928 100%)' }}
      >
        {/* gold glow decoration */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-1 pointer-events-none"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(212,162,78,0.6), transparent)' }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(ellipse at 50% -20%, rgba(212,162,78,0.12) 0%, transparent 60%)',
          }}
        />

        <div className="relative max-w-3xl mx-auto text-center">
          <FadeIn>
            <p className="font-amiri text-3xl mb-6" style={{ color: '#d4a24e' }}>
              بَارَكَ اللَّهُ فِيكُم
            </p>
            <h2 className="font-display font-bold mb-5" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: '#fff' }}>
              Jadikan travel Anda yang terdepan dalam pelayanan
            </h2>
            <p className="font-body text-base leading-relaxed mb-10" style={{ color: 'rgba(255,255,255,0.7)', maxWidth: '520px', margin: '0 auto 2.5rem' }}>
              Coba demo gratis dengan branding travel Anda. Lihat sendiri bagaimana jamaah terbantu sebelum memutuskan.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold text-white font-body font-semibold px-8 py-4 rounded-full text-base"
              >
                Minta Demo Gratis
              </a>
              <a
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline-light font-body font-semibold px-8 py-4 rounded-full text-base flex items-center justify-center gap-2"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.554 4.122 1.526 5.852L.057 23.143a.75.75 0 0 0 .916.944l5.458-1.445A11.944 11.944 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.9 0-3.7-.502-5.263-1.381l-.378-.214-3.928 1.04 1.072-3.835-.234-.393A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                </svg>
                Hubungi via WhatsApp
              </a>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-10 px-6" style={{ backgroundColor: '#0a1020', borderTop: '1px solid rgba(212,162,78,0.1)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <p className="font-display font-bold text-lg" style={{ color: '#d4a24e' }}>Umrahme</p>
              <p className="font-body text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Pendamping umrah digital untuk travel modern
              </p>
            </div>
            <div className="flex items-center gap-6">
              {[
                { label: 'Tentang', href: '#' },
                { label: 'Kontak', href: '#' },
                { label: 'WhatsApp', href: WA_LINK },
              ].map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="font-body text-sm transition-colors hover:text-yellow-400"
                  style={{ color: 'rgba(255,255,255,0.45)' }}
                >
                  {link.label}
                </a>
              ))}
            </div>
            <p className="font-body text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
              © {new Date().getFullYear()} Umrahme. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
