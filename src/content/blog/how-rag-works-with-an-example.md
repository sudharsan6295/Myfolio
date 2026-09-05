---
title: "RAG Isn't Training — It's What You Put In Front of the Model"
description: "Retrieval-augmented generation changes nothing about the model — it changes what the model is looking at when it answers. The mechanism, worked end to end on one real question."
pubDate: 2026-09-05
category: "AI"
tags: ["RAG", "retrieval", "agents", "learning notes"]
featured: false
---

A model only knows what it saw during training, and it has no way to tell you which parts it actually knows. Ask about your company's leave policy and it will produce a fluent, plausible, completely invented answer — because generating fluent text is the only thing it does.

Retrieval-augmented generation (RAG) is the fix, and the mechanism is simpler than the acronym suggests: find the relevant text first, then ask the model to answer using only that text.

## The two halves

RAG has an offline half and a live half, and they're easy to confuse because both involve embeddings.

**Indexing** happens once, ahead of time. You take your documents, split them into chunks, convert each chunk into an embedding — a list of numbers representing its meaning — and store the chunks alongside those numbers.

**Retrieval** happens every time someone asks a question. The question gets embedded the same way, compared against the stored chunks, and the closest few are pulled out and handed to the model as context.

```
INDEXING (once, offline)
  documents → split into chunks → embed each chunk → store

RETRIEVAL (every question)
  question → embed it
           → compare against stored chunks
           → take the top few
           → paste into the prompt with the question
           → model answers from that text
```

The model itself never changes. Nothing gets trained. The entire trick is what you put in front of it.

## A worked example: a leave-policy question

Say the HR handbook is a 40-page PDF and someone asks: *"How much notice do I need to give for two weeks off?"*

**Step 1 — the handbook was chunked at indexing time.** Not by page, by section. One of the chunks reads:

```
[chunk_id: hr-handbook-p12-leave-notice]
Annual leave requests of five consecutive working days or more
require a minimum of 21 days' written notice to the line manager.
Requests under five days require 7 days' notice. Approval is at
the manager's discretion and subject to team coverage.
```

**Step 2 — the question gets embedded and compared.** The retriever doesn't search for the words "notice" or "two weeks." It compares meaning. Here's what comes back, scored:

```
0.89  hr-handbook-p12-leave-notice      ← the actual answer
0.71  hr-handbook-p13-leave-carryover
0.64  hr-handbook-p31-sick-leave
0.22  hr-handbook-p04-office-locations
```

Top 3 get taken. The office-locations chunk scores low and is dropped.

**Step 3 — the prompt is assembled.** This is the whole of RAG, and it's just string concatenation:

```
Answer the question using only the context below.
If the context doesn't contain the answer, say so.

CONTEXT:
[chunk_id: hr-handbook-p12-leave-notice]
Annual leave requests of five consecutive working days or more...

[chunk_id: hr-handbook-p13-leave-carryover]
Unused leave may be carried into Q1 of the following year...

[chunk_id: hr-handbook-p31-sick-leave]
Sick leave requires no advance notice; notify your manager...

QUESTION:
How much notice do I need to give for two weeks off?
```

**Step 4 — the model answers.** Two weeks is ten working days, which is over the five-day threshold, so: 21 days' written notice to the line manager, approval subject to team coverage — citing `hr-handbook-p12`.

Notice what the model actually did. It didn't recall a policy. It read a paragraph, did one small piece of reasoning (ten working days > five), and reported what the paragraph said. That's a much narrower job, and a much more reliable one.

## Why embeddings instead of keyword search

The question said "two weeks off." The chunk says "five consecutive working days or more." A keyword search can match "notice" and "days" — but so do the sick-leave and carryover chunks, which also talk about notice periods in days. What it can't do is work out that "two weeks" clears a "five working days" threshold, so it has no way to rank the right chunk above the near-misses. Embeddings place text with similar *meaning* near each other in a numeric space, so "two weeks off" lands close to "consecutive working days of annual leave" despite the different wording.

That's the whole reason vector search shows up here. Keyword search still has a place — it's better at exact identifiers, product codes, names — which is why serious setups often run both and merge the results.

## Where RAG breaks

**Bad chunking.** Split mid-sentence or mid-table and you retrieve a fragment that's technically relevant and practically useless. Split too large and you fill the context with noise around the one line that mattered. This is where most RAG quality actually lives, and it's unglamorous work.

**Retrieval misses, model improvises anyway.** If the right chunk never comes back, the model still answers — from training data, confidently, with no signal that anything went wrong. "If the context doesn't contain the answer, say so" helps and does not solve it.

**Stale index.** The handbook changed in March; the index was built in January. The system now cites an outdated policy *with a source*, which is worse than having no source at all, because the citation makes it look verified.

**Too many chunks.** Handing over the top 20 rather than the top 3 buries the answer. More context is not more accuracy.

## Why this matters beyond chatbots

RAG isn't a separate product category — it's a component that shows up inside almost every serious [workflow, agentic system, and autonomous agent](/blog/agentic-ai-autonomous-agents-and-rag/). An agent deciding which tool to call makes better decisions when the relevant policy or record is in front of it, for the same reason a person does.

The measurable difference is the citation. "The model thinks this is true" and "the model found this in section 12 of the handbook and is telling you where" are different products, and only one of them can be checked by the person reading it.
