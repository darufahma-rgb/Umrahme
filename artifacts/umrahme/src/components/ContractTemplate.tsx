type ContractSummary = {
  contract_number: string;
  status: 'draft' | 'active' | 'expired' | 'terminated';
  starts_at: string | null;
  ends_at: string | null;
};

export default function ContractTemplate({ travelName, compact = false, contract }: { travelName: string; compact?: boolean; contract?: ContractSummary | null }) {
  const contractPeriod = contract?.starts_at && contract?.ends_at
    ? `${new Date(contract.starts_at).toLocaleDateString('id-ID')} - ${new Date(contract.ends_at).toLocaleDateString('id-ID')}`
    : '12 bulan';
  const contractStatus = contract?.status === 'active' ? 'Aktif' : contract?.status === 'expired' ? 'Berakhir' : contract?.status === 'terminated' ? 'Dihentikan' : 'Template aktif';
  return (
    <article className="border border-hairline bg-white p-5 sm:p-7">
      <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">Perjanjian Berlangganan Platform</p>
      <h1 className="mt-2 text-[22px] font-extrabold text-ink">Kontrak Layanan Umrahme</h1>
      <div className="mt-5 grid gap-3 border-y border-hairline py-4 text-[12px] sm:grid-cols-3">
        <p><span className="block text-mute">Mitra travel</span><strong>{travelName}</strong></p>
        <p><span className="block text-mute">Masa kontrak</span><strong>{contractPeriod}</strong></p>
        <p><span className="block text-mute">Status</span><strong className="text-badge-success">{contractStatus}</strong></p>
      </div>
      {!compact && <div className="mt-5 space-y-4 text-[13px] leading-relaxed text-charcoal">
        <section><h2 className="font-bold text-ink">1. Ruang Lingkup</h2><p className="mt-1">Umrahme menyediakan lisensi penggunaan platform pendamping jamaah, dashboard travel, dan pembaruan sistem selama masa kontrak.</p></section>
        <section><h2 className="font-bold text-ink">2. Kuota Penerbitan Jamaah</h2><p className="mt-1">Kuota diterbitkan oleh master admin setelah pembayaran diterima. Satu kuota digunakan saat akun jamaah diterbitkan dan berlaku selama kontrak aktif.</p></section>
        <section><h2 className="font-bold text-ink">3. Data dan Tanggung Jawab</h2><p className="mt-1">Travel tetap pemilik data jamaah dan bertanggung jawab atas ketepatan data, itinerary, serta materi yang dipublikasikan. Umrahme mengelola keamanan dan ketersediaan platform.</p></section>
        <section><h2 className="font-bold text-ink">4. Perpanjangan dan Pengakhiran</h2><p className="mt-1">Kontrak diperpanjang setiap 12 bulan kecuali ada pemberitahuan tertulis 30 hari sebelumnya. Data dapat diekspor dalam 30 hari setelah pengakhiran layanan.</p></section>
      </div>}
    </article>
  );
}
