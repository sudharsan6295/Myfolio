---
title: "OneFolder — a family vault"
summary: "A secure record of a family's bank accounts, loans, insurance, and investments — with view-only access for a handful of trusted people, so nothing sits undiscovered if something happens to the one person who kept it all in their head."
status: "prototype"
startDate: 2026-08-01
stack: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase (Postgres, Auth, Storage)", "Resend"]
links:
  demo: "https://one-folder.vercel.app/"
featured: true
order: 1
---

## The Problem

In most households, one person holds the complete mental map of the
family's finances — which bank accounts exist, which policies are active,
what's owed on what loan — and none of it is written down anywhere the rest
of the family can get to. In India alone, roughly ₹1.84 lakh crore in
financial assets currently sits unclaimed with banks and regulators, per
government disclosures. That's not fraud or negligence; it's just what
happens when the one person who knew where everything was isn't there to
say so.

## What it does

OneFolder lets you build a structured record across four categories — bank
accounts, loans, insurance policies, investments — each with document
uploads (a scanned passbook, a policy PDF). You invite up to four trusted
contacts by email; they get view-only access to whatever you choose to
share, an auto-generated plain-language emergency checklist built from your
own records, and an access log so you can see who looked at what and when.

## How it is built

Real Supabase Auth with mandatory MFA (TOTP, not a fixed code), Row Level
Security enforcing that a trusted contact only ever sees what's explicitly
shared with them, and every trusted-contact view logged through a database
function rather than a raw client write — so a view can't be forged or
skipped. Sensitive fields (account numbers, policy numbers) are encrypted
at the application layer before they ever reach the database.

## A simple tech stack workflow to understand

```
Sign up (Supabase Auth + MFA)
   → add a record → encrypted, then stored in Postgres
   → upload a document → Supabase Storage
   → invite a contact → Resend sends the email
   → contact opens the link → Row Level Security decides what they see
```

Next.js renders the app and handles routing; everything past that is
Supabase — Auth, Postgres, and Storage all enforcing the same rule, that a
trusted contact only ever sees what's explicitly shared with them.

## Where it stands

The MVP is built and verified end to end against the real backend — real
signup, real MFA, real encrypted records, real file uploads, real email
invites — not mocked. It's currently in testing with a small number of real
accounts, not yet publicly launched.
