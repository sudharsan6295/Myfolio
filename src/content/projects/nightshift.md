---
title: "Nightshift"
summary: "An on-call assistant that summarized overnight alerts into a single morning digest, ranked by 'would a human actually have woken up for this.'"
status: "archived"
startDate: 2024-09-01
stack: ["Node.js", "Slack API", "Anthropic API"]
links:
  writeup: "https://example.com/blog/nightshift-postmortem"
featured: false
order: 3
---

## The idea

An engineering team was getting 40-60 automated alerts overnight, almost all
low-severity, with the genuinely urgent ones buried in the noise. Nightshift
pulled every overnight alert, clustered related ones together, and posted a
single ranked digest at 8am instead of a wall of individual pings.

## Why it's archived, not live

The clustering worked well. The ranking didn't, reliably enough — "would a
human have woken up for this" turned out to depend on context the alerts
themselves didn't contain (what shipped yesterday, who's on call, what broke
last time this alert fired), and stitching all of that together correctly
was a bigger project than the 2-week prototype window I'd given it.

## What I took from it

This is the project that convinced me a lot of "summarization" problems are
actually "we're missing a piece of context that isn't in the text we're
summarizing" problems. That reframing has been useful on almost every
project since, even though this particular tool didn't make it past the
prototype stage.
