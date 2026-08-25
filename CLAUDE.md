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
- **Nav Connect (renamed from "Contact") — a dropdown, icons in a row,
  no visible box around them.** Desktop shows a "Connect" label
  (`<details>`/`<summary>`) that opens email/LinkedIn/GitHub as three
  icon-only buttons side by side in one horizontal row, positioned
  `absolute` under the trigger — with no background, border, shadow,
  or blur around them (`background: transparent`, `border-width: 0`,
  confirmed via computed style). This has gone through four shapes
  this session (dropdown-with-text-rows → inline-icons-in-the-bar →
  dropdown-with-icon-row-in-a-`.glass-popover`-box →
  dropdown-with-icon-row-and-no-box), each per a direct follow-up
  request. `.glass-popover` (the near-opaque background variant built
  for the previous shape, needed there because *text* rows underneath
  translucent glass fought for legibility) was removed from
  `global.css` again — a bare row of icons doesn't have that
  legibility problem the way text did, so there's nothing for a
  background to protect against here; each icon still gets its own
  `hover:bg-paper-raised/40` for a visible hit target. Outside-click/
  Escape dismissal (`.contact-dropdown[open]`, since `<details>` has
  no built-in close) stays, since it's still a `<details>` popover,
  just visually boxless. Mobile menu has its own separate, always-
  inline (never a popover, never had a box) Connect section —
  untouched by any of this. **If Connect changes shape again, check
  this note first** rather than re-deriving the history from scratch.
- **Footer has icon-only Connect links, no label.** `Footer.astro`
  shows the same three icons (Email/LinkedIn/GitHub, `h-7 w-7`,
  `title` + `aria-label` on each) next to the copyright line — no
  "Connect" text next to them (that label now lives only in the nav's
  dropdown trigger, see above). Same `about.email`/`about.social.*`
  conditionals as everywhere else — the row only renders if at least
  one of the three is actually set.
- **Nav has two structurally separate layouts, not one responsive
  one** — `hidden sm:flex` (desktop: inline links + Connect icons +
  theme toggle) and `flex sm:hidden` (mobile: just a theme toggle +
  hamburger button), each with duplicate content rather than one
  markup block reflowing. Replaced an earlier mobile approach that
  crammed all of nav-links + Connect into one `overflow-x-auto` row —
  a cramped, dated pattern — with a real hamburger menu per direct
  "more modern UX" feedback. The hamburger toggles `#mobile-menu` (a
  panel below the header, `sm:hidden`, hidden by default) containing
  stacked page links and a stacked Connect section (plain links, no
  popover — a popover doesn't make sense once Connect isn't squeezed
  for horizontal space any more). Two consequences worth knowing:
  - **Duplicate theme-toggle buttons** (`#theme-toggle` desktop,
    `#theme-toggle-mobile` mobile-row) — only one is ever visible at a
    time (CSS `sm:` breakpoint), but the toggle script binds to both
    via one `querySelectorAll`, so either always works regardless of
    viewport. If a third copy is ever added (e.g. inside the mobile
    menu panel itself), it needs to join that same selector.
  - **Two `links.map()` blocks** (desktop `<ul>`, mobile `<ul>`) render
    the same `links` array with different styling (underline-on-active
    for desktop, filled-background-on-active for mobile — a filled
    background reads better for a full-width stacked mobile link than
    a thin underline would). Verified there's no double-render overlap
    right at the `sm` breakpoint boundary (640px): exactly one of the
    two layouts has nonzero `offsetWidth` at a time, checked directly,
    not assumed from the class names alone.
  - Active desktop nav-link indicator changed from a filled
    `bg-paper-raised/70` block to a slim 2px underline (`absolute
    ...-bottom-px h-[2px] bg-pen`) — also part of the "more modern"
    ask; a filled pill/block behind nav text is a heavier, more dated
    look than a thin active-state underline.
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
- **The whole site is professional-only content now, by explicit,
  final decision** — reversing the personal-content experiment from a
  few passes back:
  - Homepage hero eyebrow history: "Field Notebook" → "The Notebook" →
    "Professional Notebook" → "Who I Am" → **back to "Professional
    Notebook"**, final (for now). The "Off the clock: ..." personal
    paragraph (husband/father/hobbies) that used to sit in the hero
    is now **removed entirely**, not relocated — there's no personal
    content anywhere on the site any more, About or otherwise. The
    hero's site-description paragraph was also reworded to explicitly
    say "This is *my professional notebook*..." so the eyebrow and the
    body copy agree with each other again (same reasoning as the
    "Who I Am" pick, just resolved in the other direction — no
    personal content left to accommodate, so the eyebrow could just
    say what it says without contradiction).
  - **Blog category "Personal Finance" and "Aquariums & Fishkeeping"
    merged into one: "Professional Peace."** Schema
    (`content.config.ts`), the `categories` array in
    `blog/index.astro` (filter buttons + subscribe checkboxes both
    read from it), and both affected posts' frontmatter
    (`health-term-insurance-first.md`, `aquariums-in-home-and-mental-
    peace.md`) all updated together — `category` is a Zod `z.enum`, so
    a stale value fails the whole build, not just that one post.
    `/blog`'s own intro copy reworded to stop naming "personal
    finance"/"aquarium" directly and instead introduce "Professional
    Peace" as a topic in its own right. The posts' own titles/content
    still say "Personal Finance" and "aquariums" where that's the
    literal subject matter — only the *category taxonomy* changed, not
    the writing itself.
  - **Real gotcha hit during this pass**: right after the schema
    enum change, `/blog` briefly showed only 4 of 6 posts and
    "Professional Peace (0)" — not a code bug, a **stale long-running
    dev server**. `astro build` resyncs the content store in its own
    process; the separately-running `astro dev` server (up for a very
    long uptime across dozens of edits this session) didn't pick up
    the `z.enum` change on its own. Restarting it (`astro dev
    stop` + `npm run dev`) fixed it immediately — confirmed via the
    exact same browser check before/after. Worth remembering: a schema
    enum change specifically, more than a plain content edit, is a
    good reason to restart the dev server rather than trust HMR here.
