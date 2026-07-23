# Maison Noir

A quiet-luxury fashion e-commerce frontend. React 19 + Vite + TypeScript + Tailwind CSS 4 + Framer Motion.

## What's here

Homepage, Shop (with filters), Collections, Product detail, Lookbook, Stories (editorial), About, Wishlist, and a cart with `localStorage` persistence. All product/collection data is local mock data in `src/lib/constants.ts` — there is no backend yet.

**Not yet built:** checkout, payments, customer accounts/auth, order tracking, admin dashboard, a real Privacy Policy / Returns page. The "Privacy Policy" footer link currently points at `/about` as a placeholder.

## Run locally

```bash
npm install
npm run dev
```

Opens on `http://localhost:5173`.

## Build

```bash
npm run build
```

Typechecks (`tsc -b`) then builds to `dist/`. Preview the production build with `npm run preview`.

## Deploy to Vercel

1. Push this folder to a GitHub repo (it must be the repo root — don't nest it inside another folder, or set the Vercel project's Root Directory to wherever it lives).
2. In Vercel: **New Project → Import** this repo.
3. Framework preset: **Vite** (should auto-detect from `vercel.json` / `package.json` either way).
4. No environment variables are required for this version.
5. Deploy.

`vercel.json` already handles SPA routing (so refreshing on `/shop` or `/products/:slug` doesn't 404) and long-term caching for hashed asset files.

## Editing product data

Everything customer-facing — products, collections, prices, sizes, colors — lives in `src/lib/constants.ts`. Product images are referenced by filename from `public/` (e.g. `/product-1.jpg`); drop a new image into `public/` and point a product at it to swap it in.

## Stack notes

- Routing: `wouter` (not React Router)
- Data fetching: `@tanstack/react-query` is wired up but currently has nothing to fetch — there's no API yet
- UI primitives: shadcn/ui (Radix + Tailwind), in `src/components/ui/`
- State: React Context for cart (`src/context/CartContext.tsx`) and wishlist (`src/context/WishlistContext.tsx`), both persisted to `localStorage`
