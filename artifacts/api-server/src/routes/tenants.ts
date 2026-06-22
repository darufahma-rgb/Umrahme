import { Router } from "express";
import { db } from "@workspace/db";
import {
  tenantsTable,
  agendaItemsTable,
  travelAnnouncementsTable,
  jamaahAccountsTable,
  tenantUsersTable,
  travelUsersTable,
} from "@workspace/db/schema";
import { eq, ilike, and, asc, desc } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { requireAdmin, requireTravel } from "../middlewares/auth.js";

const router = Router();

router.get("/tenants", requireAdmin, async (_req, res) => {
  const tenants = await db
    .select()
    .from(tenantsTable)
    .orderBy(desc(tenantsTable.created_at));
  res.json(tenants);
});

router.get("/tenants/:id", requireAdmin, async (req, res) => {
  const [tenant] = await db
    .select()
    .from(tenantsTable)
    .where(eq(tenantsTable.id, req.params.id));
  if (!tenant) return res.status(404).json({ error: "Tenant tidak ditemukan" });
  res.json(tenant);
});

router.post("/tenants", requireAdmin, async (req, res) => {
  const body = req.body;
  const existing = await db
    .select({ id: tenantsTable.id })
    .from(tenantsTable)
    .where(eq(tenantsTable.activation_code, body.activation_code));
  if (existing.length > 0)
    return res.status(400).json({ error: "Kode aktivasi sudah dipakai." });
  const [tenant] = await db.insert(tenantsTable).values(body).returning();
  res.json(tenant);
});

router.patch("/tenants/:id", requireAdmin, async (req, res) => {
  const [tenant] = await db
    .update(tenantsTable)
    .set(req.body)
    .where(eq(tenantsTable.id, req.params.id))
    .returning();
  if (!tenant) return res.status(404).json({ error: "Tenant tidak ditemukan" });
  res.json(tenant);
});

router.get("/tenants/:id/check-code", requireAdmin, async (req, res) => {
  const { code, excludeId } = req.query as { code: string; excludeId?: string };
  const rows = await db
    .select({ id: tenantsTable.id })
    .from(tenantsTable)
    .where(eq(tenantsTable.activation_code, code));
  const taken = rows.some((r) => r.id !== excludeId);
  res.json({ taken });
});

router.get("/tenants/:id/agenda", async (req, res) => {
  const items = await db
    .select()
    .from(agendaItemsTable)
    .where(eq(agendaItemsTable.tenant_id, req.params.id))
    .orderBy(asc(agendaItemsTable.tanggal), asc(agendaItemsTable.jam_mulai), asc(agendaItemsTable.urutan));
  res.json(items);
});

router.post("/tenants/:id/agenda", requireAdmin, async (req, res) => {
  const [item] = await db
    .insert(agendaItemsTable)
    .values({ ...req.body, tenant_id: req.params.id })
    .returning();
  res.json(item);
});

router.post("/tenants/:id/agenda/bulk", requireAdmin, async (req, res) => {
  const rows = (req.body.items as object[]).map((item) => ({
    ...(item as object),
    tenant_id: req.params.id,
  }));
  const inserted = await db.insert(agendaItemsTable).values(rows).returning();
  res.json({ inserted: inserted.length });
});

router.delete("/tenants/:id/agenda/:agendaId", requireAdmin, async (req, res) => {
  await db
    .delete(agendaItemsTable)
    .where(
      and(
        eq(agendaItemsTable.id, req.params.agendaId),
        eq(agendaItemsTable.tenant_id, req.params.id),
      ),
    );
  res.json({ ok: true });
});

router.get("/tenants/:id/announcements", async (req, res) => {
  const items = await db
    .select()
    .from(travelAnnouncementsTable)
    .where(eq(travelAnnouncementsTable.tenant_id, req.params.id))
    .orderBy(desc(travelAnnouncementsTable.published_at));
  res.json(items);
});

router.post("/tenants/:id/announcements", requireAdmin, async (req, res) => {
  const [item] = await db
    .insert(travelAnnouncementsTable)
    .values({ ...req.body, tenant_id: req.params.id })
    .returning();
  res.json(item);
});

router.delete("/tenants/:id/announcements/:annId", requireAdmin, async (req, res) => {
  await db
    .delete(travelAnnouncementsTable)
    .where(
      and(
        eq(travelAnnouncementsTable.id, req.params.annId),
        eq(travelAnnouncementsTable.tenant_id, req.params.id),
      ),
    );
  res.json({ ok: true });
});

