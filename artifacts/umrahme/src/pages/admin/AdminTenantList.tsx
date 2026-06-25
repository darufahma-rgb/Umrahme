import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { fetchTenants, type TenantRow } from '../../lib/supabase';

export default function AdminTenantList() {
  const [tenants, setTenants] = useState<TenantRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');

  useEffect(() => {
    const msg = sessionStorage.getItem('admin_toast');
    if (msg) { setToast(msg); sessionStorage.removeItem('admin_toast'); }
    fetchTenants()
      .then(setTenants)
      .catch(err => setError(err instanceof Error ? err.message : 'Terjadi kesalahan.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  return (
    <AdminLayout>
      {toast && (
        <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(16,185,129,0.07)', border: '1px solid rgba(16,185,129,0.20)', color: '#065f46' }}>
          <svg className="flex-none" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
          {toast}
        </div>
      )}

      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="font-bold leading-tight" style={{ fontSize: '24px', color: '#111827', letterSpacing: '-0.02em' }}>Daftar Tenant</h1>
          <p className="font-mono text-[11px] mt-0.5" style={{ color: '#9ca3af', letterSpacing: '0.01em' }}>{loading ? '—' : `${tenants.length} tenant terdaftar`}</p>
        </div>
        <Link to="/admin/tenants/baru" className="inline-flex items-center gap-2 font-semibold text-[13px] px-4 py-2.5 rounded-xl transition-all duration-150 active:scale-[0.98]" style={{ background: 'linear-gradient(135deg, #4338ca 0%, #4f46e5 100%)', color: '#ffffff', boxShadow: '0 2px 8px rgba(67,56,202,0.26), 0 1px 2px rgba(67,56,202,0.18)' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          Tenant Baru
        </Link>
      </div>

      {error && <div className="mb-5 px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.18)', color: '#dc2626' }}>{error}</div>}

      {loading ? (
        <div className="rounded-2xl py-16 text-center font-mono text-[12px]" style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)', color: '#d1d5db' }}>Memuat data...</div>
      ) : tenants.length === 0 ? (
        <div className="rounded-2xl py-16 text-center text-sm" style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.06)', color: '#9ca3af' }}>Belum ada tenant. Tambah yang pertama!</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {tenants.map((t) => {
            const deep = t.primary_deep_color || t.primary_color;
            const inisial = (t.nama_travel || '?').trim().charAt(0).toUpperCase();
            return (
              <div key={t.id} className="rounded-2xl overflow-hidden transition-all duration-150"
                style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <div style={{ height: '6px', background: `linear-gradient(90deg, ${t.primary_color} 0%, ${deep} 100%)` }} />
                <div className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex-none flex items-center justify-center rounded-full"
                      style={{ width: '40px', height: '40px', background: t.primary_color }}>
                      <span style={{ color: '#ffffff', fontWeight: 600, fontSize: '16px' }}>{inisial}</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] font-bold leading-tight truncate" style={{ color: '#111827' }}>{t.nama_travel}</p>
                      <span className="inline-block mt-1 font-mono text-[10px] px-2 py-0.5 rounded-md"
                        style={{ background: 'rgba(67,56,202,0.06)', color: '#4338ca', border: '1px solid rgba(67,56,202,0.12)', letterSpacing: '0.06em' }}>
                        {t.activation_code}
                      </span>
                    </div>
                    <Link to={`/admin/tenants/${t.id}`}
                      className="flex-none inline-flex items-center gap-1.5 text-[12px] font-semibold px-3 py-1.5 rounded-lg transition-all duration-150"
                      style={{ color: '#4338ca', border: '1px solid rgba(67,56,202,0.2)' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(67,56,202,0.07)'; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; }}>
                      Edit
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
                    </Link>
                  </div>
                  <div className="flex items-center gap-3 mt-4 pt-3" style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                    <div className="flex items-center gap-1.5">
                      <span className="inline-block rounded-md flex-none" style={{ width: '16px', height: '16px', background: t.primary_color, border: '1px solid rgba(0,0,0,0.08)' }} />
                      <span className="inline-block rounded-md flex-none" style={{ width: '16px', height: '16px', background: deep, border: '1px solid rgba(0,0,0,0.08)' }} />
                      <span className="font-mono text-[10px] ml-1" style={{ color: '#9ca3af', letterSpacing: '0.04em' }}>{t.primary_color}</span>
                    </div>
                    <div className="ml-auto flex items-center gap-1.5">
                      {t.logo_url
                        ? <img src={t.logo_url} alt="" className="h-6 w-auto object-contain" style={{ maxWidth: '70px' }} />
                        : <span className="font-mono text-[10px]" style={{ color: '#d1d5db' }}>Tanpa logo</span>}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AdminLayout>
  );
}
