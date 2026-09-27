---
title: "Nexus"
summary: "A desktop time tracker for Windows — track categories with play/stop, notes, and week/month analytics. Everything stays on your machine, nothing goes to a cloud account."
status: "prototype"
startDate: 2026-09-21
stack: ["Python", "pywebview", "JavaScript", "HTML/CSS"]
links:
  repo: "https://github.com/sudharsan6295/Nexus"
featured: false
order: 7
---

## The Problem

A workday scatters across a dozen small activities, and by evening it's
hard to say where the time actually went — meetings, focused work, email
all blur together without something running in the background to mark
the boundaries as they happen. Most time trackers either want a
subscription and a cloud account, or ask for a timesheet filled in after
the fact, once you've already forgotten.

## What it does

A small always-on-top desktop widget: pick a category, hit play, and it
tracks that block of time — with a note attached if you want one — until
you stop or switch categories. Week and month views turn those sessions
into simple analytics, so the split is something you can actually see,
not just estimate at the end of the day.

## How it is built

A Python backend (`pywebview`) opens a native window around a small local
HTTP server that serves a plain HTML/CSS/JS UI — no browser, no Electron,
just Python and the OS's own webview. Every action goes through a tiny
local API (add a session, rename a category, resize the window) that
reads and writes one JSON file on disk. There's no network call anywhere
in the app, and everything typed in — category names, colors, notes — is
validated and length-capped on the Python side before it's written, not
just in the UI.

## A simple tech stack workflow to understand

```
Launch Start Time Widget.bat
   → pywebview opens a native window
   → a local HTTP server serves ui/ (HTML/CSS/JS)
   → hit play on a category → session recorded
   → every read/write goes through the local API
   → data/time_data.json
   → week/month views compute analytics from that same file
```

Nothing here leaves the machine — the "backend" is a loopback server
talking to a JSON file, not a cloud service.

## Where it stands

Source on GitHub. Runs locally on Windows with no install beyond Python
and one dependency (`pywebview`); tracked time is never part of the repo.
