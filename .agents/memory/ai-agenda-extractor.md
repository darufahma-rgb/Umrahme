---
name: AI Agenda Extractor Architecture
description: Design decisions for /api/ai-extract-agenda and /api/ai-extract-agenda/save endpoints.
---

## Endpoints

### POST /api/ai-extract-agenda
- Model: `anthropic/claude-sonnet-4-6` via OpenRouter
- Messages format: `system` role (prompt) + `user` role (data/image)
- Returns: `{ ok: true, items: AgendaItem[] }` — raw array, NOT `{ agenda: [] }`
- AbortController timeout: 60s

### POST /api/ai-extract-agenda/save
- Verifies caller via `verifyCaller()` (checks JWT + tenant_users membership)
- Additionally verifies tenant ownership via `tenants?id=eq.{tenant_id}` (using caller's JWT — RLS enforces access)
- Verifies `keberangkatan_id` belongs to `tenant_id` before insert
- Inserts via Supabase PostgREST (raw fetch), NOT supabase-js client (api-server doesn't use supabase-js)
- Returns: `{ success: true, count: number }`

## Frontend (AdminTenantForm.tsx)
- State: `agImportPreview` includes `urutan: number`
- Parse: reads `json.items` (not `json.agenda`)
- Save: calls `/api/ai-extract-agenda/save` with `{ tenant_id: id, keberangkatan_id: selectedKeberangkatan, items }`
- No longer uses `bulkInsertAgenda` from supabase lib

## Schema
Each item: `{ tanggal, jam_mulai, judul (max 60), deskripsi (REQUIRED), lokasi, urutan (sequential per day starting 1) }`

**Why `/save` is a backend endpoint (not direct Supabase from frontend):**
Centralizes server-side validation (tenant/keberangkatan ownership checks), sanitization (judul max 255, urutan >= 0), and consistent error messages. The frontend can't enforce these ownership checks securely.
