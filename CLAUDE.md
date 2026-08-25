# Project: Personal Site

A personal blog / portfolio (About Me, Blogs, Workbench) built so
content updates never require touching code — see `README.md` for the full
content-authoring guide (how to add a post/project, folder structure,
frontmatter templates). This file is for working on the *code*; `README.md`
is for working on the *content*.

## Stack

- **Astro** (static site generation, TypeScript strict) — no UI framework
  (React/Vue/etc.) is installed. Client-side JS is a handful of small
  inline `<script>` blocks (blog category filter, subscribe form, nav
  theme toggle/Connect dropdown/photo lightbox) — no bundler-shipped
  framework runtime.
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

Warm editorial "field notebook" identity, in full Glassmorphic Studio
layout: type is the original field-notebook system (Newsreader/Work
Sans/IBM Plex Mono) and the signature motif is `<Stamp>` (not `<Seal>`),
but every surface — nav, footer, hero, section wrappers, and every card —
is a frosted `.glass` panel floating over a fixed gradient-mesh
background, in the burgundy + brass palette. Tokens live in
`src/styles/global.css`'s `@theme` block:

- Colors: `paper` (#F8ECDD), `paper-raised` (#F2E2CC, denser panel fill),
  `ink` (#2B211F, text), `ink-soft` (#7A655F, muted text), `pen`
  (#5B1A22, burgundy — the accent: links, active states), `pen-soft`
  (#8A3B45, lighter burgundy for hovers), `highlight` (#B9975B, brass,
  used sparingly), `line` (#E4D2C0, hairline borders used *inside* glass
  panels, e.g. under a card's metadata row).
- **Dark mode**: every one of the color tokens above is redefined (same
  names, dark values) rather than the markup using Tailwind `dark:`
  variants anywhere — Tailwind utilities like `bg-paper` compile to
  `background: var(--color-paper)`, so redefining the variable is enough
  to retheme the whole site. **Any new color must go through one of
  these existing tokens (or a new token added in both places) — a raw
  hex/rgb value in a class or inline style will not respond to the
  toggle.** The three-state pattern (see `global.css`): bare `:root` =
  light (the values above); `@media (prefers-color-scheme: dark)`
  guarded by `:root:not([data-theme="light"])` = follow the OS unless
  the user explicitly chose light; `:root[data-theme="dark"]` = explicit
  dark choice, wins regardless of OS. The toggle button
  (`#theme-toggle` in `Nav.astro`) just sets/clears `data-theme` on
  `<html>` and persists it to `localStorage`; a pre-paint `is:inline`
  script in `BaseLayout.astro`'s `<head>` applies the saved choice
  before first render, to avoid a flash of the wrong theme.
- **Page background**: `body` (not `html`, and *not* a `bg-paper`
  Tailwind class — that would override it, see the comment in
  `global.css`) paints a fixed gradient mesh from `mesh-a`/`mesh-b`/`mesh-c`
  (#FCE1CE peach / #F1DCE6 blush / #F7ECD8 warm cream). `html` keeps a
  flat `--color-paper` background only as a fallback.
- **`.glass` is the standard surface treatment now** (`global.css`):
  `color-mix()` translucent background, `backdrop-filter: blur(18px)
  saturate(135%)`, a soft light border, a soft shadow. Nav, footer,
  `PostCard`, `ProjectCard`, and every page-section wrapper (hero panels,
  the About bio/experience panels, blog/project intro blocks, article
  bodies) use `class="glass rounded-2xl"` / `rounded-3xl` rather than a
  flat `bg-paper-raised` + `border-line` combo. **When adding a new
  section, wrap it in `.glass`, not a plain bordered box** — an opaque
  flat background on a new section would look like a mistake against
  everything else on the page.
- Fonts: `font-display` = Newsreader (headings, used italic for the voice-y
  moments), `font-body` = Work Sans, `font-mono` = IBM Plex Mono (dates,
  tags, status labels — never body text).
- Signature motifs: `<Stamp>` (`src/components/Stamp.astro`) — a small
  rotated ink-stamp label, mono/uppercase/bordered, for blog categories
  and project status. `<Seal>` (`src/components/Seal.astro`) — a small
  circular engraved-monogram SVG ("SB"), added later to finish the
  site's originally-chosen concept ("Letterpress & Seal" — only the
  letterpress/Stamp half had been built). Kept deliberately rare, same
  "don't scatter it" rule Stamp documents for itself: it appears in
  exactly two places — the About page's intro panel (`hidden sm:block`,
  the site's signature) and marking the one entry flagged
  `featured: true` on `/blog` (bigger spotlight card, via `PostCard`'s
  `featured` prop) and `/projects` (small inline mark next to the date,
  via `ProjectCard`). It's `aria-hidden` — always pair it with its own
  visible or `sr-only` label at the call site (e.g. the `sr-only`
  "Featured" span already next to every usage) rather than relying on
  the Seal's own accessible name.
- **Tags/chips use `rounded-[3px]`, not `rounded-full`** — the About
  page's focus-area/tools/certifications chips were originally pill-
  shaped and were deliberately changed to match `<Stamp>`'s square-ish
  corner radius (no circular edges is a stated preference). Any new
  tag/chip UI should follow `rounded-[3px]`, not reach for a pill.
- Nav avatar: `about.photo` (optional, `src/content.config.ts`) shows a
  small circular image next to the name in the top nav
  (`src/components/Nav.astro`). Circular is correct here — the "no
  circular edges" preference above is specifically about the tag/chip
  components, not avatars. Without a photo, the avatar is a plain link
  home showing initials computed from `about.name`; **with** a photo, the
  avatar becomes a `<button>` (not a link) that opens the photo full-size
  in a lightbox (click backdrop/✕/Escape to close) — the name text next
  to it is a separate `<a href="/">` and still goes home either way. The
  name itself is hidden below the `sm` breakpoint (avatar only) — with
  Connect added to the nav, there isn't room for the full name on a
  narrow screen too.
- Nav Connect (renamed from "Contact"): a `<details>`/`<summary>`
  dropdown (no client framework needed) showing email, LinkedIn, and
  GitHub (whichever of `about.email`/`about.social.*` are set),
  rendered as a sibling of the page links' `<ul>`, not inside it — that
  `<ul>` is `overflow-x-auto` (a mobile-width safety net for the 3 page
  links), and an overflow-auto ancestor clips an absolutely-positioned
  popover, so Connect has to sit outside it. A small inline `<script>`
  in Nav.astro closes it on outside-click/Escape, since `<details>` has
  no built-in dismissal.
- GitHub (`about.social.github`) is read in four places — Nav's Connect
  panel, `Footer.astro`, `/about`'s "At a glance" aside, and a "More on
  GitHub →" link on `/projects` — all gated on the same field, so
  setting it once in `about.md` turns all four on together (now set, to
  `https://github.com/sudharsan6295`).
- The nav/lightbox photo is `src/content/about/photo.png` — the full,
  uncropped portrait exactly as supplied (an earlier pass cropped it to
  a tight head-and-shoulders frame; that was explicitly undone per
  feedback — "use the photo without editing"). The one edit that's kept
  is watermark removal: the original had a "Made with AI" badge in one
  corner, painted over with a solid rectangle matching the uniform
  background color (a one-off `sharp` script, not a standing tool — no
  image-editing dependency was added to the project). Kept as a lossless
  PNG on purpose, not converted to JPEG, per the same "don't edit beyond
  what was asked" feedback.
- **Gotcha, already hit once:** `astro:assets`'s `<Image>` crops to fill
  when given `width` + `height` that don't match the source's aspect
  ratio (a real server-side crop of the output file, not something CSS
  `object-contain` can undo afterward). The lightbox `<Image>` in
  Nav.astro learned this the hard way — `width={800} height={800}` on a
  1024×1536 portrait source silently cropped off the top of the head in
  the "enlarged" view. Fixed by passing only `width` (Astro infers
  `height` from the image's own intrinsic ratio for local/content-
  collection images) — do the same for any new `<Image>` usage where the
  source's exact aspect ratio isn't known/guaranteed up front.
- Blog category checkboxes (the subscribe form's per-category opt-in,
  `src/pages/blog/index.astro`) toggle their checked-state chip style
  via JS `classList`, not a CSS `peer-checked:` variant — a
  `peer-checked:border-pen` utility was tried first and the selector
  provably matched (`element.matches(...)` returned true) but still
  lost the cascade to the base `border-line` class in that nested
  component context, for reasons that didn't reproduce in isolation.
  Don't reintroduce a `peer`/`peer-checked` pattern for this without
  re-verifying it actually paints correctly, not just that the selector
  matches.
- **`--color-highlight` (light mode) was fixed for contrast** — the
  original `#b9975b` measured only 2.2–2.4:1 against `paper`/
  `paper-raised` (fails WCAG AA even for large text), found while
  auditing the About page's certifications chips (`text-highlight` at
  0.65rem). Deepened to `#7d6230` (4.5–4.9:1 on both surfaces), same
  brass family, dark mode untouched (it was already 7.5–8.4:1). If this
  token is ever adjusted again, check contrast against both `paper` and
  `paper-raised` first — computed via the standard WCAG relative-
  luminance formula, not eyeballed — since it's shared by borders,
  fills, *and* text (certifications chips, the Education card's middot,
  Stamp's `highlight` tone) and a change to one changes all of them.
- **"Featured" (`featured: true` on `blog`/`projects` content
  frontmatter) is now surfaced** — the schema already had this field,
  nothing in the UI read it until this pass. Now: `/blog` shows the newest post flagged
  featured (falls back to the newest post overall if none is flagged)
  as a bigger spotlight card above the filter/list — it still appears
  again in its normal chronological spot in the list below too, that's
  deliberate, not a duplicate-content bug. `/projects`' `ProjectCard`
  shows a small `<Seal>` next to the date for any featured project
  instead of resizing the card (the list is small — 3 entries as of
  this pass — so a full spotlight card would feel disproportionate;
  revisit if the list grows).
- **Ledger spine**: the post lists on `/` (Field Notes preview) and
  `/blog` (the full list) get a `border-l-2 border-line pl-5 sm:pl-6`
  on their wrapping `<div>` — a literal connecting rule down the
  margin, reinforcing the "ledger/notebook" identity for what's
  already a vertical list of numbered entries. Deliberately *not*
  applied to the Workbench grids (`/projects`, and the homepage's
  Workbench preview) — a multi-column card grid doesn't read as a
  single sequential ledger the way a stacked list does, so forcing the
  same motif there would look like a mistake, not a fit.
- **Blog posts get a drop cap**; About/project write-ups don't. The
  `.prose--dropcap` modifier class (only added in `blog/[id].astro`'s
  Content wrapper) styles `> p:first-of-type::first-letter` — scoped
  this way rather than putting it on bare `.prose` because an oversized
  first letter looked wrong on the About bio's much shorter paragraphs
  when tried there. A float-based drop cap, not CSS `initial-letter`
  (inconsistent browser support), consistent with this file's existing
  "don't lean on a single bleeding-edge CSS property alone" stance.
- **Reading-progress bar** (`blog/[id].astro` only): a 3px fixed bar,
  width driven by `window.scrollY / (document.documentElement.
  scrollHeight - innerHeight)` on scroll/resize — whole-document scroll
  fraction, not a precise article-bounds measurement, since the
  article fills essentially the whole page on this route anyway.
- **Prev/next navigation** (`blog/[id].astro`): re-fetches and re-sorts
  `getCollection("blog")` the same way `/blog` does (newest-first),
  finds the current post's index, and links the neighbors — labeled
  "← Older entry" / "Newer entry →" by actual title, not ambiguous
  "prev"/"next" wording, since "prev" is genuinely ambiguous between
  reading order and chronological order here.
- **Workbench status filter** (`/projects`): same client-side-only
  `data-filter`/`data-status` pattern as the blog category filter
  (see the note on `blog/index.astro` below) — All/Live/Prototype/
  Archived, counts shown even at zero for consistency with how the
  blog filter already does it.
- **Skip-to-content link**: first focusable element in
  `BaseLayout.astro` (`.skip-link` in `global.css`, off-screen via
  `top: -100px` until `:focus` brings it to `top: 1rem`), landing on
  `<main id="main-content">`.

## Working on this project

- Nav labels (About Me / Blogs / Workbench) are defined once in
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
- **Bottom spacing before the footer comes from `Footer.astro`'s own
  `mt-10` only.** Page-level containers use `pb-8`, not `pb-24` — an
  earlier version had both, which stacked into a large empty gap above
  the footer (later tightened further from `mt-24` to `mt-10` after
  feedback that pages still felt too spaced out). Don't add a large
  `pb-*` to a page's outer container; a little breathing room (`pb-8` or
  less) is fine, the footer's own margin does the real spacing. Page top
  padding is `pt-10 sm:pt-14` (tightened from `pt-14 sm:pt-20` in the
  same pass), and stacked homepage `<section>`s use `pt-6 pb-8` rather
  than the older `py-14`/`py-16`.
- The Blogs page's subscribe form (`src/pages/blog/index.astro`) is
  wired to Netlify Forms (`data-netlify="true"` + a honeypot field +
  AJAX submit) — it only actually captures emails once deployed to
  Netlify; locally it "succeeds" in the UI without saving anything. It
  collects emails only, it doesn't send anything to subscribers — that
  would need a real mailing tool wired up separately.
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
