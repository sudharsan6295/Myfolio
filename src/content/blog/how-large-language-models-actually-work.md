---
title: "How Large Language Models Actually Work, for Non-ML People"
description: "A mental model of what's happening inside an LLM, written for someone who needs to make decisions about AI products without an ML background — not a machine learning course."
pubDate: 2026-07-15
category: "AI"
tags: ["fundamentals", "LLMs", "learning notes"]
featured: false
---

You don't need to be able to build a model to make good decisions about
products that use one — but you do need a mental model that isn't wrong.
This is the version I wish someone had given me before I started reading
papers, built from working through the fundamentals during the Scaler PGP.

## It doesn't read words, it reads tokens

Text gets broken into chunks called tokens — sometimes a whole word,
sometimes a fragment of one. "Unbelievable" might become three tokens, not
one. Everything the model does happens in terms of these tokens, which is
why pricing, context limits, and even some odd behavior around rare words
or made-up terms all trace back to tokenization.

## Every token becomes a list of numbers

Each token is converted into an embedding — a long list of numbers
representing its meaning in a way the model can do math with. Tokens used
in similar contexts end up with mathematically similar embeddings. This is
the layer where "king − man + woman ≈ queen" style relationships actually
live.

## Attention is how it decides what matters

The transformer architecture's core mechanism, self-attention, lets the
model weigh every other token in the input when processing each token —
figuring out which earlier words are relevant to the one it's working on
right now. This is what lets a model correctly resolve "it" in a sentence
to the right noun three sentences back, and it's why longer, more relevant
context tends to produce better answers.

## Training is just next-token prediction, at enormous scale

The core training objective is almost embarrassingly simple: given the
text so far, predict the next token. Trained on a large enough slice of the
internet, doing that one task well enough turns out to require the model
to implicitly learn grammar, facts, reasoning patterns, and style — none of
which were labeled as separate objectives.

## Fine-tuning and RLHF shape behavior, not raw knowledge

A raw next-token predictor is a strange, unhelpful conversational partner.
Additional training stages — fine-tuning on curated examples, then
reinforcement learning from human feedback — teach the model to behave like
an assistant: follow instructions, refuse certain requests, format answers
usefully. This is also the stage where a lot of a model's personality and
guardrails get set.

## Why it hallucinates

The model is still, underneath everything, predicting a plausible next
token — not looking anything up. If the most statistically plausible
continuation happens to be false, it gets generated with the same fluency
as a true one. Hallucination isn't a bug that occasionally fires; it's the
same mechanism that makes the model useful, applied to a case where
plausible and true have come apart.

## Why this matters for anyone deciding how to use one

Once "plausible next token, not a lookup" clicks, a lot of product
decisions get easier: why retrieval-augmented systems exist, why a
confidence threshold is a real design surface, and why "the model was
wrong" is never actually surprising — it's the default failure mode of the
underlying mechanism, not an edge case.
