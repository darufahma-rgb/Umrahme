import { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const WA_NUMBER = '6281234567890';
const WA_MSG = encodeURIComponent(
  "Assalamu'alaikum, saya pemilik travel umrah dan tertarik dengan Umrahme. Boleh minta info demo?"
);
const WA_LINK = `https://wa.me/${WA_NUMBER}?text=${WA_MSG}`;

function Reveal({
  children,
  delay = 0,
  className = '',
  from = 'bottom',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  from?: 'bottom' | 'left' | 'right' | 'none';
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const initial =
    from === 'bottom' ? { opacity: 0, y: 32 }
    : from === 'left' ? { opacity: 0, x: -32 }
    : from === 'right' ? { opacity: 0, x: 32 }
    : { opacity: 0 };
  return (
    <motion.div
      ref={ref}
      initial={initial}
      animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Phone Mockup ─── */
function PhoneMockup() {
  return (
    <div className="relative flex justify-center items-end" style={{ height: 520 }}>
      {/* glow behind */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'radial-gradient(ellipse at 60% 70%, rgba(212,162,78,0.18) 0%, transparent 65%)',
      }} />
      {/* phone body */}
      <div
        className="relative"
        style={{
          width: 240, height: 490,
          borderRadius: 36,
          background: 'linear-gradient(160deg, #1a2744 0%, #0c1526 100%)',
          border: '5px solid #2a3a5e',
          boxShadow: '0 32px 80px rgba(10,15,30,0.45), 0 0 0 1px rgba(212,162,78,0.12), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}
      >
        {/* notch */}
        <div style={{ position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)', width: 64, height: 6, borderRadius: 6, background: '#2a3a5e' }} />
        {/* screen */}
        <div style={{ position: 'absolute', inset: 8, top: 24, borderRadius: 26, overflow: 'hidden', background: '#f5f0e8' }}>
          {/* app header */}
          <div style={{ background: 'linear-gradient(135deg, #1a2744 0%, #243560 100%)', padding: '12px 14px 10px' }}>
            <p style={{ fontFamily: "'Amiri', serif", color: '#d4a24e', fontSize: 13, textAlign: 'center', marginBottom: 2 }}>بِسْمِ اللهِ الرَّحْمٰنِ</p>
            <p style={{ fontFamily: 'Inter, sans-serif', color: 'rgba(255,255,255,0.65)', fontSize: 9, textAlign: 'center', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Travel Barokah Mandiri</p>
          </div>
          {/* greeting */}
          <div style={{ padding: '10px 12px 6px' }}>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 8, color: '#888', marginBottom: 2 }}>Ahlan, Jamaah!</p>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 600, color: '#1a2744' }}>Ahmad Fauzi</p>
          </div>
          {/* phase badge */}
          <div style={{ margin: '0 12px 8px', background: 'linear-gradient(90deg, rgba(184,134,11,0.12), rgba(212,162,78,0.08))', border: '1px solid rgba(184,134,11,0.2)', borderRadius: 8, padding: '6px 8px', display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#b8860b', flexShrink: 0 }} />
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 8, color: '#7a5200', fontWeight: 500 }}>Fase: Di Tanah Suci</p>
          </div>
          {/* menu grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6, padding: '0 12px 8px' }}>
            {[
              { label: 'Doa', num: '55+' },
              { label: 'Counter', icon: '↻' },
              { label: 'Jadwal', icon: '◷' },
              { label: 'Peta', icon: '◎' },
              { label: 'Kartu', icon: '☰' },
              { label: 'Sertif.', icon: '✦' },
            ].map((m) => (
              <div key={m.label} style={{ background: '#fff', borderRadius: 8, padding: '7px 4px', textAlign: 'center', border: '1px solid rgba(212,162,78,0.15)' }}>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#b8860b', fontWeight: 700, lineHeight: 1 }}>{'num' in m ? m.num : m.icon}</p>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 7.5, color: '#555', marginTop: 3 }}>{m.label}</p>
              </div>
            ))}
          </div>
          {/* agenda card */}
          <div style={{ margin: '0 12px', background: '#fff', border: '1px solid rgba(212,162,78,0.18)', borderRadius: 10, padding: '8px 10px' }}>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 8, fontWeight: 600, color: '#b8860b', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Agenda Hari Ini</p>
            {['07:00 — Tawaf Qudum', '09:30 — Sa\'i', '13:00 — Istirahat Hotel'].map((a) => (
              <p key={a} style={{ fontFamily: 'Inter, sans-serif', fontSize: 8, color: '#444', marginBottom: 3 }}>· {a}</p>
            ))}
          </div>
        </div>
        {/* side button */}
        <div style={{ position: 'absolute', right: -6, top: 100, width: 4, height: 40, borderRadius: '0 3px 3px 0', background: '#2a3a5e' }} />
      </div>
      {/* floating badge */}
      <div style={{
        position: 'absolute', top: 60, right: -20,
        background: '#fff', borderRadius: 14, padding: '10px 14px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 0 0 1px rgba(212,162,78,0.15)',
        minWidth: 130,
      }}>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 8, color: '#888', marginBottom: 2 }}>Branding travel Anda</p>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 10, fontWeight: 600, color: '#1a2744' }}>Logo · Warna · Nama</p>
        <div style={{ marginTop: 6, display: 'flex', gap: 4 }}>
          {['#1a2744', '#b8860b', '#2a6049'].map((c) => (
            <div key={c} style={{ width: 14, height: 14, borderRadius: '50%', background: c }} />
          ))}
        </div>
      </div>
      {/* floating stat */}
      <div style={{
        position: 'absolute', bottom: 60, left: -24,
        background: 'linear-gradient(135deg, #1a2744, #243560)',
        borderRadius: 14, padding: '10px 14px',
        boxShadow: '0 8px 32px rgba(10,15,30,0.3)',
      }}>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 20, fontWeight: 800, color: '#d4a24e', lineHeight: 1 }}>55+</p>
        <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 8, color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>doa ibadah lengkap</p>
      </div>
    </div>
  );
}

