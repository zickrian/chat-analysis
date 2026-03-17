# Chat Wrapped

Private-first WhatsApp chat analyzer inspired by Spotify Wrapped.

Stack:
- Next.js App Router
- Tailwind CSS v4
- Recharts for charts
- Optional Cerebras AI integration (via env)
- No database (temporary in-memory reports only)

## Setup

1. Install dependencies:

```bash
npm install
```

2. (Optional) Enable AI insights:

```bash
cp .env.example .env.local
```

Then set:

```env
CEREBRAS_API_KEY=your_key_here
CEREBRAS_MODEL=qwen-2.5-32b-instruct
```

3. Run development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Privacy Behavior

- No database is used.
- Uploaded chat is processed per request.
- Final report is kept in temporary memory for 30 minutes.
- Raw file content is not persisted.

## Main Routes

- `/` Landing page
- `/upload` Upload + processing flow
- `/dashboard/[id]/overview`
- `/dashboard/[id]/activity`
- `/dashboard/[id]/users`
- `/dashboard/[id]/content`
- `/dashboard/[id]/topics`
- `/dashboard/[id]/insights`
- `/dashboard/[id]/wrapped`
- `/dashboard/[id]/share`
