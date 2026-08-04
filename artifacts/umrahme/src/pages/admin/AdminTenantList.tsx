import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { deleteTenant, fetchAdminTenantMetrics, fetchTenants, type AdminTenantMetrics, type TenantRow } from '../../lib/supabase';

type Filter = 'semua' | 'perlu_tindakan' | 'berjalan' | 'tanpa_operator';

function formatDate(value: string | null) {
  if (!value) return 'Tanggal belum diatur';
  return new Intl.DateTimeFormat('id-ID', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(`${value}T00:00:00`));
}

export default function AdminTenantList() {
  const [tenants, setTenants] = useState<TenantRow[]>([]);
  const [metrics, setMetrics] = useState<Record<string, AdminTenantMetrics>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('semua');
  const [hapusTarget, setHapusTarget] = useState<TenantRow | null>(null);
  const [konfirmText, setKonfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);

  async function load() {
    setLoading(true);
    setError('');
    try {
      const tenantRows = await fetchTenants();
      setTenants(tenantRows);
      setMetrics(await fetchAdminTenantMetrics(tenantRows.map((tenant) => tenant.id)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat memuat data.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const message = sessionStorage.getItem('admin_toast');
    if (message) { setToast(message); sessionStorage.removeItem('admin_toast'); }
    void load();
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timeout = setTimeout(() => setToast(''), 4000);
    return () => clearTimeout(timeout);
  }, [toast]);

  const summary = useMemo(() => {
    const values = Object.values(metrics);
    return {
      totalJamaah: values.reduce((total, value) => total + value.jamaahCount, 0),
      activeTravel: values.filter((value) => value.activeBatch).length,
      attention: tenants.filter((tenant) => {
        const metric = metrics[tenant.id];
        return metric && (!tenant.slug || metric.operatorCount === 0 || metric.openHelpCount > 0);
      }).length,
      openHelp: values.reduce((total, value) => total + value.openHelpCount, 0),
    };
  }, [metrics, tenants]);

  const filteredTenants = useMemo(() => tenants.filter((tenant) => {
    const metric = metrics[tenant.id];
    const normalizedQuery = query.trim().toLowerCase();
    const matchesQuery = !normalizedQuery || [tenant.nama_travel, tenant.activation_code, tenant.slug ?? ''].some((value) => value.toLowerCase().includes(normalizedQuery));
    if (!matchesQuery || !metric) return false;
    if (filter === 'perlu_tindakan') return !tenant.slug || metric.operatorCount === 0 || metric.openHelpCount > 0;
    if (filter === 'berjalan') return Boolean(metric.activeBatch);
    if (filter === 'tanpa_operator') return metric.operatorCount === 0;
    return true;
  }), [filter, metrics, query, tenants]);

  async function handleDelete() {
    if (!hapusTarget) return;
    setDeleting(true);
    try {
      await deleteTenant(hapusTarget.id);
      setTenants((previous) => previous.filter((tenant) => tenant.id !== hapusTarget.id));
      setToast(`Travel ${hapusTarget.nama_travel} berhasil dihapus.`);
      setHapusTarget(null);
      setKonfirmText('');
    } catch (err) {
      setToast(err instanceof Error ? `Gagal menghapus: ${err.message}` : 'Gagal menghapus travel.');
    } finally {
      setDeleting(false);
    }
  }

  return (
    <AdminLayout>
      {toast && <div className="mb-5 rounded-lg border px-4 py-3 text-sm" style={{ background: '#ecfdf5', borderColor: '#a7f3d0', color: '#065f46' }}>{toast}</div>}
      {error && <div className="mb-5 rounded-lg border px-4 py-3 text-sm" style={{ background: '#fef2f2', borderColor: '#fecaca', color: '#b91c1c' }}>{error}</div>}

      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em]" style={{ color: '#15803d' }}>Master Control</p>
          <h1 className="mt-2 text-[28px] font-bold leading-tight sm:text-[32px]" style={{ color: '#131313' }}>Operasional Semua Travel</h1>
          <p className="mt-2 text-sm leading-6" style={{ color: '#667085' }}>Pantau kesehatan operasional setiap travel dan ambil tindakan tanpa membuka data satu per satu.</p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex">
          <button type="button" onClick={() => void load()} className="inline-flex h-11 items-center justify-center rounded-lg border px-4 text-sm font-semibold" style={{ borderColor: '#d6dae5', color: '#344054', background: '#fff' }}>Muat ulang</button>
          <Link to="/admin/tenants/baru" className="inline-flex h-11 items-center justify-center rounded-lg px-4 text-sm font-semibold shadow-sm" style={{ background: '#0054f9', color: '#fff', boxShadow: '0 4px 10px rgba(0,84,249,0.22)' }}>Tambah Travel</Link>
        </div>
      </div>

      <section className="mt-7 grid grid-cols-2 gap-3 xl:grid-cols-4">
        {[
          ['Travel terdaftar', String(tenants.length), '#111827'],
          ['Jamaah terdata', String(summary.totalJamaah), '#111827'],
          ['Travel berjalan', String(summary.activeTravel), '#047857'],
          ['Perlu perhatian', String(summary.attention), summary.attention ? '#b45309' : '#047857'],
        ].map(([label, value, color]) => (
          <div key={label} className="rounded-lg border bg-white p-4 sm:p-5" style={{ borderColor: '#e4e7ec', boxShadow: '0 1px 2px rgba(16,24,40,0.03)' }}>
            <p className="text-xs font-medium" style={{ color: '#667085' }}>{label}</p>
            <p className="mt-2 text-[26px] font-bold leading-none" style={{ color }}>{value}</p>
          </div>
        ))}
      </section>

      <section className="mt-6 rounded-lg border bg-white p-3 sm:p-4" style={{ borderColor: '#e4e7ec', boxShadow: '0 1px 2px rgba(16,24,40,0.03)' }}>
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari travel, slug, atau kode" className="h-11 w-full rounded-lg border px-3 text-sm outline-none" style={{ borderColor: '#d6dae5', color: '#172033' }} />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 lg:flex-wrap lg:overflow-visible lg:pb-0">
            {([
              ['semua', `Semua (${tenants.length})`],
              ['perlu_tindakan', `Perlu tindakan (${summary.attention})`],
              ['berjalan', `Berjalan (${summary.activeTravel})`],
              ['tanpa_operator', 'Tanpa operator'],
            ] as [Filter, string][]).map(([value, label]) => (
              <button key={value} type="button" onClick={() => setFilter(value)} className="h-9 flex-none whitespace-nowrap rounded-lg px-3 text-xs font-semibold" style={filter === value ? { background: '#e8f7d1', color: '#14532d' } : { background: '#f8fafc', color: '#475467' }}>{label}</button>
            ))}
          </div>
        </div>
      </section>

      {summary.openHelp > 0 && <div className="mt-4 rounded-lg border px-4 py-3 text-sm" style={{ borderColor: '#fde68a', background: '#fffbeb', color: '#92400e' }}>Ada {summary.openHelp} permintaan bantuan jamaah yang belum selesai. Buka travel terkait untuk menanganinya.</div>}

      <section className="mt-4 overflow-hidden rounded-lg border bg-white" style={{ borderColor: '#e4e7ec', boxShadow: '0 1px 2px rgba(16,24,40,0.03)' }}>
        <div className="hidden grid-cols-[minmax(240px,1.7fr)_1.25fr_.75fr_.85fr_130px] gap-5 border-b px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.08em] lg:grid" style={{ borderColor: '#e4e7ec', color: '#667085' }}>
          <span>Travel</span><span>Operasional</span><span>Jamaah</span><span>Akses</span><span className="text-right">Aksi</span>
        </div>
        {loading ? <div className="px-5 py-16 text-center text-sm" style={{ color: '#9ca3af' }}>Memuat dashboard operasional...</div> : filteredTenants.length === 0 ? <div className="px-5 py-16 text-center text-sm" style={{ color: '#9ca3af' }}>Tidak ada travel yang cocok dengan filter.</div> : filteredTenants.map((tenant) => {
          const metric = metrics[tenant.id];
          if (!metric) return null;
          const operationalBatch = metric.activeBatch ?? metric.upcomingBatch;
          const needsAttention = !tenant.slug || metric.operatorCount === 0 || metric.openHelpCount > 0;
          return <div key={tenant.id}>
          <article className="hidden gap-5 border-b px-6 py-5 last:border-b-0 lg:grid lg:grid-cols-[minmax(240px,1.7fr)_1.25fr_.75fr_.85fr_130px] lg:items-center" style={{ borderColor: '#edf0f5' }}>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 flex-none items-center justify-center overflow-hidden rounded-lg text-sm font-bold" style={{ background: tenant.primary_color, color: '#fff' }}>{tenant.logo_url ? <img src={tenant.logo_url} alt="" className="h-full w-full object-cover" /> : tenant.nama_travel.trim().charAt(0).toUpperCase()}</div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2"><p className="truncate text-sm font-bold" style={{ color: '#111827' }}>{tenant.nama_travel}</p>{needsAttention && <span className="rounded px-1.5 py-0.5 text-[10px] font-semibold" style={{ background: '#fef3c7', color: '#92400e' }}>PERLU CEK</span>}</div>
                <p className="mt-0.5 truncate font-mono text-[11px]" style={{ color: '#9ca3af' }}>{tenant.slug ? `/t/${tenant.slug}` : `Kode ${tenant.activation_code}`}</p>
              </div>
            </div>
            <div>
              {operationalBatch ? <><p className="text-sm font-semibold" style={{ color: '#374151' }}>{operationalBatch.nama_batch}</p><p className="mt-0.5 text-xs" style={{ color: metric.activeBatch ? '#047857' : '#6b7280' }}>{metric.activeBatch ? 'Sedang berjalan' : `Berangkat ${formatDate(operationalBatch.tanggal_keberangkatan)}`}</p></> : <p className="text-sm" style={{ color: '#9ca3af' }}>Belum ada batch aktif</p>}
            </div>
            <div><p className="text-sm font-bold" style={{ color: '#111827' }}>{metric.jamaahCount}</p><p className="text-xs" style={{ color: '#6b7280' }}>jamaah, {metric.batchCount} batch</p></div>
            <div><p className="text-sm font-bold" style={{ color: metric.operatorCount ? '#111827' : '#b45309' }}>{metric.operatorCount} operator</p><p className="text-xs" style={{ color: metric.openHelpCount ? '#b45309' : '#6b7280' }}>{metric.openHelpCount ? `${metric.openHelpCount} bantuan terbuka` : 'Tidak ada bantuan terbuka'}</p></div>
            <div className="flex justify-end gap-2"><Link to={`/admin/tenants/${tenant.id}`} className="inline-flex h-9 items-center justify-center rounded-lg border px-3 text-xs font-semibold" style={{ color: '#0054f9', borderColor: '#bfd4ff', background: '#f4f8ff' }}>Kelola</Link><button type="button" aria-label={`Hapus ${tenant.nama_travel}`} onClick={() => { setHapusTarget(tenant); setKonfirmText(''); }} className="inline-flex h-9 w-9 items-center justify-center rounded-lg border text-sm" style={{ color: '#b91c1c', borderColor: '#fecaca' }}>x</button></div>
          </article>
          <article className="border-b p-4 last:border-b-0 lg:hidden" style={{ borderColor: '#edf0f5' }}>
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 flex-none items-center justify-center overflow-hidden rounded-lg text-sm font-bold" style={{ background: tenant.primary_color, color: '#fff' }}>{tenant.logo_url ? <img src={tenant.logo_url} alt="" className="h-full w-full object-cover" /> : tenant.nama_travel.trim().charAt(0).toUpperCase()}</div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2"><div className="min-w-0"><p className="truncate text-sm font-bold" style={{ color: '#172033' }}>{tenant.nama_travel}</p><p className="mt-0.5 truncate font-mono text-[11px]" style={{ color: '#98a2b3' }}>{tenant.slug ? `/t/${tenant.slug}` : `Kode ${tenant.activation_code}`}</p></div>{needsAttention && <span className="flex-none rounded px-1.5 py-0.5 text-[10px] font-bold" style={{ background: '#fef3c7', color: '#92400e' }}>CEK</span>}</div>
              </div>
            </div>
            <div className="mt-4 rounded-lg px-3 py-2.5" style={{ background: '#f8fafc' }}>
              <p className="truncate text-sm font-semibold" style={{ color: '#344054' }}>{operationalBatch?.nama_batch ?? 'Belum ada batch aktif'}</p>
              <p className="mt-0.5 text-xs" style={{ color: metric.activeBatch ? '#047857' : '#667085' }}>{metric.activeBatch ? 'Sedang berjalan' : operationalBatch ? `Berangkat ${formatDate(operationalBatch.tanggal_keberangkatan)}` : 'Buat batch untuk mulai operasional'}</p>
            </div>
            <div className="mt-3 grid grid-cols-3 divide-x" style={{ color: '#344054' }}>
              <div className="pr-2"><p className="text-sm font-bold">{metric.jamaahCount}</p><p className="text-[11px]" style={{ color: '#667085' }}>Jamaah</p></div>
              <div className="px-3"><p className="text-sm font-bold" style={{ color: metric.operatorCount ? '#344054' : '#b45309' }}>{metric.operatorCount}</p><p className="text-[11px]" style={{ color: '#667085' }}>Operator</p></div>
              <div className="pl-3"><p className="text-sm font-bold" style={{ color: metric.openHelpCount ? '#b45309' : '#344054' }}>{metric.openHelpCount}</p><p className="text-[11px]" style={{ color: '#667085' }}>Bantuan</p></div>
            </div>
            <div className="mt-4 grid grid-cols-[1fr_42px] gap-2"><Link to={`/admin/tenants/${tenant.id}`} className="inline-flex h-10 items-center justify-center rounded-lg text-sm font-semibold" style={{ background: '#e8f7d1', color: '#14532d' }}>Kelola Travel</Link><button type="button" aria-label={`Hapus ${tenant.nama_travel}`} onClick={() => { setHapusTarget(tenant); setKonfirmText(''); }} className="inline-flex h-10 items-center justify-center rounded-lg border text-sm" style={{ color: '#b91c1c', borderColor: '#fecaca' }}>x</button></div>
          </article>
          </div>;
        })}
      </section>

      {hapusTarget && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => !deleting && setHapusTarget(null)}><div className="w-full max-w-md rounded-lg bg-white p-6" onClick={(event) => event.stopPropagation()}><h2 className="text-lg font-bold" style={{ color: '#111827' }}>Hapus travel</h2><p className="mt-2 text-sm leading-relaxed" style={{ color: '#4b5563' }}>Semua data travel, batch, jamaah, agenda, dan akses operator akan dihapus. Ketik <b>{hapusTarget.nama_travel}</b> untuk konfirmasi.</p><input autoFocus value={konfirmText} onChange={(event) => setKonfirmText(event.target.value)} className="mt-4 h-10 w-full rounded-lg border px-3 text-sm" style={{ borderColor: '#d1d5db' }} /><div className="mt-5 flex justify-end gap-2"><button type="button" disabled={deleting} onClick={() => setHapusTarget(null)} className="h-10 rounded-lg border px-4 text-sm font-semibold" style={{ borderColor: '#d1d5db', color: '#374151' }}>Batal</button><button type="button" disabled={deleting || konfirmText.trim() !== hapusTarget.nama_travel.trim()} onClick={() => void handleDelete()} className="h-10 rounded-lg px-4 text-sm font-semibold" style={{ background: deleting || konfirmText.trim() !== hapusTarget.nama_travel.trim() ? '#fca5a5' : '#dc2626', color: '#fff' }}>{deleting ? 'Menghapus...' : 'Hapus permanen'}</button></div></div></div>}
    </AdminLayout>
  );
}
