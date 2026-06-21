import { useState, useEffect, useRef, type FormEvent, type ChangeEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { supabase, type TenantRow } from '../../lib/supabase';
import { darkenHex, generateActivationCode } from '../../lib/colorUtils';

const MAX_LOGO_SIZE = 1024 * 1024;

export default function AdminTenantForm() {
  const { id } = useParams<{ id: string }>();
  const isNew = id === 'baru';
  const navigate = useNavigate();

  const [loading, setLoading] = useState(!isNew);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [codeError, setCodeError] = useState('');

  const [namaTravel, setNamaTravel] = useState('');
  const [activationCode, setActivationCode] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#0ea5e9');
  const [primaryDeepColor, setPrimaryDeepColor] = useState('');
  const [pageTitle, setPageTitle] = useState('');
  const [existingLogoUrl, setExistingLogoUrl] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
          setLoading(false);
        });
    }
  }, [id, isNew]);

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
    if (!primaryDeepColor) {
      setPrimaryDeepColor(darkenHex(val));
    }
  }

  function handleLogoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_LOGO_SIZE) {
      setError('Ukuran logo maksimal 1MB.');
      return;
    }
    setLogoFile(file);
    const reader = new FileReader();
    reader.onload = ev => setLogoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
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

    if (isNew) {
      const unique = await checkCodeUnique(activationCode);
      if (!unique) { setCodeError('Kode aktivasi ini sudah dipakai tenant lain.'); return; }
    }

    setSubmitting(true);
    try {
      let logoUrl = existingLogoUrl;
      if (logoFile) {
        logoUrl = await uploadLogo(logoFile);
      }

      const deepColor = primaryDeepColor || darkenHex(primaryColor);
      const finalTitle = pageTitle || buildDefaultTitle(namaTravel);

      const payload = {
        nama_travel: namaTravel.trim(),
        primary_color: primaryColor,
        primary_deep_color: deepColor,
        logo_url: logoUrl,
        page_title: finalTitle,
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

  if (loading) {
    return (
      <AdminLayout>
        <div className="text-sm text-gray-400 py-12 text-center">Memuat data tenant...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-2xl">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => navigate('/admin')} className="text-sm text-gray-500 hover:text-gray-800">
            ← Kembali
          </button>
          <h1 className="text-xl font-bold text-gray-900">
            {isNew ? 'Tenant Baru' : 'Edit Tenant'}
          </h1>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">

          {/* Kode Aktivasi */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Kode Aktivasi
              {!isNew && <span className="ml-2 text-gray-400 font-normal">(tidak dapat diubah)</span>}
            </label>
            {isNew ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={activationCode}
                  onChange={e => { setActivationCode(e.target.value.toUpperCase()); setCodeError(''); }}
                  placeholder="Ketik atau generate otomatis"
                  maxLength={20}
                  required
                  className="flex-1 font-mono border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
                />
                <button
                  type="button"
                  onClick={() => { setActivationCode(generateActivationCode()); setCodeError(''); }}
                  className="px-3 py-2.5 text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors whitespace-nowrap"
                >
                  Generate
                </button>
              </div>
            ) : (
              <div className="font-mono text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-gray-600">
                {activationCode}
              </div>
            )}
            {codeError && <p className="mt-1.5 text-xs text-red-600">{codeError}</p>}
          </div>

          {/* Nama Travel */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Nama Travel <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={namaTravel}
              onChange={e => handleNamaChange(e.target.value)}
              required
              placeholder="Barakah Mulia Wisata"
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Warna Primary */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Warna Primary</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={primaryColor}
                onChange={e => handleColorChange(e.target.value)}
                className="h-10 w-16 rounded cursor-pointer border border-gray-200"
              />
              <input
                type="text"
                value={primaryColor}
                onChange={e => { if (/^#[0-9a-fA-F]{0,6}$/.test(e.target.value)) handleColorChange(e.target.value); }}
                className="font-mono text-sm border border-gray-200 rounded-lg px-3 py-2 w-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-xs text-gray-400">Warna brand utama travel Anda</span>
            </div>
          </div>

          {/* Warna Primary Deep */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Warna Primary-Deep
              <span className="ml-2 text-gray-400 font-normal">(opsional — auto-gelap 15% jika kosong)</span>
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={primaryDeepColor || darkenHex(primaryColor)}
                onChange={e => setPrimaryDeepColor(e.target.value)}
                className="h-10 w-16 rounded cursor-pointer border border-gray-200"
              />
              <input
                type="text"
                value={primaryDeepColor}
                onChange={e => { if (/^#[0-9a-fA-F]{0,6}$/.test(e.target.value)) setPrimaryDeepColor(e.target.value); }}
                placeholder={darkenHex(primaryColor)}
                className="font-mono text-sm border border-gray-200 rounded-lg px-3 py-2 w-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {primaryDeepColor && (
                <button type="button" onClick={() => setPrimaryDeepColor('')} className="text-xs text-gray-400 hover:text-gray-600">
                  Reset ke auto
                </button>
              )}
            </div>
          </div>

          {/* Logo Upload */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Logo Tenant</label>
            <div className="flex items-start gap-4">
              {/* Preview */}
              <div className="flex-none w-24 h-16 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden">
                {logoPreview ? (
                  <img src={logoPreview} alt="Preview logo baru" className="max-w-full max-h-full object-contain p-1" />
                ) : existingLogoUrl ? (
                  <img src={existingLogoUrl} alt="Logo saat ini" className="max-w-full max-h-full object-contain p-1" />
                ) : (
                  <span className="text-xs text-gray-300">Belum ada</span>
                )}
              </div>
              {/* Upload control */}
              <div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-2 text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                >
                  Pilih File
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/svg+xml,image/jpeg,image/webp"
                  onChange={handleLogoChange}
                  className="hidden"
                />
                <p className="mt-1.5 text-xs text-gray-400">PNG, SVG, JPG, WebP — maks 1MB</p>
                {logoFile && (
                  <p className="mt-1 text-xs text-blue-600">{logoFile.name}</p>
                )}
              </div>
            </div>
          </div>

          {/* Page Title */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Judul Halaman (tab browser)</label>
            <input
              type="text"
              value={pageTitle}
              onChange={e => setPageTitle(e.target.value)}
              placeholder={buildDefaultTitle(namaTravel) || 'Nama Travel — Pendamping Umrah Anda'}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium text-sm rounded-lg px-6 py-2.5 transition-colors"
            >
              {submitting ? 'Menyimpan...' : isNew ? 'Buat Tenant' : 'Simpan Perubahan'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="text-sm text-gray-500 hover:text-gray-800 px-4 py-2.5"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
