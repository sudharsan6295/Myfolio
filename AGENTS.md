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

Editorial "field notebook" identity, in full Glassmorphic Studio layout:
type is the original field-notebook system (Newsreader/Work Sans/IBM Plex
Mono) and the signature motif is `<Stamp>` (not `<Seal>`), but every
surface — nav, footer, hero, section wrappers, and every card — is a
frosted `.glass` panel floating over a fixed gradient-mesh background.
Ink/accent colors are burgundy + brass; the background/panel ground is
blue (a later change from the original warm peach/blush/cream — see the
comment above the `--color-paper`/`--color-mesh-*` tokens in
`global.css`; burgundy-and-gold-on-blue was a deliberate pairing, not a
placeholder). Tokens live in `src/styles/global.css`'s `@theme` block:

- Colors: `paper` (#EEF4FB, pale ice blue — glass panel base, *not* the
  page background itself, see below), `paper-raised` (#DFE9F6, denser
  panel fill), `ink` (#2B211F, text — unchanged, still warm dark),
  `ink-soft` (#7A655F, muted text), `pen` (#5B1A22, burgundy — the
  accent: links, active states, unchanged), `pen-soft` (#8A3B45, lighter
  burgundy for hovers), `highlight` (#B9975B, brass, used sparingly),
  `line` (#C6D6E8, hairline borders used *inside* glass panels, e.g.
  under a card's metadata row).
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
  (#D7E6F6 sky blue / #DFE1F4 periwinkle / #EEF4FB pale ice blue). `html`
  keeps a flat `--color-paper` background only as a fallback.
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
- Signature motif: `<Stamp>` (`src/components/Stamp.astro`) — a small
  rotated ink-stamp label, mono/uppercase/bordered. Used for blog
  categories, project status (live/prototype/archived), and nowhere
  else. There is no `Seal.astro`/circular-medallion variant in this
  build — that belonged to a different reviewed-but-unused direction
  (Playfair Display/Lora/Courier Prime type, a Markdown drop-cap); don't
  reintroduce those unless asked.
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
  `mt-24` only.** Page-level containers use `pb-8`, not `pb-24` — an
  earlier version had both, which stacked into a large empty gap above
  the footer. Don't add a large `pb-*` to a page's outer container; a
  little breathing room (`pb-8` or less) is fine, the footer's own
  margin does the real spacing.
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
