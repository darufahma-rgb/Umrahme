import React from 'react';
import { useState, useEffect, useRef, useCallback, type FormEvent, type ChangeEvent } from 'react';
import * as XLSX from 'xlsx';
import { AlertCircle, ArrowRight, CheckCircle2, ClipboardList, HeartPulse, MapPin, MessageCircle, PackageCheck } from 'lucide-react';
import { useTravelAuth } from '../../context/TravelAuthContext';
import TravelLayout from '../../components/travel/TravelLayout';
import {
  fetchKeberangkatan, createKeberangkatan, updateKeberangkatan, deleteKeberangkatan,
  fetchJamaah, createJamaahWithQuota, updateJamaah, deleteJamaah, bulkInsertJamaah, bulkCreateJamaahWithQuota, fetchTenantQuotaBalance,
  fetchAgenda, createAgenda, deleteAgenda, bulkInsertAgenda,
  fetchItineraryAddons, createItineraryAddon, fetchItineraryAddonMembers, replaceItineraryAddonMembers, fetchItineraryAddonItems, createItineraryAddonItem,
  fetchAnnouncements, createAnnouncement, deleteAnnouncement,
  fetchHelpRequests, updateHelpRequestStatus,
  fetchEquipmentCatalog, fetchEquipmentAssignments, createEquipmentCatalogItem, updateEquipmentAssignment,
  fetchJamaahDocuments, updateJamaahDocument, bulkUpdateJamaahDocuments,
  type JamaahDocumentRow, type JamaahDocumentStatus,
  type KeberangkatanRow, type JamaahAccountRow, type AgendaItemRow, type TravelAnnouncementRow, type HelpRequestRow, type HelpRequestStatus, type EquipmentCatalogRow, type EquipmentAssignmentRow, type EquipmentAssignmentStatus, type TenantQuotaBalance, type ItineraryAddonRow, type ItineraryAddonItemRow,
  supabase,
} from '../../lib/supabase';

/* ─── Helpers ─────────────────────────────────────────────────────── */

function normalizePhone(val: string) {
  return val.replace(/[^\d+]/g, '');
}

function formatTanggal(iso: string) {
  return new Date(iso + 'T00:00:00').toLocaleDateString('id-ID', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  });
}

function formatRentangTanggal(mulai: string | null, selesai: string | null) {
  if (!mulai) return 'Tanggal belum diisi';
  const pendek = (iso: string) => new Date(iso + 'T00:00:00').toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  if (!selesai) return pendek(mulai);
  const hari = Math.round((new Date(selesai + 'T00:00:00').getTime() - new Date(mulai + 'T00:00:00').getTime()) / 86400000) + 1;
  return `${pendek(mulai)} – ${pendek(selesai)} · ${hari} hari`;
}

function formatDatetime(iso: string) {
  return new Date(iso).toLocaleString('id-ID', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
  });
}

function isBatchFinished(batch: Pick<KeberangkatanRow, 'tanggal_kepulangan' | 'fase_override'>) {
  if (batch.fase_override === 'selesai') return true;
  if (!batch.tanggal_kepulangan) return false;
  return batch.tanggal_kepulangan < new Date().toLocaleDateString('en-CA');
}

/* ─── Styled primitives ───────────────────────────────────────────── */

const inputBase: React.CSSProperties = {
  border: '1px solid rgba(0,0,0,0.09)',
  background: '#ffffff',
  color: '#202020',
  boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.04)',
};

const cardStyle: React.CSSProperties = {
  background: '#ffffff',
  border: '1px solid rgba(32,32,32,0.10)',
  boxShadow: '0 2px 8px rgba(32,32,32,0.05)',
};

const PRIMARY = 'var(--color-primary)';
const PRIMARY_DEEP = 'var(--color-primary-deep)';
const PRIMARY_BG = 'color-mix(in srgb, var(--color-primary) 7%, transparent)';
const PRIMARY_BORDER = 'color-mix(in srgb, var(--color-primary) 18%, transparent)';

const StyledInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function StyledInput(props, ref) {
    return (
      <input
        {...props}
        ref={ref}
        className={`w-full rounded-xl px-3.5 py-2.5 text-[13px] transition-all duration-150 focus:outline-none ${props.className ?? ''}`}
        style={{ ...inputBase, ...props.style }}
        onFocus={e => { e.currentTarget.style.border = `1px solid ${PRIMARY}`; e.currentTarget.style.boxShadow = '0 0 0 3px color-mix(in srgb, var(--color-primary) 12%, transparent)'; e.currentTarget.style.background = '#ffffff'; props.onFocus?.(e); }}
        onBlur={e => { e.currentTarget.style.border = '1px solid rgba(0,0,0,0.09)'; e.currentTarget.style.boxShadow = 'inset 0 1px 2px rgba(0,0,0,0.04)'; e.currentTarget.style.background = '#fafaf9'; props.onBlur?.(e); }}
      />
    );
  }
);

function StyledTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-xl px-3.5 py-2.5 text-[13px] transition-all duration-150 focus:outline-none resize-none ${props.className ?? ''}`}
      style={{ ...inputBase, ...props.style }}
      onFocus={e => { e.currentTarget.style.border = `1px solid ${PRIMARY}`; e.currentTarget.style.boxShadow = '0 0 0 3px color-mix(in srgb, var(--color-primary) 12%, transparent)'; e.currentTarget.style.background = '#ffffff'; props.onFocus?.(e); }}
      onBlur={e => { e.currentTarget.style.border = '1px solid rgba(0,0,0,0.09)'; e.currentTarget.style.boxShadow = 'inset 0 1px 2px rgba(0,0,0,0.04)'; e.currentTarget.style.background = '#fafaf9'; props.onBlur?.(e); }}
    />
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="block font-mono text-[10px] uppercase tracking-[0.14em] mb-2" style={{ color: '#6b7280' }}>{children}</label>;
}

/* ─── Constants ───────────────────────────────────────────────────── */

const FASE_OPTIONS: { value: JamaahAccountRow['fase']; label: string }[] = [
  { value: 'persiapan', label: 'Persiapan' },
  { value: 'tanah-suci', label: 'Di Tanah Suci' },
  { value: 'selesai', label: 'Selesai' },
];

type TabId = 'overview' | 'keberangkatan' | 'jamaah' | 'dokumen' | 'agenda' | 'addon' | 'pengumuman' | 'care' | 'perlengkapan';

const TABS: { id: TabId; label: string }[] = [
  { id: 'overview', label: 'Command Center' },
  { id: 'keberangkatan', label: 'Keberangkatan' },
  { id: 'jamaah', label: 'Jamaah' },
  { id: 'dokumen', label: 'Dokumen' },
  { id: 'agenda', label: 'Agenda' },
  { id: 'addon', label: 'Itinerary Addon' },
  { id: 'pengumuman', label: 'Pengumuman' },
  { id: 'care', label: 'Care Center' },
  { id: 'perlengkapan', label: 'Perlengkapan' },
];

const DOC_TYPES: { type: 'paspor' | 'visa' | 'tiket'; label: string }[] = [
  { type: 'paspor', label: 'Paspor' },
  { type: 'visa', label: 'Visa' },
  { type: 'tiket', label: 'Tiket' },
];

const DOC_STATUS_OPTIONS: { value: JamaahDocumentStatus; label: string; color: string; bg: string }[] = [
  { value: 'belum', label: 'Belum', color: '#6b7280', bg: '#f9fafb' },
  { value: 'proses', label: 'Proses', color: '#b45309', bg: 'rgba(245,158,11,0.10)' },
  { value: 'lengkap', label: 'Lengkap', color: '#15803d', bg: 'rgba(22,163,74,0.09)' },
];

const DEFAULT_EQUIPMENT = ['Koper', 'Tas Sandang', 'Seragam', 'ID Card', 'Buku Panduan', 'Perlengkapan Ibadah'];

type BatchReadinessItem = {
  label: string;
  detail: string;
  ready: boolean;
  tab: TabId;
};

function getBatchReadiness(
  batch: KeberangkatanRow,
  jamaah: JamaahAccountRow[],
  agenda: AgendaItemRow[],
): BatchReadinessItem[] {
  const hasTravelDate = Boolean(batch.tanggal_keberangkatan && batch.tanggal_kepulangan);
  const validDateRange = !batch.tanggal_keberangkatan || !batch.tanggal_kepulangan
    || batch.tanggal_kepulangan >= batch.tanggal_keberangkatan;
  const hotelReady = Boolean(batch.hotel_makkah?.trim() && batch.hotel_madinah?.trim());
  const guideReady = Boolean(batch.guide_name?.trim() && batch.guide_whatsapp?.trim());
  const meetingReady = Boolean(batch.meeting_point?.trim());
  const hasJamaah = jamaah.length > 0;
  const hasAgenda = agenda.length > 0;
  const overriddenHotels = jamaah.filter((item) => item.hotel_makkah?.trim() || item.hotel_madinah?.trim()).length;

  return [
    { label: 'Tanggal perjalanan', detail: !validDateRange ? 'Tanggal pulang lebih awal dari keberangkatan.' : hasTravelDate ? 'Tanggal berangkat dan pulang sudah diisi.' : 'Isi tanggal berangkat dan pulang.', ready: hasTravelDate && validDateRange, tab: 'keberangkatan' },
    { label: 'Hotel Makkah & Madinah', detail: hotelReady ? 'Hotel batch menjadi acuan seluruh jamaah.' : 'Lengkapi dua hotel untuk batch ini.', ready: hotelReady, tab: 'keberangkatan' },
    { label: 'Pembimbing & titik kumpul', detail: guideReady && meetingReady ? 'Kontak bantuan dan titik kumpul siap dipakai.' : 'Lengkapi pembimbing WhatsApp dan titik kumpul.', ready: guideReady && meetingReady, tab: 'keberangkatan' },
    { label: 'Jamaah', detail: hasJamaah ? `${jamaah.length} jamaah ada di batch ini.${overriddenHotels ? ` ${overriddenHotels} memiliki override hotel.` : ''}` : 'Belum ada jamaah di batch ini.', ready: hasJamaah && overriddenHotels === 0, tab: 'jamaah' },
    { label: 'Agenda perjalanan', detail: hasAgenda ? `${agenda.length} agenda siap ditampilkan.` : 'Tambahkan minimal satu agenda perjalanan.', ready: hasAgenda, tab: 'agenda' },
  ];
}

/* ─── Component ───────────────────────────────────────────────────── */

export default function TravelDashboard() {
  const { tenant, email } = useTravelAuth();

  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [copied, setCopied] = useState(false);

  const slugUrl = tenant?.slug ? `${window.location.origin}/t/${tenant.slug}` : null;

  const handleCopySlug = useCallback(() => {
    if (!slugUrl) return;
    navigator.clipboard.writeText(slugUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [slugUrl]);

  /* ── Keberangkatan ───────────────────────────────────────────────── */
  const [keberangkatanList, setKeberangkatanList] = useState<KeberangkatanRow[]>([]);
  const [keberangkatanLoading, setKeberangkatanLoading] = useState(false);
  const [selectedKeberangkatan, setSelectedKeberangkatan] = useState('');

  const [kbFormOpen, setKbFormOpen] = useState(false);
  const [kbEditId, setKbEditId] = useState<string | null>(null);
  const [kbNamaBatch, setKbNamaBatch] = useState('');
  const [kbTanggalBerangkat, setKbTanggalBerangkat] = useState('');
  const [kbTanggalPulang, setKbTanggalPulang] = useState('');
  const [kbHotelMakkah, setKbHotelMakkah] = useState('');
  const [kbHotelMadinah, setKbHotelMadinah] = useState('');
  const [kbMeetingPoint, setKbMeetingPoint] = useState('');
  const [kbGuideName, setKbGuideName] = useState('');
  const [kbGuideWhatsapp, setKbGuideWhatsapp] = useState('');
  const [kbTourLeaderName, setKbTourLeaderName] = useState('');
  const [kbTourLeaderWhatsapp, setKbTourLeaderWhatsapp] = useState('');
  const [kbEmergencyNote, setKbEmergencyNote] = useState('');
  const [kbFaseOverride, setKbFaseOverride] = useState('');
  const [kbAktif, setKbAktif] = useState(true);
  const [kbSaving, setKbSaving] = useState(false);
  const [kbError, setKbError] = useState('');

  /* ── Jamaah ──────────────────────────────────────────────────────── */
  const [jamaahList, setJamaahList] = useState<JamaahAccountRow[]>([]);
  const [jamaahLoading, setJamaahLoading] = useState(false);

  const [jmNama, setJmNama] = useState('');
  const [jmNomorJamaah, setJmNomorJamaah] = useState('');
  const [jmRombongan, setJmRombongan] = useState('');
  const [jmBus, setJmBus] = useState('');
  const [jmKamar, setJmKamar] = useState('');
  const [jmPaspor, setJmPaspor] = useState('');
  const [jmFase, setJmFase] = useState<JamaahAccountRow['fase']>('persiapan');
  const [jmSubmitting, setJmSubmitting] = useState(false);
  const [jmError, setJmError] = useState('');
  const [showDetailJamaah, setShowDetailJamaah] = useState(false);
  const namaRef = useRef<HTMLInputElement>(null);

  const [editingJamaahId, setEditingJamaahId] = useState<string | null>(null);
  const [editNama, setEditNama] = useState('');
  const [editNomorJamaah, setEditNomorJamaah] = useState('');
  const [editRombongan, setEditRombongan] = useState('');
  const [editPaspor, setEditPaspor] = useState('');
  const [editHotelMakkah, setEditHotelMakkah] = useState('');
  const [editHotelMadinah, setEditHotelMadinah] = useState('');
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState('');

  const [importOpen, setImportOpen] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [importError, setImportError] = useState('');
  const [importPreview, setImportPreview] = useState<Array<{ nama: string; nomor_jamaah: string; nomor_paspor: string; hotel_makkah: string; hotel_madinah: string }>>([]);
  const [quotaBalance, setQuotaBalance] = useState<TenantQuotaBalance | null>(null);
  const [importSaving, setImportSaving] = useState(false);
  const importFileRef = useRef<HTMLInputElement>(null);

  const [agImportOpen, setAgImportOpen] = useState(false);
  const [agImportLoading, setAgImportLoading] = useState(false);
  const [agImportError, setAgImportError] = useState('');
  const [agImportPreview, setAgImportPreview] = useState<Array<{ tanggal: string; jam_mulai: string; judul: string; lokasi: string; deskripsi: string }>>([]);
  const [agImportSaving, setAgImportSaving] = useState(false);
  const agImportFileRef = useRef<HTMLInputElement>(null);

  /* ── Agenda ──────────────────────────────────────────────────────── */
  const [agendaItems, setAgendaItems] = useState<AgendaItemRow[]>([]);
  const [agendaLoading, setAgendaLoading] = useState(false);
  const [agJudul, setAgJudul] = useState('');
  const [agTanggal, setAgTanggal] = useState('');
  const [agJam, setAgJam] = useState('');
  const [agDeskripsi, setAgDeskripsi] = useState('');
  const [agLokasi, setAgLokasi] = useState('');
  const [agSubmitting, setAgSubmitting] = useState(false);
  const [agError, setAgError] = useState('');

  /* Itinerary addon: agenda khusus sebagian jamaah, tanpa memecah batch. */
  const [itineraryAddons, setItineraryAddons] = useState<ItineraryAddonRow[]>([]);
  const [selectedAddonId, setSelectedAddonId] = useState('');
  const [addonMembers, setAddonMembers] = useState<string[]>([]);
  const [addonItems, setAddonItems] = useState<ItineraryAddonItemRow[]>([]);
  const [addonName, setAddonName] = useState('');
  const [addonDescription, setAddonDescription] = useState('');
  const [addonTanggal, setAddonTanggal] = useState('');
  const [addonJam, setAddonJam] = useState('');
  const [addonJudul, setAddonJudul] = useState('');
  const [addonDeskripsi, setAddonDeskripsi] = useState('');
  const [addonLokasi, setAddonLokasi] = useState('');
  const [addonSaving, setAddonSaving] = useState(false);
  const [addonError, setAddonError] = useState('');

  /* ── Agenda inline edit ──────────────────────────────────────────── */
  const [agEditingId, setAgEditingId] = useState<string | null>(null);
  const [agEditFields, setAgEditFields] = useState({ tanggal: '', jam_mulai: '', judul: '', deskripsi: '', lokasi: '', urutan: 0 });
  const [agEditSaving, setAgEditSaving] = useState(false);
  const [agEditError, setAgEditError] = useState('');
  const [agEditSuccess, setAgEditSuccess] = useState('');

  /* ── Pengumuman ───────────────────────────────────────────────────── */
  const [announcements, setAnnouncements] = useState<TravelAnnouncementRow[]>([]);
  const [annLoading, setAnnLoading] = useState(false);
  const [annLabel, setAnnLabel] = useState('Info');
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annImportant, setAnnImportant] = useState(false);
  const [annSubmitting, setAnnSubmitting] = useState(false);
  const [annError, setAnnError] = useState('');

  /* â”€â”€ Jamaah Care Center â”€â”€ */
  const [helpRequests, setHelpRequests] = useState<HelpRequestRow[]>([]);
  const [helpLoading, setHelpLoading] = useState(false);
  const [helpUpdatingId, setHelpUpdatingId] = useState<string | null>(null);
  const [helpStatusFilter, setHelpStatusFilter] = useState<HelpRequestStatus | 'semua'>('baru');

  /* â”€â”€ Perlengkapan Jamaah â”€â”€ */
  const [equipmentCatalog, setEquipmentCatalog] = useState<EquipmentCatalogRow[]>([]);
  const [equipmentAssignments, setEquipmentAssignments] = useState<EquipmentAssignmentRow[]>([]);
  const [equipmentLoading, setEquipmentLoading] = useState(false);
  const [equipmentSaving, setEquipmentSaving] = useState<string | null>(null);
  const [equipmentJamaahId, setEquipmentJamaahId] = useState<string | null>(null);
  const [equipmentLabel, setEquipmentLabel] = useState('');
  const [equipmentAdding, setEquipmentAdding] = useState(false);

  /* ── Dokumen Jamaah (paspor, visa, tiket) ── */
  const [docRows, setDocRows] = useState<JamaahDocumentRow[]>([]);
  const [docLoading, setDocLoading] = useState(false);
  const [docSaving, setDocSaving] = useState<string | null>(null);
  const [docError, setDocError] = useState('');
  const [docSearch, setDocSearch] = useState('');

  /* ── Form tambah: dilipat agar daftar langsung terlihat ── */
  const [jmFormOpen, setJmFormOpen] = useState(false);
  const [agFormOpen, setAgFormOpen] = useState(false);
  const [annFormOpen, setAnnFormOpen] = useState(false);

  /* ── Loaders ─────────────────────────────────────────────────────── */

  const loadKeberangkatan = useCallback(async () => {
    if (!tenant?.id) return;
    setKeberangkatanLoading(true);
    fetchKeberangkatan(tenant.id).then(list => {
      setKeberangkatanList(list);
      if (list.length > 0 && !selectedKeberangkatan) setSelectedKeberangkatan(list[0].id);
    }).catch(() => {}).finally(() => setKeberangkatanLoading(false));
  }, [tenant?.id, selectedKeberangkatan]);

  const loadJamaah = useCallback(async () => {
    if (!tenant?.id || !selectedKeberangkatan) return;
    setJamaahLoading(true);
    fetchJamaah(selectedKeberangkatan).then(setJamaahList).catch(() => {}).finally(() => setJamaahLoading(false));
  }, [tenant?.id, selectedKeberangkatan]);

  const loadAgenda = useCallback(async () => {
    if (!tenant?.id || !selectedKeberangkatan) return;
    setAgendaLoading(true);
    fetchAgenda(selectedKeberangkatan).then(setAgendaItems).catch(() => {}).finally(() => setAgendaLoading(false));
  }, [tenant?.id, selectedKeberangkatan]);

  const loadItineraryAddons = useCallback(async () => {
    if (!selectedKeberangkatan) return;
    try {
      const list = await fetchItineraryAddons(selectedKeberangkatan);
      setItineraryAddons(list);
      setSelectedAddonId((current) => list.some((item) => item.id === current) ? current : (list[0]?.id ?? ''));
    } catch {
      setItineraryAddons([]);
      setSelectedAddonId('');
    }
  }, [selectedKeberangkatan]);

  const loadAnnouncements = useCallback(async () => {
    if (!tenant?.id || !selectedKeberangkatan) return;
    setAnnLoading(true);
    fetchAnnouncements(selectedKeberangkatan).then(setAnnouncements).catch(() => {}).finally(() => setAnnLoading(false));
  }, [tenant?.id, selectedKeberangkatan]);

  const loadHelpRequests = useCallback(async () => {
    if (!selectedKeberangkatan) return;
    setHelpLoading(true);
    fetchHelpRequests(selectedKeberangkatan).then(setHelpRequests).catch(() => setHelpRequests([])).finally(() => setHelpLoading(false));
  }, [selectedKeberangkatan]);

  const loadEquipment = useCallback(async () => {
    if (!selectedKeberangkatan) return;
    setEquipmentLoading(true);
    try {
      const [catalog, assignments] = await Promise.all([fetchEquipmentCatalog(selectedKeberangkatan), fetchEquipmentAssignments(selectedKeberangkatan)]);
      setEquipmentCatalog(catalog);
      setEquipmentAssignments(assignments);
    } catch {
      setEquipmentCatalog([]);
      setEquipmentAssignments([]);
    } finally {
      setEquipmentLoading(false);
    }
  }, [selectedKeberangkatan]);

  const loadDocuments = useCallback(async () => {
    if (!tenant?.id) return;
    if (jamaahList.length === 0) { setDocRows([]); return; }
    setDocLoading(true); setDocError('');
    try {
      setDocRows(await fetchJamaahDocuments(tenant.id, jamaahList.map(j => j.id)));
    } catch (err: unknown) {
      setDocRows([]);
      setDocError(err instanceof Error ? err.message : 'Gagal memuat status dokumen.');
    } finally {
      setDocLoading(false);
    }
  }, [tenant?.id, jamaahList]);

  useEffect(() => { void loadDocuments(); }, [loadDocuments]);

  useEffect(() => {
    if (tenant?.id) loadKeberangkatan();
  }, [tenant?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (tenant?.id) fetchTenantQuotaBalance(tenant.id).then(setQuotaBalance).catch(() => setQuotaBalance(null));
  }, [tenant?.id]);

  useEffect(() => {
    if (selectedKeberangkatan) {
      loadJamaah();
      loadAgenda();
      loadItineraryAddons();
      loadAnnouncements();
      loadHelpRequests();
      loadEquipment();
    }
  }, [selectedKeberangkatan, loadJamaah, loadAgenda, loadItineraryAddons, loadAnnouncements, loadHelpRequests, loadEquipment]);

  useEffect(() => {
    if (!selectedAddonId) { setAddonMembers([]); setAddonItems([]); return; }
    void Promise.all([fetchItineraryAddonMembers(selectedAddonId), fetchItineraryAddonItems(selectedAddonId)])
      .then(([members, items]) => { setAddonMembers(members); setAddonItems(items); })
      .catch(() => { setAddonMembers([]); setAddonItems([]); });
  }, [selectedAddonId]);

  // Clear agenda inline-edit state when the selected batch changes
  useEffect(() => {
    setAgEditingId(null);
    setAgEditError('');
    setAgEditSuccess('');
  }, [selectedKeberangkatan]);

  /* ── Keberangkatan handlers ──────────────────────────────────────── */

  function openKbForm(kb?: KeberangkatanRow) {
    if (kb) {
      setKbEditId(kb.id);
      setKbNamaBatch(kb.nama_batch);
      setKbTanggalBerangkat(kb.tanggal_keberangkatan ?? '');
      setKbTanggalPulang(kb.tanggal_kepulangan ?? '');
      setKbHotelMakkah(kb.hotel_makkah ?? '');
      setKbHotelMadinah(kb.hotel_madinah ?? '');
      setKbMeetingPoint(kb.meeting_point ?? '');
      setKbGuideName(kb.guide_name ?? '');
      setKbGuideWhatsapp(kb.guide_whatsapp ?? '');
      setKbTourLeaderName(kb.tour_leader_name ?? '');
      setKbTourLeaderWhatsapp(kb.tour_leader_whatsapp ?? '');
      setKbEmergencyNote(kb.emergency_note ?? '');
      setKbFaseOverride(kb.fase_override ?? '');
      setKbAktif(kb.aktif ?? true);
    } else {
      setKbEditId(null);
      setKbNamaBatch(''); setKbTanggalBerangkat(''); setKbTanggalPulang('');
      setKbHotelMakkah(''); setKbHotelMadinah(''); setKbMeetingPoint('');
      setKbGuideName(''); setKbGuideWhatsapp('');
      setKbTourLeaderName(''); setKbTourLeaderWhatsapp('');
      setKbEmergencyNote(''); setKbFaseOverride(''); setKbAktif(true);
    }
    setKbError('');
    setKbFormOpen(true);
  }

  async function handleSaveKeberangkatan(e: FormEvent) {
    e.preventDefault();
    if (!tenant?.id) return;
    if (!kbNamaBatch.trim()) { setKbError('Nama batch wajib diisi.'); return; }
    if (kbTanggalBerangkat && kbTanggalPulang && kbTanggalPulang < kbTanggalBerangkat) {
      setKbError('Tanggal kepulangan tidak boleh lebih awal dari tanggal keberangkatan.');
      return;
    }
    setKbSaving(true); setKbError('');
    try {
      const payload = {
        nama_batch: kbNamaBatch.trim(),
        tanggal_keberangkatan: kbTanggalBerangkat || null,
        tanggal_kepulangan: kbTanggalPulang || null,
        hotel_makkah: kbHotelMakkah.trim() || null,
        hotel_madinah: kbHotelMadinah.trim() || null,
        meeting_point: kbMeetingPoint.trim() || null,
        guide_name: kbGuideName.trim() || null,
        guide_whatsapp: kbGuideWhatsapp.trim() || null,
        tour_leader_name: kbTourLeaderName.trim() || null,
        tour_leader_whatsapp: kbTourLeaderWhatsapp.trim() || null,
        emergency_note: kbEmergencyNote.trim() || null,
        fase_override: (kbFaseOverride || null) as 'persiapan' | 'tanah-suci' | 'selesai' | null,
        aktif: kbAktif,
      };
      if (kbEditId) {
        await updateKeberangkatan(kbEditId, payload);
      } else {
        const newKb = await createKeberangkatan(tenant.id, payload);
        setSelectedKeberangkatan(newKb.id);
      }
      setKbFormOpen(false);
      await loadKeberangkatan();
    } catch (err: unknown) { setKbError(err instanceof Error ? err.message : 'Gagal menyimpan.'); }
    setKbSaving(false);
  }

  async function handleDeleteKeberangkatan(kbId: string, nama: string) {
    if (!window.confirm(`Hapus batch "${nama}"? Semua jamaah, agenda, dan pengumuman batch ini juga akan terpengaruh.`)) return;
    await deleteKeberangkatan(kbId);
    setKeberangkatanList(prev => {
      const next = prev.filter(k => k.id !== kbId);
      if (selectedKeberangkatan === kbId) setSelectedKeberangkatan(next[0]?.id ?? '');
      return next;
    });
  }

  /* ── Jamaah handlers ─────────────────────────────────────────────── */

  async function handleAddJamaah(e: FormEvent) {
    e.preventDefault();
    if (!tenant?.id || !selectedKeberangkatan) return;
    setJmError('');
    if (!jmNama.trim()) { setJmError('Nama jamaah wajib diisi.'); return; }
    if (!jmNomorJamaah.trim()) { setJmError('Nomor jamaah wajib diisi.'); return; }
    setJmSubmitting(true);
    try {
      await createJamaahWithQuota(tenant.id, selectedKeberangkatan, {
        nama: jmNama.trim(), nomor_jamaah: jmNomorJamaah.trim(),
        rombongan: jmRombongan.trim() || null, nomor_bus: jmBus.trim() || null,
        nomor_kamar: jmKamar.trim() || null, nomor_paspor: jmPaspor.trim() || null,
        fase: jmFase,
      });
      setJmNama(''); setJmNomorJamaah(''); setJmRombongan(''); setJmBus(''); setJmKamar(''); setJmPaspor(''); setJmFase('persiapan');
      await loadJamaah();
      namaRef.current?.focus();
    } catch (err: unknown) { setJmError(err instanceof Error ? err.message : 'Gagal menambah jamaah.'); }
    setJmSubmitting(false);
  }

  async function handleDeleteJamaah(jamaahId: string, nama: string) {
    if (!tenant?.id || !window.confirm(`Hapus jamaah "${nama}"? Jamaah ini tidak bisa login lagi.`)) return;
    await deleteJamaah(tenant.id, jamaahId);
    setJamaahList(prev => prev.filter(j => j.id !== jamaahId));
  }

  async function handleUpdateJamaahFase(jamaahId: string, val: string) {
    if (!tenant?.id) return;
    const fase_override = (val === '' ? null : val) as JamaahAccountRow['fase'] | null;
    await updateJamaah(tenant.id, jamaahId, { fase_override } as Partial<JamaahAccountRow>);
    setJamaahList(prev => prev.map(j => j.id === jamaahId ? { ...j, fase_override } : j));
  }

  function startEditJamaah(j: JamaahAccountRow) {
    setEditingJamaahId(j.id);
    setEditNama(j.nama);
    setEditNomorJamaah(j.nomor_jamaah);
    setEditRombongan(j.rombongan ?? '');
    setEditPaspor(j.nomor_paspor ?? '');
    setEditHotelMakkah(j.hotel_makkah ?? '');
    setEditHotelMadinah(j.hotel_madinah ?? '');
    setEditError('');
  }

  function cancelEditJamaah() { setEditingJamaahId(null); setEditError(''); }

  async function saveEditJamaah(jamaahId: string) {
    if (!tenant?.id) return;
    if (!editNama.trim()) { setEditError('Nama wajib diisi.'); return; }
    if (!editNomorJamaah.trim()) { setEditError('No. Jamaah wajib diisi.'); return; }
    setEditSaving(true); setEditError('');
    try {
      const payload = {
        nama: editNama.trim(), nomor_jamaah: editNomorJamaah.trim(),
        rombongan: editRombongan.trim() || null, nomor_paspor: editPaspor.trim() || null,
        hotel_makkah: editHotelMakkah.trim() || null, hotel_madinah: editHotelMadinah.trim() || null,
      };
      await updateJamaah(tenant.id, jamaahId, payload as Partial<JamaahAccountRow>);
      setJamaahList(prev => prev.map(j => j.id === jamaahId ? { ...j, ...payload } : j));
      setEditingJamaahId(null);
    } catch (err: unknown) { setEditError(err instanceof Error ? err.message : 'Gagal menyimpan perubahan.'); }
    setEditSaving(false);
  }

  async function clearJamaahHotelOverride(jamaah: JamaahAccountRow) {
    if (!tenant?.id) return;
    if (!window.confirm(`Gunakan hotel dari batch untuk ${jamaah.nama}? Override hotel individual akan dihapus.`)) return;
    try {
      await updateJamaah(tenant.id, jamaah.id, { hotel_makkah: null, hotel_madinah: null });
      setJamaahList(prev => prev.map(item => item.id === jamaah.id
        ? { ...item, hotel_makkah: null, hotel_madinah: null }
        : item));
    } catch (err: unknown) {
      window.alert(err instanceof Error ? err.message : 'Gagal menghapus override hotel.');
    }
  }

  async function handleImportFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportError(''); setImportLoading(true); setImportPreview([]);
    try {
      const ext = file.name.split('.').pop()?.toLowerCase();
      let result: Array<{ nama?: unknown; nomor_jamaah?: unknown; nomor_paspor?: unknown; hotel_makkah?: unknown; hotel_madinah?: unknown }> = [];

      if (ext === 'xlsx' || ext === 'xls' || ext === 'csv') {
        const buf = await file.arrayBuffer();
        const wb = XLSX.read(buf, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });
        const resp = await fetch('/api/ai-extract-jamaah', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mode: 'excel', rows }),
        });
        const json = await resp.json() as { error?: string; jamaah?: typeof result };
        if (!resp.ok) throw new Error(json.error || 'Gagal ekstrak Excel.');
        result = json.jamaah ?? [];
      } else if (ext === 'pdf' || ['png', 'jpg', 'jpeg', 'webp'].includes(ext || '')) {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve((reader.result as string).split(',')[1]);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        const resp = await fetch('/api/ai-extract-jamaah', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mode: 'pdf', fileBase64: base64, mimeType: file.type }),
        });
        const json = await resp.json() as { error?: string; jamaah?: typeof result };
        if (!resp.ok) throw new Error(json.error || 'Gagal ekstrak PDF.');
        result = json.jamaah ?? [];
      } else {
        throw new Error('Format tidak didukung. Pakai Excel (.xlsx/.csv) atau PDF.');
      }

      const preview = (result || []).map((j, idx) => ({
        nama: String(j.nama ?? '').trim(),
        nomor_jamaah: String(j.nomor_jamaah ?? String(idx + 1).padStart(3, '0')).trim(),
        nomor_paspor: String(j.nomor_paspor ?? '').trim(),
        hotel_makkah: String(j.hotel_makkah ?? '').trim(),
        hotel_madinah: String(j.hotel_madinah ?? '').trim(),
      })).filter(j => j.nama);

      if (preview.length === 0) throw new Error('Tidak ada data jamaah terbaca. Cek format file.');
      setImportPreview(preview);
    } catch (err: unknown) { setImportError(err instanceof Error ? err.message : 'Gagal memproses file.'); }
    finally { setImportLoading(false); if (importFileRef.current) importFileRef.current.value = ''; }
  }

  function updatePreviewRow(idx: number, field: string, value: string) {
    setImportPreview(prev => prev.map((r, i) => i === idx ? { ...r, [field]: value } : r));
  }

  function removePreviewRow(idx: number) {
    setImportPreview(prev => prev.filter((_, i) => i !== idx));
  }

  async function confirmImport() {
    if (!tenant?.id || !selectedKeberangkatan || importPreview.length === 0) return;
    const invalid = importPreview.some(r => !r.nama.trim() || !r.nomor_jamaah.trim());
    if (invalid) { setImportError('Semua baris harus punya Nama & No. Jamaah.'); return; }
    setImportSaving(true); setImportError('');
    try {
      const payload = importPreview.map(r => ({
        nama: r.nama.trim(), nomor_jamaah: r.nomor_jamaah.trim(), nomor_paspor: r.nomor_paspor.trim() || null,
        hotel_makkah: r.hotel_makkah.trim() || null, hotel_madinah: r.hotel_madinah.trim() || null,
      }));
      const { inserted } = await bulkCreateJamaahWithQuota(tenant.id, selectedKeberangkatan, payload);
      setImportPreview([]); setImportOpen(false);
      await loadJamaah();
      fetchTenantQuotaBalance(tenant.id).then(setQuotaBalance).catch(() => {});
      alert(`${inserted} jamaah berhasil diimport.`);
    } catch (err: unknown) { setImportError(err instanceof Error ? err.message : 'Gagal menyimpan data.'); }
    setImportSaving(false);
  }

  /* ── Agenda handlers ─────────────────────────────────────────────── */

  async function handleAgImportFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !tenant?.id) return;
    if (!selectedKeberangkatan) { setAgImportError('Pilih keberangkatan dulu.'); return; }
    setAgImportError(''); setAgImportLoading(true); setAgImportPreview([]);
    try {
      const ext = file.name.split('.').pop()?.toLowerCase();
      let result: Array<{ tanggal?: string; jam_mulai?: string; judul?: string; lokasi?: string; deskripsi?: string }> = [];
      if (ext === 'xlsx' || ext === 'xls' || ext === 'csv') {
        const buf = await file.arrayBuffer();
        const wb = XLSX.read(buf, { type: 'array' });
        const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 1 });
        const { data: { session: agSession1 } } = await supabase.auth.getSession();
        const agAuth1: Record<string, string> = agSession1?.access_token ? { Authorization: `Bearer ${agSession1.access_token}` } : {};
        const resp = await fetch('/api/ai-extract-agenda', { method: 'POST', headers: { 'Content-Type': 'application/json', ...agAuth1 }, body: JSON.stringify({ mode: 'excel', rows }) });
        const json = await resp.json() as { error?: string; agenda?: typeof result };
        if (!resp.ok) throw new Error(json.error || 'Gagal ekstrak Excel.');
        result = json.agenda ?? [];
      } else if (ext === 'pdf' || ['png', 'jpg', 'jpeg', 'webp'].includes(ext || '')) {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve((reader.result as string).split(',')[1]);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        const { data: { session: agSession2 } } = await supabase.auth.getSession();
        const agAuth2: Record<string, string> = agSession2?.access_token ? { Authorization: `Bearer ${agSession2.access_token}` } : {};
        const resp = await fetch('/api/ai-extract-agenda', { method: 'POST', headers: { 'Content-Type': 'application/json', ...agAuth2 }, body: JSON.stringify({ mode: 'pdf', fileBase64: base64, mimeType: file.type }) });
        const json = await resp.json() as { error?: string; agenda?: typeof result };
        if (!resp.ok) throw new Error(json.error || 'Gagal ekstrak PDF.');
        result = json.agenda ?? [];
      } else {
        throw new Error('Format tidak didukung. Pakai Excel, CSV, PDF, atau gambar.');
      }
      const preview = (result || []).map(a => ({
        tanggal: String(a.tanggal ?? '').trim(),
        jam_mulai: String(a.jam_mulai ?? '').trim(),
        judul: String(a.judul ?? '').trim(),
        lokasi: String(a.lokasi ?? '').trim(),
        deskripsi: String(a.deskripsi ?? '').trim(),
      })).filter(a => a.judul);
      if (preview.length === 0) throw new Error('Tidak ada agenda terbaca. Cek file atau format.');
      setAgImportPreview(preview);
    } catch (err: unknown) {
      setAgImportError(err instanceof Error ? err.message : 'Gagal memproses file.');
    } finally {
      setAgImportLoading(false);
      if (agImportFileRef.current) agImportFileRef.current.value = '';
    }
  }

  function updateAgPreviewRow(idx: number, field: string, value: string) {
    setAgImportPreview(prev => prev.map((r, i) => i === idx ? { ...r, [field]: value } : r));
  }

  function removeAgPreviewRow(idx: number) {
    setAgImportPreview(prev => prev.filter((_, i) => i !== idx));
  }

  async function confirmAgImport() {
    if (agImportPreview.length === 0 || !selectedKeberangkatan || !tenant?.id) return;
    const invalid = agImportPreview.some(a => !a.judul.trim() || !a.tanggal.trim());
    if (invalid) { setAgImportError('Setiap agenda wajib punya tanggal & judul.'); return; }
    if (!window.confirm(`Ini akan menambahkan ${agImportPreview.length} agenda baru ke batch ini. Lanjutkan?`)) return;
    setAgImportSaving(true); setAgImportError('');
    try {
      const payload = agImportPreview.map(a => ({
        tanggal: a.tanggal.trim(),
        jam_mulai: a.jam_mulai.trim() || null,
        judul: a.judul.trim(),
        lokasi: a.lokasi.trim() || null,
        deskripsi: a.deskripsi.trim() || null,
        urutan: 0,
      }));
      const { inserted } = await bulkInsertAgenda(tenant.id, selectedKeberangkatan, payload);
      setAgImportPreview([]); setAgImportOpen(false);
      await loadAgenda();
      alert(`${inserted} agenda berhasil ditambahkan.`);
    } catch (err: unknown) {
      setAgImportError(err instanceof Error ? err.message : 'Gagal menyimpan.');
    } finally { setAgImportSaving(false); }
  }

  async function handleAddAgenda(e: FormEvent) {
    e.preventDefault();
    if (!tenant?.id || !selectedKeberangkatan) return;
    setAgError('');
    if (!agJudul.trim() || !agTanggal) { setAgError('Tanggal dan judul wajib diisi.'); return; }
    setAgSubmitting(true);
    try {
      await createAgenda(tenant.id, selectedKeberangkatan, {
        tanggal: agTanggal, jam_mulai: agJam || null,
        judul: agJudul.trim(), deskripsi: agDeskripsi.trim() || null,
        lokasi: agLokasi.trim() || null, urutan: 0,
      });
      setAgJudul(''); setAgTanggal(''); setAgJam(''); setAgDeskripsi(''); setAgLokasi('');
      await loadAgenda();
    } catch (err: unknown) { setAgError(err instanceof Error ? err.message : 'Gagal menambah agenda.'); }
    setAgSubmitting(false);
  }

  async function handleDeleteAgenda(agendaId: string, judul: string) {
    if (!tenant?.id || !window.confirm(`Hapus agenda "${judul}"?`)) return;
    await deleteAgenda(tenant.id, agendaId);
    await loadAgenda();
  }

  async function handleCreateAddon(e: FormEvent) {
    e.preventDefault();
    if (!tenant?.id || !selectedKeberangkatan || !addonName.trim()) return;
    setAddonSaving(true); setAddonError('');
    try {
      const addon = await createItineraryAddon(tenant.id, selectedKeberangkatan, addonName.trim(), addonDescription.trim());
      setAddonName(''); setAddonDescription('');
      await loadItineraryAddons();
      setSelectedAddonId(addon.id);
    } catch (err: unknown) {
      setAddonError(err instanceof Error ? err.message : 'Gagal membuat itinerary addon.');
    } finally { setAddonSaving(false); }
  }

  async function handleSaveAddonMembers() {
    if (!selectedAddonId) return;
    setAddonSaving(true); setAddonError('');
    try {
      await replaceItineraryAddonMembers(selectedAddonId, addonMembers);
    } catch (err: unknown) {
      setAddonError(err instanceof Error ? err.message : 'Gagal menyimpan peserta addon.');
    } finally { setAddonSaving(false); }
  }

  async function handleAddAddonItem(e: FormEvent) {
    e.preventDefault();
    if (!selectedAddonId || !addonTanggal || !addonJudul.trim()) return;
    setAddonSaving(true); setAddonError('');
    try {
      const item = await createItineraryAddonItem(selectedAddonId, {
        tanggal: addonTanggal,
        jam_mulai: addonJam || null,
        judul: addonJudul.trim(),
        deskripsi: addonDeskripsi.trim() || null,
        lokasi: addonLokasi.trim() || null,
        urutan: addonItems.length + 1,
      });
      setAddonItems((current) => [...current, item]);
      setAddonTanggal(''); setAddonJam(''); setAddonJudul(''); setAddonDeskripsi(''); setAddonLokasi('');
    } catch (err: unknown) {
      setAddonError(err instanceof Error ? err.message : 'Gagal menambah agenda addon.');
    } finally { setAddonSaving(false); }
  }

  function handleStartAgEdit(item: AgendaItemRow) {
    setAgEditingId(item.id);
    setAgEditFields({
      tanggal: item.tanggal,
      jam_mulai: item.jam_mulai?.slice(0, 5) ?? '',
      judul: item.judul,
      deskripsi: item.deskripsi ?? '',
      lokasi: item.lokasi ?? '',
      urutan: item.urutan,
    });
    setAgEditError('');
    setAgEditSuccess('');
  }

  function handleCancelAgEdit() {
    setAgEditingId(null);
    setAgEditError('');
  }

  async function handleSaveAgEdit() {
    if (!agEditingId || !tenant?.id || !selectedKeberangkatan) return;
    if (!agEditFields.tanggal.trim() || !agEditFields.judul.trim()) {
      setAgEditError('Tanggal dan judul wajib diisi.');
      return;
    }
    setAgEditSaving(true);
    setAgEditError('');
    try {
      const { error } = await supabase
        .from('agenda_items')
        .update({
          tanggal: agEditFields.tanggal.trim(),
          jam_mulai: agEditFields.jam_mulai.trim() || null,
          judul: agEditFields.judul.trim(),
          deskripsi: agEditFields.deskripsi.trim() || null,
          lokasi: agEditFields.lokasi.trim() || null,
          urutan: agEditFields.urutan,
        })
        .eq('id', agEditingId)
        .eq('tenant_id', tenant.id)
        .eq('keberangkatan_id', selectedKeberangkatan);
      if (error) throw error;
      setAgEditingId(null);
      await loadAgenda();
      setAgEditSuccess('Agenda berhasil diperbarui.');
      setTimeout(() => setAgEditSuccess(''), 3000);
    } catch (err: unknown) {
      setAgEditError(err instanceof Error ? err.message : 'Gagal menyimpan perubahan.');
    } finally {
      setAgEditSaving(false);
    }
  }

  /* ── Pengumuman handlers ──────────────────────────────────────────── */

  async function handleAddAnnouncement(e: FormEvent) {
    e.preventDefault();
    if (!tenant?.id || !selectedKeberangkatan) return;
    setAnnError('');
    if (!annTitle.trim() || !annContent.trim()) { setAnnError('Judul dan isi pengumuman wajib diisi.'); return; }
    setAnnSubmitting(true);
    try {
      await createAnnouncement(tenant.id, selectedKeberangkatan, {
        label: annLabel.trim() || 'Info', title: annTitle.trim(),
        content: annContent.trim(), important: annImportant,
      });
      setAnnLabel('Info'); setAnnTitle(''); setAnnContent(''); setAnnImportant(false);
      await loadAnnouncements();
    } catch (err: unknown) { setAnnError(err instanceof Error ? err.message : 'Gagal membuat pengumuman.'); }
    setAnnSubmitting(false);
  }

  async function handleDeleteAnnouncement(annId: string, title: string) {
    if (!tenant?.id || !window.confirm(`Hapus pengumuman "${title}"?`)) return;
    await deleteAnnouncement(tenant.id, annId);
    await loadAnnouncements();
  }

  async function handleHelpStatusChange(request: HelpRequestRow, status: HelpRequestStatus) {
    if (!tenant?.id) return;
    setHelpUpdatingId(request.id);
    try {
      const updated = await updateHelpRequestStatus(tenant.id, request.id, status, email);
      setHelpRequests(prev => prev.map(item => item.id === updated.id ? updated : item));
    } finally {
      setHelpUpdatingId(null);
    }
  }

  async function addEquipmentItem(label: string) {
    if (!tenant?.id || !selectedKeberangkatan || !label.trim()) return;
    setEquipmentAdding(true);
    try {
      const item = await createEquipmentCatalogItem(tenant.id, selectedKeberangkatan, { label: label.trim(), sort_order: equipmentCatalog.length });
      setEquipmentCatalog(prev => [...prev, item]);
      setEquipmentLabel('');
    } finally {
      setEquipmentAdding(false);
    }
  }

  async function seedDefaultEquipment() {
    for (const item of DEFAULT_EQUIPMENT) await addEquipmentItem(item);
  }

  async function setEquipmentStatus(jamaahId: string, equipmentId: string, status: EquipmentAssignmentStatus) {
    if (!tenant?.id || !selectedKeberangkatan) return;
    const key = `${jamaahId}:${equipmentId}`;
    setEquipmentSaving(key);
    try {
      const assignment = await updateEquipmentAssignment(tenant.id, selectedKeberangkatan, jamaahId, equipmentId, status, email);
      setEquipmentAssignments(prev => {
        const remaining = prev.filter(item => !(item.jamaah_id === jamaahId && item.equipment_id === equipmentId));
        return [...remaining, assignment];
      });
    } finally {
      setEquipmentSaving(null);
    }
  }

  function docStatusOf(jamaahId: string, type: JamaahDocumentRow['document_type']): JamaahDocumentStatus {
    return docRows.find(d => d.jamaah_id === jamaahId && d.document_type === type)?.status ?? 'belum';
  }

  async function setDocStatus(jamaahId: string, type: JamaahDocumentRow['document_type'], status: JamaahDocumentStatus) {
    if (!tenant?.id) return;
    const key = `${jamaahId}:${type}`;
    setDocSaving(key); setDocError('');
    try {
      const saved = await updateJamaahDocument(tenant.id, jamaahId, type, status);
      setDocRows(prev => [...prev.filter(d => !(d.jamaah_id === jamaahId && d.document_type === type)), saved]);
    } catch (err: unknown) {
      setDocError(err instanceof Error ? err.message : 'Gagal menyimpan status dokumen.');
    } finally {
      setDocSaving(null);
    }
  }

  async function saveDocNote(jamaahId: string, type: JamaahDocumentRow['document_type'], value: string) {
    if (!tenant?.id) return;
    const note = value.trim() || null;
    const current = docRows.find(d => d.jamaah_id === jamaahId && d.document_type === type)?.note ?? null;
    if (note === current) return;
    setDocError('');
    try {
      const saved = await updateJamaahDocument(tenant.id, jamaahId, type, docStatusOf(jamaahId, type), note);
      setDocRows(prev => [...prev.filter(d => !(d.jamaah_id === jamaahId && d.document_type === type)), saved]);
    } catch (err: unknown) {
      setDocError(err instanceof Error ? err.message : 'Gagal menyimpan catatan dokumen.');
    }
  }

  async function setDocStatusForAll(type: JamaahDocumentRow['document_type'], status: JamaahDocumentStatus) {
    if (!tenant?.id || jamaahList.length === 0) return;
    const label = DOC_STATUS_OPTIONS.find(o => o.value === status)?.label ?? status;
    if (!window.confirm(`Ubah status ${type} semua ${jamaahList.length} jamaah di batch ini menjadi "${label}"?`)) return;
    setDocSaving(`all:${type}`); setDocError('');
    try {
      const saved = await bulkUpdateJamaahDocuments(tenant.id, jamaahList.map(j => j.id), type, status);
      setDocRows(prev => [...prev.filter(d => d.document_type !== type), ...saved]);
    } catch (err: unknown) {
      setDocError(err instanceof Error ? err.message : 'Gagal menyimpan status dokumen.');
      await loadDocuments();
    } finally {
      setDocSaving(null);
    }
  }

  /* ── Guard: no tenant ────────────────────────────────────────────── */

  if (!tenant) {
    return (
      <TravelLayout>
        <div className="py-20 text-center">
          <p className="text-[15px] font-semibold" style={{ color: '#374151' }}>
            Akun ini belum terhubung ke tenant manapun.
          </p>
          <p className="text-[13px] mt-1" style={{ color: '#9ca3af' }}>
            Hubungi administrator untuk menghubungkan akun Anda ke travel agency.
          </p>
        </div>
      </TravelLayout>
    );
  }

  const selectedBatch = keberangkatanList.find((item) => item.id === selectedKeberangkatan) ?? null;
  const batchReadiness = selectedBatch ? getBatchReadiness(selectedBatch, jamaahList, agendaItems) : [];
  const readinessCount = batchReadiness.filter((item) => item.ready).length;
  const readinessIssues = batchReadiness.filter((item) => !item.ready);
  const missingPassports = jamaahList.filter((item) => !item.nomor_paspor?.trim()).length;
  const openHelpRequests = helpRequests.filter((item) => item.status !== 'selesai').length;
  const filteredHelpRequests = helpStatusFilter === 'semua'
    ? helpRequests
    : helpRequests.filter((item) => item.status === helpStatusFilter);
  const receivedEquipmentCount = equipmentAssignments.filter((item) => item.status === 'sudah').length;
  const visaSiapCount = jamaahList.filter((item) => docStatusOf(item.id, 'visa') === 'lengkap').length;
  const docQuery = docSearch.trim().toLowerCase();
  const docJamaahList = docQuery
    ? jamaahList.filter((item) => item.nama.toLowerCase().includes(docQuery) || item.nomor_jamaah.toLowerCase().includes(docQuery))
    : jamaahList;

  const agEditForm = (
    <>
      <div className="grid grid-cols-2 gap-3 mb-3 sm:grid-cols-3">
                                  <div>
                                    <p className="text-[11px] font-semibold mb-1.5" style={{ color: '#374151' }}>Tanggal <span style={{ color: '#f87171' }}>*</span></p>
                                    <StyledInput type="date" value={agEditFields.tanggal} onChange={e => setAgEditFields(f => ({ ...f, tanggal: e.target.value }))} />
                                  </div>
                                  <div>
                                    <p className="text-[11px] font-semibold mb-1.5" style={{ color: '#374151' }}>Jam Mulai</p>
                                    <StyledInput type="time" value={agEditFields.jam_mulai} onChange={e => setAgEditFields(f => ({ ...f, jam_mulai: e.target.value }))} />
                                  </div>
                                  <div>
                                    <p className="text-[11px] font-semibold mb-1.5" style={{ color: '#374151' }}>Urutan</p>
                                    <StyledInput type="number" value={agEditFields.urutan} onChange={e => setAgEditFields(f => ({ ...f, urutan: Number(e.target.value) }))} />
                                  </div>
                                </div>
                                <div className="mb-3">
                                  <p className="text-[11px] font-semibold mb-1.5" style={{ color: '#374151' }}>Judul Kegiatan <span style={{ color: '#f87171' }}>*</span></p>
                                  <StyledInput type="text" value={agEditFields.judul} onChange={e => setAgEditFields(f => ({ ...f, judul: e.target.value }))} />
                                </div>
                                <div className="grid gap-3 mb-3 sm:grid-cols-2">
                                  <div>
                                    <p className="text-[11px] font-semibold mb-1.5" style={{ color: '#374151' }}>Lokasi</p>
                                    <StyledInput type="text" value={agEditFields.lokasi} onChange={e => setAgEditFields(f => ({ ...f, lokasi: e.target.value }))} />
                                  </div>
                                  <div>
                                    <p className="text-[11px] font-semibold mb-1.5" style={{ color: '#374151' }}>Deskripsi</p>
                                    <StyledTextarea rows={2} value={agEditFields.deskripsi} onChange={e => setAgEditFields(f => ({ ...f, deskripsi: e.target.value }))} />
                                  </div>
                                </div>
                                {agEditError && <p className="text-[12px] mb-2" style={{ color: '#dc2626' }}>{agEditError}</p>}
                                <div className="flex items-center gap-2">
                                  <button type="button" onClick={handleSaveAgEdit} disabled={agEditSaving}
                                    className="inline-flex items-center gap-1.5 px-4 py-2 text-[12px] font-semibold rounded-xl transition-all duration-150 disabled:opacity-60"
                                    style={{ background: `linear-gradient(135deg, ${PRIMARY} 0%, ${PRIMARY_DEEP} 100%)`, color: '#fff', boxShadow: '0 2px 6px color-mix(in srgb, var(--color-primary) 22%, transparent)' }}>
                                    {agEditSaving && <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" /><path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>}
                                    {agEditSaving ? 'Menyimpan...' : 'Simpan'}
                                  </button>
                                  <button type="button" onClick={handleCancelAgEdit} disabled={agEditSaving}
                                    className="px-4 py-2 text-[12px] rounded-xl transition-all duration-150"
                                    style={{ border: '1px solid rgba(0,0,0,0.1)', color: '#6b7280' }}>
                                    Batal
                                  </button>
                                </div>
    </>
  );

  /* ── Render ──────────────────────────────────────────────────────── */

  return (
    <TravelLayout>

      {/* ── Pilihan batch & tab: satu tempat untuk semua tab ── */}
      {keberangkatanList.length > 0 && (
        <div className="mb-2">
          <label htmlFor="travel-batch" className="sr-only">Pilih batch keberangkatan</label>
          <select id="travel-batch" value={selectedKeberangkatan} onChange={e => setSelectedKeberangkatan(e.target.value)}
            className="w-full rounded-xl border border-hairline bg-white px-3 py-2 text-[13px] font-semibold text-ink focus:outline-none sm:w-auto sm:min-w-[320px]">
            {keberangkatanList.map(kb => (
              <option key={kb.id} value={kb.id}>{kb.nama_batch}</option>
            ))}
          </select>
        </div>
      )}

      <div className="sticky top-0 z-10 -mx-5 mb-4 overflow-x-auto bg-canvas px-5 py-2" style={{ scrollbarWidth: 'none' }}>
        <div className="flex w-max min-w-full gap-1.5">
          {TABS.map(t => {
            const active = activeTab === t.id;
            return (
              <button key={t.id} type="button"
                onClick={e => { setActiveTab(t.id); e.currentTarget.scrollIntoView({ inline: 'center', block: 'nearest' }); }}
                aria-current={active ? 'page' : undefined}
                className="flex-none whitespace-nowrap rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors"
                style={{
                  color: active ? '#ffffff' : '#575757',
                  background: active ? 'var(--color-primary)' : '#ffffff',
                  border: `1px solid ${active ? 'var(--color-primary)' : 'rgba(32,32,32,0.10)'}`,
                }}>
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          TAB: COMMAND CENTER (laporan batch)
      ══════════════════════════════════════════════ */}
      {activeTab === 'overview' && (
        <section className="space-y-3">
          {!selectedBatch ? (
            <div className="rounded-2xl px-6 py-12 text-center" style={{ ...cardStyle, border: `1px dashed ${PRIMARY_BORDER}` }}>
              <ClipboardList className="mx-auto h-8 w-8" style={{ color: PRIMARY }} />
              <h2 className="mt-3 text-[16px] font-bold" style={{ color: '#202020' }}>Mulai dari batch keberangkatan</h2>
              <p className="mx-auto mt-1 max-w-md text-[12px] leading-relaxed" style={{ color: '#6b7280' }}>
                Buat batch untuk mengelola hotel, jamaah, agenda, dan komunikasi perjalanan dari satu tempat.
              </p>
              <button type="button" onClick={() => setActiveTab('keberangkatan')}
                className="mt-5 inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-[12px] font-semibold text-white"
                style={{ background: PRIMARY }}>
                Buat Batch <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <>
              {/* Ringkasan batch */}
              <div className="overflow-hidden rounded-2xl text-white shadow-drop-card" style={{ background: 'linear-gradient(100deg, var(--color-primary-deep) 0%, var(--color-primary) 100%)' }}>
                <div className="p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-[11px] font-medium text-white/70">{tenant.nama_travel}</p>
                      <h1 className="mt-0.5 font-display text-[18px] font-bold leading-tight sm:text-[22px]" style={{ letterSpacing: '-0.3px' }}>{selectedBatch.nama_batch}</h1>
                      <p className="mt-1 text-[12px] text-white/80">{formatRentangTanggal(selectedBatch.tanggal_keberangkatan, selectedBatch.tanggal_kepulangan)}</p>
                    </div>
                    <span className="flex-none rounded-full bg-white px-2.5 py-1 text-[10.5px] font-bold" style={{ color: readinessIssues.length ? '#b45309' : '#15803d' }}>
                      {readinessIssues.length ? 'Perlu dilengkapi' : 'Siap rilis'}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-2.5">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/25" role="progressbar" aria-valuemin={0} aria-valuemax={batchReadiness.length} aria-valuenow={readinessCount} aria-label="Kesiapan data batch">
                      <div className="h-full rounded-full bg-white" style={{ width: `${(readinessCount / Math.max(batchReadiness.length, 1)) * 100}%` }} />
                    </div>
                    <span className="flex-none text-[11px] font-semibold text-white/90">{readinessCount}/{batchReadiness.length} data siap</span>
                  </div>
                </div>
              </div>

              {/* Angka utama */}
              <div className="grid grid-cols-3 gap-2 lg:grid-cols-6">
                {[
                  { label: 'Jamaah', value: String(jamaahList.length), sub: 'Terdaftar di batch ini', tab: 'jamaah' as TabId, tone: '#202020' },
                  { label: 'Agenda', value: String(agendaItems.length), sub: 'Tampil ke jamaah', tab: 'agenda' as TabId, tone: '#202020' },
                  { label: 'Laporan', value: String(openHelpRequests), sub: 'Bantuan belum selesai', tab: 'care' as TabId, tone: openHelpRequests ? '#dc2626' : '#202020' },
                  { label: 'Visa siap', value: `${visaSiapCount}/${jamaahList.length}`, sub: 'Status tab Dokumen', tab: 'dokumen' as TabId, tone: '#202020' },
                  { label: 'Tanpa paspor', value: String(missingPassports), sub: 'Nomor belum diisi', tab: 'jamaah' as TabId, tone: missingPassports ? '#b45309' : '#202020' },
                  { label: 'Kuota', value: String(quotaBalance?.balance ?? 0), sub: quotaBalance ? `${quotaBalance.total_used} sudah terpakai` : 'Hubungi Umrahme', tab: 'jamaah' as TabId, tone: '#202020' },
                ].map((item) => (
                  <button key={item.label} type="button" onClick={() => setActiveTab(item.tab)}
                    className="min-w-0 rounded-2xl border border-hairline bg-white px-3 py-2.5 text-left shadow-drop-card transition-opacity hover:opacity-75">
                    <p className="truncate text-[10.5px] font-semibold text-charcoal">{item.label}</p>
                    <p className="mt-0.5 font-display text-[20px] font-bold leading-tight lg:text-[24px]" style={{ color: item.tone, letterSpacing: '-0.5px' }}>{item.value}</p>
                    <p className="mt-0.5 hidden truncate text-[10.5px] text-mute lg:block">{item.sub}</p>
                  </button>
                ))}
              </div>

              <div className="grid gap-3 lg:grid-cols-[1.25fr_1fr] lg:items-start">
                {/* Kesiapan */}
                <div className="overflow-hidden rounded-2xl border border-hairline bg-white shadow-drop-card">
                  <div className="flex items-center justify-between gap-3 px-4 pb-1 pt-3.5">
                    <h2 className="text-[13.5px] font-bold text-ink">Kesiapan batch</h2>
                    <span className="text-[11px] font-semibold" style={{ color: readinessIssues.length ? '#b45309' : '#15803d' }}>
                      {readinessIssues.length ? `${readinessIssues.length} perlu dilengkapi` : 'Semua siap'}
                    </span>
                  </div>
                  <div className="divide-y divide-hairline px-4 pb-1.5">
                    {batchReadiness.map((item) => (
                      <button key={item.label} type="button" onClick={() => setActiveTab(item.tab)}
                        className="flex w-full items-center gap-2.5 py-2.5 text-left transition-opacity hover:opacity-70">
                        {item.ready
                          ? <CheckCircle2 className="h-4 w-4 flex-none" style={{ color: '#16a34a' }} />
                          : <AlertCircle className="h-4 w-4 flex-none" style={{ color: '#d97706' }} />}
                        <span className="min-w-0 flex-1">
                          <span className="block text-[12.5px] font-semibold leading-tight text-ink">{item.label}</span>
                          <span className="mt-0.5 block text-[11px] leading-snug text-charcoal">{item.detail}</span>
                        </span>
                        <ArrowRight className="h-3.5 w-3.5 flex-none text-ash" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Akses jamaah */}
                  <div className="rounded-2xl border border-hairline bg-white p-4 shadow-drop-card">
                    <h2 className="text-[13.5px] font-bold text-ink">Akses jamaah</h2>
                    {slugUrl && (
                      <div className="mt-2 flex items-center gap-2">
                        <p className="min-w-0 flex-1 truncate text-[12.5px] font-medium text-ink">{slugUrl}</p>
                        <button type="button" onClick={handleCopySlug}
                          className="flex-none rounded-full px-3 py-1.5 text-[11.5px] font-semibold transition-colors"
                          style={{ background: copied ? 'rgba(22,163,74,0.10)' : 'var(--color-primary)', color: copied ? '#15803d' : '#ffffff' }}>
                          {copied ? 'Tersalin' : 'Salin link'}
                        </button>
                      </div>
                    )}
                    <div className="mt-2 flex items-baseline justify-between gap-3 rounded-xl bg-surface-bone px-3 py-2">
                      <span className="text-[11.5px] text-charcoal">Kode aktivasi</span>
                      <span className="truncate text-[13px] font-bold text-ink" style={{ letterSpacing: '0.04em' }}>{tenant.activation_code}</span>
                    </div>
                  </div>

                  {/* Info batch */}
                  <div className="rounded-2xl border border-hairline bg-white p-4 shadow-drop-card">
                    <div className="flex items-center justify-between gap-3">
                      <h2 className="text-[13.5px] font-bold text-ink">Info batch</h2>
                      <button type="button" onClick={() => setActiveTab('keberangkatan')} className="text-[11.5px] font-semibold text-primary">Kelola</button>
                    </div>
                    <dl className="mt-1.5 divide-y divide-hairline">
                      {[
                        { label: 'Hotel Makkah', value: selectedBatch.hotel_makkah },
                        { label: 'Hotel Madinah', value: selectedBatch.hotel_madinah },
                        { label: 'Titik kumpul', value: selectedBatch.meeting_point },
                        { label: 'Muthowwif', value: selectedBatch.guide_name },
                        { label: 'Tour leader', value: selectedBatch.tour_leader_name },
                      ].map((row) => (
                        <div key={row.label} className="flex items-baseline justify-between gap-3 py-1.5">
                          <dt className="flex-none text-[11.5px] text-charcoal">{row.label}</dt>
                          <dd className={`min-w-0 text-right text-[12px] font-semibold ${row.value ? 'text-ink' : 'text-ash'}`}>{row.value || 'Belum diisi'}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
              </div>
            </>
          )}
        </section>
      )}

      {activeTab === 'perlengkapan' && (
        <section>
          <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: PRIMARY }}>Distribusi Perlengkapan</p>
              <h2 className="mt-1 text-[20px] font-bold" style={{ color: '#202020', letterSpacing: '-0.02em' }}>Status per jamaah</h2>
              <p className="mt-1 text-[12px]" style={{ color: '#6b7280' }}>{selectedBatch ? selectedBatch.nama_batch : 'Pilih batch untuk mengatur perlengkapan.'}</p>
            </div>
            <div className="rounded-xl px-4 py-2.5" style={{ background: 'color-mix(in srgb, var(--color-primary) 9%, transparent)', color: PRIMARY }}>
              <p className="font-mono text-[18px] font-bold leading-none">{receivedEquipmentCount}</p>
              <p className="mt-1 font-mono text-[9px] font-bold uppercase tracking-wider">Barang diterima</p>
            </div>
          </div>

          {!selectedBatch ? (
            <div className="rounded-2xl px-5 py-10 text-center" style={{ border: '1px dashed rgba(0,0,0,0.14)' }}>
              <p className="text-[13px]" style={{ color: '#6b7280' }}>Pilih atau buat batch keberangkatan terlebih dahulu.</p>
            </div>
          ) : equipmentLoading ? (
            <p className="py-10 text-center font-mono text-[12px]" style={{ color: '#9ca3af' }}>Memuat perlengkapan...</p>
          ) : (
            <>
              <div className="rounded-2xl p-4 mb-4" style={cardStyle}>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-[13px] font-bold" style={{ color: '#374151' }}>Daftar perlengkapan batch</p>
                    <p className="mt-0.5 text-[11px]" style={{ color: '#6b7280' }}>{equipmentCatalog.length ? `${equipmentCatalog.length} jenis barang aktif` : 'Belum ada daftar perlengkapan.'}</p>
                  </div>
                  {!equipmentCatalog.length && <button type="button" onClick={seedDefaultEquipment} disabled={equipmentAdding} className="rounded-xl px-3 py-2 text-[11px] font-semibold text-white disabled:opacity-60" style={{ background: PRIMARY }}>Pakai Paket Standar</button>}
                </div>
                {equipmentCatalog.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{equipmentCatalog.map(item => <span key={item.id} className="rounded-full px-2.5 py-1 text-[10px] font-semibold" style={{ color: PRIMARY, background: 'color-mix(in srgb, var(--color-primary) 8%, transparent)' }}>{item.label}</span>)}</div>}
                <form onSubmit={(event) => { event.preventDefault(); addEquipmentItem(equipmentLabel); }} className="mt-3 flex gap-2">
                  <StyledInput value={equipmentLabel} onChange={event => setEquipmentLabel(event.target.value)} placeholder="Tambah barang, mis. Mukena" maxLength={80} />
                  <button type="submit" disabled={!equipmentLabel.trim() || equipmentAdding} className="flex-none rounded-xl px-3 text-[11px] font-semibold text-white disabled:opacity-60" style={{ background: 'var(--color-primary-deep)' }}>Tambah</button>
                </form>
              </div>

              {equipmentCatalog.length > 0 && (
                <div className="overflow-hidden rounded-2xl" style={cardStyle}>
                  {jamaahList.map(jamaah => {
                    const selected = equipmentJamaahId === jamaah.id;
                    const assignments = equipmentAssignments.filter(item => item.jamaah_id === jamaah.id);
                    const received = assignments.filter(item => item.status === 'sudah').length;
                    return (
                      <div key={jamaah.id} className="border-b last:border-b-0" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                        <button type="button" onClick={() => setEquipmentJamaahId(selected ? null : jamaah.id)} className="flex w-full items-center gap-3 px-4 py-3.5 text-left">
                          <span className="flex h-9 w-9 flex-none items-center justify-center rounded-xl" style={{ background: 'color-mix(in srgb, var(--color-primary) 8%, transparent)', color: PRIMARY }}><PackageCheck className="h-4 w-4" /></span>
                          <span className="min-w-0 flex-1"><span className="block truncate text-[13px] font-semibold" style={{ color: '#202020' }}>{jamaah.nama}</span><span className="mt-0.5 block text-[10.5px]" style={{ color: '#6b7280' }}>{received} dari {equipmentCatalog.length} diterima</span></span>
                          <span className="rounded-full px-2 py-1 font-mono text-[10px] font-bold" style={{ color: received === equipmentCatalog.length ? '#15803d' : '#b45309', background: received === equipmentCatalog.length ? 'rgba(22,163,74,0.09)' : 'rgba(245,158,11,0.10)' }}>{received === equipmentCatalog.length ? 'LENGKAP' : 'PROSES'}</span>
                        </button>
                        {selected && <div className="grid grid-cols-2 gap-2 px-4 pb-4">{equipmentCatalog.map(item => {
                          const status = assignments.find(assignment => assignment.equipment_id === item.id)?.status ?? 'belum';
                          const key = `${jamaah.id}:${item.id}`;
                          return <button key={item.id} type="button" disabled={equipmentSaving === key} onClick={() => setEquipmentStatus(jamaah.id, item.id, status === 'sudah' ? 'belum' : 'sudah')} className="flex min-h-11 items-center gap-2 rounded-xl px-3 text-left text-[11px] font-semibold disabled:opacity-60" style={{ color: status === 'sudah' ? '#15803d' : '#6b7280', background: status === 'sudah' ? 'rgba(22,163,74,0.09)' : '#f9fafb', border: `1px solid ${status === 'sudah' ? 'rgba(22,163,74,0.22)' : 'rgba(0,0,0,0.08)'}` }}><CheckCircle2 className="h-3.5 w-3.5 flex-none" /> {item.label}</button>;
                        })}</div>}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </section>
      )}

      {activeTab === 'dokumen' && (
        <section>
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-[16px] font-bold" style={{ color: '#202020', letterSpacing: '-0.02em' }}>Paspor, visa & tiket</h2>
              <p className="mt-0.5 hidden text-[12px] sm:block" style={{ color: '#6b7280' }}>{selectedBatch ? 'Jamaah melihat status ini di menu Dokumen Saya.' : 'Pilih batch untuk mengatur status dokumen.'}</p>
            </div>
            {selectedBatch && jamaahList.length > 0 && (
              <div className="flex gap-2">
                {DOC_TYPES.map(({ type, label }) => {
                  const done = jamaahList.filter(j => docStatusOf(j.id, type) === 'lengkap').length;
                  return (
                    <div key={type} className="rounded-xl border border-hairline bg-white px-2.5 py-1.5 text-center">
                      <p className="text-[13px] font-bold leading-tight text-ink">{done}/{jamaahList.length}</p>
                      <p className="text-[10px] font-medium text-charcoal">{label}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {docError && <p className="mb-3 rounded-xl px-4 py-2.5 text-[12px]" style={{ color: '#b91c1c', background: 'rgba(220,38,38,0.07)' }}>{docError}</p>}

          {!selectedBatch ? (
            <div className="rounded-2xl px-5 py-10 text-center" style={{ border: '1px dashed rgba(0,0,0,0.14)' }}>
              <p className="text-[13px]" style={{ color: '#6b7280' }}>Pilih atau buat batch keberangkatan terlebih dahulu.</p>
              <button type="button" onClick={() => setActiveTab('keberangkatan')} className="mt-3 text-[12px] font-semibold" style={{ color: PRIMARY }}>Kelola Batch</button>
            </div>
          ) : jamaahList.length === 0 ? (
            <div className="rounded-2xl px-5 py-10 text-center" style={{ border: '1px dashed rgba(0,0,0,0.14)' }}>
              <p className="text-[13px]" style={{ color: '#6b7280' }}>Belum ada jamaah di batch ini.</p>
            </div>
          ) : docLoading && docRows.length === 0 ? (
            <p className="py-10 text-center font-mono text-[12px]" style={{ color: '#9ca3af' }}>Memuat status dokumen...</p>
          ) : (
            <>
            <div className="mb-3 max-w-sm">
              <StyledInput value={docSearch} onChange={e => setDocSearch(e.target.value)} placeholder="Cari nama atau nomor jamaah" />
            </div>
            {/* HP: satu baris per dokumen */}
            <div className="mb-3 grid grid-cols-3 gap-2 md:hidden">
              {DOC_TYPES.map(({ type, label }) => (
                <label key={type} className="min-w-0 text-[10.5px] font-semibold text-charcoal">
                  Semua {label}
                  <select value="" disabled={docSaving !== null}
                    onChange={e => { if (e.target.value) void setDocStatusForAll(type, e.target.value as JamaahDocumentStatus); }}
                    className="mt-1 block w-full rounded-lg border border-hairline bg-white px-1.5 py-1.5 text-[11px] font-medium text-charcoal">
                    <option value="">Set…</option>
                    {DOC_STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </label>
              ))}
            </div>
            <div className="overflow-hidden rounded-2xl md:hidden" style={cardStyle}>
              {docJamaahList.length === 0 && <p className="px-4 py-8 text-center text-[12px] text-ash">Jamaah tidak ditemukan.</p>}
              <ul className="divide-y divide-hairline">
                {docJamaahList.map(jamaah => (
                  <li key={jamaah.id} className="px-3.5 py-3">
                    <p className="text-[12.5px] font-semibold text-ink">{jamaah.nama} <span className="text-[10.5px] font-medium text-ash">{jamaah.nomor_jamaah}</span></p>
                    <div className="mt-1.5 space-y-1.5">
                      {DOC_TYPES.map(({ type, label }) => {
                        const status = docStatusOf(jamaah.id, type);
                        const opt = DOC_STATUS_OPTIONS.find(o => o.value === status) ?? DOC_STATUS_OPTIONS[0];
                        const note = docRows.find(d => d.jamaah_id === jamaah.id && d.document_type === type)?.note ?? '';
                        return (
                          <div key={type} className="flex items-center gap-1.5">
                            <span className="w-10 flex-none text-[11px] text-charcoal">{label}</span>
                            <select value={status}
                              aria-label={`Status ${label} ${jamaah.nama}`}
                              disabled={docSaving === `${jamaah.id}:${type}` || docSaving === `all:${type}`}
                              onChange={e => void setDocStatus(jamaah.id, type, e.target.value as JamaahDocumentStatus)}
                              className="w-[112px] flex-none rounded-lg px-1.5 py-1 text-[11px] font-semibold disabled:opacity-50"
                              style={{ color: opt.color, background: opt.bg, border: `1px solid ${status === 'belum' ? 'rgba(0,0,0,0.09)' : opt.color + '40'}` }}>
                              {DOC_STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                            </select>
                            <input key={`${jamaah.id}:${type}:${note}`} defaultValue={note} maxLength={200}
                              placeholder="Catatan"
                              aria-label={`Catatan ${label} ${jamaah.nama}`}
                              onBlur={e => void saveDocNote(jamaah.id, type, e.target.value)}
                              onKeyDown={e => { if (e.key === 'Enter') e.currentTarget.blur(); }}
                              className="min-w-0 flex-1 rounded-lg px-2 py-1 text-[11px] focus:outline-none"
                              style={{ ...inputBase, boxShadow: 'none' }} />
                          </div>
                        );
                      })}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="hidden overflow-x-auto rounded-2xl md:block" style={cardStyle}>
              <table className="w-full min-w-[760px] text-left">
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                    <th className="px-5 py-3 font-mono text-[10px] uppercase tracking-wider" style={{ color: '#9ca3af' }}>Jamaah</th>
                    {DOC_TYPES.map(({ type, label }) => (
                      <th key={type} className="px-3 py-3 font-mono text-[10px] uppercase tracking-wider" style={{ color: '#9ca3af' }}>
                        <span className="block">{label}</span>
                        <select
                          value=""
                          disabled={docSaving !== null}
                          onChange={e => { if (e.target.value) void setDocStatusForAll(type, e.target.value as JamaahDocumentStatus); }}
                          className="mt-1 rounded-md px-1.5 py-1 text-[10px] normal-case tracking-normal"
                          style={{ border: '1px solid rgba(0,0,0,0.09)', background: '#fff', color: '#6b7280' }}>
                          <option value="">Set semua…</option>
                          {DOC_STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {docJamaahList.length === 0 && (
                    <tr><td colSpan={DOC_TYPES.length + 1} className="px-5 py-8 text-center text-[12px]" style={{ color: '#9ca3af' }}>Jamaah tidak ditemukan.</td></tr>
                  )}
                  {docJamaahList.map(jamaah => (
                    <tr key={jamaah.id} style={{ borderBottom: '1px solid rgba(0,0,0,0.04)' }}>
                      <td className="px-5 py-3 align-top">
                        <p className="text-[13px] font-semibold" style={{ color: '#202020' }}>{jamaah.nama}</p>
                        <p className="font-mono text-[10px]" style={{ color: '#9ca3af' }}>{jamaah.nomor_jamaah}</p>
                      </td>
                      {DOC_TYPES.map(({ type }) => {
                        const status = docStatusOf(jamaah.id, type);
                        const opt = DOC_STATUS_OPTIONS.find(o => o.value === status) ?? DOC_STATUS_OPTIONS[0];
                        const note = docRows.find(d => d.jamaah_id === jamaah.id && d.document_type === type)?.note ?? '';
                        return (
                          <td key={type} className="px-3 py-3 align-top">
                            <select
                              value={status}
                              disabled={docSaving === `${jamaah.id}:${type}` || docSaving === `all:${type}`}
                              onChange={e => void setDocStatus(jamaah.id, type, e.target.value as JamaahDocumentStatus)}
                              className="rounded-lg px-2.5 py-1.5 text-[11px] font-semibold disabled:opacity-50"
                              style={{ color: opt.color, background: opt.bg, border: `1px solid ${status === 'belum' ? 'rgba(0,0,0,0.09)' : opt.color + '40'}` }}>
                              {DOC_STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                            </select>
                            <input
                              key={`${jamaah.id}:${type}:${note}`}
                              defaultValue={note}
                              maxLength={200}
                              placeholder="Catatan untuk jamaah"
                              aria-label={`Catatan ${type} ${jamaah.nama}`}
                              onBlur={e => void saveDocNote(jamaah.id, type, e.target.value)}
                              onKeyDown={e => { if (e.key === 'Enter') e.currentTarget.blur(); }}
                              className="mt-1.5 block w-full min-w-[150px] rounded-lg px-2.5 py-1.5 text-[11px] focus:outline-none"
                              style={{ ...inputBase, boxShadow: 'none' }} />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            </>
          )}
        </section>
      )}

      {activeTab === 'care' && (
        <section>
          <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: '#dc2626' }}>Jamaah Care Center</p>
              <h2 className="mt-1 text-[20px] font-bold" style={{ color: '#202020', letterSpacing: '-0.02em' }}>Antrean bantuan jamaah</h2>
              <p className="mt-1 text-[12px]" style={{ color: '#6b7280' }}>{selectedBatch ? selectedBatch.nama_batch : 'Pilih batch untuk melihat laporan bantuan.'}</p>
            </div>
            <div className="rounded-xl px-4 py-2.5" style={{ background: openHelpRequests ? 'rgba(220,38,38,0.08)' : 'rgba(22,163,74,0.08)', color: openHelpRequests ? '#dc2626' : '#16a34a' }}>
              <p className="font-mono text-[18px] font-bold leading-none">{openHelpRequests}</p>
              <p className="mt-1 font-mono text-[9px] font-bold uppercase tracking-wider">Laporan terbuka</p>
            </div>
          </div>

          {!selectedBatch ? (
            <div className="rounded-2xl px-5 py-10 text-center" style={{ border: '1px dashed rgba(0,0,0,0.14)' }}>
              <p className="text-[13px]" style={{ color: '#6b7280' }}>Pilih atau buat batch keberangkatan terlebih dahulu.</p>
              <button type="button" onClick={() => setActiveTab('keberangkatan')} className="mt-3 text-[12px] font-semibold" style={{ color: PRIMARY }}>Kelola Batch</button>
            </div>
          ) : (
            <>
              <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
                {([
                  { value: 'baru', label: 'Baru' },
                  { value: 'ditangani', label: 'Ditangani' },
                  { value: 'selesai', label: 'Selesai' },
                  { value: 'semua', label: 'Semua' },
                ] as const).map((item) => {
                  const active = helpStatusFilter === item.value;
                  return <button key={item.value} type="button" onClick={() => setHelpStatusFilter(item.value)}
                    className="flex-none rounded-full px-3 py-2 text-[11px] font-semibold"
                    style={{ background: active ? 'var(--color-primary-deep)' : '#fff', color: active ? '#fff' : '#6b7280', border: active ? '1px solid var(--color-primary-deep)' : '1px solid rgba(0,0,0,0.08)' }}>{item.label}</button>;
                })}
              </div>

              <div className="overflow-hidden rounded-2xl" style={cardStyle}>
                {helpLoading ? (
                  <p className="py-10 text-center font-mono text-[12px]" style={{ color: '#9ca3af' }}>Memuat laporan bantuan...</p>
                ) : filteredHelpRequests.length === 0 ? (
                  <div className="py-12 text-center">
                    <CheckCircle2 className="mx-auto h-8 w-8" style={{ color: '#16a34a' }} />
                    <p className="mt-3 text-[13px] font-semibold" style={{ color: '#374151' }}>Tidak ada laporan pada status ini.</p>
                  </div>
                ) : (
                  <ul className="divide-y" style={{ borderColor: 'rgba(0,0,0,0.06)' }}>
                    {filteredHelpRequests.map((request) => {
                      const CategoryIcon = request.kategori === 'kesehatan' ? HeartPulse : request.kategori === 'tersesat' ? MapPin : MessageCircle;
                      const categoryLabel = request.kategori === 'tersesat' ? 'Terpisah rombongan' : request.kategori === 'kesehatan' ? 'Kesehatan' : request.kategori === 'rombongan' ? 'Rombongan' : 'Lainnya';
                      const statusStyle = request.status === 'baru'
                        ? { color: '#dc2626', background: 'rgba(220,38,38,0.08)' }
                        : request.status === 'ditangani'
                          ? { color: '#b45309', background: 'rgba(245,158,11,0.10)' }
                          : { color: '#15803d', background: 'rgba(22,163,74,0.09)' };
                      const nextStatus: HelpRequestStatus = request.status === 'baru' ? 'ditangani' : request.status === 'ditangani' ? 'selesai' : 'baru';
                      const actionLabel = request.status === 'baru' ? 'Tangani' : request.status === 'ditangani' ? 'Selesaikan' : 'Buka Kembali';
                      return (
                        <li key={request.id} className="px-5 py-4">
                          <div className="flex items-start gap-3">
                            <span className="flex h-9 w-9 flex-none items-center justify-center rounded-xl" style={{ color: statusStyle.color, background: statusStyle.background }}><CategoryIcon className="h-4 w-4" /></span>
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="text-[13px] font-bold" style={{ color: '#202020' }}>{request.nama_jamaah}</p>
                                <span className="font-mono text-[9px] uppercase tracking-wider" style={statusStyle}>{request.status}</span>
                              </div>
                              <p className="mt-0.5 text-[10.5px] font-semibold" style={{ color: '#6b7280' }}>{categoryLabel} · {formatDatetime(request.created_at)}</p>
                              <p className="mt-2 text-[12px] leading-relaxed" style={{ color: '#374151' }}>{request.pesan}</p>
                            </div>
                          </div>
                          <div className="mt-3 flex items-center justify-between gap-3 pl-12">
                            <p className="truncate text-[10px]" style={{ color: '#9ca3af' }}>{request.handled_by ? `Ditangani oleh ${request.handled_by}` : 'Belum ada petugas'}</p>
                            <button type="button" disabled={helpUpdatingId === request.id} onClick={() => handleHelpStatusChange(request, nextStatus)}
                              className="flex-none rounded-lg px-3 py-1.5 text-[11px] font-semibold disabled:opacity-60"
                              style={{ color: request.status === 'selesai' ? '#6b7280' : '#fff', background: request.status === 'selesai' ? '#f3f4f6' : 'var(--color-primary-deep)' }}>
                              {helpUpdatingId === request.id ? 'Menyimpan...' : actionLabel}
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </>
          )}
        </section>
      )}

      {activeTab === 'keberangkatan' && (
        <div>
          <div className="flex items-center gap-3 mb-5">
            <h2 className="font-bold" style={{ fontSize: '18px', color: '#202020', letterSpacing: '-0.02em' }}>Batch Keberangkatan</h2>
            <span className="font-mono text-[10px] uppercase tracking-widest px-2 py-1 rounded-full" style={{ background: PRIMARY_BG, color: PRIMARY }}>{keberangkatanList.length} batch</span>
            <button type="button" onClick={() => openKbForm()}
              className="ml-auto inline-flex items-center gap-2 px-4 py-2 text-[12px] font-semibold rounded-xl transition-all duration-150"
              style={{ background: `linear-gradient(135deg, ${PRIMARY} 0%, ${PRIMARY_DEEP} 100%)`, color: '#ffffff' }}>
              + Tambah Batch
            </button>
          </div>

          {kbFormOpen && (
            <form onSubmit={handleSaveKeberangkatan} className="rounded-2xl px-6 py-6 mb-5"
              style={{ ...cardStyle, border: `1px solid ${PRIMARY_BORDER}` }}>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] mb-4" style={{ color: PRIMARY }}>
                {kbEditId ? 'Edit Batch' : 'Batch Baru'}
              </p>
              <div className="space-y-4">
                <div>
                  <p className="text-[11px] font-semibold mb-1.5" style={{ color: '#374151' }}>Nama Batch <span style={{ color: '#f87171' }}>*</span></p>
                  <StyledInput type="text" value={kbNamaBatch} onChange={e => setKbNamaBatch(e.target.value)} placeholder="cth. Batch 1 — Februari 2025" maxLength={120} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><p className="text-[11px] font-semibold mb-1.5" style={{ color: '#374151' }}>Tgl Keberangkatan</p><StyledInput type="date" value={kbTanggalBerangkat} onChange={e => setKbTanggalBerangkat(e.target.value)} /></div>
                  <div><p className="text-[11px] font-semibold mb-1.5" style={{ color: '#374151' }}>Tgl Kepulangan</p><StyledInput type="date" value={kbTanggalPulang} onChange={e => setKbTanggalPulang(e.target.value)} /></div>
                </div>
                <div style={{ height: '1px', background: 'rgba(0,0,0,0.05)' }} />
                <div className="grid grid-cols-2 gap-4">
                  <div><p className="text-[11px] font-semibold mb-1.5" style={{ color: '#374151' }}>Hotel Makkah</p><StyledInput type="text" value={kbHotelMakkah} onChange={e => setKbHotelMakkah(e.target.value)} placeholder="Nama hotel & kamar" maxLength={120} /></div>
                  <div><p className="text-[11px] font-semibold mb-1.5" style={{ color: '#374151' }}>Hotel Madinah</p><StyledInput type="text" value={kbHotelMadinah} onChange={e => setKbHotelMadinah(e.target.value)} placeholder="Nama hotel & kamar" maxLength={120} /></div>
                </div>
                <div><p className="text-[11px] font-semibold mb-1.5" style={{ color: '#374151' }}>Titik Kumpul</p><StyledInput type="text" value={kbMeetingPoint} onChange={e => setKbMeetingPoint(e.target.value)} placeholder="Cth: Lobby terminal 2" maxLength={160} /></div>
                <div style={{ height: '1px', background: 'rgba(0,0,0,0.05)' }} />
                <div className="grid grid-cols-2 gap-4">
                  <div><p className="text-[11px] font-semibold mb-1.5" style={{ color: '#374151' }}>Nama Muthowwif</p><StyledInput type="text" value={kbGuideName} onChange={e => setKbGuideName(e.target.value)} placeholder="Ust. Ahmad" maxLength={80} /></div>
                  <div><p className="text-[11px] font-semibold mb-1.5" style={{ color: '#374151' }}>WA Muthowwif</p><StyledInput type="text" value={kbGuideWhatsapp} onChange={e => setKbGuideWhatsapp(normalizePhone(e.target.value))} placeholder="628xxxxxxxxxx" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><p className="text-[11px] font-semibold mb-1.5" style={{ color: '#374151' }}>Nama Tour Leader</p><StyledInput type="text" value={kbTourLeaderName} onChange={e => setKbTourLeaderName(e.target.value)} placeholder="Bpk. Budi" maxLength={80} /></div>
                  <div><p className="text-[11px] font-semibold mb-1.5" style={{ color: '#374151' }}>WA Tour Leader</p><StyledInput type="text" value={kbTourLeaderWhatsapp} onChange={e => setKbTourLeaderWhatsapp(normalizePhone(e.target.value))} placeholder="628xxxxxxxxxx" /></div>
                </div>
                <div><p className="text-[11px] font-semibold mb-1.5" style={{ color: '#374151' }}>Catatan Darurat</p><StyledTextarea rows={2} value={kbEmergencyNote} onChange={e => setKbEmergencyNote(e.target.value)} placeholder="Instruksi jika jamaah tersesat..." /></div>
                <div>
                  <p className="text-[11px] font-semibold mb-1.5" style={{ color: '#374151' }}>Override Fase</p>
                  <select value={kbFaseOverride} onChange={e => setKbFaseOverride(e.target.value)}
                    className="w-full rounded-xl px-3 py-2.5 text-[13px] focus:outline-none"
                    style={{ ...inputBase }}>
                    <option value="">Auto (dari tanggal)</option>
                    {FASE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={kbAktif} onChange={e => setKbAktif(e.target.checked)} className="w-4 h-4 rounded" />
                  <span className="text-[12px] font-medium" style={{ color: '#374151' }}>Batch aktif (terlihat di login jamaah)</span>
                </label>
              </div>
              {kbError && <p className="mt-3 text-[12px]" style={{ color: '#dc2626' }}>{kbError}</p>}
              <div className="flex items-center gap-3 pt-5">
                <button type="submit" disabled={kbSaving}
                  className="px-6 py-2.5 text-[12px] font-semibold rounded-xl disabled:opacity-60"
                  style={{ background: `linear-gradient(135deg, ${PRIMARY} 0%, ${PRIMARY_DEEP} 100%)`, color: '#ffffff' }}>
                  {kbSaving ? 'Menyimpan...' : (kbEditId ? 'Simpan Perubahan' : 'Buat Batch')}
                </button>
                <button type="button" onClick={() => setKbFormOpen(false)}
                  className="px-5 py-2.5 text-[12px] font-medium rounded-xl" style={{ color: '#6b7280', border: '1px solid rgba(0,0,0,0.1)' }}>
                  Batal
                </button>
              </div>
            </form>
          )}

          {keberangkatanLoading && (
            <p className="text-[12px] py-8 text-center" style={{ color: '#9ca3af' }}>Memuat batch...</p>
          )}

          {!keberangkatanLoading && keberangkatanList.length === 0 && (
            <div className="py-12 text-center rounded-2xl" style={{ border: '1px dashed rgba(0,0,0,0.12)' }}>
              <p className="text-[13px]" style={{ color: '#9ca3af' }}>Belum ada batch keberangkatan.</p>
              <p className="text-[12px] mt-1" style={{ color: '#d1d5db' }}>Klik "+ Tambah Batch" untuk memulai.</p>
            </div>
          )}

          <div className="space-y-3">
            {keberangkatanList.map(kb => (
              <div key={kb.id} className="rounded-2xl px-5 py-4"
                style={{ ...cardStyle, border: selectedKeberangkatan === kb.id ? `1.5px solid ${PRIMARY_BORDER}` : undefined }}>
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-[14px]" style={{ color: '#202020' }}>{kb.nama_batch}</p>
                      {kb.aktif ? (
                        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: 'rgba(22,163,74,0.1)', color: '#16a34a' }}>Aktif</span>
                      ) : (
                        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: 'rgba(0,0,0,0.05)', color: '#9ca3af' }}>Nonaktif</span>
                      )}
                      {isBatchFinished(kb) && (
                        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: 'rgba(71,85,105,0.10)', color: '#475569' }}>Selesai</span>
                      )}
                      {selectedKeberangkatan === kb.id && (
                        <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: PRIMARY_BG, color: PRIMARY }}>Dipilih</span>
                      )}
                    </div>
                    {(kb.tanggal_keberangkatan || kb.tanggal_kepulangan) && (
                      <p className="text-[11px] mt-0.5" style={{ color: '#6b7280' }}>
                        {kb.tanggal_keberangkatan ? new Date(kb.tanggal_keberangkatan + 'T00:00:00').toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                        {' → '}
                        {kb.tanggal_kepulangan ? new Date(kb.tanggal_kepulangan + 'T00:00:00').toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                      </p>
                    )}
                    {kb.hotel_makkah && <p className="text-[10px] mt-0.5" style={{ color: '#9ca3af' }}>🕌 {kb.hotel_makkah}</p>}
                  </div>
                  <div className="flex items-center gap-2 flex-none">
                    <button type="button" onClick={() => setSelectedKeberangkatan(kb.id)}
                      className="text-[11px] px-3 py-1.5 rounded-lg font-medium transition-all"
                      style={{ background: selectedKeberangkatan === kb.id ? PRIMARY_BG : 'rgba(0,0,0,0.04)', color: selectedKeberangkatan === kb.id ? PRIMARY : '#6b7280' }}>
                      Pilih
                    </button>
                    <button type="button" onClick={() => openKbForm(kb)}
                      className="text-[11px] px-3 py-1.5 rounded-lg font-medium transition-all"
                      style={{ background: 'rgba(0,0,0,0.04)', color: '#374151' }}>
                      Edit
                    </button>
                    <button type="button" onClick={() => handleDeleteKeberangkatan(kb.id, kb.nama_batch)}
                      className="text-[11px] px-3 py-1.5 rounded-lg font-medium transition-all"
                      style={{ color: '#dc2626' }}>
                      Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════
          TAB: JAMAAH
      ══════════════════════════════════════════════ */}
      {activeTab === 'jamaah' && (
        <div>
          {!selectedKeberangkatan && (
            <div className="mb-5 rounded-xl px-4 py-3 text-[12px]" style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.2)', color: '#d97706' }}>
              Buat batch keberangkatan dulu di tab <strong>Keberangkatan</strong> sebelum menambah jamaah.
            </div>
          )}

          {/* Header */}
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <h2 className="mr-auto text-[16px] font-bold" style={{ color: '#202020', letterSpacing: '-0.02em' }}>
              Daftar Jamaah <span className="text-[12px] font-semibold text-mute">{jamaahList.length}</span>
            </h2>
            <button type="button" onClick={() => { setImportOpen(o => !o); setImportError(''); setImportPreview([]); }}
              className="rounded-full border border-hairline bg-white px-3 py-1.5 text-[12px] font-semibold text-charcoal">
              Import<span className="hidden sm:inline"> Excel/PDF</span>
            </button>
            {selectedKeberangkatan && (
              <button type="button" onClick={() => setJmFormOpen(o => !o)} aria-expanded={jmFormOpen}
                className="rounded-full px-3 py-1.5 text-[12px] font-semibold text-white" style={{ background: PRIMARY }}>
                {jmFormOpen ? 'Tutup form' : '+ Tambah'}
              </button>
            )}
          </div>

          {/* Import panel */}
          {importOpen && (
            <div className="rounded-2xl px-6 py-6 mb-4" style={{ ...cardStyle, border: `1px solid ${PRIMARY_BORDER}` }}>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] mb-3" style={{ color: PRIMARY }}>Import Jamaah dengan AI</p>
              <p className="text-[12px] mb-4" style={{ color: '#6b7280' }}>
                Upload file Excel (.xlsx/.csv) atau PDF berisi daftar jamaah. AI akan membaca & merapikan datanya, lalu Anda bisa review sebelum menyimpan.
              </p>

              {importPreview.length === 0 ? (
                <div>
                  <button type="button" onClick={() => importFileRef.current?.click()} disabled={importLoading}
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-[12px] font-semibold rounded-xl transition-all disabled:opacity-60"
                    style={{ background: `linear-gradient(135deg, ${PRIMARY} 0%, ${PRIMARY_DEEP} 100%)`, color: '#fff' }}>
                    {importLoading ? 'AI sedang membaca...' : 'Pilih File'}
                  </button>
                  <input ref={importFileRef} type="file" accept=".xlsx,.xls,.csv,application/pdf,image/png,image/jpeg,image/webp" onChange={handleImportFile} className="hidden" />
                  <p className="mt-2 text-[10px]" style={{ color: '#9ca3af' }}>Format: Excel, CSV, atau PDF. Maks ~10MB.</p>
                </div>
              ) : (
                <div>
                  <p className="text-[12px] font-semibold mb-2" style={{ color: '#374151' }}>{importPreview.length} jamaah terbaca — review & edit sebelum simpan:</p>
                  <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(0,0,0,0.06)' }}>
                    <table className="w-full text-[12px]">
                      <thead><tr style={{ background: '#fafaf9' }}>
                        {['Nama', 'No. Jamaah', 'No. Paspor', 'Hotel Makkah', 'Hotel Madinah', ''].map(h => (
                          <th key={h} className="text-left px-3 py-2 font-mono text-[10px] uppercase" style={{ color: '#9ca3af' }}>{h}</th>
                        ))}
                      </tr></thead>
                      <tbody>
                        {importPreview.map((r, idx) => (
                          <tr key={idx} style={{ borderTop: '1px solid rgba(0,0,0,0.04)' }}>
                            <td className="px-2 py-1.5"><input value={r.nama} onChange={e => updatePreviewRow(idx, 'nama', e.target.value)} className="w-full rounded px-2 py-1 text-[12px]" style={{ border: '1px solid rgba(0,0,0,0.1)' }} /></td>
                            <td className="px-2 py-1.5"><input value={r.nomor_jamaah} onChange={e => updatePreviewRow(idx, 'nomor_jamaah', e.target.value)} className="w-full rounded px-2 py-1 text-[12px] font-mono" style={{ border: '1px solid rgba(0,0,0,0.1)' }} /></td>
                            <td className="px-2 py-1.5"><input value={r.nomor_paspor} onChange={e => updatePreviewRow(idx, 'nomor_paspor', e.target.value)} className="w-full rounded px-2 py-1 text-[12px] font-mono" style={{ border: '1px solid rgba(0,0,0,0.1)' }} /></td>
                            <td className="px-2 py-1.5"><input value={r.hotel_makkah} onChange={e => updatePreviewRow(idx, 'hotel_makkah', e.target.value)} placeholder="Ikuti batch" className="w-full rounded px-2 py-1 text-[12px]" style={{ border: '1px solid rgba(0,0,0,0.1)' }} /></td>
                            <td className="px-2 py-1.5"><input value={r.hotel_madinah} onChange={e => updatePreviewRow(idx, 'hotel_madinah', e.target.value)} placeholder="Ikuti batch" className="w-full rounded px-2 py-1 text-[12px]" style={{ border: '1px solid rgba(0,0,0,0.1)' }} /></td>
                            <td className="px-2 py-1.5 text-right"><button type="button" onClick={() => removePreviewRow(idx)} className="text-[11px] px-2 py-1 rounded" style={{ color: '#dc2626' }}>Hapus</button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button type="button" onClick={confirmImport} disabled={importSaving}
                      className="px-5 py-2.5 text-[12px] font-semibold rounded-xl disabled:opacity-60"
                      style={{ background: `linear-gradient(135deg, ${PRIMARY} 0%, ${PRIMARY_DEEP} 100%)`, color: '#fff' }}>
                      {importSaving ? 'Menerbitkan...' : `Terbitkan ${importPreview.length} Jamaah`}
                    </button>
                    <button type="button" onClick={() => { setImportPreview([]); setImportError(''); }}
                      className="px-5 py-2.5 text-[12px] font-semibold rounded-xl" style={{ color: '#6b7280', border: '1px solid rgba(0,0,0,0.1)' }}>
                      Batal / Pilih Ulang
                    </button>
                  </div>
                </div>
              )}
              {importError && <p className="mt-3 text-[12px]" style={{ color: '#dc2626' }}>{importError}</p>}
            </div>
          )}

          {/* Form tambah jamaah cepat */}
          {selectedKeberangkatan && jmFormOpen && (
            <div className="rounded-2xl border p-5 mb-4" style={{ borderColor: 'rgba(0,0,0,0.07)', background: '#fff' }}>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] mb-3" style={{ color: '#6b7280' }}>Tambah Jamaah</p>
              <form onSubmit={handleAddJamaah}>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                  <div className="flex-1">
                    <FieldLabel>Nama Jamaah *</FieldLabel>
                    <StyledInput ref={namaRef} type="text" value={jmNama} onChange={e => setJmNama(e.target.value)} placeholder="cth. Budi Santoso" required />
                  </div>
                  <div className="sm:w-44">
                    <FieldLabel>Nomor Jamaah *</FieldLabel>
                    <StyledInput type="text" value={jmNomorJamaah} onChange={e => setJmNomorJamaah(e.target.value)} placeholder="cth. TU-2026-001" required />
                  </div>
                  <button type="submit" disabled={jmSubmitting}
                    className="flex-none rounded-xl px-5 py-2.5 text-[13px] font-semibold text-white transition-all active:scale-[0.98] disabled:opacity-60"
                    style={{ background: `linear-gradient(135deg, ${PRIMARY}, ${PRIMARY_DEEP})` }}>
                    {jmSubmitting ? 'Menyimpan…' : '+ Tambah'}
                  </button>
                </div>

                <button type="button" onClick={() => setShowDetailJamaah(v => !v)}
                  className="mt-3 inline-flex items-center gap-1 text-[12px] font-medium" style={{ color: PRIMARY }}>
                  {showDetailJamaah ? '− Sembunyikan detail' : '+ Detail opsional (rombongan, bus, kamar, paspor, fase)'}
                </button>

                {showDetailJamaah && (
                  <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    <div><FieldLabel>Rombongan</FieldLabel><StyledInput type="text" value={jmRombongan} onChange={e => setJmRombongan(e.target.value)} placeholder="A / 1" /></div>
                    <div><FieldLabel>No. Bus</FieldLabel><StyledInput type="text" value={jmBus} onChange={e => setJmBus(e.target.value)} placeholder="3" /></div>
                    <div><FieldLabel>No. Kamar</FieldLabel><StyledInput type="text" value={jmKamar} onChange={e => setJmKamar(e.target.value)} placeholder="812" /></div>
                    <div><FieldLabel>No. Paspor</FieldLabel><StyledInput type="text" value={jmPaspor} onChange={e => setJmPaspor(e.target.value)} placeholder="C1234567" /></div>
                    <div className="col-span-2 sm:col-span-1">
                      <FieldLabel>Fase</FieldLabel>
                      <select value={jmFase} onChange={e => setJmFase(e.target.value as JamaahAccountRow['fase'])}
                        className="w-full rounded-xl px-3 py-2.5 text-[14px] focus:outline-none"
                        style={{ border: '1px solid rgba(0,0,0,0.15)', ...inputBase }}>
                        {FASE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                    </div>
                  </div>
                )}

                {jmError && <p className="mt-2 text-[12px]" style={{ color: '#dc2626' }}>{jmError}</p>}
              </form>
            </div>
          )}

          {/* List jamaah */}
          <div className="rounded-2xl overflow-hidden" style={cardStyle}>
            {jamaahLoading ? (
              <div className="py-8 text-center font-mono text-[12px]" style={{ color: '#d1d5db' }}>Memuat...</div>
            ) : !selectedKeberangkatan ? (
              <div className="py-8 text-center text-[13px]" style={{ color: '#9ca3af' }}>Pilih batch keberangkatan untuk melihat jamaah.</div>
            ) : jamaahList.length === 0 ? (
              <div className="py-8 text-center text-[13px]" style={{ color: '#9ca3af' }}>Belum ada jamaah terdaftar di batch ini.</div>
            ) : (
              <ul className="divide-y" style={{ borderColor: 'rgba(0,0,0,0.04)' }}>
                {jamaahList.map((j) => {
                  const isEditing = editingJamaahId === j.id;
                  const chips = [
                    j.rombongan ? (/^rombongan\b/i.test(j.rombongan.trim()) ? j.rombongan.trim() : `Romb. ${j.rombongan}`) : null,
                    j.nomor_bus ? `Bus ${j.nomor_bus}` : null,
                    j.nomor_kamar ? `Kmr ${j.nomor_kamar}` : null,
                    j.nomor_paspor ? j.nomor_paspor : null,
                  ].filter(Boolean) as string[];
                  const hasHotelOverride = Boolean(j.hotel_makkah?.trim() || j.hotel_madinah?.trim());

                  if (isEditing) {
                    return (
                      <li key={j.id} className="px-5 py-4" style={{ background: `color-mix(in srgb, var(--color-primary) 3%, transparent)` }}>
                        <div className="grid grid-cols-2 gap-2 mb-2 sm:grid-cols-4">
                          <div>
                            <p className="font-mono text-[9px] uppercase tracking-widest mb-1" style={{ color: '#9ca3af' }}>Nama</p>
                            <input value={editNama} onChange={e => setEditNama(e.target.value)}
                              className="w-full rounded-lg px-2 py-1.5 text-[13px] focus:outline-none"
                              style={{ border: `1px solid ${PRIMARY_BORDER}`, background: '#fff', color: '#202020' }} />
                          </div>
                          <div>
                            <p className="font-mono text-[9px] uppercase tracking-widest mb-1" style={{ color: '#9ca3af' }}>No. Jamaah</p>
                            <input value={editNomorJamaah} onChange={e => setEditNomorJamaah(e.target.value)}
                              className="w-full rounded-lg px-2 py-1.5 text-[12px] font-mono focus:outline-none"
                              style={{ border: `1px solid ${PRIMARY_BORDER}`, background: '#fff', color: '#374151' }} />
                          </div>
                          <div>
                            <p className="font-mono text-[9px] uppercase tracking-widest mb-1" style={{ color: '#9ca3af' }}>Rombongan</p>
                            <input value={editRombongan} onChange={e => setEditRombongan(e.target.value)} placeholder="—"
                              className="w-full rounded-lg px-2 py-1.5 text-[12px] focus:outline-none"
                              style={{ border: `1px solid ${PRIMARY_BORDER}`, background: '#fff', color: '#374151' }} />
                          </div>
                          <div>
                            <p className="font-mono text-[9px] uppercase tracking-widest mb-1" style={{ color: '#9ca3af' }}>No. Paspor</p>
                            <input value={editPaspor} onChange={e => setEditPaspor(e.target.value)} placeholder="—"
                              className="w-full rounded-lg px-2 py-1.5 text-[12px] font-mono focus:outline-none"
                              style={{ border: `1px solid ${PRIMARY_BORDER}`, background: '#fff', color: '#374151' }} />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          <div>
                            <p className="font-mono text-[9px] uppercase tracking-widest mb-1" style={{ color: '#9ca3af' }}>Upgrade Hotel Makkah</p>
                            <input value={editHotelMakkah} onChange={e => setEditHotelMakkah(e.target.value)} placeholder="Ikuti hotel batch"
                              className="w-full rounded-lg px-2 py-1.5 text-[12px] focus:outline-none"
                              style={{ border: `1px solid ${PRIMARY_BORDER}`, background: '#fff', color: '#374151' }} />
                          </div>
                          <div>
                            <p className="font-mono text-[9px] uppercase tracking-widest mb-1" style={{ color: '#9ca3af' }}>Upgrade Hotel Madinah</p>
                            <input value={editHotelMadinah} onChange={e => setEditHotelMadinah(e.target.value)} placeholder="Ikuti hotel batch"
                              className="w-full rounded-lg px-2 py-1.5 text-[12px] focus:outline-none"
                              style={{ border: `1px solid ${PRIMARY_BORDER}`, background: '#fff', color: '#374151' }} />
                          </div>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <button type="button" onClick={() => saveEditJamaah(j.id)} disabled={editSaving}
                            className="font-mono text-[11px] px-4 py-1.5 rounded-lg transition-all duration-150 disabled:opacity-60"
                            style={{ background: `linear-gradient(135deg, ${PRIMARY} 0%, ${PRIMARY_DEEP} 100%)`, color: '#fff' }}>
                            {editSaving ? 'Menyimpan...' : 'Simpan'}
                          </button>
                          <button type="button" onClick={cancelEditJamaah} disabled={editSaving}
                            className="font-mono text-[11px] px-3 py-1.5 rounded-lg transition-all duration-150"
                            style={{ color: '#9ca3af', border: '1px solid rgba(0,0,0,0.07)' }}>
                            Batal
                          </button>
                        </div>
                        {editError && <p className="mt-1 text-[12px]" style={{ color: '#dc2626' }}>{editError}</p>}
                      </li>
                    );
                  }

                  return (
                    <li key={j.id} className="flex items-center gap-3 px-5 py-3.5">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 flex-wrap">
                          <span className="text-[13px] font-semibold" style={{ color: '#202020' }}>{j.nama}</span>
                          <span className="font-mono text-[11px]" style={{ color: '#6b7280' }}>{j.nomor_jamaah}</span>
                        </div>
                        {chips.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {chips.map(chip => (
                              <span key={chip} className="font-mono text-[10px] px-1.5 py-0.5 rounded-md" style={{ background: 'rgba(0,0,0,0.04)', color: '#6b7280' }}>{chip}</span>
                            ))}
                          </div>
                        )}
                        {hasHotelOverride && (
                          <p className="mt-1 text-[10px] font-semibold" style={{ color: '#b45309' }}>
                            Upgrade hotel individual aktif
                          </p>
                        )}
                      </div>
                      <select value={j.fase_override ?? ''} onChange={e => handleUpdateJamaahFase(j.id, e.target.value)}
                        className="hidden sm:block text-[11px] rounded-lg px-2 py-1 focus:outline-none transition-all flex-none"
                        style={{ border: '1px solid rgba(0,0,0,0.09)', background: '#ffffff', color: '#374151' }}>
                        <option value="">Auto</option>
                        {FASE_OPTIONS.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
                      </select>
                      <div className="flex items-center gap-1.5 flex-none">
                        <button type="button" onClick={() => startEditJamaah(j)}
                          className="font-mono text-[11px] px-3 py-1.5 rounded-lg transition-all duration-150"
                          style={{ color: PRIMARY, border: `1px solid ${PRIMARY_BORDER}` }}
                          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = PRIMARY_BG; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}>
                          Edit
                        </button>
                        {hasHotelOverride && (
                          <button type="button" onClick={() => clearJamaahHotelOverride(j)}
                            className="font-mono text-[11px] px-3 py-1.5 rounded-lg transition-all duration-150"
                            style={{ color: '#b45309', border: '1px solid rgba(217,119,6,0.24)', background: 'rgba(245,158,11,0.06)' }}>
                            Ikuti Hotel Batch
                          </button>
                        )}
                        <button type="button" onClick={() => handleDeleteJamaah(j.id, j.nama)}
                          className="font-mono text-[11px] px-3 py-1.5 rounded-lg transition-all duration-150"
                          style={{ color: '#9ca3af', border: '1px solid rgba(0,0,0,0.07)' }}
                          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#dc2626'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(220,38,38,0.25)'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(220,38,38,0.05)'; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#9ca3af'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,0,0,0.07)'; (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}>
                          Hapus
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════
          TAB: AGENDA
      ══════════════════════════════════════════════ */}
      {activeTab === 'agenda' && (
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <h2 className="mr-auto text-[16px] font-bold" style={{ color: '#202020', letterSpacing: '-0.02em' }}>
              Agenda Perjalanan <span className="text-[12px] font-semibold text-mute">{agendaItems.length}</span>
            </h2>
            {selectedKeberangkatan && (
              <>
                <button type="button" onClick={() => { setAgImportOpen(o => !o); setAgImportError(''); setAgImportPreview([]); }}
                  className="rounded-full border border-hairline bg-white px-3 py-1.5 text-[12px] font-semibold text-charcoal">
                  Susun <span className="hidden sm:inline">dengan </span>AI
                </button>
                <button type="button" onClick={() => setAgFormOpen(o => !o)} aria-expanded={agFormOpen}
                  className="rounded-full px-3 py-1.5 text-[12px] font-semibold text-white" style={{ background: PRIMARY }}>
                  {agFormOpen ? 'Tutup form' : '+ Tambah'}
                </button>
              </>
            )}
          </div>


          {!selectedKeberangkatan ? (
            <div className="mb-5 rounded-xl px-4 py-3 text-[12px]" style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.2)', color: '#d97706' }}>
              Pilih batch keberangkatan untuk mengelola agenda.
            </div>
          ) : (
            <>
              {/* AI Import Panel */}
              {agImportOpen && (
                <div className="rounded-2xl px-6 py-6 mb-4" style={{ ...cardStyle, border: `1px solid ${PRIMARY_BORDER}` }}>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] mb-1" style={{ color: PRIMARY }}>Susun Itinerary dengan AI</p>
                  <p className="text-[12px] mb-4" style={{ color: '#6b7280' }}>
                    Upload file Excel, CSV, PDF, atau foto jadwal — AI ekstrak & susun itinerary otomatis. Review sebelum menyimpan.
                  </p>
                  {agImportPreview.length === 0 ? (
                    <div>
                      <button type="button" onClick={() => agImportFileRef.current?.click()} disabled={agImportLoading}
                        className="inline-flex items-center gap-2 px-5 py-2.5 text-[12px] font-semibold rounded-xl transition-all disabled:opacity-60"
                        style={{ background: `linear-gradient(135deg, ${PRIMARY} 0%, ${PRIMARY_DEEP} 100%)`, color: '#fff' }}>
                        {agImportLoading ? 'AI sedang membaca...' : 'Pilih File'}
                      </button>
                      <input ref={agImportFileRef} type="file" accept=".xlsx,.xls,.csv,application/pdf,image/png,image/jpeg,image/webp" onChange={handleAgImportFile} className="hidden" />
                      <p className="mt-2 text-[10px]" style={{ color: '#9ca3af' }}>Format: Excel, CSV, PDF, PNG, JPG, WebP.</p>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-[12px] font-semibold" style={{ color: '#374151' }}>{agImportPreview.length} agenda terbaca — review & edit sebelum simpan:</p>
                        <button type="button" onClick={() => setAgImportPreview([])} className="text-[11px]" style={{ color: '#9ca3af' }}>Ulangi</button>
                      </div>
                      <div className="overflow-x-auto rounded-xl mb-3" style={{ border: '1px solid rgba(0,0,0,0.07)' }}>
                        <table className="w-full text-[11px]">
                          <thead>
                            <tr style={{ background: '#ffffff', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
                              {['Tanggal', 'Jam', 'Judul', 'Lokasi', 'Deskripsi', ''].map(h => (
                                <th key={h} className="text-left font-mono uppercase tracking-wider px-3 py-2" style={{ color: '#9ca3af', fontSize: '10px' }}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {agImportPreview.map((row, idx) => (
                              <tr key={idx} style={{ borderBottom: idx < agImportPreview.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none' }}>
                                <td className="px-2 py-1.5"><input className="w-28 rounded px-2 py-1 text-[11px] focus:outline-none" style={{ ...inputBase }} value={row.tanggal} onChange={e => updateAgPreviewRow(idx, 'tanggal', e.target.value)} /></td>
                                <td className="px-2 py-1.5"><input className="w-20 rounded px-2 py-1 text-[11px] focus:outline-none" style={{ ...inputBase }} value={row.jam_mulai} onChange={e => updateAgPreviewRow(idx, 'jam_mulai', e.target.value)} /></td>
                                <td className="px-2 py-1.5"><input className="w-44 rounded px-2 py-1 text-[11px] focus:outline-none" style={{ ...inputBase }} value={row.judul} onChange={e => updateAgPreviewRow(idx, 'judul', e.target.value)} /></td>
                                <td className="px-2 py-1.5"><input className="w-32 rounded px-2 py-1 text-[11px] focus:outline-none" style={{ ...inputBase }} value={row.lokasi} onChange={e => updateAgPreviewRow(idx, 'lokasi', e.target.value)} /></td>
                                <td className="px-2 py-1.5"><input className="w-40 rounded px-2 py-1 text-[11px] focus:outline-none" style={{ ...inputBase }} value={row.deskripsi} onChange={e => updateAgPreviewRow(idx, 'deskripsi', e.target.value)} /></td>
                                <td className="px-2 py-1.5"><button type="button" onClick={() => removeAgPreviewRow(idx)} className="text-[11px] px-2 py-1 rounded" style={{ color: '#dc2626' }}>Hapus</button></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {agImportError && <p className="text-[12px] mb-2" style={{ color: '#dc2626' }}>{agImportError}</p>}
                      <div className="flex gap-2">
                        <button type="button" onClick={confirmAgImport} disabled={agImportSaving}
                          className="px-5 py-2.5 text-[12px] font-semibold rounded-xl disabled:opacity-60"
                          style={{ background: `linear-gradient(135deg, ${PRIMARY} 0%, ${PRIMARY_DEEP} 100%)`, color: '#fff' }}>
                          {agImportSaving ? 'Menyimpan...' : `Simpan ${agImportPreview.length} Agenda`}
                        </button>
                        <button type="button" onClick={() => { setAgImportOpen(false); setAgImportPreview([]); }}
                          className="px-4 py-2.5 text-[12px] rounded-xl" style={{ border: '1px solid rgba(0,0,0,0.1)', color: '#6b7280' }}>
                          Batal
                        </button>
                      </div>
                    </div>
                  )}
                  {agImportError && agImportPreview.length === 0 && <p className="mt-2 text-[12px]" style={{ color: '#dc2626' }}>{agImportError}</p>}
                </div>
              )}

              {agFormOpen && (
              <div className="rounded-2xl p-4 mb-3" style={cardStyle}>
                <form onSubmit={handleAddAgenda} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div><p className="text-[11px] font-semibold mb-1.5" style={{ color: '#374151' }}>Tanggal <span style={{ color: '#f87171' }}>*</span></p><StyledInput type="date" value={agTanggal} onChange={e => setAgTanggal(e.target.value)} required /></div>
                    <div><p className="text-[11px] font-semibold mb-1.5" style={{ color: '#374151' }}>Jam Mulai</p><StyledInput type="time" value={agJam} onChange={e => setAgJam(e.target.value)} /></div>
                  </div>
                  <div><p className="text-[11px] font-semibold mb-1.5" style={{ color: '#374151' }}>Judul Kegiatan <span style={{ color: '#f87171' }}>*</span></p><StyledInput type="text" value={agJudul} onChange={e => setAgJudul(e.target.value)} placeholder="Cth: Perjalanan ke Madinah" required /></div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div><p className="text-[11px] font-semibold mb-1.5" style={{ color: '#374151' }}>Lokasi</p><StyledInput type="text" value={agLokasi} onChange={e => setAgLokasi(e.target.value)} placeholder="Bandara Soekarno-Hatta" /></div>
                    <div><p className="text-[11px] font-semibold mb-1.5" style={{ color: '#374151' }}>Deskripsi</p><StyledTextarea rows={1} value={agDeskripsi} onChange={e => setAgDeskripsi(e.target.value)} placeholder="Keterangan tambahan..." /></div>
                  </div>
                  {agError && <p className="text-[12px]" style={{ color: '#dc2626' }}>{agError}</p>}
                  <button type="submit" disabled={agSubmitting}
                    className="flex items-center gap-2 px-5 py-2.5 text-[12px] font-semibold rounded-xl transition-all duration-150 disabled:opacity-60"
                    style={{ background: `linear-gradient(135deg, ${PRIMARY} 0%, ${PRIMARY_DEEP} 100%)`, color: '#ffffff', boxShadow: '0 2px 8px color-mix(in srgb, var(--color-primary) 22%, transparent)' }}>
                    {agSubmitting ? (
                      <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" /><path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" /></svg>
                    ) : (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                    )}
                    Tambah Agenda
                  </button>
                </form>
              </div>
              )}

              {agEditSuccess && (
                <div className="mb-3 rounded-xl px-4 py-2.5 text-[12px] font-medium flex items-center gap-2"
                  style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', color: '#059669' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  {agEditSuccess}
                </div>
              )}

              <div className="rounded-2xl overflow-hidden" style={cardStyle}>
                {agendaLoading ? (
                  <div className="py-10 text-center font-mono text-[12px]" style={{ color: '#d1d5db' }}>Memuat agenda...</div>
                ) : agendaItems.length === 0 ? (
                  <div className="py-10 text-center"><p className="text-[13px]" style={{ color: '#9ca3af' }}>Belum ada agenda.</p></div>
                ) : (
                  <>
                  {/* HP: daftar per tanggal */}
                  <ul className="divide-y divide-hairline md:hidden">
                    {agendaItems.map((item, i) => (
                      <li key={item.id}>
                        {(i === 0 || agendaItems[i - 1].tanggal !== item.tanggal) && (
                          <p className="bg-surface-bone px-4 py-1.5 text-[11px] font-bold text-charcoal">{formatTanggal(item.tanggal)}</p>
                        )}
                        <div className="flex items-start gap-3 px-4 py-2.5">
                          <span className="w-10 flex-none pt-px text-[12px] font-semibold text-charcoal">{item.jam_mulai ? item.jam_mulai.slice(0, 5) : '—'}</span>
                          <div className="min-w-0 flex-1">
                            <p className="text-[12.5px] font-semibold leading-snug text-ink">{item.judul}</p>
                            {item.lokasi && <p className="mt-0.5 text-[11px] text-charcoal">{item.lokasi}</p>}
                            {item.deskripsi && <p className="mt-0.5 text-[11px] leading-snug text-mute">{item.deskripsi}</p>}
                          </div>
                          <div className="flex flex-none flex-col items-end gap-1">
                            <button type="button" onClick={() => agEditingId === item.id ? handleCancelAgEdit() : handleStartAgEdit(item)} disabled={agEditSaving} className="px-1 text-[11.5px] font-semibold text-primary disabled:opacity-40">
                              {agEditingId === item.id ? 'Tutup' : 'Edit'}
                            </button>
                            <button type="button" onClick={() => handleDeleteAgenda(item.id, item.judul)} disabled={agEditSaving} className="px-1 text-[11.5px] font-semibold disabled:opacity-40" style={{ color: '#dc2626' }}>Hapus</button>
                          </div>
                        </div>
                        {agEditingId === item.id && <div className="border-t border-hairline bg-canvas p-4">{agEditForm}</div>}
                      </li>
                    ))}
                  </ul>
                  <table className="hidden w-full md:table">
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.06)', background: '#fafaf9' }}>
                        {['Tanggal', 'Jam', 'Judul', 'Lokasi', ''].map(h => (
                          <th key={h} className="text-left font-mono text-[10px] uppercase tracking-[0.12em] px-5 py-3" style={{ color: '#9ca3af' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {agendaItems.map((item, i) => (
                        <React.Fragment key={item.id}>
                          {/* Read-only row */}
                          <tr style={{ borderBottom: agEditingId === item.id ? 'none' : (i < agendaItems.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none') }}>
                            <td className="px-5 py-3.5 text-[13px] font-medium whitespace-nowrap" style={{ color: '#374151' }}>{formatTanggal(item.tanggal)}</td>
                            <td className="px-5 py-3.5 font-mono text-[12px]" style={{ color: '#6b7280' }}>{item.jam_mulai ? item.jam_mulai.slice(0, 5) : '—'}</td>
                            <td className="px-5 py-3.5">
                              <p className="text-[13px] font-semibold" style={{ color: '#202020' }}>{item.judul}</p>
                              {item.deskripsi && <p className="text-[11px] mt-0.5" style={{ color: '#9ca3af' }}>{item.deskripsi}</p>}
                            </td>
                            <td className="px-5 py-3.5 text-[12px]" style={{ color: '#6b7280' }}>{item.lokasi ?? '—'}</td>
                            <td className="px-5 py-3.5 text-right">
                              <button type="button"
                                onClick={() => agEditingId === item.id ? handleCancelAgEdit() : handleStartAgEdit(item)}
                                disabled={agEditSaving}
                                className="font-mono text-[11px] px-3 py-1.5 rounded-lg transition-all duration-150 disabled:opacity-40"
                                style={agEditingId === item.id
                                  ? { color: PRIMARY, border: `1px solid ${PRIMARY_BORDER}`, background: PRIMARY_BG }
                                  : { color: '#6b7280', border: '1px solid rgba(0,0,0,0.09)' }}
                                onMouseEnter={e => { if (agEditingId !== item.id && !agEditSaving) { (e.currentTarget as HTMLButtonElement).style.color = PRIMARY; (e.currentTarget as HTMLButtonElement).style.borderColor = PRIMARY_BORDER; (e.currentTarget as HTMLButtonElement).style.background = PRIMARY_BG; } }}
                                onMouseLeave={e => { if (agEditingId !== item.id && !agEditSaving) { (e.currentTarget as HTMLButtonElement).style.color = '#6b7280'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,0,0,0.09)'; (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; } }}>
                                {agEditingId === item.id ? 'Tutup' : 'Edit'}
                              </button>
                              <button type="button" onClick={() => handleDeleteAgenda(item.id, item.judul)}
                                disabled={agEditSaving}
                                className="font-mono text-[11px] px-3 py-1.5 ml-2 rounded-lg transition-all duration-150 disabled:opacity-40"
                                style={{ color: '#6b7280', border: '1px solid rgba(0,0,0,0.09)' }}
                                onMouseEnter={e => { if (!agEditSaving) { (e.currentTarget as HTMLButtonElement).style.color = '#dc2626'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(220,38,38,0.25)'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(220,38,38,0.05)'; } }}
                                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#6b7280'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,0,0,0.09)'; (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}>
                                Hapus
                              </button>
                            </td>
                          </tr>
                          {/* Inline edit row */}
                          {agEditingId === item.id && (
                            <tr style={{ borderBottom: i < agendaItems.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none' }}>
                              <td colSpan={5} style={{ padding: '16px 20px 20px', background: 'var(--surface-1, #f8fafc)', borderTop: `1px solid ${PRIMARY_BORDER}` }}>
                                {agEditForm}
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════
          TAB: PENGUMUMAN
      ══════════════════════════════════════════════ */}
      {activeTab === 'addon' && (
        <section className="space-y-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: PRIMARY }}>Itinerary Addon</p>
              <h2 className="mt-1 text-[22px] font-bold" style={{ color: '#202020' }}>Agenda khusus tanpa memecah batch</h2>
              <p className="mt-1 text-[13px]" style={{ color: '#6b7280' }}>Pilih jamaah peserta, lalu agenda addon hanya tampil di aplikasi mereka.</p>
            </div>
            {selectedBatch && <span className="rounded-full px-3 py-1.5 text-[11px] font-semibold" style={{ background: PRIMARY_BG, color: PRIMARY_DEEP }}>{selectedBatch.nama_batch}</span>}
          </div>
          {!selectedKeberangkatan ? <div className="rounded-2xl p-5 text-[13px]" style={cardStyle}>Pilih batch keberangkatan terlebih dahulu.</div> : <>
            <div className="grid gap-5 xl:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
              <form onSubmit={handleCreateAddon} className="rounded-2xl p-5" style={cardStyle}>
                <FieldLabel>Buat itinerary addon</FieldLabel>
                <StyledInput value={addonName} onChange={e => setAddonName(e.target.value)} placeholder="Contoh: Trip AlUla" required />
                <StyledTextarea className="mt-3" rows={3} value={addonDescription} onChange={e => setAddonDescription(e.target.value)} placeholder="Catatan untuk tim travel..." />
                <button type="submit" disabled={addonSaving} className="mt-3 rounded-xl px-4 py-2.5 text-[12px] font-semibold text-white disabled:opacity-60" style={{ background: PRIMARY }}>Buat addon</button>
              </form>
              <div className="rounded-2xl p-5" style={cardStyle}>
                <FieldLabel>Addon dalam batch ini</FieldLabel>
                {itineraryAddons.length === 0 ? <p className="text-[13px]" style={{ color: '#9ca3af' }}>Belum ada itinerary addon.</p> : <div className="flex flex-wrap gap-2">{itineraryAddons.map(addon => <button key={addon.id} type="button" onClick={() => setSelectedAddonId(addon.id)} className="rounded-xl px-3 py-2 text-left text-[12px]" style={{ background: addon.id === selectedAddonId ? PRIMARY_BG : '#fafaf9', border: `1px solid ${addon.id === selectedAddonId ? PRIMARY_BORDER : 'rgba(0,0,0,0.08)'}`, color: addon.id === selectedAddonId ? PRIMARY_DEEP : '#374151' }}><span className="block font-semibold">{addon.nama}</span>{addon.deskripsi && <span className="mt-0.5 block text-[10px] opacity-75">{addon.deskripsi}</span>}</button>)}</div>}
              </div>
            </div>
            {selectedAddonId && <div className="grid gap-5 xl:grid-cols-2">
              <div className="rounded-2xl p-5" style={cardStyle}>
                <div className="flex items-center justify-between gap-3"><div><FieldLabel>Peserta addon</FieldLabel><p className="text-[12px]" style={{ color: '#6b7280' }}>{addonMembers.length} jamaah akan menerima agenda ini.</p></div><button type="button" onClick={() => void handleSaveAddonMembers()} disabled={addonSaving} className="rounded-xl px-3 py-2 text-[11px] font-semibold text-white disabled:opacity-60" style={{ background: PRIMARY }}>Simpan peserta</button></div>
                <div className="mt-4 max-h-[360px] space-y-1 overflow-y-auto pr-1">{jamaahList.map(jamaah => { const checked = addonMembers.includes(jamaah.id); return <label key={jamaah.id} className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-black/[0.02]"><input type="checkbox" checked={checked} onChange={() => setAddonMembers(current => checked ? current.filter(id => id !== jamaah.id) : [...current, jamaah.id])} className="h-4 w-4 accent-sky-500" /><span className="min-w-0"><span className="block text-[12px] font-semibold" style={{ color: '#374151' }}>{jamaah.nama}</span><span className="block text-[10px]" style={{ color: '#9ca3af' }}>{jamaah.nomor_jamaah}</span></span></label>; })}</div>
              </div>
              <div className="rounded-2xl p-5" style={cardStyle}>
                <FieldLabel>Tambah agenda addon</FieldLabel>
                <form onSubmit={handleAddAddonItem} className="space-y-3"><div className="grid grid-cols-2 gap-3"><StyledInput type="date" value={addonTanggal} onChange={e => setAddonTanggal(e.target.value)} required /><StyledInput type="time" value={addonJam} onChange={e => setAddonJam(e.target.value)} /></div><StyledInput value={addonJudul} onChange={e => setAddonJudul(e.target.value)} placeholder="Judul kegiatan" required /><StyledInput value={addonLokasi} onChange={e => setAddonLokasi(e.target.value)} placeholder="Lokasi" /><StyledTextarea rows={2} value={addonDeskripsi} onChange={e => setAddonDeskripsi(e.target.value)} placeholder="Deskripsi singkat" /><button type="submit" disabled={addonSaving} className="rounded-xl px-4 py-2.5 text-[12px] font-semibold text-white disabled:opacity-60" style={{ background: PRIMARY }}>Tambah agenda</button></form>
                <div className="mt-5 space-y-2">{addonItems.length === 0 ? <p className="text-[12px]" style={{ color: '#9ca3af' }}>Belum ada agenda khusus.</p> : addonItems.map(item => <div key={item.id} className="rounded-xl px-3 py-2.5" style={{ background: '#fafaf9' }}><p className="text-[12px] font-semibold" style={{ color: '#374151' }}>{item.tanggal} {item.jam_mulai?.slice(0, 5)} · {item.judul}</p><p className="mt-0.5 text-[10px]" style={{ color: '#9ca3af' }}>{item.lokasi ?? 'Lokasi belum diisi'}</p></div>)}</div>
              </div>
            </div>}
            {addonError && <p className="rounded-xl px-4 py-3 text-[12px]" style={{ background: 'rgba(220,38,38,0.06)', color: '#dc2626' }}>{addonError}</p>}
          </>}
        </section>
      )}

      {activeTab === 'pengumuman' && (
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <h2 className="mr-auto text-[16px] font-bold" style={{ color: '#202020', letterSpacing: '-0.02em' }}>
              Pengumuman <span className="text-[12px] font-semibold text-mute">{announcements.length}</span>
            </h2>
            {selectedKeberangkatan && (
              <button type="button" onClick={() => setAnnFormOpen(o => !o)} aria-expanded={annFormOpen}
                className="rounded-full px-3 py-1.5 text-[12px] font-semibold text-white" style={{ background: PRIMARY }}>
                {annFormOpen ? 'Tutup form' : '+ Buat'}
              </button>
            )}
          </div>


          {!selectedKeberangkatan ? (
            <div className="mb-5 rounded-xl px-4 py-3 text-[12px]" style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.2)', color: '#d97706' }}>
              Pilih batch keberangkatan untuk mengelola pengumuman.
            </div>
          ) : (
            <>
              {annFormOpen && (
              <div className="rounded-2xl p-4 mb-3" style={cardStyle}>
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
                  <button type="submit" disabled={annSubmitting}
                    className="flex items-center gap-2 px-5 py-2.5 text-[12px] font-semibold rounded-xl transition-all duration-150 disabled:opacity-60"
                    style={{ background: `linear-gradient(135deg, ${PRIMARY} 0%, ${PRIMARY_DEEP} 100%)`, color: '#ffffff', boxShadow: '0 2px 8px color-mix(in srgb, var(--color-primary) 22%, transparent)' }}>
                    {annSubmitting ? 'Mengirim...' : 'Kirim Pengumuman'}
                  </button>
                </form>
              </div>
              )}

              <div className="rounded-2xl overflow-hidden" style={cardStyle}>
                {annLoading ? (
                  <div className="py-8 text-center font-mono text-[12px]" style={{ color: '#d1d5db' }}>Memuat...</div>
                ) : announcements.length === 0 ? (
                  <div className="py-8 text-center text-[13px]" style={{ color: '#9ca3af' }}>Belum ada pengumuman.</div>
                ) : (
                  <div className="divide-y" style={{ borderColor: 'rgba(0,0,0,0.04)' }}>
                    {announcements.map(ann => (
                      <div key={ann.id} className="px-5 py-4 flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-mono text-[10px] px-2 py-0.5 rounded-full"
                              style={{ background: ann.important ? 'rgba(239,68,68,0.08)' : PRIMARY_BG, color: ann.important ? '#dc2626' : PRIMARY }}>
                              {ann.label}
                            </span>
                            <span className="font-mono text-[10px]" style={{ color: '#9ca3af' }}>{formatDatetime(ann.published_at)}</span>
                          </div>
                          <p className="text-[13px] font-semibold truncate" style={{ color: '#202020' }}>{ann.title}</p>
                          <p className="text-[12px] mt-0.5 line-clamp-2" style={{ color: '#6b7280' }}>{ann.content}</p>
                        </div>
                        <button type="button" onClick={() => handleDeleteAnnouncement(ann.id, ann.title)}
                          className="flex-none font-mono text-[11px] px-3 py-1.5 rounded-lg transition-all duration-150"
                          style={{ color: '#9ca3af', border: '1px solid rgba(0,0,0,0.07)' }}
                          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = '#dc2626'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(220,38,38,0.25)'; (e.currentTarget as HTMLButtonElement).style.background = 'rgba(220,38,38,0.05)'; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = '#9ca3af'; (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(0,0,0,0.07)'; (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}>
                          Hapus
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

    </TravelLayout>
  );
}
