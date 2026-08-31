---
title: "Prompting Techniques That Actually Move the Needle"
description: "Not a list of magic words. A short, practical set of prompting patterns that consistently produce better output, and why each one works the way it does."
pubDate: 2026-06-28
category: "AI"
tags: ["prompting", "practical", "learning notes"]
featured: false
---

Most prompt engineering advice is either too vague to act on or too gimmicky to trust. Here's what actually holds up.

## Be specific about the output shape, not just the task

"Summarize this" gives you something different every time. "Summarize this in three bullet points, under 20 words each, focused on financial risk" gives you something checkable. The model isn't guessing what "good" looks like anymore.

## Few-shot examples beat long instructions

Two or three examples of input → desired output are easier for a model to follow than a paragraph describing the format. If you find yourself writing out formatting rules, try replacing them with examples instead.

## Ask it to think before it answers

For anything with multiple steps of reasoning, asking the model to work through its thinking before answering measurably improves accuracy. It's not "trying harder" — laying out intermediate steps as text just gives it more to condition the final answer on.

## Give it a role, but don't over-rely on it

"You are a senior financial analyst" shifts tone and vocabulary usefully. It doesn't make the model more accurate — role prompts change style more reliably than substance, and it's easy to over-credit them.

## Separate instructions from the content they apply to

Mixing "what to do" with "the data to do it on" in one block invites the model to misread which part is the instruction. A header or delimiter fixes that.

## Iterate like you would with a person

The first response is a draft, not a verdict. Telling the model what was wrong and asking it to revise usually works better than rewriting the prompt from scratch.

## Structure it with GCAO when the prompt is genuinely complex

For anything beyond a one-line ask, four questions in order cover almost everything a prompt needs: **Goal** — what are you actually trying to achieve. **Content** — what raw material does the model have to work with. **Action** — what should it do with that content. **Output Format** — what shape should the result come back in. Most vague prompts are vague because one of these four was never actually decided, just assumed.

## The pattern underneath all of this

Every technique above reduces the model's uncertainty about what you actually want. Specificity, examples, and structure do that. "Magic phrases" don't — they're mostly folklore that happened to correlate with someone giving a clearer instruction anyway.
