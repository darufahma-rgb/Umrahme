import { Router } from "express";
import { db } from "@workspace/db";
import {
  adminUsersTable,
  travelUsersTable,
  tenantsTable,
} from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = Router();

const JWT_SECRET = process.env.JWT_SECRET ?? "umrahme-secret-change-in-production";
const ADMIN_EMAIL = process.env.SUPER_ADMIN_EMAIL ?? "";

router.post("/auth/admin/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email dan password wajib diisi." });

  const [admin] = await db
    .select()
    .from(adminUsersTable)
    .where(eq(adminUsersTable.email, email));

  if (!admin) {
    if (email === ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
      const match = password === process.env.ADMIN_PASSWORD;
      if (!match) return res.status(401).json({ error: "Email atau password salah." });
      const hash = await bcrypt.hash(password, 12);
      const [newAdmin] = await db
        .insert(adminUsersTable)
        .values({ email, password_hash: hash })
        .returning();
      const token = jwt.sign({ id: newAdmin.id, email: newAdmin.email, role: "admin" }, JWT_SECRET, { expiresIn: "7d" });
      return res.json({ token, email: newAdmin.email });
    }
    return res.status(401).json({ error: "Email atau password salah." });
  }

  const match = await bcrypt.compare(password, admin.password_hash);
  if (!match) return res.status(401).json({ error: "Email atau password salah." });

  const token = jwt.sign({ id: admin.id, email: admin.email, role: "admin" }, JWT_SECRET, { expiresIn: "7d" });
  res.json({ token, email: admin.email });
});

router.post("/auth/travel/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Email dan password wajib diisi." });

  const [travelUser] = await db
    .select()
    .from(travelUsersTable)
    .where(eq(travelUsersTable.email, email));

  if (!travelUser) return res.status(401).json({ error: "Email atau password salah." });

  const match = await bcrypt.compare(password, travelUser.password_hash);
  if (!match) return res.status(401).json({ error: "Email atau password salah." });

  const [tenant] = await db
    .select()
    .from(tenantsTable)
    .where(eq(tenantsTable.id, travelUser.tenant_id));

  const token = jwt.sign(
    { id: travelUser.id, email: travelUser.email, role: "travel", tenant_id: travelUser.tenant_id },
    JWT_SECRET,
    { expiresIn: "7d" },
  );
  res.json({ token, email: travelUser.email, tenant });
});

router.post("/auth/admin/setup", async (_req, res) => {
  const email = ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    return res.status(400).json({ error: "SUPER_ADMIN_EMAIL dan ADMIN_PASSWORD harus di-set." });
  }
  const existing = await db.select().from(adminUsersTable).where(eq(adminUsersTable.email, email));
  if (existing.length > 0) return res.json({ ok: true, message: "Admin sudah ada." });
  const hash = await bcrypt.hash(password, 12);
  await db.insert(adminUsersTable).values({ email, password_hash: hash });
  res.json({ ok: true, message: "Admin berhasil dibuat." });
});

export default router;
