---
title: "ClearPath AI Governance"
summary: "A reference site and toolkit for AI governance — rules by region (EU, US, UK, India), a learning path per role, and in-browser tools that turn answers into registers, policies and board reports. Private by design: nothing leaves the browser."
status: "prototype"
startDate: 2026-10-01
stack: ["Astro", "TypeScript", "Web Crypto", "Web Workers", "CSS"]
links: {}
featured: false
order: 8
---

## The Problem

AI governance advice is scattered across laws that differ by country, standards
behind paywalls, and vendor blogs that sell a product. A team that just wants to
know "which rules touch this system, and what do we do on Monday?" has to piece
that together from a dozen places, then build every register, policy and report
from a blank page. Worse, most tools that help ask for an account and your data
up front — exactly what a governance team shouldn't hand over casually.

## What it does

It gives each reader a path: leaders, builders, compliance, procurement or HR.
Region pages show the instruments, key dates and regulators for the EU, US, UK,
India and global frameworks, each record carrying a certainty label ("confirmed",
"simplified", "unsettled", "unverified") and a review date. 32 in-browser tools
cover the working steps — screening a system against the EU risk tiers, an AI
register, vendor due diligence, impact rating, controls, incidents, a RACI, a
policy builder, maturity roadmap and a board report — and 44 templates download
as DOCX, XLSX, CSV or Markdown. Lessons and quizzes sit alongside.

## How it is built

A static Astro site with no runtime AI and no cookies. Legal facts live in JSON
files, not components, and a validation script fails the build on a missing
source, an unverified record without a note, or a record not reviewed in 180
days. Tool state lives in the visitor's own browser (session storage by default,
optional local saving), exports run client-side with hand-written DOCX, XLSX and
ZIP writers, and workspaces can be exported with password encryption (AES-GCM).
Rules logic is plain functions with unit tests, and the page security policy
blocks every third-party request unless analytics is switched on.

## A simple tech stack workflow to understand

```
Pick a role → learning path and recommended tools
   → answer the screening questions (yes / no / unknown)
   → rules engine → risk tier and "may apply" list
   → register, controls, vendor and incident tools
   → workspace held in the browser, optionally encrypted on export
   → board report / DOCX / XLSX / CSV
```

Unknown answers never count as "no" — the engine returns "may apply", so a gap
in what you know shows up as a prompt to check, not a false all-clear.

## Where it stands

Prototype. The structure, tools and tests are in place, and every legal record
is still marked Draft: nothing is shown as confirmed until it's checked against
a primary source and reviewed by counsel. It is reference material, not legal
advice. Deployed on Vercel from a private repository for now.
