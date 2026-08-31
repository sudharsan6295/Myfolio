# Project: Personal Site

A personal blog / portfolio (About Me, Notes, Workbench) built so
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

**"The Spec" — a full visual redesign, replacing the earlier "field
notebook" / Glassmorphic Studio identity entirely** (glass panels,
gradient-mesh background, burgundy + brass palette, Newsreader serif,
the rotated `<Stamp>` and circular `<Seal>`). Per direct request ("use
your best UI/UX judgment and rebuild this site"), grounded in the
subject instead: the site belongs to an AI Product Manager, and the
visual language is borrowed from the artifact that role actually
produces — a spec doc / release note. Status chips and a margin
"redline rail" carry real content structure, not decoration (an
earlier pass also put a literal `DOCUMENT/OWNER/STATUS` field block in
the homepage hero — removed per direct feedback as one signature
device too many; the OG image generator still has its own copy of that
motif and wasn't touched, see below). Flat surfaces on a cool porcelain paper with a faint dot-
grid texture, not frosted glass on a gradient mesh — depth comes from
hairline borders and a colored top edge on cards, not blur. Tokens live
in `src/styles/global.css`'s `@theme` block:

- Colors: `paper` (#F2F4F5, cool porcelain), `paper-raised` (#E7EBEC,
  denser flat panel fill), `ink` (#191D1F, text), `ink-soft` (#5C666B,
  muted text), `pen` (#B93A14, a deep vermillion/redline accent — links,
  active states, the "live" status; measured at 5.17:1 against
  paper/paper-raised, WCAG AA), `pen-soft` (#D3572A, lighter for
  hovers), `highlight` (#8A6200, amber — the "prototype/draft" status
  tone; measured at 4.97:1, WCAG AA), `line` (#D7DCDE, hairline
  borders). Dark mode brightens `pen`/`highlight` (#FF7A4D / #E8B04A)
  since they sit on a near-black paper (#15181A) there instead.
- **Dark mode**: unchanged mechanism from the previous identity — every
  color token above is redefined (same names, dark values) rather than
  the markup using Tailwind `dark:` variants anywhere, so redefining the
  variable retheme the whole site. **Any new color must go through one
  of these existing tokens (or a new token added in both places) — a
  raw hex/rgb value in a class or inline style will not respond to the
  toggle.** The three-state pattern (see `global.css`): bare `:root` =
  light; `@media (prefers-color-scheme: dark)` guarded by
  `:root:not([data-theme="light"])` = follow the OS unless the user
  explicitly chose light; `:root[data-theme="dark"]` = explicit dark
  choice, wins regardless of OS. The toggle button (`#theme-toggle` in
  `Nav.astro`) just sets/clears `data-theme` on `<html>` and persists it
  to `localStorage`; a pre-paint `is:inline` script in
  `BaseLayout.astro`'s `<head>` (with `data-astro-rerun`, see the dark-
  mode bug note further down) applies the saved choice before first
  render, to avoid a flash of the wrong theme.
- **Page background**: `body` paints a flat `--color-paper` fill plus a
  faint dot-grid texture (`radial-gradient(var(--color-line) 1px,
  transparent 1px)`, 28px spacing, ~4% visual weight) — a restrained nod
  to graph paper / spec-sheet vellum, not the old gradient mesh. No
  blur anywhere in the system.
- **`.panel` is the standard flat surface now** (`global.css`,
  replacing `.glass`): `paper-raised` fill, a 1px `line` border, an 8px
  radius (never the old 24px "blob" corners), and a shadow just barely
  present. Nav (`.nav-bar` — opaque `paper` fill, bottom hairline only),
  footer, `PostCard`, `ProjectCard`, and every page-section wrapper use
  `class="panel"` rather than `.glass rounded-2xl/3xl`. **When adding a
  new section, wrap it in `.panel`, not a plain bordered box.**
- **`.card-edge` — the colored top border on `PostCard`/`ProjectCard`**,
  driven by an inline `--edge` custom property (not a fixed set of
  modifier classes, since category/status values are open-ended — see
  `content.config.ts`) rather than a rotated stamp. Reads as a flagged/
  tabbed document, the literal "this one's marked" cue.
- Fonts: `font-display` = Space Grotesk (headings only — geometric,
  technical character, weights 500–700), `font-body` = IBM Plex Sans
  (body copy), `font-mono` = IBM Plex Mono (doc-header fields, dates,
  tags, status chips — carried over from the previous system since it
  suits this concept even better). Newsreader and Work Sans are gone
  entirely.
- Signature motifs: `<StatusChip>` (`src/components/StatusChip.astro`,
  replacing `<Stamp>`) — a flat chip with a small colored status dot
  plus a mono uppercase label (build-status/eval-status badge
  vocabulary), for blog categories and project status; same "keep it
  rare" rule as before, just flat instead of rotated. `<Mark>`
  (`src/components/Mark.astro`, replacing `<Seal>`) — a square
  bracketed monogram (`[SB]`), styled like a doc reference id rather
  than a wax-seal circle; no circular edges anywhere in this system. It
  lives in the **nav home link** (`Nav.astro`) and the 404 page's own
  header. The old "featured project" Seal mark on `/projects` is now
  just a small filled square dot next to the date (`ProjectCard`),
  paired with an `sr-only` "Featured" span — `<Mark>` itself is reserved
  for the site's own identity, not a generic flag.
- **Tags/chips use `rounded-[3px]`, not `rounded-full`** — unchanged
  rule from the previous identity (no circular edges is a stated
  preference, and it fits this sharper-cornered system even better than
  it fit the old one). Any new tag/chip UI should follow `rounded-[3px]`.
  Cards/panels use `rounded-md`/`.panel`'s 8px, not the old
  `rounded-2xl`/`rounded-3xl`; buttons use `rounded-[4px]`, not
  `rounded-full` pills (icon buttons like the theme toggle and the
  About photo lightbox's close button are the one exception — a round
  icon button isn't a tag/chip and was never what this rule targeted).
- **Nav home link is `<Mark>`, never the photo.** Same arrangement as
  before the redesign — the photo lives on the About page with its own
  lightbox; the nav link is a plain `<a href="/">` wrapping `<Mark>`
  plus the name (hidden below `sm:`), one link with
  `aria-label="Home — {name}"`, not a `<button>`.
- **Nav Connect — plain inline icon links in the bar, no dropdown.**
  Desktop shows email/LinkedIn/GitHub as three icon-only buttons
  directly in the nav bar (`h-7 w-7 rounded-[3px]`, same treatment as
  the theme toggle next to them), each with a `title` tooltip and
  `aria-label`. **This is the settled shape after five rounds of churn
  in one session** — worth reading in full before touching this again:
  dropdown-with-text-rows (original) → dropdown-with-opaque-background
  (tried, reverted twice) → plain-inline-icons (a real redesign, per
  "change the design") → dropdown-with-icon-row-in-a-box (per "have it
  in header... in dropdown in a row") → dropdown-with-icon-row-and-no-
  box (per "hide the box") → **back to plain-inline-icons**, explicitly
  reverting the last two of those per direct request ("revert the last
  two on connect and keep only interactive icons on header"). No
  `.glass-popover` class exists in `global.css` any more — removed
  each time a dropdown shape was undone, since nothing else uses it.
  Mobile menu has its own separate, always-inline Connect section,
  unaffected by any of this churn. **If asked to change Connect again,
  read this note fully first and confirm the specific target shape
  before implementing** — this component has round-tripped through
  the same few designs multiple times this session.
- **Footer Connect — plain text links, no icons, no label.**
  `Footer.astro` shows "Email"/"LinkedIn"/"GitHub" as plain text links
  next to the copyright line — the original design, restored after a
  detour through icon-only links (with and without a "Connect" label)
  that was explicitly reverted per direct request alongside the nav
  change above.
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
  every other page (`.panel`, `<Mark>`, links to Home/About/Blogs/
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
  site's actual palette/doc-header/`[SB]` mark and rasterizes it with `sharp`
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

### Real bug: dark mode silently reverting to light on client-side navigation

Reported directly ("if I change blog to workbench the mode auto
changes"). Root cause, confirmed live before fixing: the theme
pre-paint script in `BaseLayout.astro`'s `<head>` is `is:inline` and
byte-identical on every page — with `ClientRouter` (View Transitions)
in play, Astro's transition diffing treats an unchanged `<head>`
script as nothing-to-do and skips re-executing it after a soft
navigation, while the *incoming* page's server-rendered `<html>` tag
never had `data-theme` in the first place (it only ever gets set by
this script running client-side). Net effect: the router's DOM swap
wipes `data-theme` off `<html>`, and nothing re-applies it — confirmed
by setting dark mode, clicking a nav link, and reading `data-theme`
back as `null` while `localStorage.theme` still correctly said
`"dark"`.

Fix: added `data-astro-rerun` to that `<script is:inline>` tag —
Astro's documented escape hatch for "run this script again on every
transition, not just the first load." One attribute, no logic
changes. **Any future `is:inline` `<head>` script whose job is to set
DOM state before paint needs this same attribute**, for the same
reason — worth remembering if another one gets added later.

Verified live: set dark mode, clicked through two chained soft
navigations (Blog → Workbench → About), `data-theme` stayed `"dark"`
at every stop; the theme-toggle button itself still correctly flips
to light and persists to `localStorage` afterward.

### Search/sort row narrowed back down; sticky table of contents added to posts

Two more changes, same session:

- **Search/sort row narrowed to match the post-list column only**
  (`blog/index.astro`) — reverted the earlier full-hero-width version:
  the row moved back inside the grid's left column. Verified live:
  row's left/right edges (145/829) match `#post-list`'s exactly;
  search filtering still works.
  - **RSS moved back to the hero panel**, its original spot (below
    the intro paragraph, above the category filter buttons) — no
    longer lives in this row at all, per direct request ("as
    earlier"). Same markup as the original placement, just
    reinstated.
  - **Row is now just Search (left) / Sort (right)** — a plain
    `flex justify-between` (search `flex-1`, sort `shrink-0`), not the
    3-column `grid-cols-[1fr_auto_1fr]` from when RSS still lived
    here. Search additionally has a small `ml-2` nudge right, per
    direct request.
  - **Row's own left edge shrunk in with `ml-[26px]`** so it lines up
    with the actual post *cards'* left edge (171px) below it, not just
    `#post-list`'s outer container edge (145px, where the timeline
    border sits) — the cards themselves are indented past that border
    by `border-l-2` + `pl-5`. Verified live: row and first post card
    share the identical left edge (171) and right edge (829).
  - Given how many shapes this one row has cycled through this
    session (dropdown-in-hero → narrow-in-column → full-width-3-up →
    narrow-3-up → narrow-2-up-RSS-in-hero → **same, shrunk to align
    with the post cards** — current), **check this note for the
    current shape before changing it again** rather than assuming an
    earlier commit's description still applies.
- **Sticky table of contents on blog posts** (`blog/[id].astro`) — a
  left-side "On this page" nav, `xl:` breakpoint and up only (that's
  the first width where the max-w-4xl article, centered inside a new
  max-w-6xl outer grid, reliably leaves room for a 200px column
  without crowding the prose). Built from `render(post)`'s own
  `headings` array (Astro's markdown pipeline slugs headings by
  default via github-slugger and stamps that slug as the `id=` on the
  rendered heading — no separate id-generation needed, `#slug` links
  just work), filtered to `depth === 2` since that's every post's
  actual section-heading level. Only renders at all when a post has
  more than one H2 — not worth showing for a short, single-section
  post.
  - **Real bug caught and fixed before landing**: the outer grid
    initially had `items-start`, which meant the TOC's `<nav>` grid
    cell only took the height of its own (short) content instead of
    stretching to match the (much taller) article column — leaving
    the inner `sticky top-24` div almost no room to actually stick as
    the reader scrolls, so it would unstick and scroll away almost
    immediately instead of following down the page. Removed
    `items-start` (back to default `stretch`) — verified live via
    `getBoundingClientRect`: `<nav>`'s height now matches the
    article's exactly (both 2479px on the LLM post), giving the
    sticky child room to travel for the whole article length, not
    just the first screenful.
  - Active-section highlighting is a scroll-spy
    (`IntersectionObserver`, `rootMargin: "-96px 0px -70% 0px"` so a
    heading counts as "active" once it's near the top of the
    viewport, not just anywhere on screen), wrapped in the same
    `let`-binding + `astro:page-load` re-init pattern as this file's
    existing reading-progress script — a soft navigation between two
    posts swaps in a completely different heading set, so the
    previous post's observer is explicitly disconnected before a new
    one is created.
  - **Known verification gap, not a suspected bug**: this
    environment's Browser pane reports `document.hidden: true` /
    `visibilityState: "hidden"` (confirmed directly), and neither
    `window.scrollTo` nor `scrollIntoView` actually changes
    `window.scrollY` here — the same underlying compositing
    limitation that's blocked real screenshots elsewhere in this
    project's history. Everything *structurally* checked (TOC renders
    with correct headings/links matching real heading `id`s on every
    post, hidden correctly below `xl:`, sticky container height fixed
    and confirmed) — the one thing not verified with an actual scroll
    is the live highlight-swap itself. Worth a real-browser check.
  - Hit the same Astro compiler error as an earlier pass in this same
    session: an HTML comment as the first child inside a
    `{condition && (...)}` expression is invalid ("Unexpected
    token") — moved outside the `{}` both times it came up. Worth
    remembering as a standing gotcha for this codebase, not just a
    one-off.

### Same sticky table of contents added to Workbench project pages

Direct follow-up ("I also need on this page for opened workbench
similar to notes"): `projects/[id].astro` got the identical treatment
`blog/[id].astro` got — same `xl:grid-cols-[200px_1fr]` outer grid (no
`items-start`, for the same sticky-container-height reason), same
`headings` destructured from `render(project)` filtered to `depth ===
2`, same `.toc-link` + `IntersectionObserver` scroll-spy script
wrapped in `astro:page-load`. Applied correctly on the first pass this
time (comment placed outside the `{}` expression from the start, no
repeat of the compiler error above).

Verified live on all 3 real projects: TOC renders with the correct
heading text and working `#slug` anchors on each
(`onefolder-family-vault` — 5 headings, `ai-sales-dashboard` — 3,
`personal-portfolio-site` — 3); `<nav>` height matches `<article>`
height exactly (1549px both, on the OneFolder project) confirming the
sticky child has proper room to travel; hidden below `xl:` with no
horizontal overflow at 1024px. Same known gap as the blog version:
this environment's Browser pane can't actually scroll
(`document.hidden: true`), so the live highlight-swap itself isn't
visually confirmed, only everything structural around it.

### Timeline line removed entirely; footer alignment actually fixed

Two more direct fixes, closing out this session's longest-running
thread (the post-list timeline line had been added, reverted, added
back recalibrated, and patched for a 2px kink — five separate attempts
across this conversation) and a real structural bug in the footer:

- **The vertical line is gone, for good this time** — not reverted
  back to the original `border-l-2` design either; removed outright,
  per direct request ("remove the vertical line ... and align the
  glass boxes"). `#post-list` no longer has `border-l-2` or the
  `pl-5 sm:pl-6` indent that used to make room for it, and the
  search/sort row's matching `ml-[26px]` nudge (added specifically to
  line the row up with where the indented cards used to start) is
  gone too — keeping either of those without the line would have left
  an unexplained empty gutter with nothing marking it. Post cards and
  the search/sort row now both start at the same flush left edge
  (145px, matching the hero panel), no line, no indent.
- **Footer's actual misalignment root cause, found and fixed**:
  `Footer.astro` used `<footer class="px-4 pb-4 mt-6">` wrapping
  `<div class="mx-auto max-w-5xl">` — padding *outside* the
  `max-w-5xl` box. Every other page container on the site instead
  puts padding *inside* the `max-w-5xl` box on the same element
  (`mx-auto max-w-5xl px-6 ...`, e.g. `blog/index.astro`'s outer div).
  Since footer's `max-w-5xl` div had no padding of its own, its glass
  panel filled that box edge-to-edge — a full 24px wider on each side
  than every other page's glass panels, which sit *inset* by their
  container's own `px-6`. This had been wrong the whole time, not a
  regression from anything else changed this session; it just hadn't
  been directly reported until now. Fixed by matching the exact same
  `mx-auto max-w-5xl px-6` pattern (footer's own `pb-4` moved onto
  that same div, `px-4` dropped). Verified live: footer's glass panel
  and the hero panel now share the identical left/right edges (145 /
  1121) — previously 121 / 1145, a consistent 24px overshoot on both
  sides, confirming the diagnosis was the padding location, not a
  rounding or breakpoint issue.

Both verified together: search filtering still works, no horizontal
overflow at 375px mobile width.

- **Same timeline line also removed from the homepage** ("there is
  one more vertical line on Notebook page" — the homepage's own
  eyebrow calls it "Professional Notebook"). `index.astro`'s "Field
  Notes preview" section had the identical `border-l-2 border-line
  pl-5 sm:pl-6` wrapper around its `PostCard` previews — same design
  pattern, same removal. `PostCard` already carries its own `mb-4
  last:mb-0` spacing, so the wrapper div was only ever there for the
  line/indent; removed the classes and left a plain unstyled `<div>`
  around the map. Verified live: zero `.border-l-2` elements left on
  the homepage, first preview card now flush at the same 145px left
  edge as the hero panel. A full-codebase grep for
  `border-l-2 border-line` afterward confirmed no other instance of
  this specific timeline pattern remains anywhere on the site — the
  three remaining plain `border-l border-line` hits elsewhere (a nav
  divider between page links and the Connect icons, and the two new
  table-of-contents sidebars' own left rule) are unrelated, intentional
  UI, not leftovers of this one.

### Real bug: blog post / project pages were wider than the rest of the site

Reported directly ("opened workbench or notes footer is not
aligned"). Root cause: adding the sticky TOC to `blog/[id].astro` and
`projects/[id].astro` had widened their outer container from
`max-w-4xl` to `max-w-6xl` (1152px) to make room for a `[200px_1fr]`
grid column — wider than the `max-w-5xl` (1024px) every other page,
the nav, and the footer are built to. Confirmed live before fixing:
article glass card at 313–1185, footer at 145–1121 — visibly
different bounds, not just a rounding difference.

Fix, both files: reverted the outer container back to
`mx-auto max-w-5xl px-6 ...` (matching site-wide standard exactly),
and the article back to `max-w-4xl mx-auto relative` inside it — the
*original* pre-TOC relationship (article narrower than the page's
own standard width, a deliberate reading-width choice, not a bug).
The TOC no longer widens the container at all — it's positioned with
`absolute top-0 bottom-0 -left-[232px] w-[200px]` on the article
(which is `position: relative`), breaking out into the page's own
margin instead. `top-0` + `bottom-0` with no explicit height still
stretches the `<nav>` to the article's full height (same fix as the
`items-start` pitfall found earlier), so the sticky child keeps its
full room to travel. Breakpoint moved from `xl:` (1280px) to `2xl:`
(1536px) — reaching 232px into the margin (further out than the old
max-w-6xl version needed, since it's now breaking out past
`max-w-5xl` itself rather than just past `max-w-4xl` inside a wider
container) needs more real margin than `xl:` reliably has.

Verified live at three widths: **2560px** — article glass (825–1721)
centered on the exact same midpoint (1273) as footer (785–1761), just
narrower, confirming the *original* intended relationship is restored;
TOC sits in the margin (593–793) with a clean 32px gap before the
article, no overlap; `<nav>` height still matches `<article>` height
exactly (2704px / 1549px, on the two respective pages tested).
**1280px** (below the new `2xl:` cutoff) — article and footer share
the identical center point (633) on both a blog post and a project
page; TOC correctly hidden; no horizontal overflow. **375px mobile** —
no horizontal overflow. Confirms the fix holds at every scale, not
just the one width it was diagnosed at.

**Follow-up, same fix, sent as a screenshot**: sharing a center point
wasn't actually enough — a `max-w-4xl` article centered inside a
`max-w-5xl` container has the *same midpoint* as the footer below it
but visibly different edges (896px vs 976px wide), which reads as
"not aligned" at a glance regardless of the underlying math being
correct. Removed `max-w-4xl mx-auto` from `<article>` in both files
entirely — it now fills its `max-w-5xl` container's full width, same
as the footer's glass panel, so the two line up edge-to-edge. The TOC
positioning (`-left-[232px]`, relative to the article) didn't need to
change — it's an offset from the article's own edge either way, it
just now starts from a position 40px further left than before (since
the article itself moved 40px left to fill the wider container).
Verified live on the personal-portfolio-site project: article and
footer glass panels now match exactly (145/1121 both, confirmed via
`===` comparison, not just visual inspection) at 1280px; at 2560px
the TOC still clears the (now-wider) article with a clean 32px gap,
no overlap; no horizontal overflow at 375px mobile.

### Header redesign — compared 4 real templates, picked "closest to current"

Built a temporary, unlinked preview page
(`header-templates-preview.astro`, deleted once a choice was made —
not committed) showing four full, real header templates side by side,
since the generic visualize tool's own design constraints (flat, no
custom fonts/blur) can't reproduce this site's actual glass/serif
look: **A** — a refined version of the existing full-width sticky
glass bar; **B** — a floating rounded-full pill with centered links
and a solid "Connect" button; **C** — a centered masthead (Seal/name
in the middle, links split left and right); **D** — flat, no glass at
all, just a hairline bottom border with wide-spaced mono links.

**Template A picked** — closest to the nav that already existed, so
the only real change was cosmetic: the Seal icon and the name used to
be two separate `<a href="/">` links sitting side by side (an old
pattern from when the Seal alone was `aria-label="Home"` and the name
was a second, independent link) — merged into one link wrapping both,
`aria-label="Home — {name}"` on the link itself so it still has a
correct accessible name on mobile (where the name text is
`hidden sm:inline`, so without the aria-label the link would have no
accessible name at all below `sm:` since the Seal is itself
`aria-hidden`). The aria-label containing the full visible name as a
substring keeps this compliant with WCAG 2.5.3 (Label in Name) at
desktop widths where the name is visible too.

Verified live: exactly one `header a[href="/"]` now (was two),
correct `aria-label`; theme toggle still flips `data-theme` correctly
both directions; Connect icons unaffected; mobile hamburger still
opens the menu with no horizontal overflow at 375px.

## Working on this project

- **Every Workbench (project) write-up follows the same five-section
  template, in order** — per direct request: `## The Problem`,
  `## What it does`, `## How it is built`, `## A simple tech stack workflow
  to understand`, `## Where it stands`. Documented in `README.md`'s
  project-authoring template. All 4 existing projects
  (`onefolder-family-vault`, `ai-sales-dashboard`, `personal-portfolio-site`,
  `mql-assistant`) were rewritten to this shape in one pass — earlier
  ad-hoc headings (`The idea`, `What it is`, `How it works`, `Why I'm
  building it`, etc.) are gone; motivation that used to live in a separate
  `Why I'm building it` section is now folded into the end of `The
  Problem`. **A new project write-up should use this exact heading set,
  not a bespoke structure** — the "tech stack workflow" section is the one
  most likely to be skipped by habit; don't skip it.
- **The "tech stack workflow" section is a fenced-code arrow diagram, not
  a paragraph** — per direct follow-up feedback ("should be like a
  workflow and visual") after the first pass wrote it as prose. Pattern: a
  fenced code block with one stage per line (`Input` / `→ step` / `→ step`
  / `→ output`), then at most one or two sentences of context after it.
  All 4 existing write-ups were converted to this shape; template updated
  in `README.md` to match. Renders inside `.prose pre` (bordered,
  monospace) so it already reads as a distinct diagram-like block against
  the rest of the write-up — no new component needed.
- Nav labels (About Me / Notes / Workbench) are defined once in
  `src/components/Nav.astro` — don't hardcode nav links elsewhere.
  ("Notes" is the nav label and page eyebrow/title; the route is still
  `/blog` and the page's own H1 is still "Field Notes" — only the
  visible "Blogs" labels were renamed, not the URL, per direct
  request to keep this a label change, not a URL restructuring.)
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
