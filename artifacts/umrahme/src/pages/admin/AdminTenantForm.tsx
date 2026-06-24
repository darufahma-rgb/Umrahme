import { useState, useEffect, useRef, useCallback, type FormEvent, type ChangeEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import {
  fetchTenant, createTenant, updateTenant,
  fetchAgenda, createAgenda, deleteAgenda,
  fetchAnnouncements, createAnnouncement, deleteAnnouncement,
  fetchJamaah, createJamaah, updateJamaah, deleteJamaah,
  fetchTravelAccounts, createTravelAccount, revokeTravelAccess,
  uploadLogo as apiUploadLogo,
  uploadHeroImage as apiUploadHeroImage,
  uploadSertifikatTemplate as apiUploadSertifikatTemplate,
  type TenantRow, type AgendaItemRow, type TravelAnnouncementRow, type JamaahAccountRow, type TenantUserRow,
} from '../../lib/supabase';
import { darkenHex, generateActivationCode } from '../../lib/colorUtils';
import { insertAgendaDummy } from '../../data/agendaDummy';

const MAX_LOGO_SIZE = 1024 * 1024;

function isValidHex(val: string) {
  return /^#[0-9A-Fa-f]{6}$/.test(val);
}

function normalizePhone(val: string) {
  return val.replace(/[^\d+]/g, '');
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="block font-mono text-[10px] uppercase tracking-[0.14em] mb-2" style={{ color: '#6b7280' }}>{children}</label>;
}

const inputBase: React.CSSProperties = {
  border: '1px solid rgba(0,0,0,0.09)',
  background: '#fafaf9',
  color: '#111827',
  boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.04)',
};

function StyledInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input {...props}
      className={`w-full rounded-xl px-4 py-3 text-sm transition-all duration-150 focus:outline-none ${props.className ?? ''}`}
      style={{ ...inputBase, ...props.style }}
      onFocus={e => { e.currentTarget.style.border = '1px solid #4338ca'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(67,56,202,0.10)'; e.currentTarget.style.background = '#ffffff'; props.onFocus?.(e); }}
      onBlur={e => { e.currentTarget.style.border = '1px solid rgba(0,0,0,0.09)'; e.currentTarget.style.boxShadow = 'inset 0 1px 2px rgba(0,0,0,0.04)'; e.currentTarget.style.background = '#fafaf9'; props.onBlur?.(e); }} />
  );
}

function StyledTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea {...props}
      className={`w-full rounded-xl px-4 py-3 text-sm transition-all duration-150 focus:outline-none resize-none ${props.className ?? ''}`}
      style={{ ...inputBase, ...props.style }}
      onFocus={e => { e.currentTarget.style.border = '1px solid #4338ca'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(67,56,202,0.10)'; e.currentTarget.style.background = '#ffffff'; props.onFocus?.(e); }}
      onBlur={e => { e.currentTarget.style.border = '1px solid rgba(0,0,0,0.09)'; e.currentTarget.style.boxShadow = 'inset 0 1px 2px rgba(0,0,0,0.04)'; e.currentTarget.style.background = '#fafaf9'; props.onBlur?.(e); }} />
  );
}

function SectionDivider() { return <div style={{ height: '1px', background: 'rgba(0,0,0,0.04)' }} />; }

const cardStyle: React.CSSProperties = {
  background: '#ffffff',
  border: '1px solid rgba(0,0,0,0.06)',
  boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.04)',
};

const FASE_OPTIONS: { value: JamaahAccountRow['fase']; label: string }[] = [
  { value: 'persiapan', label: 'Persiapan' },
  { value: 'tanah-suci', label: 'Di Tanah Suci' },
  { value: 'selesai', label: 'Selesai' },
];

