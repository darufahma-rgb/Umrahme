import { Router } from "express";
import { verifyCaller, rateLimited } from "../lib/verify-caller";

const router = Router();

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

    const schema = `Format JSON WAJIB (HANYA JSON murni, tanpa markdown, tanpa penjelasan):
{
  "agenda": [
    { "tanggal": "YYYY-MM-DD", "jam_mulai": "HH:MM" | null, "judul": string, "lokasi": string | null, "deskripsi": string | null }
  ]
}
Aturan:
- Ekstrak SEMUA item jadwal/itinerary yang ditemukan, urut kronologis.
- "tanggal" WAJIB format YYYY-MM-DD. Kalau hanya ada hari/urutan (mis. "Hari 1"), perkirakan tanggal relatif jika ada tanggal mulai; kalau tidak ada, gunakan format "2025-01-01", "2025-01-02" dst dan beri catatan di deskripsi.
- "jam_mulai" format 24 jam HH:MM, null kalau tidak ada.
- Abaikan baris kosong/header/footer.`;

    let messages: unknown[];

    if (mode === "excel") {
      if (!rows || !Array.isArray(rows)) {
        res.status(400).json({ error: "rows wajib untuk mode excel." });
        return;
      }
      const prompt = `Kamu sistem penyusun itinerary umrah dari spreadsheet.\nData mentah Excel/CSV (array baris):\n\n${JSON.stringify(rows).slice(0, 12000)}\n\nPetakan ke daftar agenda.\n${schema}`;
      messages = [{ role: "user", content: prompt }];
    } else if (mode === "pdf") {
      if (!fileBase64 || !mimeType) {
        res.status(400).json({ error: "fileBase64 & mimeType wajib untuk mode pdf/gambar." });
        return;
      }
      messages = [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Kamu sistem penyusun itinerary umrah. Baca dokumen jadwal ini (PDF/foto/gambar) & ekstrak itinerary.\n${schema}`,
            },
            {
              type: "image_url",
              image_url: { url: `data:${mimeType};base64,${fileBase64}` },
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
          max_tokens: 4000,
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
    const extracted = JSON.parse(cleaned) as { agenda?: unknown[] };

    res.status(200).json({ ok: true, agenda: extracted.agenda ?? [] });
  } catch (err) {
    const message = err instanceof Error && err.name === "AbortError"
      ? "Request ke AI timeout setelah 60 detik. Coba file yang lebih kecil."
      : String(err);
    res.status(500).json({ error: message });
  }
});

export default router;
