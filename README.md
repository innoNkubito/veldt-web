# Veldt Web

Tour planner platform for building beautiful itineraries for clients.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI:** MUI 9 + Emotion (custom warm/earthy theme)
- **Auth:** Clerk
- **API:** Apollo Client + GraphQL
- **Forms:** React Hook Form + Zod
- **Drag & Drop:** dnd-kit

## Getting Started

### Prerequisites

- Node.js 20+
- A running GraphQL API (default: `http://localhost:4000/graphql`)

### Setup

```bash
# Install dependencies
npm install

# Copy environment variables and fill in your keys
cp .env.example .env.local

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `CLERK_SECRET_KEY` | Clerk secret key |
| `NEXT_PUBLIC_API_URL` | GraphQL API endpoint |

See `.env.example` for the full list.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
