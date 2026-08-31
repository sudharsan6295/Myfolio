---
title: "Field-Brief Intelligence Dashboard"
summary: "A prototype dashboard where AI agents do the first pass on sales pipeline data — pulling it together, summarizing what changed, and surfacing which accounts actually need attention today, instead of a rep piecing that together by hand."
status: "prototype"
startDate: 2026-08-01
stack: ["AI Agents", "LLM APIs"]
links:
  demo: "https://field-brief-beta.vercel.app/"
featured: false
order: 2
---

## The Problem

Most sales dashboards show you everything and prioritize nothing. A rep
still has to read the whole pipeline to figure out what actually needs
attention today — which accounts moved, which ones are stalling, which one
genuinely needs a decision from them this week. Mostly I wanted to practice
the thing I'm actually trying to get good at: translating between what an
AI system can do and what a business user — in this case a sales team —
actually needs from it, rather than whatever looks most impressive in a
demo.

## What it does

An AI agent takes the first pass on the pipeline instead of the rep. It
pulls the data together, summarizes what's changed since the last
check-in, and surfaces the handful of accounts that genuinely need a
decision — not a wall of rows sorted by last-modified date.

## How it is built

Early-stage: an LLM sits in front of the pipeline data and does the
summarizing and prioritizing work an analyst would otherwise do by hand.
The design deliberately keeps the model's job narrow — read, summarize,
flag — rather than letting it also decide what to do about an account,
since that decision still belongs to the rep.

## A simple tech stack workflow to understand

```
Pipeline data
   → LLM agent reads it
   → summarizes what changed
   → flags the accounts that need a decision
   → short brief delivered to the rep
```

No dashboard full of filters to configure first — the agent does the
sorting a rep would otherwise do by hand.

## Where it stands

Early-stage prototype, actively being worked on — not yet in front of real
users. Details here will fill in as it takes shape.
