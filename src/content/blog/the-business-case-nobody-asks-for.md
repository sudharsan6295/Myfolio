---
title: "The Business Case Nobody Asks For: What Happens When the Model Is Wrong"
description: "Every AI pitch deck has a cost-savings slide. Almost none of them have a cost-of-error slide. Here's how I build one."
pubDate: 2026-03-04
category: "Business"
tags: ["risk", "roi", "decision making"]
featured: true
---

Every AI project I've been asked to greenlight arrives with the same pitch:
here's what it costs to run, here's what it saves, here's the payback period.
That's half a business case. The half that's usually missing is: what does it
cost when it's *wrong*, and how often does that happen?

## Two numbers that change everything

Before I approve budget for a model-backed feature, I ask for two numbers
that almost never show up in the original proposal:

1. **Cost of a false positive** — the model says yes when the answer is no.
2. **Cost of a false negative** — the model says no when the answer is yes.

These are rarely symmetric, and the asymmetry is usually the whole decision.
A fraud model that's too aggressive blocks legitimate customers — annoying,
recoverable, a support ticket. A fraud model that's too lax lets fraud
through — expensive, sometimes regulatory, occasionally a headline. Optimizing
for "accuracy" as a single number quietly picks a side in that tradeoff
without anyone in the room agreeing to it.

## The spreadsheet that actually matters

The version of the business case I trust looks less like a savings
calculation and more like a small decision table:

| Scenario | Frequency (est.) | Cost per occurrence | Who owns the fix |
|---|---|---|---|
| Correct automation | 92% | — (this is the savings) | — |
| False positive | 5% | 1 support ticket, ~₹150 | Support |
| False negative | 3% | Manual review catches it late, ~₹4,200 | Ops + Risk |

Written out like this, "92% accuracy" stops sounding like a grade and starts
sounding like what it is: a bet, with real money attached to both ways of
losing it. Sometimes that bet is still obviously worth taking. The point
isn't to kill the project — it's to make sure the people who'll own the
fallout were in the room when the bet was made.

## Why this is a product manager's job, not a data scientist's

A model team can tell you precision and recall. They usually can't tell you
what a false negative costs the finance team, or which support queue absorbs
a false positive, or whether Legal needs to sign off on the failure mode.
That translation — from a confusion matrix to a P&L line — is product work.
Skip it, and the first time someone asks "how much is this costing us when
it's wrong," nobody in the room has an answer, and that's a much worse
meeting to be in after launch than before it.
