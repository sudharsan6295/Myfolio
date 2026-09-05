---
title: "Field-Brief Intelligence Dashboard"
summary: "An on-demand AI-generated intelligence brief for any tracked customer — company overview, recent developments, and suggested talking points — sourced from the company's own website, LinkedIn, and web search, with citations, not guesses."
status: "prototype"
startDate: 2026-08-01
stack: ["Next.js", "TypeScript", "Tailwind CSS", "Gemini API", "Tavily", "Supabase (Postgres)", "Vercel"]
featured: false
order: 3
---

## The Problem

Before a call, a rep has to piece together who a company actually is, what's
changed recently, and who to talk to — scattered across the company's own
site, LinkedIn, and general search, redone from scratch by whoever's making
the call. Mostly I wanted to practice the thing I'm actually trying to get
good at: translating between what an AI system can do and what a business
user — in this case a sales team — actually needs from it, rather than
whatever looks most impressive in a demo.

## What it does

Track a list of customers; for any one of them, generate an on-demand
brief — Overview, Recent developments, Suggested talking points, and a
suggested Key Contact for outreach — sourced from real web search, with the
source links kept alongside it, not invented. A separate Opportunity
Discovery feature runs the search the other way: starting from what you
sell, it surfaces companies you don't yet track that show a real signal of
needing it, each with a rationale, so you can add a promising one straight
to the customer list.

## How it is built

One orchestrator runs three research agents concurrently — Company Profile,
Recent Developments, Key Contact — each doing a web search and an AI read
of the results, followed by a synthesis pass that turns that research into
the final brief; one agent failing doesn't fail the whole brief, the gap is
just noted instead of invented. Supabase Postgres holds everything, reached
only through a server-side key with row-level security locking out every
other path — there's no per-user login, so a shared-password gate protects
the whole app instead, the right amount of auth for one internal team
sharing one customer list rather than individual accounts.

## A simple tech stack workflow to understand

```
Customer added to the list
   → "Refresh" triggers 3 research agents (concurrent)
   → each searches the web, then an AI read summarizes it
   → a synthesis pass turns that into overview / developments / talking points
   → brief shown to the rep, sources cited
```

Opportunity Discovery reuses the same search-then-summarize idea in the
other direction — starting from what you sell instead of a known company —
to surface leads you don't have yet.

## Where it stands

Live, behind a shared-password login gate rather than open to the public.
Verified end to end against the real app with real accounts, not mocked —
real briefs generated, real leads surfaced. A security review of its
auth/access-control was run and its one real finding (no login at all) was
fixed the same week. Still a single shared internal tool, not something
with individual accounts yet.
