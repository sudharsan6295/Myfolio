---
title: "INAI — A Personal AI Assistant"
summary: "A local-first desktop assistant for one person: INAI, the assistant you talk to, oversees eight specialist agents for cards, mail, markets, news, career, notes, links and life admin. Runs on my own PC, encrypted, read-only on my accounts."
status: "prototype"
startDate: 2026-10-20
stack: ["Node.js", "TypeScript", "React", "Vite", "SQLite", "Claude", "MCP", "Telegram Bot API"]
video: "/videos/inai-trailer.mp4"
videoPoster: "/videos/inai-trailer-poster.jpg"
featured: true
order: 11
---

## The Problem

Every day I repeat the same rounds: card statements, an inbox full of noise, a
portfolio check, news I would rather have filtered, ideas I forget, bills and
renewals. Each lives in a different app, and no single place tells me what
actually needs me today. Cloud assistants could help, but they would need
standing access to my mail, cards and holdings, which is more trust than I want
to hand over. I wanted one assistant with its own team of agents, running on my
own machine.

## What it does

I talk to INAI by typing, speaking or over Telegram, and it answers from what
its agents found. Eight agents each own one area: Life Admin (to-dos, reminders,
bills), Card Ledger (statements and spend from Gmail, which card earns most),
Mail Watch (keeps only the important emails: Done, Ignore or Add to-do), Market
Watch (portfolio moves, red flags, add/trim/exit calls with reasons), News Radar
(de-duplicated, ranked headlines), Career Radar (AI product management reads),
Ideas & Notes and Social Inbox (things I send to my Telegram bot, briefed and
filed). Saying "brief me" produces a morning, evening, weekly or monthly brief,
and every answer is kept as text in an Answers panel.

## How it is built

A Node process serves a local API on 127.0.0.1 with an encrypted SQLite store
(AES-256-GCM, key protected by the Windows login). The window is React and Vite,
signed in with a one-time code, so there is no open port. Each agent may reach
only its own list of sites, and every outgoing and AI call lands in a privacy
log. Gmail access is read-only; paying, posting, ordering, trading and deleting
are blocked outright. Untrusted text such as emails is passed to the AI only as
data, and emails aimed at AI assistants are never judged by the AI at all. Every
prompt is versioned in one file, with eval sets that score the rules offline,
and Done/Ignore and Helpful clicks become quality labels.

## A simple tech stack workflow to understand

```
Ask INAI (type / voice / Telegram)
→ INAI picks the agents it needs (read-only tools)
→ agents read Gmail, portfolio, news, notes
→ figures checked, untrusted text kept as data
→ answer + brief saved to the Answers panel
```

Everything runs and is stored on the PC; only the AI calls and each agent's
allowed sites leave it, and all of them are logged.

## Where it stands

Working daily on my own machine, with a Windows installer (zip plus
Install.cmd) and over a hundred automated tests. It is a personal tool, not a
product: the Market Watch calls are AI-generated and not financial advice, and
the code is not public yet. Next up are a signed native shell and a public
release checklist for sharing it safely.