- **About page's "proud of" list and closing CTA moved out of Markdown
  into structured data + template code**, per direct "redesign this
  content in a modern way" feedback on that exact block — then
  simplified further through several quick follow-ups ("I don't want
  boxes", revert, "keep tick mark"). Current state, both in
  `about.astro` right after the `.prose` `<Content />`:
  - `about.highlights` (`content.config.ts`, plain string array — same
    4 sentences that used to be a `.prose` bullet list) renders as a
    plain `flex flex-col` stacked list, each item a small checkmark SVG
    (`text-pen`) + text, no border/background/grid — tried a
    `sm:grid-cols-2` bordered card-tile treatment first, explicitly
    rejected as "boxes." Moved out of Markdown so it could keep its own
    treatment (the checkmark) independent of `.prose ul`'s plain `—`
    bullet style, which every blog post and project write-up also uses.
  - The closing CTA paragraph ("Curious what this looks like in
    practice?...") is hardcoded in `about.astro`, not Markdown — but
    also not a tinted callout box any more (also rejected as "boxes");
    it's a plain paragraph with a `border-t border-line` divider above
    it, same divider style used elsewhere on this page. Doesn't
    reference `about.name` or anything instance-specific, consistent
    with other hardcoded teaser copy on the site (e.g. the homepage's
    About teaser section).
  - **If new "achievement" content is ever added, use `highlights`,
    not a Markdown bullet list in the bio body** — that's the
    established place for it now. Don't reach for a bordered card/box
    treatment for it without checking first — that was tried and
    explicitly turned down here.
- **`.prose h2`/`h3` top margins tightened** (`global.css`) — `2.6em`
  → `1.7em` for `h2`, `2em` → `1.5em` for `h3` (bottom margins only
  trimmed slightly, `0.7em`→`0.6em`/`0.6em`→`0.5em`). Per direct
  feedback with a screenshot: a post with several short sections (each
  only a paragraph or two under its heading) had a *lot* of visible
  blank space before every heading — the em value is relative to the
  heading's own font-size (`h2` is `1.6rem`), so `2.6em` was really
  ~67px, not obviously excessive as a bare number but adding up
  visibly across several section breaks in a row. Measured before and
  after via each prose child's `getBoundingClientRect()`: gap before
  every `h2` went from 66px to 44px (~33% less), gap after a heading
  (to the next paragraph) stayed close to unchanged since only the
  bottom-margin number moved slightly. Applies everywhere `.prose` is
  used (blog posts and project write-ups both), not just the post that
  prompted it.
- **Detail pages (`blog/[id].astro`, `projects/[id].astro`) are
  `max-w-4xl` (896px), not `max-w-3xl`** — per direct feedback that
  clicking into a post/project from the `max-w-5xl` (1024px) list
  pages "felt smaller." Deliberately not matched all the way to
  `max-w-5xl`: `.prose` is rendered with `max-w-none` (no inner reading-
  width cap of its own), so the outer container's width *is* the
  body-text line length — going all the way to 1024px would push
  prose lines to ~100+ characters, well past comfortable reading
  length. `max-w-4xl` measured out to ~85 characters/line (750px prose
  column at 16px Work Sans) — wider and less cramped, without turning
  the line length into its own readability problem. If asked to widen
  these further, re-measure `.prose p`'s rendered width before just
  bumping the class, for the same reason.
- **`/about`'s intro-panel/"At a glance" row got the same `items-start`
  removal** as the homepage hero (see below) — same fix, same
  reasoning, applied to a third two-column row per direct follow-up
  feedback. Both columns now match exactly (confirmed 1038px height,
  identical top/bottom, at 1280px).
- **Two-column layout alignment fixes, both from a screenshot** — the
  homepage hero row and the `/blog` list+sidebar row had different
  "which column should be taller/lower" answers, so don't copy one
  fix's approach onto the other:
  - Homepage hero (`index.astro`): the hero card and "Recent entries"
    aside are meant to be the **same height**, ending at the same
    bottom edge. The row's `items-start` was overriding CSS Grid's own
    default `align-items: stretch`, which is what actually produces
    matching heights automatically (no need for `items-stretch`
    explicitly — just don't override it) — removed `items-start`.
    Verified via `getBoundingClientRect()`: both cards now share
    identical top/bottom/height (523px in the tested viewport).
  - `/blog` list+sidebar: the opposite shape of problem — the sidebar
    column (`Written by` + `Subscribe`) started at the very top of the
    row, level with the `Sort` control, while the actual post list
    starts lower (below the `Sort` row). Wanted: sidebar top aligned
    with the *first post card*, not the sort control. Grid stretch
    doesn't solve this one (it's an offset problem, not a height
    problem) — added `lg:mt-[38px]` to the sidebar wrapper, where 38px
    is the sort-control row's real measured height
    (`getBoundingClientRect()` on the first post card minus the
    wrapper's own top, at 1280px), not a guessed/rounded value. Only
    at `lg:` since the sort row and sidebar don't sit side-by-side
    below that breakpoint (single-column stack). If the sort row's
    own height/margins ever change, re-measure and update this offset
    — it's a hardcoded pixel match to specific content, not something
    that stays correct automatically like the homepage's stretch fix.
- **Gotcha, real, hit in the hero paragraph**: a newline immediately
  after a closing inline tag (`</a>\n          text...`) collapses to
  *nothing* in Astro's compiled output, not to a single space the way
  plain text-to-text whitespace does — produced "Workbenchfor" and
  "Notesfor" glued together with no space, caught via `get_page_text`,
  not visible in the source. A newline between two plain-text words
  collapses to a space fine; a newline right after `</a>` (or presumably
  any closing tag) does not. Fix: keep the word immediately following a
  closing tag on the *same source line* as that tag (e.g. `</a> for`),
  and only line-break in the middle of a plain-text run after that.
  Worth checking `get_page_text` (not just the source) after editing
  any multi-line paragraph with inline links in it.
- **`ProjectCard`'s tag row is pinned to the card's bottom, not just
  stacked under the description** — the root `<a>` is `flex flex-col
  h-full` and the `stack` `<ul>` uses `mt-auto pt-4` instead of `mt-4`.
  Without this, three cards in the same grid row with different-length
  descriptions (different line-wrap counts) had their tech-stack chips
  land at three different heights — grid's default `align-items:
  stretch` already equalizes each card's outer height, but nothing
  pinned the *content inside* to the bottom, so the tags just sat
  wherever the description above them happened to end. Verified via
  `getBoundingClientRect()` on all three cards at a real 3-column
  width (1280px — the `lg:` grid breakpoint needs an explicit wide
  `resize_window` call in this environment, the desktop *preset*
  didn't reliably apply `window.innerWidth` here): all three cards'
  height and their tag row's top/bottom now match exactly. Apply the
  same `flex flex-col h-full` + `mt-auto` pattern to any future
  grid-of-cards component where content length varies per card.
- **Blogs sidebar "Written by" card dropped `about.role`** — was
  name → role → tagline → link; role was the long resume-style
  sentence (`about.role`, distinct from the shorter `about.tagline`)
  and made the card feel dense. Now just name → tagline → link.
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

## Site infrastructure (SEO, feed, transitions)

Six additions from one batch, all from a menu of enhancement ideas the
user picked from directly. Open Graph image (below) had a detour —
built, explicitly reverted, then explicitly re-added — worth knowing
the history if it comes up again, but the current, live state is: it's
in.

- **Custom 404** (`src/pages/404.astro`) — same visual language as
  every other page (glass panel, Seal, links to Home/About/Blogs/
  Workbench), not Astro's bare default. Astro's dev server and static
  build both pick this up automatically for unmatched routes — no
  config needed beyond the file existing at that path.
- **Person structured data (JSON-LD)** — `BaseLayout.astro` builds a
  `schema.org/Person` object from `about.*` and injects it site-wide
  (every page, not just `/about` — the person is the subject of the
  whole site) via `<script type="application/ld+json" set:html={...}>`.
  `sameAs` pulls whichever of `linkedin`/`github`/`twitter` are set.
  `image` points at the OG image below when `about.photo` is set.
- **Open Graph image** (`public/og-image.png`, 1200×630) — generated by
  `scripts/generate-og-image.mjs` (`npm run generate:og`), a one-off
  script (not a build step) that hand-builds an SVG matching the
  site's actual palette/Seal motif and rasterizes it with `sharp`
  (already a project dependency via `astro:assets`). Pulls the current
  `name`/`role`/`location` straight from `about.md` at generation time
  so it doesn't hardcode stale copy — but it's still a **static file
  that goes stale if the name/role changes again** (which has happened
  repeatedly in this project's history) — re-run `npm run generate:og`
  after any such edit. `role` is trimmed to the clause before " — "
  (the full field is a long resume-style sentence, too long for a
  card). Wired into `BaseLayout.astro` via `og:image`/
  `og:image:width`/`og:image:height`/`twitter:image` meta tags and
  `twitter:card` set to `summary_large_image`. **This has a real
  history worth knowing**: built in the original six-item batch,
  explicitly reverted in full (script, PNG, npm script, meta tags all
  removed, `twitter:card` back to plain `summary`) per direct request,
  then explicitly re-added — same implementation, freshly regenerated
  against current `about.md` content, verified live (meta tags, the
  PNG itself serving as `image/png` at the right dimensions, and the
  JSON-LD `image` field all confirmed correct) before committing again.
  Purely metadata + a static file — no on-page layout footprint, so
  there's no overlap-with-other-content concern the way the Connect
  dropdown had.
- **RSS feed** (`src/pages/rss.xml.js`, via the official `@astrojs/rss`
  package — a real new dependency, installed for this) — built from
  the same `blog` collection every other page reads, so a new post
  `.md` file shows up on the next build with no separate list to
  maintain. Linked in `<head>` (`rel="alternate"`) and as a visible
  "Subscribe via RSS" link on `/blog` itself.
- **Client-side search on `/blog`** — a `#post-search` input, matching
  against a precomputed `data-search` attribute (title + description +
  tags, lowercased) on each post's wrapper. Composes with the existing
  category filter through one shared `applyVisibility()` function
  (a card must pass *both* the active category and the current search
  text) — refactored from two independent handlers specifically so
  neither could clobber the other's hide/show state. No search library
  added; plain substring matching is enough at this content volume
  (flagged as fine "up to ~10 posts" — worth revisiting if the blog
  grows well past that).
- **View Transitions** (`<ClientRouter />` in `BaseLayout.astro`,
  `astro:transitions`) — smooth client-side navigation between pages
  instead of a full reload. This is the one with real teeth: Astro's
  router swaps the DOM on internal-link navigation, so **every
  page-level `<script>` in this project had to be restructured** to
  keep working after the *first* navigation, not just on initial load:
  - Logic that queries/binds elements *inside* a page's own content
    (Nav's theme toggles + mobile menu, the blog filter/sort/search,
    the Workbench status filter, the About photo lightbox trigger) is
    wrapped in `document.addEventListener("astro:page-load", initFn)`
    — this event fires on the real first load *and* every subsequent
    transition, unlike a script's own top-level code, which isn't
    guaranteed to re-run when a page you've already visited this
    session is transitioned to again.
  - Listeners genuinely attached to `document`/`window` itself (the
    Connect-dropdown outside-click, both Escape-key handlers, the
    mobile-menu resize watcher, the reading-progress bar's
    scroll/resize listeners) are attached **once**, outside any
    `astro:page-load` wrapper — `document`/`window` are never replaced
    by the router, so re-attaching on every transition would stack up
    duplicate listeners with no cleanup. Where such a listener's
    callback needs to reference page-specific elements (e.g. the
    Escape handler needs to know the *current* lightbox), those
    elements are held in `let` bindings reassigned inside the
    per-page-load init function, not `const`s captured once — the
    closure always sees whichever version is currently in the DOM.
  - Verified this actually holds by clicking through 6+ real soft
    navigations in a row (including one initiated *from inside* the
    mobile menu) and re-testing every interactive feature after each
    one, not just after the first: nav active-state, mobile hamburger
    open/close/re-open on the new page, both theme-toggle buttons, the
    blog category filter + search + sort (individually and combined),
    the Workbench status filter, the About photo lightbox
    open/Escape-close, and the reading-progress bar. All correct every
    time — no stale references, no doubled/broken results from
    possible duplicate listeners.
  - **Real caveat, not swept under the rug**: every transition in this
    Browser pane throws a console `InvalidStateError` ("Transition was
    aborted because of invalid state") from the native View
    Transitions API itself. The navigation and every script above
    still work correctly despite it — this is very likely explained by
    this specific pane's already-documented inability to composite
    frames (the same root cause blocking `computer{action:screenshot}`
    elsewhere in this environment), since the native transition API
    fundamentally needs a compositor to capture the before/after
    cross-fade. Not confirmed against a real browser with this pass —
    worth a quick real-browser click-through to see whether the visual
    cross-fade itself looks right, even though the underlying
    functionality is already verified solid.

### Follow-up fixes, same day — two real bugs the user caught by eye

- **Connect dropdown — ultimately replaced, not just re-styled.** Several
  rounds were spent trying to fix the popover's background legibility
  (translucent `.glass` let page content show through, e.g. against
  About's "At a glance" list and the homepage's "Recent entries" list;
  a `.glass-popover` variant at ~96% opacity was tried, reverted twice
  back to plain `.glass`, then reinstated once after a screenshot
  confirmed the actual bleed-through). None of that stuck — the user
  ultimately said "change the design" outright. Real fix: **the popover
  is gone.** Desktop Connect is now plain inline icon links in the nav
  bar itself (see the Design system section above) — there's no
  floating element left to have an opacity opinion about, and
  `.glass-popover` was removed from `global.css` again since nothing
  uses it. If a future request touches Connect again, this is the
  current shape: icon buttons in the bar, not a popover of any kind.
- **Blog page's search box and sort dropdown didn't align — fixed.** They
  sat in one `items-center` flex row but relied on each control's own
  padding (`py-1.5` on the search input vs `py-1` on the select) to
  determine height, which don't match — measured live at 30.4px vs
  24.8px tall, several pixels of vertical offset between them despite
  `items-center`. Gave both an explicit `h-8`, removed the now-redundant
  `py-*` (height is set directly, so vertical padding no longer competes
  with it), and added `shrink-0` to the Sort group so it can't get
  squeezed as the search box (which is `flex-1`) grows on wider screens.
  Verified live: both controls measured exactly 32px tall, same `top`,
  at both mobile and desktop widths.

### "Professional Peace" removed — content, category, and every reference

Per direct request ("I will keep it professional") — this wasn't a bug
fix, it's a content/scope decision: the site drops the personal-life
writing lane entirely, staying strictly professional (AI, business,
product management).

- **Deleted both posts** in that category:
  `src/content/blog/aquariums-in-home-and-mental-peace.md` and
  `src/content/blog/health-term-insurance-first.md` (both were also
  `featured: true`, so they'd been appearing in the homepage's Recent
  Entries rail — that's automatic from the collection, no separate
  fix needed once the files were gone).
- **Removed the category itself** from the `category` enum in
  `src/content.config.ts` (now just `'AI' | 'Business' | 'AI Product
  Management'` — a new post using the old value will fail the Zod
  schema, which is the intended guardrail) and from the `categories`
  array in `src/pages/blog/index.astro` (drives both the filter
  buttons and the subscribe-by-category checkboxes, per that file's
  own comment — one array, two call sites, so removing it there was
  enough for both).
- **Copy references** — the blog page's `<BaseLayout description>`
  and its own intro paragraph both used to mention "the professional
  peace that keeps it all running" / "plus Professional Peace, the
  discipline and quiet routines..."; the **homepage's** intro
  paragraph separately said "posts on work, wealth, and peace" (an
  allusion to the same two posts' subject matter — insurance/wealth,
  aquarium/peace — without using the category name itself, so it
  didn't show up in a literal string search for "Professional Peace"
  and was easy to miss). All three rewritten to plainly describe the
  three remaining categories.
- **`README.md`**'s new-post frontmatter template listed the category
  as one of four options — trimmed to three, so anyone following the
  guide next doesn't recreate the fourth by copying the old comment.
- Verified live: `npm run build` clean at 12 pages (down from 14),
  blog page shows exactly 3 filter buttons with correct counts (no
  4th "Professional Peace" pill), RSS feed (`/rss.xml`) contains only
  the 4 remaining posts, entry numbers (`№001`–`№004`) renumbered
  cleanly with no gap, and a full-tree grep for "professional peace" /
  "mental peace" / "work, wealth" across `src/` and `README.md` comes
  back empty.

### Blog categories are now open-ended, derived from the posts themselves

Direct follow-up to the removal above: removing "Professional Peace"
meant hand-editing 4 files to keep a hardcoded category list in sync
(`content.config.ts`'s enum, `blog/index.astro`'s `categories` array,
`README.md`'s comment, plus copy text). The user asked for this to
just work for any number of categories going forward, without that
manual sync.

- **`content.config.ts`**: `category` is now `z.string().min(1)`
  instead of `z.enum([...])` — any non-empty string is a valid
  category. No fixed list to maintain here at all any more.
- **`src/pages/blog/index.astro`**: the filter buttons (and the
  subscribe-form's category checkboxes, which read from the same
  array) are computed from the posts themselves —
  `[...new Set(allPosts.map(p => p.data.category))]`, counted, sorted
  most-used first with an alphabetical tie-break. A category with zero
  posts simply doesn't appear (previously "Business (0)" stayed
  visible even with nothing in it — arguably a UX improvement as a
  side effect, not just a refactor).
- **`README.md`**'s post-authoring template no longer lists specific
  category names — just explains that any short label works and the
  site picks it up automatically on the next build.
- **Verified this is actually dynamic, not just refactored to look
  dynamic**: added a real temporary post
  (`_test-dynamic-category.md`) with a brand-new category ("Career
  Notes") never mentioned anywhere in the codebase, ran `npm run
  build` (succeeded — proves the schema accepts arbitrary categories,
  not just the old three), loaded `/blog` live and confirmed a
  "Career Notes (1)" filter button and subscribe checkbox appeared
  with zero code changes, clicked it and confirmed it correctly
  filtered to just that one post, then deleted the test post and
  rebuilt back to 12 pages clean.

### Footer got a Connect row; Workbench status got the same open-ended treatment

Two smaller follow-ups, same session:

- **Footer** (`Footer.astro`): added the same icon-only Email/LinkedIn/
  GitHub links used in the nav (identical `h-7 w-7` treatment,
  `title`/`aria-label` on each), replacing the old plain text links
  ("Email"/"LinkedIn"/"GitHub"). Initially shipped with a "Connect"
  text label next to the icons — removed again shortly after per
  direct request, once "Connect" moved to being the nav dropdown's
  trigger label instead (see the Design system section above for the
  current shape of both). Same `about.email`/`about.social.*`
  conditionals — the row only renders if at least one is set. Verified
  live (correct hrefs on all three, no horizontal overflow on a 375px
  mobile viewport).
- **Workbench status filter** (`projects/index.astro`) — same pattern
  as blog categories, per direct request to apply it there too:
  `status` in `content.config.ts` is now `z.string().min(1)` instead
  of `z.enum(['live', 'prototype', 'archived'])`, and the filter
  buttons are derived from the projects themselves (most-used first,
  alphabetical tie-break, title-cased for display since there's no
  fixed label map any more) instead of a hardcoded 3-value list.
  `live`/`prototype`/`archived` remain the *conventional* values and
  the only ones with a specific accent color (`statusTone` in
  `ProjectCard.astro` and `projects/[id].astro`, both of which already
  had a `?? "ink"` fallback for an unrecognized value before this
  change — nothing needed to change there). Verified the same way as
  blog: added a real temporary project with a brand-new status
  ("shelved"), confirmed `npm run build` succeeded and a "Shelved (1)"
  filter button appeared and correctly filtered with zero further code
  changes, then deleted it and rebuilt clean.
- README.md's project-authoring template updated to match (no longer
  lists status as a fixed 3-value choice).

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
  `mt-6` only.** Page-level containers use `pb-8`, not `pb-24` — an
  earlier version had both, which stacked into a large empty gap above
  the footer (tightened `mt-24` → `mt-10` → `mt-6` across two later
  passes, each time after feedback that pages still felt too spaced
  out — if asked again, the next step is probably questioning whether
  `pb-8` itself should shrink too, since `mt-6` is getting close to as
  tight as a single-file lever can go without also touching every
  page's own bottom padding). Don't add a large
  `pb-*` to a page's outer container; a little breathing room (`pb-8` or
  less) is fine, the footer's own margin does the real spacing. Page top
  padding is `pt-10 sm:pt-14` (tightened from `pt-14 sm:pt-20` in the
  same pass), and stacked homepage `<section>`s use `pt-6 pb-8` rather
  than the older `py-14`/`py-16`. **All of it is `pb-8`, no exceptions**
  — the homepage hero section (`index.astro`'s first `<section>`) had
  drifted to `pb-8` on top load but `pb-10` was reintroduced at some
  point, giving it a visibly bigger gap to the next section (64px)
  than the other three homepage sections had between each other
  (56px) — caught from a screenshot, fixed back to `pb-8`. Verified via
  `getBoundingClientRect()` on every page's last content element vs.
  the footer: all six page templates (`/`, `/about`, `/blog`,
  `/blog/[id]`, `/projects`, `/projects/[id]`) land on exactly the
  same gap before the footer (72px when measured, now 56px after the `mt-10`→`mt-6` reduction below), and all three of the homepage's
  inter-section gaps are exactly 56px each. If a page's bottom padding
  is ever changed, re-run that same check across every page template,
  not just the one being edited — this is a shared visual rhythm, and
  a one-page fix that isn't cross-checked is how it drifted the first
  time.
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
