import { useState, useRef, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

/* ─── CONFIG ─── */
const WA_NUMBER = '6281234567890';
const WA_MSG = encodeURIComponent(
  "Assalamu'alaikum, saya pemilik travel umrah dan tertarik dengan Umrahme. Boleh minta info demo?"
);
const WA_LINK = `https://wa.me/${WA_NUMBER}?text=${WA_MSG}`;

/* ─── COLORS ─── */
const C = {
  accent: '#C9A84C',
  accentDark: '#A0802A',
  accentLight: '#F4EDD8',
  hero: '#07111E',
  white: '#FFFFFF',
  gray50: '#F8F7F4',
  gray100: '#F0EDE6',
  gray200: '#E4DFD6',
  gray600: '#6B6560',
  gray900: '#0F0D0A',
  navy: '#0A1628',
};

/* ─── SCROLL REVEAL ─── */
function Reveal({ children, delay = 0, className = '', from = 'bottom' }: {
  children: React.ReactNode; delay?: number; className?: string;
  from?: 'bottom' | 'left' | 'right' | 'none';
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const initial = from === 'bottom' ? { opacity: 0, y: 32 }
    : from === 'left' ? { opacity: 0, x: -32 }
    : from === 'right' ? { opacity: 0, x: 32 }
    : { opacity: 0 };
  return (
    <motion.div ref={ref} className={className}
      initial={initial}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.72, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

/* ─── SECTION LABEL ─── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontFamily: "'Bricolage Grotesque', sans-serif",
      fontSize: 11, fontWeight: 700, letterSpacing: '0.14em',
      textTransform: 'uppercase', color: C.accent, marginBottom: 18,
    }}>• {children}</p>
  );
}

/* ─── FLOATING HERO CARD: Counter ─── */
function HeroCardCounter() {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.12)', borderRadius: 20,
      padding: '22px 26px', minWidth: 220,
      boxShadow: '0 32px 64px rgba(0,0,0,0.4)',
    }}>
      <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>Counter Tawaf</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{
          width: 52, height: 52, borderRadius: '50%',
          background: `linear-gradient(135deg, ${C.accent}, ${C.accentDark})`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 8px 24px rgba(201,168,76,0.4)`,
          flexShrink: 0,
        }}>
          <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 20, fontWeight: 800, color: '#fff', lineHeight: 1 }}>4</span>
          <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 8, color: 'rgba(255,255,255,0.65)' }}>/7</span>
        </div>
        <div>
          <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 3 }}>Putaran ke-4</p>
          <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>Tawaf Qudum</p>
        </div>
      </div>
      <div style={{ marginTop: 16, height: 3, borderRadius: 99, background: 'rgba(255,255,255,0.1)' }}>
        <div style={{ width: '57%', height: '100%', borderRadius: 99, background: `linear-gradient(90deg, ${C.accent}, #f0c060)` }} />
      </div>
    </div>
  );
}

/* ─── FLOATING HERO CARD: Doa ─── */
function HeroCardDoa() {
  return (
    <div style={{
      background: '#fff', borderRadius: 20,
      padding: '22px 26px', minWidth: 260,
      boxShadow: '0 32px 64px rgba(0,0,0,0.35)',
    }}>
      <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 10, fontWeight: 700, color: C.accent, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Doa Tawaf Putaran 4</p>
      <p style={{ fontFamily: "'Amiri', serif", fontSize: 17, color: '#1a2744', textAlign: 'right', lineHeight: 1.8, marginBottom: 10, direction: 'rtl' }}>رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً</p>
      <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 11, color: '#888', lineHeight: 1.5 }}>Ya Rabb, berikanlah kami kebaikan di dunia dan akhirat…</p>
    </div>
  );
}

/* ─── FLOATING HERO CARD: Announcement ─── */
function HeroCardAnnouncement() {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.1)', borderRadius: 20,
      padding: '20px 24px', minWidth: 240,
      boxShadow: '0 24px 48px rgba(0,0,0,0.35)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px rgba(74,222,128,0.7)', flexShrink: 0 }} />
        <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Pengumuman Travel</p>
      </div>
      <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 13, fontWeight: 500, color: '#fff', lineHeight: 1.6, marginBottom: 10 }}>
        Bus ke Madinah berangkat pukul 08.00 WAS. Berkumpul 15 menit lebih awal di lobby.
      </p>
      <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>2 menit lalu · Travel Barokah</p>
    </div>
  );
}

/* ─── MARQUEE ─── */
const MARQUEE_ITEMS = [
  'PT. Barokah Safar Abadi', 'Al-Haramain Tour & Travel', 'CV. Bintang Madinah',
  'Yayasan Syahadah Mulia', 'PT. Arminareka Perdana', 'Mabrur Travel Group',
  'PT. Daker Baitussalam', 'Al-Muna Wisata Islami',
];

