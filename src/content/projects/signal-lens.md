---
title: "Signal Lens"
summary: "Analyzes your AI conversation history — Claude, ChatGPT, Gemini, Copilot, Cursor and more — entirely in the browser: usage, topics, quality and cost. Nothing is uploaded, and no model reads your conversations."
status: "live"
startDate: 2026-09-27
stack:
  ["Vanilla JavaScript", "HTML/CSS", "IndexedDB", "TF-IDF", "SVG charts"]
links:
  demo: "https://signal-lens-theta.vercel.app/"
  repo: "https://github.com/sudharsan6295/SignalLens"
featured: false
order: 6
---

## The Problem

Months of chats with Claude, ChatGPT and half a dozen coding assistants
pile up, and nobody actually knows what's in them — how much they're
costing in API-equivalent terms, whether a chat leaked a password, which
weeks were genuinely productive versus just long. Every one of those
tools' own export is a raw JSON or Markdown dump; nothing reads it back
and tells you anything about it.

## What it does

Imports exports from Claude, ChatGPT, Google Gemini, Microsoft 365
Copilot, GitHub Copilot, Cursor and Claude Code — or a generic
CSV/JSON/Markdown transcript — and turns them into activity trends with a
forecast, distinctive topics via TF-IDF, a "quality" read built from rule
signals like pushback and self-correction rather than another model's
opinion, a Luhn-verified sensitive-data scan for emails/keys/passwords,
and an API-equivalent cost breakdown that accounts for the "long-chat tax"
of re-sending history every turn. Every chart mark opens the conversations
behind it.

## How it is built

Classic scripts on one namespace, no bundler and no build step — it runs
from a static host or straight off disk. Each source has its own adapter
that normalizes an export into one shared format, stored in the browser's
IndexedDB, so no conversation ever leaves the machine it was imported on —
a hosted copy of the site never receives anyone's data either way.

## A simple tech stack workflow to understand

```
Export a .zip / .json / .md from Claude, ChatGPT, Copilot, Cursor, etc.
   → drop the file in the browser
   → an adapter detects the source and normalizes it
   → stored in IndexedDB (never uploaded)
   → analytics: TF-IDF topics, regex quality signals, sensitive-data scan, cost model
   → charts, drill-downs and notes, all client-side
```

## Where it stands

Live as a static deploy on Vercel — the same build runs unmodified on any
static host. Source on GitHub.
