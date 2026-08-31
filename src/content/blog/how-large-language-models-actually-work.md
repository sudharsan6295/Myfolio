---
title: "How Large Language Models Actually Work, for Non-ML People"
description: "A mental model of what's happening inside an LLM, written for someone who needs a clear picture without an ML background — not a machine learning course."
pubDate: 2026-07-15
category: "AI"
tags: ["fundamentals", "LLMs", "learning notes"]
featured: false
---

You don't need to build a model to understand what it's doing. You just need a mental model that isn't wrong. Here's the whole pipeline in one picture before we go section by section:

```
"Unbelievable" (your text)
   → tokens: [Un] [believ] [able]
   → embeddings: each token becomes a list of numbers
   → attention: every token weighs every other token
   → next-token prediction: guess what comes next, one token at a time
   → fine-tuning + RLHF: shape raw prediction into a helpful assistant
   → output: a response, generated token by token
```

## It doesn't read words, it reads tokens

Text gets broken into chunks called tokens — sometimes a whole word, sometimes a fragment. "Unbelievable" might become three tokens. Pricing, context limits, and odd behavior around rare words all trace back to this.

## Every token becomes a list of numbers

Each token turns into an embedding — a list of numbers representing its meaning in a way the model can do math with. Tokens used in similar ways end up with similar numbers. This is the layer where "king − man + woman ≈ queen" lives.

## Attention is how it decides what matters

For each token, the model weighs every other token in the input to figure out what's relevant right now. This is how it resolves "it" back to a noun three sentences earlier, and why more relevant context tends to produce better answers.

## Training is just next-token prediction, at enormous scale

Given the text so far, predict the next token — that's the whole objective. Do that well enough over enough text, and the model ends up implicitly learning grammar, facts, reasoning, and style, none of which were labeled as separate goals.

## Fine-tuning and RLHF shape behavior, not raw knowledge

A raw next-token predictor is a strange conversational partner. Extra training — fine-tuning on curated examples, then reinforcement learning from human feedback — teaches it to follow instructions, refuse certain requests, and format answers usefully. This is also where a lot of personality and guardrails get set.

## Why it hallucinates

The model is still just predicting a plausible next token, not looking anything up. If the most plausible continuation happens to be false, it comes out with the same fluency as a true one. That's not a rare glitch — it's the same mechanism that makes the model useful, misfiring on a case where plausible and true diverged.

## Why this matters

Once "plausible next token, not a lookup" clicks, a lot makes more sense — why more context helps, why it can state something false with total confidence, and why "it made something up" is never actually surprising.
