import { useEffect, useState } from 'react';
import TravelLayout from '../../components/travel/TravelLayout';
import ContractTemplate from '../../components/ContractTemplate';
import { useTravelAuth } from '../../context/TravelAuthContext';
import { fetchTravelContract, type TravelContractRow } from '../../lib/supabase';

export default function TravelContract() {
  const { tenant } = useTravelAuth();
  const [contract, setContract] = useState<TravelContractRow | null>(null);
  useEffect(() => { if (tenant?.id) fetchTravelContract(tenant.id).then(setContract).catch(() => {}); }, [tenant?.id]);
  return <TravelLayout><div className="mx-auto max-w-3xl"><ContractTemplate travelName={tenant?.nama_travel ?? 'Travel Partner'} compact /><div className="mt-4 border-y border-hairline py-3 text-[12px] text-charcoal">{contract ? <><b>{contract.contract_number}</b> · Paket {contract.package_name} · Status {contract.status}</> : 'Kontrak belum diterbitkan oleh Umrahme.'}</div></div></TravelLayout>;
}
