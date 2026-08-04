import { useState, type FormEvent } from 'react';
import { AlertTriangle, CheckCircle2, HeartPulse, MapPin, MessageCircle, Phone, UsersRound } from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { useAuth } from '../context/AuthContext';
import { createHelpRequest, type HelpRequestCategory } from '../lib/supabase';
import { getOperationalInfo, whatsappLink } from '../data/travelCompanion';

const categories: Array<{ value: HelpRequestCategory; label: string; icon: typeof MapPin; color: string; background: string }> = [
  { value: 'tersesat', label: 'Terpisah rombongan', icon: MapPin, color: '#dc2626', background: 'rgba(220,38,38,0.08)' },
  { value: 'kesehatan', label: 'Butuh bantuan kesehatan', icon: HeartPulse, color: '#c2410c', background: 'rgba(234,88,12,0.09)' },
  { value: 'rombongan', label: 'Kendala rombongan', icon: UsersRound, color: '#0f766e', background: 'rgba(13,148,136,0.09)' },
  { value: 'lainnya', label: 'Bantuan lainnya', icon: MessageCircle, color: '#2563eb', background: 'rgba(37,99,235,0.09)' },
];

export default function Bantuan() {
  const { jamaah, tenant, keberangkatan } = useAuth();
  const [category, setCategory] = useState<HelpRequestCategory>('tersesat');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!jamaah || !tenant) return null;

  const info = getOperationalInfo(keberangkatan, jamaah);
  const contactNumber = jamaah.pembimbingWhatsapp ?? info.guideWhatsapp ?? info.tourLeaderWhatsapp;
  const contactName = jamaah.pembimbingNama ?? info.guideName ?? info.tourLeaderName;
  const selected = categories.find((item) => item.value === category) ?? categories[0];
  const SelectedIcon = selected.icon;

  async function submitRequest(event: FormEvent) {
    event.preventDefault();
    if (!jamaah || !tenant) return;
    if (!message.trim()) {
      setError('Ceritakan singkat kendala yang sedang dialami.');
      return;
    }
    setSending(true);
    setError('');
    try {
      await createHelpRequest(tenant.id, jamaah.nomorJamaah, { kategori: category, pesan: message });
      setSubmitted(true);
      setMessage('');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Permintaan bantuan belum terkirim.');
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="min-h-full bg-canvas">
      <PageHeader title="Bantuan Cepat" eyebrow="Jamaah Care" backTo="/beranda" />

      <div className="mx-auto w-full max-w-app px-4 py-5 space-y-4">
        <section className="rounded-2xl border border-red-200 bg-red-50 p-4">
          <div className="flex gap-3">
            <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-red-100 text-red-600"><AlertTriangle className="h-5 w-5" /></span>
            <div>
              <h2 className="text-[14px] font-bold text-red-900">Situasi mendesak?</h2>
              <p className="mt-0.5 text-[11px] leading-relaxed text-red-800">Hubungi pembimbing langsung, lalu kirim laporan agar travel dapat menindaklanjuti.</p>
            </div>
          </div>
          {contactNumber && (
            <a
              href={whatsappLink(contactNumber, `Assalamu'alaikum, saya ${jamaah.nama} butuh bantuan. Saya sedang berada di ${info.meetingPoint}.`)}
              target="_blank"
              rel="noreferrer"
              className="mt-3 flex min-h-11 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 text-[12px] font-bold text-white active:scale-[0.98]"
            >
              <Phone className="h-4 w-4" /> Hubungi {contactName}
            </a>
          )}
        </section>

        {submitted ? (
          <section className="rounded-2xl bg-white p-5 text-center shadow-drop-card" style={{ border: '1px solid rgba(22,163,74,0.18)' }}>
            <CheckCircle2 className="mx-auto h-9 w-9 text-green-600" />
            <h2 className="mt-3 text-[16px] font-bold text-ink">Permintaan bantuan terkirim</h2>
            <p className="mt-1 text-[12px] leading-relaxed text-charcoal">Tim travel sudah dapat melihat laporan Anda. Tetap berada di lokasi aman dan ikuti arahan pembimbing.</p>
            <button type="button" onClick={() => setSubmitted(false)} className="mt-4 rounded-xl bg-surface-bone px-4 py-2.5 text-[12px] font-semibold text-primary">Kirim Laporan Lain</button>
          </section>
        ) : (
          <form onSubmit={submitRequest} className="rounded-2xl bg-white p-4 shadow-drop-card" style={{ border: '1px solid rgba(0,0,0,0.07)' }}>
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-mute">Laporan Bantuan</p>
            <h2 className="mt-1 text-[15px] font-bold text-ink">Apa yang sedang terjadi?</h2>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {categories.map((item) => {
                const Icon = item.icon;
                const active = category === item.value;
                return (
                  <button key={item.value} type="button" onClick={() => setCategory(item.value)}
                    className="flex min-h-[72px] items-center gap-2 rounded-xl px-3 text-left transition-colors"
                    style={{ border: `1px solid ${active ? item.color : 'rgba(0,0,0,0.08)'}`, background: active ? item.background : '#fff', color: active ? item.color : '#4b5563' }}>
                    <Icon className="h-4 w-4 flex-none" />
                    <span className="text-[11px] font-semibold leading-snug">{item.label}</span>
                  </button>
                );
              })}
            </div>
            <label className="mt-4 block">
              <span className="mb-2 block text-[11px] font-semibold text-ink">Pesan untuk travel</span>
              <textarea value={message} onChange={(event) => setMessage(event.target.value)} rows={4} maxLength={500}
                placeholder="Contoh: Saya terpisah dari rombongan di area ..."
                className="w-full resize-none rounded-xl border border-hairline bg-surface-bone px-3 py-3 text-[13px] text-ink outline-none focus:border-primary focus:bg-white"
              />
            </label>
            {error && <p className="mt-2 text-[11px] text-red-600">{error}</p>}
            <button type="submit" disabled={sending}
              className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-[12px] font-bold text-white disabled:opacity-60">
              <SelectedIcon className="h-4 w-4" /> {sending ? 'Mengirim...' : 'Kirim Permintaan Bantuan'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
