const API_BASE = "/api";

function getAdminToken(): string | null {
  return localStorage.getItem("umrahme.admin_token");
}

function getTravelToken(): string | null {
  return localStorage.getItem("umrahme.travel_token");
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null,
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Request gagal");
  return data as T;
}

// ── Types ──────────────────────────────────────────────────────

export type TenantRow = {
  id: string;
  activation_code: string;
  nama_travel: string;
  primary_color: string;
  primary_deep_color: string;
  logo_url: string | null;
  page_title: string;
  tanggal_keberangkatan: string | null;
  tanggal_kepulangan: string | null;
  created_at: string;
  hotel_makkah: string | null;
  hotel_madinah: string | null;
  meeting_point: string | null;
  guide_name: string | null;
  guide_whatsapp: string | null;
  tour_leader_name: string | null;
  tour_leader_whatsapp: string | null;
  emergency_note: string | null;
};

export type AgendaItemRow = {
  id: string;
  tenant_id: string;
  tanggal: string;
  jam_mulai: string | null;
  judul: string;
  deskripsi: string | null;
  lokasi: string | null;
  urutan: number;
  created_at: string;
};

export type TravelAnnouncementRow = {
  id: string;
  tenant_id: string;
  label: string;
  title: string;
  content: string;
  important: boolean;
  published_at: string;
};

export type JamaahAccountRow = {
  id: string;
  tenant_id: string;
  nama: string;
  nomor_jamaah: string;
  rombongan: string | null;
  nomor_bus: string | null;
  nomor_kamar: string | null;
  fase: "persiapan" | "tanah-suci" | "selesai";
  created_at: string;
};

export type TenantUserRow = {
  id: string;
  user_id: string;
  tenant_id: string;
  created_at: string;
};

// ── Auth ──────────────────────────────────────────────────────

export async function adminLogin(email: string, password: string) {
  return request<{ token: string; email: string }>("/auth/admin/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function travelLogin(email: string, password: string) {
  return request<{ token: string; email: string; tenant: TenantRow }>("/auth/travel/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function jamaahLogin(kode: string, nama: string) {
  return request<{ ok: boolean; jamaah: JamaahAccountRow; tenant: TenantRow }>("/jamaah/login", {
    method: "POST",
    body: JSON.stringify({ kode, nama }),
  });
}

// ── Tenants ──────────────────────────────────────────────────

export async function fetchTenants() {
  return request<TenantRow[]>("/tenants", {}, getAdminToken());
}

export async function fetchTenant(id: string) {
  return request<TenantRow>(`/tenants/${id}`, {}, getAdminToken());
}

export async function createTenant(data: object) {
  return request<TenantRow>("/tenants", { method: "POST", body: JSON.stringify(data) }, getAdminToken());
}

export async function updateTenant(id: string, data: object) {
  return request<TenantRow>(`/tenants/${id}`, { method: "PATCH", body: JSON.stringify(data) }, getAdminToken());
}

export async function checkActivationCode(code: string, excludeId?: string) {
  const params = new URLSearchParams({ code, ...(excludeId ? { excludeId } : {}) });
  return request<{ taken: boolean }>(`/tenants/none/check-code?${params}`, {}, getAdminToken());
}

// ── Agenda ────────────────────────────────────────────────────

export async function fetchAgenda(tenantId: string) {
  return request<AgendaItemRow[]>(`/tenants/${tenantId}/agenda`);
}

export async function createAgenda(tenantId: string, data: object) {
  return request<AgendaItemRow>(`/tenants/${tenantId}/agenda`, {
    method: "POST",
    body: JSON.stringify(data),
  }, getAdminToken());
}

export async function bulkInsertAgenda(tenantId: string, items: object[]) {
  return request<{ inserted: number }>(`/tenants/${tenantId}/agenda/bulk`, {
    method: "POST",
    body: JSON.stringify({ items }),
  }, getAdminToken());
}

export async function deleteAgenda(tenantId: string, agendaId: string) {
  return request<{ ok: boolean }>(`/tenants/${tenantId}/agenda/${agendaId}`, {
    method: "DELETE",
  }, getAdminToken());
}

// ── Announcements ─────────────────────────────────────────────

export async function fetchAnnouncements(tenantId: string) {
  return request<TravelAnnouncementRow[]>(`/tenants/${tenantId}/announcements`);
}

export async function createAnnouncement(tenantId: string, data: object) {
  return request<TravelAnnouncementRow>(`/tenants/${tenantId}/announcements`, {
    method: "POST",
    body: JSON.stringify(data),
  }, getAdminToken());
}

export async function deleteAnnouncement(tenantId: string, annId: string) {
  return request<{ ok: boolean }>(`/tenants/${tenantId}/announcements/${annId}`, {
    method: "DELETE",
  }, getAdminToken());
}

// ── Jamaah ────────────────────────────────────────────────────

export async function fetchJamaah(tenantId: string) {
  return request<JamaahAccountRow[]>(`/tenants/${tenantId}/jamaah`);
}

export async function createJamaah(tenantId: string, data: object) {
  return request<JamaahAccountRow>(`/tenants/${tenantId}/jamaah`, {
    method: "POST",
    body: JSON.stringify(data),
  }, getTravelToken() ?? getAdminToken());
}

export async function updateJamaah(tenantId: string, jamaahId: string, data: object) {
  return request<JamaahAccountRow>(`/tenants/${tenantId}/jamaah/${jamaahId}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  }, getTravelToken() ?? getAdminToken());
}

export async function deleteJamaah(tenantId: string, jamaahId: string) {
  return request<{ ok: boolean }>(`/tenants/${tenantId}/jamaah/${jamaahId}`, {
    method: "DELETE",
  }, getTravelToken() ?? getAdminToken());
}

// ── Travel Accounts ───────────────────────────────────────────

export async function fetchTravelAccounts(tenantId: string) {
  return request<TenantUserRow[]>(`/tenants/${tenantId}/travel-accounts`, {}, getAdminToken());
}

export async function createTravelAccount(tenantId: string, email: string, password: string) {
  return request<{ success: boolean; user_id: string; email: string }>(
    `/tenants/${tenantId}/travel-accounts`,
    { method: "POST", body: JSON.stringify({ email, password }) },
    getAdminToken(),
  );
}

export async function revokeTravelAccess(tenantId: string, mappingId: string) {
  return request<{ ok: boolean }>(`/tenants/${tenantId}/travel-accounts/${mappingId}`, {
    method: "DELETE",
  }, getAdminToken());
}

// ── Logo Upload ───────────────────────────────────────────────

export async function uploadLogo(file: File): Promise<string> {
  const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';
  const filename = `logos/${crypto.randomUUID()}.${ext}`;
  const formData = new FormData();
  formData.append("logo", file, filename);
  const token = getAdminToken();
  const res = await fetch(`${API_BASE}/upload/logo`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Upload gagal");
  return data.url as string;
}
