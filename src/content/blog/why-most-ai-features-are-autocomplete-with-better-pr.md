---
title: "Why Most AI Features Are Just Autocomplete With Better PR"
description: "A field note on the difference between a model doing something impressive and a product doing something useful — and why product managers keep confusing the two."
pubDate: 2026-02-11
category: "AI"
tags: ["product sense", "llms", "shipping"]
featured: true
---

Every roadmap review I've sat in for the last two years has had some version
of the same slide: a screenshot of a chat window, a impressive-looking
completion, and a note that says "this could save the team X hours a week."
Almost none of those features shipped the way the slide implied they would.

Not because the model was bad. Because the slide measured the wrong thing.

## The demo is not the distribution

A demo has one input and one lucky path through the model. Production has
every input your actual users will type, including the ones that are
mid-sentence typos, in a language your eval set didn't cover, or asking a
question that's technically out of scope but that a human would still answer
correctly out of common sense. The gap between those two things is where
most "AI features" quietly die after launch — not in a dramatic outage, just
a slow bleed of trust every time the feature is confidently wrong.

> If your eval set is smaller than the space of things a bored user will type
> into a text box in the first ten minutes, you don't have an eval set. You
> have a highlight reel.

## What "product" actually means here

The part of the job that doesn't show up in the demo is the part that makes
it a product instead of a magic trick:

- **Knowing when to say "I don't know."** A model that's wrong 5% of the time
  and *knows* it's uncertain is more useful than one that's wrong 2% of the
  time and always sounds equally confident.
- **Designing the failure state, not just the happy path.** What does the
  user see when the retrieval step comes back empty? That screen is a product
  decision, not an engineering afterthought.
- **Deciding what the model should never be allowed to do**, and building the
  guardrail in the system, not the prompt. Prompts are suggestions. Guardrails
  are architecture.

## A small example

On a recent project, the "impressive" version of a support-triage assistant
auto-drafted a full reply to the customer. The version that actually shipped
drafts a reply, but only ever *proposes* three possible next actions and
requires a human click before anything leaves the building. Same model. Same
underlying capability. Wildly different failure mode when it's wrong, and
that difference is 100% a product decision, not a model one.

The model doing something impressive is the beginning of the conversation.
Whether it's a product is a separate question, and it's usually answered by
the boring 80% of the work nobody screenshots.
