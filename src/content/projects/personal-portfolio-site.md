---
title: "Personal Portfolio & Blog"
summary: "This site — a personal portfolio and blog built so that publishing something new is just adding a Markdown file, not touching code. You're looking at the current build."
status: "prototype"
startDate: 2026-08-23
stack: ["Astro", "TypeScript", "Tailwind CSS", "Netlify Forms"]
featured: true
order: 3
---

## What it is

About Me, Blogs, and this Workbench section — all real content living in
plain Markdown files, not hardcoded into components. Adding a new blog post
or project is: drop a file in the right folder with the right frontmatter,
redeploy, done.

## How it's built

Astro's content collections hold three schemas — blog posts, projects, and
a single About Me entry — each validated at build time, so a malformed
frontmatter field fails the build loudly instead of shipping a broken page.
The design system is a warm, editorial "field notebook" identity (not a
corporate directory look): a burgundy-and-brass palette, a serif display
face paired with a mono utility face for dates and tags, and a rotated
ink-stamp component used for categories and status labels throughout.

A few specific pieces worth naming: the Blogs page filters by category and
lets a visitor subscribe by the topics they actually care about (Netlify
Forms, no backend to run); the nav has a click-to-enlarge photo and a
"Connect" panel with email/LinkedIn/GitHub; and the whole thing is a fully
static build — no server to keep running, no database.

## Where it stands

Feature-complete for a first version and actively maintained — not yet
deployed to a public domain.
