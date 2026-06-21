import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { supabase, type TenantRow } from '../../lib/supabase';

export default function AdminTenantList() {
  const [tenants, setTenants] = useState<TenantRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');

  useEffect(() => {
    const msg = sessionStorage.getItem('admin_toast');
    if (msg) { setToast(msg); sessionStorage.removeItem('admin_toast'); }
    fetchTenants();
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  async function fetchTenants() {
    setLoading(true);
    const { data, error: err } = await supabase
      .from('tenants')
      .select('*')
      .order('created_at', { ascending: false });
    if (err) { setError(err.message); }
    else { setTenants(data ?? []); }
    setLoading(false);
  }

  return (
    <AdminLayout>
      {toast && (
        <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg">
          {toast}
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold text-gray-900">Daftar Tenant</h1>
        <Link
          to="/admin/tenants/baru"
          className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          + Tenant Baru
        </Link>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          Error: {error}
        </div>
      )}

      {loading ? (
        <div className="text-sm text-gray-400 py-12 text-center">Memuat data...</div>
      ) : tenants.length === 0 ? (
        <div className="text-sm text-gray-400 py-12 text-center">Belum ada tenant. Tambah yang pertama!</div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Kode Aktivasi</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nama Travel</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Warna</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Logo</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Dibuat</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {tenants.map(t => (
                <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">{t.activation_code}</span>
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900">{t.nama_travel}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <div className="flex items-center gap-2">
                      <span
                        className="inline-block w-5 h-5 rounded-full border border-gray-200 flex-none"
                        style={{ background: t.primary_color }}
                      />
                      <span className="font-mono text-xs text-gray-500">{t.primary_color}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    {t.logo_url ? (
                      <img src={t.logo_url} alt="" className="h-7 w-auto object-contain" />
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell text-xs text-gray-400">
                    {new Date(t.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      to={`/admin/tenants/${t.id}`}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}