/* ─── Bento Feature Cards ─── */
function BentoGrid() {
  const items = [
    {
      id: 'doa', size: 'wide-tall',
      content: (
        <div className="flex flex-col justify-between h-full">
          <div>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 600, color: '#b8860b', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12 }}>Kumpulan Doa Lengkap</p>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 80, fontWeight: 800, color: '#1a2744', lineHeight: 0.85, marginBottom: 8 }}>55<span style={{ fontSize: 40, color: '#b8860b' }}>+</span></p>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, color: '#2a3a5e', marginBottom: 12 }}>doa ibadah</p>
          </div>
          <div>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#555', lineHeight: 1.6 }}>Dari ihram sampai tawaf wada'. Teks Arab, latin, dan terjemahan dalam genggaman jamaah — kapan saja dibutuhkan.</p>
            <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['Arab', 'Latin', 'Terjemahan'].map((t) => (
                <span key={t} style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 500, padding: '4px 10px', borderRadius: 20, background: 'rgba(184,134,11,0.08)', border: '1px solid rgba(184,134,11,0.2)', color: '#7a5200' }}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      ),
      bg: '#fff',
      border: 'rgba(184,134,11,0.2)',
    },
    {
      id: 'counter', size: 'tall',
      content: (
        <div className="flex flex-col justify-between h-full">
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 600, color: '#b8860b', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Counter Tawaf & Sa'i</p>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '16px 0' }}>
            <div style={{
              width: 100, height: 100, borderRadius: '50%',
              background: 'linear-gradient(135deg, #1a2744, #243560)',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 0 8px rgba(26,39,68,0.08)',
            }}>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 40, fontWeight: 800, color: '#d4a24e', lineHeight: 1 }}>3</p>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 9, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.06em' }}>/ 7 putaran</p>
            </div>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 9, color: '#888', textAlign: 'center', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Tawaf Qudum</p>
          </div>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: '#555', lineHeight: 1.6 }}>Tidak salah hitung lagi. Doa per putaran muncul otomatis.</p>
        </div>
      ),
      bg: '#faf8f4',
      border: 'rgba(212,162,78,0.15)',
    },
    {
      id: 'manasik', size: 'normal',
      content: (
        <div className="flex flex-col justify-between h-full">
          <div>
            <svg viewBox="0 0 24 24" fill="none" stroke="#b8860b" strokeWidth={1.5} width={24} height={24} style={{ marginBottom: 12 }}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" />
            </svg>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 600, color: '#b8860b', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Manasik Interaktif</p>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#555', lineHeight: 1.6 }}>Modul belajar tata cara umrah lengkap. Bisa dipelajari jamaah sebelum berangkat.</p>
          </div>
        </div>
      ),
      bg: '#fff',
      border: 'rgba(212,162,78,0.15)',
    },
    {
      id: 'peta', size: 'wide',
      content: (
        <div className="flex items-center justify-between h-full gap-6" style={{ flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 200px' }}>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 600, color: '#b8860b', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Peta Lokasi Ziarah</p>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#555', lineHeight: 1.6 }}>Masjidil Haram, Nabawi, Quba, Uhud, dan 6 lokasi bersejarah lainnya — lengkap dengan sejarah & Google Maps.</p>
          </div>
          <div style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 64, fontWeight: 800, color: '#1a2744', lineHeight: 0.9 }}>10</p>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, color: '#888', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Lokasi Ziarah</p>
          </div>
        </div>
      ),
      bg: '#faf8f4',
      border: 'rgba(212,162,78,0.15)',
    },
    {
      id: 'navigator', size: 'normal',
      content: (
        <div className="flex flex-col justify-between h-full">
          <svg viewBox="0 0 24 24" fill="none" stroke="#1a2744" strokeWidth={1.5} width={24} height={24} style={{ marginBottom: 12 }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
          </svg>
          <div>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 600, color: '#1a2744', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Ritual Navigator</p>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#555', lineHeight: 1.6 }}>Pemandu langkah demi langkah saat ibadah berlangsung.</p>
          </div>
        </div>
      ),
      bg: '#fff',
      border: 'rgba(26,39,68,0.1)',
    },
    {
      id: 'agenda', size: 'normal',
      content: (
        <div className="flex flex-col justify-between h-full">
          <svg viewBox="0 0 24 24" fill="none" stroke="#b8860b" strokeWidth={1.5} width={24} height={24} style={{ marginBottom: 12 }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
          </svg>
          <div>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 600, color: '#b8860b', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Agenda Perjalanan</p>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#555', lineHeight: 1.6 }}>Jadwal harian diatur travel, tampil otomatis di HP jamaah sesuai fase perjalanan.</p>
          </div>
        </div>
      ),
      bg: '#fff',
      border: 'rgba(212,162,78,0.15)',
    },
    {
      id: 'kartu', size: 'normal',
      content: (
        <div className="flex flex-col justify-between h-full">
          <svg viewBox="0 0 24 24" fill="none" stroke="#1a2744" strokeWidth={1.5} width={24} height={24} style={{ marginBottom: 12 }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>
          <div>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 600, color: '#1a2744', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Kartu Jamaah Digital</p>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#555', lineHeight: 1.6 }}>Identitas digital: nama, rombongan, hotel, kontak pembimbing. Berguna saat darurat.</p>
          </div>
        </div>
      ),
      bg: '#faf8f4',
      border: 'rgba(26,39,68,0.08)',
    },
    {
      id: 'sholat', size: 'normal',
      content: (
        <div className="flex flex-col justify-between h-full">
          <svg viewBox="0 0 24 24" fill="none" stroke="#b8860b" strokeWidth={1.5} width={24} height={24} style={{ marginBottom: 12 }}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          <div>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 600, color: '#b8860b', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Jadwal Sholat</p>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#555', lineHeight: 1.6 }}>Waktu sholat akurat di Makkah & Madinah sesuai lokasi jamaah.</p>
          </div>
        </div>
      ),
      bg: '#fff',
      border: 'rgba(212,162,78,0.15)',
    },
    {
      id: 'sertifikat', size: 'wide',
      content: (
        <div className="flex items-center justify-between h-full gap-6" style={{ flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 180px' }}>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 600, color: '#1a2744', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>Sertifikat & Jurnal</p>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: '#555', lineHeight: 1.6 }}>Sertifikat umrah digital + jurnal kenangan perjalanan ibadah — kenangan yang tersimpan selamanya.</p>
          </div>
          <div style={{
            flex: '0 0 auto',
            width: 80, height: 80,
            borderRadius: 16,
            background: 'linear-gradient(135deg, #1a2744, #243560)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#d4a24e" strokeWidth={1.5} width={28} height={28}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
            </svg>
          </div>
        </div>
      ),
      bg: '#faf8f4',
      border: 'rgba(26,39,68,0.08)',
    },
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(12, 1fr)',
      gridAutoRows: 'minmax(140px, auto)',
      gap: 16,
    }}>
      {items.map((item, i) => {
        const span =
          item.size === 'wide-tall' ? 'span 7 / span 7'
          : item.size === 'tall' ? 'span 5 / span 5'
          : item.size === 'wide' ? 'span 7 / span 7'
          : 'span 5 / span 5';

        const rowSpan =
          item.size === 'wide-tall' ? '2'
          : item.size === 'tall' ? '2'
          : '1';

        return (
          <Reveal key={item.id} delay={i * 0.05}>
            <div
              style={{
                gridColumn: span,
                gridRow: rowSpan === '2' ? `span 2` : 'span 1',
                background: item.bg,
                border: `1px solid ${item.border}`,
                borderRadius: 20,
                padding: 24,
                height: '100%',
                minHeight: item.size === 'wide-tall' || item.size === 'tall' ? 300 : 160,
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
              }}
              className="bento-card"
            >
              {item.content}
            </div>
          </Reveal>
        );
      })}
    </div>
  );
}

/* ─── Main Component ─── */
export default function LandingPage() {
  useEffect(() => {
    document.title = 'Umrahme — Digitalisasi layanan jamaah travel Anda';
  }, []);

  return (
    <div style={{ background: '#faf8f4', color: '#1a1a1a', minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600&family=Amiri:wght@400;700&family=Inter:wght@400;500;600;700&display=swap');
        .lp-btn-gold {
          background: linear-gradient(135deg, #b8860b, #d4a24e);
          color: #fff;
          font-weight: 600;
          padding: 14px 28px;
          border-radius: 999px;
          font-size: 15px;
          transition: all 0.25s ease;
          box-shadow: 0 4px 20px rgba(184,134,11,0.28);
          display: inline-block;
          text-decoration: none;
          font-family: Inter, sans-serif;
        }
        .lp-btn-gold:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(184,134,11,0.38); }
        .lp-btn-outline {
          border: 1.5px solid rgba(184,134,11,0.5);
          color: #b8860b;
          font-weight: 600;
          padding: 13px 28px;
          border-radius: 999px;
          font-size: 15px;
          transition: all 0.25s ease;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
          font-family: Inter, sans-serif;
        }
        .lp-btn-outline:hover { background: rgba(184,134,11,0.06); border-color: #b8860b; transform: translateY(-1px); }
        .benefit-card { transition: transform 0.25s ease, box-shadow 0.25s ease; }
        .benefit-card:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(0,0,0,0.06); }
        .bento-card { transition: transform 0.25s ease, box-shadow 0.25s ease; }
        .bento-card:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(0,0,0,0.06); }
        @media (max-width: 768px) {
          .hero-grid { flex-direction: column !important; }
          .hero-text { max-width: 100% !important; }
        }
      `}</style>

      {/* ── Navbar ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(250,248,244,0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(212,162,78,0.15)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', height: 64, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: '#1a2744' }}>Umrahme</span>
            <span style={{ fontSize: 11, fontWeight: 500, padding: '3px 10px', borderRadius: 20, background: 'rgba(184,134,11,0.08)', color: '#7a5200', border: '1px solid rgba(184,134,11,0.15)', fontFamily: 'Inter, sans-serif', letterSpacing: '0.03em' }}>for Travel</span>
          </div>
          <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="lp-btn-gold" style={{ padding: '10px 22px', fontSize: 13 }}>
            Minta Demo
          </a>
        </div>
      </nav>

      {/* ══════════════════════
          SECTION 1 — HERO (Asimetris)
      ══════════════════════ */}
      <section style={{ maxWidth: 1200, margin: '0 auto', padding: '80px 32px 60px' }}>
        <div className="hero-grid" style={{ display: 'flex', alignItems: 'center', gap: 64 }}>
          {/* left — text */}
          <div className="hero-text" style={{ flex: '1 1 0', maxWidth: 560 }}>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              style={{ fontFamily: "'Amiri', serif", fontSize: 22, color: '#b8860b', marginBottom: 20, letterSpacing: '0.03em' }}
            >
              السَّلامُ عَلَيْكُم
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 7, marginBottom: 24, padding: '6px 14px', borderRadius: 999, background: 'rgba(26,39,68,0.05)', border: '1px solid rgba(26,39,68,0.1)' }}
            >
              <span style={{ color: '#b8860b', fontSize: 10 }}>◆</span>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 600, color: '#1a2744', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Untuk Pemilik Travel Umrah</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)',
                fontWeight: 800,
                color: '#1a2744',
                lineHeight: 1.15,
                marginBottom: 24,
              }}
            >
              Digitalisasi layanan jamaah Anda —{' '}
              <em style={{ color: '#b8860b', fontStyle: 'italic' }}>tampil dengan nama travel Anda sendiri</em>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38, duration: 0.6 }}
              style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, color: '#4a4a4a', lineHeight: 1.75, marginBottom: 28, maxWidth: 480 }}
            >
              Umrahme adalah aplikasi pendamping umrah yang bisa Anda white-label sepenuhnya. Jamaah melihatnya sebagai aplikasi milik travel Anda — bukan kami. Satu pendamping untuk seluruh perjalanan ibadah mereka.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.48, duration: 0.5 }}
              style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 36 }}
            >
              {['White-label penuh', 'Ganti buku doa cetak', 'Tanpa perlu install'].map((t) => (
                <span key={t} style={{
                  fontFamily: 'Inter, sans-serif', fontSize: 12, fontWeight: 500,
                  padding: '6px 14px', borderRadius: 999,
                  background: '#fff', border: '1.5px solid rgba(184,134,11,0.25)', color: '#5a3e00',
                }}>
                  {t}
                </span>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.56, duration: 0.5 }}
              style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}
            >
              <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="lp-btn-gold">
                Minta Demo Gratis
              </a>
              <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="lp-btn-outline">
                <svg viewBox="0 0 24 24" fill="currentColor" width={16} height={16}>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.554 4.122 1.526 5.852L.057 23.143a.75.75 0 0 0 .916.944l5.458-1.445A11.944 11.944 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.9 0-3.7-.502-5.263-1.381l-.378-.214-3.928 1.04 1.072-3.835-.234-.393A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                </svg>
                Hubungi via WhatsApp
              </a>
            </motion.div>
          </div>

          {/* right — phone mockup */}
          <motion.div
            style={{ flex: '0 0 auto', width: 340 }}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="hidden md:block"
          >
            <PhoneMockup />
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════
          SECTION 2 — MANFAAT (dua kolom, teks kiri)
      ══════════════════════ */}
      <section style={{ background: '#fff', padding: '96px 0' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
          {/* header — rata kiri, bukan tengah */}
          <Reveal>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 600, color: '#b8860b', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>
              Kenapa Travel Butuh Ini
            </p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: 700, color: '#1a2744', marginBottom: 16, maxWidth: 480 }}>
              Nilai tambah nyata untuk bisnis travel Anda
            </h2>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, color: '#666', lineHeight: 1.7, maxWidth: 440, marginBottom: 56 }}>
              Lebih dari sekadar aplikasi — ini cara travel mendigitalisasi layanan jamaah dan tampil lebih profesional.
            </p>
          </Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
            {[
              {
                num: '01',
                title: 'Brand travel Anda makin kuat',
                desc: 'Nama, logo, dan warna travel tampil di seluruh aplikasi. Jamaah memegang aplikasi bermerek travel Anda setiap hari selama perjalanan — promosi berjalan sepanjang umrah.',
                accent: '#1a2744',
              },
              {
                num: '02',
                title: 'Pengganti buku doa cetak',
                desc: '55+ doa lengkap dengan teks Arab, latin, dan terjemahan dalam genggaman. Hemat biaya cetak, tidak hilang, selalu terbawa. Saat muthowif menjelaskan, jamaah bisa ikuti langsung di aplikasi.',
                accent: '#b8860b',
              },
              {
                num: '03',
                title: 'Beban muthowif & tim lebih ringan',
                desc: 'Pertanyaan berulang seperti "jadwal hari ini apa?", "doanya bagaimana?", "hotel kita di mana?" terjawab sendiri lewat aplikasi. Muthowif fokus membimbing, bukan mengulang informasi.',
                accent: '#1a2744',
              },
              {
                num: '04',
                title: 'Jamaah lebih puas, lebih banyak referral',
                desc: 'Jamaah yang terlayani dengan baik merekomendasikan travel Anda. Pengalaman digital yang rapi jadi pembeda dari travel lain yang masih manual.',
                accent: '#b8860b',
              },
            ].map((b, i) => (
              <Reveal key={b.num} delay={i * 0.08}>
                <div
                  className="benefit-card"
                  style={{
                    background: '#faf8f4',
                    border: '1px solid rgba(212,162,78,0.12)',
                    borderRadius: 20,
                    padding: 28,
                    borderTop: `3px solid ${b.accent}`,
                  }}
                >
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 36, fontWeight: 800, color: 'rgba(0,0,0,0.06)', lineHeight: 1, marginBottom: 16 }}>{b.num}</p>
                  <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 600, color: '#1a2744', marginBottom: 12 }}>{b.title}</p>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: '#555', lineHeight: 1.7 }}>{b.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════
          SECTION 3 — FITUR (Bento Grid)
      ══════════════════════ */}
      <section style={{ padding: '96px 0', background: '#faf8f4' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px' }}>
          <Reveal className="mb-14">
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24, marginBottom: 48 }}>
              <div>
                <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 600, color: '#b8860b', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 14 }}>Fitur Lengkap</p>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: 700, color: '#1a2744', maxWidth: 440 }}>
                  Pendamping lengkap dari persiapan hingga pulang
                </h2>
              </div>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 15, color: '#666', maxWidth: 300, lineHeight: 1.7 }}>
                Semua fitur sudah jadi dan siap pakai — tinggal aktifkan untuk jamaah Anda.
              </p>
            </div>
          </Reveal>
          <BentoGrid />
        </div>
      </section>

      {/* ══════════════════════
          SECTION 4 — CARA KERJA (horizontal timeline)
      ══════════════════════ */}
      <section style={{ background: '#1a2744', padding: '96px 0', position: 'relative', overflow: 'hidden' }}>
        {/* subtle pattern */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 80% 50%, rgba(212,162,78,0.06) 0%, transparent 55%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 32px', position: 'relative' }}>
          <Reveal>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 600, color: '#d4a24e', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 16 }}>Cara Kerja</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: 700, color: '#fff', marginBottom: 56, maxWidth: 420 }}>
              Travel pegang kendali penuh lewat portal
            </h2>
          </Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 0, position: 'relative' }}>
            {/* connector line */}
            <div style={{ position: 'absolute', top: 28, left: '5%', right: '5%', height: 1, background: 'linear-gradient(90deg, rgba(212,162,78,0.2), rgba(212,162,78,0.5), rgba(212,162,78,0.2))', display: 'none' }} className="md:block" />

            {[
              { n: '01', title: 'Atur branding & data lewat portal travel', desc: 'Login ke portal, atur nama travel, logo, warna, data hotel, pembimbing, dan agenda keberangkatan. Semua dalam kendali Anda.' },
              { n: '02', title: 'Bagikan kode aktivasi ke jamaah', desc: 'Setiap keberangkatan dapat kode unik. Jamaah cukup buka link, masukkan kode & nama — langsung masuk tanpa install dari Play Store.' },
              { n: '03', title: 'Kirim pengumuman kapan saja', desc: 'Ada perubahan jadwal atau info penting? Kirim langsung dari portal, muncul di HP semua jamaah. Tidak perlu broadcast WhatsApp satu per satu.' },
            ].map((s, i) => (
              <Reveal key={s.n} delay={i * 0.12}>
                <div style={{ padding: '0 24px', borderLeft: i > 0 ? '1px solid rgba(212,162,78,0.12)' : 'none' }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: 14, marginBottom: 24,
                    background: 'linear-gradient(135deg, #b8860b, #d4a24e)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 8px 24px rgba(184,134,11,0.35)',
                  }}>
                    <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 800, color: '#fff' }}>{s.n}</span>
                  </div>
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 600, color: '#fff', marginBottom: 12, lineHeight: 1.3 }}>{s.title}</h3>
                  <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.75 }}>{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════
          SECTION 5 — HARGA (sangat lega, satu angka)
      ══════════════════════ */}
      <section style={{ padding: '120px 32px', background: '#faf8f4' }}>
        <div style={{ maxWidth: 680, margin: '0 auto', textAlign: 'center' }}>
          <Reveal>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 11, fontWeight: 600, color: '#b8860b', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 24 }}>Harga</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 700, color: '#1a2744', marginBottom: 64 }}>
              Cukup 10 SAR per jamaah. Itu saja.
            </h2>
          </Reveal>

          <Reveal delay={0.1}>
            <div style={{
              background: '#fff',
              border: '1px solid rgba(212,162,78,0.2)',
              borderRadius: 28,
              padding: '64px 48px',
              boxShadow: '0 20px 80px rgba(184,134,11,0.07)',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'center', gap: 4, marginBottom: 12 }}>
                <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 20, fontWeight: 700, color: '#b8860b', paddingTop: 24 }}>SAR</span>
                <span style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: 'clamp(6rem, 18vw, 10rem)',
                  fontWeight: 800,
                  color: '#1a2744',
                  lineHeight: 0.9,
                }}>10</span>
              </div>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 15, color: '#999', marginBottom: 32, letterSpacing: '0.03em' }}>
                per jamaah &nbsp;·&nbsp; per keberangkatan
              </p>

              <div style={{ width: 48, height: 1, background: 'rgba(212,162,78,0.4)', margin: '0 auto 28px' }} />

              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 15, color: '#555', marginBottom: 8 }}>
                Tanpa biaya bulanan, tanpa biaya setup.
              </p>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 15, color: '#555', marginBottom: 40 }}>
                Bayar hanya untuk jamaah yang berangkat.
              </p>

              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontStyle: 'italic', color: '#7a5200', marginBottom: 40, lineHeight: 1.6 }}>
                "Lebih murah dari biaya cetak buku doa per jamaah — tapi nilai yang jamaah terima jauh lebih besar."
              </p>

              <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="lp-btn-gold" style={{ fontSize: 16, padding: '16px 40px' }}>
                Minta Demo Gratis
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══════════════════════
          SECTION 6 — CTA PENUTUP
      ══════════════════════ */}
      <section style={{ background: 'linear-gradient(135deg, #0c1526 0%, #1a2744 100%)', padding: '100px 32px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '60%', height: 1, background: 'linear-gradient(90deg, transparent, rgba(212,162,78,0.5), transparent)' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(212,162,78,0.1) 0%, transparent 55%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <Reveal>
            <p style={{ fontFamily: "'Amiri', serif", fontSize: 32, color: '#d4a24e', marginBottom: 24, letterSpacing: '0.02em' }}>بَارَكَ اللَّهُ فِيكُم</p>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(1.9rem, 4vw, 2.8rem)', fontWeight: 700, color: '#fff', marginBottom: 20, lineHeight: 1.25 }}>
              Jadikan travel Anda yang terdepan dalam pelayanan
            </h2>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 16, color: 'rgba(255,255,255,0.6)', lineHeight: 1.75, marginBottom: 40, maxWidth: 480, margin: '0 auto 40px' }}>
              Coba demo gratis dengan branding travel Anda. Lihat sendiri bagaimana jamaah terbantu sebelum memutuskan.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
              <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="lp-btn-gold">
                Minta Demo Gratis
              </a>
              <a
                href={WA_LINK}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  border: '1.5px solid rgba(212,162,78,0.5)',
                  color: '#d4a24e',
                  fontWeight: 600,
                  padding: '13px 28px',
                  borderRadius: 999,
                  fontSize: 15,
                  transition: 'all 0.25s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  textDecoration: 'none',
                  fontFamily: 'Inter, sans-serif',
                }}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" width={16} height={16}>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.554 4.122 1.526 5.852L.057 23.143a.75.75 0 0 0 .916.944l5.458-1.445A11.944 11.944 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.9 0-3.7-.502-5.263-1.381l-.378-.214-3.928 1.04 1.072-3.835-.234-.393A9.96 9.96 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                </svg>
                Hubungi via WhatsApp
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer style={{ background: '#080f1c', borderTop: '1px solid rgba(212,162,78,0.08)', padding: '40px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
          <div>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 20, fontWeight: 700, color: '#d4a24e', marginBottom: 4 }}>Umrahme</p>
            <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>Pendamping umrah digital untuk travel modern</p>
          </div>
          <div style={{ display: 'flex', gap: 28 }}>
            {[{ l: 'Tentang', h: '#' }, { l: 'Kontak', h: '#' }, { l: 'WhatsApp', h: WA_LINK }].map((link) => (
              <a key={link.l} href={link.h} target={link.h.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.35)', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#d4a24e')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'rgba(255,255,255,0.35)')}
              >{link.l}</a>
            ))}
          </div>
          <p style={{ fontFamily: 'Inter, sans-serif', fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>© {new Date().getFullYear()} Umrahme</p>
        </div>
      </footer>
    </div>
  );
}
