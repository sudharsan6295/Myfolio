# Personal Site

A personal blog / portfolio — About Me, Notes, and Workbench (projects) — built
so that **updating content never means touching code**. Every real word on
this site (bio, work history, blog posts, project write-ups) lives in a plain
Markdown file under `src/content/`. Add or edit a file, push, and the live
site picks it up on the next deploy. No component ever has real content
hardcoded into it.

- **Framework:** [Astro](https://astro.build) (static site generation,
  TypeScript, zero client-side JS by default)
- **Styling:** Tailwind CSS v4
- **Content:** Markdown files with frontmatter, read via Astro Content
  Collections (`src/content.config.ts`)
- **Hosting:** Netlify, auto-deploy on push to the connected Git branch
- **Fonts:** Space Grotesk (display), IBM Plex Sans (body), IBM Plex Mono
  (dates/tags/status labels)

---

## Running it locally

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # production build to dist/ — run this before pushing
npm run preview   # serve the production build locally
```

**Note:** the Notes page's subscribe form posts to a Netlify Function
(`netlify/functions/`), which plain `astro dev` can't run — that fetch
will fail locally with a real error, which is expected. To actually test
subscribing/unsubscribing locally, use the Netlify CLI instead:

```bash
npx netlify dev
```

That also needs `RESEND_API_KEY` (and optionally `RESEND_FROM_EMAIL`) set
— either in Netlify's dashboard (Site configuration → Environment
variables) for the deployed site, or in a local `.env` file for
`netlify dev`. Without `RESEND_API_KEY`, the scheduled notify function
just no-ops instead of failing.

To test the notify function without waiting on its daily schedule, set a
`MANUAL_TRIGGER_SECRET` env var (any random string) and hit:

```
https://<your-site>/.netlify/functions/notify-subscribers-test?secret=<that value>
```

---

## Folder structure

```
src/
  content.config.ts        # schema for every content type — the source of truth
                            # for what fields a post/project/about entry can have
  content/
    blog/                   # one .md file per blog post
      my-post-slug.md
    projects/               # one .md file per side project / MVP
      my-project-slug.md
    about/
      about.md              # exactly one file — your bio + work history
  components/                # PostCard, ProjectCard, StatusChip (status/category label), Nav, Footer
  layouts/
    BaseLayout.astro         # shared <head>, nav, footer — every page uses this
  pages/
    index.astro              # homepage
    about.astro               # renders src/content/about/about.md
    blog/index.astro          # blog listing + category filter
    blog/[id].astro           # blog post detail (one route per file in content/blog/)
    projects/index.astro      # project listing
    projects/[id].astro       # project detail (one route per file in content/projects/)
```

**The rule to remember:** the filename (minus `.md`) becomes the URL slug.
`src/content/blog/my-post-slug.md` → `/blog/my-post-slug`. Use lowercase,
hyphen-separated filenames.

---

## How to add a new blog post

1. Create a new file: `src/content/blog/your-slug-here.md`
2. Paste this template at the top, fill it in, and write the post below it in
   plain Markdown:

   ```markdown
   ---
   title: "Your post title"
   description: "One or two sentences — this shows in the listing and in link previews."
   pubDate: 2026-08-23
   category: "AI"   # any short label — not a fixed list; the blog page's filter
                     # buttons and subscribe checkboxes are generated automatically
                     # from whatever categories your posts actually use, most-used
                     # first. A brand new category just appears the next time you
                     # build; nothing else to register it in.
   tags: ["optional", "tags", "here"]
   featured: false   # true pins it to the homepage's Recent Entries rail
   draft: false      # true keeps it out of every listing/route until you're ready
   ---

   Your post content goes here, in regular Markdown — headings (`##`), lists,
   `> blockquotes`, `code blocks`, tables, and images all work.
   ```

3. Run `npm run build` locally (optional but recommended — it will error out
   if the frontmatter is missing a required field or has the wrong type).
4. Commit and push. The new post appears at `/blog/your-slug-here` and in the
   `/blog` listing automatically after the next deploy — no code changes.

To pull a post down temporarily without deleting it, set `draft: true`.

## How to add a new project (MVP / prototype)

1. Create a new file: `src/content/projects/your-slug-here.md`
2. Template:

   ```markdown
   ---
   title: "Project name"
   summary: "One sentence — what it is and why it exists. Shown on the listing card."
   status: "prototype"   # any short label — not a fixed list; the Workbench page's
                          # filter buttons are generated automatically from whatever
                          # statuses your projects actually use. "live"/"prototype"/
                          # "archived" are the conventional values and the only ones
                          # with a specific accent color (see `statusTone` in
                          # ProjectCard.astro and projects/[id].astro) — anything
                          # else still works, just with the default accent.
   startDate: 2026-01-01
   stack: ["Next.js", "Postgres"]   # shown as tags on the card
   links:
     demo: "https://..."      # optional — omit any you don't have
     repo: "https://..."
     writeup: "https://..."
   featured: false
   order: 0     # lower numbers sort first on the listing page
   draft: false
   ---

   The write-up always follows the same five sections, in this order, as
   plain `##` Markdown headings:

   ```markdown
   ## The Problem

   What was broken, missing, or annoying enough to build this for.

   ## What it does

   What it actually does for whoever uses it, in plain terms.

   ## How it is built

   The real implementation choices — not just the stack list above, but
   why it's built that way.

   ## A simple tech stack workflow to understand

   A visual step-by-step, not a paragraph: a fenced code block with an
   arrow chain (data/request in → what happens to it → what comes out),
   like this —

       ```
       Input
          → step
          → step
          → output
       ```

   — followed by at most one or two sentences of context. Someone
   unfamiliar with the stack should be able to follow the shape of it from
   the diagram alone.

   ## Where it stands

   Status in plain language: what's real and working, what's still ahead.
   ```

