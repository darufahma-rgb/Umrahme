import { Router } from "express";

const router = Router();

router.post("/ai-extract-jamaah", async (req, res) => {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "OPENROUTER_API_KEY belum dikonfigurasi." });
    return;
  }

  const { mode, fileBase64, mimeType, rows } = req.body as {
    mode: "pdf" | "excel";
    fileBase64?: string;
    mimeType?: string;
    rows?: unknown[][];
  };

  const schema = `Format JSON yang WAJIB dikembalikan (HANYA JSON murni, tanpa markdown, tanpa penjelasan):
{
  "jamaah": [
    { "nama": string, "nomor_jamaah": string, "rombongan": string | null, "nomor_paspor": string | null }
  ]
}
Aturan:
- Ekstrak SEMUA baris jamaah yang ditemukan.
- "nama" = nama lengkap jamaah.
- "nomor_jamaah" = nomor urut/ID jamaah (jika tidak ada, beri nomor urut "001","002",...).
- "rombongan" & "nomor_paspor" = null jika tidak ada.
- Abaikan baris header, total, atau baris kosong.`;

  let messages: unknown[];

  if (mode === "pdf") {
    if (!fileBase64 || !mimeType) {
      res.status(400).json({ error: "fileBase64 & mimeType wajib untuk mode pdf." });
      return;
    }
    const prompt = `Kamu sistem ekstraksi data jamaah umrah dari dokumen (PDF/gambar manifest jamaah).\nAnalisis dokumen ini & ekstrak daftar jamaah.\n${schema}`;
    messages = [
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
          { type: "image_url", image_url: { url: `data:${mimeType};base64,${fileBase64}` } },
        ],
      },
    ];
  } else if (mode === "excel") {
    if (!rows || !Array.isArray(rows)) {
      res.status(400).json({ error: "rows wajib untuk mode excel." });
      return;
    }
    const prompt = `Kamu sistem normalisasi data jamaah umrah dari spreadsheet.\nBerikut data mentah hasil baca Excel/CSV (array baris, baris pertama kemungkinan header):\n\n${JSON.stringify(rows).slice(0, 12000)}\n\nPetakan ke struktur jamaah. Header bisa bervariasi (mis. "Nama"/"Nama Lengkap"/"NAMA", "No"/"No Jamaah"/"ID", "Rombongan"/"Grup", "Paspor"/"No Paspor"/"Passport").\n${schema}`;
    messages = [{ role: "user", content: prompt }];
  } else {
    res.status(400).json({ error: 'mode harus "pdf" atau "excel".' });
    return;
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.APP_URL ?? "https://umrahme.app",
        "X-Title": "Umrahme Admin",
      },
      body: JSON.stringify({
        model: "anthropic/claude-sonnet-4-5",
        messages,
        max_tokens: 4000,
        temperature: 0.1,
      }),
    });

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
    const extracted = JSON.parse(cleaned) as { jamaah?: unknown[] };

    res.status(200).json({ ok: true, jamaah: extracted.jamaah ?? [] });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

export default router;
