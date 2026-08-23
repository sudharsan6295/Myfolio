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

"Letterpress, seen through glass" — a hybrid of a warm manuscript/stationery
identity and soft glassmorphism, deliberately not a corporate/LinkedIn look.
Tokens live in `src/styles/global.css`'s `@theme` block:

- Colors: `mesh-a`/`mesh-b`/`mesh-c` (#FCE1CE peach / #F1DCE6 blush /
  #F7ECD8 warm cream — the fixed gradient mesh painted on `body`, see
  below), `paper` (#FBF8F3, the frosted-glass panel base color, *not* a
  flat page background), `paper-raised` (denser panel fill), `ink`
  (#2B211F, warm charcoal text), `ink-soft` (muted text), `pen` (#5B1A22,
  burgundy — the one accent: links, active states, headings), `pen-soft`
  (lighter burgundy, hovers), `highlight` (#B9975B, brass — seal rims,
  metallic accents, used sparingly), `line` (soft warm hairline border).
- Fonts: `font-display` = Playfair Display (headings, used italic —
  the "letterpress" half), `font-body` = Lora (a warm literary serif, not
  a sans — reads like a printed letter), `font-mono` = Courier Prime (a
  typewriter face for dates/tags/status labels — deliberately not a
  coder's monospace, fits the stationery half of the identity).
- **The gradient mesh + glass panels are the layout mechanic, not
  decoration.** `body` paints a fixed radial/linear gradient mesh (the
  "glass" half); every surface above it — nav, footer, cards, section
  panels — is a `.glass` panel (`src/styles/global.css`): translucent
  `color-mix()` background, `backdrop-filter: blur(18px) saturate(135%)`,
  a soft light border, a soft shadow. Never give a section a flat opaque
  background — it should float over the mesh, not hide it. New sections
  should get `class="glass rounded-3xl p-8"` (or similar), not a plain
  Tailwind background color.
- Signature motif: `<Seal>` (`src/components/Seal.astro`) — a small
  frosted-glass circular medallion (a modern "wax seal") showing the
  label's first letter, next to a mono uppercase caption. Used for blog
  categories and project status (live/prototype/archived), and nowhere
  else — keep it rare, it's the one recurring visual idea on the page.
  There is no `Stamp.astro` any more; `Seal` fully replaced it.
- Long-form Markdown bodies (post/project content, the about bio) get a
  drop-cap on their first paragraph via `.prose > p:first-of-type::first-letter`
  in `global.css` — part of the letterpress/manuscript feel, don't remove
  it when touching `.prose`.

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
