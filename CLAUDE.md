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
  circular engraved-monogram SVG ("SB"), added to finish the site's
  originally-chosen concept ("Letterpress & Seal" — only the
  letterpress/Stamp half had been built). It lives in exactly two
  places: the **nav header circle** (`Nav.astro` — a plain `<a href="/">`
  wrapping the Seal, always shown regardless of whether `about.photo` is
  set; it replaced the old photo/initials avatar entirely, see below)
  and marking a project flagged `featured: true` on `/projects`
  (`ProjectCard`, small inline mark next to the date). It's
  `aria-hidden` — pair it with its own visible or `sr-only` label at
  the call site (e.g. the `sr-only` "Featured" span next to the
  Workbench usage) rather than relying on the Seal's own accessible
  name. **Not** used on the About page or `/blog` any more — see the
  photo and Featured-entry notes below for why.
- **Tags/chips use `rounded-[3px]`, not `rounded-full`** — the About
  page's focus-area/tools/certifications chips were originally pill-
  shaped and were deliberately changed to match `<Stamp>`'s square-ish
  corner radius (no circular edges is a stated preference). Any new
  tag/chip UI should follow `rounded-[3px]`, not reach for a pill.
- **Nav header circle is always `<Seal>` now, never the photo.** Earlier
  it showed `about.photo` (with a click-to-magnify lightbox) or, absent
  a photo, initials computed from `about.name`. Per direct feedback,
  the photo moved to the About page instead (see below) and the nav
  circle became purely the site's Seal mark — no more conditional
  photo/initials logic, no more `initials` computation, no more
  lightbox in `Nav.astro` at all. It's a plain `<a href="/">`, not a
  `<button>` — nothing to magnify there any more. The name text next to
  it is still a separate `<a href="/">`, still hidden below the `sm`
  breakpoint (Seal only on narrow screens — with Connect in the nav,
  there isn't room for the full name too).
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
- The source file is `src/content/about/photo.png` — the full,
  uncropped portrait exactly as supplied (an earlier pass cropped it to
  a tight head-and-shoulders frame; that was explicitly undone per
  feedback — "use the photo without editing"). The one edit that's kept
  is watermark removal: the original had a "Made with AI" badge in one
  corner, painted over with a solid rectangle matching the uniform
  background color (a one-off `sharp` script, not a standing tool — no
  image-editing dependency was added to the project). Kept as a lossless
  PNG on purpose, not converted to JPEG, per the same "don't edit beyond
  what was asked" feedback. That's about the *source file* — see the
  next two notes for how it's *displayed*, which is a different
  question (display-level `object-cover`/crop is fine; editing the file
  on disk isn't).
- **The photo lives on the About page now, with two deliberately
  different crops** — `about.astro`'s intro panel shows a small
  passport-shaped thumbnail (`<Image width={92} height={120}>`,
  `object-cover`, `rounded-md border-2`, positioned where `<Seal>` used
  to sit: `hidden sm:block absolute top-7 right-7 sm:top-9 sm:right-9`)
  that opens the **full, uncropped** photo in a lightbox on click
  (`<Image width={900}>`, no `height`, same click-backdrop/✕/Escape
  mechanics the nav lightbox used to have — moved here wholesale,
  `about-photo-*` ids instead of `avatar-*`). Two different `<Image>`
  calls for the same source file, two different intents: the thumbnail
  *wants* a server-side crop (see the gotcha below — this is the one
  place in the codebase that deliberately triggers it), the lightbox
  explicitly avoids one.
- **Gotcha, already hit once, and now also a deliberate tool:**
  `astro:assets`'s `<Image>` crops to fill when given `width` + `height`
  that don't match the source's aspect ratio (a real server-side crop
  of the output file, not something CSS `object-contain` can undo
  afterward). This bit the old nav lightbox once — `width={800}
  height={800}` on the 1024×1536 portrait source silently cropped off
  the top of the head in the "enlarged" view; fixed there by passing
  only `width` and letting Astro infer `height`. The About page's new
  passport thumbnail is the *inverse* case: `width={92} height={120}`
  is chosen specifically to trigger that same crop-to-fill behavior on
  purpose (verified the output really is 92×120 via `sharp` metadata on
  the built file, not just "looks about right"). Know which one you
  want before touching either `<Image>` call — omit `height` when the
  full image must survive intact, set a mismatched `height` when a
  deliberate crop is the point.
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
  frontmatter) is only surfaced on `/projects` now.** It was briefly
  also used for a spotlight card at the top of `/blog` (a bigger
  `PostCard` via a `featured` prop) — removed per direct feedback in
  favor of the sort control below, and `PostCard.astro` was reverted to
  its simpler pre-spotlight form (no `featured` prop any more — grep
  before reintroducing one, it was fully dead code by the time it was
  removed). `/projects`' `ProjectCard` still shows a small `<Seal>` next
  to the date for any featured project — that part wasn't touched.
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
- **"More like this"** (`blog/[id].astro`) replaced an earlier
  chronological "← Older entry / Newer entry →" prev/next nav, per
  direct feedback asking for suggestions based on the post being read
  instead of pure adjacency. Scoring: same `category` as the current
  post is worth 10, each shared `tag` is worth 3, ties broken by
  recency — so it naturally degrades to "just show recent posts" when
  nothing scores above 0, without a separate fallback branch. Top 3
  shown, compact glass cards (not full `PostCard` — a smaller, denser
  treatment fits better as a footer section than the main list's
  full-size cards).
- **Sort control** (`/blog`, next to the post list, above `#post-list`):
  Newest first / Oldest first / Title A–Z / Quick reads first — added
  alongside the existing category filter when the "Featured entry"
  spotlight was removed. Each post's wrapper `<div>` carries
  `data-date`/`data-title`/`data-minutes` attributes; changing the
  `<select>` sorts a copied array of `postList.children` and
  re-`appendChild`s them in the new order (moves the existing nodes,
  doesn't clone/re-render them — cheap, and doesn't disturb the
  category filter's own `items` `NodeList`, which holds element
  references, not positions, so reordering doesn't invalidate it).
  Sorting and filtering are independent and compose fine — sort changes
  order, filter changes visibility, and neither needs to know about the
  other. The `№006`-style entry-number badge (`PostCard`'s
  `entryNumber`) is deliberately *not* recalculated after a non-date
  sort — it's each post's permanent ledger reference number, not a
  "current position in this view" indicator, so it staying fixed while
  the surrounding order changes is correct, not a bug to fix.
- **Workbench status filter** (`/projects`): same client-side-only
  `data-filter`/`data-status` pattern as the blog category filter
  (see the note on `blog/index.astro` below) — All/Live/Prototype/
  Archived, counts shown even at zero for consistency with how the
  blog filter already does it.
- **Skip-to-content link**: first focusable element in
  `BaseLayout.astro` (`.skip-link` in `global.css`, off-screen via
  `top: -100px` until `:focus` brings it to `top: 1rem`), landing on
  `<main id="main-content">`.
- **`about.openTo`** (`content.config.ts`, `z.array(z.string())`) — the
  explicit "here's what I'm looking for" signal, rendered as chips at
  the very top of `/about`'s sidebar, above "At a glance." Added during
  a content pass aimed at making the About page "job ready" — most
  personal sites never say this outright, leaving a hiring manager to
  infer it from the bio.
- **`/about` is professional-only content; personal content lives on
  the homepage, by explicit design.** A personal paragraph (family,
  hobbies) was tried on `/about` first — a natural-seeming fit for a
  "beyond the resume" bio aside — then moved to the homepage hero per
  direct feedback ("about me is my professional details"). It's now in
  `index.astro`'s hero card ("Off the clock: ..."), between the tagline
  and the site-description paragraph. Hardcoded prose there, not an
  `about.md` field — no schema field for it, so it doesn't flow through
  to `/about` or anywhere else automatically. **If new About content is
  ever proposed, ask whether it's professional (belongs in `about.md`)
  or personal (belongs in `index.astro`'s hero) before adding it** —
  this split was deliberate, not incidental, and the rest of the site
  already respects it: `/blog`'s own intro copy is the one other place
  personal topics (Personal Finance, Aquariums & Fishkeeping) show up,
  framed there as writing topics, not biography.
- **Homepage hero eyebrow is "Professional Notebook"** — was "Field
  Notebook", briefly "The Notebook" (chosen then to echo the hero body
  copy's "This is *the notebook*, not the portfolio..."), renamed again
  per direct follow-up feedback to its current text. Worth knowing if
  touching this again: the eyebrow now says "Professional" while the
  paragraph directly below it in the same hero card is the personal
  "Off the clock: ..." aside — a small tension between the label and
  the content it sits above, not resolved, just noted here since it
  wasn't asked to be fixed.
- **Homepage hero leads with the person, not just the pitch**: was
  `Field Notebook — {about.role}` as the eyebrow (redundant with the
  same info already in the tagline below it, and inconsistent with
  every other page's short 1-3-word eyebrow) followed straight into
  `{about.tagline}` as the H1 — no name anywhere near the top, it only
  showed up in a smaller paragraph beneath. Per direct feedback ("give
  personal info and what I am"): eyebrow was "Field Notebook" (later
  renamed to "The Notebook" — see the note below), H1 is
  `Hi, I'm {about.name}.`, and the tagline moved to its own
  subheading right below the H1 (`text-[1.1rem] text-ink`, one step
  down from the H1, one step up from the body paragraph). The old body
  paragraph's `I'm {about.name} —` opener was dropped since the name is
  now already stated in the H1 above it.
- **Real gap found and fixed in the same pass**: `about.social.linkedin`
  was set in `about.md` and used in Nav's Connect panel and the footer,
  but `/about`'s own "At a glance" list never rendered it — only
  location/email/resume/GitHub. Added, right before GitHub in that
  list. Worth remembering if new `about.*` fields get added later:
  being in the schema and being populated doesn't mean every page that
  plausibly should show it actually does — check the actual render,
  not just the data.

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
