---
title: "Findash — net worth, and the record behind it"
summary: "A personal finance app that shows a household's net worth as one live number, and keeps the record of accounts, loans and policies behind it — shared read-only with a few trusted people."
status: "live"
startDate: 2026-08-01
stack:
  [
    "Next.js 16 (App Router)",
    "TypeScript",
    "Tailwind CSS v4",
    "Supabase (Postgres, Auth, Storage, RLS)",
    "dnd-kit",
    "Resend",
    "Vercel (hosting + cron)",
  ]
links:
  demo: "https://one-folder.vercel.app/"
featured: true
order: 1
---

## The Problem

There is no one place that says what a family is worth. Shares sit with a
broker, PPF with a bank, EPF with the government, the home loan on an
emailed statement. Adding it up means opening six apps.

And usually one person holds that whole picture in their head. Over
₹1 lakh crore sits unclaimed with Indian banks and regulators — mostly
because nobody else knew where to look.

## What it does

Shows net worth as one number: everything owned minus everything owed,
with a trend line. Goals let you drag a holding onto a target and see the
growth rate you would still need. The Portfolio Tracker groups shares and
funds your own way and shows profit, allocation and CAGR per group. Gold,
FDs and PPF sit on a separate board so a big balance there does not skew
the equity view.

Behind the number is the Ledger — each account, loan and policy with its
nominee, due date and document. You can invite up to four trusted
contacts. Each one sees only the entries you tick, read-only, and every
view is logged.

## How it is built

Sign-in requires an authenticator code. Access rules live in the database
itself, so a trusted contact can only read a row you explicitly shared.
Account numbers are encrypted before they are stored, and the edit history
never records them — a log of decrypted account numbers would undo the
encryption.

## A simple tech stack workflow to understand

```
Sign in (Supabase Auth + TOTP)
   → add a holding → encrypted → Postgres
   → net worth, goals and portfolio all read that one table
   → share entries → invite by email (Resend)
   → contact signs in → database rules decide what they see
   → daily Vercel cron → emails what is due next
```

Next.js renders and routes; Supabase stores and enforces.

## Where it stands

Live on Vercel.
