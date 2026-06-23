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
      textTransform: 'uppercase' as const, color: C.muted, marginBottom: 16,
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
      <div style={{ display: 'flex', gap: 60, width: 'max-content', animation: 'lpScroll 28s linear infinite' }}>
        {items.map((p, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 9, color: '#9aa6b2', fontWeight: 700, fontSize: 17, whiteSpace: 'nowrap' as const, opacity: 0.8, fontFamily: F }}>
            <div style={{ width: 22, height: 22, borderRadius: 6, background: '#d7dde4', flexShrink: 0 }} />
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
    <div style={{ border: `1px solid ${C.line}`, borderRadius: 16, marginBottom: 12, overflow: 'hidden', background: '#fff' }}>
      <button
        onClick={() => setOpen(p => !p)}
        style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', padding: '20px 22px', fontSize: 16, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, color: C.ink, fontFamily: F }}
      >
        {q}
        <span style={{
          flexShrink: 0, width: 26, height: 26, borderRadius: '50%',
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
            <p style={{ padding: '0 22px 20px', color: C.muted, fontSize: 15, lineHeight: 1.75, fontFamily: F }}>{a}</p>
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
    { icon: '📖', num: '01', title: '55+ Doa Lengkap', desc: 'Arab, latin, terjemahan — semua ada. Jamaah buka HP, langsung ikuti saat muthowif menjelaskan. Tidak perlu cetak buku lagi.' },
    { icon: '🔢', num: '02', title: "Counter Tawaf & Sa'i", desc: 'Hitung putaran otomatis, doa muncul sendiri di tiap putaran. Jamaah fokus ibadah, bukan sibuk hitung.' },
    { icon: '🕋', num: '03', title: 'Panduan Ibadah', desc: 'Panduan step-by-step yang bisa dipelajari jamaah sebelum berangkat. Mereka tiba di tanah suci sudah siap.' },
    { icon: '🗺️', num: '04', title: 'Peta & Lokasi Bersejarah', desc: '10 lokasi ziarah lengkap dengan sejarah, tokoh, dalil, dan link Google Maps. Jamaah tidak perlu bertanya arah.' },
    { icon: '🕌', num: '05', title: 'Jadwal Sholat Real-time', desc: 'Waktu sholat otomatis sesuai lokasi — Makkah, Madinah, atau di perjalanan. Tidak ada alasan terlewat.' },
    { icon: '📢', num: '06', title: 'Pengumuman Travel', desc: 'Kirim pengumuman dari portal travel — muncul langsung di HP semua jamaah. Lebih cepat dan pasti terbaca.' },
    { icon: '🗓️', num: '07', title: 'Agenda Harian', desc: 'Isi agenda sekali di portal, jamaah lihat jadwal hari ini otomatis. Tidak ada lagi pertanyaan "hari ini kita ke mana?".' },
    { icon: '🪪', num: '08', title: 'Kartu Jamaah Digital', desc: 'Nama, rombongan, hotel, nomor pembimbing — semua dalam satu kartu digital. Berguna saat jamaah terpisah atau darurat.' },
    { icon: '📔', num: '09', title: 'Jurnal Perjalanan', desc: 'Jamaah catat momen perjalanan suci mereka. Kenangan ibadah tersimpan rapi, bisa dibaca ulang kapan saja.' },
    { icon: '🎖️', num: '10', title: 'Sertifikat Umrah Digital', desc: 'Sertifikat digital bermerek travel Anda — jamaah bisa simpan dan bagikan. Kenang-kenangan yang juga promosi.' },
    { icon: '🎨', num: '11', title: 'White-Label Penuh', desc: 'Logo Anda, warna Anda, nama Anda. Jamaah tidak tahu ini Umrahme — yang mereka tahu ini aplikasi travel Anda.' },
    { icon: '📊', num: '12', title: 'Portal Travel Agency', desc: 'Satu dashboard untuk semua: kelola data jamaah, atur agenda, kirim pengumuman. Semua terkontrol dari satu tempat.' },
  ];

  const testimonials = [
    { name: 'H. Ridwan Effendi', travel: 'PT. Barokah Safar Abadi', init: 'RE', text: 'Dulu muthowif kami kelelahan sebelum tawaf dimulai — menjawab pertanyaan yang itu-itu saja. Sekarang jamaah sudah tahu sendiri dari aplikasi. Perjalanan jauh lebih tenang.' },
    { name: 'Ibu Siti Nurhaliza', travel: 'Yayasan Al-Haramain Tour', init: 'SN', text: 'Kami khawatir jamaah lansia tidak bisa pakai. Ternyata mereka langsung bisa — cukup buka link, masukkan nama. Tidak ada yang komplain kesulitan.' },
    { name: 'Ust. Farid Amanullah', travel: 'CV. Bintang Madinah Travel', init: 'FA', text: 'Kami biasa cetak buku doa 20 SAR per jamaah. Dengan Umrahme 10 SAR, dapat jauh lebih banyak — dan jamaah benar-benar pakai. Keputusan terbaik musim ini.' },
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
          padding: 12px 24px; border-radius: 32px;
          font-weight: 600; font-size: 15px; cursor: pointer;
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
          background: #fff; border: 1px solid ${C.line}; border-radius: 24px; padding: 28px;
          transition: transform .25s ease, box-shadow .25s ease; height: 100%;
          box-shadow: 0px 4px 12px rgba(0,0,0,0.04);
        }
        .lp-feat-card:hover { transform: translateY(-4px); box-shadow: 0px 8px 24px rgba(0,0,0,0.08); }

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
          .lp-nav-logo { cursor: pointer; user-select: none; }
          .lp-mobile-dropdown { display: block; }
          .lp-nav-logo-circle { transition: transform .2s ease, box-shadow .2s ease; }
          .lp-nav-logo-circle.open {
            transform: scale(1.08);
            box-shadow: 0 0 0 3px rgba(255,255,255,0.25);
          }

          /* ── MOBILE SCROLL: ganti full navbar bg jadi floating glass pill ── */
          .lp-nav-scrolled {
            background: transparent !important;
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
            box-shadow: none !important;
          }
          .lp-nav-scrolled .lp-nav-logo {
            background: rgba(12, 12, 18, 0.62);
            backdrop-filter: blur(22px) saturate(1.6);
            -webkit-backdrop-filter: blur(22px) saturate(1.6);
            border: 1px solid rgba(255, 255, 255, 0.22);
            border-radius: 20px;
            padding: 8px 18px 8px 10px;
            box-shadow:
              0 6px 28px rgba(0, 0, 0, 0.28),
              inset 0 1px 0 rgba(255, 255, 255, 0.10);
            transition: background .3s ease, border-color .3s ease, box-shadow .3s ease;
          }
          /* logo text & icon tetap putih di dalam pill */
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
          /* ── GLOBAL ── */
          body, #root { overflow-x: hidden; }

          /* ── GRIDS ── */
          .lp-feat-grid { grid-template-columns: 1fr 1fr !important; gap: 10px !important; }
          .lp-bento { grid-template-columns: 1fr !important; gap: 10px !important; }
          .lp-pain-grid { grid-template-columns: 1fr 1fr !important; gap: 10px !important; }
          .lp-testi-grid { grid-template-columns: 1fr !important; gap: 10px !important; }
          .lp-foot-top { grid-template-columns: 1fr !important; gap: 24px !important; }
          .lp-steps { gap: 10px !important; }
          .lp-price-wrap { grid-template-columns: 1fr !important; }

          /* ── HERO ── */
          .lp-hero-padding { padding-top: 76px !important; }

          /* ── FLOATING CARDS: 1 row 4 kolom ── */
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
            border-radius: 12px !important;
            padding: 10px 9px !important;
          }
          /* sembunyikan teks sekunder biar konten muat di kolom sempit */
          .lp-float-wrap > div > div > div:last-child { display: none !important; }
          /* kecilkan angka besar (font-size: 30px di inline style) */
          .lp-float-wrap > div > div > div[style*="font-size: 30px"],
          .lp-float-wrap > div > div > div[style*="fontSize: 30"] { font-size: 18px !important; margin: 3px 0 !important; }
          /* label header kecil */
          .lp-float-wrap > div > div > div[style*="font-size: 11px"] { font-size: 10px !important; }
          .lp-float-wrap > div > div > div[style*="font-size: 15px"] { font-size: 12px !important; }
          /* span badge tawaf */
          .lp-float-wrap > div > div > span { font-size: 9px !important; padding: 2px 6px !important; }
          /* icon di card panduan */
          .lp-float-wrap > div > div > div[style*="width: 40px"] { width: 28px !important; height: 28px !important; font-size: 14px !important; margin-bottom: 6px !important; }
          .lp-float-card-mid { display: none !important; }

          /* ── HERO CTA BUTTONS: stack vertikal ── */
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

          /* ── HERO SOCIAL PROOF ── */
          .lp-hero-social {
            flex-direction: column !important;
            gap: 4px !important;
            font-size: 12px !important;
          }

          /* ── SECTION PADDING ── */
          .lp-section { padding-top: 48px !important; padding-bottom: 48px !important; }
          .lp-section-sm { padding-top: 32px !important; padding-bottom: 32px !important; }

          /* ── TYPOGRAPHY ── */
          .lp-h2 { line-height: 1.18 !important; margin-bottom: 28px !important; }

          /* ── FEAT CARDS ── */
          .lp-feat-card { padding: 18px !important; border-radius: 16px !important; }
          .lp-feat-card h3 { font-size: 15px !important; margin-bottom: 5px !important; }
          .lp-feat-card p { font-size: 12.5px !important; }
          .lp-feat-card > div:first-child { width: 38px !important; height: 38px !important; font-size: 18px !important; margin-bottom: 10px !important; }

          /* ── BENTO CARDS ── */
          .lp-bento > div > div { min-height: unset !important; padding: 20px !important; border-radius: 16px !important; }
          .lp-bento-right { display: grid !important; grid-template-columns: 1fr 1fr !important; gap: 10px !important; }

          /* ── PAIN CARDS ── */
          .lp-pain-grid > div > div { padding: 18px !important; border-radius: 16px !important; }

          /* ── WHITE-LABEL PHONES ── */
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
          .lp-wl-phones > div > div { height: 320px !important; }

          /* ── PRICING ── */
          .lp-price-card { padding: 26px 22px !important; border-radius: 20px !important; }
          .lp-price-num { font-size: 54px !important; line-height: 1 !important; }
          .lp-calc-hide { display: none !important; }

          /* ── TESTIMONIALS ── */
          .lp-testi-grid > div > div { padding: 20px !important; border-radius: 16px !important; }

          /* ── STEPS ── */
          .lp-steps > div > div { padding: 22px 20px !important; border-radius: 16px !important; }
          .lp-steps > div > div h3 { font-size: 17px !important; }

          /* ── CTA BOX ── */
          .lp-cta-box { padding: 32px 22px !important; border-radius: 20px !important; }
          .lp-cta-box h2 { font-size: 24px !important; margin-bottom: 12px !important; }
          .lp-cta-box p { font-size: 14px !important; margin-bottom: 20px !important; }
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

          /* ── FOOTER ── */
          .lp-foot-links {
            display: grid !important;
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 16px !important;
          }

          /* ── MARQUEE ── */
          .lp-marquee-wrap { padding-top: 52px !important; padding-bottom: 36px !important; }

          /* ── FAQ ── */
          .lp-faq-q { font-size: 14px !important; padding: 16px 18px !important; }
          .lp-faq-a { font-size: 13.5px !important; padding: 0 18px 16px !important; }

          /* ── WL CHECKLIST ── */
          .lp-wl-list li { font-size: 13.5px !important; margin-bottom: 10px !important; }
          .lp-wl-cta { font-size: 13px !important; padding: 12px 18px !important; }

          /* ── INNER PADDING ── */
          .lp-inner { padding-left: 18px !important; padding-right: 18px !important; }
        }

        @media (max-width: 480px) {
          .lp-feat-grid { grid-template-columns: 1fr !important; }
          .lp-pain-grid { grid-template-columns: 1fr !important; }
          .lp-bento-right { grid-template-columns: 1fr !important; }
          .lp-float-wrap { grid-template-columns: repeat(4, 1fr) !important; gap: 5px !important; padding: 0 8px !important; }
          .lp-float-wrap > div > div { padding: 8px 7px !important; border-radius: 10px !important; }
          .lp-wl-phones > div { max-width: 150px !important; }
          .lp-wl-phones > div > div { height: 280px !important; }
          .lp-foot-links { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      {/* ══════════ NAVBAR ══════════ */}
      <header className={`lp-nav${scrolled ? ' lp-nav-scrolled' : ''}`}>
        <div className="lp-nav-inner">
          {/* Logo — desktop: link to top | mobile: toggle menu */}
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

          {/* Desktop nav links */}
          <nav className="lp-nav-links">
            {[['#fitur', 'Fitur'], ['#harga', 'Harga'], ['#cara', 'Cara Kerja'], ['#kontak', 'Kontak']].map(([h, l]) => (
              <a key={h} href={h} className="lp-nav-link">{l}</a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="lp-nav-right">
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="lp-nav-cta-btn">
              Daftar Sekarang →
            </a>
          </div>
        </div>
      </header>

      {/* ══════════ MOBILE DROPDOWN (logo-tap) ══════════ */}
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
        padding: '150px 0 0',
      }}>
        {/* hero photo */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          backgroundImage: 'url(/hero-bg.avif)',
          backgroundSize: 'cover', backgroundPosition: 'center center',
        }} />
        {/* dark scrim so headline stays legible */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'rgba(0,0,0,0.18)',
        }} />

        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 2, textAlign: 'center' }}>

          <motion.h1
            initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontSize: 'clamp(38px, 6vw, 74px)', fontWeight: 800, lineHeight: 1.05, color: '#fff', letterSpacing: '-0.02em', maxWidth: 900, margin: '0 auto 22px', textShadow: '0 2px 24px rgba(0,0,0,0.5), 0 1px 4px rgba(0,0,0,0.4)' }}
          >
            Aplikasi Umrah{' '}
            <span style={{ color: C.accent, fontStyle: 'italic' }}>Bermerek Travel Anda</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.65 }}
            style={{ color: 'rgba(255,255,255,.88)', fontSize: 'clamp(15px, 2vw, 17px)', maxWidth: 580, margin: '0 auto 30px', fontWeight: 400, textShadow: '0 1px 12px rgba(0,0,0,0.5)', lineHeight: 1.7 }}
          >
            Buku doa cetak Anda habis 15–25 SAR per jamaah — dan sering tidak dibaca. Umrahme menggantikannya seharga <strong>10 SAR</strong>, lengkap dengan panduan ibadah, jadwal, dan komunikasi travel. Semua bermerek nama travel Anda.
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
            style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', color: '#fff', fontSize: 14, fontWeight: 600 }}
          >
            <div style={{ display: 'flex' }}>
              {[0, 1, 2, 3].map(i => <span key={i} style={{ width: 28, height: 28, borderRadius: '50%', border: '2px solid #fff', marginLeft: i > 0 ? -8 : 0, background: C.accent, display: 'inline-block' }} />)}
            </div>
            <span style={{ color: C.accent, letterSpacing: 2 }}>★★★★★</span>
            <span>Lebih hemat dari buku doa cetak. Lebih profesional dari grup WhatsApp.</span>
          </motion.div>
        </div>

        {/* floating cards */}
        <div className="lp-float-wrap" style={{ position: 'relative', zIndex: 3, marginTop: 50, marginBottom: -90, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 14, perspective: 1400, minHeight: 220, padding: '0 24px' }}>
          {[
            { delay: 0 },
            { delay: 0.6 },
            { delay: 1.1 },
            { delay: 0.3 },
            { delay: 0.9 },
          ].map((_, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 + i * 0.1, duration: 0.7 }}
              className={i === 2 ? 'lp-float-card-mid' : ''}
              style={{ animation: `lpFloat 5s ease-in-out ${_.delay}s infinite`, flexShrink: 0 }}
            >
              {i === 0 && (
                <div style={{ background: '#fff', borderRadius: 16, padding: 16, boxShadow: '0 18px 50px -20px rgba(15,23,42,.25)', width: 150 }}>
                  <span style={{ display: 'inline-block', fontSize: 10, padding: '3px 8px', borderRadius: 999, background: C.soft, color: C.muted, fontWeight: 600 }}>Tawaf</span>
                  <div style={{ fontSize: 30, fontWeight: 800, margin: '6px 0' }}>4 / 7</div>
                  <div style={{ fontSize: 11, color: C.muted }}>Jamaah tidak salah hitung</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: C.muted, marginTop: 8 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: C.accentDark, display: 'inline-block' }} /> Doa per putaran otomatis
                  </div>
                </div>
              )}
              {i === 1 && (
                <div style={{ background: '#fff', borderRadius: 16, padding: 16, boxShadow: '0 18px 50px -20px rgba(15,23,42,.25)', width: 168 }}>
                  <div style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>Buku Doa Digital</div>
                  <div style={{ fontSize: 30, fontWeight: 800, margin: '6px 0' }}>55+</div>
                  <div style={{ fontSize: 11, color: C.muted }}>Doa · 9 kategori</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: C.muted, marginTop: 8 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: C.accentDark, display: 'inline-block' }} /> Gratis cetak. Tidak hilang.
                  </div>
                </div>
              )}
              {i === 2 && (
                <div style={{ background: `linear-gradient(160deg, ${C.blue2}, ${C.blue1})`, color: '#fff', borderRadius: 16, padding: '26px 16px', boxShadow: '0 18px 50px -20px rgba(15,23,42,.25)', width: 150, textAlign: 'center' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', fontSize: 20 }}>🕋</div>
                  <div style={{ fontWeight: 800, fontSize: 15 }}>Panduan Ibadah</div>
                  <div style={{ fontSize: 11, opacity: 0.85, marginTop: 4 }}>Step by step</div>
                </div>
              )}
              {i === 3 && (
                <div style={{ background: C.ink, color: '#fff', borderRadius: 16, padding: 16, boxShadow: '0 18px 50px -20px rgba(15,23,42,.25)', width: 150 }}>
                  <div style={{ fontSize: 11, color: '#cbd5e1', fontWeight: 600 }}>Pengumuman</div>
                  <div style={{ fontSize: 30, fontWeight: 800, margin: '6px 0', color: C.accent }}>Instan</div>
                  <div style={{ fontSize: 11, color: '#cbd5e1' }}>Semua jamaah langsung terima</div>
                </div>
              )}
              {i === 4 && (
                <div style={{ background: C.accent, color: C.greenDark, borderRadius: 16, padding: 16, boxShadow: '0 18px 50px -20px rgba(15,23,42,.25)', width: 140 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: C.greenDark }}>Jadwal Sholat</div>
                  <div style={{ fontSize: 30, fontWeight: 800, margin: '6px 0' }}>05:12</div>
                  <div style={{ fontSize: 11, color: C.greenDark }}>Otomatis · Akurat</div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════ PARTNERS MARQUEE ══════════ */}
      <div className="lp-marquee-wrap lp-section-sm" style={{ padding: '90px 0 50px', borderBottom: `1px solid ${C.line}`, overflow: 'hidden' }}>
        <p style={{ textAlign: 'center', color: C.muted, fontSize: 13, fontWeight: 600, marginBottom: 26 }}>
          BERGABUNGLAH BERSAMA TRAVEL UMRAH YANG LEBIH MODERN
        </p>
        <MarqueeStrip />
      </div>

      {/* ══════════ ABOUT / BENTO ══════════ */}
      <section className="lp-section" style={{ padding: '90px 0' }}>
        <div className="lp-inner" style={{ maxWidth: 1180, margin: '0 auto', padding: '0 24px' }}>
          <Reveal><Eyebrow>Tentang Umrahme</Eyebrow></Reveal>
          <Reveal>
            <h2 style={{ textAlign: 'center', fontSize: 'clamp(28px, 4.5vw, 46px)', fontWeight: 800, lineHeight: 1.12, letterSpacing: '-0.02em', maxWidth: 760, margin: '0 auto 40px' }}>
              Satu keputusan. Jamaah lebih tenang. Travel lebih profesional.
            </h2>
          </Reveal>

          <div className="lp-bento" style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr 1fr', gap: 18 }}>
            <Reveal>
              <div style={{ borderRadius: 20, padding: 26, boxShadow: '0 8px 24px -12px rgba(15,23,42,.2)', background: `linear-gradient(165deg, ${C.blue2}, ${C.blue1})`, color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 280, position: 'relative', overflow: 'hidden' }}>
                <div style={{ fontWeight: 700, fontSize: 20 }}>Bermerek Travel Anda</div>
                <div style={{ background: '#fff', color: C.ink, borderRadius: 14, padding: '16px 18px' }}>
                  <div style={{ fontSize: 38, fontWeight: 800 }}>100%</div>
                  <div style={{ fontSize: 13, color: C.muted }}>Bermerek travel Anda — jamaah tidak tahu ada pihak ketiga</div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.05}>
              <div style={{ borderRadius: 20, padding: 26, boxShadow: '0 8px 24px -12px rgba(15,23,42,.2)', background: '#fff', border: `1px solid ${C.line}`, minHeight: 280 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.muted }}>Harga per jamaah</div>
                <div style={{ fontSize: 44, fontWeight: 800, margin: '8px 0' }}>10 SAR</div>
                <p style={{ fontSize: 14, color: C.muted, marginTop: 14, borderTop: `1px solid ${C.line}`, paddingTop: 14, lineHeight: 1.6 }}>
                  "Pertanyaan jamaah berkurang drastis. Muthowif bisa fokus membimbing, bukan menjelaskan hal yang sama berulang kali."
                </p>
              </div>
            </Reveal>

            <div className="lp-bento-right" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              <Reveal delay={0.08}>
                <div style={{ borderRadius: 20, padding: 26, boxShadow: '0 8px 24px -12px rgba(15,23,42,.2)', background: C.accent, color: C.greenDark }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>Total doa & panduan</div>
                  <div style={{ fontSize: 38, fontWeight: 800, margin: '4px 0' }}>55+</div>
                  <div style={{ fontSize: 13, marginTop: 6 }}>Doa lengkap siap pakai — jamaah tidak perlu buku cetak lagi.</div>
                </div>
              </Reveal>
              <Reveal delay={0.11}>
                <div style={{ borderRadius: 20, padding: 26, boxShadow: '0 8px 24px -12px rgba(15,23,42,.2)', background: C.ink, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: 13, color: '#cbd5e1' }}>Biaya setup &</div>
                    <div style={{ fontSize: 14, color: '#cbd5e1' }}>langganan bulanan</div>
                  </div>
                  <div style={{ fontSize: 40, fontWeight: 800, color: C.accent }}>Rp 0</div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ PAIN POINTS ══════════ */}
      <section className="lp-section" style={{ background: C.soft, padding: '90px 0' }}>
        <div className="lp-inner" style={{ maxWidth: 1180, margin: '0 auto', padding: '0 24px' }}>
          <Reveal><Eyebrow>Masalah Anda Hari Ini</Eyebrow></Reveal>
          <Reveal><h2 style={{ textAlign: 'center', fontSize: 'clamp(28px, 4.5vw, 46px)', fontWeight: 800, lineHeight: 1.12, letterSpacing: '-0.02em', maxWidth: 760, margin: '0 auto 16px' }}>Masih begini setiap keberangkatan?</h2></Reveal>
          <Reveal><p style={{ textAlign: 'center', color: C.muted, maxWidth: 560, margin: '0 auto 40px', fontSize: 16 }}>Jika iya, Anda tidak sendirian. Dan ada cara yang lebih baik.</p></Reveal>

          <div className="lp-pain-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18, marginTop: 10 }}>
            {[
              { icon: '😕', title: '"Jadwal hari ini apa, Pak?"', desc: 'Pertanyaan yang sama dijawab berkali-kali. Oleh muthowif. Oleh tour leader. Oleh siapa saja yang bisa ditanya.' },
              { icon: '🔁', title: 'Muthowif lelah sebelum ibadah dimulai', desc: 'Energi terkuras untuk hal-hal teknis — padahal tugas utama muthowif adalah membimbing ibadah, bukan menjawab WhatsApp.' },
              { icon: '📕', title: 'Buku doa cetak mahal dan percuma', desc: '15–25 SAR per eksemplar. Tertinggal di hotel. Rusak kehujanan. Atau tidak pernah dibuka sama sekali.' },
              { icon: '📢', title: 'Info penting tenggelam di grup WA', desc: 'Jadwal berubah mendadak? Pesan penting tertimbun 200 pesan meme dan stiker. Tidak ada yang baca.' },
              { icon: '📱', title: 'Semua dikerjakan manual', desc: 'Data jamaah di Excel. Jadwal di kertas. Pengumuman via WA. Tidak ada satu sistem yang menyatukan semuanya.' },
              { icon: '🏷️', title: 'Travel lain sudah punya aplikasi', desc: 'Calon jamaah membandingkan. Travel yang punya aplikasi sendiri terlihat lebih siap, lebih profesional, lebih dipercaya.' },
            ].map((p, i) => (
              <Reveal key={i} delay={i * 0.05}>
                <div style={{ background: C.bg, borderRadius: 20, padding: 26, border: `1px solid ${C.line}` }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 14, boxShadow: '0 8px 24px -12px rgba(15,23,42,.2)' }}>{p.icon}</div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 6 }}>{p.title}</h3>
                  <p style={{ fontSize: 14, color: C.muted }}>{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ FEATURES ══════════ */}
      <section id="fitur" className="lp-section" style={{ padding: '90px 0' }}>
        <div className="lp-inner" style={{ maxWidth: 1180, margin: '0 auto', padding: '0 24px' }}>
          <Reveal><Eyebrow>Fitur Lengkap</Eyebrow></Reveal>
          <Reveal><h2 style={{ textAlign: 'center', fontSize: 'clamp(28px, 4.5vw, 46px)', fontWeight: 800, lineHeight: 1.12, letterSpacing: '-0.02em', maxWidth: 760, margin: '0 auto 16px' }}>12 fitur siap pakai. Tanpa biaya tambahan.</h2></Reveal>
          <Reveal><p style={{ textAlign: 'center', color: C.muted, maxWidth: 560, margin: '0 auto 40px', fontSize: 16 }}>Semuanya sudah ada dan langsung aktif begitu Anda daftar. Tidak perlu pengembangan, tidak perlu tim IT.</p></Reveal>

          <div className="lp-feat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
            {features.map((f, i) => (
              <Reveal key={i} delay={i * 0.035}>
                <div className="lp-feat-card">
                  <div style={{ width: 46, height: 46, borderRadius: 12, background: C.accent, color: C.greenDark, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 16 }}>{f.icon}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.accentDark, marginBottom: 6 }}>FITUR {f.num}</div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
                  <p style={{ fontSize: 14, color: C.muted }}>{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ HOW IT WORKS ══════════ */}
      <section id="cara" className="lp-section" style={{ background: C.soft, padding: '90px 0' }}>
        <div className="lp-inner" style={{ maxWidth: 1180, margin: '0 auto', padding: '0 24px' }}>
          <Reveal><Eyebrow>Cara Kerja</Eyebrow></Reveal>
          <Reveal><h2 style={{ textAlign: 'center', fontSize: 'clamp(28px, 4.5vw, 46px)', fontWeight: 800, lineHeight: 1.12, letterSpacing: '-0.02em', maxWidth: 760, margin: '0 auto 16px' }}>Aktif dalam hitungan menit</h2></Reveal>
          <Reveal><p style={{ textAlign: 'center', color: C.muted, maxWidth: 560, margin: '0 auto 40px', fontSize: 16 }}>Tidak perlu tim IT. Tidak perlu training panjang. Travel Anda bisa langsung pakai untuk keberangkatan berikutnya.</p></Reveal>

          <div className="lp-steps" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {[
              { title: 'Daftar & Pasang Logo Travel Anda', desc: 'Upload logo, pilih warna brand, masukkan nama travel. Selesai dalam menit — dan aplikasi sudah tampil bermerek travel Anda sepenuhnya.' },
              { title: 'Input Jamaah & Jadwal', desc: 'Masukkan daftar jamaah dan agenda keberangkatan di portal. Otomatis tersinkron — jamaah langsung bisa akses.' },
              { title: 'Bagikan Kode, Jamaah Langsung Pakai', desc: 'Bagikan kode aktivasi ke jamaah — via WA, selebaran, atau saat manasik. Mereka buka browser, masukkan kode, langsung masuk. Tidak perlu install apapun.' },
            ].map((s, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div style={{ background: '#fff', borderRadius: 20, padding: '32px 28px', border: `1px solid ${C.line}` }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: C.ink, color: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800, marginBottom: 18 }}>{i + 1}</div>
                  <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{s.title}</h3>
                  <p style={{ fontSize: 14, color: C.muted }}>{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ WHITE-LABEL SHOWCASE ══════════ */}
      <section className="lp-section" style={{ padding: '90px 0' }}>
        <div className="lp-inner" style={{ maxWidth: 1180, margin: '0 auto', padding: '0 24px' }}>
          <div className="lp-wl" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 50, alignItems: 'center' }}>
            <Reveal>
              <div>
                <Eyebrow align="left">White-Label</Eyebrow>
                <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, lineHeight: 1.12, letterSpacing: '-0.02em', marginBottom: 18 }}>
                  Mereka pikir Anda yang bikin aplikasinya
                </h2>
                <p style={{ color: C.muted, fontSize: 16, marginBottom: 22, lineHeight: 1.7 }}>
                  Logo, warna, dan nama travel Anda tampil di seluruh aplikasi. Tidak ada logo Umrahme, tidak ada branding pihak ketiga. Jamaah menggunakannya setiap hari selama perjalanan — dan nama yang mereka ingat, rekomendasikan, dan kembali pilih adalah nama travel Anda.
                </p>
                <ul style={{ listStyle: 'none' }}>
                  {['Logo & nama travel tampil penuh — jamaah tidak tahu ada pihak ketiga', 'Warna brand Anda di setiap halaman — konsisten dan profesional', 'Travel Anda terlihat sekelas travel besar yang punya app sendiri', 'Semua kustomisasi sudah termasuk — tanpa biaya ekstra'].map((t) => (
                    <li key={t} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 14, fontWeight: 600, fontSize: 15 }}>
                      <span style={{ flexShrink: 0, width: 24, height: 24, borderRadius: '50%', background: C.accent, color: C.greenDark, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800 }}>✓</span>
                      {t}
                    </li>
                  ))}
                </ul>
                <div style={{ marginTop: 28 }}>
                  <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="lp-btn lp-btn-dark">
                    Lihat Demo dengan Nama Travel Anda <span className="lp-arrow" style={{ background: C.accent, color: C.ink }}>→</span>
                  </a>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="lp-wl-phones" style={{ display: 'flex', gap: 18, justifyContent: 'center', flexWrap: 'wrap', overflow: 'hidden', padding: '10px 10px 20px' }}>
                {[
                  { name: 'Barokah Tour', sub: "Assalamu'alaikum, Ahmad 👋", bg: 'linear-gradient(160deg, #15803d, #14532d)', items: ['📖 Buku Doa', '🔢 Counter Tawaf', '🗓️ Agenda Hari Ini', '📢 Pengumuman'], accent: '#dcfce7', tilt: 'rotate(-4deg) translateY(8px)' },
                  { name: 'Mabrur Travel', sub: "Assalamu'alaikum, Siti 👋", bg: 'linear-gradient(160deg, #b45309, #92400e)', items: ['🕌 Jadwal Sholat', '🗺️ Peta Lokasi', '🪪 Kartu Jamaah', '🎖️ Sertifikat'], accent: '#fef3c7', tilt: 'rotate(4deg)' },
                ].map((ph) => (
                  <div key={ph.name} style={{ width: 190, borderRadius: 32, padding: 10, background: C.ink, boxShadow: '0 18px 50px -20px rgba(15,23,42,.4)', transform: ph.tilt, transition: 'transform .3s' }}>
                    <div style={{ borderRadius: 22, overflow: 'hidden', background: '#fff', height: 380, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ padding: '18px 16px', color: '#fff', background: ph.bg }}>
                        <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 4 }}>{ph.name}</div>
                        <div style={{ fontSize: 11, opacity: 0.85 }}>{ph.sub}</div>
                      </div>
                      <div style={{ padding: 14, display: 'grid', gap: 10 }}>
                        {ph.items.map(item => (
                          <div key={item} style={{ background: C.soft, borderRadius: 12, padding: '10px 12px', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ width: 26, height: 26, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', background: ph.accent, fontSize: 14 }}>{item.split(' ')[0]}</span>
                            {item.split(' ').slice(1).join(' ')}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══════════ PRICING ══════════ */}
      <section id="harga" className="lp-section" style={{ background: C.soft, padding: '90px 0' }}>
        <div className="lp-inner" style={{ maxWidth: 1180, margin: '0 auto', padding: '0 24px' }}>
          <Reveal><Eyebrow>Harga</Eyebrow></Reveal>
          <Reveal><h2 style={{ textAlign: 'center', fontSize: 'clamp(28px, 4.5vw, 46px)', fontWeight: 800, lineHeight: 1.12, letterSpacing: '-0.02em', maxWidth: 760, margin: '0 auto 16px' }}>Lebih murah dari buku doa cetak. Jauh lebih lengkap.</h2></Reveal>
          <Reveal><p style={{ textAlign: 'center', color: C.muted, maxWidth: 560, margin: '0 auto 40px', fontSize: 16 }}>Buku doa cetak 15–25 SAR per jamaah — dan itu hanya buku doa. Umrahme 10 SAR, dapat 12 fitur lengkap, bermerek travel Anda.</p></Reveal>

          <div className="lp-price-wrap" style={{ display: 'grid', gridTemplateColumns: '1.1fr .9fr', gap: 24, alignItems: 'stretch' }}>
            <Reveal>
              <div className="lp-price-card" style={{ background: C.ink, color: '#fff', borderRadius: 28, padding: 40, position: 'relative', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ position: 'absolute', top: 24, right: -34, background: C.accent, color: C.greenDark, fontWeight: 800, fontSize: 12, padding: '6px 44px', transform: 'rotate(45deg)' }}>POPULER</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Harga Per Jamaah</h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, margin: '18px 0 6px' }}>
                  <span className="lp-price-num" style={{ fontSize: 64, fontWeight: 800, lineHeight: 1, color: C.accent }}>10</span>
                  <span style={{ fontSize: 16, color: 'rgba(255,255,255,.8)' }}>SAR saja / jamaah</span>
                </div>
                <p style={{ color: 'rgba(255,255,255,.75)', fontSize: 14, marginBottom: 26 }}>Bayar per keberangkatan, sesuai jumlah jamaah aktif. Tidak ada biaya bulanan, tidak ada biaya setup, tidak ada kontrak.</p>
                <ul style={{ listStyle: 'none', flex: 1 }}>
                  {['Tidak ada biaya setup — langsung aktif', 'Tidak ada tagihan bulanan yang mengejutkan', 'Bayar sesuai jamaah yang berangkat saja', 'Semua 12 fitur langsung aktif — tidak ada upgrade berbayar', 'Branding travel Anda penuh — tanpa biaya kustomisasi', 'Support via WhatsApp'].map(t => (
                    <li key={t} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12, fontSize: 14 }}>
                      <span style={{ width: 22, height: 22, borderRadius: '50%', background: C.accent, color: C.greenDark, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, flexShrink: 0 }}>✓</span>
                      {t}
                    </li>
                  ))}
                </ul>
                <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="lp-btn lp-btn-accent" style={{ width: '100%', justifyContent: 'center', marginTop: 26 }}>
                  Mulai Sekarang — Gratis Dulu <span className="lp-arrow">→</span>
                </a>
              </div>
            </Reveal>

            <Reveal delay={0.08} className="lp-calc-hide">
              <div style={{ background: C.bg, border: `1px solid ${C.line}`, borderRadius: 28, padding: 36, display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                <h4 style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>Kalkulator Biaya</h4>
                <p style={{ color: C.muted, fontSize: 14, marginBottom: 20 }}>Estimasi untuk keberangkatan Anda</p>
                {[['Jumlah Jamaah', '40 orang'], ['Harga per Jamaah', '10 SAR'], ['Biaya Setup', 'Rp 0']].map(([l, v]) => (
                  <div key={l} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderBottom: `1px dashed ${C.line}`, fontSize: 15 }}>
                    <span>{l}</span>
                    <span style={{ fontWeight: 600 }}>{v}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 0 0', fontSize: 22, fontWeight: 800 }}>
                  <span>Total</span>
                  <span style={{ color: C.green }}>
                    400 SAR
                    <span style={{ display: 'inline-block', background: C.accent, color: C.greenDark, fontWeight: 800, padding: '2px 10px', borderRadius: 999, fontSize: 13, marginLeft: 10 }}>Hemat 60%</span>
                  </span>
                </div>
                <p style={{ fontSize: 13, color: C.muted, marginTop: 16, lineHeight: 1.6 }}>Coba bayangkan: untuk 40 jamaah, biaya cetak buku doa bisa sampai 1.000 SAR. Dengan Umrahme, 40 jamaah hanya 400 SAR — dan dapat 12 fitur, bukan sekadar buku.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══════════ TESTIMONIALS ══════════ */}
      <section className="lp-section" style={{ padding: '90px 0' }}>
        <div className="lp-inner" style={{ maxWidth: 1180, margin: '0 auto', padding: '0 24px' }}>
          <Reveal><Eyebrow>Testimoni</Eyebrow></Reveal>
          <Reveal><h2 style={{ textAlign: 'center', fontSize: 'clamp(28px, 4.5vw, 46px)', fontWeight: 800, lineHeight: 1.12, letterSpacing: '-0.02em', maxWidth: 760, margin: '0 auto 40px' }}>Dari travel yang sudah merasakan manfaatnya</h2></Reveal>

          <div className="lp-testi-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 18 }}>
            {testimonials.map((t, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div style={{ background: '#fff', border: `1px solid ${C.line}`, borderRadius: 20, padding: 28, height: '100%' }}>
                  <div style={{ color: C.accentDark, marginBottom: 14, letterSpacing: 2, fontSize: 16 }}>★★★★★</div>
                  <p style={{ fontSize: 15, color: C.ink, marginBottom: 20, lineHeight: 1.7 }}>"{t.text}"</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 44, height: 44, borderRadius: '50%', background: C.green, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, flexShrink: 0 }}>{t.init}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{t.name}</div>
                      <div style={{ fontSize: 12, color: C.muted }}>{t.travel}</div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════ FAQ ══════════ */}
      <section className="lp-section" style={{ background: C.soft, padding: '90px 0' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px' }}>
          <Reveal><Eyebrow>FAQ</Eyebrow></Reveal>
          <Reveal><h2 style={{ textAlign: 'center', fontSize: 'clamp(28px, 4vw, 38px)', fontWeight: 800, lineHeight: 1.12, letterSpacing: '-0.02em', margin: '0 auto 40px' }}>Pertanyaan yang Sering Ditanyakan</h2></Reveal>
          <Reveal delay={0.05}>
            {faqs.map((f, i) => <FAQItem key={i} q={f.q} a={f.a} />)}
          </Reveal>
        </div>
      </section>

      {/* ══════════ FINAL CTA ══════════ */}
      <section id="kontak" className="lp-section" style={{ padding: '90px 24px' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <Reveal>
            <div className="lp-cta-box" style={{ background: `linear-gradient(165deg, ${C.primary}, ${C.primaryDark})`, color: '#fff', borderRadius: 32, padding: '64px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', width: 320, height: 320, background: `radial-gradient(circle, rgba(255,255,255,.12), transparent 70%)`, top: -120, right: -80, pointerEvents: 'none' }} />
              <h2 style={{ fontSize: 'clamp(28px, 4.5vw, 44px)', fontWeight: 800, marginBottom: 16, position: 'relative' }}>
                Keberangkatan berikutnya bisa jauh lebih baik
              </h2>
              <p style={{ color: 'rgba(255,255,255,.85)', maxWidth: 520, margin: '0 auto 28px', fontSize: 17, lineHeight: 1.7, position: 'relative' }}>
                Jamaah lebih tenang. Muthowif lebih fokus. Travel Anda tampil lebih profesional. Semua ini hanya 10 SAR per jamaah. Mulai dengan demo gratis — kami setup langsung dengan nama travel Anda.
              </p>
              <div className="lp-cta-btns" style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', position: 'relative' }}>
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
      <footer style={{ padding: '70px 0 36px', borderTop: `1px solid ${C.line}` }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 24px' }}>
          <div className="lp-foot-top" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr', gap: 40, marginBottom: 46 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontWeight: 800, fontSize: 21, color: C.ink, marginBottom: 14, textDecoration: 'none' }}>
                <img src={logoImg} alt="Umrahme" style={{ width: 34, height: 34, objectFit: 'contain', display: 'block', flexShrink: 0 }} />
                Umrahme
              </div>
              <p style={{ color: C.muted, fontSize: 14, maxWidth: 280, lineHeight: 1.7 }}>Ganti buku doa cetak. Ringankan kerja muthowif. Tampil profesional. Hanya 10 SAR per jamaah.</p>
            </div>
            <div className="lp-foot-links">
            {[
              { title: 'Produk', links: [['#fitur', 'Fitur'], ['#harga', 'Harga'], ['#cara', 'Cara Kerja']] },
              { title: 'Perusahaan', links: [['#kontak', 'Kontak'], [WA_LINK, 'WhatsApp']] },
              { title: 'Legal', links: [['#', 'Kebijakan Privasi'], ['#', 'Syarat & Ketentuan']] },
            ].map(col => (
              <div key={col.title}>
                <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>{col.title}</h4>
                {col.links.map(([href, label]) => (
                  <a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                    style={{ display: 'block', color: C.muted, fontSize: 14, marginBottom: 10, textDecoration: 'none', transition: 'color .2s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = C.primary)}
                    onMouseLeave={e => (e.currentTarget.style.color = C.muted)}
                  >{label}</a>
                ))}
              </div>
            ))}
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 26, borderTop: `1px solid ${C.line}`, color: C.muted, fontSize: 13, flexWrap: 'wrap', gap: 12 }}>
            <span>© {new Date().getFullYear()} Umrahme. All rights reserved.</span>
            <span>Dibuat untuk travel umrah Indonesia 🇮🇩</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
