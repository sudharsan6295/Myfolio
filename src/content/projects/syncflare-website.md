---
title: "SyncFlareTech Website"
summary: "A fast, animated business website for an IT services company: ten service lines, industry pages, refurbished stock priced live from a Google Sheet, and an enquiry form that emails the owner directly. Built spec-first, one approved phase at a time."
status: "live"
startDate: 2026-10-15
stack: ["Astro", "React", "Tailwind CSS", "TypeScript", "PHP", "Google Sheets"]
links:
  demo: "https://syncflare-website.vercel.app/"
featured: false
order: 10
---

## The Problem

SyncFlareTech sells ten quite different services, from server support and CCTV
to refurbished laptops and custom AI software. Their web presence was a
"Coming Soon" page, so a prospect had no way to see what the company actually
does, whether it serves their kind of business, or how to ask for a quote. The
owner also needed to change prices, stock and wording without calling a
developer, and to receive enquiries without paying for a separate CRM or form
service.

## What it does

The homepage lays out all ten service lines grouped by what they do for a
business (Run, Protect, Grow, Equip, Innovate), and each one opens a detail
page explaining what's included, who it's for and how it's delivered.
Industry pages (offices, retail, clinics, education, manufacturing and more)
show which services matter for that kind of business. The refurbished-IT page
lists real stock with prices, grades and warranty, read live from a Google
Sheet the owner edits, so marking a laptop sold out needs no rebuild. An
enquiry form, plus WhatsApp and call options, sends requests straight to the
owner's inbox, and there are pages to book a site visit, request a proposal
or get remote support.

## How it is built

A static Astro site, with React used only for interactive parts below the
first screen so the page a visitor lands on stays light and fast on a phone.
All text lives in one data file, and the production build refuses to run while
any placeholder is left, so unfinished copy can't go live by accident. The
enquiry form posts to a small PHP handler on the company's own hosting, with
validation rules shared between the browser and the server, a two-tier rate
limit, and a 25-case attack test suite run against the built handler in real
PHP (via WebAssembly, since none is installed locally). Analytics loads only
after consent. The work followed a gated process: a written spec approved
first, then code, testing, debugging and deployment, each phase signed off
before the next began.

## A simple tech stack workflow to understand

```
Owner edits text in one data file / stock in a Google Sheet
   → production build checks: no placeholders, tests and types pass
   → static pages (home, services, industries, policies)
   → visitor browses → stock page reads the sheet live
   → enquiry form → validated in the browser and again in PHP
   → rate limit → email to the owner's inbox
```

Content and stock changes go through the owner's own tools; only code changes
need a developer.

## Where it stands

Live on the company's own domain, [syncflaretech.com](https://www.syncflaretech.com),
hosted on Hostinger; the link above is the Vercel preview, which carries the
newest design changes before they're published to the live site. The spec,
test report and security audit are kept with the code, and the repository is
private.
