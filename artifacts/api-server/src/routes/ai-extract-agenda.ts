import { Router } from "express";
import { verifyCaller, rateLimited } from "../lib/verify-caller";

const router = Router();

const SYSTEM_PROMPT = `You are an expert at reading umrah travel itineraries and extracting structured agenda data.

Extract every activity from the itinerary as a separate agenda item.

Return ONLY a valid JSON array. No markdown, no code blocks, no explanation. Just the raw JSON array.

Each item must follow this exact structure:
{
  "tanggal": "YYYY-MM-DD",
  "jam_mulai": "HH:MM",
  "judul": "string (max 60 chars)",
  "deskripsi": "string (full detail)",
  "lokasi": "string",
  "urutan": number
}

Rules:
- tanggal: parse from day headers like "DAY 1 (Kamis, 09 Juli 2026)" → "2026-07-09"
- jam_mulai: use time if stated; estimate if not:
    Subuh/Fajr → "05:00", Syuruq → "06:30", Dzuhur/Zuhur → "12:00",
    Ashar → "15:00", Maghrib → "18:00", Isya → "19:30",
    sarapan/breakfast → "07:00", makan siang/lunch → "12:30",
    makan malam/dinner → "20:00", check-out → "12:00"
- judul: concise title, max 60 characters, taken from the activity name
- deskripsi: REQUIRED, never empty. Take verbatim or closely paraphrase the
    full explanation from the itinerary. If the itinerary has a "NOTED" section
    relevant to that activity or day, include it in the deskripsi. If no
    description exists, generate a safe, factual, contextually appropriate
    description based on the activity name and location. Example: for
    "Sholat Subuh di Masjid Nabawi" write "Melaksanakan sholat Subuh berjamaah
    di Masjid Nabawi bersama seluruh rombongan." Keep it neutral and informative.
- lokasi: extract from context — hotel name, masjid name, city. If unknown, use
    the city name of that day (Makkah, Madinah, Jakarta, etc.)
- urutan: sequential per day, starting from 1 for each new date
- Include ALL activities including meals, check-in/out, transportation, prayers,
    and sightseeing — nothing skipped`;

router.post("/ai-extract-agenda", async (req, res) => {
  try {
    const caller = await verifyCaller(req.headers.authorization);
    if (!caller.ok) {
      res.status(401).json({ error: "Unauthorized. Silakan login sebagai admin atau travel." });
      return;
    }
    if (caller.userId && rateLimited(caller.userId)) {
      res.status(429).json({ error: "Terlalu banyak permintaan. Coba lagi sebentar." });
      return;
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      res.status(500).json({ error: "OPENROUTER_API_KEY belum dikonfigurasi." });
      return;
    }

    const { mode, fileBase64, mimeType, rows } = req.body as {
      mode: "excel" | "pdf";
      fileBase64?: string;
      mimeType?: string;
      rows?: unknown[][];
    };

    let messages: unknown[];

    if (mode === "excel") {
      if (!rows || !Array.isArray(rows)) {
        res.status(400).json({ error: "rows wajib untuk mode excel." });
        return;
      }
      messages = [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: `Extract all activities from this Excel/CSV spreadsheet data:\n\n${JSON.stringify(rows).slice(0, 12000)}`,
        },
      ];
    } else if (mode === "pdf") {
      if (!fileBase64 || !mimeType) {
        res.status(400).json({ error: "fileBase64 & mimeType wajib untuk mode pdf/gambar." });
        return;
      }
      messages = [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: { url: `data:${mimeType};base64,${fileBase64}` },
            },
            {
              type: "text",
              text: "Extract all activities from this itinerary document.",
            },
          ],
        },
      ];
    } else {
      res.status(400).json({ error: 'mode harus "excel" atau "pdf".' });
      return;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60_000);

    let response: Response;
    try {
      response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": process.env.APP_URL ?? "https://umrahme.app",
          "X-Title": "Umrahme Itinerary",
        },
        body: JSON.stringify({
          model: "anthropic/claude-sonnet-4-6",
          messages,
          max_tokens: 8000,
          temperature: 0.1,
        }),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) {
      const err = await response.text();
      res.status(502).json({ error: `OpenRouter error: ${err}` });
      return;
    }

    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = data.choices?.[0]?.message?.content ?? "";
    const cleaned = content.replace(/```json|```/g, "").trim();

    let items: unknown[];
    try {
      const parsed = JSON.parse(cleaned);
      if (!Array.isArray(parsed)) throw new Error("Not an array");
      items = parsed;
    } catch {
      res.status(500).json({ error: "AI gagal menghasilkan format yang valid. Coba lagi." });
      return;
    }

    res.status(200).json({ ok: true, items });
  } catch (err) {
    const message =
      err instanceof Error && err.name === "AbortError"
        ? "Request ke AI timeout setelah 60 detik. Coba file yang lebih kecil."
        : String(err);
    res.status(500).json({ error: message });
  }
});

