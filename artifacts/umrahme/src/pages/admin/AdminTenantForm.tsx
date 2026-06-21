import { useState, useEffect, useRef, useCallback, type FormEvent, type ChangeEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { supabase, type TenantRow, type AgendaItemRow } from '../../lib/supabase';
import { darkenHex, generateActivationCode } from '../../lib/colorUtils';

const MAX_LOGO_SIZE = 1024 * 1024;

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label
      className="block font-mono text-[10px] uppercase tracking-[0.14em] mb-2"
      style={{ color: '#6b7280' }}
    >
      {children}
    </label>
  );
}

const inputBase: React.CSSProperties = {
  border: '1px solid rgba(0,0,0,0.09)',
  background: '#fafaf9',
  color: '#111827',
  boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.04)',
};

function StyledInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl px-4 py-3 text-sm transition-all duration-150 focus:outline-none ${props.className ?? ''}`}
      style={{ ...inputBase, ...props.style }}
      onFocus={e => {
        e.currentTarget.style.border = '1px solid #4338ca';
        e.currentTarget.style.boxShadow = '0 0 0 3px rgba(67,56,202,0.10)';
        e.currentTarget.style.background = '#ffffff';
        props.onFocus?.(e);
      }}
      onBlur={e => {
        e.currentTarget.style.border = '1px solid rgba(0,0,0,0.09)';
        e.currentTarget.style.boxShadow = 'inset 0 1px 2px rgba(0,0,0,0.04)';
        e.currentTarget.style.background = '#fafaf9';
        props.onBlur?.(e);
      }}
    />
  );
}

function SectionDivider() {
  return <div style={{ height: '1px', background: 'rgba(0,0,0,0.04)' }} />;
}

export default function AdminTenantForm() {
  const { id } = useParams<{ id: string }>();
  const isNew = id === 'baru';
  const navigate = useNavigate();

  const [loading, setLoading] = useState(!isNew);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [codeError, setCodeError] = useState('');
  const [dateError, setDateError] = useState('');

  // Tenant fields
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

  // Agenda state
  const [agendaItems, setAgendaItems] = useState<AgendaItemRow[]>([]);
  const [agendaLoading, setAgendaLoading] = useState(false);
  const [agJudul, setAgJudul] = useState('');
  const [agTanggal, setAgTanggal] = useState('');
  const [agJam, setAgJam] = useState('');
  const [agDeskripsi, setAgDeskripsi] = useState('');
  const [agLokasi, setAgLokasi] = useState('');
  const [agSubmitting, setAgSubmitting] = useState(false);
  const [agError, setAgError] = useState('');

  const loadAgenda = useCallback(async () => {
    if (!id || isNew) return;
    setAgendaLoading(true);
    const { data } = await supabase
      .from('agenda_items')
      .select('*')
      .eq('tenant_id', id)
      .order('tanggal', { ascending: true })
      .order('jam_mulai', { ascending: true });
    setAgendaItems((data as AgendaItemRow[]) ?? []);
    setAgendaLoading(false);
  }, [id, isNew]);

  useEffect(() => {
    if (!isNew && id) {
      supabase.from('tenants').select('*').eq('id', id).single()
        .then(({ data, error: err }) => {
          if (err || !data) { setError('Tenant tidak ditemukan.'); setLoading(false); return; }
          const t = data as TenantRow;
          setNamaTravel(t.nama_travel);
          setActivationCode(t.activation_code);
          setPrimaryColor(t.primary_color);
          setPrimaryDeepColor(t.primary_deep_color);
          setPageTitle(t.page_title);
          setExistingLogoUrl(t.logo_url);
          setTanggalKeberangkatan(t.tanggal_keberangkatan ?? '');
          setTanggalKepulangan(t.tanggal_kepulangan ?? '');
          setLoading(false);
        });
      loadAgenda();
    }
  }, [id, isNew, loadAgenda]);

  function handleNamaChange(val: string) {
    setNamaTravel(val);
    if (!pageTitle || pageTitle === buildDefaultTitle(namaTravel)) {
      setPageTitle(buildDefaultTitle(val));
    }
  }

  function buildDefaultTitle(nama: string) {
    return nama ? `${nama} — Pendamping Umrah Anda` : '';
  }

  function handleColorChange(val: string) {
    setPrimaryColor(val);
    if (!primaryDeepColor) setPrimaryDeepColor(darkenHex(val));
  }

  function handleLogoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_LOGO_SIZE) { setError('Ukuran logo maksimal 1MB.'); return; }
    setLogoFile(file);
    const reader = new FileReader();
    reader.onload = ev => setLogoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  function validateDates(): boolean {
    if (tanggalKeberangkatan && tanggalKepulangan) {
      if (tanggalKepulangan < tanggalKeberangkatan) {
        setDateError('Tanggal kepulangan harus setelah atau sama dengan tanggal keberangkatan.');
        return false;
      }
    }
    setDateError('');
    return true;
  }

  async function checkCodeUnique(code: string): Promise<boolean> {
    const query = supabase.from('tenants').select('id').eq('activation_code', code);
    if (!isNew && id) query.neq('id', id);
    const { data } = await query;
    return !data || data.length === 0;
  }

  async function uploadLogo(file: File): Promise<string> {
    const ext = file.name.split('.').pop() ?? 'png';
    const filename = `logo_${Date.now()}.${ext}`;
    const { error: uploadErr } = await supabase.storage
      .from('tenant-logos')
      .upload(filename, file, { upsert: true, contentType: file.type });
    if (uploadErr) throw new Error(`Upload logo gagal: ${uploadErr.message}`);
    const { data: urlData } = supabase.storage.from('tenant-logos').getPublicUrl(filename);
    return urlData.publicUrl;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setCodeError('');
    if (!validateDates()) return;

    if (isNew) {
      const unique = await checkCodeUnique(activationCode);
      if (!unique) { setCodeError('Kode aktivasi ini sudah dipakai tenant lain.'); return; }
    }

    setSubmitting(true);
    try {
      let logoUrl = existingLogoUrl;
      if (logoFile) logoUrl = await uploadLogo(logoFile);

      const deepColor = primaryDeepColor || darkenHex(primaryColor);
      const finalTitle = pageTitle || buildDefaultTitle(namaTravel);

      const payload = {
        nama_travel: namaTravel.trim(),
        primary_color: primaryColor,
        primary_deep_color: deepColor,
        logo_url: logoUrl,
        page_title: finalTitle,
        tanggal_keberangkatan: tanggalKeberangkatan || null,
        tanggal_kepulangan: tanggalKepulangan || null,
      };

      if (isNew) {
        const { error: insErr } = await supabase.from('tenants').insert({
          ...payload,
          activation_code: activationCode.trim().toUpperCase(),
        });
        if (insErr) throw new Error(insErr.message);
        sessionStorage.setItem('admin_toast', `Tenant "${namaTravel}" berhasil dibuat.`);
      } else {
        const { error: updErr } = await supabase.from('tenants').update(payload).eq('id', id!);
        if (updErr) throw new Error(updErr.message);
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
    const { error: insErr } = await supabase.from('agenda_items').insert({
      tenant_id: id,
      tanggal: agTanggal,
      jam_mulai: agJam || null,
      judul: agJudul.trim(),
      deskripsi: agDeskripsi.trim() || null,
      lokasi: agLokasi.trim() || null,
      urutan: 0,
    });
    if (insErr) { setAgError(insErr.message); setAgSubmitting(false); return; }
    setAgJudul(''); setAgTanggal(''); setAgJam(''); setAgDeskripsi(''); setAgLokasi('');
    setAgSubmitting(false);
    await loadAgenda();
  }

  async function handleDeleteAgenda(agendaId: string, judul: string) {
    if (!window.confirm(`Hapus agenda "${judul}"?`)) return;
    await supabase.from('agenda_items').delete().eq('id', agendaId);
    await loadAgenda();
  }

  function formatTanggal(iso: string) {
    const d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  }

  const cardStyle: React.CSSProperties = {
    background: '#ffffff',
    border: '1px solid rgba(0,0,0,0.06)',
    boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.04)',
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="font-mono text-[12px] py-16 text-center" style={{ color: '#d1d5db' }}>
          Memuat data tenant...
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-2xl">
        {/* Back + title */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/admin')}
            className="flex items-center gap-1.5 text-[13px] font-medium transition-all duration-150"
            style={{ color: '#9ca3af' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#4338ca'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#9ca3af'; }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Kembali
          </button>
          <span style={{ color: '#e5e7eb' }}>|</span>
          <h1 className="font-bold leading-tight" style={{ fontSize: '22px', color: '#111827', letterSpacing: '-0.02em' }}>
            {isNew ? 'Tenant Baru' : 'Edit Tenant'}
          </h1>
        </div>

        {/* Error banner */}
        {error && (
          <div
            className="mb-5 flex items-start gap-2.5 px-4 py-3 rounded-xl text-sm"
            style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.18)', color: '#dc2626' }}
          >
            <svg className="flex-none mt-0.5" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-0">

          {/* ── Kode Aktivasi ── */}
          <div className="rounded-t-2xl px-6 py-6" style={cardStyle}>
            <FieldLabel>
              Kode Aktivasi{!isNew && <span className="ml-2 normal-case" style={{ color: '#d1d5db', fontFamily: 'inherit', letterSpacing: 'normal', textTransform: 'none', fontSize: '10px' }}>(tidak dapat diubah)</span>}
            </FieldLabel>
            {isNew ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={activationCode}
                  onChange={e => { setActivationCode(e.target.value.toUpperCase()); setCodeError(''); }}
                  placeholder="Ketik atau klik Generate"
                  maxLength={20}
                  required
                  className="flex-1 font-mono rounded-xl px-4 py-3 text-sm uppercase transition-all duration-150 focus:outline-none"
                  style={{ ...inputBase, letterSpacing: '0.08em' }}
                  onFocus={e => { e.currentTarget.style.border = '1px solid #4338ca'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(67,56,202,0.10)'; e.currentTarget.style.background = '#ffffff'; }}
                  onBlur={e => { e.currentTarget.style.border = '1px solid rgba(0,0,0,0.09)'; e.currentTarget.style.boxShadow = 'inset 0 1px 2px rgba(0,0,0,0.04)'; e.currentTarget.style.background = '#fafaf9'; }}
                />
                <button
                  type="button"
                  onClick={() => { setActivationCode(generateActivationCode()); setCodeError(''); }}
                  className="px-4 text-[12px] font-semibold rounded-xl transition-all duration-150 whitespace-nowrap"
                  style={{ background: 'rgba(67,56,202,0.07)', color: '#4338ca', border: '1px solid rgba(67,56,202,0.15)' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(67,56,202,0.12)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(67,56,202,0.07)'; }}
                >
                  Generate
                </button>
              </div>
            ) : (
              <div className="font-mono text-sm px-4 py-3 rounded-xl" style={{ background: 'rgba(67,56,202,0.05)', color: '#4338ca', border: '1px solid rgba(67,56,202,0.12)', letterSpacing: '0.08em' }}>
                {activationCode}
              </div>
            )}
            {codeError && <p className="mt-2 text-[12px]" style={{ color: '#dc2626' }}>{codeError}</p>}
          </div>

          <SectionDivider />

          {/* ── Nama Travel ── */}
          <div className="px-6 py-6" style={cardStyle}>
            <FieldLabel>Nama Travel <span style={{ color: '#f87171' }}>*</span></FieldLabel>
            <StyledInput
              type="text"
              value={namaTravel}
              onChange={e => handleNamaChange(e.target.value)}
              required
              placeholder="Barakah Mulia Wisata"
            />
          </div>

          <SectionDivider />

          {/* ── Warna Brand ── */}
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
                    <button type="button" onClick={() => setPrimaryDeepColor('')} className="text-[11px] transition-all duration-150" style={{ color: '#9ca3af' }} onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#4338ca'; }} onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#9ca3af'; }}>
                      Reset ke auto
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <SectionDivider />

          {/* ── Logo Upload ── */}
          <div className="px-6 py-6" style={cardStyle}>
            <FieldLabel>Logo Tenant</FieldLabel>
            <div className="flex items-start gap-4">
              <div className="flex-none w-28 rounded-xl flex items-center justify-center overflow-hidden cursor-pointer transition-all duration-150" style={{ border: logoPreview || existingLogoUrl ? '1px solid rgba(0,0,0,0.08)' : '2px dashed rgba(0,0,0,0.12)', background: '#fafaf9', height: '72px' }} onClick={() => fileInputRef.current?.click()} onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = '#4338ca'; (e.currentTarget as HTMLDivElement).style.background = 'rgba(67,56,202,0.03)'; }} onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = logoPreview || existingLogoUrl ? 'rgba(0,0,0,0.08)' : 'rgba(0,0,0,0.12)'; (e.currentTarget as HTMLDivElement).style.background = '#fafaf9'; }}>
                {logoPreview ? <img src={logoPreview} alt="Preview logo baru" className="max-w-full max-h-full object-contain p-2" /> : existingLogoUrl ? <img src={existingLogoUrl} alt="Logo saat ini" className="max-w-full max-h-full object-contain p-2" /> : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>}
              </div>
              <div className="flex-1">
                <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 px-4 py-2.5 text-[12px] font-semibold rounded-xl transition-all duration-150" style={{ background: 'rgba(67,56,202,0.07)', color: '#4338ca', border: '1px solid rgba(67,56,202,0.15)' }} onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(67,56,202,0.12)'; }} onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(67,56,202,0.07)'; }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /></svg>
                  Pilih File
                </button>
                <input ref={fileInputRef} type="file" accept="image/png,image/svg+xml,image/jpeg,image/webp" onChange={handleLogoChange} className="hidden" />
                <p className="mt-2 text-[11px]" style={{ color: '#9ca3af' }}>PNG, SVG, JPG, WebP — maks 1MB</p>
                {logoFile && <p className="mt-1 font-mono text-[11px]" style={{ color: '#4338ca' }}>{logoFile.name}</p>}
              </div>
            </div>
          </div>

          <SectionDivider />

          {/* ── Page Title ── */}
          <div className="px-6 py-6" style={cardStyle}>
            <FieldLabel>Judul Halaman (tab browser)</FieldLabel>
            <StyledInput
              type="text"
              value={pageTitle}
              onChange={e => setPageTitle(e.target.value)}
              placeholder={buildDefaultTitle(namaTravel) || 'Nama Travel — Pendamping Umrah Anda'}
            />
          </div>

          <SectionDivider />

          {/* ── Tanggal Keberangkatan & Kepulangan ── */}
          <div className="rounded-b-2xl px-6 py-6" style={cardStyle}>
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] mb-4" style={{ color: '#6b7280' }}>Jadwal Perjalanan</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-[11px] font-semibold mb-2" style={{ color: '#374151' }}>Tanggal Keberangkatan</p>
                <StyledInput
                  type="date"
                  value={tanggalKeberangkatan}
                  onChange={e => { setTanggalKeberangkatan(e.target.value); setDateError(''); }}
                />
              </div>
              <div>
                <p className="text-[11px] font-semibold mb-2" style={{ color: '#374151' }}>Tanggal Kepulangan</p>
                <StyledInput
                  type="date"
                  value={tanggalKepulangan}
                  onChange={e => { setTanggalKepulangan(e.target.value); setDateError(''); }}
                />
              </div>
            </div>
            {dateError && (
              <p className="mt-2 text-[12px] flex items-center gap-1.5" style={{ color: '#d97706' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                {dateError}
              </p>
            )}
          </div>

          {/* ── Actions ── */}
          <div className="flex items-center gap-3 pt-7">
            <button
              type="submit"
              disabled={submitting}
              className="font-semibold text-[13px] px-7 py-3 rounded-xl transition-all duration-150 active:scale-[0.98] disabled:opacity-60"
              style={{
                background: submitting ? '#6366f1' : 'linear-gradient(135deg, #4338ca 0%, #4f46e5 100%)',
                color: '#ffffff',
                boxShadow: submitting ? 'none' : '0 2px 8px rgba(67,56,202,0.26), 0 1px 2px rgba(67,56,202,0.18)',
              }}
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" />
                    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                  Menyimpan...
                </span>
              ) : isNew ? 'Buat Tenant' : 'Simpan Perubahan'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="text-[13px] font-medium px-4 py-3 rounded-xl transition-all duration-150"
              style={{ color: '#9ca3af' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#374151'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.04)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#9ca3af'; (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
            >
              Batal
            </button>
          </div>
        </form>

        {/* ── Agenda Perjalanan (hanya saat EDIT) ── */}
        {!isNew && (
          <div className="mt-10">
            <div className="flex items-center gap-3 mb-5">
              <h2 className="font-bold" style={{ fontSize: '18px', color: '#111827', letterSpacing: '-0.02em' }}>Agenda Perjalanan</h2>
              <span className="font-mono text-[10px] uppercase tracking-widest px-2 py-1 rounded-full" style={{ background: 'rgba(67,56,202,0.07)', color: '#4338ca' }}>
                {agendaItems.length} item
              </span>
            </div>

            {/* Form tambah agenda */}
            <div className="rounded-2xl px-6 py-6 mb-4" style={{ ...cardStyle, border: '1px solid rgba(67,56,202,0.12)' }}>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] mb-4" style={{ color: '#6b7280' }}>Tambah Agenda Baru</p>
              <form onSubmit={handleAddAgenda} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[11px] font-semibold mb-1.5" style={{ color: '#374151' }}>Tanggal <span style={{ color: '#f87171' }}>*</span></p>
                    <StyledInput type="date" value={agTanggal} onChange={e => setAgTanggal(e.target.value)} required />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold mb-1.5" style={{ color: '#374151' }}>Jam Mulai</p>
                    <StyledInput type="time" value={agJam} onChange={e => setAgJam(e.target.value)} />
                  </div>
                </div>
                <div>
                  <p className="text-[11px] font-semibold mb-1.5" style={{ color: '#374151' }}>Judul Kegiatan <span style={{ color: '#f87171' }}>*</span></p>
                  <StyledInput type="text" value={agJudul} onChange={e => setAgJudul(e.target.value)} placeholder="Cth: Perjalanan ke Madinah" required />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[11px] font-semibold mb-1.5" style={{ color: '#374151' }}>Lokasi</p>
                    <StyledInput type="text" value={agLokasi} onChange={e => setAgLokasi(e.target.value)} placeholder="Bandara Soekarno-Hatta" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold mb-1.5" style={{ color: '#374151' }}>Deskripsi</p>
                    <textarea
                      value={agDeskripsi}
                      onChange={e => setAgDeskripsi(e.target.value)}
                      placeholder="Keterangan tambahan..."
                      rows={1}
                      className="w-full rounded-xl px-4 py-3 text-sm transition-all duration-150 focus:outline-none resize-none"
                      style={inputBase}
                      onFocus={e => { e.currentTarget.style.border = '1px solid #4338ca'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(67,56,202,0.10)'; e.currentTarget.style.background = '#ffffff'; }}
                      onBlur={e => { e.currentTarget.style.border = '1px solid rgba(0,0,0,0.09)'; e.currentTarget.style.boxShadow = 'inset 0 1px 2px rgba(0,0,0,0.04)'; e.currentTarget.style.background = '#fafaf9'; }}
                    />
                  </div>
                </div>
                {agError && <p className="text-[12px]" style={{ color: '#dc2626' }}>{agError}</p>}
                <button
                  type="submit"
                  disabled={agSubmitting}
                  className="flex items-center gap-2 px-5 py-2.5 text-[12px] font-semibold rounded-xl transition-all duration-150 disabled:opacity-60"
                  style={{ background: 'linear-gradient(135deg, #4338ca 0%, #4f46e5 100%)', color: '#ffffff', boxShadow: '0 2px 8px rgba(67,56,202,0.22)' }}
                >
                  {agSubmitting ? (
                    <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" /><path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>
                  ) : (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                  )}
                  Tambah Agenda
                </button>
              </form>
            </div>

            {/* Daftar agenda */}
            <div className="rounded-2xl overflow-hidden" style={cardStyle}>
              {agendaLoading ? (
                <div className="py-10 text-center font-mono text-[12px]" style={{ color: '#d1d5db' }}>Memuat agenda...</div>
              ) : agendaItems.length === 0 ? (
                <div className="py-10 text-center">
                  <p className="text-[13px]" style={{ color: '#9ca3af' }}>Belum ada agenda.</p>
                  <p className="mt-1 font-mono text-[11px]" style={{ color: '#d1d5db' }}>Tambahkan agenda di atas.</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)', background: '#fafaf9' }}>
                      {['Tanggal', 'Jam', 'Judul', 'Lokasi', ''].map(h => (
                        <th key={h} className="text-left font-mono text-[10px] uppercase tracking-[0.12em] px-5 py-3" style={{ color: '#9ca3af' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {agendaItems.map((item, i) => (
                      <tr
                        key={item.id}
                        style={{ borderBottom: i < agendaItems.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none' }}
                      >
                        <td className="px-5 py-3.5 text-[13px] font-medium whitespace-nowrap" style={{ color: '#374151' }}>
                          {formatTanggal(item.tanggal)}
                        </td>
                        <td className="px-5 py-3.5 font-mono text-[12px]" style={{ color: '#6b7280' }}>
                          {item.jam_mulai ? item.jam_mulai.slice(0, 5) : '—'}
                        </td>
                        <td className="px-5 py-3.5">
                          <p className="text-[13px] font-semibold" style={{ color: '#111827' }}>{item.judul}</p>
                          {item.deskripsi && <p className="text-[11px] mt-0.5" style={{ color: '#9ca3af' }}>{item.deskripsi}</p>}
                        </td>
                        <td className="px-5 py-3.5 text-[12px]" style={{ color: '#6b7280' }}>
                          {item.lokasi ?? '—'}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <button
                            type="button"
                            onClick={() => handleDeleteAgenda(item.id, item.judul)}
                            className="font-mono text-[11px] px-3 py-1.5 rounded-lg transition-all duration-150"
                            style={{ color: '#9ca3af', border: '1px solid rgba(0,0,0,0.07)' }}
                            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#dc2626'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(220,38,38,0.25)'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(220,38,38,0.05)'; }}
                            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#9ca3af'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,0,0,0.07)'; (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
