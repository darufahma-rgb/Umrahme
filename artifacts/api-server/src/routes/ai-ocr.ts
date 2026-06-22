import { Router } from "express";

const router = Router();

router.post("/ai-ocr", async (req, res) => {
  const { imageBase64, mimeType } = req.body as {
    imageBase64?: string;
    mimeType?: string;
  };

  if (!imageBase64 || !mimeType) {
    res.status(400).json({ error: "imageBase64 dan mimeType wajib diisi." });
    return;
  }

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "OPENROUTER_API_KEY belum dikonfigurasi." });
    return;
  }

  const prompt = `Kamu adalah sistem ekstraksi data dari poster/brosur perjalanan umrah.

Analisis gambar ini dan ekstrak informasi berikut dalam format JSON.
Jika data tidak ditemukan, isi dengan null.
Jangan tambahkan penjelasan apapun, hanya kembalikan JSON murni.

Format JSON yang diharapkan:
{
  "nama_travel": string | null,
  "tanggal_keberangkatan": string | null,
  "tanggal_kepulangan": string | null,
  "hotel_makkah": string | null,
  "hotel_madinah": string | null,
  "guide_name": string | null,
  "guide_whatsapp": string | null,
  "tour_leader_name": string | null,
  "tour_leader_whatsapp": string | null,
  "meeting_point": string | null,
  "catatan": string | null
}`;

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
        model: "google/gemini-flash-1.5",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              {
                type: "image_url",
                image_url: {
                  url: `data:${mimeType};base64,${imageBase64}`,
                },
              },
            ],
          },
        ],
        max_tokens: 1000,
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
    const extracted = JSON.parse(cleaned) as Record<string, string | null>;

    res.status(200).json({ ok: true, data: extracted });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

export default router;
