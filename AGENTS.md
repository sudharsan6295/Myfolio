# Project: Personal Site

A personal blog / portfolio (About Me, Blogs, Additional Projects) built so
content updates never require touching code — see `README.md` for the full
content-authoring guide (how to add a post/project, folder structure,
frontmatter templates). This file is for working on the *code*; `README.md`
is for working on the *content*.

## Stack

- **Astro** (static site generation, TypeScript strict) — no UI framework
  (React/Vue/etc.) is installed; the site ships zero client-side JS except
  one small inline script for the blog category filter.
- **Tailwind CSS v4**, CSS-first config via `@theme` in `src/styles/global.css`
  (no `tailwind.config.js` — that's the v4 way).
- **Content**: Astro Content Collections (`src/content.config.ts`) reading
  Markdown files via the `glob` loader. Three collections: `blog`,
  `projects`, `about`. A file's slug (filename minus `.md`) becomes its
  route — enforced by `getStaticPaths()` in `src/pages/blog/[id].astro` and
  `src/pages/projects/[id].astro`.
- **Hosting**: Netlify, static build (`netlify.toml`: `npm run build` →
  `dist/`). No adapter needed since there's no SSR/API routes.

## Design system

Warm editorial "field notebook" identity — deliberately not a corporate/
LinkedIn look. Structure/layout/type is the original field-notebook system;
the palette is burgundy + brass (pulled from a later design review, in
place of the original teal + ochre); the page background is the
Glassmorphic Studio concept's gradient mesh. Tokens live in
`src/styles/global.css`'s `@theme` block:

- Colors: `paper` (#F8ECDD, used for cards/panels, not the page bg — see
  below), `paper-raised` (#F2E2CC, denser card bg), `ink` (#2B211F, text),
  `ink-soft` (#7A655F, muted text), `pen` (#5B1A22, burgundy — the accent:
  links, active states), `pen-soft` (#8A3B45, lighter burgundy for
  hovers/secondary emphasis), `highlight` (#B9975B, brass, used
  sparingly), `line` (#E4D2C0, hairline borders).
- **Page background**: `body` (not `html`, and *not* a `bg-paper` Tailwind
  class — that would override it, see the comment in `global.css`) paints
  a fixed gradient mesh from `mesh-a`/`mesh-b`/`mesh-c` (#FCE1CE peach /
  #F1DCE6 blush / #F7ECD8 warm cream — Glassmorphic Studio's stops,
  rehued to match the burgundy/brass palette instead of that concept's
  original peach/sky). `html` keeps a flat `--color-paper` background only
  as a fallback. Surfaces that already carry a translucent/semi-transparent
  background (nav's `bg-paper/90 backdrop-blur`, cards' `bg-paper-raised/50`)
  read as glass over this automatically — no `.glass` utility class or
  `backdrop-filter` was added elsewhere; keep new sections' backgrounds
  translucent (`/40`–`/70` opacity) rather than fully opaque so the mesh
  keeps showing through.
- Fonts: `font-display` = Fraunces (headings, used italic for the voice-y
  moments), `font-body` = Work Sans, `font-mono` = IBM Plex Mono (dates,
  tags, status labels — never body text).
- Signature motif: `<Stamp>` (`src/components/Stamp.astro`) — a small
  rotated ink-stamp label, mono/uppercase/bordered. Used for blog
  categories, project status (live/prototype/archived), and nowhere else —
  keep it rare, it's the one recurring visual idea on the page, not a
  general-purpose badge component.
- A fuller "Letterpress & Seal × Glassmorphic Studio" variant (full
  `.glass` translucent panels everywhere, `<Seal>` medallion instead of
  `<Stamp>`, Playfair Display/Lora/Courier Prime type, a drop-cap on
  Markdown bodies) was built and reviewed but is **not** the current
  direction — only that variant's palette and background gradient carried
  forward. Don't reintroduce `.glass`/`backdrop-filter` panels or the
  `Seal` component unless asked.

## Working on this project

- Nav labels (About Me / Blogs / Additional Projects) are defined once in
  `src/components/Nav.astro` — don't hardcode nav links elsewhere.
- Every page goes through `src/layouts/BaseLayout.astro` for `<head>`,
  the nav, and the footer.
- The blog category filter (`src/pages/blog/index.astro`) is intentionally
  client-side-only (show/hide via a `<script>`, not a query-string route) —
  this is a fully static site with no server to answer a filtered request,
  so don't reintroduce `Astro.url.searchParams` filtering there; it won't
  work once deployed (static HTML is generated once at build time, before
  any request/query string exists).
- Long-form Markdown (post/project bodies, the about bio) is styled via the
  `.prose` class in `global.css`, not Tailwind's typography plugin — that
  plugin isn't installed. Add rules there if a new Markdown element type
  needs styling.
- `astro.config.mjs`'s `site` field is a placeholder (`https://example.com`)
  — update it once there's a real domain (used for canonical URLs / any
  future RSS feed).
- Images: reference them from frontmatter (`coverImage: "./file.jpg"`
  relative to the content file) so Astro's image pipeline optimizes them at
  build time — don't put content images in `public/` and hand-write `<img>`
  src paths.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and
`astro dev logs`.

## Astro documentation

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Images](https://docs.astro.build/en/guides/images/)
