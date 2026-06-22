import { useState, useRef, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';

/* ─── CONSTANTS ─── */
const WA_NUMBER = '6281234567890';
const WA_MSG = encodeURIComponent(
  "Assalamu'alaikum, saya pemilik travel umrah dan tertarik dengan Umrahme. Boleh minta info demo?"
);
const WA_LINK = `https://wa.me/${WA_NUMBER}?text=${WA_MSG}`;

function Reveal({ children, delay = 0, className = '', from = 'bottom' }: {
  children: React.ReactNode; delay?: number; className?: string; from?: 'bottom' | 'left' | 'right' | 'none';
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const initial = from === 'bottom' ? { opacity: 0, y: 28 } : from === 'left' ? { opacity: 0, x: -28 } : from === 'right' ? { opacity: 0, x: 28 } : { opacity: 0 };
  return (
    <motion.div ref={ref} initial={initial} animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }} className={className}>
      {children}
    </motion.div>
  );
}

/* ─── FLOATING HERO CARDS ─── */
function HeroCards() {
  return (
    <div style={{ position: 'relative', width: '100%', height: 520, maxWidth: 480 }}>
      {/* Card 1 — Counter Tawaf */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'absolute', top: 0, left: 0,
          background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.14)', borderRadius: 20,
          padding: '20px 24px', width: 200,
          boxShadow: '0 24px 48px rgba(0,0,0,0.3)',
        }}
      >
        <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 14 }}>Counter Tawaf</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%',
            background: 'linear-gradient(135deg, #d4a24e, #b8860b)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 8px 20px rgba(212,162,78,0.35)',
          }}>
            <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 22, fontWeight: 800, color: '#fff', lineHeight: 1 }}>4</span>
            <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 8, color: 'rgba(255,255,255,0.7)' }}>/ 7</span>
          </div>
          <div>
            <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 4 }}>Putaran ke-4</p>
            <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>Tawaf Qudum</p>
          </div>
        </div>
        <div style={{ marginTop: 14, height: 4, borderRadius: 99, background: 'rgba(255,255,255,0.08)' }}>
          <div style={{ width: '57%', height: '100%', borderRadius: 99, background: 'linear-gradient(90deg, #d4a24e, #f0c060)' }} />
        </div>
      </motion.div>

      {/* Card 2 — Doa */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'absolute', top: 50, right: 0,
          background: '#fff', borderRadius: 20,
          padding: '20px 24px', width: 230,
          boxShadow: '0 24px 60px rgba(0,0,0,0.3)',
        }}
      >
        <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 10, fontWeight: 600, color: '#d4a24e', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>Doa Tawaf Putaran 4</p>
        <p style={{ fontFamily: "'Amiri', serif", fontSize: 18, color: '#1a2744', textAlign: 'right', lineHeight: 1.7, marginBottom: 10, direction: 'rtl' }}>رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً</p>
        <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 10, color: '#888', lineHeight: 1.5 }}>Ya Rabb, berikanlah kami kebaikan di dunia dan akhirat...</p>
      </motion.div>

      {/* Card 3 — Kartu Jamaah */}
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'absolute', top: 230, left: 20,
          background: 'linear-gradient(135deg, #1a2744 0%, #243560 100%)',
          borderRadius: 20, padding: '20px 24px', width: 210,
          boxShadow: '0 20px 48px rgba(10,15,40,0.5)',
          border: '1px solid rgba(212,162,78,0.2)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 10, fontWeight: 600, color: '#d4a24e', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Kartu Jamaah</p>
          <div style={{ width: 28, height: 18, borderRadius: 4, background: 'linear-gradient(135deg, #d4a24e, #b8860b)' }} />
        </div>
        <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 4 }}>Ahmad Fauzi</p>
        <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 14 }}>Travel Barokah Mandiri</p>
        <div style={{ display: 'flex', gap: 16 }}>
          <div><p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 9, color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>Rombongan</p><p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, fontWeight: 600, color: '#fff' }}>Grup A</p></div>
          <div><p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 9, color: 'rgba(255,255,255,0.4)', marginBottom: 2 }}>Hotel</p><p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, fontWeight: 600, color: '#fff' }}>Hilton Makkah</p></div>
        </div>
      </motion.div>

      {/* Card 4 — Pengumuman */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.95, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'absolute', bottom: 40, right: 10,
          background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.12)', borderRadius: 20,
          padding: '18px 22px', width: 220,
          boxShadow: '0 16px 40px rgba(0,0,0,0.3)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80', flexShrink: 0, boxShadow: '0 0 8px rgba(74,222,128,0.6)' }} />
          <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Pengumuman Travel</p>
        </div>
        <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, fontWeight: 500, color: '#fff', lineHeight: 1.5 }}>Bus keberangkatan ke Madinah pukul 08.00 WAS. Mohon berkumpul 15 menit lebih awal.</p>
        <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 8 }}>3 menit lalu · Travel Barokah</p>
      </motion.div>

      {/* floating label */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.1, duration: 0.5 }}
        style={{
          position: 'absolute', top: 170, left: '50%', transform: 'translateX(-50%)',
          background: 'linear-gradient(135deg, #d4a24e, #f0c060)',
          borderRadius: 99, padding: '8px 16px',
          boxShadow: '0 8px 24px rgba(212,162,78,0.5)',
        }}
      >
        <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, fontWeight: 700, color: '#1a2744' }}>White-label penuh ✦</p>
      </motion.div>
    </div>
  );
}

