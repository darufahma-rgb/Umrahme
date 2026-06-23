import { useState, useRef, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

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
    { icon: '📖', num: '01', title: 'Buku Doa Digital', desc: '45 doa lengkap Arab, latin, dan terjemahan dalam 9 kategori. Jamaah mengikuti langsung saat muthowif menjelaskan.' },
    { icon: '🔢', num: '02', title: "Counter Tawaf & Sa'i", desc: 'Penghitung otomatis putaran 1–7 lengkap dengan doa di setiap putaran, agar ibadah lebih khusyuk.' },
    { icon: '🕋', num: '03', title: 'Panduan Ibadah', desc: 'Tuntunan step by step dari manasik interaktif hingga panduan ihram, mudah diikuti siapa saja.' },
    { icon: '🗺️', num: '04', title: 'Peta & Lokasi Bersejarah', desc: 'Info dan peta tempat bersejarah di Makkah dan Madinah, lengkap dengan keterangan.' },
    { icon: '🕌', num: '05', title: 'Jadwal Sholat Real-time', desc: 'Waktu sholat akurat sesuai lokasi jamaah secara otomatis sepanjang perjalanan.' },
    { icon: '📢', num: '06', title: 'Pengumuman Travel', desc: 'Broadcast pengumuman dari travel ke seluruh jamaah secara instan dan tersampaikan.' },
    { icon: '🗓️', num: '07', title: 'Agenda Harian', desc: 'Travel mengisi agenda perjalanan harian, jamaah melihat jadwal lengkap tiap hari.' },
    { icon: '🪪', num: '08', title: 'Kartu Jamaah Digital', desc: 'Identitas digital berisi data lengkap jamaah, praktis dan selalu tersedia di HP.' },
    { icon: '📔', num: '09', title: 'Jurnal Perjalanan', desc: 'Catat momen dan simpan foto perjalanan sebagai kenangan ibadah yang berharga.' },
    { icon: '🎖️', num: '10', title: 'Sertifikat Umrah Digital', desc: 'Sertifikat resmi digital sebagai bukti penyelesaian ibadah umrah jamaah.' },
    { icon: '🎨', num: '11', title: 'White-Label Penuh', desc: 'Logo, warna, dan nama travel bisa dikustom. Jamaah merasa ini app milik travel sendiri.' },
    { icon: '📊', num: '12', title: 'Portal Travel Agency', desc: 'Dashboard untuk kelola seluruh jamaah, agenda, dan pengumuman dalam satu tempat.' },
  ];

  const testimonials = [
    { name: 'H. Ridwan Effendi', travel: 'PT. Barokah Safar Abadi', init: 'RE', text: 'Sejak pakai Umrahme, pertanyaan ke muthowif berkurang drastis. Jamaah lebih mandiri, perjalanan lebih tenang.' },
    { name: 'Ibu Siti Nurhaliza', travel: 'Yayasan Al-Haramain Tour', init: 'SN', text: 'Jamaah yang sudah tua pun bisa pakai. Tidak perlu install, langsung buka link. Praktis sekali.' },
    { name: 'Ust. Farid Amanullah', travel: 'CV. Bintang Madinah Travel', init: 'FA', text: 'Harga 10 SAR per jamaah sangat worth it. Cetak buku doa saja sudah lebih mahal dari itu.' },
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

        .lp-nav-link { font-weight: 500; font-size: 15px; color: rgba(255,255,255,.85); text-decoration: none; transition: color .2s; font-family: ${F}; }
        .lp-nav-link:hover { color: #fff; }
        .lp-nav-link-dark { font-weight: 500; font-size: 15px; color: #333333; text-decoration: none; transition: color .2s; font-family: ${F}; }
        .lp-nav-link-dark:hover { color: ${C.primary}; }

        @media (max-width: 980px) {
          .lp-bento { grid-template-columns: 1fr 1fr !important; }
          .lp-feat-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .lp-steps { grid-template-columns: 1fr !important; }
          .lp-wl { grid-template-columns: 1fr !important; }
          .lp-price-wrap { grid-template-columns: 1fr !important; }
          .lp-testi-grid { grid-template-columns: 1fr !important; }
          .lp-foot-top { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 760px) {
          /* pill navbar on mobile: hide links, show hamburger */
          .lp-nav-menu { position: fixed; top: 0; right: 0; bottom: 0; width: 82%; max-width: 300px; background: #fff; flex-direction: column; padding: 56px 28px 40px; gap: 6px; box-shadow: -10px 0 40px -10px rgba(0,0,0,.25); transform: translateX(100%); transition: transform .35s ease; z-index: 200; }
          .lp-nav-menu.open { transform: none; }
          .lp-nav-menu a.lp-nav-link-dark { color: ${C.ink} !important; font-size: 17px !important; font-weight: 600 !important; padding: 12px 16px !important; border-radius: 12px; }
          .lp-nav-menu a.lp-nav-link-dark:hover { background: ${C.soft}; }
          .lp-menu-toggle { display: flex !important; }
          .lp-nav-cta-btn { display: none !important; }
          .lp-drawer-close { display: flex !important; }
          .lp-drawer-cta { display: flex !important; }
          /* grids */
          .lp-feat-grid { grid-template-columns: 1fr !important; }
          .lp-bento { grid-template-columns: 1fr !important; }
          .lp-foot-top { grid-template-columns: 1fr !important; }
          .lp-float-wrap { overflow-x: auto; justify-content: flex-start !important; padding: 0 20px 10px !important; }
          /* hero top spacing for small pill navbar */
          .lp-hero-padding { padding: 100px 0 0 !important; }
        }
      `}</style>

      {/* ══════════ NAVBAR ══════════ */}
      <header style={{
        position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)',
        zIndex: 100,
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderRadius: 999,
        display: 'flex', alignItems: 'center',
        boxShadow: '0 8px 32px rgba(0,0,0,0.14)',
        border: '1px solid rgba(255,255,255,0.6)',
        padding: 6,
        maxWidth: 'calc(100vw - 32px)',
        whiteSpace: 'nowrap' as const,
      }}>
        {/* Logo circle */}
        <a href="#" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: '50%', background: C.ink, color: '#fff', fontWeight: 800, fontSize: 17, flexShrink: 0, textDecoration: 'none' }}>U</a>

        <nav className={`lp-nav-menu${menuOpen ? ' open' : ''}`} style={{ display: 'flex', gap: 0, padding: '0 10px' }}>
          {/* close button inside drawer (mobile only) */}
          <button
            className="lp-drawer-close"
            onClick={() => setMenuOpen(false)}
            style={{ display: 'none', position: 'absolute', top: 16, right: 16, background: C.soft, border: 'none', borderRadius: 999, width: 36, height: 36, alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: 18, color: C.ink }}
            aria-label="Tutup menu"
          >✕</button>

          {[['#fitur', 'Fitur'], ['#harga', 'Harga'], ['#cara', 'Cara Kerja'], ['#kontak', 'Kontak']].map(([h, l]) => (
            <a key={h} href={h} className="lp-nav-link-dark" style={{ padding: '8px 12px', borderRadius: 999 }} onClick={() => setMenuOpen(false)}>{l}</a>
          ))}

          {/* CTA in drawer (mobile only) */}
          <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="lp-drawer-cta lp-btn"
            style={{ display: 'none', background: C.ink, color: '#fff', borderRadius: 32, padding: '14px 20px', fontSize: 15, fontWeight: 600, textAlign: 'center', justifyContent: 'center', marginTop: 8 }}
            onClick={() => setMenuOpen(false)}>
            Daftar Sekarang →
          </a>
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="lp-btn lp-nav-cta-btn" style={{ background: C.ink, color: '#fff', padding: '10px 20px', fontSize: 14 }}>
            Daftar Sekarang
          </a>
          <button
            className="lp-menu-toggle"
            onClick={() => setMenuOpen(p => !p)}
            style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', flexDirection: 'column' as const, gap: 4, padding: '8px 10px' }}
            aria-label="Buka menu"
          >
            {[0, 1, 2].map(i => <span key={i} style={{ width: 20, height: 2, background: C.ink, borderRadius: 2, display: 'block' }} />)}
          </button>
        </div>
        {menuOpen && <div onClick={() => setMenuOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 198 }} />}
      </header>

      {/* ══════════ HERO ══════════ */}
      <section className="lp-hero-padding" style={{
        position: 'relative',
        background: `linear-gradient(180deg, ${C.blue1} 0%, ${C.blue2} 45%, ${C.blue3} 100%)`,
        padding: '150px 0 0', overflow: 'hidden',
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
          {/* eyebrow badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(0,0,0,0.48)', color: '#fff', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', borderRadius: 999, padding: '7px 18px', marginBottom: 30, fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', border: '1px solid rgba(255,255,255,0.22)', textTransform: 'uppercase' as const }}
          >
            <span style={{ fontSize: 11 }}>★</span> Pendamping Ibadah Umrah Terdepan
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontSize: 'clamp(38px, 6vw, 74px)', fontWeight: 800, lineHeight: 1.05, color: '#fff', letterSpacing: '-0.02em', maxWidth: 900, margin: '0 auto 22px', textShadow: '0 2px 24px rgba(0,0,0,0.5), 0 1px 4px rgba(0,0,0,0.4)' }}
          >
            Jadikan Perjalanan Jamaah Anda{' '}
            <span style={{ color: C.accent, fontStyle: 'italic' }}>Lebih Bermakna</span>
            {' '}— Tanpa Repot
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.65 }}
            style={{ color: 'rgba(255,255,255,.88)', fontSize: 'clamp(15px, 2vw, 17px)', maxWidth: 580, margin: '0 auto 30px', fontWeight: 400, textShadow: '0 1px 12px rgba(0,0,0,0.5)', lineHeight: 1.7 }}
          >
            Pengganti buku doa digital, panduan ibadah lengkap, dan sistem komunikasi travel dalam satu aplikasi.
            White-label penuh, siap pakai, hanya <strong>10 SAR per jamaah</strong>.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32, duration: 0.55 }}
            style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 26 }}
          >
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="lp-btn" style={{ background: C.ink, color: '#fff', padding: '14px 28px', fontSize: 15, fontWeight: 600 }}>
              Daftar Sekarang
            </a>
            <a href="#cara" className="lp-btn" style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.4)', padding: '14px 28px', fontSize: 15, fontWeight: 600 }}>
              Lihat Cara Kerja
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.48 }}
            style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', color: '#fff', fontSize: 14, fontWeight: 600 }}
          >
            <div style={{ display: 'flex' }}>
              {[0, 1, 2, 3].map(i => <span key={i} style={{ width: 28, height: 28, borderRadius: '50%', border: '2px solid #fff', marginLeft: i > 0 ? -8 : 0, background: C.accent, display: 'inline-block' }} />)}
            </div>
            <span style={{ color: C.accent, letterSpacing: 2 }}>★★★★★</span>
            <span>Dipercaya travel agency umrah Indonesia</span>
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
              style={{ animation: `lpFloat 5s ease-in-out ${_.delay}s infinite`, flexShrink: 0 }}
            >
              {i === 0 && (
                <div style={{ background: '#fff', borderRadius: 16, padding: 16, boxShadow: '0 18px 50px -20px rgba(15,23,42,.25)', width: 150 }}>
                  <span style={{ display: 'inline-block', fontSize: 10, padding: '3px 8px', borderRadius: 999, background: C.soft, color: C.muted, fontWeight: 600 }}>Tawaf</span>
                  <div style={{ fontSize: 30, fontWeight: 800, margin: '6px 0' }}>4 / 7</div>
                  <div style={{ fontSize: 11, color: C.muted }}>Putaran berjalan</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: C.muted, marginTop: 8 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: C.accentDark, display: 'inline-block' }} /> Counter otomatis
                  </div>
                </div>
              )}
              {i === 1 && (
                <div style={{ background: '#fff', borderRadius: 16, padding: 16, boxShadow: '0 18px 50px -20px rgba(15,23,42,.25)', width: 168 }}>
                  <div style={{ fontSize: 11, color: C.muted, fontWeight: 600 }}>Buku Doa Digital</div>
                  <div style={{ fontSize: 30, fontWeight: 800, margin: '6px 0' }}>45</div>
                  <div style={{ fontSize: 11, color: C.muted }}>Doa · 9 kategori</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: C.muted, marginTop: 8 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: C.accentDark, display: 'inline-block' }} /> Arab · Latin · Terjemah
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
                  <div style={{ fontSize: 30, fontWeight: 800, margin: '6px 0', color: C.accent }}>Live</div>
                  <div style={{ fontSize: 11, color: '#cbd5e1' }}>Broadcast ke jamaah</div>
                </div>
              )}
              {i === 4 && (
                <div style={{ background: C.accent, color: C.greenDark, borderRadius: 16, padding: 16, boxShadow: '0 18px 50px -20px rgba(15,23,42,.25)', width: 140 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: C.greenDark }}>Jadwal Sholat</div>
                  <div style={{ fontSize: 30, fontWeight: 800, margin: '6px 0' }}>05:12</div>
                  <div style={{ fontSize: 11, color: C.greenDark }}>Subuh · Makkah</div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════ PARTNERS MARQUEE ══════════ */}
      <div style={{ padding: '130px 0 50px', borderBottom: `1px solid ${C.line}`, overflow: 'hidden' }}>
        <p style={{ textAlign: 'center', color: C.muted, fontSize: 13, fontWeight: 600, marginBottom: 26 }}>
          DIGUNAKAN OLEH TRAVEL AGENCY UMRAH DI SELURUH INDONESIA
        </p>
        <MarqueeStrip />
      </div>

      {/* ══════════ ABOUT / BENTO ══════════ */}
      <section style={{ padding: '90px 0' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 24px' }}>
          <Reveal><Eyebrow>Tentang Umrahme</Eyebrow></Reveal>
          <Reveal>
            <h2 style={{ textAlign: 'center', fontSize: 'clamp(28px, 4.5vw, 46px)', fontWeight: 800, lineHeight: 1.12, letterSpacing: '-0.02em', maxWidth: 760, margin: '0 auto 40px' }}>
              Platform pendamping umrah yang dirancang untuk travel modern dan jamaah
            </h2>
          </Reveal>

          <div className="lp-bento" style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr 1fr', gap: 18 }}>
            <Reveal>
              <div style={{ borderRadius: 20, padding: 26, boxShadow: '0 8px 24px -12px rgba(15,23,42,.2)', background: `linear-gradient(165deg, ${C.blue2}, ${C.blue1})`, color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 280, position: 'relative', overflow: 'hidden' }}>
                <div style={{ fontWeight: 700, fontSize: 20 }}>Umrahme</div>
                <div style={{ background: '#fff', color: C.ink, borderRadius: 14, padding: '16px 18px' }}>
                  <div style={{ fontSize: 38, fontWeight: 800 }}>120+</div>
                  <div style={{ fontSize: 13, color: C.muted }}>Travel agency telah bergabung memodernisasi layanan</div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.05}>
              <div style={{ borderRadius: 20, padding: 26, boxShadow: '0 8px 24px -12px rgba(15,23,42,.2)', background: '#fff', border: `1px solid ${C.line}`, minHeight: 280 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.muted }}>Kepuasan jamaah</div>
                <div style={{ fontSize: 44, fontWeight: 800, margin: '8px 0' }}>100%</div>
                <p style={{ fontSize: 14, color: C.muted, marginTop: 14, borderTop: `1px solid ${C.line}`, paddingTop: 14, lineHeight: 1.6 }}>
                  "Jamaah kami tidak lagi bingung. Semua info ibadah, jadwal, dan doa ada di satu aplikasi yang terasa milik travel kami sendiri."
                </p>
              </div>
            </Reveal>

            <div style={{ display: 'grid', gap: 18 }}>
              <Reveal delay={0.08}>
                <div style={{ borderRadius: 20, padding: 26, boxShadow: '0 8px 24px -12px rgba(15,23,42,.2)', background: C.accent, color: C.greenDark }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>Total doa & panduan</div>
                  <div style={{ fontSize: 38, fontWeight: 800, margin: '4px 0' }}>45+</div>
                  <div style={{ fontSize: 13, marginTop: 6 }}>Doa lengkap dalam 9 kategori, siap dibaca jamaah.</div>
                </div>
              </Reveal>
              <Reveal delay={0.11}>
                <div style={{ borderRadius: 20, padding: 26, boxShadow: '0 8px 24px -12px rgba(15,23,42,.2)', background: C.ink, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: 13, color: '#cbd5e1' }}>Biaya bulanan</div>
                    <div style={{ fontSize: 14, color: '#cbd5e1' }}>& setup</div>
                  </div>
                  <div style={{ fontSize: 40, fontWeight: 800, color: C.accent }}>Rp 0</div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════ PAIN POINTS ══════════ */}
      <section style={{ background: C.soft, padding: '90px 0' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 24px' }}>
          <Reveal><Eyebrow>Masalah Anda Hari Ini</Eyebrow></Reveal>
          <Reveal><h2 style={{ textAlign: 'center', fontSize: 'clamp(28px, 4.5vw, 46px)', fontWeight: 800, lineHeight: 1.12, letterSpacing: '-0.02em', maxWidth: 760, margin: '0 auto 16px' }}>Kenapa layanan umrah masih terasa repot?</h2></Reveal>
          <Reveal><p style={{ textAlign: 'center', color: C.muted, maxWidth: 560, margin: '0 auto 40px', fontSize: 16 }}>Tantangan harian yang dialami hampir setiap travel agency umrah — dan jawabannya ada di Umrahme.</p></Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18, marginTop: 10 }}>
            {[
              { icon: '😕', title: 'Jamaah bingung & ketinggalan info', desc: 'Info penting tersebar di mana-mana, banyak jamaah yang tertinggal dan terus bertanya.' },
              { icon: '🔁', title: 'Muthowif menjelaskan berulang', desc: 'Hal yang sama dijelaskan berkali-kali ke jamaah berbeda sepanjang perjalanan.' },
              { icon: '📕', title: 'Buku doa fisik hilang', desc: 'Buku doa cetak sering tertinggal, rusak, atau tidak pernah dibaca jamaah.' },
              { icon: '📢', title: 'Susah broadcast mendadak', desc: 'Pengumuman penting harus dikirim satu per satu, tidak semua jamaah membacanya.' },
              { icon: '📱', title: 'Semua manual lewat WhatsApp', desc: 'Grup WA penuh, pesan tenggelam, dan koordinasi jadi melelahkan.' },
              { icon: '🏷️', title: 'Tak ada identitas digital', desc: 'Travel belum punya wajah digital yang membangun kepercayaan calon jamaah.' },
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
      <section id="fitur" style={{ padding: '90px 0' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 24px' }}>
          <Reveal><Eyebrow>Fitur Lengkap</Eyebrow></Reveal>
          <Reveal><h2 style={{ textAlign: 'center', fontSize: 'clamp(28px, 4.5vw, 46px)', fontWeight: 800, lineHeight: 1.12, letterSpacing: '-0.02em', maxWidth: 760, margin: '0 auto 16px' }}>Satu aplikasi untuk seluruh perjalanan ibadah jamaah</h2></Reveal>
          <Reveal><p style={{ textAlign: 'center', color: C.muted, maxWidth: 560, margin: '0 auto 40px', fontSize: 16 }}>Dua belas fitur inti yang menggantikan buku doa, panduan, dan koordinasi manual.</p></Reveal>

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
      <section id="cara" style={{ background: C.soft, padding: '90px 0' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 24px' }}>
          <Reveal><Eyebrow>Cara Kerja</Eyebrow></Reveal>
          <Reveal><h2 style={{ textAlign: 'center', fontSize: 'clamp(28px, 4.5vw, 46px)', fontWeight: 800, lineHeight: 1.12, letterSpacing: '-0.02em', maxWidth: 760, margin: '0 auto 16px' }}>Siap pakai hanya dalam 3 langkah</h2></Reveal>
          <Reveal><p style={{ textAlign: 'center', color: C.muted, maxWidth: 560, margin: '0 auto 40px', fontSize: 16 }}>Tanpa biaya setup, tanpa tim IT. Travel langsung bisa pakai untuk keberangkatan berikutnya.</p></Reveal>

          <div className="lp-steps" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {[
              { title: 'Daftar & Kustomisasi', desc: 'Daftar travel Anda, lalu atur logo, warna, dan nama. Aplikasi langsung tampil seperti milik travel sendiri.' },
              { title: 'Input Data Jamaah', desc: 'Masukkan data jamaah dan agenda perjalanan melalui portal travel yang mudah digunakan.' },
              { title: 'Jamaah Siap Berangkat', desc: 'Jamaah mengakses aplikasi, mengikuti panduan ibadah, dan tetap terhubung dengan travel.' },
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
      <section style={{ padding: '90px 0' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 24px' }}>
          <div className="lp-wl" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 50, alignItems: 'center' }}>
            <Reveal>
              <div>
                <Eyebrow align="left">White-Label</Eyebrow>
                <h2 style={{ fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 800, lineHeight: 1.12, letterSpacing: '-0.02em', marginBottom: 18 }}>
                  Aplikasi yang terasa 100% milik travel Anda
                </h2>
                <p style={{ color: C.muted, fontSize: 16, marginBottom: 22, lineHeight: 1.7 }}>
                  Jamaah membuka aplikasi dengan logo, warna, dan nama travel Anda. Tidak ada merek pihak ketiga — hanya identitas brand Anda yang memperkuat kepercayaan.
                </p>
                <ul style={{ listStyle: 'none' }}>
                  {['Logo & nama travel tampil penuh di aplikasi jamaah', 'Skema warna disesuaikan dengan brand Anda', 'Membangun citra travel yang modern & profesional', 'Tanpa biaya tambahan untuk kustomisasi'].map((t) => (
                    <li key={t} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 14, fontWeight: 600, fontSize: 15 }}>
                      <span style={{ flexShrink: 0, width: 24, height: 24, borderRadius: '50%', background: C.accent, color: C.greenDark, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800 }}>✓</span>
                      {t}
                    </li>
                  ))}
                </ul>
                <div style={{ marginTop: 28 }}>
                  <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="lp-btn lp-btn-dark">
                    Coba Demo Gratis <span className="lp-arrow" style={{ background: C.accent, color: C.ink }}>→</span>
                  </a>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div style={{ display: 'flex', gap: 18, justifyContent: 'center', flexWrap: 'wrap' }}>
                {[
                  { name: 'Barokah Tour', sub: "Assalamu'alaikum, Ahmad 👋", bg: 'linear-gradient(160deg, #15803d, #14532d)', items: ['📖 Buku Doa', '🔢 Counter Tawaf', '🗓️ Agenda Hari Ini', '📢 Pengumuman'], accent: '#dcfce7', tilt: 'rotate(-5deg) translateY(10px)' },
                  { name: 'Mabrur Travel', sub: "Assalamu'alaikum, Siti 👋", bg: 'linear-gradient(160deg, #b45309, #92400e)', items: ['🕌 Jadwal Sholat', '🗺️ Peta Lokasi', '🪪 Kartu Jamaah', '🎖️ Sertifikat'], accent: '#fef3c7', tilt: 'rotate(5deg)' },
                ].map((ph) => (
                  <div key={ph.name} style={{ width: 200, borderRadius: 32, padding: 12, background: C.ink, boxShadow: '0 18px 50px -20px rgba(15,23,42,.25)', transform: ph.tilt, transition: 'transform .3s' }}>
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
      <section id="harga" style={{ background: C.soft, padding: '90px 0' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 24px' }}>
          <Reveal><Eyebrow>Harga</Eyebrow></Reveal>
          <Reveal><h2 style={{ textAlign: 'center', fontSize: 'clamp(28px, 4.5vw, 46px)', fontWeight: 800, lineHeight: 1.12, letterSpacing: '-0.02em', maxWidth: 760, margin: '0 auto 16px' }}>Transparan, terjangkau, tanpa biaya tersembunyi</h2></Reveal>
          <Reveal><p style={{ textAlign: 'center', color: C.muted, maxWidth: 560, margin: '0 auto 40px', fontSize: 16 }}>Bayar hanya untuk jumlah jamaah yang berangkat. Tanpa biaya setup, tanpa langganan bulanan.</p></Reveal>

          <div className="lp-price-wrap" style={{ display: 'grid', gridTemplateColumns: '1.1fr .9fr', gap: 24, alignItems: 'stretch' }}>
            <Reveal>
              <div style={{ background: C.ink, color: '#fff', borderRadius: 28, padding: 40, position: 'relative', overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{ position: 'absolute', top: 24, right: -34, background: C.accent, color: C.greenDark, fontWeight: 800, fontSize: 12, padding: '6px 44px', transform: 'rotate(45deg)' }}>POPULER</div>
                <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>Lisensi per Jamaah</h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, margin: '18px 0 6px' }}>
                  <span style={{ fontSize: 64, fontWeight: 800, lineHeight: 1, color: C.accent }}>10</span>
                  <span style={{ fontSize: 16, color: 'rgba(255,255,255,.8)' }}>SAR / jamaah</span>
                </div>
                <p style={{ color: 'rgba(255,255,255,.75)', fontSize: 14, marginBottom: 26 }}>Sekali bayar per jamaah per keberangkatan. Semua fitur termasuk.</p>
                <ul style={{ listStyle: 'none', flex: 1 }}>
                  {['Tidak ada biaya setup', 'Tidak ada biaya bulanan', 'Bayar hanya jamaah aktif', 'Semua 12 fitur sudah termasuk', 'Branding white-label penuh', 'Support via WhatsApp'].map(t => (
                    <li key={t} style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12, fontSize: 14 }}>
                      <span style={{ width: 22, height: 22, borderRadius: '50%', background: C.accent, color: C.greenDark, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 800, flexShrink: 0 }}>✓</span>
                      {t}
                    </li>
                  ))}
                </ul>
                <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="lp-btn lp-btn-accent" style={{ width: '100%', justifyContent: 'center', marginTop: 26 }}>
                  Daftar Sekarang <span className="lp-arrow">→</span>
                </a>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
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
                <p style={{ fontSize: 13, color: C.muted, marginTop: 16, lineHeight: 1.6 }}>Dibanding buku doa cetak (15–25 SAR/buku), Umrahme jauh lebih hemat dan lebih lengkap.</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══════════ TESTIMONIALS ══════════ */}
      <section style={{ padding: '90px 0' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 24px' }}>
          <Reveal><Eyebrow>Testimoni</Eyebrow></Reveal>
          <Reveal><h2 style={{ textAlign: 'center', fontSize: 'clamp(28px, 4.5vw, 46px)', fontWeight: 800, lineHeight: 1.12, letterSpacing: '-0.02em', maxWidth: 760, margin: '0 auto 40px' }}>Kata mereka yang sudah pakai</h2></Reveal>

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
      <section style={{ background: C.soft, padding: '90px 0' }}>
        <div style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px' }}>
          <Reveal><Eyebrow>FAQ</Eyebrow></Reveal>
          <Reveal><h2 style={{ textAlign: 'center', fontSize: 'clamp(28px, 4vw, 38px)', fontWeight: 800, lineHeight: 1.12, letterSpacing: '-0.02em', margin: '0 auto 40px' }}>Pertanyaan yang Sering Ditanyakan</h2></Reveal>
          <Reveal delay={0.05}>
            {faqs.map((f, i) => <FAQItem key={i} q={f.q} a={f.a} />)}
          </Reveal>
        </div>
      </section>

      {/* ══════════ FINAL CTA ══════════ */}
      <section id="kontak" style={{ padding: '90px 24px' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <Reveal>
            <div style={{ background: `linear-gradient(165deg, ${C.primary}, ${C.primaryDark})`, color: '#fff', borderRadius: 32, padding: '64px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', width: 320, height: 320, background: `radial-gradient(circle, rgba(255,255,255,.12), transparent 70%)`, top: -120, right: -80, pointerEvents: 'none' }} />
              <h2 style={{ fontSize: 'clamp(28px, 4.5vw, 44px)', fontWeight: 800, marginBottom: 16, position: 'relative' }}>
                Siap Upgrade Layanan Travel Anda?
              </h2>
              <p style={{ color: 'rgba(255,255,255,.85)', maxWidth: 520, margin: '0 auto 28px', fontSize: 17, lineHeight: 1.7, position: 'relative' }}>
                Bergabung sekarang dan berikan pengalaman umrah terbaik untuk jamaah Anda. Demo gratis, tidak ada komitmen.
              </p>
              <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', position: 'relative' }}>
                <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="lp-btn lp-btn-accent">
                  Hubungi via WhatsApp <span className="lp-arrow">→</span>
                </a>
                <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="lp-btn lp-btn-ghost">
                  Minta Demo Gratis
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
                <div style={{ width: 34, height: 34, borderRadius: 10, background: C.accent, color: C.greenDark, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800, flexShrink: 0 }}>U</div>
                Umrahme
              </div>
              <p style={{ color: C.muted, fontSize: 14, maxWidth: 280, lineHeight: 1.7 }}>Platform pendamping umrah digital untuk travel agency modern di seluruh Indonesia.</p>
            </div>
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 26, borderTop: `1px solid ${C.line}`, color: C.muted, fontSize: 13, flexWrap: 'wrap', gap: 12 }}>
            <span>© {new Date().getFullYear()} Umrahme. All rights reserved.</span>
            <span>Dibuat untuk travel umrah Indonesia 🇮🇩</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
