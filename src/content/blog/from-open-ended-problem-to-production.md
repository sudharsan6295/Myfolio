---
title: "From an Open-Ended Problem to a Shipped Solution"
description: "Building an agent is the easy half. The hard half is choosing what to build and closing a vague business problem into a bounded one — with TOSCAR — before a single prompt gets written. Then the four stages that follow."
pubDate: 2026-09-05
category: "Business"
tags: ["agents", "product management", "problem framing", "learning notes"]
featured: false
---

Building the thing is the easy half. Choosing what to build, and stating it precisely enough that you can tell whether it worked, is the half that decides the outcome — and it happens before anyone writes a prompt.

AI is a tool. Nobody funds a tool. They fund a cost that comes down, a queue that clears, a decision that stops taking three days. So every agent-building process starts in the same place: understanding the business problem well enough to know what "solved" means.

## Every problem arrives open-ended

The problems that reach you sound like this: *"Can we use AI to speed up support?"* *"Can this be automated?"* *"What can we do with our documentation?"*

An open-ended problem is one where none of the following has been decided: what exactly goes in, what exactly comes out, what "good" looks like, who is accountable, and where the boundary sits. It isn't a badly-worded request — it's an honest description of a situation nobody has finished thinking about yet.

Here's why that matters more with AI than with ordinary software. A language model is *also* open-ended: it will produce a fluent, confident response to almost anything you ask. Point an open-ended tool at an open-ended problem and you get something that always returns an answer and never tells you whether it worked. There's nothing to measure, because nothing was specified.

Closing the problem is not paperwork. It's the step that makes evaluation possible at all.

## TOSCAR: turning an open problem into a closed one

Six questions. Answer all six and the problem stops being a topic and starts being a specification.

Take the vague version — *"Can we use AI to speed up support?"* — and run it through:

| Element | The question it forces | Answer for this example |
| --- | --- | --- |
| **T**rouble | What is the actual pain, stated concretely? | First response averages 14 hours; ~40% of tickets ask something the docs already answer |
| **O**wner | Whose problem is it, and can they change things? | The support lead — accountable for response time, can change the queue workflow |
| **S**uccess criteria | What does "solved" measurably mean? | First response under 2 hours on that 40%, with ≥90% of drafts sent by an agent unedited |
| **C**onstraints | What can the solution not do? | No customer data leaves the EU; an agent approves before anything sends; must run inside the existing helpdesk |
| **A**ctors | Who is affected or involved? | Agents (use it), customers (receive it), the docs team (owns the source), legal (approves the data path) |
| **R**esources | What do we actually have? | Three years of ticket history, current docs, one engineer for six weeks |

What came out the other side isn't the same request. *"Use AI to speed up support"* became: **draft replies for the documented-answer category, agent-approved before sending, EU-only, measured on unedited-acceptance rate.**

That's a closed problem. It has an input class, an output, a number that settles the argument, a boundary, and a named person who decides. Notice how much of it constrains the *solution space* rather than describing the solution — Success criteria and Constraints together rule out most of what you might otherwise have built, which is the point.

Two things worth flagging. Success criteria is the row people write last and should write first; without it, every later stage is unfalsifiable. And Resources is the row that quietly kills projects — "one engineer for six weeks" and "three years of ticket history" are what make this buildable, and if either were missing, the honest answer is that this is the wrong problem to pick up right now. That decision belongs in the [value-versus-effort conversation](/blog/pm-discipline-when-ai-is-the-deliverable/), before any of the stages below.

## The four stages

```
IDEATION      problem → model → prompts → is this feasible?
BUILDING      harness → prompts → evaluation (a loop, not a line)
PRE-PROD/UAT  real users, safe stakes → does it hold up?
PRODUCTION    deploy → monitor → feedback → back to the eval set
```

### Stage 1 — Ideation: is this even feasible?

The business problem gets identified and closed with TOSCAR. Then two questions get answered cheaply, before anyone commits to building.

**Which model?** Benchmarks are where everyone starts and the most over-trusted number in the process. A benchmark is a fixed set of questions with known answers, run against every model so results can be compared on the same basis. The mistake isn't using them — it's reading one headline score instead of the one measuring what your task actually needs.

