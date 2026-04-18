# TwinMind Live Suggestions

Real-time AI meeting copilot with:
- live transcription (Groq Whisper Large V3)
- context-aware suggestions (exactly 3, non-repetitive, prioritized)
- structured chat assistant
- full session export (JSON)
- multi-candidate suggestion ranking (6 generated -> best 3 surfaced)

## Architecture

### Frontend (`frontend/`)
- React + Tailwind single-page app with a 3-column layout:
  - `TranscriptPanel`: mic capture + rolling transcript
  - `SuggestionsPanel`: 30s auto-refresh + manual refresh + suggestion cards
  - `ChatPanel`: suggestion click-to-expand and manual Q&A
- `App.jsx` orchestrates recording, chunk upload, suggestion refresh, chat calls, and export.

### Backend (`backend/`)
- FastAPI routes (all under **`/api`** in code and on Vercel; local Vite proxies `/api` → backend):
  - `POST /api/transcribe`: audio chunk -> transcript line
  - `POST /api/suggestions`: context engine + ranked topic suggestions
  - `POST /api/chat`: deep structured assistant answer
  - `GET /api/export`: transcript + suggestions + chat + summary
- Services:
  - `transcription.py`: Groq Whisper Large V3
  - `context_engine.py`: sliding recent window + rolling summary + type/stage detection
- `suggestion_engine.py`: generate 6 candidates, score by relevance/novelty/actionability, return best 3
  - `chat_engine.py`: structured response with steps, tradeoffs, examples
  - `session_store.py`: session memory (chat history + last 3 suggestion batches)

## Prompt Strategy Improvements Over Baseline

- **Context contamination fix**: model receives only recent window + compressed rolling summary.
- **Memory and novelty fix**: last 3 batches are injected as `previous_suggestions` to block repetition.
- **Aggressive filtering**: we generate multiple candidate suggestions and rank them using relevance, novelty, and actionability scoring to ensure only the highest-value suggestions are surfaced.
- **Selection over raw generation**: Instead of directly surfacing model outputs, the system generates multiple candidate interventions and selects the highest-value ones using a scoring mechanism, improving relevance and reducing redundancy.
- **Prioritization fix**: top topics are ranked and only top 1-2 are used.
- **Conversation awareness fix**: structured context includes `conversation_type`, `intent`, and `stage`.
- **Temporal intelligence fix**: `stage` steers output behavior (`problem`, `solution`, `tradeoff`).
- **Chat depth fix**: prompt enforces direct answer, contextual why, recommended approach, tradeoffs, and examples.
- **Context reset detection**: if topic similarity drops below threshold, suggestion memory is reset to prevent stale topic leakage.
- **Interrupt timing intelligence**: suggestions can trigger earlier when strong signals are detected (questions, uncertainty, or decision points), not just fixed 30s windows.

## Local Run

### 1) Backend
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
copy .env.example .env
# set GROQ_API_KEY
cd ..
uvicorn backend.main:app --reload --port 8000
```

### 2) Frontend
```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

Open `http://localhost:5173`.

## Vercel Deployment

This repo includes `vercel.json` + `api/index.py` for deployment routing.

### Deploy
1. Push this repository to GitHub.
2. Import to Vercel (leave **Root Directory** empty so `vercel.json` at repo root is used).
3. Set env var: `GROQ_API_KEY`.
4. Redeploy after config changes.

After deploy:
- Static UI is served from `/` (SPA fallback is **`/index.html`**, not `/frontend/index.html`).
- FastAPI is mounted at **`/api`** (e.g. `POST /api/suggestions`), matching the frontend default `VITE_API_URL=/api`.

If the preview is a **blank white page**, check **Build Logs** for `vite build` success, then **Runtime / Network** in the browser: `index.html` and `/assets/*.js` should return **200** (a wrong SPA fallback often yields empty or 404 HTML).

## Notes

- Auto suggestion refresh runs every 30 seconds.
- Manual refresh is available at any time.
- Export downloads full session JSON.
- Suggestion previews are kept concise and actionable.
