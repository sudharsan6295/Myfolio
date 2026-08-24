---
title: "What Program Management Discipline Looks Like When AI Is the Deliverable"
description: "Ten years of shipping enterprise PLM programs without downtime translates further into AI product work than I expected — and a few places it doesn't translate at all."
pubDate: 2026-08-10
category: "AI Product Management"
tags: ["program management", "risk management", "career transition"]
featured: true
---

I've spent ten years managing delivery for enterprise PLM programs —
upgrades, migrations, cloud transitions — where the discipline is always
the same: plan the risk out in advance, report transparently, get to
go-live without downtime. Moving toward AI product management while
pursuing a PGP in AI & Business, I expected most of that to carry over.
Some of it does directly. Some of it doesn't translate at all, and that gap
is the more interesting part.

## What carries over directly

**Risk planning still comes first.** A PLM upgrade fails because of an
unplanned dependency, a missed data-migration edge case, a stakeholder who
wasn't looped in. An AI feature fails for structurally the same reasons —
an edge case the eval set didn't cover, a downstream team that didn't know
the model's output was about to change. The discipline of surfacing risk
before it becomes an incident doesn't care what's underneath the system.

**Transparency is still what earns trust.** Structured stakeholder
reporting is what lets a sponsor stop micromanaging a program. The AI
equivalent is telling stakeholders honestly what a model can and can't do
yet — not just at launch, but as it drifts — instead of letting a demo set
expectations the shipped feature can't meet.

**"Done" still includes the people who'll run it.** I've mentored every
team I've delivered with, because a project isn't finished until the team
can run the next one without me. The same holds for a support or ops team
inheriting an AI feature — if they can't tell when the model needs
attention, the handoff isn't actually complete.

## What doesn't translate

**"Tested" means something different.** A PLM upgrade either works or it
doesn't — you can write a deterministic test and get a deterministic
answer. An AI feature is probabilistically right, which means "testing" is
really "building and maintaining an eval set," a continuous process rather
than a gate you pass once before go-live.

**The failure mode is quieter.** A failed migration throws an error. A
subtly-wrong model output looks exactly like a correct one until someone
downstream notices — sometimes a customer, sometimes never. That changes
where monitoring and confidence signals need to live, and how much weight
a "looks fine in the demo" impression should actually carry.

**Scope is a moving target.** An upgrade project has a defined end state:
the new version, live, matching the old one's behavior plus the planned
changes. An AI feature's realistic capability shifts as models and data
change under it — the finish line isn't fixed the way it is in a
traditional delivery program.

## Why I think this is the right seat

The translation isn't perfect, but it's close enough that the gap itself
is useful — it's exactly the kind of thing an analytics translator between
business and technical teams needs to be able to explain clearly, in both
directions, without pretending the two disciplines are more identical than
they are.
