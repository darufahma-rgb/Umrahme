import { useState, useCallback, useRef } from 'react';
import type { JurnalEntry } from '../types';
import PageHeader from '../components/PageHeader';
import { IconBack } from '../components/icons';

// ──────────────────────────────────────────────
// Konstanta
// ──────────────────────────────────────────────
const LS_KEY = 'umrahme.jurnal';
const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MB

const LOKASI_SARAN = [
  'Masjidil Haram',
  "Ka'bah",
  'Multazam',
  'Hijr Ismail',
  'Sumur Zamzam',
  'Masjid Nabawi',
  'Raudhah',
  'Masjid Quba',
  'Jabal Nur (Gua Hira)',
  'Jabal Rahmah',
  'Jabal Uhud',
  'Mina',
  'Arafah',
  'Muzdalifah',
];

// ──────────────────────────────────────────────
// Helpers: localStorage
// ──────────────────────────────────────────────
function loadEntries(): JurnalEntry[] {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as JurnalEntry[]) : [];
  } catch {
    return [];
  }
}

function saveEntries(entries: JurnalEntry[]): void {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(entries));
  } catch {
    // storage penuh — diabaikan agar tidak crash
  }
}

// ──────────────────────────────────────────────
// Helpers: resize foto via canvas (max 800px, JPEG 0.72)
// ──────────────────────────────────────────────
function resizeImageToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (file.size > MAX_FILE_BYTES) {
      reject(new Error('Foto terlalu besar. Pilih foto di bawah 5 MB.'));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Gagal membaca file foto.'));
    reader.onload = (evt) => {
      const src = evt.target?.result as string;
      const img = new Image();
      img.onerror = () => reject(new Error('File bukan gambar yang valid.'));
      img.onload = () => {
        const MAX_DIM = 800;
        let { width, height } = img;
        if (width > MAX_DIM || height > MAX_DIM) {
          const ratio = Math.min(MAX_DIM / width, MAX_DIM / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) { reject(new Error('Canvas tidak didukung.')); return; }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.72));
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
  });
}

// ──────────────────────────────────────────────
// Helpers: format tanggal
// ──────────────────────────────────────────────
function formatTanggalPanjang(iso: string): string {
  try {
    return new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(iso + 'T00:00:00'));
  } catch {
    return iso;
  }
}

function formatTanggalPendek(iso: string): string {
  try {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(new Date(iso + 'T00:00:00'));
  } catch {
    return iso;
  }
}

