# JAGTAP MEDICAL

A responsive pharmacy website for human and veterinary healthcare in India. It includes allopathy, homeopathy, veterinary, Ayurveda, cosmetics, doctor consultation requests, prescription guidance, membership content, and a safety-first AI pharmacy navigator.

## Features

- Responsive Healing Teal pharmacy website with scroll animations
- Human and veterinary health categories
- Prescription upload interface for pharmacist review
- Doctor consultation page and backend request endpoint
- Jagtap Assistant: safe AI navigation for pharmacy information
- SQLite storage for chat messages and consultation requests
- Optional OpenAI integration, kept server-side

## GenAI safety boundaries

The assistant may provide store information, categories, prescription workflow information, veterinary availability, membership information, contact information, and consultation navigation.

It does **not** diagnose conditions, interpret symptoms, prescribe medicines, recommend medicine doses, or advise on drug interactions. Urgent or medicine-specific questions are routed to a licensed pharmacist, doctor, or emergency service.

## Stack

- Frontend: HTML, CSS, vanilla JavaScript
- Backend: Node.js and Express
- Local database: SQLite (`sqlite3`)
- Optional GenAI: OpenAI Node SDK

## Run locally

```bash
npm install
copy .env.example .env
npm start
```

Open [http://localhost:3000](http://localhost:3000).

The site works without an OpenAI key through the local safe FAQ assistant. To enable the optional AI response layer, add `OPENAI_API_KEY` to `.env`. Never put the key in frontend files or commit `.env`.

## API endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/store` | Store categories and hours |
| POST | `/api/chat` | Safe pharmacy-navigation chat |
| POST | `/api/consultations` | Store a consultation request |

## Database

SQLite creates `data/jagtap-medical.db` automatically. For production, use a managed PostgreSQL database such as Supabase, encrypted document storage for prescriptions, authenticated staff roles, rate limiting, and audit logs.

## Before deployment

Replace the placeholder owner name, phone number, email address, physical address, licence number, doctor profile, and store hours with verified JAGTAP MEDICAL information. Have a qualified legal/compliance professional review the final pharmacy and telemedicine workflows.
