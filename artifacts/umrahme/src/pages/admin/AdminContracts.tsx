import { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import ContractTemplate from '../../components/ContractTemplate';
import { fetchTenants, fetchTravelContracts, upsertTravelContract, type TenantRow, type TravelContractRow } from '../../lib/supabase';

export default function AdminContracts() {
  const [tenants, setTenants] = useState<TenantRow[]>([]);
  const [contracts, setContracts] = useState<TravelContractRow[]>([]);
  const [tenantId, setTenantId] = useState('');
  const [number, setNumber] = useState('');
  const [status, setStatus] = useState<TravelContractRow['status']>('draft');
  const [message, setMessage] = useState('');
  const load = () => Promise.all([fetchTenants(), fetchTravelContracts()]).then(([t, c]) => { setTenants(t); setContracts(c); });
  useEffect(() => { void load(); }, []);
  const travel = tenants.find(t => t.id === tenantId);
  const contract = contracts.find(c => c.tenant_id === tenantId);
  const save = async () => {
    if (!travel || !number) return setMessage('Pilih travel dan isi nomor kontrak.');
    await upsertTravelContract({ tenant_id: travel.id, contract_number: number, package_name: 'Starter', status, starts_at: null, ends_at: null, annual_fee: 0, notes: null });
    setMessage('Kontrak tersimpan.'); await load();
  };
  return <AdminLayout><p className="text-[11px] font-bold uppercase tracking-[0.12em] text-primary">Master Admin</p><h1 className="mt-2 text-[28px] font-bold text-ink">Kontrak Travel</h1><div className="mt-6 grid gap-6 lg:grid-cols-[320px_1fr]"><section className="border bg-white p-5"><select value={tenantId} onChange={e => setTenantId(e.target.value)} className="w-full border p-3"><option value="">Pilih travel</option>{tenants.map(t => <option key={t.id} value={t.id}>{t.nama_travel}</option>)}</select><input value={number} onChange={e => setNumber(e.target.value)} placeholder="Nomor kontrak" className="mt-3 w-full border p-3" /><select value={status} onChange={e => setStatus(e.target.value as TravelContractRow['status'])} className="mt-3 w-full border p-3"><option value="draft">Draft</option><option value="active">Aktif</option><option value="expired">Berakhir</option></select><button onClick={() => void save()} className="mt-4 w-full bg-primary py-3 text-white">Simpan kontrak</button><p className="mt-3 text-xs text-mute">{message}</p></section><ContractTemplate travelName={travel?.nama_travel ?? 'Pilih travel'} contract={contract ?? null} /></div></AdminLayout>;
}
