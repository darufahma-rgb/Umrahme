const rlMap: Map<string, number[]> = (globalThis as unknown as Record<string, unknown>).__rl as Map<string, number[]>
  ?? ((globalThis as unknown as Record<string, unknown>).__rl = new Map<string, number[]>());

function rateLimited(userId: string, max = 20, windowMs = 60_000): boolean {
  const now = Date.now();
  const arr = (rlMap.get(userId) ?? []).filter((t: number) => now - t < windowMs);
  arr.push(now);
  rlMap.set(userId, arr);
  return arr.length > max;
}

export async function verifyCaller(
  authorizationHeader: string | undefined,
): Promise<{ ok: boolean; userId?: string }> {
  const token = authorizationHeader?.startsWith('Bearer ')
    ? authorizationHeader.slice(7)
    : '';
  if (!token) return { ok: false };

  const supabaseUrl = process.env.SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY;
  if (!supabaseUrl || !anonKey) return { ok: false };

  const userResp = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: { apikey: anonKey, Authorization: `Bearer ${token}` },
  });
  if (!userResp.ok) return { ok: false };
  const user = (await userResp.json()) as { id?: string };
  if (!user?.id) return { ok: false };

  const adminResp = await fetch(
    `${supabaseUrl}/rest/v1/app_admins?user_id=eq.${user.id}&select=user_id`,
    { headers: { apikey: anonKey, Authorization: `Bearer ${token}` } },
  );
  if (adminResp.ok) {
    const rows = (await adminResp.json()) as unknown[];
    if (Array.isArray(rows) && rows.length > 0) return { ok: true, userId: user.id };
  }

  const travelResp = await fetch(
    `${supabaseUrl}/rest/v1/tenant_users?user_id=eq.${user.id}&select=user_id`,
    { headers: { apikey: anonKey, Authorization: `Bearer ${token}` } },
  );
  if (travelResp.ok) {
    const rows = (await travelResp.json()) as unknown[];
    if (Array.isArray(rows) && rows.length > 0) return { ok: true, userId: user.id };
  }

  return { ok: false };
}

export { rateLimited };
