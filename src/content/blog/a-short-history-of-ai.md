---
title: "A Short History of AI, for People Who Skipped the Hype Cycles"
description: "What the word 'AI' actually contains — machine learning, deep learning, generative AI and LLMs are nested, not synonyms — and the short version of how the field moved from the outer ring to the inner one."
pubDate: 2026-06-05
updatedDate: 2026-09-05
category: "AI"
tags: ["fundamentals", "history", "machine learning", "learning notes"]
featured: false
---

AI has been declared dead twice and inevitable at least three times. Worth remembering before you read this week's headlines.

## First, what "AI" actually contains

"AI," "machine learning," and "generative AI" get used as synonyms constantly. They aren't. They're nested — each one sits inside the one above it:

```
ARTIFICIAL INTELLIGENCE
└─ MACHINE LEARNING
   └─ DEEP LEARNING
      └─ GENERATIVE AI
         └─ LLMs
```

**Artificial intelligence** is the outermost and loosest term: any system doing something we'd call intelligent. Plenty of it involves no learning whatsoever — a chess engine searching moves and an expert system following hand-written rules are both AI, and neither improves from experience.

**Machine learning** is the subset that learns patterns from data instead of being told the rules. You supply examples, it derives the rule. Spam filtering, fraud scoring, demand forecasting, recommendations — this is where most AI running in production actually sits, and almost none of it talks.

**Deep learning** is machine learning built on many-layered neural networks. The distinguishing trait is that it works out which features matter on its own, rather than having a person specify them — which is what finally made messy inputs tractable: image recognition, speech transcription, handwriting.

**Generative AI** is deep learning that produces new content — text, images, audio, code — rather than a label or a number. Note what this excludes: a model predicting churn or flagging a fraudulent transaction is deep learning doing something extremely valuable, and it isn't generative.

**Large language models** are generative models for text. The innermost ring, the newest, and the one that "AI" almost always means in a product pitch — while a research paper using the same word might mean any of the five.

Two things follow. First, most AI you actually encounter is in the middle rings, not the innermost one: the fraud check on your card, the transcription in a meeting tool, the routing behind a support queue. Second, an enormous number of business problems are prediction or classification problems, and reaching for a language model to solve one is picking the newest tool rather than the right one.

The history below is, more or less, the story of the field moving inward through those rings — one at a time, over seventy years, with two long stalls along the way.

## Symbolic AI and the two winters (1950s–1980s)

The bet was simple: encode enough logic into a system and it reasons like a person. It worked well enough to build expert systems that diagnosed diseases and configured orders. Then it hit a wall — hand-written rules don't scale to a messy world. Funding dried up in the 1970s, then again in the late 1980s. Two winters.

## The quiet statistical decade (1990s–2000s)

AI didn't vanish during the winters — it just stopped being called AI. Spam filters, recommendation engines, early speech recognition all quietly became infrastructure. No hype, just usefulness. Probably the most underrated stretch in the whole history.

## Deep learning's breakthrough (2012)

AlexNet won the ImageNet competition by a wide margin, using GPUs to train a network bigger than anyone had managed before. The lesson wasn't new theory — it was compute and data finally making old ideas work.

## Transformers and the LLM era (2017–present)

> "Attention Is All You Need" — the 2017 paper that introduced the transformer architecture almost every current large language model is built on.

The transformer processes whole sequences of text at once instead of word by word. GPT, BERT, everything downstream traces back to that one paper. ChatGPT's release in November 2022 wasn't a new capability — it was this five-year-old architecture finally getting a conversational interface anyone could use.

## Why this history is worth knowing

The winters are a good reason to stay skeptical of any single demo. The quiet decade is a good reason to respect boring infrastructure over whatever's loudest this month.

And the nesting is a good reason to ask what someone actually means when they say "AI." Seventy years of the field are sitting in the outer rings, still running, mostly unglamorous. The innermost ring is four years old in public and gets roughly all of the attention — which is worth knowing before you assume it's also the answer to the problem in front of you.
