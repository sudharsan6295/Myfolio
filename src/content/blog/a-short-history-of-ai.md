---
title: "A Short History of AI, for People Who Skipped the Hype Cycles"
description: "AI didn't start with ChatGPT. It's had at least two booms, two winters, and one very quiet decade before the current moment — notes from working through the history as part of a PGP in AI & Business."
pubDate: 2026-06-05
category: "AI"
tags: ["history", "fundamentals", "learning notes"]
featured: false
---

I came into AI from delivery and program management, not machine learning,
so one of the first things I did on the Scaler PGP was go back and read the
actual history instead of starting from "GPT-4 is impressive." It turns out
the field has been declared both dead and inevitable at least twice before,
and knowing that changes how you read today's headlines.

## Symbolic AI and the first winter (1950s–1980s)

Early AI was rule-based: encode enough human logic into a system and it
should reason like a person. This produced real results — expert systems
that could diagnose diseases or configure computer orders — but the
approach hit a wall. Hand-written rules don't scale to the messiness of the
real world, funding dried up in the 1970s and again in the late 1980s, and
both crashes are now known as "AI winters." The lesson that stuck with me:
impressive demos and a scalable approach are not the same thing, a theme
that shows up constantly in product work too.

## The quiet statistical decade (1990s–2000s)

AI didn't disappear during the winters, it just stopped being called AI.
Statistical methods — spam filters, recommendation engines, early speech
recognition — quietly became infrastructure without the hype. This is
probably the most underrated period in the whole history: less exciting,
more useful, and it built the data and infrastructure habits that later
breakthroughs depended on.

## Deep learning's breakthrough (2012)

In 2012, a neural network called AlexNet won the ImageNet image-recognition
competition by a wide margin, using GPUs to train a network far larger than
what had been practical before. That single result is usually cited as the
moment deep learning went from an academic niche to the dominant approach
in AI research — compute and data, not new theory, were what finally made
the old ideas work.

## Transformers and the LLM era (2017–present)

> "Attention Is All You Need" — the 2017 paper that introduced the
> transformer architecture almost every current large language model is
> built on.

The transformer let models process entire sequences of text in parallel
instead of word by word, which made it practical to train on enormous
amounts of text. GPT, BERT, and everything downstream of them trace back to
that architecture. ChatGPT's release in November 2022 wasn't a new
capability so much as the moment this five-year-old architecture got a
conversational interface simple enough for anyone to use — which is its own
lesson about how much distribution matters, separate from the underlying
technology.

## Why this history matters for the work

Reading the winters made me more skeptical of any single demo, and reading
the quiet decade made me more respectful of the boring infrastructure work
that outlasts a hype cycle. Both are useful instincts to bring into a role
that's supposed to sit between what a model can technically do and what a
business should actually bet on.
