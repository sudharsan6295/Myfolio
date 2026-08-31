---
title: "MyFolio"
summary: "This site — a professional site for portfolio, Notes and Workbench - built so that publishing something new is just adding a Markdown file, no code required. You're looking at the current build."
status: "prototype"
startDate: 2026-08-23
stack: ["Astro", "TypeScript", "Tailwind CSS", "Netlify Functions", "Netlify Blobs", "Resend"]
links:
  demo: "https://sudharsanbalaji.com"
featured: true
order: 3
---

## The Problem

Most personal sites either go stale because updating them means touching
code, or they lean on a heavy CMS just to publish a paragraph of text. I
wanted neither — a site where adding a new post or project is exactly as
easy as writing a Markdown file, with nothing else standing in the way of
actually publishing.

## What it does

About Me, Notes, and Workbench section — all real content living in
plain Markdown files, not hardcoded into components. Adding a new blog
post or project is: drop a file in the right folder with the right
frontmatter, redeploy, done. The Notes page filters by category and lets a
visitor subscribe by topic — a real pipeline, not just a form that
collects addresses nobody reads, emailing subscribers when a genuinely
new post goes up. The About page has a click-to-enlarge photo.

## How it is built

Astro content collections hold the blog posts, projects, and About Me
content, each checked against a schema at build time — a bad frontmatter
field fails the build instead of shipping a broken page. The look has
already been rebuilt once: it started as a warm "field notebook" style and
is now a flatter, more technical one, but the underlying content and
structure never had to change for that.

The subscribe pipeline is a small serverless setup living outside Astro's
own build: a Netlify Function stores each subscriber in Netlify Blobs (a
key-value store, no separate database), and a scheduled function checks
the site's own RSS feed daily, emailing only the subscribers whose topic
picks match a genuinely new post, via Resend.

## A simple tech stack workflow to understand

```
Markdown file (+ frontmatter)
   → Astro content collection (schema-checked)
   → page template renders it
   → static HTML at build time
   → deployed to Netlify
```

Every page itself is zero-runtime — Netlify just serves the static files.
The one exception is the subscribe/notify pipeline, a small serverless
layer that runs independently of the static build and doesn't touch it.

## Where it stands

This is my own site — I use it to publish my writing and track my own
projects, not a product I'm shipping for other people to sign up for.
It's live on its own domain, I update it constantly, and there's no
separate "launch" moment coming.