// ══════════════════════════════════════════════
// Komponen: Detail overlay — baca entri penuh
// ══════════════════════════════════════════════
function EntriDetailOverlay({
  entry,
  onClose,
  onDelete,
}: {
  entry: JurnalEntry;
  onClose: () => void;
  onDelete: (id: string) => void;
}) {
  const handleDelete = () => {
    if (window.confirm('Hapus entri jurnal ini? Tindakan tidak bisa dibatalkan.')) {
      onDelete(entry.id);
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-ink-950"
      style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
    >
      {/* Sticky header */}
      <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-ink-800 bg-ink-950 px-5 py-4">
        <button
          type="button"
          onClick={onClose}
          className="flex h-9 w-9 flex-none items-center justify-center rounded-full border border-ink-800 text-mute-500 active:bg-ink-800"
          aria-label="Kembali"
        >
          <IconBack className="h-4 w-4" />
        </button>
        <span className="min-w-0 flex-1 truncate font-mono text-[10px] uppercase tracking-widest text-mute-500">
          {formatTanggalPanjang(entry.tanggal)}
        </span>
        <button
          type="button"
          onClick={handleDelete}
          className="flex-none text-[13px] text-mute-500 transition active:text-rose-400"
        >
          Hapus
        </button>
      </div>

      {/* Foto besar */}
      {entry.fotoDataUrl ? (
        <img
          src={entry.fotoDataUrl}
          alt={entry.judul ?? 'Foto jurnal'}
          className="max-h-80 w-full object-cover lg:max-h-[28rem]"
        />
      ) : null}

      {/* Konten teks */}
      <div className="mx-auto w-full max-w-2xl px-5 py-6">
        {entry.lokasi ? (
          <span className="mb-4 inline-flex items-center gap-1 rounded-full border border-gold-400/25 bg-gold-400/10 px-3 py-1 font-mono text-[11px] text-gold-400/80">
            📍 {entry.lokasi}
          </span>
        ) : null}
        {entry.judul ? (
          <h2 className="mt-1 font-display text-2xl font-semibold leading-snug text-parchment-100">
            {entry.judul}
          </h2>
        ) : null}
        <p className="mt-4 whitespace-pre-wrap text-[16px] leading-relaxed text-parchment-100/85">
          {entry.isi}
        </p>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
// Komponen: Form tulis entri baru
// ══════════════════════════════════════════════
function EntriForm({
  onSave,
  onCancel,
}: {
  onSave: (data: Omit<JurnalEntry, 'id'>) => void;
  onCancel: () => void;
}) {
  const [judul, setJudul] = useState('');
  const [isi, setIsi] = useState('');
  const [lokasi, setLokasi] = useState('');
  const [saranOpen, setSaranOpen] = useState(false);
  const [fotoDataUrl, setFotoDataUrl] = useState<string | null>(null);
  const [fotoError, setFotoError] = useState('');
  const [loadingFoto, setLoadingFoto] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const saranFiltered = LOKASI_SARAN.filter((s) =>
    s.toLowerCase().includes(lokasi.toLowerCase()),
  ).slice(0, 5);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFotoError('');
    setLoadingFoto(true);
    try {
      const url = await resizeImageToDataUrl(file);
      setFotoDataUrl(url);
    } catch (err) {
      setFotoError(err instanceof Error ? err.message : 'Gagal memproses foto.');
    } finally {
      setLoadingFoto(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleSave = () => {
    if (!isi.trim()) return;
    onSave({
      tanggal: new Date().toISOString().slice(0, 10),
      judul: judul.trim() || undefined,
      isi: isi.trim(),
      fotoDataUrl: fotoDataUrl ?? undefined,
      lokasi: lokasi.trim() || undefined,
    });
  };

  return (
    <div className="rounded-2xl border border-ink-800/70 bg-ink-900/50 p-4">
      <p className="mb-3 font-mono text-[10px] uppercase tracking-widest text-mute-500">
        Entri Baru — {formatTanggalPanjang(new Date().toISOString().slice(0, 10))}
      </p>

      {/* Judul */}
      <input
        type="text"
        value={judul}
        onChange={(e) => setJudul(e.target.value)}
        placeholder="Judul singkat (opsional)"
        className="mb-3 w-full rounded-xl border border-ink-800 bg-ink-950 px-4 py-2.5 font-display text-[15px] font-medium text-parchment-100 placeholder:font-sans placeholder:text-mute-500 focus:border-rose-600/40 focus:outline-none"
      />

      {/* Isi */}
      <textarea
        value={isi}
        onChange={(e) => setIsi(e.target.value)}
        placeholder="Ceritakan momen ini..."
        rows={5}
        className="mb-3 w-full resize-none rounded-xl border border-ink-800 bg-ink-950 px-4 py-3 text-[15px] leading-relaxed text-parchment-100 placeholder:text-mute-500 focus:border-rose-600/40 focus:outline-none"
      />

      {/* Lokasi dengan saran */}
      <div className="relative mb-3">
        <input
          type="text"
          value={lokasi}
          onChange={(e) => setLokasi(e.target.value)}
          onFocus={() => setSaranOpen(true)}
          onBlur={() => setTimeout(() => setSaranOpen(false), 150)}
          placeholder="📍 Tag lokasi (opsional)"
          className="w-full rounded-xl border border-ink-800 bg-ink-950 px-4 py-2.5 text-sm text-parchment-100 placeholder:text-mute-500 focus:border-gold-400/30 focus:outline-none"
        />
        {saranOpen && saranFiltered.length > 0 && (
          <div className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-xl border border-ink-800 bg-ink-900 py-1 shadow-xl">
            {saranFiltered.map((s) => (
              <button
                key={s}
                type="button"
                onMouseDown={() => { setLokasi(s); setSaranOpen(false); }}
                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-parchment-100/80 hover:bg-ink-800 active:bg-ink-800"
              >
                <span className="text-[11px] text-gold-400/60">📍</span>
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Foto upload */}
      <div className="mb-4">
        {fotoDataUrl ? (
          <div className="relative rounded-xl overflow-hidden">
            <img
              src={fotoDataUrl}
              alt="Preview foto"
              className="max-h-52 w-full object-cover"
            />
            <button
              type="button"
              onClick={() => setFotoDataUrl(null)}
              className="absolute right-2 top-2 rounded-full border border-ink-800 bg-ink-950/90 px-2.5 py-1 text-[11px] text-mute-500 hover:text-parchment-100"
            >
              Hapus foto
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={loadingFoto}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-ink-800/60 py-3 text-sm text-mute-500 transition hover:border-ink-700 hover:text-parchment-100/70 disabled:opacity-50"
          >
            {loadingFoto ? 'Memproses foto...' : '+ Lampirkan Foto (opsional)'}
          </button>
        )}
        {fotoError ? (
          <p className="mt-1.5 text-[12px] text-rose-400">{fotoError}</p>
        ) : null}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFile}
        />
      </div>

      {/* Aksi */}
      <div className="flex gap-2.5">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-xl border border-ink-800 py-2.5 text-sm text-mute-500 transition active:scale-[0.98]"
        >
          Batal
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={!isi.trim()}
          className="flex-1 rounded-xl bg-rose-600 py-2.5 text-sm font-semibold text-parchment-100 transition active:scale-[0.98] disabled:opacity-40"
        >
          Simpan
        </button>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════
// Halaman utama: Jurnal
// ══════════════════════════════════════════════
export default function Jurnal() {
  const [entries, setEntries] = useState<JurnalEntry[]>(() => loadEntries());
  const [mode, setMode] = useState<'linimasa' | 'gallery'>('linimasa');
  const [formOpen, setFormOpen] = useState(false);
  const [detail, setDetail] = useState<JurnalEntry | null>(null);

  const handleSave = useCallback(
    (data: Omit<JurnalEntry, 'id'>) => {
      const newEntry: JurnalEntry = { ...data, id: `jrn-${Date.now()}` };
      const updated = [newEntry, ...entries];
      setEntries(updated);
      saveEntries(updated);
      setFormOpen(false);
    },
    [entries],
  );

  const handleDelete = useCallback(
    (id: string) => {
      const updated = entries.filter((e) => e.id !== id);
      setEntries(updated);
      saveEntries(updated);
    },
    [entries],
  );

  // Sorting: terbaru di atas
  const entriesSorted = [...entries].sort(
    (a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime(),
  );
  const entriesWithPhoto = entriesSorted.filter((e) => !!e.fotoDataUrl);

  // Jika entri dipilih — tampilkan overlay penuh
  if (detail) {
    return (
      <EntriDetailOverlay
        entry={detail}
        onClose={() => setDetail(null)}
        onDelete={handleDelete}
      />
    );
  }

  return (
    <div className="pb-10">
      <PageHeader title="Jurnal" eyebrow="Profil" backTo="/profil" />

      <div className="mx-auto max-w-2xl px-5 pt-4 lg:px-8">
        {/* ── Bar atas: toggle mode + tombol tulis ── */}
        <div className="flex items-center gap-3">
          <div className="flex flex-1 rounded-xl border border-ink-800 bg-ink-950 p-1">
            {(['linimasa', 'gallery'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`flex-1 rounded-lg py-1.5 text-[13px] font-medium transition ${
                  mode === m
                    ? 'bg-ink-800 text-parchment-100'
                    : 'text-mute-500 active:bg-ink-800/40'
                }`}
              >
                {m === 'linimasa' ? 'Linimasa' : 'Gallery'}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setFormOpen((v) => !v)}
            className={`flex-none rounded-xl border px-4 py-2 text-[13px] font-medium transition active:scale-[0.97] ${
              formOpen
                ? 'border-ink-800 bg-ink-800 text-parchment-100'
                : 'border-rose-600/40 bg-rose-600/10 text-rose-400'
            }`}
          >
            {formOpen ? 'Tutup' : '+ Tulis'}
          </button>
        </div>

        {/* ── Form entri baru ── */}
        {formOpen ? (
          <div className="mt-4">
            <EntriForm onSave={handleSave} onCancel={() => setFormOpen(false)} />
          </div>
        ) : null}

        {/* ══════════ MODE LINIMASA ══════════ */}
        {mode === 'linimasa' ? (
          <div className="mt-5">
            {entriesSorted.length === 0 ? (
              /* Empty state */
              <div className="py-16 text-center">
                <p className="font-display text-3xl text-parchment-100/20">✦</p>
                <p className="mt-4 font-display text-xl font-semibold text-parchment-100/60">
                  Catat momen perjalanan Anda
                </p>
                <p className="mt-2 text-sm leading-relaxed text-mute-500">
                  Setiap tulisan dan foto akan tersimpan di sini —<br />
                  kenangan yang bisa dibaca ulang kapan saja.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {entriesSorted.map((entry) => (
                  <button
                    key={entry.id}
                    type="button"
                    onClick={() => setDetail(entry)}
                    className="block w-full overflow-hidden rounded-2xl border border-ink-800/70 bg-ink-900/50 text-left transition active:scale-[0.99] lg:hover:border-ink-800"
                  >
                    {/* Foto */}
                    {entry.fotoDataUrl ? (
                      <img
                        src={entry.fotoDataUrl}
                        alt={entry.judul ?? 'Foto jurnal'}
                        className="h-48 w-full object-cover"
                      />
                    ) : null}

                    <div className="px-4 py-4">
                      {/* Meta row */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-[10px] uppercase tracking-widest text-mute-500">
                          {formatTanggalPendek(entry.tanggal)}
                        </span>
                        {entry.lokasi ? (
                          <span className="rounded-full border border-gold-400/20 bg-gold-400/5 px-2 py-0.5 font-mono text-[9px] text-gold-400/70">
                            📍 {entry.lokasi}
                          </span>
                        ) : null}
                      </div>

                      {/* Judul — Fraunces */}
                      {entry.judul ? (
                        <p className="mt-2 font-display text-xl font-semibold leading-snug text-parchment-100">
                          {entry.judul}
                        </p>
                      ) : null}

                      {/* Cuplikan isi */}
                      <p
                        className="mt-1.5 text-sm leading-relaxed text-parchment-100/70"
                        style={{
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {entry.isi}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : null}

        {/* ══════════ MODE GALLERY ══════════ */}
        {mode === 'gallery' ? (
          <div className="mt-5">
            {entriesWithPhoto.length === 0 ? (
              /* Empty state gallery */
              <div className="py-16 text-center">
                <p className="font-display text-3xl text-parchment-100/20">✦</p>
                <p className="mt-4 font-display text-xl font-semibold text-parchment-100/60">
                  Belum ada foto
                </p>
                <p className="mt-2 text-sm leading-relaxed text-mute-500">
                  Lampirkan foto saat menulis entri —<br />
                  setiap foto akan muncul di sini sebagai galeri.
                </p>
              </div>
            ) : (
              /* Grid foto */
              <div className="grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-4">
                {entriesWithPhoto.map((entry) => (
                  <button
                    key={entry.id}
                    type="button"
                    onClick={() => setDetail(entry)}
                    className="group relative aspect-square overflow-hidden rounded-xl bg-ink-800 active:scale-[0.97] transition"
                  >
                    <img
                      src={entry.fotoDataUrl}
                      alt={entry.judul ?? 'Foto'}
                      className="h-full w-full object-cover transition group-active:brightness-75"
                    />
                    {/* Overlay tipis di hover (desktop) */}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink-950/70 to-transparent p-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <p className="truncate text-[11px] font-medium text-parchment-100">
                        {entry.judul ?? formatTanggalPendek(entry.tanggal)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