/* ─── FAQ Item ─── */
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', cursor: 'pointer' }}
      onClick={() => setOpen((p) => !p)}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 0', gap: 16 }}>
        <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15, fontWeight: 600, color: '#fff', lineHeight: 1.5 }}>{q}</p>
        <span style={{ color: '#d4a24e', fontSize: 20, flexShrink: 0, transition: 'transform 0.25s', transform: open ? 'rotate(45deg)' : 'rotate(0deg)' }}>+</span>
      </div>
      <AnimatePresence>
        {open && (
          <motion.p
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.75, paddingBottom: 20, overflow: 'hidden' }}
          >{a}</motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── MAIN ─── */
export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    document.title = 'Umrahme — Digitalisasi Layanan Jamaah Travel Umrah';
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const features = [
    { icon: '📖', title: 'Pengganti Buku Doa Digital', desc: '45 doa lengkap — Arab, latin, terjemahan — dikelompokkan per tahapan ibadah. Jamaah ikuti langsung saat muthowif menjelaskan.' },
    { icon: '🔄', title: 'Counter Tawaf & Sa\'i', desc: 'Hitung putaran 1–7 otomatis, doa per putaran muncul sendiri. Tidak akan salah hitung lagi.' },
    { icon: '🗺️', title: 'Panduan Ibadah Step-by-Step', desc: 'Ritual Navigator, Manasik Interaktif, Panduan Ihram — jamaah bisa belajar mandiri sebelum berangkat.' },
    { icon: '📍', title: 'Peta & Lokasi Bersejarah', desc: 'Info masjid dan ziarah di Makkah & Madinah — sejarah, koordinat Google Maps, adab berkunjung.' },
    { icon: '🕐', title: 'Jadwal Sholat Real-time', desc: 'Waktu sholat otomatis sesuai lokasi jamaah di Makkah atau Madinah.' },
    { icon: '📢', title: 'Pengumuman dari Travel', desc: 'Kirim info penting ke seluruh jamaah sekaligus — perubahan jadwal, meeting point, dan lainnya.' },
    { icon: '📅', title: 'Agenda Perjalanan', desc: 'Jadwal harian jamaah diisi travel, tampil real-time di HP jamaah sesuai fase perjalanan.' },
    { icon: '🪪', title: 'Kartu Jamaah Digital', desc: 'Nama, nomor, rombongan, bus, kamar hotel, kontak pembimbing — semua digital, tidak perlu kartu fisik.' },
    { icon: '📓', title: 'Jurnal Perjalanan', desc: 'Jamaah catat momen & foto selama perjalanan sebagai kenangan abadi.' },
    { icon: '🏆', title: 'Sertifikat Umrah Digital', desc: 'Kenangan selesai umrah yang bisa disimpan dan dibagikan ke media sosial.' },
    { icon: '🎨', title: 'White-label Penuh', desc: 'Logo travel, warna brand, nama app — semua bisa disesuaikan. Jamaah merasa ini app travel mereka.' },
    { icon: '⚙️', title: 'Portal Travel Agency', desc: 'Dashboard khusus travel untuk kelola jamaah, isi agenda, kirim pengumuman, dan atur semua data.' },
  ];

  const pains = [
    { icon: '😰', title: 'Jamaah kebingungan & ketinggalan info', desc: 'Tanpa panduan digital, jamaah bergantung penuh pada muthowif untuk semua informasi.' },
    { icon: '🔁', title: 'Muthowif menjelaskan hal yang sama berulang', desc: 'Pertanyaan berulang menguras energi pembimbing yang seharusnya fokus membimbing ibadah.' },
    { icon: '📕', title: 'Buku doa hilang atau tidak dibaca', desc: 'Buku fisik mahal, mudah ketinggalan, dan sering tidak dimanfaatkan jamaah.' },
    { icon: '📱', title: 'Broadcast pengumuman ke semua jamaah susah', desc: 'Kirim pesan satu per satu via WhatsApp tidak efisien dan rawan terlewat.' },
    { icon: '📋', title: 'Semua masih manual & rawan error', desc: 'Tidak ada sistem digital — data jamaah, jadwal, hotel — semuanya di spreadsheet atau kertas.' },
  ];

  const steps = [
    { num: '01', title: 'Daftar & Kustomisasi Brand', desc: 'Upload logo travel, pilih warna brand, dan atur nama app. Selesai dalam hitungan menit.' },
    { num: '02', title: 'Input Data Jamaah & Jadwal', desc: 'Tambahkan data jamaah, atur agenda perjalanan, info hotel, dan kontak pembimbing via portal.' },
    { num: '03', title: 'Jamaah Login & Langsung Pakai', desc: 'Jamaah buka link, masukkan kode aktivasi — langsung bisa akses semua fitur tanpa install.' },
  ];

  const testimonials = [
    { name: 'H. Ridwan Effendi', travel: 'PT. Barokah Safar Abadi', text: 'Sejak pakai Umrahme, pertanyaan ke muthowif berkurang drastis. Jamaah lebih mandiri, perjalanan lebih tenang.' },
    { name: 'Ibu Siti Nurhaliza', travel: 'Yayasan Al-Haramain Tour', text: 'Saya takjub — jamaah yang sudah tua pun bisa pakai. Tidak perlu install, langsung buka link. Praktis sekali.' },
    { name: 'Ust. Farid Amanullah', travel: 'CV. Bintang Madinah Travel', text: 'Harga 10 SAR per jamaah sangat worth it. Kalau cetak buku doa saja sudah lebih mahal dari itu.' },
  ];

  const faqs = [
    { q: 'Apakah jamaah perlu install aplikasi?', a: 'Tidak perlu. Jamaah cukup buka link dari browser HP, masukkan kode aktivasi, dan langsung bisa pakai semua fitur. Tidak ada install dari Play Store atau App Store.' },
    { q: 'Bagaimana cara kustomisasi tampilan?', a: 'Dari portal travel agency, Anda bisa upload logo, pilih warna brand, dan atur nama app. Perubahan langsung berlaku real-time untuk semua jamaah aktif.' },
    { q: 'Apakah data jamaah aman?', a: 'Ya. Data disimpan di server aman dengan enkripsi. Kami tidak menjual atau membagikan data jamaah kepada pihak ketiga.' },
    { q: 'Apakah bisa dipakai tanpa internet?', a: 'Fitur utama seperti kumpulan doa, panduan ibadah, dan kartu jamaah bisa diakses dalam mode offline setelah pertama kali dimuat. Fitur real-time (pengumuman, jadwal sholat) butuh koneksi.' },
    { q: 'Bagaimana cara pembayaran?', a: 'Pembayaran dilakukan per keberangkatan berdasarkan jumlah jamaah aktif. Tidak ada biaya bulanan atau biaya setup. Hubungi kami via WhatsApp untuk detail.' },
    { q: 'Apakah ada masa trial?', a: 'Ya, kami menyediakan demo gratis dengan branding travel Anda sehingga Anda bisa merasakan langsung sebelum memutuskan.' },
  ];

  return (
    <div style={{ background: '#080f1c', color: '#fff', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,600&family=Amiri:wght@400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        .btn-primary {
          display: inline-flex; align-items: center; gap: 10px;
          background: linear-gradient(135deg, #d4a24e, #b8860b);
          color: #fff; font-weight: 700; font-family: 'Plus Jakarta Sans', sans-serif;
          padding: 14px 28px; border-radius: 999px; font-size: 15px;
          text-decoration: none; transition: all 0.25s ease;
          box-shadow: 0 4px 24px rgba(212,162,78,0.35);
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(212,162,78,0.48); }
        .btn-primary .arrow {
          width: 32px; height: 32px; border-radius: 50%;
          background: rgba(255,255,255,0.2);
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; flex-shrink: 0;
        }
        .btn-ghost {
          display: inline-flex; align-items: center; gap: 8px;
          border: 1.5px solid rgba(255,255,255,0.2); color: rgba(255,255,255,0.8);
          font-weight: 600; font-family: 'Plus Jakarta Sans', sans-serif;
          padding: 13px 28px; border-radius: 999px; font-size: 15px;
          text-decoration: none; transition: all 0.25s ease;
        }
        .btn-ghost:hover { border-color: rgba(212,162,78,0.6); color: #d4a24e; background: rgba(212,162,78,0.06); }
        .feature-card {
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px; padding: 24px; transition: all 0.25s ease;
        }
        .feature-card:hover { background: rgba(255,255,255,0.07); border-color: rgba(212,162,78,0.2); transform: translateY(-3px); }
        .pain-card {
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px; padding: 28px; transition: all 0.25s ease;
        }
        .pain-card:hover { border-color: rgba(212,162,78,0.2); }
        .nav-link { font-family: 'Plus Jakarta Sans', sans-serif; font-size: 14px; font-weight: 500; color: rgba(255,255,255,0.6); text-decoration: none; transition: color 0.2s; }
        .nav-link:hover { color: #fff; }
        @media (max-width: 768px) {
          .hero-inner { flex-direction: column !important; }
          .hero-cards-wrap { display: none !important; }
          .features-grid { grid-template-columns: 1fr 1fr !important; }
          .steps-grid { grid-template-columns: 1fr !important; }
          .testimonials-grid { grid-template-columns: 1fr !important; }
          .pains-grid { grid-template-columns: 1fr !important; }
          .stat-grid { grid-template-columns: 1fr 1fr !important; }
          .nav-menu { display: none !important; }
        }
        @media (max-width: 480px) {
          .features-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ══ NAVBAR ══ */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        transition: 'all 0.3s ease',
        background: scrolled ? 'rgba(8,15,28,0.95)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', height: 68, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg, #d4a24e, #b8860b)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: 14 }}>🕌</span>
            </div>
            <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 20, fontWeight: 800, color: '#fff' }}>Umrahme</span>
          </div>
          <div className="nav-menu" style={{ display: 'flex', gap: 36 }}>
            {[['#fitur', 'Fitur'], ['#harga', 'Harga'], ['#cara-kerja', 'Cara Kerja'], ['#kontak', 'Kontak']].map(([h, l]) => (
              <a key={h} href={h} className="nav-link">{l}</a>
            ))}
          </div>
          <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ padding: '10px 20px', fontSize: 13 }}>
            Daftar Sekarang <span className="arrow">↗</span>
          </a>
        </div>
      </nav>

      {/* ══ HERO ══ */}
      <section style={{
        minHeight: '100vh', paddingTop: 68,
        background: 'linear-gradient(135deg, #080f1c 0%, #0d1a35 50%, #111e40 100%)',
        position: 'relative', overflow: 'hidden',
        display: 'flex', alignItems: 'center',
      }}>
        {/* background glow */}
        <div style={{ position: 'absolute', top: '10%', left: '-5%', width: 500, height: 500, borderRadius: '50%', background: 'rgba(212,162,78,0.06)', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '-5%', width: 400, height: 400, borderRadius: '50%', background: 'rgba(26,39,68,0.6)', filter: 'blur(60px)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 32px', width: '100%' }}>
          <div className="hero-inner" style={{ display: 'flex', alignItems: 'center', gap: 60 }}>
            {/* left */}
            <div style={{ flex: '1 1 0', maxWidth: 580 }}>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', borderRadius: 99, background: 'rgba(212,162,78,0.1)', border: '1px solid rgba(212,162,78,0.25)', marginBottom: 28 }}
              >
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#d4a24e', display: 'inline-block' }} />
                <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, fontWeight: 600, color: '#d4a24e', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Untuk Pemilik Travel Umrah</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
                  fontWeight: 800,
                  lineHeight: 1.15,
                  marginBottom: 24,
                  letterSpacing: '-0.02em',
                }}
              >
                Jadikan Perjalanan Jamaah Anda{' '}
                <span style={{ background: 'linear-gradient(135deg, #d4a24e, #f0c060)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Lebih Bermakna
                </span>
                {' '}— Tanpa Repot
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.28, duration: 0.65 }}
                style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 17, color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, marginBottom: 36, maxWidth: 500 }}
              >
                Satu aplikasi lengkap pengganti buku doa, panduan ibadah, dan sistem komunikasi travel. White-label, siap pakai,{' '}
                <span style={{ color: '#d4a24e', fontWeight: 600 }}>hanya 10 SAR per jamaah.</span>
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.55 }}
                style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginBottom: 40 }}
              >
                <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="btn-primary">
                  Mulai Sekarang <span className="arrow">↗</span>
                </a>
                <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="btn-ghost">
                  Lihat Demo
                </a>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55, duration: 0.5 }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ display: 'flex' }}>
                    {['#d4a24e', '#b8860b', '#c99a3d', '#e0b850'].map((c, i) => (
                      <div key={i} style={{ width: 28, height: 28, borderRadius: '50%', background: c, border: '2px solid #080f1c', marginLeft: i > 0 ? -8 : 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>🕌</div>
                    ))}
                  </div>
                  <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
                    Dipercaya travel agency di Indonesia
                  </p>
                </div>
              </motion.div>
            </div>

            {/* right — floating cards */}
            <div className="hero-cards-wrap" style={{ flex: '0 0 auto', width: 420 }}>
              <HeroCards />
            </div>
          </div>
        </div>
      </section>

      {/* ══ STATS BENTO ══ */}
      <section style={{ background: '#0d1525', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '64px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div className="stat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            {[
              { val: '10 SAR', label: 'Per jamaah. Itu saja', sub: 'Tanpa setup, tanpa biaya bulanan' },
              { val: '45+', label: 'Doa lengkap', sub: 'Arab · Latin · Terjemahan' },
              { val: '12', label: 'Fitur siap pakai', sub: 'Langsung aktif tanpa konfigurasi' },
              { val: '100%', label: 'White-label', sub: 'Brand travel Anda, bukan Umrahme' },
            ].map((s, i) => (
              <Reveal key={i} delay={i * 0.07}>
                <div style={{
                  background: i === 0 ? 'linear-gradient(135deg, #d4a24e15, #b8860b08)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${i === 0 ? 'rgba(212,162,78,0.25)' : 'rgba(255,255,255,0.06)'}`,
                  borderRadius: 16, padding: '28px 24px',
                }}>
                  <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, color: i === 0 ? '#d4a24e' : '#fff', marginBottom: 6 }}>{s.val}</p>
                  <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, fontWeight: 600, color: '#fff', marginBottom: 4 }}>{s.label}</p>
                  <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{s.sub}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PAIN POINTS ══ */}
      <section style={{ padding: '100px 32px', background: '#080f1c' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Reveal>
            <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, fontWeight: 700, color: '#d4a24e', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>• Masalah Yang Ada</p>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 800, lineHeight: 1.2, marginBottom: 16, letterSpacing: '-0.02em', maxWidth: 520 }}>
              Masalah yang Sering Dihadapi Travel Agency
            </h2>
            <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 16, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, marginBottom: 60, maxWidth: 440 }}>
              Masalah yang selama ini terasa wajar — padahal ada solusinya.
            </p>
          </Reveal>
          <div className="pains-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {pains.map((p, i) => (
              <Reveal key={i} delay={i * 0.07}>
                <div className="pain-card" style={{ gridColumn: i === 3 || i === 4 ? 'span 1' : undefined }}>
                  <span style={{ fontSize: 28, marginBottom: 16, display: 'block' }}>{p.icon}</span>
                  <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 8 }}>{p.title}</p>
                  <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65 }}>{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FEATURES ══ */}
      <section id="fitur" style={{ padding: '100px 32px', background: '#0d1525' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Reveal>
            <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, fontWeight: 700, color: '#d4a24e', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>• Fitur</p>
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24, marginBottom: 56 }}>
              <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.02em', maxWidth: 420 }}>
                Semua yang Dibutuhkan Jamaah,{' '}
                <span style={{ color: '#d4a24e' }}>dalam Satu App</span>
              </h2>
              <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15, color: 'rgba(255,255,255,0.5)', maxWidth: 320, lineHeight: 1.7 }}>
                12 fitur siap pakai — tidak perlu konfigurasi teknis, langsung aktif untuk jamaah Anda.
              </p>
            </div>
          </Reveal>
          <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {features.map((f, i) => (
              <Reveal key={i} delay={i * 0.04}>
                <div className="feature-card" style={{ height: '100%' }}>
                  <span style={{ fontSize: 26, marginBottom: 14, display: 'block' }}>{f.icon}</span>
                  <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 8 }}>{f.title}</p>
                  <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65 }}>{f.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section id="cara-kerja" style={{ padding: '100px 32px', background: '#080f1c' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Reveal>
            <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, fontWeight: 700, color: '#d4a24e', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>• Cara Kerja</p>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: 16, maxWidth: 440 }}>
              3 Langkah Simpel — Langsung Jalan
            </h2>
            <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 16, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7, marginBottom: 64, maxWidth: 400 }}>
              Tidak butuh tim IT. Tidak butuh waktu lama. Travel siap dalam hitungan jam.
            </p>
          </Reveal>
          <div className="steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
            {steps.map((s, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div style={{
                  padding: '36px 32px',
                  background: i === 1 ? 'linear-gradient(135deg, rgba(212,162,78,0.1), rgba(184,134,11,0.05))' : 'transparent',
                  border: `1px solid ${i === 1 ? 'rgba(212,162,78,0.25)' : 'rgba(255,255,255,0.06)'}`,
                  borderRadius: 20,
                  position: 'relative',
                }}>
                  {i < 2 && (
                    <div style={{ position: 'absolute', top: '50%', right: -18, transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.15)', fontSize: 20, fontWeight: 300 }}>→</div>
                  )}
                  <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 48, fontWeight: 800, color: i === 1 ? 'rgba(212,162,78,0.3)' : 'rgba(255,255,255,0.08)', lineHeight: 1, marginBottom: 20 }}>{s.num}</p>
                  <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 12 }}>{s.title}</p>
                  <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ WHITE-LABEL SHOWCASE ══ */}
      <section style={{ padding: '100px 32px', background: 'linear-gradient(135deg, #0d1a35 0%, #111e40 100%)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(ellipse at 50% 50%, rgba(212,162,78,0.07) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 80, flexWrap: 'wrap' }}>
            <Reveal from="left" className="">
              <div style={{ flex: '1 1 340px' }}>
                <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, fontWeight: 700, color: '#d4a24e', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>• White-Label</p>
                <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: 20 }}>
                  App Anda,{' '}
                  <span style={{ color: '#d4a24e' }}>Brand Anda</span>
                </h2>
                <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 16, color: 'rgba(255,255,255,0.6)', lineHeight: 1.8, marginBottom: 32 }}>
                  Jamaah tidak tahu ini Umrahme. Mereka pikir ini aplikasi milik travel mereka sendiri — karena memang itulah yang terlihat. Logo Anda, warna brand Anda, nama travel Anda.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {['Logo & nama travel tampil di seluruh app', 'Warna brand bisa disesuaikan penuh', 'Jamaah tidak tahu ini platform Umrahme', 'URL bisa disesuaikan dengan nama travel'].map((t) => (
                    <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'linear-gradient(135deg, #d4a24e, #b8860b)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, flexShrink: 0 }}>✓</span>
                      <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>{t}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal from="right" className="">
              <div style={{ flex: '1 1 340px', display: 'flex', gap: 16 }}>
                {[
                  { name: 'Travel Barokah Mandiri', color: '#1a2744', accent: '#d4a24e' },
                  { name: 'Al-Haramain Tour', color: '#1a3a2a', accent: '#4ade80' },
                  { name: 'Bintang Madinah', color: '#2a1a44', accent: '#a78bfa' },
                ].map((t) => (
                  <div key={t.name} style={{
                    flex: 1, borderRadius: 16, overflow: 'hidden',
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 20px 48px rgba(0,0,0,0.4)',
                  }}>
                    <div style={{ background: t.color, padding: '14px 12px', borderBottom: `2px solid ${t.accent}` }}>
                      <p style={{ fontFamily: "'Amiri', serif", fontSize: 12, color: t.accent, textAlign: 'center', marginBottom: 4 }}>بِسْمِ اللهِ</p>
                      <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.7)', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t.name}</p>
                    </div>
                    <div style={{ background: '#f5f0e8', padding: 10 }}>
                      <div style={{ background: '#fff', borderRadius: 8, padding: 8, marginBottom: 6, border: `1px solid ${t.accent}20` }}>
                        <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 8, fontWeight: 600, color: '#333', marginBottom: 4 }}>Counter Tawaf</p>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: t.color, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, fontWeight: 800, color: t.accent }}>3</span>
                        </div>
                      </div>
                      <div style={{ background: '#fff', borderRadius: 8, padding: 8 }}>
                        <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 8, color: '#666', lineHeight: 1.5 }}>رَبَّنَا آتِنَا فِي الدُّنْيَا...</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══ PRICING ══ */}
      <section id="harga" style={{ padding: '100px 32px', background: '#080f1c' }}>
        <div style={{ maxWidth: 720, margin: '0 auto', textAlign: 'center' }}>
          <Reveal>
            <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, fontWeight: 700, color: '#d4a24e', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>• Harga</p>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: 60 }}>
              Transparan. Terjangkau. Tanpa Kejutan.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div style={{
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 24, padding: '52px 48px', position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '50%', height: 1, background: 'linear-gradient(90deg, transparent, rgba(212,162,78,0.6), transparent)' }} />
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: 4, marginBottom: 8 }}>
                <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 22, fontWeight: 700, color: '#d4a24e', paddingTop: 20 }}>SAR</span>
                <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(5rem, 16vw, 9rem)', fontWeight: 800, color: '#fff', lineHeight: 0.9, letterSpacing: '-0.04em' }}>10</span>
              </div>
              <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15, color: 'rgba(255,255,255,0.4)', marginBottom: 40 }}>per jamaah · per keberangkatan</p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 36 }}>
                {['Tidak ada biaya setup', 'Tidak ada biaya bulanan', 'Bayar hanya jamaah aktif', 'Semua 12 fitur sudah termasuk'].map((t) => (
                  <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.06)' }}>
                    <span style={{ color: '#d4a24e', fontSize: 14 }}>✓</span>
                    <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{t}</p>
                  </div>
                ))}
              </div>

              <div style={{ padding: '20px 24px', background: 'rgba(212,162,78,0.08)', border: '1px solid rgba(212,162,78,0.2)', borderRadius: 14, marginBottom: 36 }}>
                <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>Contoh estimasi biaya:</p>
                <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 16, fontWeight: 700, color: '#d4a24e' }}>40 jamaah = 400 SAR sekali bayar</p>
              </div>

              <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ fontSize: 16, padding: '16px 40px' }}>
                Mulai Sekarang <span className="arrow">↗</span>
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ TESTIMONIALS ══ */}
      <section style={{ padding: '100px 32px', background: '#0d1525' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Reveal>
            <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, fontWeight: 700, color: '#d4a24e', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>• Testimoni</p>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: 60, maxWidth: 440 }}>
              Kata Mereka yang Sudah Pakai
            </h2>
          </Reveal>
          <div className="testimonials-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
            {testimonials.map((t, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <div style={{
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 20, padding: '32px', height: '100%',
                }}>
                  <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
                    {Array(5).fill(0).map((_, j) => <span key={j} style={{ color: '#d4a24e', fontSize: 14 }}>★</span>)}
                  </div>
                  <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 15, color: 'rgba(255,255,255,0.75)', lineHeight: 1.75, marginBottom: 24, fontStyle: 'italic' }}>"{t.text}"</p>
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 20 }}>
                    <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 2 }}>{t.name}</p>
                    <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, color: '#d4a24e' }}>{t.travel}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FAQ ══ */}
      <section style={{ padding: '100px 32px', background: '#080f1c' }}>
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <Reveal>
            <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 11, fontWeight: 700, color: '#d4a24e', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>• FAQ</p>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)', fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: 52 }}>
              Pertanyaan yang Sering Ditanyakan
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            {faqs.map((f, i) => <FAQItem key={i} q={f.q} a={f.a} />)}
          </Reveal>
        </div>
      </section>

      {/* ══ CTA PENUTUP ══ */}
      <section id="kontak" style={{
        padding: '120px 32px',
        background: 'linear-gradient(135deg, #0d1a35 0%, #111e40 100%)',
        position: 'relative', overflow: 'hidden', textAlign: 'center',
      }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 600, height: 600, borderRadius: '50%', background: 'rgba(212,162,78,0.05)', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '40%', height: 1, background: 'linear-gradient(90deg, transparent, rgba(212,162,78,0.5), transparent)' }} />
        <div style={{ maxWidth: 640, margin: '0 auto', position: 'relative' }}>
          <Reveal>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 99, background: 'rgba(212,162,78,0.1)', border: '1px solid rgba(212,162,78,0.25)', marginBottom: 28 }}>
              <span style={{ fontFamily: "'Amiri', serif", fontSize: 16, color: '#d4a24e' }}>بَارَكَ اللَّهُ فِيكُم</span>
            </div>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: 20 }}>
              Siap Upgrade Layanan Travel Anda?
            </h2>
            <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 17, color: 'rgba(255,255,255,0.55)', lineHeight: 1.75, marginBottom: 44, maxWidth: 480, margin: '0 auto 44px' }}>
              Bergabung sekarang dan berikan pengalaman umrah terbaik untuk jamaah Anda. Demo gratis, tidak ada komitmen.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center' }}>
              <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ fontSize: 16, padding: '16px 32px' }}>
                Hubungi Kami via WhatsApp <span className="arrow">↗</span>
              </a>
              <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ fontSize: 15, padding: '15px 28px' }}>
                Minta Demo Gratis
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer style={{ background: '#040a14', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '48px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 32, marginBottom: 40 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, #d4a24e, #b8860b)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 13 }}>🕌</span>
                </div>
                <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 18, fontWeight: 800, color: '#fff' }}>Umrahme</span>
              </div>
              <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>Pendamping umrah digital untuk travel modern</p>
            </div>
            <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
              {[['#fitur', 'Fitur'], ['#harga', 'Harga'], ['#cara-kerja', 'Cara Kerja'], ['#kontak', 'Kontak'], [WA_LINK, 'WhatsApp']].map(([h, l]) => (
                <a key={h} href={h} target={h.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.4)', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = '#d4a24e')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}
                >{l}</a>
              ))}
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 28, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>© {new Date().getFullYear()} Umrahme. All rights reserved.</p>
            <p style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>Dibuat untuk travel umrah Indonesia 🇮🇩</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
