---
title: "Fieldnotes CLI"
summary: "A tiny command-line tool that turns a folder of dated Markdown files into a searchable, taggable personal log — built because every notes app I tried wanted to be a database."
status: "live"
startDate: 2025-06-14
stack: ["Rust", "SQLite (FTS5)"]
links:
  demo: "https://example.com/fieldnotes"
  repo: "https://github.com/example/fieldnotes"
featured: true
order: 2
---

## Why I built it

I wanted a place to jot down one-line observations from meetings, user
interviews, and eval reviews — the kind of note that's useless in isolation
but valuable once you can search six months of them. Every notes app I tried
wanted me to organize things into folders and tags *before* I knew what
mattered. I wanted the opposite: write first, structure never, search later.

## How it works

`fieldnotes add "eval regression only shows up above 200 tokens of context"`
appends a timestamped line to today's file. `fieldnotes search "regression"`
runs a full-text search across every file using SQLite's FTS5 index, rebuilt
on every add in under a few milliseconds. No server, no account, no sync —
just a folder of plain text files and a fast index on top of them.

## What I'd change

It's genuinely the tool I use daily, which is a rarer outcome for a side
project than I'd like to admit. The one thing I keep meaning to add is a
`--since` flag for date-ranged search, since "what did I notice about this
in the last two weeks" comes up more than plain keyword search does.
