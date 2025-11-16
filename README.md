# Full-Stack Flashcard Generator

## Overview

Small full-stack app: user provides a topic → backend uses an LLM (OpenAI) to generate 15 flashcards (5 easy, 5 medium, 5 hard) → frontend displays them one-by-one.

## Repo structure

/backend
/frontend
README.md

---

## Setup (backend)

1. `cd backend`
2. `cp .env.example .env` and add your `OPENAI_API_KEY`
3. `npm install`
4. `npm run dev` (or `npm start`)

Default backend port: `4000`

.env variables:

```
PORT=4000
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-3.5-turbo
MAX_RETRIES=2
```

If you don't set `OPENAI_API_KEY`, the backend will use a local fallback generator.

### API

POST `/generate-flashcards`

- Body: `{ "topic": "Photosynthesis" }`
- Response: `{ "flashcards": [ { question, answer, difficulty }, ... ] }`

Example curl:

```bash
curl -X POST http://localhost:4000/generate-flashcards \
  -H "Content-Type: application/json" \
  -d '{"topic":"Photosynthesis"}'
```

## Setup (frontend)

1. `cd frontend`
2. `npm install`
3. Optionally set backend URL:
   - Create `.env` with `VITE_BACKEND_URL=http://localhost:4000`
4. `npm run dev`
5. Open http://localhost:5173 (or URL shown by Vite)

## Notes & fallback behavior

- Backend tries the LLM up to `MAX_RETRIES` times to return a valid JSON array of 15 flashcards.
- If LLM output is malformed or API unavailable, backend returns a local fallback and adds a warning field.
- Frontend expects exactly 15 cards but will handle other lengths gracefully.

## Optional improvements (bonus)

- Add authentication or usage limits.
- Improve prompt engineering to get more pedagogical questions/answers.
- Add save/export (PDF, CSV) of flashcards.

---

## How to run locally (short)

1. Start backend:
   - `cd backend`
   - `npm install`
   - copy `.env.example` → `.env`, add `OPENAI_API_KEY`
   - `npm run dev`

2. Start frontend:
   - `cd frontend`
   - `npm install`
   - `npm run dev`

3. Open the Vite URL shown (usually `http://localhost:5173`).

---

## Testing & Example

- Use topic "Photosynthesis" or "JavaScript closures".
- Backend returns `flashcards` JSON. Frontend shows "Card X of 15", Next/Prev, disabled correctly.

---

## Security / tips

- Never commit your OpenAI API key.
- If you want to demo without a key, omit it in `.env` and the backend will return fallback sample cards.

