---
title: "Measuring an AI System, Stage by Stage"
description: "There is no single score for an AI system. What you measure changes four times between choosing a model and running one in production — what an eval actually is, which metrics earn their place at each stage, and why the governance ones belong on the same schedule."
pubDate: 2026-09-05
category: "AI"
tags: ["evals", "metrics", "responsible AI", "learning notes"]
featured: false
---

There is no single number that tells you whether an AI system is any good. What's worth measuring depends entirely on what you're deciding at that moment — and what you're deciding changes four times between the first idea and the thing running in production.

At the start you measure to **choose**. During the build you measure to **localize** a failure. Before release you measure to **gate**. Afterwards you measure to **watch**. Same system, four different questions, four different sets of numbers — and a metric that was decisive at one stage is often meaningless at the next.

One thing up front, because it's the part most often got wrong. The governance metrics — toxicity, PII, bias, prompt injection — are not a separate list run near the end by whoever has to sign off. They're measurements taken on the same system with the same apparatus, and each belongs at a specific stage below. Keeping them on their own schedule is how they end up as an audit rather than a design input.

## First, what an eval actually is

An eval is a set of inputs with known-good outcomes, and a way to score what actually came back. That's the whole idea. Cheap to describe, awkward to build, and it is the only mechanism that converts opinions about an AI system into facts about it.

Everything below is a variation on that. What goes in the set, and what "scored" means, changes with the stage — the shape doesn't.

The four stages below are named the way a delivery plan usually names them. Where a common alternative exists, it's in brackets on the heading — the same stage, different house vocabulary.

## Stage 1 — Ideation (Scoping): measuring to choose

Nothing exists yet. The measurements here decide which model you build on, and almost all of them are comparative.

**Write the eval set before writing code.** Twenty examples of what the system should handle and what a correct response looks like. This does something a requirements document can't: it forces the vague parts to surface immediately. If you can't write the expected output for a case, you haven't decided what the product does yet.

It also draws the scope boundary honestly. Every case you can't write a correct answer for belongs outside v1 — not because it's hard to build, but because you couldn't tell whether you'd built it.

**Benchmark scores** are the standard starting point and the most over-trusted number in the process. Public benchmarks measure general capability on tasks that are not yours, on data the model may well have seen. Use them to eliminate obviously unsuitable models, never to pick the winner.

**Task accuracy on your own set** is what actually decides it — those twenty to fifty hand-written cases, run against three or four candidates. Worth more than every leaderboard combined, because it's measured on the only distribution you care about. It's also the set you'll build against for the rest of the project, so the work isn't spent twice.

**Cost per request and latency** belong here, not later. Both are properties of the model you're choosing, and discovering at UAT that the accurate one is too slow or too expensive means redoing the work.

**Baseline bias and toxicity propensity** belong here too, and this is the part usually deferred. A model's disposition on these is something you inherit at selection time. Measuring it after you've built six months of harness around it means the finding can no longer change the decision.

## Stage 2 — Building (Prototyping, Hardening): measuring to localize

The system now has parts, so "it gave a bad answer" stops being actionable. It could be retrieval, tool choice, tool arguments, or the final summary. Break the eval apart to match the loop:

```
Retrieval        → did the right documents come back at all?
Tool selection   → did it pick the correct tool for this request?
Tool arguments   → were the parameters actually right?
Loop behaviour   → did it stop when it should have, or keep going?
End-to-end       → was the final answer correct and well-formed?
```

Component evals are where debugging gets fast, because a failing score names the broken stage instead of just the broken outcome. End-to-end evals still matter — they're the only ones measuring what users experience — but they're a poor diagnostic on their own.

Run the set on every change, not once the system feels finished. Without that, prompt iteration is superstition: you change three things, the one case you're watching improves, and you ship something that made forty other cases worse. That happens constantly and is invisible without a set.

**Schema and format validity** — cheap, deterministic, and it catches a surprising share of real breakage.

**Output predictability** — run the same input several times and measure how far the answer moves. High variance means every other metric is noisier than it looks, and it's why a single passing run proves very little.

**Toxicity detection, PII detection, prompt injection resistance, and off-topic rate** — the four input-side checks — also start here, not at review. Each is a property of how the harness separates instructions from content, and that's a structural decision made during building. Measuring it later tells you about a design you can no longer cheaply change.

## Stage 3 — Pre-production and UAT (Release): measuring to gate

The system works. The question is whether it's allowed out.

**End-to-end task success** — the only number measuring what a user actually experiences.

**Regression count against last known good** — how many previously-correct cases broke. This matters more than the headline score: an average that went up while three previously-correct cases broke is not an improvement, it's a trade, and one you should be making deliberately if at all. Aggregate scores hide exactly this, which is why the per-case diff is the artifact worth looking at.

**Confidence calibration** — when the system expresses certainty, is it right proportionally often? Models are badly calibrated by default and arrive at everything in the same assured register. An uncalibrated system is one a user has no way to read.

**Interpretability** — for a given output, can anyone say which retrieved chunk, tool result, or part of the prompt produced it? Not a score so much as a yes-or-no about your traces, and the thing a reviewer is really asking for when they ask how a decision was made.