export default function AdminTenantForm() {
  const { id } = useParams<{ id: string }>();
  const isNew = id === 'baru';
  const navigate = useNavigate();

  const [loading, setLoading] = useState(!isNew);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [codeError, setCodeError] = useState('');
  const [dateError, setDateError] = useState('');

  const [namaTravel, setNamaTravel] = useState('');
  const [activationCode, setActivationCode] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#0ea5e9');
  const [primaryDeepColor, setPrimaryDeepColor] = useState('');
  const [pageTitle, setPageTitle] = useState('');
  const [existingLogoUrl, setExistingLogoUrl] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [tanggalKeberangkatan, setTanggalKeberangkatan] = useState('');
  const [tanggalKepulangan, setTanggalKepulangan] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [heroFile, setHeroFile] = useState<File | null>(null);
  const [heroPreview, setHeroPreview] = useState<string>('');
  const [existingHeroUrl, setExistingHeroUrl] = useState<string>('');
  const heroInputRef = useRef<HTMLInputElement>(null);
  const MAX_HERO_SIZE = 3 * 1024 * 1024;

  const [sertifikatFile, setSertifikatFile] = useState<File | null>(null);
  const [sertifikatPreview, setSertifikatPreview] = useState<string>('');
  const [existingSertifikatUrl, setExistingSertifikatUrl] = useState<string>('');
  const sertifikatInputRef = useRef<HTMLInputElement>(null);
  const MAX_SERTIFIKAT_SIZE = 5 * 1024 * 1024;

  const [opHotelMakkah, setOpHotelMakkah] = useState('');
  const [opHotelMadinah, setOpHotelMadinah] = useState('');
  const [opMeetingPoint, setOpMeetingPoint] = useState('');
  const [opGuideName, setOpGuideName] = useState('');
  const [opGuideWhatsapp, setOpGuideWhatsapp] = useState('');
  const [opTourLeaderName, setOpTourLeaderName] = useState('');
  const [opTourLeaderWhatsapp, setOpTourLeaderWhatsapp] = useState('');
  const [opEmergencyNote, setOpEmergencyNote] = useState('');

  const [agendaItems, setAgendaItems] = useState<AgendaItemRow[]>([]);
  const [agendaLoading, setAgendaLoading] = useState(false);
  const [agJudul, setAgJudul] = useState('');
  const [agTanggal, setAgTanggal] = useState('');
  const [agJam, setAgJam] = useState('');
  const [agDeskripsi, setAgDeskripsi] = useState('');
  const [agLokasi, setAgLokasi] = useState('');
  const [agSubmitting, setAgSubmitting] = useState(false);
  const [agError, setAgError] = useState('');
  const [dummyLoading, setDummyLoading] = useState(false);

  const [announcements, setAnnouncements] = useState<TravelAnnouncementRow[]>([]);
  const [annLoading, setAnnLoading] = useState(false);
  const [annLabel, setAnnLabel] = useState('Info');
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annImportant, setAnnImportant] = useState(false);
  const [annSubmitting, setAnnSubmitting] = useState(false);
  const [annError, setAnnError] = useState('');

  const [jamaahList, setJamaahList] = useState<JamaahAccountRow[]>([]);
  const [jamaahLoading, setJamaahLoading] = useState(false);
  const [jmNama, setJmNama] = useState('');
  const [jmNomorJamaah, setJmNomorJamaah] = useState('');
  const [jmRombongan, setJmRombongan] = useState('');
  const [jmBus, setJmBus] = useState('');
  const [jmKamar, setJmKamar] = useState('');
  const [jmFase, setJmFase] = useState<JamaahAccountRow['fase']>('persiapan');
  const [jmSubmitting, setJmSubmitting] = useState(false);
  const [jmError, setJmError] = useState('');

  const [travelAccounts, setTravelAccounts] = useState<TenantUserRow[]>([]);
  const [travelAccountsLoading, setTravelAccountsLoading] = useState(false);
  const [taEmail, setTaEmail] = useState('');
  const [taPassword, setTaPassword] = useState('');
  const [taSubmitting, setTaSubmitting] = useState(false);
  const [taError, setTaError] = useState('');
  const [taSuccess, setTaSuccess] = useState('');

  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrError, setOcrError] = useState('');
  const [ocrResult, setOcrResult] = useState<Record<string, string | null> | null>(null);

  const loadTravelAccounts = useCallback(async () => {
    if (!id || isNew) return;
    setTravelAccountsLoading(true);
    fetchTravelAccounts(id).then(setTravelAccounts).catch(() => {}).finally(() => setTravelAccountsLoading(false));
  }, [id, isNew]);

  const loadAgenda = useCallback(async () => {
    if (!id || isNew) return;
    setAgendaLoading(true);
    fetchAgenda(id).then(setAgendaItems).catch(() => {}).finally(() => setAgendaLoading(false));
  }, [id, isNew]);

  const loadAnnouncements = useCallback(async () => {
    if (!id || isNew) return;
    setAnnLoading(true);
    fetchAnnouncements(id).then(setAnnouncements).catch(() => {}).finally(() => setAnnLoading(false));
  }, [id, isNew]);

  const loadJamaah = useCallback(async () => {
    if (!id || isNew) return;
    setJamaahLoading(true);
    fetchJamaah(id).then(setJamaahList).catch(() => {}).finally(() => setJamaahLoading(false));
  }, [id, isNew]);

  useEffect(() => {
    if (!isNew && id) {
      fetchTenant(id)
        .then((t: TenantRow) => {
          setNamaTravel(t.nama_travel);
          setActivationCode(t.activation_code);
          setPrimaryColor(t.primary_color);
          setPrimaryDeepColor(t.primary_deep_color);
          setPageTitle(t.page_title);
          setExistingLogoUrl(t.logo_url);
          setExistingHeroUrl(t.hero_image_url ?? '');
          setExistingSertifikatUrl(t.sertifikat_template_url ?? '');
          setTanggalKeberangkatan(t.tanggal_keberangkatan ?? '');
          setTanggalKepulangan(t.tanggal_kepulangan ?? '');
          setOpHotelMakkah(t.hotel_makkah ?? '');
          setOpHotelMadinah(t.hotel_madinah ?? '');
          setOpMeetingPoint(t.meeting_point ?? '');
          setOpGuideName(t.guide_name ?? '');
          setOpGuideWhatsapp(t.guide_whatsapp ?? '');
          setOpTourLeaderName(t.tour_leader_name ?? '');
          setOpTourLeaderWhatsapp(t.tour_leader_whatsapp ?? '');
          setOpEmergencyNote(t.emergency_note ?? '');
        })
        .catch(err => setError(err instanceof Error ? err.message : 'Tenant tidak ditemukan.'))
        .finally(() => setLoading(false));
      loadAgenda();
      loadAnnouncements();
      loadJamaah();
      loadTravelAccounts();
    }
  }, [id, isNew, loadAgenda, loadAnnouncements, loadJamaah, loadTravelAccounts]);

  async function handleOcrPoster(file: File) {
    setOcrLoading(true);
    setOcrError('');
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const response = await fetch('/api/ai-ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: base64, mimeType: file.type }),
      });

      const result = await response.json();
      if (!result.ok) throw new Error(result.error);

      const d = result.data as Record<string, string | null>;
      setOcrResult(d);

      if (d.nama_travel) { setNamaTravel(d.nama_travel); if (!pageTitle || pageTitle === buildDefaultTitle(namaTravel)) setPageTitle(buildDefaultTitle(d.nama_travel)); }
      if (d.tanggal_keberangkatan) setTanggalKeberangkatan(d.tanggal_keberangkatan);
      if (d.tanggal_kepulangan) setTanggalKepulangan(d.tanggal_kepulangan);
      if (d.hotel_makkah) setOpHotelMakkah(d.hotel_makkah);
      if (d.hotel_madinah) setOpHotelMadinah(d.hotel_madinah);
      if (d.guide_name) setOpGuideName(d.guide_name);
      if (d.guide_whatsapp) setOpGuideWhatsapp(d.guide_whatsapp);
      if (d.tour_leader_name) setOpTourLeaderName(d.tour_leader_name);
      if (d.tour_leader_whatsapp) setOpTourLeaderWhatsapp(d.tour_leader_whatsapp);
      if (d.meeting_point) setOpMeetingPoint(d.meeting_point);
      if (d.catatan) setOpEmergencyNote(d.catatan);
    } catch (err) {
      setOcrError(err instanceof Error ? err.message : 'Gagal membaca poster.');
    } finally {
      setOcrLoading(false);
    }
  }

  function handleNamaChange(val: string) {
    setNamaTravel(val);
    if (!pageTitle || pageTitle === buildDefaultTitle(namaTravel)) setPageTitle(buildDefaultTitle(val));
  }

  function buildDefaultTitle(nama: string) { return nama ? `${nama} — Pendamping Umrah Anda` : ''; }
  function handleColorChange(val: string) { setPrimaryColor(val); if (!primaryDeepColor) setPrimaryDeepColor(darkenHex(val)); }

  function handleLogoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_LOGO_SIZE) { setError('Ukuran logo maksimal 1MB.'); return; }
    const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Logo harus berupa PNG, JPG, atau WEBP. SVG tidak diizinkan.');
      return;
    }
    setLogoFile(file);
    const reader = new FileReader();
    reader.onload = ev => setLogoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  function handleSertifikatChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_SERTIFIKAT_SIZE) { setError('Ukuran template sertifikat maksimal 5MB.'); return; }
    const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Template sertifikat harus PNG, JPG, atau WEBP.');
      return;
    }
    setSertifikatFile(file);
    const reader = new FileReader();
    reader.onload = ev => setSertifikatPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  function handleHeroChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_HERO_SIZE) { setError('Ukuran hero image maksimal 3MB.'); return; }
    const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Hero image harus berupa PNG, JPG, atau WEBP.');
      return;
    }
    setHeroFile(file);
    const reader = new FileReader();
    reader.onload = ev => setHeroPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  function validateDates(): boolean {
    if (tanggalKeberangkatan && tanggalKepulangan && tanggalKepulangan < tanggalKeberangkatan) {
      setDateError('Tanggal kepulangan harus setelah atau sama dengan tanggal keberangkatan.');
      return false;
    }
    setDateError('');
    return true;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(''); setCodeError('');
    if (!validateDates()) return;
    if (!isValidHex(primaryColor)) {
      setError('Warna primary harus berupa hex valid, contoh: #0ea5e9');
      return;
    }
    setSubmitting(true);
    try {
      let logoUrl = existingLogoUrl;
      if (logoFile) logoUrl = await apiUploadLogo(logoFile);
      let heroImageUrl = existingHeroUrl;
      if (heroFile) heroImageUrl = await apiUploadHeroImage(heroFile);
      let sertifikatTemplateUrl = existingSertifikatUrl;
      if (sertifikatFile) sertifikatTemplateUrl = await apiUploadSertifikatTemplate(sertifikatFile);
      const deepColor = primaryDeepColor || darkenHex(primaryColor);
      const finalTitle = pageTitle || buildDefaultTitle(namaTravel);
      const payload = {
        nama_travel: namaTravel.trim(),
        primary_color: primaryColor,
        primary_deep_color: deepColor,
        logo_url: logoUrl,
        hero_image_url: heroImageUrl || null,
        sertifikat_template_url: sertifikatTemplateUrl || null,
        page_title: finalTitle,
        tanggal_keberangkatan: tanggalKeberangkatan || null,
        tanggal_kepulangan: tanggalKepulangan || null,
        hotel_makkah: opHotelMakkah.trim() || null,
        hotel_madinah: opHotelMadinah.trim() || null,
        meeting_point: opMeetingPoint.trim() || null,
        guide_name: opGuideName.trim() || null,
        guide_whatsapp: opGuideWhatsapp.trim() || null,
        tour_leader_name: opTourLeaderName.trim() || null,
        tour_leader_whatsapp: opTourLeaderWhatsapp.trim() || null,
        emergency_note: opEmergencyNote.trim() || null,
      };
      if (isNew) {
        await createTenant({ ...payload, activation_code: activationCode.trim().toUpperCase() });
        sessionStorage.setItem('admin_toast', `Tenant "${namaTravel}" berhasil dibuat.`);
      } else {
        await updateTenant(id!, payload);
        sessionStorage.setItem('admin_toast', `Tenant "${namaTravel}" berhasil diperbarui.`);
      }
      navigate('/admin', { replace: true });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan.');
      setSubmitting(false);
    }
  }

  async function handleAddAgenda(e: FormEvent) {
    e.preventDefault();
    setAgError('');
    if (!agJudul.trim() || !agTanggal) { setAgError('Tanggal dan judul wajib diisi.'); return; }
    setAgSubmitting(true);
    try {
      await createAgenda(id!, { tanggal: agTanggal, jam_mulai: agJam || null, judul: agJudul.trim(), deskripsi: agDeskripsi.trim() || null, lokasi: agLokasi.trim() || null, urutan: 0 });
      setAgJudul(''); setAgTanggal(''); setAgJam(''); setAgDeskripsi(''); setAgLokasi('');
      await loadAgenda();
    } catch (err: unknown) { setAgError(err instanceof Error ? err.message : 'Gagal menambah agenda.'); }
    setAgSubmitting(false);
  }

  async function handleDeleteAgenda(agendaId: string, judul: string) {
    if (!window.confirm(`Hapus agenda "${judul}"?`)) return;
    await deleteAgenda(id!, agendaId);
    await loadAgenda();
  }

  async function handleInsertDummy() {
    if (!id || isNew) return;
    if (!window.confirm('Tambah itinerary demo (10 hari)? Ini akan menambah banyak agenda baru.')) return;
    setDummyLoading(true);
    const result = await insertAgendaDummy(id);
    setDummyLoading(false);
    if (result.error) { setAgError(result.error); } else { await loadAgenda(); }
  }

  async function handleAddAnnouncement(e: FormEvent) {
    e.preventDefault();
    setAnnError('');
    if (!annTitle.trim() || !annContent.trim()) { setAnnError('Judul dan isi pengumuman wajib diisi.'); return; }
    setAnnSubmitting(true);
    try {
      await createAnnouncement(id!, { label: annLabel.trim() || 'Info', title: annTitle.trim(), content: annContent.trim(), important: annImportant });
      setAnnLabel('Info'); setAnnTitle(''); setAnnContent(''); setAnnImportant(false);
      await loadAnnouncements();
    } catch (err: unknown) { setAnnError(err instanceof Error ? err.message : 'Gagal membuat pengumuman.'); }
    setAnnSubmitting(false);
  }

  async function handleDeleteAnnouncement(annId: string, title: string) {
    if (!window.confirm(`Hapus pengumuman "${title}"?`)) return;
    await deleteAnnouncement(id!, annId);
    await loadAnnouncements();
  }

  async function handleAddJamaah(e: FormEvent) {
    e.preventDefault();
    setJmError('');
    if (!jmNama.trim()) { setJmError('Nama jamaah wajib diisi.'); return; }
    if (!jmNomorJamaah.trim()) { setJmError('Nomor jamaah wajib diisi.'); return; }
    setJmSubmitting(true);
    try {
      await createJamaah(id!, { nama: jmNama.trim(), nomor_jamaah: jmNomorJamaah.trim(), rombongan: jmRombongan.trim() || null, nomor_bus: jmBus.trim() || null, nomor_kamar: jmKamar.trim() || null, fase: jmFase });
      setJmNama(''); setJmNomorJamaah(''); setJmRombongan(''); setJmBus(''); setJmKamar(''); setJmFase('persiapan');
      await loadJamaah();
    } catch (err: unknown) { setJmError(err instanceof Error ? err.message : 'Gagal menambah jamaah.'); }
    setJmSubmitting(false);
  }

  async function handleDeleteJamaah(jamaahId: string, nama: string) {
    if (!window.confirm(`Hapus jamaah "${nama}"? Jamaah ini tidak bisa login lagi.`)) return;
    await deleteJamaah(id!, jamaahId);
    await loadJamaah();
  }

  async function handleUpdateJamaahFase(jamaahId: string, val: string) {
    const fase_override = (val === '' ? null : val) as JamaahAccountRow['fase'] | null;
    await updateJamaah(id!, jamaahId, { fase_override } as Partial<JamaahAccountRow>);
    setJamaahList(prev => prev.map(j => j.id === jamaahId ? { ...j, fase_override } : j));
  }

  async function handleCreateTravelAccount(e: FormEvent) {
    e.preventDefault();
    setTaError(''); setTaSuccess('');
    if (!taEmail.trim()) { setTaError('Email wajib diisi.'); return; }
    if (taPassword.length < 8) { setTaError('Password minimal 8 karakter.'); return; }
    setTaSubmitting(true);
    try {
      await createTravelAccount(id!, taEmail.trim(), taPassword);
      const savedEmail = taEmail.trim();
      setTaEmail(''); setTaPassword('');
      setTaSuccess(`Akun berhasil dibuat. Travel agency bisa login di /travel/login menggunakan email ${savedEmail}.`);
      await loadTravelAccounts();
    } catch (err: unknown) { setTaError(err instanceof Error ? err.message : 'Terjadi kesalahan.'); }
    setTaSubmitting(false);
  }

  async function handleRevokeTravelAccess(mappingId: string, userId: string) {
    if (!window.confirm(`Cabut akses akun ini (user: ${userId.slice(0, 8)}...)? Akun travel tetap ada, hanya koneksi ke tenant ini yang dihapus.`)) return;
    await revokeTravelAccess(id!, mappingId);
    await loadTravelAccounts();
  }

  function formatTanggal(iso: string) { return new Date(iso + 'T00:00:00').toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }); }
  function formatDatetime(iso: string) { return new Date(iso).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }); }

  if (loading) {
    return <AdminLayout><div className="font-mono text-[12px] py-16 text-center" style={{ color: '#d1d5db' }}>Memuat data tenant...</div></AdminLayout>;
  }

  return (
    <AdminLayout>
      <div className="max-w-2xl">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate('/admin')} className="flex items-center gap-1.5 text-[13px] font-medium transition-all duration-150" style={{ color: '#9ca3af' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#4338ca'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#9ca3af'; }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6" /></svg>
            Kembali
          </button>
          <span style={{ color: '#e5e7eb' }}>|</span>
          <h1 className="font-bold leading-tight" style={{ fontSize: '22px', color: '#111827', letterSpacing: '-0.02em' }}>{isNew ? 'Tenant Baru' : 'Edit Tenant'}</h1>
        </div>

        {error && (
          <div className="mb-5 flex items-start gap-2.5 px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.18)', color: '#dc2626' }}>
            <svg className="flex-none mt-0.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-0">

          {/* ── Import dari Poster ── */}
          <div className="rounded-t-2xl px-6 py-5 mb-0" style={{ background: 'rgba(67,56,202,0.03)', border: '2px dashed rgba(67,56,202,0.22)', borderRadius: '16px 16px 0 0' }}>
            <p className="font-mono text-[10px] uppercase tracking-widest mb-1" style={{ color: '#4338ca' }}>
              ✨ Import dari Poster
            </p>
            <p className="text-[12px] mb-3" style={{ color: '#6b7280' }}>
              Upload foto poster/brosur keberangkatan — AI akan membaca dan mengisi form secara otomatis.
            </p>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={e => {
                const file = e.target.files?.[0];
                if (file) handleOcrPoster(file);
              }}
              className="hidden"
              id="poster-upload"
            />
            <label
              htmlFor="poster-upload"
              className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-semibold transition-all"
              style={{ background: '#4338ca', color: '#ffffff' }}
            >
              {ocrLoading ? '⏳ Membaca poster...' : '📎 Pilih Foto Poster'}
            </label>
            {ocrLoading && (
              <p className="mt-2 text-[11px] animate-pulse" style={{ color: '#4338ca' }}>
                AI sedang membaca poster, mohon tunggu...
              </p>
            )}
            {ocrError && (
              <p className="mt-2 text-[11px]" style={{ color: '#dc2626' }}>{ocrError}</p>
            )}
            {ocrResult && !ocrLoading && (
              <p className="mt-2 text-[11px]" style={{ color: '#16a34a' }}>
                ✓ Data berhasil diekstrak dan form telah diisi otomatis. Periksa dan sesuaikan jika perlu.
              </p>
            )}
          </div>

          <SectionDivider />

          <div className="px-6 py-6" style={cardStyle}>
            <FieldLabel>Kode Aktivasi{!isNew && <span className="ml-2 normal-case" style={{ color: '#d1d5db', fontFamily: 'inherit', letterSpacing: 'normal', textTransform: 'none', fontSize: '10px' }}>(tidak dapat diubah)</span>}</FieldLabel>
            {isNew ? (
              <div className="flex gap-2">
                <input type="text" value={activationCode} onChange={e => { setActivationCode(e.target.value.toUpperCase()); setCodeError(''); }} placeholder="Ketik atau klik Generate" maxLength={20} required
                  className="flex-1 font-mono rounded-xl px-4 py-3 text-sm uppercase transition-all duration-150 focus:outline-none" style={{ ...inputBase, letterSpacing: '0.08em' }}
                  onFocus={e => { e.currentTarget.style.border = '1px solid #4338ca'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(67,56,202,0.10)'; e.currentTarget.style.background = '#ffffff'; }}
                  onBlur={e => { e.currentTarget.style.border = '1px solid rgba(0,0,0,0.09)'; e.currentTarget.style.boxShadow = 'inset 0 1px 2px rgba(0,0,0,0.04)'; e.currentTarget.style.background = '#fafaf9'; }} />
                <button type="button" onClick={() => { setActivationCode(generateActivationCode()); setCodeError(''); }}
                  className="px-4 text-[12px] font-semibold rounded-xl transition-all duration-150 whitespace-nowrap"
                  style={{ background: 'rgba(67,56,202,0.07)', color: '#4338ca', border: '1px solid rgba(67,56,202,0.15)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(67,56,202,0.12)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(67,56,202,0.07)'; }}>Generate</button>
              </div>
            ) : (
              <div className="font-mono text-sm px-4 py-3 rounded-xl" style={{ background: 'rgba(67,56,202,0.05)', color: '#4338ca', border: '1px solid rgba(67,56,202,0.12)', letterSpacing: '0.08em' }}>{activationCode}</div>
            )}
            {codeError && <p className="mt-2 text-[12px]" style={{ color: '#dc2626' }}>{codeError}</p>}
          </div>

          <SectionDivider />

          <div className="px-6 py-6" style={cardStyle}>
            <FieldLabel>Nama Travel <span style={{ color: '#f87171' }}>*</span></FieldLabel>
            <StyledInput type="text" value={namaTravel} onChange={e => handleNamaChange(e.target.value)} required placeholder="Barakah Mulia Wisata" maxLength={80} />
          </div>

          <SectionDivider />

          <div className="px-6 py-6" style={cardStyle}>
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] mb-4" style={{ color: '#6b7280' }}>Warna Brand</p>
            <div className="rounded-xl p-4 space-y-5" style={{ background: '#fafaf9', border: '1px solid rgba(0,0,0,0.05)' }}>
              <div>
                <p className="text-[11px] font-semibold mb-2.5" style={{ color: '#374151' }}>Primary <span className="ml-2 font-normal" style={{ color: '#9ca3af' }}>— warna brand utama</span></p>
                <div className="flex items-center gap-3">
                  <input type="color" value={primaryColor} onChange={e => handleColorChange(e.target.value)} className="h-10 w-14 rounded-lg cursor-pointer flex-none" style={{ border: '1px solid rgba(0,0,0,0.10)' }} />
                  <input type="text" value={primaryColor} onChange={e => { if (/^#[0-9a-fA-F]{0,6}$/.test(e.target.value)) handleColorChange(e.target.value); }} className="font-mono rounded-xl px-3 py-2.5 text-[13px] transition-all duration-150 focus:outline-none" style={{ ...inputBase, width: '120px', letterSpacing: '0.04em' }} onFocus={e => { e.currentTarget.style.border = '1px solid #4338ca'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(67,56,202,0.10)'; e.currentTarget.style.background = '#ffffff'; }} onBlur={e => { e.currentTarget.style.border = '1px solid rgba(0,0,0,0.09)'; e.currentTarget.style.boxShadow = 'inset 0 1px 2px rgba(0,0,0,0.04)'; e.currentTarget.style.background = '#fafaf9'; }} />
                  <div className="flex-1 h-8 rounded-lg" style={{ background: primaryColor, opacity: 0.25 }} />
                </div>
              </div>
              <div style={{ height: '1px', background: 'rgba(0,0,0,0.06)' }} />
              <div>
                <p className="text-[11px] font-semibold mb-2.5" style={{ color: '#374151' }}>Primary-Deep <span className="ml-2 font-normal" style={{ color: '#9ca3af' }}>— hover/active (auto jika kosong)</span></p>
                <div className="flex items-center gap-3">
                  <input type="color" value={primaryDeepColor || darkenHex(primaryColor)} onChange={e => setPrimaryDeepColor(e.target.value)} className="h-10 w-14 rounded-lg cursor-pointer flex-none" style={{ border: '1px solid rgba(0,0,0,0.10)' }} />
                  <input type="text" value={primaryDeepColor} onChange={e => { if (/^#[0-9a-fA-F]{0,6}$/.test(e.target.value)) setPrimaryDeepColor(e.target.value); }} placeholder={darkenHex(primaryColor)} className="font-mono rounded-xl px-3 py-2.5 text-[13px] transition-all duration-150 focus:outline-none" style={{ ...inputBase, width: '120px', letterSpacing: '0.04em' }} onFocus={e => { e.currentTarget.style.border = '1px solid #4338ca'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(67,56,202,0.10)'; e.currentTarget.style.background = '#ffffff'; }} onBlur={e => { e.currentTarget.style.border = '1px solid rgba(0,0,0,0.09)'; e.currentTarget.style.boxShadow = 'inset 0 1px 2px rgba(0,0,0,0.04)'; e.currentTarget.style.background = '#fafaf9'; }} />
                  {primaryDeepColor && (
                    <button type="button" onClick={() => setPrimaryDeepColor('')} className="text-[11px] transition-all duration-150" style={{ color: '#9ca3af' }} onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#4338ca'; }} onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#9ca3af'; }}>Reset ke auto</button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <SectionDivider />

          <div className="px-6 py-6" style={cardStyle}>
            <FieldLabel>Logo Tenant</FieldLabel>
            <div className="flex items-start gap-4">
              <div className="flex-none w-28 rounded-xl flex items-center justify-center overflow-hidden cursor-pointer transition-all duration-150" style={{ border: logoPreview || existingLogoUrl ? '1px solid rgba(0,0,0,0.08)' : '2px dashed rgba(0,0,0,0.12)', background: '#fafaf9', height: '72px' }} onClick={() => fileInputRef.current?.click()}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#4338ca'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = logoPreview || existingLogoUrl ? 'rgba(0,0,0,0.08)' : 'rgba(0,0,0,0.12)'; }}>
                {logoPreview ? <img src={logoPreview} alt="Preview" className="max-w-full max-h-full object-contain p-2" /> : existingLogoUrl ? <img src={existingLogoUrl} alt="Logo" className="max-w-full max-h-full object-contain p-2" /> : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>}
              </div>
              <div className="flex-1">
                <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-4 py-2.5 text-[12px] font-semibold rounded-xl transition-all duration-150" style={{ background: 'rgba(67,56,202,0.07)', color: '#4338ca', border: '1px solid rgba(67,56,202,0.15)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(67,56,202,0.12)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(67,56,202,0.07)'; }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /></svg>
                  Pilih File
                </button>
                <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={handleLogoChange} className="hidden" />
                <p className="mt-2 text-[11px]" style={{ color: '#9ca3af' }}>PNG, JPG, WebP — maks. 1MB. SVG tidak didukung.</p>
                {(logoPreview || existingLogoUrl) && (
                  <button type="button" onClick={() => { setLogoFile(null); setLogoPreview(null); setExistingLogoUrl(null); }} className="mt-1 text-[11px] transition-all duration-150" style={{ color: '#9ca3af' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#dc2626'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#9ca3af'; }}>Hapus logo</button>
                )}
              </div>
            </div>

            <div style={{ height: '1px', background: 'rgba(0,0,0,0.05)', margin: '0 -24px' }} />

            {/* ── Hero Image ─────────────────────────────── */}
            <div className="pt-5">
              <label className="block text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: '#9ca3af' }}>
                Hero Image (Background Beranda)
              </label>

              {(heroPreview || existingHeroUrl) && (
                <div className="mb-3 rounded-xl overflow-hidden" style={{ height: '120px' }}>
                  <img
                    src={heroPreview || existingHeroUrl}
                    alt="Hero preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => heroInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2.5 text-[12px] font-semibold rounded-xl transition-all duration-150"
                  style={{ background: 'rgba(67,56,202,0.07)', color: '#4338ca', border: '1px solid rgba(67,56,202,0.15)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(67,56,202,0.12)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(67,56,202,0.07)'; }}
                >
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  {existingHeroUrl || heroPreview ? 'Ganti Hero Image' : 'Upload Hero Image'}
                </button>
                {(heroPreview || existingHeroUrl) && (
                  <button
                    type="button"
                    onClick={() => { setHeroFile(null); setHeroPreview(''); setExistingHeroUrl(''); }}
                    className="text-[11px] transition-colors"
                    style={{ color: '#f87171' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#dc2626'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#f87171'; }}
                  >
                    Hapus
                  </button>
                )}
              </div>

              <input
                ref={heroInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleHeroChange}
                className="hidden"
              />
              <p className="mt-1.5 text-[10px]" style={{ color: '#9ca3af' }}>
                Maks 3MB · PNG, JPG, WEBP · Rekomendasi: 1200×600px landscape
              </p>
            </div>

            <div style={{ height: '1px', background: 'rgba(0,0,0,0.05)', margin: '20px -24px' }} />

            {/* ── Template Sertifikat ─────────────────────────── */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-widest mb-2" style={{ color: '#9ca3af' }}>
                Template Sertifikat
              </label>

              {(sertifikatPreview || existingSertifikatUrl) && (
                <div className="mb-3 rounded-xl overflow-hidden border border-slate-200" style={{ aspectRatio: '16/9', maxHeight: '120px' }}>
                  <img
                    src={sertifikatPreview || existingSertifikatUrl}
                    alt="Preview template sertifikat"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => sertifikatInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2.5 text-[12px] font-semibold rounded-xl transition-all duration-150"
                  style={{ background: 'rgba(67,56,202,0.07)', color: '#4338ca', border: '1px solid rgba(67,56,202,0.15)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(67,56,202,0.12)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(67,56,202,0.07)'; }}
                >
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="17 8 12 3 7 8"/>
                    <line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  {existingSertifikatUrl || sertifikatPreview ? 'Ganti Template' : 'Upload Template'}
                </button>
                {(sertifikatPreview || existingSertifikatUrl) && (
                  <button
                    type="button"
                    onClick={() => { setSertifikatFile(null); setSertifikatPreview(''); setExistingSertifikatUrl(''); }}
                    className="text-[11px] transition-colors"
                    style={{ color: '#f87171' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#dc2626'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#f87171'; }}
                  >
                    Hapus
                  </button>
                )}
              </div>

              <input
                ref={sertifikatInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleSertifikatChange}
                className="hidden"
              />
              <p className="mt-1.5 text-[10px]" style={{ color: '#9ca3af' }}>
                Maks 5MB · PNG, JPG, WEBP · Rekomendasi: landscape 1200×848px
              </p>
              <p className="mt-1 text-[10px]" style={{ color: '#d97706' }}>
                Pastikan template punya area kosong untuk nama jamaah di tengah
              </p>
            </div>
          </div>

          <SectionDivider />

          <div className="px-6 py-6" style={cardStyle}>
            <FieldLabel>Judul Halaman</FieldLabel>
            <StyledInput type="text" value={pageTitle} onChange={e => setPageTitle(e.target.value)} placeholder={buildDefaultTitle(namaTravel) || 'Nama Travel — Pendamping Umrah Anda'} />
            <p className="mt-2 text-[11px]" style={{ color: '#9ca3af' }}>Muncul di tab browser jamaah. Kosongkan untuk pakai default.</p>
          </div>

          <SectionDivider />

          <div className="px-6 py-6" style={cardStyle}>
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] mb-4" style={{ color: '#6b7280' }}>Jadwal Perjalanan</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] font-semibold mb-2" style={{ color: '#374151' }}>Tanggal Keberangkatan</p>
                <StyledInput type="date" value={tanggalKeberangkatan} onChange={e => { setTanggalKeberangkatan(e.target.value); setDateError(''); }} />
              </div>
              <div>
                <p className="text-[11px] font-semibold mb-2" style={{ color: '#374151' }}>Tanggal Kepulangan</p>
                <StyledInput type="date" value={tanggalKepulangan} onChange={e => { setTanggalKepulangan(e.target.value); setDateError(''); }} />
              </div>
            </div>
            {dateError && <p className="mt-2 text-[12px] flex items-center gap-1.5" style={{ color: '#d97706' }}>{dateError}</p>}
          </div>

          <SectionDivider />

          <div className="rounded-b-2xl px-6 py-6" style={cardStyle}>
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] mb-4" style={{ color: '#6b7280' }}>Info Operasional</p>
            <p className="text-[11px] mb-4" style={{ color: '#9ca3af' }}>Semua field optional — kosong berarti tampilkan nilai default.</p>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-[11px] font-semibold mb-1.5" style={{ color: '#374151' }}>Hotel Makkah</p><StyledInput type="text" value={opHotelMakkah} onChange={e => setOpHotelMakkah(e.target.value)} placeholder="Nama & no kamar hotel" maxLength={120} /></div>
                <div><p className="text-[11px] font-semibold mb-1.5" style={{ color: '#374151' }}>Hotel Madinah</p><StyledInput type="text" value={opHotelMadinah} onChange={e => setOpHotelMadinah(e.target.value)} placeholder="Nama & no kamar hotel" maxLength={120} /></div>
              </div>
              <div><p className="text-[11px] font-semibold mb-1.5" style={{ color: '#374151' }}>Titik Kumpul</p><StyledInput type="text" value={opMeetingPoint} onChange={e => setOpMeetingPoint(e.target.value)} placeholder="Cth: Lobby hotel lantai 1" maxLength={160} /></div>
              <div style={{ height: '1px', background: 'rgba(0,0,0,0.05)' }} />
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-[11px] font-semibold mb-1.5" style={{ color: '#374151' }}>Nama Muthowwif</p><StyledInput type="text" value={opGuideName} onChange={e => setOpGuideName(e.target.value)} placeholder="Ust. Ahmad" maxLength={80} /></div>
                <div><p className="text-[11px] font-semibold mb-1.5" style={{ color: '#374151' }}>WhatsApp Muthowwif</p><StyledInput type="text" value={opGuideWhatsapp} onChange={e => setOpGuideWhatsapp(normalizePhone(e.target.value))} placeholder="628xxxxxxxxxx" /></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-[11px] font-semibold mb-1.5" style={{ color: '#374151' }}>Nama Tour Leader</p><StyledInput type="text" value={opTourLeaderName} onChange={e => setOpTourLeaderName(e.target.value)} placeholder="Bpk. Budi" maxLength={80} /></div>
                <div><p className="text-[11px] font-semibold mb-1.5" style={{ color: '#374151' }}>WhatsApp Tour Leader</p><StyledInput type="text" value={opTourLeaderWhatsapp} onChange={e => setOpTourLeaderWhatsapp(normalizePhone(e.target.value))} placeholder="628xxxxxxxxxx" /></div>
              </div>
              <div><p className="text-[11px] font-semibold mb-1.5" style={{ color: '#374151' }}>Catatan Darurat</p><StyledTextarea rows={2} value={opEmergencyNote} onChange={e => setOpEmergencyNote(e.target.value)} placeholder="Instruksi jika jamaah tersesat atau butuh bantuan darurat..." /></div>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-7">
            <button type="submit" disabled={submitting} className="font-semibold text-[13px] px-7 py-3 rounded-xl transition-all duration-150 active:scale-[0.98] disabled:opacity-60"
              style={{ background: submitting ? '#6366f1' : 'linear-gradient(135deg, #4338ca 0%, #4f46e5 100%)', color: '#ffffff', boxShadow: submitting ? 'none' : '0 2px 8px rgba(67,56,202,0.26), 0 1px 2px rgba(67,56,202,0.18)' }}>
              {submitting ? <span className="flex items-center gap-2"><svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" /><path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>Menyimpan...</span> : isNew ? 'Buat Tenant' : 'Simpan Perubahan'}
            </button>
            <button type="button" onClick={() => navigate('/admin')} className="text-[13px] font-medium px-4 py-3 rounded-xl transition-all duration-150" style={{ color: '#9ca3af' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#374151'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.04)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#9ca3af'; (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}>Batal</button>
          </div>
        </form>

        {!isNew && (
          <>
            {/* Agenda */}
            <div className="mt-10">
              <div className="flex items-center gap-3 mb-5">
                <h2 className="font-bold" style={{ fontSize: '18px', color: '#111827', letterSpacing: '-0.02em' }}>Agenda Perjalanan</h2>
                <span className="font-mono text-[10px] uppercase tracking-widest px-2 py-1 rounded-full" style={{ background: 'rgba(67,56,202,0.07)', color: '#4338ca' }}>{agendaItems.length} item</span>
                <button type="button" onClick={handleInsertDummy} disabled={dummyLoading} className="ml-auto text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-all duration-150 disabled:opacity-60" style={{ color: '#6b7280', border: '1px solid rgba(0,0,0,0.10)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#4338ca'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(67,56,202,0.25)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#6b7280'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,0,0,0.10)'; }}>
                  {dummyLoading ? 'Memasukkan...' : '+ Itinerary Demo'}
                </button>
              </div>

              <div className="rounded-2xl px-6 py-6 mb-4" style={{ ...cardStyle, border: '1px solid rgba(67,56,202,0.12)' }}>
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] mb-4" style={{ color: '#6b7280' }}>Tambah Agenda Baru</p>
                <form onSubmit={handleAddAgenda} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div><p className="text-[11px] font-semibold mb-1.5" style={{ color: '#374151' }}>Tanggal <span style={{ color: '#f87171' }}>*</span></p><StyledInput type="date" value={agTanggal} onChange={e => setAgTanggal(e.target.value)} required /></div>
                    <div><p className="text-[11px] font-semibold mb-1.5" style={{ color: '#374151' }}>Jam Mulai</p><StyledInput type="time" value={agJam} onChange={e => setAgJam(e.target.value)} /></div>
                  </div>
                  <div><p className="text-[11px] font-semibold mb-1.5" style={{ color: '#374151' }}>Judul Kegiatan <span style={{ color: '#f87171' }}>*</span></p><StyledInput type="text" value={agJudul} onChange={e => setAgJudul(e.target.value)} placeholder="Cth: Perjalanan ke Madinah" required /></div>
                  <div className="grid grid-cols-2 gap-3">
                    <div><p className="text-[11px] font-semibold mb-1.5" style={{ color: '#374151' }}>Lokasi</p><StyledInput type="text" value={agLokasi} onChange={e => setAgLokasi(e.target.value)} placeholder="Bandara Soekarno-Hatta" /></div>
                    <div><p className="text-[11px] font-semibold mb-1.5" style={{ color: '#374151' }}>Deskripsi</p><StyledTextarea rows={1} value={agDeskripsi} onChange={e => setAgDeskripsi(e.target.value)} placeholder="Keterangan tambahan..." /></div>
                  </div>
                  {agError && <p className="text-[12px]" style={{ color: '#dc2626' }}>{agError}</p>}
                  <button type="submit" disabled={agSubmitting} className="flex items-center gap-2 px-5 py-2.5 text-[12px] font-semibold rounded-xl transition-all duration-150 disabled:opacity-60"
                    style={{ background: 'linear-gradient(135deg, #4338ca 0%, #4f46e5 100%)', color: '#ffffff', boxShadow: '0 2px 8px rgba(67,56,202,0.22)' }}>
                    {agSubmitting ? <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" /><path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg> : <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>}
                    Tambah Agenda
                  </button>
                </form>
              </div>

              <div className="rounded-2xl overflow-hidden" style={cardStyle}>
                {agendaLoading ? <div className="py-10 text-center font-mono text-[12px]" style={{ color: '#d1d5db' }}>Memuat agenda...</div> : agendaItems.length === 0 ? <div className="py-10 text-center"><p className="text-[13px]" style={{ color: '#9ca3af' }}>Belum ada agenda.</p></div> : (
                  <table className="w-full">
                    <thead><tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)', background: '#fafaf9' }}>
                      {['Tanggal', 'Jam', 'Judul', 'Lokasi', ''].map(h => <th key={h} className="text-left font-mono text-[10px] uppercase tracking-[0.12em] px-5 py-3" style={{ color: '#9ca3af' }}>{h}</th>)}
                    </tr></thead>
                    <tbody>
                      {agendaItems.map((item, i) => (
                        <tr key={item.id} style={{ borderBottom: i < agendaItems.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none' }}>
                          <td className="px-5 py-3.5 text-[13px] font-medium whitespace-nowrap" style={{ color: '#374151' }}>{formatTanggal(item.tanggal)}</td>
                          <td className="px-5 py-3.5 font-mono text-[12px]" style={{ color: '#6b7280' }}>{item.jam_mulai ? item.jam_mulai.slice(0, 5) : '—'}</td>
                          <td className="px-5 py-3.5"><p className="text-[13px] font-semibold" style={{ color: '#111827' }}>{item.judul}</p>{item.deskripsi && <p className="text-[11px] mt-0.5" style={{ color: '#9ca3af' }}>{item.deskripsi}</p>}</td>
                          <td className="px-5 py-3.5 text-[12px]" style={{ color: '#6b7280' }}>{item.lokasi ?? '—'}</td>
                          <td className="px-5 py-3.5 text-right">
                            <button type="button" onClick={() => handleDeleteAgenda(item.id, item.judul)} className="font-mono text-[11px] px-3 py-1.5 rounded-lg transition-all duration-150" style={{ color: '#9ca3af', border: '1px solid rgba(0,0,0,0.07)' }}
                              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#dc2626'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(220,38,38,0.25)'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(220,38,38,0.05)'; }}
                              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#9ca3af'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,0,0,0.07)'; (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}>Hapus</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* Pengumuman */}
            <div className="mt-10">
              <div className="flex items-center gap-3 mb-5">
                <h2 className="font-bold" style={{ fontSize: '18px', color: '#111827', letterSpacing: '-0.02em' }}>Pengumuman Travel</h2>
                <span className="font-mono text-[10px] uppercase tracking-widest px-2 py-1 rounded-full" style={{ background: 'rgba(67,56,202,0.07)', color: '#4338ca' }}>{announcements.length} item</span>
              </div>
              <div className="rounded-2xl px-6 py-6 mb-4" style={{ ...cardStyle, border: '1px solid rgba(67,56,202,0.12)' }}>
                <form onSubmit={handleAddAnnouncement} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div><p className="text-[11px] font-semibold mb-1.5" style={{ color: '#374151' }}>Label</p><StyledInput type="text" value={annLabel} onChange={e => setAnnLabel(e.target.value)} placeholder="Info / Penting / Darurat" /></div>
                    <div><p className="text-[11px] font-semibold mb-1.5" style={{ color: '#374151' }}>Judul <span style={{ color: '#f87171' }}>*</span></p><StyledInput type="text" value={annTitle} onChange={e => setAnnTitle(e.target.value)} required placeholder="Perubahan jadwal..." maxLength={120} /></div>
                  </div>
                  <div><p className="text-[11px] font-semibold mb-1.5" style={{ color: '#374151' }}>Isi Pengumuman <span style={{ color: '#f87171' }}>*</span></p><StyledTextarea rows={3} value={annContent} onChange={e => setAnnContent(e.target.value)} required placeholder="Detail pengumuman untuk jamaah..." maxLength={1000} /></div>
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input type="checkbox" checked={annImportant} onChange={e => setAnnImportant(e.target.checked)} className="rounded" />
                    <span className="text-[12px]" style={{ color: '#374151' }}>Tandai sebagai penting</span>
                  </label>
                  {annError && <p className="text-[12px]" style={{ color: '#dc2626' }}>{annError}</p>}
                  <button type="submit" disabled={annSubmitting} className="flex items-center gap-2 px-5 py-2.5 text-[12px] font-semibold rounded-xl transition-all duration-150 disabled:opacity-60"
                    style={{ background: 'linear-gradient(135deg, #4338ca 0%, #4f46e5 100%)', color: '#ffffff', boxShadow: '0 2px 8px rgba(67,56,202,0.22)' }}>
                    Kirim Pengumuman
                  </button>
                </form>
              </div>
              <div className="rounded-2xl overflow-hidden" style={cardStyle}>
                {annLoading ? <div className="py-8 text-center font-mono text-[12px]" style={{ color: '#d1d5db' }}>Memuat...</div> : announcements.length === 0 ? <div className="py-8 text-center text-[13px]" style={{ color: '#9ca3af' }}>Belum ada pengumuman.</div> : (
                  <div className="divide-y" style={{ borderColor: 'rgba(0,0,0,0.04)' }}>
                    {announcements.map(ann => (
                      <div key={ann.id} className="px-5 py-4 flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-[10px] px-2 py-0.5 rounded-full" style={{ background: ann.important ? 'rgba(239,68,68,0.08)' : 'rgba(67,56,202,0.07)', color: ann.important ? '#dc2626' : '#4338ca' }}>{ann.label}</span>
                            <span className="font-mono text-[10px]" style={{ color: '#9ca3af' }}>{formatDatetime(ann.published_at)}</span>
                          </div>
                          <p className="text-[13px] font-semibold truncate" style={{ color: '#111827' }}>{ann.title}</p>
                          <p className="text-[12px] mt-0.5 truncate" style={{ color: '#6b7280' }}>{ann.content}</p>
                        </div>
                        <button type="button" onClick={() => handleDeleteAnnouncement(ann.id, ann.title)} className="flex-none font-mono text-[11px] px-3 py-1.5 rounded-lg transition-all duration-150" style={{ color: '#9ca3af', border: '1px solid rgba(0,0,0,0.07)' }}
                          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#dc2626'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(220,38,38,0.25)'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(220,38,38,0.05)'; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#9ca3af'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,0,0,0.07)'; (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}>Hapus</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Daftar Jamaah */}
            <div className="mt-10">
              <div className="flex items-center gap-3 mb-5">
                <h2 className="font-bold" style={{ fontSize: '18px', color: '#111827', letterSpacing: '-0.02em' }}>Daftar Jamaah</h2>
                <span className="font-mono text-[10px] uppercase tracking-widest px-2 py-1 rounded-full" style={{ background: 'rgba(67,56,202,0.07)', color: '#4338ca' }}>{jamaahList.length} jamaah</span>
              </div>
              <div className="rounded-2xl px-6 py-6 mb-4" style={{ ...cardStyle, border: '1px solid rgba(67,56,202,0.12)' }}>
                <form onSubmit={handleAddJamaah} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div><p className="text-[11px] font-semibold mb-1.5" style={{ color: '#374151' }}>Nama <span style={{ color: '#f87171' }}>*</span></p><StyledInput type="text" value={jmNama} onChange={e => setJmNama(e.target.value)} placeholder="Nama lengkap sesuai paspor" required /></div>
                    <div><p className="text-[11px] font-semibold mb-1.5" style={{ color: '#374151' }}>No. Jamaah <span style={{ color: '#f87171' }}>*</span></p><StyledInput type="text" value={jmNomorJamaah} onChange={e => setJmNomorJamaah(e.target.value)} placeholder="001" required /></div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div><p className="text-[11px] font-semibold mb-1.5" style={{ color: '#374151' }}>Rombongan</p><StyledInput type="text" value={jmRombongan} onChange={e => setJmRombongan(e.target.value)} placeholder="A" /></div>
                    <div><p className="text-[11px] font-semibold mb-1.5" style={{ color: '#374151' }}>No. Bus</p><StyledInput type="text" value={jmBus} onChange={e => setJmBus(e.target.value)} placeholder="3" /></div>
                    <div><p className="text-[11px] font-semibold mb-1.5" style={{ color: '#374151' }}>No. Kamar</p><StyledInput type="text" value={jmKamar} onChange={e => setJmKamar(e.target.value)} placeholder="804" /></div>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold mb-1.5" style={{ color: '#374151' }}>Fase</p>
                    <select value={jmFase} onChange={e => setJmFase(e.target.value as JamaahAccountRow['fase'])} className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-all duration-150" style={{ ...inputBase }}>
                      {FASE_OPTIONS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                    </select>
                  </div>
                  {jmError && <p className="text-[12px]" style={{ color: '#dc2626' }}>{jmError}</p>}
                  <button type="submit" disabled={jmSubmitting} className="flex items-center gap-2 px-5 py-2.5 text-[12px] font-semibold rounded-xl transition-all duration-150 disabled:opacity-60"
                    style={{ background: 'linear-gradient(135deg, #4338ca 0%, #4f46e5 100%)', color: '#ffffff', boxShadow: '0 2px 8px rgba(67,56,202,0.22)' }}>
                    Tambah Jamaah
                  </button>
                </form>
              </div>
              <div className="rounded-2xl overflow-hidden" style={cardStyle}>
                {jamaahLoading ? <div className="py-8 text-center font-mono text-[12px]" style={{ color: '#d1d5db' }}>Memuat...</div> : jamaahList.length === 0 ? <div className="py-8 text-center text-[13px]" style={{ color: '#9ca3af' }}>Belum ada jamaah terdaftar.</div> : (
                  <table className="w-full">
                    <thead><tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)', background: '#fafaf9' }}>
                      {['Nama', 'No. Jamaah', 'Rombongan', 'Fase', ''].map(h => <th key={h} className="text-left font-mono text-[10px] uppercase tracking-[0.12em] px-5 py-3" style={{ color: '#9ca3af' }}>{h}</th>)}
                    </tr></thead>
                    <tbody>
                      {jamaahList.map((j, i) => (
                        <tr key={j.id} style={{ borderBottom: i < jamaahList.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none' }}>
                          <td className="px-5 py-3.5 text-[13px] font-semibold" style={{ color: '#111827' }}>{j.nama}</td>
                          <td className="px-5 py-3.5 font-mono text-[12px]" style={{ color: '#6b7280' }}>{j.nomor_jamaah}</td>
                          <td className="px-5 py-3.5 text-[12px]" style={{ color: '#6b7280' }}>{j.rombongan ?? '—'}</td>
                          <td className="px-5 py-3.5">
                            <select value={j.fase_override ?? ''} onChange={e => handleUpdateJamaahFase(j.id, e.target.value)} className="text-[11px] rounded-lg px-2 py-1 focus:outline-none transition-all" style={{ border: '1px solid rgba(0,0,0,0.09)', background: '#fafaf9', color: '#374151' }}>
                              <option value="">Otomatis (dari jadwal)</option>
                              {FASE_OPTIONS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                            </select>
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            <button type="button" onClick={() => handleDeleteJamaah(j.id, j.nama)} className="font-mono text-[11px] px-3 py-1.5 rounded-lg transition-all duration-150" style={{ color: '#9ca3af', border: '1px solid rgba(0,0,0,0.07)' }}
                              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#dc2626'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(220,38,38,0.25)'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(220,38,38,0.05)'; }}
                              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#9ca3af'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,0,0,0.07)'; (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}>Hapus</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* Akun Travel Agency */}
            <div className="mt-10 mb-10">
              <div className="flex items-center gap-3 mb-5">
                <h2 className="font-bold" style={{ fontSize: '18px', color: '#111827', letterSpacing: '-0.02em' }}>Akun Travel Agency</h2>
                <span className="font-mono text-[10px] uppercase tracking-widest px-2 py-1 rounded-full" style={{ background: 'rgba(67,56,202,0.07)', color: '#4338ca' }}>{travelAccounts.length} akun</span>
              </div>
              <div className="rounded-2xl px-6 py-6 mb-4" style={{ ...cardStyle, border: '1px solid rgba(67,56,202,0.12)' }}>
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] mb-4" style={{ color: '#6b7280' }}>Buat Akun Login Travel Agency</p>
                <form onSubmit={handleCreateTravelAccount} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div><p className="text-[11px] font-semibold mb-1.5" style={{ color: '#374151' }}>Email <span style={{ color: '#f87171' }}>*</span></p><StyledInput type="email" value={taEmail} onChange={e => setTaEmail(e.target.value)} placeholder="travel@example.com" required /></div>
                    <div><p className="text-[11px] font-semibold mb-1.5" style={{ color: '#374151' }}>Password <span style={{ color: '#f87171' }}>*</span></p><StyledInput type="password" value={taPassword} onChange={e => setTaPassword(e.target.value)} placeholder="Min 8 karakter" /></div>
                  </div>
                  {taError && <p className="text-[12px]" style={{ color: '#dc2626' }}>{taError}</p>}
                  {taSuccess && <p className="text-[12px]" style={{ color: '#059669' }}>{taSuccess}</p>}
                  <button type="submit" disabled={taSubmitting} className="flex items-center gap-2 px-5 py-2.5 text-[12px] font-semibold rounded-xl transition-all duration-150 disabled:opacity-60"
                    style={{ background: 'linear-gradient(135deg, #4338ca 0%, #4f46e5 100%)', color: '#ffffff', boxShadow: '0 2px 8px rgba(67,56,202,0.22)' }}>
                    {taSubmitting ? 'Membuat...' : 'Buat Akun'}
                  </button>
                </form>
              </div>
              <div className="rounded-2xl overflow-hidden" style={cardStyle}>
                {travelAccountsLoading ? <div className="py-8 text-center font-mono text-[12px]" style={{ color: '#d1d5db' }}>Memuat...</div> : travelAccounts.length === 0 ? <div className="py-8 text-center text-[13px]" style={{ color: '#9ca3af' }}>Belum ada akun travel agency.</div> : (
                  <div className="divide-y" style={{ borderColor: 'rgba(0,0,0,0.04)' }}>
                    {travelAccounts.map(acc => (
                      <div key={acc.id} className="px-5 py-4 flex items-center justify-between gap-4">
                        <div>
                          <p className="font-mono text-[12px]" style={{ color: '#374151' }}>{acc.user_id.slice(0, 16)}...</p>
                          <p className="font-mono text-[10px] mt-0.5" style={{ color: '#9ca3af' }}>Ditambahkan {formatDatetime(acc.created_at)}</p>
                        </div>
                        <button type="button" onClick={() => handleRevokeTravelAccess(acc.id, acc.user_id)} className="font-mono text-[11px] px-3 py-1.5 rounded-lg transition-all duration-150" style={{ color: '#9ca3af', border: '1px solid rgba(0,0,0,0.07)' }}
                          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#dc2626'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(220,38,38,0.25)'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(220,38,38,0.05)'; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#9ca3af'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,0,0,0.07)'; (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}>Cabut Akses</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
