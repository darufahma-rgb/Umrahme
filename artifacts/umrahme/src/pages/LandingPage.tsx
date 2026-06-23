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
    { num: '01', title: '55+ Doa Lengkap', desc: 'Arab, latin, terjemahan — semua ada. Jamaah buka HP, langsung ikuti saat muthowif menjelaskan. Tidak perlu cetak buku lagi.',
      icon: <><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></> },
    { num: '02', title: "Counter Tawaf & Sa'i", desc: 'Hitung putaran otomatis, doa muncul sendiri di tiap putaran. Jamaah fokus ibadah, bukan sibuk hitung.',
      icon: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></> },
    { num: '03', title: 'Panduan Ibadah', desc: 'Panduan step-by-step yang bisa dipelajari jamaah sebelum berangkat. Mereka tiba di tanah suci sudah siap.',
      icon: <><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></> },
    { num: '04', title: 'Peta & Lokasi Bersejarah', desc: '10 lokasi ziarah lengkap dengan sejarah, tokoh, dalil, dan link Google Maps. Jamaah tidak perlu bertanya arah.',
      icon: <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></> },
    { num: '05', title: 'Jadwal Sholat Real-time', desc: 'Waktu sholat otomatis sesuai lokasi — Makkah, Madinah, atau di perjalanan. Tidak ada alasan terlewat.',
      icon: <><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2"/><path d="M5 3 2 6"/><path d="m22 6-3-3"/></> },
    { num: '06', title: 'Pengumuman Travel', desc: 'Kirim pengumuman dari portal travel — muncul langsung di HP semua jamaah. Lebih cepat dan pasti terbaca.',
      icon: <><path d="M3 11l18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/></> },
    { num: '07', title: 'Agenda Harian', desc: 'Isi agenda sekali di portal, jamaah lihat jadwal hari ini otomatis. Tidak ada lagi pertanyaan "hari ini kita ke mana?".',
      icon: <><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></> },
    { num: '08', title: 'Kartu Jamaah Digital', desc: 'Nama, rombongan, hotel, nomor pembimbing — semua dalam satu kartu digital. Berguna saat jamaah terpisah atau darurat.',
      icon: <><rect x="2" y="5" width="20" height="14" rx="2"/><circle cx="8" cy="12" r="2.5"/><path d="M14 10h5M14 14h5"/></> },
    { num: '09', title: 'Jurnal Perjalanan', desc: 'Jamaah catat momen perjalanan suci mereka. Kenangan ibadah tersimpan rapi, bisa dibaca ulang kapan saja.',
      icon: <><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z"/></> },
    { num: '10', title: 'Sertifikat Umrah Digital', desc: 'Sertifikat digital bermerek travel Anda — jamaah bisa simpan dan bagikan. Kenang-kenangan yang juga promosi.',
      icon: <><circle cx="12" cy="9" r="6"/><path d="M9 14.5 8 22l4-2 4 2-1-7.5"/></> },
    { num: '11', title: 'White-Label Penuh', desc: 'Logo Anda, warna Anda, nama Anda. Jamaah tidak tahu ini Umrahme — yang mereka tahu ini aplikasi travel Anda.',
      icon: <><circle cx="13.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="10.5" r="2.5"/><circle cx="8.5" cy="7.5" r="2.5"/><circle cx="6.5" cy="12.5" r="2.5"/><path d="M12 2a10 10 0 1 0 0 20 2 2 0 0 0 2-2 2 2 0 0 1 2-2h2a4 4 0 0 0 4-4 10 10 0 0 0-10-10z"/></> },
    { num: '12', title: 'Portal Travel Agency', desc: 'Satu dashboard untuk semua: kelola data jamaah, atur agenda, kirim pengumuman. Semua terkontrol dari satu tempat.',
      icon: <><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/></> },
  ];

  const faqs = [
    { q: 'Jamaah kami rata-rata tidak terlalu melek teknologi. Bisa pakai?', a: 'Bisa, dan justru dirancang untuk itu. Tidak perlu install apapun — jamaah cukup buka browser, ketuk link yang Anda bagikan, masukkan kode dan nama. Selesai. Sudah banyak jamaah lansia 60+ yang pakai tanpa kesulitan.' },
    { q: 'Seberapa cepat aplikasi bisa bermerek travel kami?', a: 'Kurang dari 10 menit. Upload logo, pilih warna, masukkan nama travel — dan aplikasi langsung tampil bermerek travel Anda. Tidak perlu menunggu, tidak perlu approval dari kami.' },
    { q: 'Apakah data jamaah kami aman?', a: 'Ya, aman. Data jamaah disimpan terenkripsi dan tidak pernah dibagikan ke pihak manapun. Hanya travel Anda yang bisa akses data jamaah Anda.' },
    { q: 'Sinyal di area Haram sering lemah. Tetap bisa dipakai?', a: 'Ya. Doa, panduan ibadah, kartu jamaah, dan konten yang sudah pernah dibuka tetap bisa diakses offline. Jamaah tidak akan tergantung sinyal saat tawaf atau sa\'i.' },
    { q: 'Bagaimana cara mulai dan bayarnya?', a: 'Hubungi kami via WhatsApp, kami bantu setup demo gratis dengan nama travel Anda dulu. Kalau cocok, baru bicara soal pembayaran. Biaya dihitung per jamaah dan dibayar per keberangkatan — tanpa kontrak, tanpa minimum jamaah. Detail harga ada di bagian Harga.' },
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
          position: fixed; top: 16px; left: 50%; transform: translateX(-50%);
          z-index: 100;
          width: calc(100% - 48px);
          max-width: 820px;
          border-radius: 999px;
          background: rgba(255,255,255,0.12);
          backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.22);
          box-shadow: 0 4px 24px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.2);
          transition: background .3s ease, box-shadow .3s ease, border-color .3s ease;
        }
        .lp-nav-scrolled {
          background: rgba(255,255,255,0.82);
          backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
          border-color: rgba(0,0,0,0.08);
          box-shadow: 0 2px 16px rgba(0,0,0,0.10), 0 1px 0 rgba(0,0,0,0.04);
        }
        .lp-nav-inner {
          display: flex; align-items: center;
          padding: 0 8px 0 16px; height: 52px;
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
          font-size: 14px; font-weight: 500; color: rgba(255,255,255,0.95);
          text-decoration: none; transition: color .15s, background .15s;
          font-family: ${F};
        }
        .lp-nav-link:hover { color: #fff; background: rgba(255,255,255,0.12); }
        .lp-nav-scrolled .lp-nav-link { color: #4C4C4C; }
        .lp-nav-scrolled .lp-nav-link:hover { color: #131313; background: rgba(0,0,0,0.05); }
        .lp-nav-right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
        .lp-nav-cta-btn {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 8px 18px; border-radius: 999px;
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
          position: fixed; top: 80px; left: 24px; right: 24px; z-index: 98;
          border-radius: 20px;
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

          .lp-hero-padding { padding-top: 88px !important; }



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
          .lp-feat-grid { grid-template-columns: 1fr 1fr !important; gap: 10px !important; }
          .lp-feat-card { padding: 14px !important; border-radius: 12px !important; }
          .lp-feat-card h3 { font-size: 13.5px !important; margin-bottom: 4px !important; }
          .lp-feat-card p { font-size: 11.5px !important; line-height: 1.45 !important; }
          .lp-feat-card > div:first-child { width: 30px !important; height: 30px !important; font-size: 15px !important; margin-bottom: 8px !important; }
          .lp-feat-featured { grid-column: span 1 !important; }
          .lp-pain-grid { grid-template-columns: 1fr !important; }
          .lp-wl-phones > div { max-width: 150px !important; }
          .lp-wl-phones > div > div { height: 260px !important; }
          .lp-foot-links { grid-template-columns: 1fr 1fr !important; }
        }

        .lp-bento > div { height: 100%; }

        @keyframes lpPulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(0,84,249,0.0); } 50% { box-shadow: 0 0 0 6px rgba(0,84,249,0.08); } }
        .lp-cta-pulse { animation: lpPulse 2.8s ease-in-out infinite; }

        .lp-feat-card .lp-feat-icon { transition: transform .25s ease; }
        .lp-feat-card:hover .lp-feat-icon { transform: scale(1.08) rotate(-3deg); }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
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
        padding: '100px 0 90px',
      }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'url(/hero-bg.avif)',
          backgroundSize: 'cover', backgroundPosition: 'center top',
        }} />
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'rgba(0,0,0,0.18)',
        }} />
        {/* kubah — transisi dome ke section berikutnya */}
        <div style={{ position: 'absolute', bottom: -1, left: 0, right: 0, zIndex: 4, lineHeight: 0, pointerEvents: 'none' }}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 72" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 72 }}>
            <path d="M0,72 Q720,0 1440,72 L1440,72 L0,72 Z" fill="#ffffff" />
          </svg>
        </div>

        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 2, textAlign: 'center' }}>

          <motion.h1
            initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontSize: 'clamp(34px, 5vw, 60px)', fontWeight: 800, lineHeight: 1.05, color: '#fff', letterSpacing: '-0.02em', maxWidth: 900, margin: '0 auto 20px', textShadow: '0 2px 24px rgba(0,0,0,0.5), 0 1px 4px rgba(0,0,0,0.4)' }}
          >
            Pendamping Umrah Digital{' '}
            <span style={{ color: C.accent, fontStyle: 'italic' }}>untuk Travel Anda</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.65 }}
            style={{ color: 'rgba(255,255,255,.88)', fontSize: 'clamp(14px, 1.8vw, 16px)', maxWidth: 560, margin: '0 auto 26px', fontWeight: 400, textShadow: '0 1px 12px rgba(0,0,0,0.5)', lineHeight: 1.7 }}
          >
            Doa, panduan ibadah, jadwal, dan komunikasi travel — semua dalam satu aplikasi bermerek nama Anda. Lebih hemat dari mencetak buku doa, dengan manfaat berkali lipat.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32, duration: 0.55 }}
            className="lp-hero-btns"
            style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 26 }}
          >
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="lp-btn lp-cta-pulse" style={{ background: C.ink, color: '#fff', padding: '14px 28px', fontSize: 15, fontWeight: 600 }}>
              Coba Gratis — 5 Jamaah Pertama
            </a>
            <a href="#cara" className="lp-btn" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.4)', padding: '14px 28px', fontSize: 15, fontWeight: 600 }}>
              Lihat Cara Kerjanya
            </a>
          </motion.div>


        </div>
      </section>




      {/* ══════════ ABOUT / BENTO ══════════ */}
      <section className="lp-section" style={{ padding: '56px 0' }}>
        <div className="lp-inner" style={{ maxWidth: 1180, margin: '0 auto', padding: '0 24px' }}>
          <Reveal delay={0}><Eyebrow>Tentang Umrahme</Eyebrow></Reveal>
          <Reveal delay={0.08}>
            <h2 className="lp-h2" style={{ textAlign: 'center', fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 800, lineHeight: 1.12, letterSpacing: '-0.02em', maxWidth: 700, margin: '0 auto 10px' }}>
              Bukan sekadar aplikasi. Ini wajah baru travel Anda.
            </h2>
          </Reveal>
          <Reveal delay={0.14}>
            <p style={{ textAlign: 'center', color: C.muted, fontSize: 14, marginBottom: 28 }}>
              Empat alasan kenapa travel modern memilih Umrahme.
            </p>
          </Reveal>

          <div className="lp-bento" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, alignItems: 'stretch' }}>
            <Reveal>
              <motion.div whileHover={{ y: -4, transition: { duration: 0.2 } }} style={{ background: `linear-gradient(165deg, ${C.blue2}, ${C.blue1})`, color: '#fff', borderRadius: 16, padding: 22, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 200, boxSizing: 'border-box' }}>
                <div style={{ fontSize: 13, fontWeight: 600, opacity: 0.85 }}>Tampil sebagai aplikasi travel Anda sendiri</div>
                <motion.div initial={{ scale: 0.6, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true, margin: '-40px' }} transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.1 }} style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.03em', margin: '14px 0' }}>100%</motion.div>
                <div style={{ fontSize: 12.5, opacity: 0.85 }}>Logo, nama, dan warna brand Anda — tanpa jejak pihak ketiga</div>
              </motion.div>
            </Reveal>
            <Reveal delay={0.05}>
              <motion.div whileHover={{ y: -4, transition: { duration: 0.2 } }} style={{ background: C.bg, border: `1px solid ${C.line}`, borderRadius: 16, padding: 22, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 200, boxSizing: 'border-box' }}>
                <div style={{ fontSize: 13, color: C.muted, fontWeight: 600 }}>Doa & panduan ibadah siap pakai</div>
                <motion.div initial={{ scale: 0.6, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true, margin: '-40px' }} transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.1 }} style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.03em', color: C.ink, margin: '14px 0' }}>55+</motion.div>
                <div style={{ fontSize: 12.5, color: C.muted }}>Lengkap dengan Arab, latin, dan terjemahan</div>
              </motion.div>
            </Reveal>
            <Reveal delay={0.08}>
              <motion.div whileHover={{ y: -4, transition: { duration: 0.2 } }} style={{ background: C.accent, borderRadius: 16, padding: 22, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 200, boxSizing: 'border-box' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.greenDark }}>Fitur premium, langsung aktif</div>
                <motion.div initial={{ scale: 0.6, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true, margin: '-40px' }} transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.1 }} style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.03em', color: C.greenDark, margin: '14px 0' }}>12</motion.div>
                <div style={{ fontSize: 12.5, color: C.greenDark, opacity: 0.85 }}>Semua termasuk — tanpa biaya tambahan</div>
              </motion.div>
            </Reveal>
            <Reveal delay={0.11}>
              <motion.div whileHover={{ y: -4, transition: { duration: 0.2 } }} style={{ background: C.ink, color: '#fff', borderRadius: 16, padding: 22, height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 200, boxSizing: 'border-box' }}>
                <div style={{ fontSize: 13, color: '#94a3b8', fontWeight: 600 }}>Biaya setup & langganan bulanan</div>
                <motion.div initial={{ scale: 0.6, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true, margin: '-40px' }} transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.1 }} style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.03em', color: C.accent, margin: '14px 0' }}>Rp 0</motion.div>
                <div style={{ fontSize: 12.5, color: '#94a3b8' }}>Bayar hanya saat jamaah berangkat</div>
              </motion.div>
            </Reveal>
          </div>
        </div>
      </section>


      {/* ══════════ PAIN POINTS ══════════ */}
      <section className="lp-section" style={{ background: C.soft, padding: '56px 0' }}>
        <div className="lp-inner" style={{ maxWidth: 1180, margin: '0 auto', padding: '0 24px' }}>
          <Reveal delay={0}><Eyebrow>Masalah Anda Hari Ini</Eyebrow></Reveal>
          <Reveal delay={0.08}>
            <h2 className="lp-h2" style={{ textAlign: 'center', fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 800, lineHeight: 1.12, letterSpacing: '-0.02em', maxWidth: 700, margin: '0 auto 10px' }}>
              Kenali masalahnya. Rasakan bedanya.
            </h2>
          </Reveal>
          <Reveal delay={0.14}>
            <p style={{ textAlign: 'center', color: C.muted, maxWidth: 520, margin: '0 auto 28px', fontSize: 14 }}>
              Setiap travel pernah mengalaminya. Bedanya, sekarang ada solusinya.
            </p>
          </Reveal>

          <div className="lp-pain-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginTop: 10 }}>
            {[
              {
                title: '"Jadwal hari ini apa, Pak?"',
                desc: 'Pertanyaan sama, dijawab berulang sepanjang hari.',
                icon: (
                  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                  </svg>
                ),
              },
              {
                title: 'Muthowif kelelahan',
                desc: 'Energi habis untuk hal teknis, bukan membimbing.',
                icon: (
                  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                ),
              },
              {
                title: 'Buku doa cetak percuma',
                desc: 'Mahal dicetak, sering hilang, jarang dibaca.',
                icon: (
                  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                  </svg>
                ),
              },
              {
                title: 'Info tenggelam di grup WA',
                desc: 'Pengumuman penting tertimbun ratusan chat.',
                icon: (
                  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 11l18-5v12L3 14v-3z"/>
                    <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>
                  </svg>
                ),
              },
              {
                title: 'Semua serba manual',
                desc: 'Excel, kertas, WA — tak ada sistem terpadu.',
                icon: (
                  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7" rx="1"/>
                    <rect x="14" y="3" width="7" height="7" rx="1"/>
                    <rect x="3" y="14" width="7" height="7" rx="1"/>
                    <rect x="14" y="14" width="7" height="7" rx="1"/>
                  </svg>
                ),
              },
              {
                title: 'Travel lain lebih maju',
                desc: 'Mereka punya aplikasi sendiri, terlihat profesional.',
                icon: (
                  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="5" y="2" width="14" height="20" rx="2"/>
                    <line x1="12" y1="18" x2="12" y2="18"/>
                  </svg>
                ),
              },
            ].map((p, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <motion.div whileHover={{ y: -3, transition: { duration: 0.2 } }} style={{ background: C.bg, borderRadius: 14, padding: 16, border: `1px solid ${C.line}`, display: 'flex', gap: 12, alignItems: 'flex-start', height: '100%' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: C.soft, color: C.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ width: 19, height: 19, display: 'block' }}>{p.icon}</span>
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 3, lineHeight: 1.25 }}>{p.title}</h3>
                    <p style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.45 }}>{p.desc}</p>
                  </div>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════ FEATURES ══════════ */}
      <section id="fitur" className="lp-section" style={{ padding: '56px 0' }}>
        <div className="lp-inner" style={{ maxWidth: 1180, margin: '0 auto', padding: '0 24px' }}>
          <Reveal delay={0}><Eyebrow>Fitur Lengkap</Eyebrow></Reveal>
          <Reveal delay={0.08}>
            <h2 className="lp-h2" style={{ textAlign: 'center', fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 800, lineHeight: 1.12, letterSpacing: '-0.02em', maxWidth: 700, margin: '0 auto 10px' }}>
              Semua yang jamaah butuhkan. Sudah termasuk.
            </h2>
          </Reveal>
          <Reveal delay={0.14}>
            <p style={{ textAlign: 'center', color: C.muted, maxWidth: 520, margin: '0 auto 28px', fontSize: 14 }}>
              12 fitur lengkap, aktif begitu Anda daftar. Tanpa biaya tambahan, tanpa tim IT.
            </p>
          </Reveal>

          <div className="lp-feat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
            {features.map((f, i) => (
              <Reveal key={i} delay={i * 0.03} className={i < 2 ? 'lp-feat-featured' : ''}>
                <div className="lp-feat-card">
                  <div className="lp-feat-icon" style={{ width: 40, height: 40, borderRadius: 10, background: C.accent, color: C.greenDark, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{f.icon}</svg>
                  </div>
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
          <Reveal delay={0}><Eyebrow>Cara Kerja</Eyebrow></Reveal>
          <Reveal delay={0.08}>
            <h2 className="lp-h2" style={{ textAlign: 'center', fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 800, lineHeight: 1.12, letterSpacing: '-0.02em', maxWidth: 700, margin: '0 auto 10px' }}>
              Dari daftar sampai jalan, cuma 3 langkah
            </h2>
          </Reveal>
          <Reveal delay={0.14}>
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
                <motion.div whileHover={{ y: -4, transition: { duration: 0.2 } }} style={{ background: '#fff', borderRadius: 12, padding: 20, border: `1px solid ${C.line}` }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: C.ink, color: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800, marginBottom: 14 }}>{i + 1}</div>
                  <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 5 }}>{s.title}</h3>
                  <p style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.55 }}>{s.desc}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════ WHITE-LABEL SHOWCASE ══════════ */}
      <section className="lp-section" style={{ padding: '56px 0' }}>
        <div className="lp-inner" style={{ maxWidth: 1180, margin: '0 auto', padding: '0 24px' }}>
          <div className="lp-wl" style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
            <Reveal>
              <div>
                <Eyebrow>White-Label</Eyebrow>
                <h2 style={{ fontSize: 'clamp(24px, 3.2vw, 34px)', fontWeight: 800, lineHeight: 1.12, letterSpacing: '-0.02em', marginBottom: 14 }}>
                  Jamaah lihat nama Anda. Bukan kami.
                </h2>
                <p style={{ color: C.muted, fontSize: 14, marginBottom: 18, lineHeight: 1.7 }}>
                  Logo, warna, dan nama travel Anda di setiap halaman. Tanpa jejak pihak ketiga. Yang jamaah ingat dan rekomendasikan: travel Anda.
                </p>
                <ul className="lp-wl-list" style={{ listStyle: 'none', display: 'inline-block', textAlign: 'left', margin: '0 auto' }}>
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
                <div style={{ marginTop: 28, display: 'flex', justifyContent: 'center' }}>
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
          <Reveal delay={0}><Eyebrow>Harga</Eyebrow></Reveal>
          <Reveal delay={0.08}>
            <h2 className="lp-h2" style={{ textAlign: 'center', fontSize: 'clamp(24px, 3.5vw, 36px)', fontWeight: 800, lineHeight: 1.12, letterSpacing: '-0.02em', maxWidth: 700, margin: '0 auto 10px' }}>
              Harga yang bikin Anda untung sejak hari pertama.
            </h2>
          </Reveal>
          <Reveal delay={0.14}>
            <p style={{ textAlign: 'center', color: C.muted, maxWidth: 520, margin: '0 auto 28px', fontSize: 14 }}>
              Mulai gratis dengan 5 jamaah pertama. Tidak perlu kartu kredit, tidak perlu kontrak — cukup daftar dan rasakan langsung.
            </p>
          </Reveal>

          <div className="lp-price-wrap" style={{ display: 'grid', gridTemplateColumns: '1.1fr .9fr', gap: 20, alignItems: 'stretch' }}>
            <Reveal>
              <motion.div whileHover={{ y: -3, transition: { duration: 0.2 } }} className="lp-price-card" style={{ background: C.ink, color: '#fff', borderRadius: 18, padding: 28, position: 'relative', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ position: 'absolute', top: 22, right: -34, background: C.accent, color: C.greenDark, fontWeight: 800, fontSize: 11, padding: '5px 44px', transform: 'rotate(45deg)' }}>POPULER</div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 5 }}>Harga Per Jamaah</h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, margin: '10px 0 2px' }}>
                  <span className="lp-price-num" style={{ fontSize: 48, fontWeight: 800, lineHeight: 1, color: C.accent }}>10</span>
                  <span style={{ fontSize: 15, color: 'rgba(255,255,255,.8)' }}>SAR saja / jamaah</span>
                </div>
                <p style={{ color: 'rgba(255,255,255,.55)', fontSize: 12, fontStyle: 'italic', marginBottom: 18 }}>
                  Balik modal hanya dari hemat biaya cetak buku doa.
                </p>
                <p style={{ color: 'rgba(255,255,255,.7)', fontSize: 13, marginBottom: 20 }}>Mulai dengan 5 jamaah pertama secara gratis. Rasakan sendiri sebelum memutuskan — tanpa risiko, tanpa komitmen.</p>
                <ul style={{ listStyle: 'none', flex: 1 }}>
                  {['Lebih murah dari biaya cetak buku doa — langsung balik modal', 'Tanpa biaya setup, tanpa langganan bulanan, tanpa kontrak', 'Bayar hanya untuk jamaah yang benar-benar berangkat', '12 fitur premium aktif penuh — tanpa biaya tersembunyi', 'Aplikasi bermerek travel Anda — perkuat brand di mata jamaah', 'Tingkatkan kepuasan jamaah & dorong referral keberangkatan berikutnya', 'Pendampingan & support langsung via WhatsApp'].map(t => (
                    <li key={t} style={{ display: 'flex', gap: 9, alignItems: 'center', marginBottom: 9, fontSize: 13 }}>
                      <span style={{ width: 19, height: 19, borderRadius: '50%', background: C.accent, color: C.greenDark, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, flexShrink: 0 }}>✓</span>
                      {t}
                    </li>
                  ))}
                </ul>
                <p style={{ fontSize: 12.5, color: C.accent, fontWeight: 600, marginBottom: 12, textAlign: 'center', marginTop: 20 }}>
                  Coba gratis untuk 5 jamaah pertama Anda — tanpa syarat.
                </p>
                <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="lp-btn lp-btn-accent" style={{ width: '100%', justifyContent: 'center' }}>
                  Mulai Gratis — 5 Jamaah Pertama <span className="lp-arrow">→</span>
                </a>
              </motion.div>
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
          <Reveal delay={0}><Eyebrow>FAQ</Eyebrow></Reveal>
          <Reveal delay={0.08}>
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
                Daftar sekarang dan dapatkan 5 jamaah pertama secara gratis. Kami setup aplikasi dengan nama dan logo travel Anda — tanpa biaya, tanpa komitmen.
              </p>
              <div className="lp-cta-btns" style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', position: 'relative' }}>
                <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="lp-btn lp-btn-accent">
                  Klaim 5 Jamaah Gratis via WhatsApp <span className="lp-arrow">→</span>
                </a>
                <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="lp-btn lp-btn-ghost">
                  Lihat Cara Kerjanya
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>


      {/* ══════════ FOOTER ══════════ */}
      <footer style={{ background: C.ink, color: '#fff', padding: '64px 24px 32px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -80, left: '50%', transform: 'translateX(-50%)', width: 600, height: 300, background: `radial-gradient(ellipse at center, ${C.primary}22 0%, transparent 70%)`, pointerEvents: 'none' }} />

        <div style={{ maxWidth: 960, margin: '0 auto', position: 'relative' }}>

          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase' as const, color: C.accent, marginBottom: 14, fontFamily: F }}>
              Siap memulai?
            </p>
            <h2 style={{ fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: 800, lineHeight: 1.08, letterSpacing: '-0.02em', color: '#fff', margin: '0 auto 20px', maxWidth: 640, fontFamily: F }}>
              5 jamaah pertama Anda,<br />gratis tanpa syarat.
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.6)', marginBottom: 28, fontFamily: F }}>
              Setup dalam menit. Bermerek nama travel Anda. Tanpa komitmen.
            </p>
            <a
              href={WA_LINK}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: C.accent, color: C.greenDark, padding: '14px 28px', borderRadius: 999, fontSize: 15, fontWeight: 700, textDecoration: 'none', fontFamily: F, transition: 'opacity .2s' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              Klaim via WhatsApp
              <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 24, height: 24, borderRadius: '50%', background: 'rgba(0,0,0,0.15)', fontSize: 13 }}>→</span>
            </a>
          </div>

          <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '0 0 28px' }} />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: C.greenDark, fontFamily: F, flexShrink: 0 }}>U</div>
              <span style={{ fontWeight: 700, fontSize: 15, fontFamily: F }}>Umrahme</span>
            </div>
            <nav style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
              {[
                ['#fitur', 'Fitur'],
                ['#harga', 'Harga'],
                ['#cara', 'Cara Kerja'],
                ['#kontak', 'Kontak'],
                [WA_LINK, 'WhatsApp'],
              ].map(([href, label]) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontFamily: F, transition: 'color .2s' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
                >
                  {label}
                </a>
              ))}
            </nav>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', fontFamily: F }}>
              © {new Date().getFullYear()} Umrahme
            </span>
          </div>

        </div>
      </footer>
    </div>
  );
}
