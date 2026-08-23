---
title: "Signal"
summary: "A triage assistant that reads incoming support tickets and proposes — never sends — the next action, so a human is always the last click before anything reaches a customer."
status: "prototype"
startDate: 2025-11-02
stack: ["Next.js", "Python", "pgvector", "OpenAI API"]
links:
  repo: "https://github.com/example/signal"
featured: true
order: 1
---

## The problem

A five-person support team was spending most of their morning triaging
tickets into the right queue before anyone could actually start solving them.
The sorting was mechanical; the solving was the part that needed a human.

## What it does

Signal reads an incoming ticket, retrieves the three most similar resolved
tickets from the last 90 days, and proposes a queue, a priority, and a draft
first response. It never sends anything on its own — every proposal sits in
a review state until a human approves or edits it.

## Why the "never sends" constraint mattered

The first version I built *did* auto-send low-risk responses, and it was
more efficient on paper. It also meant the one time it was confidently wrong
in testing, it was wrong in front of a real customer before anyone caught it.
Removing the ability to auto-send cost some efficiency and fixed the actual
problem: trust, not speed, was the thing the team was short on.

## Where it stands

Running against a shadow copy of real ticket traffic, not yet in front of
live customers. The retrieval quality is solid; the part I'm still iterating
on is the confidence signal that decides how much of the draft to show versus
how much to leave blank for the human to fill in themselves.
