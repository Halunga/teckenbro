# TeckenBro

TeckenBro is a beginner-friendly Next.js app that turns spoken or written Swedish/English into a Swedish Sign Language learning output.

It currently uses a small local mock sign database and rule-based API route. The output is designed for learning and prototyping, not live interpretation.

## Features

- Home page with Swedish/English text input.
- Microphone button using the browser Web Speech API.
- App Router API route at `/api/translate`.
- Results page with original text, simplified Swedish, sign sequence, sign cards, missing signs, and confidence warnings.
- Local sign database in `data/signs.json`.
- Three.js `AvatarPanel` placeholder for future animated signing.
- Tailwind CSS styling.
- Vercel-ready project structure.
- Supabase-ready environment placeholders for future database work.

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

The Web Speech API works best in Chromium-based browsers. Browser support varies, so users can always type text manually.

## GitHub Setup

```bash
git init
git add .
git commit -m "Create TeckenBro app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/teckenbro.git
git push -u origin main
```

## Vercel Deployment

1. Push the repository to GitHub.
2. In Vercel, choose **Add New Project**.
3. Import the GitHub repository.
4. Keep the default Next.js settings.
5. Add environment variables later if Supabase is connected.
6. Deploy.

## Supabase Future Database Plan

The app currently reads signs from `data/signs.json`. A future Supabase-backed version can move that data into a `signs` table:

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `text` | Stable sign identifier |
| `swedish_word` | `text` | Swedish lookup word |
| `gloss` | `text` | Sign-friendly gloss label |
| `description` | `text` | Human-readable learning note |
| `video_url` | `text` | Verified sign video URL |
| `animation_key` | `text` | Avatar animation reference |

Suggested next steps:

- Add `@supabase/supabase-js`.
- Create a typed Supabase client using `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- Replace local JSON lookup in `lib/signs.ts` with a database query.
- Add review metadata, such as signer approval status and source notes.

## Ethical Note

This is a learning aid, not a certified interpreter. Swedish Sign Language is a natural language with its own grammar, regional variation, and Deaf cultural context. Involve native Swedish Sign Language users before public launch, especially before adding videos, avatar animation, or confidence claims.
