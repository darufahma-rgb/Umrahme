import { useState, useRef, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import logoImg from '@assets/Umrahme_1782205247965.png';

const F = "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif";

const WA_NUMBER = '6281234567890';
const WA_MSG = encodeURIComponent(
  "Assalamu'alaikum, saya pemilik travel umrah dan tertarik dengan Umrahme. Boleh minta info demo?"
);
const WA_LINK = `https://wa.me/${WA_NUMBER}?text=${WA_MSG}`;

const C = {
  green: '#15803d',
  greenDark: '#14532d',
  accent: '#a3e635',
  accentDark: '#84cc16',
  primary: '#0054F9',
  primaryDark: '#003BC9',
  ink: '#131313',
  muted: '#4C4C4C',
  line: '#E0E0E0',
  bg: '#ffffff',
  soft: '#F5F5F5',
  blue1: '#1e6fb8',
  blue2: '#3a8fd4',
  blue3: '#7cb8e8',
};

/* ─── REVEAL ─── */
function Reveal({ children, delay = 0, className = '' }: {
  children: React.ReactNode; delay?: number; className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div ref={ref} className={className}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}

/* ─── EYEBROW ─── */
function Eyebrow({ children, align = 'center' }: { children: React.ReactNode; align?: 'center' | 'left' }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: align === 'center' ? 'center' : 'flex-start',
      gap: 8, fontSize: 12, fontWeight: 700, letterSpacing: '0.18em',
      textTransform: 'uppercase' as const, color: C.muted, marginBottom: 10,
      fontFamily: F,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: C.accentDark, display: 'inline-block', flexShrink: 0 }} />
      {children}
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: C.accentDark, display: 'inline-block', flexShrink: 0 }} />
    </div>
  );
}

/* ─── MARQUEE ─── */
const PARTNERS = ['Barokah Tour', 'Al-Madinah Travel', 'Safa Marwah', 'Arrahman Wisata', 'Mabrur Travel', 'Nur Hidayah', 'Baitullah Tour', 'Arminareka Perdana', 'Al-Haramain Tour', 'Bintang Madinah'];

function MarqueeStrip() {
  const items = [...PARTNERS, ...PARTNERS];
  return (
    <div style={{ overflow: 'hidden', WebkitMaskImage: 'linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)', maskImage: 'linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent)' }}>
      <div style={{ display: 'flex', gap: 44, width: 'max-content', animation: 'lpScroll 28s linear infinite' }}>
        {items.map((p, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, color: '#9aa6b2', fontWeight: 700, fontSize: 15, whiteSpace: 'nowrap' as const, opacity: 0.8, fontFamily: F }}>
            <div style={{ width: 18, height: 18, borderRadius: 6, background: '#d7dde4', flexShrink: 0 }} />
            {p}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── FAQ ITEM ─── */
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ border: `1px solid ${C.line}`, borderRadius: 12, marginBottom: 9, overflow: 'hidden', background: '#fff' }}>
      <button
        onClick={() => setOpen(p => !p)}
        style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '15px 18px', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, color: C.ink, fontFamily: F }}
      >
        {q}
        <span style={{
          flexShrink: 0, width: 22, height: 22, borderRadius: '50%',
          background: open ? C.accent : C.soft,
          color: open ? C.greenDark : C.ink,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, fontWeight: 300, transition: 'all 0.3s',
          transform: open ? 'rotate(45deg)' : 'none',
        }}>+</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.32 }}
            style={{ overflow: 'hidden' }}
          >
            <p style={{ padding: '0 18px 15px', color: C.muted, fontSize: 13.5, lineHeight: 1.65, fontFamily: F }}>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════
   MAIN