Benchmarks are narrow on purpose. Each is built to probe a single capability: broad factual recall, multi-step reasoning, writing code, calling tools correctly, holding a long document in view, resisting the urge to invent an answer, reading an image. A model that leads on reasoning can be mediocre at tool selection — and if your system is an agent choosing between tools, the reasoning score decides nothing. Find the family of benchmarks that matches the shape of your task; treat the rest as background.

Four ways the numbers mislead even then:

**Contamination.** Benchmarks are published, so their questions and answers end up in the training data of the models that come after them. A high score can be recall rather than capability, and nothing visible from the outside separates the two. Benchmarks that refresh their questions on a schedule exist specifically to work around this.

**Saturation.** A benchmark that has been in circulation long enough for models to reach the top of it stops distinguishing anything. When the leaders sit within a point of each other, the ordering is measurement noise, and choosing on it is choosing at random.

**Non-comparable reporting.** Scores on vendor model cards come from different prompts, different numbers of worked examples, and sometimes several sampled attempts with the best one kept. Two cards quoting the same benchmark are frequently not describing the same experiment. Compare figures from one independent harness that ran every model identically, or don't compare them at all.

**Preference is not correctness.** Some of the most-cited leaderboards rank models by human vote — which of two answers a person preferred. Length, formatting and confident phrasing win those votes. A model can climb by being more agreeable without being any more accurate.

So benchmarks do one job well: **eliminating**. A model far below the pack on the row that matches your task is out. Among the ones left, the leaderboard has told you everything it can.

The real selection happens on twenty to fifty hand-written cases from your actual problem, run against the three or four survivors. That comparison is worth more than every leaderboard combined, because it's measured on the only distribution you care about — and it becomes the eval set you build against in the next stage, so the work isn't spent twice.

Cost per request, latency, and context window get measured in the same pass. All three are properties of the model you're choosing, and finding out at UAT that the accurate one is too slow or too expensive means redoing the work.

**Do prompts get there?** Try the task by hand. Careful prompting against a handful of real cases is the cheapest possible feasibility test. If a well-constructed prompt can't produce something close to right on the easy cases, no amount of harness is going to rescue it — and knowing that in week one instead of week nine is the entire value of this stage.

The exit condition isn't a working system. It's justified confidence that the model can do this task at all.

### Stage 2 — Building: harness, prompts, evaluation

Three things, and the order people assume — build, then prompt, then evaluate — is wrong. It's a loop.

The **harness** is everything around the model: retrieval, tools, the control loop, the guardrails, the logging. This is where nearly all the engineering actually lives, and it's what turns a working prompt into a system. The [structure it needs](/blog/a-framework-for-building-agents/) is the same one every agent needs.

**Prompts** get versioned like code, because they behave like code and break like code.

**Evaluation** runs on every change from the first day, not once the system feels finished — the set you wrote in Stage 1 to compare models becomes the set you build against, which is why it was worth writing by hand. The input-side guardrails belong here too, and for the same reason: both are structural, not something bolted on at review.

Which numbers actually matter at this stage, and at each of the others, is [a subject of its own](/blog/evaluation-metrics-by-stage/).

### Stage 3 — Pre-production and UAT: does it hold up?

Real users, real inputs, stakes that don't hurt. The point of this stage is the gap between your eval set and reality: actual users phrase things nobody on the team would have thought to write down, and every one of those belongs in the eval set afterwards.

Formal evaluation gates the release here — this is the stage where measurement stops being a build aid and becomes a decision.

The owner named in TOSCAR signs off against the success criteria written in TOSCAR. That's what those two rows were for.

### Stage 4 — Production: deploy, monitor, feed back

Deployment isn't the end of evaluation, it's the change of method. Offline scoring against known-good answers gives way to monitoring, because production has no answer key.

Then the loop closes — and this is what makes the whole sequence a loop rather than a line. Every real failure comes back as a new case with a correct answer attached, so the next change is measured against a set that has grown since the last one.

## What actually goes wrong

Almost every failed AI project I've watched failed in the first hour, not the ninth week. The problem was never closed, so there were no success criteria, so evaluation was impossible, so every review became a discussion of opinions about a demo.

The stages are the visible part and the easy part to plan. TOSCAR is the part that determines whether any of them can tell you anything.