function Marquee() {
  return (
    <div style={{ overflow: 'hidden', position: 'relative' }}>
      <div style={{
        display: 'flex', gap: 48, width: 'max-content',
        animation: 'marqueeScroll 28s linear infinite',
      }}>
        {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: `hsl(${(i * 47) % 360}, 25%, 40%)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <span style={{ fontSize: 14 }}>🕌</span>
            </div>
            <span style={{
              fontFamily: "'Bricolage Grotesque', sans-serif",
              fontSize: 14, fontWeight: 600, color: C.gray600,
              whiteSpace: 'nowrap',
            }}>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── FAQ ─── */
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: `1px solid ${C.gray200}`, cursor: 'pointer' }} onClick={() => setOpen(p => !p)}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 0', gap: 16 }}>
        <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 15, fontWeight: 600, color: C.gray900, lineHeight: 1.5 }}>{q}</p>
        <span style={{ color: C.accent, fontSize: 22, flexShrink: 0, transition: 'transform 0.25s', transform: open ? 'rotate(45deg)' : 'none', fontWeight: 300 }}>+</span>
      </div>
      <AnimatePresence>
        {open && (
          <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 14, color: C.gray600, lineHeight: 1.8, paddingBottom: 22, overflow: 'hidden' }}>
            {a}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════ */
export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    document.title = 'Umrahme — Digitalisasi Layanan Jamaah Travel Umrah';
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  const features = [
    { icon: '📖', title: 'Pengganti Buku Doa', desc: '45 doa lengkap — Arab, latin, terjemahan — per tahapan ibadah. Jamaah ikut langsung saat muthowif menjelaskan.' },
    { icon: '🔄', title: 'Counter Tawaf & Sa\'i', desc: 'Hitung putaran 1–7 otomatis, doa per putaran muncul sendiri. Tidak akan salah hitung lagi.' },
    { icon: '🗺️', title: 'Panduan Ibadah Step-by-Step', desc: 'Ritual Navigator, Manasik Interaktif, Panduan Ihram — jamaah bisa belajar mandiri sebelum berangkat.' },
    { icon: '📍', title: 'Peta Lokasi Bersejarah', desc: 'Info ziarah di Makkah & Madinah — sejarah, koordinat Google Maps, adab berkunjung.' },
    { icon: '🕐', title: 'Jadwal Sholat Real-time', desc: 'Waktu sholat otomatis sesuai lokasi jamaah di Makkah atau Madinah.' },
    { icon: '📢', title: 'Pengumuman dari Travel', desc: 'Kirim info penting ke seluruh jamaah sekaligus — perubahan jadwal, meeting point.' },
    { icon: '📅', title: 'Agenda Perjalanan', desc: 'Jadwal harian diisi travel, tampil real-time di HP jamaah sesuai fase perjalanan.' },
    { icon: '🪪', title: 'Kartu Jamaah Digital', desc: 'Nama, rombongan, bus, hotel, kontak pembimbing — digital, tidak perlu kartu fisik.' },
    { icon: '📓', title: 'Jurnal Perjalanan', desc: 'Jamaah catat momen & foto selama perjalanan sebagai kenangan abadi.' },
    { icon: '🏆', title: 'Sertifikat Umrah Digital', desc: 'Kenangan selesai umrah yang bisa disimpan dan dibagikan ke media sosial.' },
    { icon: '🎨', title: 'White-label Penuh', desc: 'Logo, warna brand, nama app — semua bisa disesuaikan. Jamaah pikir ini app travel mereka.' },
    { icon: '⚙️', title: 'Portal Travel Agency', desc: 'Dashboard untuk kelola jamaah, isi agenda, kirim pengumuman, dan atur semua data.' },
  ];

  const testimonials = [
    { name: 'H. Ridwan Effendi', travel: 'PT. Barokah Safar Abadi', text: 'Sejak pakai Umrahme, pertanyaan ke muthowif berkurang drastis. Jamaah lebih mandiri, perjalanan lebih tenang.' },
    { name: 'Ibu Siti Nurhaliza', travel: 'Yayasan Al-Haramain Tour', text: 'Jamaah yang sudah tua pun bisa pakai. Tidak perlu install, langsung buka link. Praktis sekali.' },
    { name: 'Ust. Farid Amanullah', travel: 'CV. Bintang Madinah Travel', text: 'Harga 10 SAR per jamaah sangat worth it. Cetak buku doa saja sudah lebih mahal dari itu.' },
  ];

  const faqs = [
    { q: 'Apakah jamaah perlu install aplikasi?', a: 'Tidak perlu. Jamaah cukup buka link dari browser HP, masukkan kode aktivasi, dan langsung bisa pakai semua fitur tanpa install dari Play Store atau App Store.' },
    { q: 'Bagaimana cara kustomisasi tampilan?', a: 'Dari portal travel agency, Anda bisa upload logo, pilih warna brand, dan atur nama app. Perubahan langsung berlaku real-time untuk semua jamaah aktif.' },
    { q: 'Apakah data jamaah aman?', a: 'Ya. Data disimpan di server aman dengan enkripsi. Kami tidak menjual atau membagikan data jamaah kepada pihak ketiga.' },
    { q: 'Apakah bisa dipakai tanpa internet?', a: 'Fitur utama seperti kumpulan doa, panduan ibadah, dan kartu jamaah bisa diakses offline setelah pertama kali dimuat. Fitur real-time butuh koneksi.' },
    { q: 'Bagaimana cara pembayaran?', a: 'Pembayaran dilakukan per keberangkatan berdasarkan jumlah jamaah aktif. Tidak ada biaya bulanan atau setup. Hubungi kami via WhatsApp untuk detail.' },
    { q: 'Apakah ada masa trial?', a: 'Ya, kami menyediakan demo gratis dengan branding travel Anda sehingga Anda bisa merasakan langsung sebelum memutuskan.' },
  ];

  return (
    <div style={{ background: C.white, fontFamily: "'Inter', system-ui, sans-serif", overflowX: 'hidden' }}>
      <style>{`
        /* Fonts loaded globally via index.css: Bricolage Grotesque, Inter, Amiri */
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }

        @keyframes marqueeScroll {
          from { transform: translateX(0); }
          to { transform: translateX(-33.333%); }
        }
        @keyframes float1 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes float2 { 0%,100%{transform:translateY(-6px)} 50%{transform:translateY(6px)} }
        @keyframes float3 { 0%,100%{transform:translateY(-4px)} 50%{transform:translateY(8px)} }

        .btn-cta {
          display: inline-flex; align-items: center; gap: 10px;
          background: linear-gradient(135deg, ${C.accent} 0%, ${C.accentDark} 100%);
          color: #fff; font-weight: 700; padding: 15px 28px;
          border-radius: 999px; font-size: 15px; text-decoration: none;
          font-family: 'Bricolage Grotesque', sans-serif;
          transition: all 0.25s ease;
          box-shadow: 0 6px 28px rgba(201,168,76,0.38);
        }
        .btn-cta:hover { transform: translateY(-2px); box-shadow: 0 10px 36px rgba(201,168,76,0.5); }
        .btn-cta .ico {
          width: 32px; height: 32px; border-radius: 50%;
          background: rgba(255,255,255,0.22);
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; flex-shrink: 0;
        }

        .btn-outline {
          display: inline-flex; align-items: center; gap: 8px;
          border: 1.5px solid rgba(255,255,255,0.28); color: rgba(255,255,255,0.85);
          font-weight: 600; padding: 14px 28px; border-radius: 999px;
          font-size: 15px; text-decoration: none;
          font-family: 'Bricolage Grotesque', sans-serif;
          transition: all 0.25s ease;
        }
        .btn-outline:hover { border-color: ${C.accent}; color: ${C.accent}; background: rgba(201,168,76,0.06); }

        .btn-dark {
          display: inline-flex; align-items: center; gap: 10px;
          background: ${C.gray900}; color: #fff; font-weight: 700;
          padding: 15px 28px; border-radius: 999px; font-size: 15px;
          text-decoration: none; font-family: 'Bricolage Grotesque', sans-serif;
          transition: all 0.25s ease;
        }
        .btn-dark:hover { background: #1a1a1a; transform: translateY(-2px); }
        .btn-dark .ico {
          width: 32px; height: 32px; border-radius: 50%; background: rgba(255,255,255,0.1);
          display: flex; align-items: center; justify-content: center; font-size: 14px; flex-shrink: 0;
        }

        .feat-card {
          background: ${C.white}; border: 1px solid ${C.gray200};
          border-radius: 18px; padding: 28px 26px;
          transition: all 0.25s ease;
        }
        .feat-card:hover { box-shadow: 0 12px 40px rgba(0,0,0,0.07); transform: translateY(-4px); border-color: ${C.gray200}; }

        .pain-item { border-bottom: 1px solid ${C.gray200}; padding: 24px 0; display: flex; gap: 20px; align-items: flex-start; }
        .nav-link { font-size: 14px; font-weight: 500; color: rgba(255,255,255,0.65); text-decoration: none; transition: color 0.2s; font-family: 'Bricolage Grotesque', sans-serif; }
        .nav-link:hover { color: #fff; }
        .nav-link-dark { font-size: 14px; font-weight: 500; color: ${C.gray600}; text-decoration: none; transition: color 0.2s; font-family: 'Bricolage Grotesque', sans-serif; }
        .nav-link-dark:hover { color: ${C.gray900}; }

        @media (max-width: 900px) {
          .hero-flex { flex-direction: column !important; }
          .hero-right { display: none !important; }
          .bento { grid-template-columns: 1fr 1fr !important; }
          .bento .bento-wide { grid-column: span 2 !important; }
          .feat-grid { grid-template-columns: 1fr 1fr !important; }
          .wl-flex { flex-direction: column !important; }
          .steps-grid { grid-template-columns: 1fr !important; }
          .testi-grid { grid-template-columns: 1fr !important; }
          .nav-menu { display: none !important; }
          .pricing-flex { flex-direction: column !important; }
        }
        @media (max-width: 480px) {
          .feat-grid { grid-template-columns: 1fr !important; }
          .bento { grid-template-columns: 1fr !important; }
          .bento .bento-wide { grid-column: span 1 !important; }
        }
      `}</style>

      {/* ══════════════════════════════════
          NAVBAR
      ══════════════════════════════════ */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        transition: 'all 0.3s ease',
        background: scrolled ? 'rgba(7,17,30,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: `linear-gradient(135deg, ${C.accent}, ${C.accentDark})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 16 }}>🕌</span>
            </div>
            <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 20, fontWeight: 800, color: '#fff' }}>Umrahme</span>
          </div>
          <div className="nav-menu" style={{ display: 'flex', gap: 36 }}>
            {[['#fitur', 'Fitur'], ['#harga', 'Harga'], ['#cara-kerja', 'Cara Kerja'], ['#kontak', 'Kontak']].map(([h, l]) => (
              <a key={h} href={h} className="nav-link">{l}</a>
            ))}
          </div>
          <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="btn-cta" style={{ padding: '10px 20px', fontSize: 13 }}>
            Daftar Sekarang <span className="ico">↗</span>
          </a>
        </div>
      </nav>

      {/* ══════════════════════════════════
          HERO — dark, full-bleed, bold
      ══════════════════════════════════ */}
      <section style={{
        minHeight: '100vh', paddingTop: 68,
        background: `linear-gradient(130deg, ${C.hero} 0%, #0D1B33 55%, #0F2040 100%)`,
        position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column',
      }}>
        {/* ambient glows */}
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: 700, height: 700, borderRadius: '50%', background: 'rgba(201,168,76,0.05)', filter: 'blur(100px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '5%', left: '-10%', width: 500, height: 500, borderRadius: '50%', background: 'rgba(26,39,68,0.6)', filter: 'blur(80px)', pointerEvents: 'none' }} />

        {/* right side: stylized "photo area" */}
        <div style={{
          position: 'absolute', right: 0, top: 0, bottom: 0, width: '42%',
          backgroundImage: 'linear-gradient(135deg, #0D1E3A 0%, #152848 40%, #1C3460 100%)',
          clipPath: 'polygon(8% 0%, 100% 0%, 100% 100%, 0% 100%)',
        }}>
          <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(ellipse at 60% 40%, rgba(201,168,76,0.1) 0%, transparent 60%), radial-gradient(ellipse at 30% 80%, rgba(30,60,120,0.4) 0%, transparent 50%)' }} />
          {/* geometric decorative lines */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.08 }} viewBox="0 0 400 600" preserveAspectRatio="xMidYMid slice">
            <circle cx="300" cy="150" r="180" fill="none" stroke={C.accent} strokeWidth="1" />
            <circle cx="300" cy="150" r="120" fill="none" stroke={C.accent} strokeWidth="0.5" />
            <circle cx="300" cy="150" r="240" fill="none" stroke={C.accent} strokeWidth="0.5" />
            <line x1="300" y1="0" x2="300" y2="600" stroke={C.accent} strokeWidth="0.5" />
            <line x1="100" y1="0" x2="500" y2="600" stroke={C.accent} strokeWidth="0.3" />
          </svg>
        </div>

        {/* main hero content */}
        <div style={{ flex: 1, maxWidth: 1200, margin: '0 auto', padding: '80px 32px 0', width: '100%', position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div className="hero-flex" style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
            {/* left — text */}
            <div style={{ flex: '1 1 0', maxWidth: 580, position: 'relative', zIndex: 2 }}>
              <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 99, background: 'rgba(201,168,76,0.12)', border: `1px solid rgba(201,168,76,0.3)`, marginBottom: 28 }}
              >
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.accent, display: 'inline-block' }} />
                <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 12, fontWeight: 700, color: C.accent, letterSpacing: '0.07em', textTransform: 'uppercase' }}>Untuk Pemilik Travel Umrah</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  fontFamily: "'Bricolage Grotesque', sans-serif",
                  fontSize: 'clamp(2.8rem, 5.5vw, 4.4rem)',
                  fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.03em',
                  color: '#fff', marginBottom: 24,
                }}
              >
                Jadikan Perjalanan Jamaah Anda{' '}
                <span style={{ background: `linear-gradient(135deg, ${C.accent}, #f0c060)`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  Lebih Bermakna
                </span>
                {' '}— Tanpa Repot
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28, duration: 0.65 }}
                style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 17, color: 'rgba(255,255,255,0.55)', lineHeight: 1.8, marginBottom: 40, maxWidth: 460 }}
              >
                Satu aplikasi lengkap pengganti buku doa, panduan ibadah, dan sistem komunikasi travel.
                White-label, siap pakai,{' '}
                <span style={{ color: C.accent, fontWeight: 600 }}>hanya 10 SAR per jamaah.</span>
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.55 }}
                style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 44 }}
              >
                <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="btn-cta">
                  Mulai Sekarang <span className="ico">↗</span>
                </a>
                <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="btn-outline">
                  Lihat Demo
                </a>
              </motion.div>

              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ display: 'flex' }}>
                    {[C.accent, '#A0802A', '#B89040', '#D4AA5A'].map((c, i) => (
                      <div key={i} style={{ width: 30, height: 30, borderRadius: '50%', background: c, border: '2px solid rgba(7,17,30,0.8)', marginLeft: i > 0 ? -9 : 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>🕌</div>
                    ))}
                  </div>
                  <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>Dipercaya travel agency di Indonesia</p>
                </div>
              </motion.div>
            </div>

            {/* right — decorative (hidden on mobile via CSS) */}
            <div className="hero-right" style={{ flex: '0 0 auto', width: 380, position: 'relative', height: 420, zIndex: 2 }}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  width: '100%', height: '100%', position: 'relative',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                {/* central circle decoration */}
                <div style={{
                  width: 280, height: 280, borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(201,168,76,0.12), rgba(26,39,68,0.3))',
                  border: '1px solid rgba(201,168,76,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  position: 'relative',
                }}>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontFamily: "'Amiri', serif", fontSize: 32, color: C.accent, marginBottom: 8 }}>بِسْمِ اللهِ</p>
                    <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Umrahme</p>
                  </div>
                  {/* orbit dot */}
                  <div style={{ position: 'absolute', top: 10, right: 20, width: 10, height: 10, borderRadius: '50%', background: C.accent, boxShadow: `0 0 16px rgba(201,168,76,0.6)` }} />
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* floating cards — bottom, overlap next section */}
        <div style={{ position: 'relative', zIndex: 10, marginBottom: -80, padding: '0 32px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', justifyContent: 'flex-start', paddingBottom: 20 }}>
              <motion.div style={{ animation: 'float1 4s ease-in-out infinite' }} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8 }}>
                <HeroCardCounter />
              </motion.div>
              <motion.div style={{ animation: 'float2 5s ease-in-out infinite' }} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.75, duration: 0.8 }}>
                <HeroCardDoa />
              </motion.div>
              <motion.div style={{ animation: 'float3 4.5s ease-in-out infinite' }} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.8 }}>
                <HeroCardAnnouncement />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          MARQUEE STRIP — partner logos
      ══════════════════════════════════ */}
      <section style={{ background: C.gray50, paddingTop: 100, paddingBottom: 56, borderBottom: `1px solid ${C.gray200}` }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', marginBottom: 36 }}>
          <Reveal>
            <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 12, fontWeight: 600, color: C.gray600, textAlign: 'center', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              Dipercaya oleh travel agency di Indonesia
            </p>
          </Reveal>
        </div>
        <Marquee />
      </section>

      {/* ══════════════════════════════════
          STATS BENTO — varied card sizes
      ══════════════════════════════════ */}
      <section style={{ background: C.white, padding: '96px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Reveal>
            <SectionLabel>Mengapa Umrahme</SectionLabel>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24, marginBottom: 52 }}>
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.03em', color: C.gray900, lineHeight: 1.15, maxWidth: 480 }}>
                Solusi digital umrah paling terjangkau & lengkap
              </h2>
              <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 15, color: C.gray600, maxWidth: 300, lineHeight: 1.75 }}>
                Dirancang khusus untuk travel agency Indonesia yang ingin tampil lebih profesional.
              </p>
            </div>
          </Reveal>

          {/* bento grid — varied sizes */}
          <div className="bento" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridAutoRows: 'minmax(140px, auto)', gap: 16 }}>
            {/* BIG — 10 SAR, spans 2 col 2 row */}
            <Reveal delay={0}>
              <div className="bento-wide" style={{
                gridColumn: 'span 2', gridRow: 'span 2',
                background: `linear-gradient(135deg, ${C.gray900} 0%, #1a1a1a 100%)`,
                borderRadius: 24, padding: '36px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                minHeight: 300,
              }}>
                <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Harga Per Jamaah</p>
                <div>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 4 }}>
                    <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 18, fontWeight: 700, color: C.accent, paddingTop: 16 }}>SAR</span>
                    <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 96, fontWeight: 800, color: '#fff', lineHeight: 0.9, letterSpacing: '-0.04em' }}>10</span>
                  </div>
                  <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.4)', marginTop: 12, marginBottom: 20 }}>per jamaah · per keberangkatan</p>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    {['Tanpa setup fee', 'Tanpa biaya bulanan'].map(t => (
                      <span key={t} style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 11, fontWeight: 600, padding: '5px 12px', borderRadius: 99, background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>

            {/* 45+ doa */}
            <Reveal delay={0.06}>
              <div style={{
                gridColumn: 'span 1',
                background: `linear-gradient(135deg, ${C.accentLight}, #EAD99A20)`,
                border: `1px solid rgba(201,168,76,0.2)`, borderRadius: 20, padding: '28px 24px',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 140,
              }}>
                <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 11, fontWeight: 700, color: C.accentDark, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Doa Lengkap</p>
                <div>
                  <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 52, fontWeight: 800, color: C.accentDark, lineHeight: 0.9, letterSpacing: '-0.03em' }}>45<span style={{ fontSize: 28 }}>+</span></p>
                  <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 12, color: '#7A6030', marginTop: 8 }}>Arab · Latin · Terjemahan</p>
                </div>
              </div>
            </Reveal>

            {/* 12 fitur */}
            <Reveal delay={0.09}>
              <div style={{
                gridColumn: 'span 1',
                background: C.gray50, border: `1px solid ${C.gray200}`, borderRadius: 20, padding: '28px 24px',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 140,
              }}>
                <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 11, fontWeight: 700, color: C.gray600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Fitur Siap Pakai</p>
                <div>
                  <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 52, fontWeight: 800, color: C.gray900, lineHeight: 0.9, letterSpacing: '-0.03em' }}>12</p>
                  <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 12, color: C.gray600, marginTop: 8 }}>Langsung aktif, tanpa konfigurasi</p>
                </div>
              </div>
            </Reveal>

            {/* 100% white-label */}
            <Reveal delay={0.12}>
              <div style={{
                gridColumn: 'span 1',
                background: C.navy, borderRadius: 20, padding: '28px 24px',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 140,
              }}>
                <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>White-label</p>
                <div>
                  <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 48, fontWeight: 800, color: '#fff', lineHeight: 0.9, letterSpacing: '-0.03em' }}>100%</p>
                  <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 8 }}>Brand travel Anda, bukan Umrahme</p>
                </div>
              </div>
            </Reveal>

            {/* tanpa install */}
            <Reveal delay={0.15}>
              <div style={{
                gridColumn: 'span 1',
                background: C.gray50, border: `1px solid ${C.gray200}`, borderRadius: 20, padding: '28px 24px',
                display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 140,
              }}>
                <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 11, fontWeight: 700, color: C.gray600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Instalasi</p>
                <div>
                  <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 24, fontWeight: 800, color: C.gray900, lineHeight: 1.1, letterSpacing: '-0.02em' }}>Tanpa Install</p>
                  <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 12, color: C.gray600, marginTop: 8 }}>Buka link, masukkan kode, langsung pakai</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          PAIN POINTS — white bg
      ══════════════════════════════════ */}
      <section style={{ background: C.gray50, padding: '96px 32px', borderTop: `1px solid ${C.gray200}`, borderBottom: `1px solid ${C.gray200}` }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'start' }}>
            <Reveal from="left">
              <SectionLabel>Masalah yang Ada</SectionLabel>
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.03em', color: C.gray900, lineHeight: 1.15, marginBottom: 20 }}>
                Masalah yang Sering Dihadapi Travel Agency
              </h2>
              <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 15, color: C.gray600, lineHeight: 1.75 }}>
                Masalah yang selama ini terasa wajar — padahal semuanya bisa diatasi dengan sistem yang tepat.
              </p>
            </Reveal>

            <Reveal from="right">
              <div>
                {[
                  { icon: '😰', title: 'Jamaah kebingungan & ketinggalan info', desc: 'Tanpa panduan digital, jamaah bergantung penuh pada muthowif.' },
                  { icon: '🔁', title: 'Muthowif mengulang hal yang sama', desc: 'Pertanyaan berulang menguras energi yang seharusnya untuk membimbing.' },
                  { icon: '📕', title: 'Buku doa hilang atau tidak dibaca', desc: 'Buku fisik mahal, mudah ketinggalan, dan sering tidak dimanfaatkan.' },
                  { icon: '📱', title: 'Broadcast ke semua jamaah susah', desc: 'Kirim pesan satu per satu via WhatsApp tidak efisien dan rawan terlewat.' },
                  { icon: '📋', title: 'Semua masih manual & rawan error', desc: 'Data jamaah, jadwal, hotel — semuanya di spreadsheet atau kertas.' },
                ].map((p, i) => (
                  <div key={i} className="pain-item">
                    <span style={{ fontSize: 24, flexShrink: 0, marginTop: 2 }}>{p.icon}</span>
                    <div>
                      <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 15, fontWeight: 700, color: C.gray900, marginBottom: 4 }}>{p.title}</p>
                      <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 13, color: C.gray600, lineHeight: 1.6 }}>{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          FEATURES — white background
      ══════════════════════════════════ */}
      <section id="fitur" style={{ background: C.white, padding: '96px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Reveal>
            <SectionLabel>Fitur</SectionLabel>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24, marginBottom: 56 }}>
              <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.03em', color: C.gray900, lineHeight: 1.15, maxWidth: 460 }}>
                Semua yang Dibutuhkan Jamaah,{' '}
                <span style={{ color: C.accent }}>dalam Satu App</span>
              </h2>
              <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 15, color: C.gray600, maxWidth: 300, lineHeight: 1.75 }}>
                12 fitur siap pakai — tinggal aktifkan, tidak perlu konfigurasi teknis.
              </p>
            </div>
          </Reveal>

          <div className="feat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {features.map((f, i) => (
              <Reveal key={i} delay={i * 0.035}>
                <div className="feat-card" style={{ height: '100%' }}>
                  <span style={{ fontSize: 30, marginBottom: 16, display: 'block' }}>{f.icon}</span>
                  <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 15, fontWeight: 700, color: C.gray900, marginBottom: 8 }}>{f.title}</p>
                  <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 13, color: C.gray600, lineHeight: 1.7 }}>{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          HOW IT WORKS — gray bg
      ══════════════════════════════════ */}
      <section id="cara-kerja" style={{ background: C.gray50, padding: '96px 32px', borderTop: `1px solid ${C.gray200}`, borderBottom: `1px solid ${C.gray200}` }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Reveal>
            <SectionLabel>Cara Kerja</SectionLabel>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.03em', color: C.gray900, lineHeight: 1.15, marginBottom: 16, maxWidth: 420 }}>
              3 Langkah, Langsung Jalan
            </h2>
            <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 15, color: C.gray600, lineHeight: 1.75, marginBottom: 60, maxWidth: 400 }}>
              Tidak butuh tim IT. Tidak butuh waktu lama. Travel siap dalam hitungan jam.
            </p>
          </Reveal>

          <div className="steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {[
              { n: '01', title: 'Daftar & Kustomisasi Brand', desc: 'Upload logo travel, pilih warna brand, dan atur nama app. Selesai dalam hitungan menit — tidak perlu developer.', accent: false },
              { n: '02', title: 'Input Data Jamaah & Jadwal', desc: 'Tambahkan data jamaah, atur agenda perjalanan, info hotel, dan kontak pembimbing via portal travel.', accent: true },
              { n: '03', title: 'Jamaah Login & Langsung Pakai', desc: 'Jamaah buka link, masukkan kode aktivasi — langsung bisa akses semua fitur tanpa install sama sekali.', accent: false },
            ].map((s, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div style={{
                  background: s.accent ? C.gray900 : C.white,
                  border: `1px solid ${s.accent ? 'transparent' : C.gray200}`,
                  borderRadius: 20, padding: '36px 32px',
                }}>
                  <span style={{
                    fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 13, fontWeight: 700,
                    color: s.accent ? C.accent : C.accent,
                    background: s.accent ? 'rgba(201,168,76,0.15)' : C.accentLight,
                    padding: '5px 12px', borderRadius: 99, display: 'inline-block', marginBottom: 24,
                  }}>{s.n}</span>
                  <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 19, fontWeight: 800, color: s.accent ? '#fff' : C.gray900, marginBottom: 14, lineHeight: 1.3, letterSpacing: '-0.02em' }}>{s.title}</p>
                  <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 14, color: s.accent ? 'rgba(255,255,255,0.55)' : C.gray600, lineHeight: 1.75 }}>{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          WHITE-LABEL SHOWCASE — white bg
      ══════════════════════════════════ */}
      <section style={{ background: C.white, padding: '96px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="wl-flex" style={{ display: 'flex', alignItems: 'center', gap: 72 }}>
            <Reveal from="left" className="">
              <div style={{ flex: '1 1 380px', maxWidth: 480 }}>
                <SectionLabel>White-label</SectionLabel>
                <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.03em', color: C.gray900, lineHeight: 1.15, marginBottom: 20 }}>
                  App Anda,{' '}
                  <span style={{ color: C.accent }}>Brand Anda</span>
                </h2>
                <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 15, color: C.gray600, lineHeight: 1.8, marginBottom: 32 }}>
                  Jamaah tidak tahu ini Umrahme. Mereka pikir ini aplikasi milik travel mereka sendiri — karena memang itulah yang terlihat.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {['Logo & nama travel tampil di seluruh app', 'Warna brand bisa disesuaikan penuh', 'Jamaah tidak tahu ini platform Umrahme', 'URL bisa disesuaikan dengan nama travel'].map((t) => (
                    <div key={t} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                      <div style={{ width: 22, height: 22, borderRadius: '50%', background: C.accentLight, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                        <span style={{ fontSize: 11, color: C.accentDark, fontWeight: 700 }}>✓</span>
                      </div>
                      <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 14, color: C.gray600, lineHeight: 1.5 }}>{t}</p>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: 36 }}>
                  <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="btn-dark">
                    Coba Demo Gratis <span className="ico">↗</span>
                  </a>
                </div>
              </div>
            </Reveal>

            <Reveal from="right" className="">
              <div style={{ flex: '1 1 380px', display: 'flex', gap: 14 }}>
                {[
                  { name: 'Barokah Mandiri', bg: '#1a2744', accent: C.accent, label: 'Travel A' },
                  { name: 'Al-Haramain Tour', bg: '#1C3A28', accent: '#4ade80', label: 'Travel B' },
                  { name: 'Bintang Madinah', bg: '#2A1A44', accent: '#a78bfa', label: 'Travel C' },
                ].map((t, idx) => (
                  <div key={t.name} style={{ flex: 1, borderRadius: 18, overflow: 'hidden', border: `1px solid ${C.gray200}`, boxShadow: '0 12px 40px rgba(0,0,0,0.06)' }}>
                    <div style={{ background: t.bg, padding: '14px 12px', borderBottom: `2px solid ${t.accent}` }}>
                      <p style={{ fontFamily: "'Amiri', serif", fontSize: 13, color: t.accent, textAlign: 'center', marginBottom: 4 }}>بِسْمِ اللهِ</p>
                      <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.65)', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t.name}</p>
                    </div>
                    <div style={{ background: '#F7F4EE', padding: 10 }}>
                      <div style={{ background: '#fff', borderRadius: 10, padding: 8, marginBottom: 8 }}>
                        <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 8, fontWeight: 600, color: '#333', marginBottom: 6 }}>Counter Tawaf</p>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: t.bg, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 16, fontWeight: 800, color: t.accent }}>3</span>
                        </div>
                      </div>
                      <div style={{ background: '#fff', borderRadius: 10, padding: 8 }}>
                        <p style={{ fontFamily: "'Amiri', serif", fontSize: 9, color: '#444', textAlign: 'right', direction: 'rtl', lineHeight: 1.5 }}>رَبَّنَا آتِنَا...</p>
                      </div>
                      <div style={{ marginTop: 6, padding: '6px 8px', background: `${t.accent}15`, borderRadius: 8, border: `1px solid ${t.accent}30` }}>
                        <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 8, fontWeight: 600, color: t.bg }}>Ahmad Fauzi · Grup A</p>
                      </div>
                    </div>
                    <div style={{ background: '#fff', padding: '6px 10px', borderTop: `1px solid ${C.gray200}` }}>
                      <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 7, color: C.gray600, textAlign: 'center', letterSpacing: '0.05em' }}>{t.label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          PRICING — gray bg
      ══════════════════════════════════ */}
      <section id="harga" style={{ background: C.gray50, padding: '96px 32px', borderTop: `1px solid ${C.gray200}`, borderBottom: `1px solid ${C.gray200}` }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Reveal>
            <SectionLabel>Harga</SectionLabel>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.03em', color: C.gray900, lineHeight: 1.15, marginBottom: 16, maxWidth: 440 }}>
              Transparan. Terjangkau. Tanpa Kejutan.
            </h2>
            <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 15, color: C.gray600, lineHeight: 1.75, marginBottom: 56, maxWidth: 400 }}>
              Satu harga, semua fitur. Tidak ada biaya tersembunyi.
            </p>
          </Reveal>

          <div className="pricing-flex" style={{ display: 'flex', gap: 24, alignItems: 'stretch' }}>
            {/* main pricing card */}
            <Reveal delay={0.05} className="">
              <div style={{
                flex: '1 1 480px',
                background: C.gray900, borderRadius: 24, padding: '48px',
                display: 'flex', flexDirection: 'column', height: '100%',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 4, marginBottom: 12 }}>
                  <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 22, fontWeight: 700, color: C.accent, paddingTop: 18 }}>SAR</span>
                  <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 100, fontWeight: 800, color: '#fff', lineHeight: 0.9, letterSpacing: '-0.04em' }}>10</span>
                </div>
                <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 15, color: 'rgba(255,255,255,0.4)', marginBottom: 36 }}>per jamaah · per keberangkatan</p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 40, flex: 1 }}>
                  {['Tidak ada biaya setup', 'Tidak ada biaya bulanan', 'Bayar hanya untuk jamaah aktif', 'Semua 12 fitur sudah termasuk', 'Branding travel sepenuhnya'].map(t => (
                    <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(201,168,76,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ fontSize: 10, color: C.accent, fontWeight: 700 }}>✓</span>
                      </div>
                      <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>{t}</p>
                    </div>
                  ))}
                </div>

                <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="btn-cta" style={{ alignSelf: 'flex-start' }}>
                  Mulai Sekarang <span className="ico">↗</span>
                </a>
              </div>
            </Reveal>

            {/* right side cards */}
            <div style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', gap: 16, minWidth: 260 }}>
              <Reveal delay={0.1}>
                <div style={{ background: C.accentLight, border: `1px solid rgba(201,168,76,0.25)`, borderRadius: 20, padding: '28px 28px' }}>
                  <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 12, fontWeight: 700, color: C.accentDark, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12 }}>Contoh Estimasi</p>
                  <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 28, fontWeight: 800, color: C.accentDark, letterSpacing: '-0.02em', marginBottom: 6 }}>400 SAR</p>
                  <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 14, color: '#7A6030', lineHeight: 1.6 }}>untuk 40 jamaah per keberangkatan. Sekali bayar.</p>
                </div>
              </Reveal>
              <Reveal delay={0.15}>
                <div style={{ background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 20, padding: '28px 28px', flex: 1 }}>
                  <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 12, fontWeight: 700, color: C.gray600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>Umrahme vs Buku Doa Cetak</p>
                  {[['Buku Doa Cetak', '15-25 SAR/buku', '#ef4444'], ['Umrahme', '10 SAR/jamaah', '#22c55e']].map(([l, v, c]) => (
                    <div key={l} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 13, color: C.gray900, fontWeight: 500 }}>{l}</p>
                      <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 12, fontWeight: 700, color: c, background: c + '15', padding: '3px 10px', borderRadius: 99 }}>{v}</span>
                    </div>
                  ))}
                  <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 12, color: C.gray600, lineHeight: 1.6, marginTop: 16, paddingTop: 16, borderTop: `1px solid ${C.gray200}` }}>
                    Lebih murah, tidak hilang, dan nilai yang diterima jamaah jauh lebih besar.
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          TESTIMONIALS — white bg
      ══════════════════════════════════ */}
      <section style={{ background: C.white, padding: '96px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Reveal>
            <SectionLabel>Testimoni</SectionLabel>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 800, letterSpacing: '-0.03em', color: C.gray900, lineHeight: 1.15, marginBottom: 56, maxWidth: 420 }}>
              Kata Mereka yang Sudah Pakai
            </h2>
          </Reveal>
          <div className="testi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {testimonials.map((t, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div style={{ background: C.gray50, border: `1px solid ${C.gray200}`, borderRadius: 20, padding: '32px', height: '100%' }}>
                  <div style={{ display: 'flex', gap: 3, marginBottom: 20 }}>
                    {Array(5).fill(0).map((_, j) => <span key={j} style={{ color: C.accent, fontSize: 14 }}>★</span>)}
                  </div>
                  <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 15, color: C.gray900, lineHeight: 1.75, marginBottom: 24, fontWeight: 500 }}>"{t.text}"</p>
                  <div style={{ borderTop: `1px solid ${C.gray200}`, paddingTop: 20 }}>
                    <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 14, fontWeight: 700, color: C.gray900, marginBottom: 2 }}>{t.name}</p>
                    <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 12, color: C.accent, fontWeight: 600 }}>{t.travel}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════
          FAQ — gray bg
      ══════════════════════════════════ */}
      <section style={{ background: C.gray50, padding: '96px 32px', borderTop: `1px solid ${C.gray200}`, borderBottom: `1px solid ${C.gray200}` }}>
        <div style={{ maxWidth: 820, margin: '0 auto' }}>
          <Reveal>
            <SectionLabel>FAQ</SectionLabel>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 'clamp(2rem, 3.5vw, 2.4rem)', fontWeight: 800, letterSpacing: '-0.03em', color: C.gray900, lineHeight: 1.15, marginBottom: 48 }}>
              Pertanyaan yang Sering Ditanyakan
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            {faqs.map((f, i) => <FAQItem key={i} q={f.q} a={f.a} />)}
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════
          CTA PENUTUP — dark
      ══════════════════════════════════ */}
      <section id="kontak" style={{ background: C.gray900, padding: '120px 32px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 700, height: 700, borderRadius: '50%', background: 'rgba(201,168,76,0.04)', filter: 'blur(100px)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 640, margin: '0 auto', position: 'relative' }}>
          <Reveal>
            <div style={{ display: 'inline-block', padding: '8px 18px', borderRadius: 99, background: 'rgba(201,168,76,0.1)', border: `1px solid rgba(201,168,76,0.25)`, marginBottom: 28 }}>
              <span style={{ fontFamily: "'Amiri', serif", fontSize: 18, color: C.accent }}>بَارَكَ اللَّهُ فِيكُم</span>
            </div>
            <h2 style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 800, letterSpacing: '-0.03em', color: '#fff', lineHeight: 1.15, marginBottom: 20 }}>
              Siap Upgrade Layanan Travel Anda?
            </h2>
            <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 17, color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, marginBottom: 44, maxWidth: 480, margin: '0 auto 44px' }}>
              Bergabung sekarang dan berikan pengalaman umrah terbaik untuk jamaah Anda. Demo gratis, tidak ada komitmen.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center' }}>
              <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="btn-cta" style={{ fontSize: 16, padding: '16px 32px' }}>
                Hubungi via WhatsApp <span className="ico">↗</span>
              </a>
              <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="btn-outline" style={{ fontSize: 15, padding: '15px 28px' }}>
                Minta Demo Gratis
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════════════════
          FOOTER
      ══════════════════════════════════ */}
      <footer style={{ background: '#060C15', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '48px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 32, marginBottom: 40 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <div style={{ width: 30, height: 30, borderRadius: 8, background: `linear-gradient(135deg, ${C.accent}, ${C.accentDark})`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 14 }}>🕌</span>
                </div>
                <span style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 18, fontWeight: 800, color: '#fff' }}>Umrahme</span>
              </div>
              <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>Pendamping umrah digital untuk travel modern</p>
            </div>
            <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
              {[['#fitur', 'Fitur'], ['#harga', 'Harga'], ['#cara-kerja', 'Cara Kerja'], ['#kontak', 'Kontak'], [WA_LINK, 'WhatsApp']].map(([h, l]) => (
                <a key={h} href={h} target={h.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                  style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.35)', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = C.accent)}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}
                >{l}</a>
              ))}
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
            <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.18)' }}>© {new Date().getFullYear()} Umrahme. All rights reserved.</p>
            <p style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.18)' }}>Dibuat untuk travel umrah Indonesia 🇮🇩</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