═══════════════════════════════════════ */
export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.title = 'Umrahme — Aplikasi Pendamping Umrah White-Label untuk Travel Agency';
    const h = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  const features = [
    { icon: '📖', num: '01', title: '55+ Doa Lengkap', desc: 'Arab, latin, terjemahan. Ganti buku doa cetak selamanya.' },
    { icon: '🔢', num: '02', title: "Counter Tawaf & Sa'i", desc: 'Hitung putaran otomatis, doa muncul tiap putaran.' },
    { icon: '🕋', num: '03', title: 'Panduan Ibadah', desc: 'Tuntunan step-by-step, bisa dipelajari sebelum berangkat.' },
    { icon: '🗺️', num: '04', title: 'Peta & Lokasi', desc: '10 lokasi ziarah + sejarah + Google Maps.' },
    { icon: '🕌', num: '05', title: 'Jadwal Sholat', desc: 'Otomatis sesuai lokasi jamaah, akurat.' },
    { icon: '📢', num: '06', title: 'Pengumuman', desc: 'Broadcast instan ke semua jamaah, pasti terbaca.' },
    { icon: '🗓️', num: '07', title: 'Agenda Harian', desc: 'Jadwal hari ini tampil otomatis di HP jamaah.' },
    { icon: '🪪', num: '08', title: 'Kartu Jamaah', desc: 'Identitas digital lengkap, berguna saat darurat.' },
    { icon: '📔', num: '09', title: 'Jurnal', desc: 'Jamaah simpan momen perjalanan suci mereka.' },
    { icon: '🎖️', num: '10', title: 'Sertifikat', desc: 'Sertifikat digital bermerek travel Anda.' },
    { icon: '🎨', num: '11', title: 'White-Label', desc: 'Logo & nama travel Anda di setiap halaman.' },
    { icon: '📊', num: '12', title: 'Portal Travel', desc: 'Satu dashboard kelola jamaah, agenda, pengumuman.' },
  ];

  const faqs = [
    { q: 'Jamaah kami rata-rata tidak terlalu melek teknologi. Bisa pakai?', a: 'Bisa, dan justru dirancang untuk itu. Tidak perlu install apapun — jamaah cukup buka browser, ketuk link yang Anda bagikan, masukkan kode dan nama. Selesai. Sudah banyak jamaah lansia 60+ yang pakai tanpa kesulitan.' },
    { q: 'Seberapa cepat aplikasi bisa bermerek travel kami?', a: 'Kurang dari 10 menit. Upload logo, pilih warna, masukkan nama travel — dan aplikasi langsung tampil bermerek travel Anda. Tidak perlu menunggu, tidak perlu approval dari kami.' },
    { q: 'Apakah data jamaah kami aman?', a: 'Ya, aman. Data jamaah disimpan terenkripsi dan tidak pernah dibagikan ke pihak manapun. Hanya travel Anda yang bisa akses data jamaah Anda.' },
    { q: 'Sinyal di area Haram sering lemah. Tetap bisa dipakai?', a: 'Ya. Doa, panduan ibadah, kartu jamaah, dan konten yang sudah pernah dibuka tetap bisa diakses offline. Jamaah tidak akan tergantung sinyal saat tawaf atau sa\'i.' },
    { q: 'Bagaimana cara mulai dan bayarnya?', a: 'Hubungi kami via WhatsApp, kami bantu setup demo gratis dengan nama travel Anda dulu. Kalau cocok, baru bicara soal pembayaran. 10 SAR per jamaah, dibayar per keberangkatan. Tidak ada kontrak, tidak ada minimum jamaah.' },
    { q: 'Bisa lihat dulu sebelum memutuskan?', a: 'Tentu. Kami siapkan demo lengkap dengan logo dan nama travel Anda — supaya Anda bisa rasakan sendiri seperti apa tampilannya sebelum memutuskan. Gratis, tanpa komitmen apapun.' },
  ];

  return (
    <div style={{ fontFamily: F, color: C.ink, background: C.bg, lineHeight: 1.6, overflowX: 'hidden' }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        a { text-decoration: none; color: inherit; }

        @keyframes lpScroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes lpFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-12px)} }

        .lp-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 10px 20px; border-radius: 32px;
          font-weight: 600; font-size: 14px; cursor: pointer;
          border: none; transition: transform .2s ease, box-shadow .2s ease, background .2s ease;
          white-space: nowrap; font-family: ${F};
        }
        .lp-btn:hover { transform: translateY(-2px); }
        .lp-btn-accent { background: ${C.primary}; color: #fff; border: none; }
        .lp-btn-accent:hover { background: ${C.primaryDark}; }
        .lp-btn-ghost { background: rgba(255,255,255,.15); color: #fff; border: 1px solid rgba(255,255,255,.35); }
        .lp-btn-ghost:hover { background: rgba(255,255,255,.25); }
        .lp-btn-dark { background: #fff; color: #131313; border: 1px solid #131313; }
        .lp-btn-dark:hover { background: #F5F5F5; }

        .lp-arrow {
          display: inline-flex; align-items: center; justify-content: center;
          width: 24px; height: 24px; border-radius: 50%;
          background: rgba(255,255,255,0.25); color: #fff; font-size: 13px; flex-shrink: 0;
        }
        .lp-btn-dark .lp-arrow { background: #131313; color: #fff; }

        .lp-feat-card {
          background: #fff; border: 1px solid ${C.line}; border-radius: 12px; padding: 16px;
          transition: transform .25s ease, box-shadow .25s ease; height: 100%;
          box-shadow: 0px 4px 12px rgba(0,0,0,0.04);
        }
        .lp-feat-card:hover { transform: translateY(-4px); box-shadow: 0px 8px 24px rgba(0,0,0,0.08); }

        .lp-feat-featured { grid-column: span 2; }

        /* mobile drawer */
        /* ─── NAVBAR ─── */
        .lp-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          transition: background .3s ease, box-shadow .3s ease, backdrop-filter .3s ease;
        }
        .lp-nav-scrolled {
          background: rgba(255,255,255,0.96);
          backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
          box-shadow: 0 1px 0 rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.06);
        }
        .lp-nav-inner {
          max-width: 1180px; margin: 0 auto;
          display: flex; align-items: center;
          padding: 0 24px; height: 68px;
        }
        .lp-nav-logo {
          display: flex; align-items: center; gap: 10px;
          text-decoration: none; flex-shrink: 0;
        }
        .lp-nav-logo-circle {
          width: 36px; height: 36px;
          display: flex; align-items: center; justify-content: center;
          font-weight: 800; font-size: 15px; flex-shrink: 0;
          background: transparent; color: #fff;
          transition: background .3s;
        }
        .lp-nav-scrolled .lp-nav-logo-circle { background: transparent; }
        .lp-nav-logo-circle img { width: 32px; height: 32px; object-fit: contain; display: block; filter: brightness(0) invert(1); }
        .lp-nav-scrolled .lp-nav-logo-circle img { filter: none; }
        .lp-nav-logo-text {
          font-size: 17px; font-weight: 700; color: #fff;
          font-family: ${F}; transition: color .3s;
        }
        .lp-nav-scrolled .lp-nav-logo-text { color: #131313; }
        .lp-nav-links {
          flex: 1; display: flex; align-items: center; justify-content: center; gap: 2px;
        }
        .lp-nav-link {
          padding: 8px 14px; border-radius: 999px;
          font-size: 14px; font-weight: 500; color: rgba(255,255,255,0.88);
          text-decoration: none; transition: color .15s, background .15s;
          font-family: ${F};
        }
        .lp-nav-link:hover { color: #fff; background: rgba(255,255,255,0.12); }
        .lp-nav-scrolled .lp-nav-link { color: #4C4C4C; }
        .lp-nav-scrolled .lp-nav-link:hover { color: #131313; background: rgba(0,0,0,0.05); }
        .lp-nav-right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
        .lp-nav-cta-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 9px 20px; border-radius: 999px;
          font-size: 13.5px; font-weight: 700; cursor: pointer;
          border: none; text-decoration: none; font-family: ${F};
          transition: transform .2s ease, box-shadow .2s ease, background .2s ease;
          background: #fff; color: #131313;
          box-shadow: 0 2px 8px rgba(0,0,0,0.12);
        }
        .lp-nav-cta-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 16px rgba(0,0,0,0.18); }
        .lp-nav-scrolled .lp-nav-cta-btn { background: #131313; color: #fff; }
        .lp-nav-scrolled .lp-nav-cta-btn:hover { background: #222; }
        /* mobile logo-tap dropdown */
        .lp-mobile-dropdown {
          display: none;
          position: fixed; top: 68px; left: 0; right: 0; z-index: 98;
          background: rgba(10,10,10,0.96);
          backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
          padding: 8px 20px 20px;
          pointer-events: none;
          opacity: 0;
          transform: translateY(-8px);
          transition: opacity .28s ease, transform .28s ease;
        }
        .lp-mobile-dropdown.open {
          opacity: 1; transform: translateY(0); pointer-events: auto;
        }
        .lp-nav-scrolled ~ .lp-mobile-dropdown,
        .lp-mobile-dropdown.scrolled {
          background: rgba(255,255,255,0.97);
          backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.10);
        }
        .lp-md-link {
          display: flex; align-items: center; justify-content: center;
          padding: 15px 16px; border-radius: 14px;
          font-size: 17px; font-weight: 600; color: rgba(255,255,255,0.9);
          text-decoration: none; font-family: ${F};
          transition: background .15s, color .15s;
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        .lp-md-link:last-of-type { border-bottom: none; }
        .lp-md-link:hover { background: rgba(255,255,255,0.08); color: #fff; }
        .lp-md-cta {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          margin-top: 12px; width: 100%; padding: 15px 20px;
          border-radius: 16px; background: #fff; color: #131313;
          font-size: 15px; font-weight: 700; text-decoration: none; font-family: ${F};
          transition: background .15s;
        }
        .lp-md-cta:hover { background: #f0f0f0; }

        /* mobile: center logo, hide desktop items, make logo clickable */
        @media (max-width: 760px) {
          .lp-nav-links { display: none !important; }
          .lp-nav-right { display: none !important; }
          .lp-nav-inner { justify-content: center; }
          .lp-nav-logo {
            cursor: pointer; user-select: none;
            background: transparent;
            border: 1px solid transparent;
            border-radius: 20px;
            padding: 8px 18px 8px 10px;
            box-shadow: none;
            transition:
              background .35s ease,
              border-color .35s ease,
              box-shadow .35s ease,
              backdrop-filter .35s ease;
          }
          .lp-mobile-dropdown { display: block; }
          .lp-nav-logo-circle { transition: transform .2s ease, box-shadow .2s ease; }
          .lp-nav-logo-circle.open {
            transform: scale(1.08);
            box-shadow: 0 0 0 3px rgba(255,255,255,0.25);
          }

          .lp-nav-scrolled {
            background: transparent !important;
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
            box-shadow: none !important;
          }
          .lp-nav-scrolled .lp-nav-logo {
            background: rgba(12, 12, 18, 0.65);
            backdrop-filter: blur(24px) saturate(1.8);
            -webkit-backdrop-filter: blur(24px) saturate(1.8);
            border-color: rgba(255, 255, 255, 0.24);
            box-shadow:
              0 6px 32px rgba(0, 0, 0, 0.30),
              inset 0 1px 0 rgba(255, 255, 255, 0.12);
          }
          .lp-nav-scrolled .lp-nav-logo-text { color: #fff !important; }
          .lp-nav-scrolled .lp-nav-logo-circle img { filter: brightness(0) invert(1) !important; }
          .lp-nav-scrolled .lp-nav-logo-circle.open {
            box-shadow: 0 0 0 3px rgba(255,255,255,0.22);
          }
        }

        @media (max-width: 980px) {
          .lp-bento { grid-template-columns: 1fr 1fr !important; }
          .lp-feat-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .lp-steps { grid-template-columns: 1fr !important; }
          .lp-wl { grid-template-columns: 1fr !important; }
          .lp-price-wrap { grid-template-columns: 1fr !important; }
          .lp-testi-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .lp-pain-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .lp-foot-top { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 760px) {
          body, #root { overflow-x: hidden; }

          .lp-section { padding-top: 40px !important; padding-bottom: 40px !important; }
          .lp-section-sm { padding-top: 32px !important; padding-bottom: 32px !important; }

          .lp-feat-grid { grid-template-columns: 1fr 1fr !important; gap: 10px !important; }
          .lp-feat-featured { grid-column: span 2 !important; }
          .lp-bento { grid-template-columns: 1fr 1fr !important; gap: 10px !important; }
          .lp-pain-grid { grid-template-columns: 1fr !important; }
          .lp-testi-grid { grid-template-columns: 1fr !important; gap: 10px !important; }
          .lp-foot-top { grid-template-columns: 1fr !important; gap: 24px !important; }
          .lp-steps { gap: 10px !important; grid-template-columns: 1fr !important; }
          .lp-price-wrap { grid-template-columns: 1fr !important; }
          .lp-calc-hide { display: none !important; }

          .lp-hero-padding { padding-top: 90px !important; }

          .lp-float-wrap {
            display: grid !important;
            grid-template-columns: repeat(4, 1fr) !important;
            gap: 7px !important;
            padding: 0 12px !important;
            margin-top: 24px !important;
            margin-bottom: -24px !important;
            overflow: visible !important;
            justify-content: unset !important;
            align-items: stretch !important;
            min-height: unset !important;
            perspective: none !important;
          }
          .lp-float-wrap > div {
            width: 100% !important;
            animation: none !important;
            flex-shrink: unset !important;
          }
          .lp-float-wrap > div > div {
            width: 100% !important;
            border-radius: 10px !important;
            padding: 10px 9px !important;
          }
          .lp-float-wrap > div > div > div:last-child { display: none !important; }
          .lp-float-wrap > div > div > div[style*="font-size: 26px"] { font-size: 16px !important; margin: 3px 0 !important; }
          .lp-float-wrap > div > div > div[style*="font-size: 11px"] { font-size: 10px !important; }
          .lp-float-wrap > div > div > div[style*="font-size: 13px"] { font-size: 11px !important; }
          .lp-float-wrap > div > div > span { font-size: 9px !important; padding: 2px 6px !important; }
          .lp-float-wrap > div > div > div[style*="width: 34px"] { width: 24px !important; height: 24px !important; font-size: 13px !important; margin-bottom: 5px !important; }
          .lp-float-card-mid { display: none !important; }

          .lp-hero-btns {
            flex-direction: column !important;
            align-items: stretch !important;
            width: 100% !important;
            max-width: 320px !important;
            margin-left: auto !important;
            margin-right: auto !important;
            gap: 10px !important;
          }
          .lp-hero-btns .lp-btn {
            width: 100% !important;
            justify-content: center !important;
            padding: 13px 20px !important;
            font-size: 14px !important;
          }

          .lp-h2 { line-height: 1.18 !important; margin-bottom: 20px !important; }

          .lp-feat-card { padding: 14px !important; border-radius: 10px !important; }

          .lp-bento > div > div { min-height: unset !important; }

          .lp-pain-grid > div > div { padding: 14px !important; border-radius: 10px !important; }

          .lp-wl { gap: 32px !important; }
          .lp-wl-phones {
            justify-content: center !important;
            gap: 10px !important;
            padding: 0 8px 16px !important;
            flex-wrap: nowrap !important;
          }
          .lp-wl-phones > div {
            transform: none !important;
            width: calc(50% - 5px) !important;
            max-width: 175px !important;
          }
          .lp-wl-phones > div > div { height: 280px !important; }

          .lp-price-card { padding: 22px 20px !important; border-radius: 16px !important; }
          .lp-price-num { font-size: 44px !important; line-height: 1 !important; }

          .lp-testi-grid > div > div { padding: 16px !important; border-radius: 12px !important; }

          .lp-steps > div > div { padding: 16px 14px !important; border-radius: 12px !important; }
          .lp-steps > div > div h3 { font-size: 14px !important; }

          .lp-cta-box { padding: 28px 20px !important; border-radius: 18px !important; }
          .lp-cta-box h2 { font-size: 22px !important; margin-bottom: 10px !important; }
          .lp-cta-box p { font-size: 13px !important; margin-bottom: 18px !important; }
          .lp-cta-btns {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 10px !important;
          }
          .lp-cta-btns .lp-btn {
            width: 100% !important;
            justify-content: center !important;
            font-size: 14px !important;
          }

          .lp-foot-links {
            display: grid !important;
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 16px !important;
          }

          .lp-marquee-wrap { padding-top: 36px !important; padding-bottom: 24px !important; }

          .lp-wl-list li { font-size: 13px !important; margin-bottom: 8px !important; }
          .lp-wl-cta { font-size: 13px !important; padding: 12px 18px !important; }

          .lp-inner { padding-left: 18px !important; padding-right: 18px !important; }
        }

        @media (max-width: 480px) {
          .lp-feat-grid { grid-template-columns: 1fr !important; }
          .lp-feat-featured { grid-column: span 1 !important; }
          .lp-pain-grid { grid-template-columns: 1fr !important; }
          .lp-float-wrap { grid-template-columns: repeat(4, 1fr) !important; gap: 5px !important; padding: 0 8px !important; }
          .lp-float-wrap > div > div { padding: 8px 7px !important; border-radius: 8px !important; }
          .lp-wl-phones > div { max-width: 150px !important; }
          .lp-wl-phones > div > div { height: 260px !important; }
          .lp-foot-links { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      {/* ══════════ NAVBAR ══════════ */}
      <header className={`lp-nav${scrolled ? ' lp-nav-scrolled' : ''}`}>
        <div className="lp-nav-inner">
          <a
            href="#"
            className="lp-nav-logo"
            onClick={(e) => {
              if (window.innerWidth <= 760) {
                e.preventDefault();
                setMenuOpen(p => !p);
              }
            }}
          >
            <div className={`lp-nav-logo-circle${menuOpen ? ' open' : ''}`}>
              {menuOpen ? '✕' : <img src={logoImg} alt="Umrahme" />}
            </div>
            <span className="lp-nav-logo-text">Umrahme</span>
          </a>

          <nav className="lp-nav-links">
            {[['#fitur', 'Fitur'], ['#harga', 'Harga'], ['#cara', 'Cara Kerja'], ['#kontak', 'Kontak']].map(([h, l]) => (
              <a key={h} href={h} className="lp-nav-link">{l}</a>
            ))}
          </nav>

          <div className="lp-nav-right">
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="lp-nav-cta-btn">
              Daftar Sekarang →
            </a>
          </div>
        </div>
      </header>

      {/* ══════════ MOBILE DROPDOWN ══════════ */}
      <div className={`lp-mobile-dropdown${menuOpen ? ' open' : ''}${scrolled ? ' scrolled' : ''}`}>
        {[['#fitur', 'Fitur'], ['#harga', 'Harga'], ['#cara', 'Cara Kerja'], ['#kontak', 'Kontak']].map(([h, l]) => (
          <a
            key={h} href={h}
            className={`lp-md-link${scrolled ? ' scrolled' : ''}`}
            onClick={() => setMenuOpen(false)}
            style={scrolled ? { color: '#131313', borderBottomColor: 'rgba(0,0,0,0.06)' } : {}}
          >{l}</a>
        ))}
        <a
          href={WA_LINK} target="_blank" rel="noopener noreferrer"
          className="lp-md-cta"
          onClick={() => setMenuOpen(false)}
          style={scrolled ? { background: '#131313', color: '#fff' } : {}}
        >
          Daftar Sekarang →
        </a>
      </div>

      {/* ══════════ HERO ══════════ */}
      <section className="lp-hero-padding" style={{
        position: 'relative',
        background: `linear-gradient(180deg, ${C.blue1} 0%, ${C.blue2} 45%, ${C.blue3} 100%)`,
        padding: '120px 0 0',
      }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'url(/hero-bg.avif)',
          backgroundSize: 'cover', backgroundPosition: 'center center',
        }} />
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'rgba(0,0,0,0.18)',
        }} />

        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 2, textAlign: 'center' }}>

          <motion.h1
            initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontSize: 'clamp(34px, 5vw, 60px)', fontWeight: 800, lineHeight: 1.05, color: '#fff', letterSpacing: '-0.02em', maxWidth: 900, margin: '0 auto 20px', textShadow: '0 2px 24px rgba(0,0,0,0.5), 0 1px 4px rgba(0,0,0,0.4)' }}
          >
            Aplikasi Umrah{' '}
            <span style={{ color: C.accent, fontStyle: 'italic' }}>Bermerek Travel Anda</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.65 }}
            style={{ color: 'rgba(255,255,255,.88)', fontSize: 'clamp(14px, 1.8vw, 16px)', maxWidth: 560, margin: '0 auto 26px', fontWeight: 400, textShadow: '0 1px 12px rgba(0,0,0,0.5)', lineHeight: 1.7 }}
          >
            Satu aplikasi menggantikan buku doa, grup WA, dan koordinasi manual. Bermerek nama travel Anda — hanya <strong>10 SAR</strong> per jamaah.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32, duration: 0.55 }}
            className="lp-hero-btns"
            style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 26 }}
          >
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="lp-btn" style={{ background: C.ink, color: '#fff', padding: '14px 28px', fontSize: 15, fontWeight: 600 }}>
              Coba Gratis Sekarang
            </a>
            <a href="#cara" className="lp-btn" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.4)', padding: '14px 28px', fontSize: 15, fontWeight: 600 }}>
              Lihat Cara Kerjanya
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.48 }}
            className="lp-hero-social"
            style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', color: 'rgba(255,255,255,.8)', fontSize: 13, fontWeight: 500 }}
          >
            <span style={{ color: C.accent, letterSpacing: 2 }}>★★★★★</span>
            <span>Lebih hemat dari buku doa cetak. Lebih profesional dari grup WhatsApp.</span>
          </motion.div>

        </div>

        {/* gradient fade ke white */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          height: 120, pointerEvents: 'none', zIndex: 4,
          background: 'linear-gradient(to bottom, transparent 0%, #ffffff 100%)',
        }} />
      </section>


      {/* ══════════ PARTNERS MARQUEE ══════════ */}
      <section className="lp-marquee-wrap" style={{ padding: '44px 0 32px' }}>
        <p style={{ textAlign: 'center', fontSize: 12, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.muted, marginBottom: 18, fontFamily: F }}>
          Bergabunglah bersama travel umrah yang lebih modern
        </p>
        <MarqueeStrip />
      </section>


      {/* ══════════ ABOUT / BENTO ══════════ */}
      <section className="lp-section" style={{ padding: '56px 0' }}>
        <div className="lp-inner" style={{ maxWidth: 1180, margin: '0 auto', padding: '0 24px' }}>
          <Reveal><Eyebrow>Tentang Umrahme</Eyebrow></Reveal>
          <Reveal>
            <h2 className="lp-h2" style={{ textAlign: 'center', fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 800, lineHeight: 1.12, letterSpacing: '-0.02em', maxWidth: 700, margin: '0 auto 28px' }}>
              Satu langkah kecil. Lompatan besar untuk travel Anda.
            </h2>
          </Reveal>

          <div className="lp-bento" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            <Reveal>
              <div style={{ background: `linear-gradient(165deg, ${C.blue2}, ${C.blue1})`, color: '#fff', borderRadius: 14, padding: 20 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, opacity: 0.85, marginBottom: 8 }}>per jamaah, sekali bayar</div>
                <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em' }}>10 SAR</div>
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <div style={{ background: C.bg, border: `1px solid ${C.line}`, borderRadius: 14, padding: 20 }}>
                <div style={{ fontSize: 12.5, color: C.muted, fontWeight: 600, marginBottom: 8 }}>doa & panduan ibadah</div>
                <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em', color: C.ink }}>55+</div>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div style={{ background: C.accent, borderRadius: 14, padding: 20 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: C.greenDark, marginBottom: 8 }}>bermerek travel Anda</div>
                <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em', color: C.greenDark }}>100%</div>
              </div>
            </Reveal>
            <Reveal delay={0.11}>
              <div style={{ background: C.ink, color: '#fff', borderRadius: 14, padding: 20 }}>
                <div style={{ fontSize: 12.5, color: '#94a3b8', fontWeight: 600, marginBottom: 8 }}>biaya setup & bulanan</div>
                <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em', color: C.accent }}>Rp 0</div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>


      {/* ══════════ PAIN POINTS ══════════ */}
      <section className="lp-section" style={{ background: C.soft, padding: '56px 0' }}>
        <div className="lp-inner" style={{ maxWidth: 1180, margin: '0 auto', padding: '0 24px' }}>
          <Reveal><Eyebrow>Masalah Anda Hari Ini</Eyebrow></Reveal>
          <Reveal>
            <h2 className="lp-h2" style={{ textAlign: 'center', fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 800, lineHeight: 1.12, letterSpacing: '-0.02em', maxWidth: 700, margin: '0 auto 10px' }}>
              Kenali masalahnya. Rasakan bedanya.
            </h2>
          </Reveal>
          <Reveal>
            <p style={{ textAlign: 'center', color: C.muted, maxWidth: 520, margin: '0 auto 28px', fontSize: 14 }}>
              Setiap travel pernah mengalaminya. Bedanya, sekarang ada solusinya.
            </p>
          </Reveal>

          <div className="lp-pain-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
            {[
              { icon: '😕', title: '"Jadwal hari ini apa, Pak?"', desc: 'Pertanyaan sama, dijawab berulang sepanjang hari.' },
              { icon: '🔁', title: 'Muthowif lelah sebelum ibadah dimulai', desc: 'Energi habis untuk hal teknis, bukan membimbing.' },
              { icon: '📕', title: 'Buku doa cetak mahal dan percuma', desc: '15–25 SAR per buku. Hilang, rusak, jarang dibaca.' },
              { icon: '📢', title: 'Info penting tenggelam di grup WA', desc: 'Pengumuman penting tertimbun ratusan chat.' },
              { icon: '📱', title: 'Semua dikerjakan manual', desc: 'Excel, kertas, WA — tak ada sistem terpadu.' },
              { icon: '🏷️', title: 'Travel lain sudah punya aplikasi', desc: 'Dan mereka terlihat lebih profesional di mata calon jamaah.' },
            ].map((p, i) => (
              <Reveal key={i} delay={i * 0.04}>
                <div style={{ background: C.bg, borderRadius: 12, padding: 16, border: `1px solid ${C.line}`, display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: C.soft, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0, boxShadow: '0 4px 12px rgba(15,23,42,.1)' }}>{p.icon}</div>
                  <div>
                    <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 3 }}>{p.title}</h3>
                    <p style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.5 }}>{p.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════ FEATURES ══════════ */}
      <section id="fitur" className="lp-section" style={{ padding: '56px 0' }}>
        <div className="lp-inner" style={{ maxWidth: 1180, margin: '0 auto', padding: '0 24px' }}>
          <Reveal><Eyebrow>Fitur Lengkap</Eyebrow></Reveal>
          <Reveal>
            <h2 className="lp-h2" style={{ textAlign: 'center', fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 800, lineHeight: 1.12, letterSpacing: '-0.02em', maxWidth: 700, margin: '0 auto 10px' }}>
              Semua yang jamaah butuhkan. Sudah termasuk.
            </h2>
          </Reveal>
          <Reveal>
            <p style={{ textAlign: 'center', color: C.muted, maxWidth: 520, margin: '0 auto 28px', fontSize: 14 }}>
              12 fitur lengkap, aktif begitu Anda daftar. Tanpa biaya tambahan, tanpa tim IT.
            </p>
          </Reveal>

          <div className="lp-feat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {features.map((f, i) => (
              <Reveal key={i} delay={i * 0.03} className={i < 2 ? 'lp-feat-featured' : ''}>
                <div className="lp-feat-card">
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: C.accent, color: C.greenDark, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, marginBottom: 10 }}>{f.icon}</div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: C.accentDark, marginBottom: 3 }}>FITUR {f.num}</div>
                  <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{f.title}</h3>
                  <p style={{ fontSize: 12, color: C.muted, lineHeight: 1.5 }}>{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════ HOW IT WORKS ══════════ */}
      <section id="cara" className="lp-section" style={{ background: C.soft, padding: '56px 0' }}>
        <div className="lp-inner" style={{ maxWidth: 1180, margin: '0 auto', padding: '0 24px' }}>
          <Reveal><Eyebrow>Cara Kerja</Eyebrow></Reveal>
          <Reveal>
            <h2 className="lp-h2" style={{ textAlign: 'center', fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 800, lineHeight: 1.12, letterSpacing: '-0.02em', maxWidth: 700, margin: '0 auto 10px' }}>
              Dari daftar sampai jalan, cuma 3 langkah
            </h2>
          </Reveal>
          <Reveal>
            <p style={{ textAlign: 'center', color: C.muted, maxWidth: 500, margin: '0 auto 28px', fontSize: 14 }}>
              Tanpa tim IT, tanpa training. Siap untuk keberangkatan berikutnya.
            </p>
          </Reveal>

          <div className="lp-steps" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {[
              { title: 'Daftar & Pasang Logo Travel Anda', desc: 'Upload logo, pilih warna, masukkan nama. Selesai dalam menit.' },
              { title: 'Input Jamaah & Jadwal', desc: 'Masukkan data jamaah & agenda. Tersinkron otomatis.' },
              { title: 'Bagikan Kode, Jamaah Langsung Pakai', desc: 'Jamaah buka link, masukkan kode. Tanpa install.' },
            ].map((s, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div style={{ background: '#fff', borderRadius: 12, padding: 20, border: `1px solid ${C.line}` }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: C.ink, color: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800, marginBottom: 14 }}>{i + 1}</div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 5 }}>{s.title}</h3>
                  <p style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.55 }}>{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════ WHITE-LABEL SHOWCASE ══════════ */}
      <section className="lp-section" style={{ padding: '56px 0' }}>
        <div className="lp-inner" style={{ maxWidth: 1180, margin: '0 auto', padding: '0 24px' }}>
          <div className="lp-wl" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 36 }}>
            <Reveal>
              <div style={{ maxWidth: 680, margin: '0 auto' }}>
                <Eyebrow align="left">White-Label</Eyebrow>
                <h2 style={{ fontSize: 'clamp(24px, 3.2vw, 34px)', fontWeight: 800, lineHeight: 1.12, letterSpacing: '-0.02em', marginBottom: 14 }}>
                  Jamaah lihat nama Anda. Bukan kami.
                </h2>
                <p style={{ color: C.muted, fontSize: 14, marginBottom: 18, lineHeight: 1.7 }}>
                  Logo, warna, dan nama travel Anda di setiap halaman. Tanpa jejak pihak ketiga. Yang jamaah ingat dan rekomendasikan: travel Anda.
                </p>
                <ul className="lp-wl-list" style={{ listStyle: 'none' }}>
                  {[
                    'Logo & nama travel di setiap halaman',
                    'Warna brand Anda, konsisten & profesional',
                    'Terlihat sekelas travel besar yang punya app sendiri',
                    'Semua kustomisasi termasuk — tanpa biaya ekstra',
                  ].map((t) => (
                    <li key={t} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10, fontWeight: 600, fontSize: 13.5 }}>
                      <span style={{ flexShrink: 0, width: 20, height: 20, borderRadius: '50%', background: C.accent, color: C.greenDark, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800 }}>✓</span>
                      {t}
                    </li>
                  ))}
                </ul>
                <div style={{ marginTop: 22 }}>
                  <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="lp-btn lp-btn-dark lp-wl-cta">
                    Lihat Demo dengan Nama Travel Anda <span className="lp-arrow" style={{ background: C.accent, color: C.ink }}>→</span>
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>


      {/* ══════════ PRICING ══════════ */}
      <section id="harga" className="lp-section" style={{ background: C.soft, padding: '56px 0' }}>
        <div className="lp-inner" style={{ maxWidth: 1180, margin: '0 auto', padding: '0 24px' }}>
          <Reveal><Eyebrow>Harga</Eyebrow></Reveal>
          <Reveal>
            <h2 className="lp-h2" style={{ textAlign: 'center', fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 800, lineHeight: 1.12, letterSpacing: '-0.02em', maxWidth: 700, margin: '0 auto 10px' }}>
              Harga yang bikin Anda untung sejak hari pertama.
            </h2>
          </Reveal>
          <Reveal>
            <p style={{ textAlign: 'center', color: C.muted, maxWidth: 520, margin: '0 auto 28px', fontSize: 14 }}>
              Cetak buku doa 15–25 SAR per jamaah — hanya buku. Umrahme 10 SAR — 12 fitur, bermerek travel Anda.
            </p>
          </Reveal>

          <div className="lp-price-wrap" style={{ display: 'grid', gridTemplateColumns: '1.1fr .9fr', gap: 20, alignItems: 'stretch' }}>
            <Reveal>
              <div className="lp-price-card" style={{ background: C.ink, color: '#fff', borderRadius: 18, padding: 28, position: 'relative', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ position: 'absolute', top: 22, right: -34, background: C.accent, color: C.greenDark, fontWeight: 800, fontSize: 11, padding: '5px 44px', transform: 'rotate(45deg)' }}>POPULER</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 5 }}>Harga Per Jamaah</h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, margin: '10px 0 2px' }}>
                  <span className="lp-price-num" style={{ fontSize: 48, fontWeight: 800, lineHeight: 1, color: C.accent }}>10</span>
                  <span style={{ fontSize: 15, color: 'rgba(255,255,255,.8)' }}>SAR saja / jamaah</span>
                </div>
                <p style={{ color: 'rgba(255,255,255,.55)', fontSize: 12, fontStyle: 'italic', marginBottom: 18 }}>
                  Balik modal hanya dari hemat biaya cetak buku doa.
                </p>
                <p style={{ color: 'rgba(255,255,255,.7)', fontSize: 13, marginBottom: 20 }}>Bayar per keberangkatan. Tidak ada biaya bulanan, tidak ada kontrak.</p>
                <ul style={{ listStyle: 'none', flex: 1 }}>
                  {['Tidak ada biaya setup — langsung aktif', 'Tidak ada tagihan bulanan yang mengejutkan', 'Bayar sesuai jamaah yang berangkat saja', 'Semua 12 fitur langsung aktif — tidak ada upgrade berbayar', 'Branding travel Anda penuh — tanpa biaya kustomisasi', 'Support via WhatsApp'].map(t => (
                    <li key={t} style={{ display: 'flex', gap: 9, alignItems: 'center', marginBottom: 9, fontSize: 13 }}>
                      <span style={{ width: 19, height: 19, borderRadius: '50%', background: C.accent, color: C.greenDark, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, flexShrink: 0 }}>✓</span>
                      {t}
                    </li>
                  ))}
                </ul>
                <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="lp-btn lp-btn-accent" style={{ width: '100%', justifyContent: 'center', marginTop: 20 }}>
                  Mulai Sekarang — Gratis Dulu <span className="lp-arrow">→</span>
                </a>
              </div>
            </Reveal>

            <Reveal delay={0.08} className="lp-calc-hide">
              <div style={{ background: C.bg, border: `1px solid ${C.line}`, borderRadius: 18, padding: 24, display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                <h4 style={{ fontSize: 17, fontWeight: 700, marginBottom: 5 }}>Kalkulator Biaya</h4>
                <p style={{ color: C.muted, fontSize: 13, marginBottom: 18 }}>Estimasi untuk keberangkatan Anda</p>
                {[['Jumlah Jamaah', '40 orang'], ['Harga per Jamaah', '10 SAR'], ['Biaya Setup', 'Rp 0']].map(([l, v]) => (
                  <div key={l} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 0', borderBottom: `1px dashed ${C.line}`, fontSize: 14 }}>
                    <span>{l}</span>
                    <span style={{ fontWeight: 600 }}>{v}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 0 0', fontSize: 17, fontWeight: 800 }}>
                  <span>Total</span>
                  <span style={{ color: C.green }}>
                    400 SAR
                    <span style={{ display: 'inline-block', background: C.accent, color: C.greenDark, fontWeight: 800, padding: '2px 10px', borderRadius: 999, fontSize: 12, marginLeft: 8 }}>Hemat 60%</span>
                  </span>
                </div>
                <p style={{ fontSize: 12.5, color: C.muted, marginTop: 14, lineHeight: 1.6 }}>Untuk 40 jamaah, biaya cetak buku doa bisa sampai 1.000 SAR. Dengan Umrahme, 40 jamaah hanya 400 SAR — dan dapat 12 fitur, bukan sekadar buku.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>


      {/* ══════════ FAQ ══════════ */}
      <section className="lp-section" style={{ background: C.soft, padding: '56px 0' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px' }}>
          <Reveal><Eyebrow>FAQ</Eyebrow></Reveal>
          <Reveal>
            <h2 className="lp-h2" style={{ textAlign: 'center', fontSize: 'clamp(23px, 3vw, 32px)', fontWeight: 800, lineHeight: 1.12, letterSpacing: '-0.02em', margin: '0 auto 28px' }}>
              Masih ragu? Ini jawabannya.
            </h2>
          </Reveal>
          <Reveal delay={0.05}>
            {faqs.map((f, i) => <FAQItem key={i} q={f.q} a={f.a} />)}
          </Reveal>
        </div>
      </section>


      {/* ══════════ FINAL CTA ══════════ */}
      <section id="kontak" className="lp-section" style={{ padding: '56px 24px' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <Reveal>
            <div className="lp-cta-box" style={{ background: `linear-gradient(165deg, ${C.primary}, ${C.primaryDark})`, color: '#fff', borderRadius: 20, padding: '40px 32px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', width: 280, height: 280, background: `radial-gradient(circle, rgba(255,255,255,.12), transparent 70%)`, top: -100, right: -60, pointerEvents: 'none' }} />
              <h2 style={{ fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 800, marginBottom: 14, position: 'relative' }}>
                Keberangkatan berikutnya, naik kelas.
              </h2>
              <p style={{ color: 'rgba(255,255,255,.85)', maxWidth: 500, margin: '0 auto 24px', fontSize: 15, lineHeight: 1.7, position: 'relative' }}>
                Jamaah lebih tenang, muthowif lebih fokus, travel Anda lebih profesional. Semua mulai 10 SAR per jamaah. Coba demo gratis dulu — kami setup dengan nama travel Anda.
              </p>
              <div className="lp-cta-btns" style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', position: 'relative' }}>
                <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="lp-btn lp-btn-accent">
                  Minta Demo Gratis via WhatsApp <span className="lp-arrow">→</span>
                </a>
                <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="lp-btn lp-btn-ghost">
                  Pelajari Lebih Lanjut
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>


      {/* ══════════ FOOTER ══════════ */}
      <footer style={{ padding: '44px 0 28px', borderTop: `1px solid ${C.line}` }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 24px' }}>
          <div className="lp-foot-top" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr', gap: 28, marginBottom: 32 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, fontWeight: 800, fontSize: 18, color: C.ink, marginBottom: 12, textDecoration: 'none' }}>
                <img src={logoImg} alt="Umrahme" style={{ width: 28, height: 28, objectFit: 'contain', display: 'block', flexShrink: 0 }} />
                Umrahme
              </div>
              <p style={{ color: C.muted, fontSize: 13, maxWidth: 280, lineHeight: 1.7 }}>Ganti buku doa cetak. Ringankan kerja muthowif. Tampil profesional. Hanya 10 SAR per jamaah.</p>
            </div>
            <div className="lp-foot-links">
            {[
              { title: 'Produk', links: [['#fitur', 'Fitur'], ['#harga', 'Harga'], ['#cara', 'Cara Kerja']] },
              { title: 'Perusahaan', links: [['#kontak', 'Kontak'], [WA_LINK, 'WhatsApp']] },
              { title: 'Legal', links: [['#', 'Kebijakan Privasi'], ['#', 'Syarat & Ketentuan']] },
            ].map(col => (
              <div key={col.title}>
                <h4 style={{ fontSize: 13, fontWeight: 700, marginBottom: 14 }}>{col.title}</h4>
                {col.links.map(([href, label]) => (
                  <a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                    style={{ display: 'block', color: C.muted, fontSize: 13, marginBottom: 8, textDecoration: 'none', transition: 'color .2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = C.primary)}
                    onMouseLeave={e => (e.currentTarget.style.color = C.muted)}
                  >{label}</a>
                ))}
              </div>
            ))}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 18, borderTop: `1px solid ${C.line}`, color: C.muted, fontSize: 12, flexWrap: 'wrap', gap: 12 }}>
            <span>© {new Date().getFullYear()} Umrahme. All rights reserved.</span>
            <span>Dibuat untuk travel umrah Indonesia 🇮🇩</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