router.post("/save", async (req, res) => {
  try {
    const caller = await verifyCaller(req.headers.authorization);
    if (!caller.ok || !caller.userId) {
      res.status(401).json({ error: "Unauthorized. Silakan login sebagai admin atau travel." });
      return;
    }

    const { tenant_id, keberangkatan_id, items } = req.body as {
      tenant_id?: string;
      keberangkatan_id?: string;
      items?: unknown[];
    };

    if (!tenant_id || !keberangkatan_id || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({ error: "Data tidak lengkap." });
      return;
    }

    const supabaseUrl = process.env.SUPABASE_URL;
    const anonKey = process.env.SUPABASE_ANON_KEY;
    if (!supabaseUrl || !anonKey) {
      res.status(500).json({ error: "Konfigurasi database tidak ditemukan." });
      return;
    }

    const token = (req.headers.authorization ?? "").replace("Bearer ", "");

    // Verify caller owns this tenant
    const ownerCheck = await fetch(
      `${supabaseUrl}/rest/v1/tenants?id=eq.${tenant_id}&select=id`,
      { headers: { apikey: anonKey, Authorization: `Bearer ${token}` } },
    );
    if (!ownerCheck.ok) {
      res.status(403).json({ error: "Akses ditolak." });
      return;
    }
    const tenantRows = (await ownerCheck.json()) as unknown[];
    if (!Array.isArray(tenantRows) || tenantRows.length === 0) {
      res.status(403).json({ error: "Tenant tidak ditemukan atau akses ditolak." });
      return;
    }

    // Verify keberangkatan belongs to this tenant
    const kbCheck = await fetch(
      `${supabaseUrl}/rest/v1/keberangkatan?id=eq.${keberangkatan_id}&tenant_id=eq.${tenant_id}&select=id`,
      { headers: { apikey: anonKey, Authorization: `Bearer ${token}` } },
    );
    if (!kbCheck.ok) {
      res.status(403).json({ error: "Akses ditolak untuk keberangkatan ini." });
      return;
    }
    const kbRows = (await kbCheck.json()) as unknown[];
    if (!Array.isArray(kbRows) || kbRows.length === 0) {
      res.status(403).json({ error: "Keberangkatan tidak ditemukan atau bukan milik tenant ini." });
      return;
    }

    // Validate and map items
    const invalid = (items as any[]).some(
      (item) => !item.tanggal || !String(item.tanggal).trim() || !item.judul || !String(item.judul).trim(),
    );
    if (invalid) {
      res.status(400).json({ error: "Setiap item agenda wajib memiliki tanggal dan judul." });
      return;
    }

    const rows = (items as any[]).map((item) => ({
      tenant_id,
      keberangkatan_id,
      tanggal: String(item.tanggal).trim(),
      jam_mulai: item.jam_mulai ? String(item.jam_mulai).trim() : null,
      judul: String(item.judul).trim().slice(0, 255),
      deskripsi: item.deskripsi ? String(item.deskripsi).trim() : null,
      lokasi: item.lokasi ? String(item.lokasi).trim() : null,
      urutan: typeof item.urutan === "number" && item.urutan >= 0 ? Math.floor(item.urutan) : 0,
    }));

    const insertResp = await fetch(`${supabaseUrl}/rest/v1/agenda_items`, {
      method: "POST",
      headers: {
        apikey: anonKey,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(rows),
    });

    if (!insertResp.ok) {
      const errText = await insertResp.text();
      let friendlyErr = "Gagal menyimpan ke database.";
      try {
        const parsed = JSON.parse(errText);
        if (parsed?.message) friendlyErr = parsed.message;
      } catch { /* ignore */ }
      res.status(502).json({ error: friendlyErr });
      return;
    }

    res.json({ success: true, count: rows.length });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Gagal menyimpan agenda." });
  }
});

export default router;