3. Commit, push, done — it appears at `/projects/your-slug-here` and on the
   `/projects` listing.

## How to update About Me / work experience

Edit the single file `src/content/about/about.md`. The frontmatter holds your
name, role, tagline, contact links, the "at a glance" fields below, and the
`experience` list (most recent role first); the Markdown body below the
frontmatter is your bio paragraph(s), shown at the top of the `/about` page.
There's only ever one file in this folder.

```yaml
photo: "./me.jpg"          # optional — put the image file next to about.md
photoAlt: "A photo of me"   # optional, defaults to "<name>'s profile photo"
social:
  linkedin: "https://www.linkedin.com/in/yourhandle/"
  github: "https://github.com/yourhandle"   # shows up in the nav's Connect
                                              # panel, the footer, /about, and
                                              # /projects — all four read from
                                              # this one field, add it once
currently: "One sentence on what you're focused on right now."
openTo:
  - "Target role title, e.g. AI Product Manager"   # shown as chips at the
                                                     # top of /about's sidebar
highlights:
  - "A short achievement sentence, ideally with a real number in it"
                                                     # shown as a simple
                                                     # checkmark list on
                                                     # /about, below the bio
focusAreas:
  - "Short tag, e.g. AI Product Strategy"
tools:
  - "Short tag, e.g. Python"
certifications:
  - "Short tag, e.g. Professional Scrum Master (PSM)"
education:
  - degree: "Degree name"
    institution: "School name"
    year: "2016"
principles:
  - title: "A short principle title"
    description: "One or two sentences explaining it."
experience:
  - company: "Company name"
    role: "Your title"
    start: "2023"
    end: "Present"     # or an end year
    location: "City"    # optional
    bullets:
      - "One accomplishment per line."
      - "Keep these concrete and specific — numbers help."
```

`photo`, `social`, `currently`, `openTo`, `highlights`, `focusAreas`, `tools`,
`certifications`, `education`, and `principles` are all optional — each
section on `/about` (and, for `social`, the nav's Connect panel and the
footer) only renders if its field is set/non-empty, so you can leave any
of them out. `photo` specifically only affects `/about` — the top nav's
header circle always shows the site's monogram, not your photo; with
`photo` set, `/about`'s intro panel shows a small thumbnail that opens
the full photo in a lightbox on click.

## Adding images

Drop the image file next to the post/project that uses it (or in
`src/assets/`), then reference it from frontmatter:

```yaml
coverImage: "./my-image.jpg"
coverImageAlt: "Describe the image for screen readers."
```

Astro optimizes and resizes it automatically at build time — no manual
compression step needed.

---

## Deploying (Netlify)

This repo includes `netlify.toml` (build command `npm run build`, publish
directory `dist`), so connecting it to Netlify is config-free:

1. Push this repo to GitHub.
2. In Netlify: **Add new site → Import an existing project**, pick the repo.
   Netlify will read `netlify.toml` automatically — no settings to fill in.
3. Every push to the connected branch triggers a new build and deploy.
   New/edited files under `src/content/` go live on the very next push —
   that's the whole content workflow.
4. Once you have a real domain, update the `site` field in
   `astro.config.mjs` (used for canonical URLs).
5. The Blogs page's "Get new posts by email" form uses
   [Netlify Forms](https://docs.netlify.com/manage/forms/setup/) —
   detection is automatic (Netlify scans the deployed HTML for the
   `data-netlify` form), no extra setup needed. Submissions show up under
   **Site → Forms** in the Netlify dashboard. Note that Netlify Forms only
   *collects* subscriber emails; it doesn't send anything to them when a
   new post goes up. Actually emailing subscribers needs a real mailing
   tool (Resend, Buttondown, Mailchimp, …) wired up separately — not built
   yet. The form also collects which category checkboxes a subscriber
   picked (same `categories` list as the blog filter buttons, in
   `src/pages/blog/index.astro`) — each submission shows up in the
   Netlify dashboard with its chosen categories, so a per-category send
   is a manual filter on that data today, not automatic.
