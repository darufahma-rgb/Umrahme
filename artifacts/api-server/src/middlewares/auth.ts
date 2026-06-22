import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "umrahme-secret-change-in-production";

interface TokenPayload {
  id: string;
  email: string;
  role: "admin" | "travel";
  tenant_id?: string;
}

export function verifyToken(req: Request): TokenPayload | null {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) return null;
  try {
    return jwt.verify(auth.slice(7), JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const payload = verifyToken(req);
  if (!payload || payload.role !== "admin") {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  (req as Request & { user: TokenPayload }).user = payload;
  next();
}

export function requireTravel(req: Request, res: Response, next: NextFunction) {
  const payload = verifyToken(req);
  if (!payload || (payload.role !== "travel" && payload.role !== "admin")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  (req as Request & { user: TokenPayload }).user = payload;
  next();
}
