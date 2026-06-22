export async function verifyAdminToken(): Promise<{ valid: boolean; email?: string }> {
  const token = localStorage.getItem('umrahme.admin_token');
  if (!token) return { valid: false };
  try {
    const res = await fetch('/api/auth/admin/verify', {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return { valid: false };
    const data = await res.json() as { valid: boolean; email: string };
    return { valid: true, email: data.email };
  } catch {
    return { valid: false };
  }
}