router.get("/tenants/:id/jamaah", async (req, res) => {
  const items = await db
    .select()
    .from(jamaahAccountsTable)
    .where(eq(jamaahAccountsTable.tenant_id, req.params.id))
    .orderBy(asc(jamaahAccountsTable.nama));
  res.json(items);
});

router.post("/tenants/:id/jamaah", async (req, res) => {
  try {
    const [item] = await db
      .insert(jamaahAccountsTable)
      .values({ ...req.body, tenant_id: req.params.id })
      .returning();
    res.json(item);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("unique") || msg.includes("duplicate")) {
      return res.status(400).json({ error: `Nama "${req.body.nama}" sudah terdaftar di tenant ini.` });
    }
    res.status(500).json({ error: msg });
  }
});

router.patch("/tenants/:id/jamaah/:jamaahId", async (req, res) => {
  const [item] = await db
    .update(jamaahAccountsTable)
    .set(req.body)
    .where(
      and(
        eq(jamaahAccountsTable.id, req.params.jamaahId),
        eq(jamaahAccountsTable.tenant_id, req.params.id),
      ),
    )
    .returning();
  res.json(item);
});

router.delete("/tenants/:id/jamaah/:jamaahId", async (req, res) => {
  await db
    .delete(jamaahAccountsTable)
    .where(
      and(
        eq(jamaahAccountsTable.id, req.params.jamaahId),
        eq(jamaahAccountsTable.tenant_id, req.params.id),
      ),
    );
  res.json({ ok: true });
});

router.get("/tenants/:id/travel-accounts", requireAdmin, async (req, res) => {
  const items = await db
    .select()
    .from(tenantUsersTable)
    .where(eq(tenantUsersTable.tenant_id, req.params.id))
    .orderBy(desc(tenantUsersTable.created_at));
  res.json(items);
});

router.post("/tenants/:id/travel-accounts", requireAdmin, async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password || password.length < 8) {
    return res.status(400).json({ error: "Email dan password (min 8 karakter) wajib diisi." });
  }
  const existing = await db
    .select({ id: travelUsersTable.id })
    .from(travelUsersTable)
    .where(eq(travelUsersTable.email, email));
  if (existing.length > 0) {
    return res.status(400).json({ error: "Email sudah terdaftar." });
  }
  const password_hash = await bcrypt.hash(password, 12);
  const [travelUser] = await db
    .insert(travelUsersTable)
    .values({ email, password_hash, tenant_id: req.params.id })
    .returning();
  const [mapping] = await db
    .insert(tenantUsersTable)
    .values({ user_id: travelUser.id, tenant_id: req.params.id })
    .returning();
  res.json({ success: true, user_id: travelUser.id, email: travelUser.email, mapping_id: mapping.id });
});

router.delete("/tenants/:id/travel-accounts/:mappingId", requireAdmin, async (req, res) => {
  const [mapping] = await db
    .select()
    .from(tenantUsersTable)
    .where(eq(tenantUsersTable.id, req.params.mappingId));
  if (mapping) {
    await db.delete(tenantUsersTable).where(eq(tenantUsersTable.id, req.params.mappingId));
  }
  res.json({ ok: true });
});

router.post("/jamaah/login", async (req, res) => {
  const { kode, nama } = req.body;
  if (!kode || !nama) return res.status(400).json({ error: "Kode dan nama wajib diisi." });
  const k = kode.trim().toUpperCase();
  const n = nama.trim();

  const [tenant] = await db
    .select()
    .from(tenantsTable)
    .where(eq(tenantsTable.activation_code, k));
  if (!tenant) return res.status(404).json({ error: "Kode tidak ditemukan, hubungi travel Anda." });

  const jamaahRows = await db
    .select()
    .from(jamaahAccountsTable)
    .where(
      and(
        eq(jamaahAccountsTable.tenant_id, tenant.id),
        ilike(jamaahAccountsTable.nama, n),
      ),
    );
  const akun = jamaahRows[0];
  if (!akun) return res.status(404).json({ error: "Nama tidak ditemukan. Pastikan nama sesuai yang didaftarkan travel Anda." });

  res.json({ ok: true, jamaah: akun, tenant });
});

export default router;