**The adversarial suite**, run as a set rather than as scattered individual checks: injected instructions inside retrieved documents, jailbreak attempts, requests deliberately outside scope, inputs engineered to elicit toxic output, and probes for **data leakage** — another user's context, an internal identifier, the system prompt itself.

**Bias and fairness across cohorts** — the same task varied by the attribute that shouldn't matter, comparing outcomes. This needs a designed test set and is the metric most often skipped for that reason.

**Toxicity risk on outputs** — distinct from the Stage 1 propensity measurement. That one described the model; this one describes your system, after your prompts and your guardrails.

UAT is also where the eval set finds out what it was missing. Real users phrase things nobody on the team would have thought to write down, and every one of those belongs in the set afterwards.

## Stage 4 — Production (Live): measuring to watch

Offline evaluation ends here and monitoring begins. The set changes because you no longer have known-good answers to compare against.

**Proxy success signals** — escalation rate, retry rate, abandonment, thumbs up and down. None of them is task success; together they move when it does.

**Guardrail hit rates** — how often PII is caught, injection attempts blocked, off-topic requests refused, toxicity flagged. These are the Stage 2 and Stage 3 metrics still running, now as live counters. A rate that suddenly moves is the earliest signal you get.

**Input drift** — how far today's traffic sits from what the eval set represents. When this grows, every offline number is quietly expiring.

**Sampled human review** — a slice read by a person on a schedule. Expensive, unreplaceable, and the only mechanism that finds failures nobody thought to write a metric for.

**Time to detect** — how long a failure runs before anyone notices. Rarely tracked, and it's the number that actually determines how bad an incident gets.

Then the loop closes:

```
Log every run (input, tool calls, output)
  → sample and review a slice regularly
  → find failures the eval set never covered
  → add those cases to the set, with correct answers
  → fix, re-run, ship
```

A set that hasn't changed since launch isn't stable, it's stale — still measuring the product you imagined rather than the one people are using.

## The Responsible AI metrics, sorted by checkpoint

Nothing on the governance list is missing from the four stages above. Sorted by *where* they run — the two checkpoints every AI system has, one on the way in and one on the way out:

| Policy side | Metric | What it catches |
| --- | --- | --- |
| Input | Toxicity detection | Abusive content arriving in the request |
| Input | PII identification | Sensitive personal data leaving your boundary |
| Input | Prompt injection | Instructions hidden inside retrieved content |
| Input | Off-topic detection | Requests outside the system's remit |
| Output | Interpretability | An answer nobody can explain or trace |
| Output | Hallucination score | Claims unsupported by any source |
| Output | Confidence score | Certainty that isn't earned |
| Output | Bias / fairness score | Outcomes varying by an attribute that shouldn't |
| Output | Toxicity score | Harmful output your prompts didn't prevent |
| Output | Data leakage | Context or identifiers reaching the wrong person |

The input policies check what you allowed in; the output policies check what you're about to show — the same two checkpoints, named for the prompt and the response. Neither is a separate discipline from evaluation: they're the same measurements, taken at the two points where a system can still be stopped.

## Three ways to score, and when each earns its place

Every metric above needs a scoring method behind it, and there are only three.

**Deterministic checks** — did it call the right tool, is the JSON valid, does the number match. Cheap, exact, and the right default. Use them wherever the correct answer is actually checkable.

**Human review** — slow, expensive, and irreplaceable for judgment calls like tone, helpfulness, and whether an answer is subtly misleading. Reserve it for cases that genuinely need a person, and use what you learn to build the other two.

**Model-graded** — another model scores the output against a rubric. Scales well, and it's the only practical option for open-ended text at volume. It's also a measurement instrument with its own error, so it needs calibrating against human judgments before you trust it as a release gate.

Most working setups use all three: deterministic where possible, model-graded for the open-ended middle, human review on a sampled slice to keep the other two honest.

## The one that isn't a score

Interpretability is the odd entry on that list: it isn't a number between zero and one. It's whether anyone can say *why* a particular output came out the way it did — which retrieved chunk it leaned on, which tool result it used, which part of the prompt drove it.

Every other metric tells you *that* something failed. Interpretability is what tells you *why*, and that's the difference between an incident you can fix on Tuesday and one you can only apologise for. It's also what a regulator, an auditor, or an unhappy customer is actually asking for when they ask how a decision was reached — "the model produced it" has never been an acceptable answer to that question anywhere it genuinely matters.

In practice it gets built rather than measured: logged traces of every retrieval and tool call, citations attached to generated claims, and prompts structured so an output can be attributed back to an input. All of that is designed in during the building stage. You can't add interpretability to a finished system — you can only find out you don't have it, usually at the exact moment you need it most.

## The point

One score can't answer four different questions. The stage you're at is what decides which number is worth arguing about — and a metric that settled the question last month can be measuring nothing useful by the next one.

Building the set behind all of this is dull work with no demo value, and it's the first thing cut when a deadline moves. A team without one can still ship. They just can't tell you whether the thing got better this week, which failures are new, or what breaks when they change the prompt.

That's also why the governance half can't be saved for the end. Filed under its own heading and run once before release, it becomes an audit: something performed on a finished system by people who can only approve it or block it, rather than something that shaped the system while it was still cheap to change.
