---
title: "MQL Assistant"
summary: "A retrieval-grounded assistant for ENOVIA/3DEXPERIENCE developers that answers Matrix Query Language (MQL) questions from the official reference guide and real example scripts, citing the exact source it pulled from instead of guessing."
status: "prototype"
startDate: 2026-08-30
stack: ["Python", "Streamlit", "Gemini API", "RAG", "ChromaDB", "BM25"]
featured: false
order: 4
---

## The Problem

MQL (Matrix Query Language) is the scripting language behind ENOVIA/
3DEXPERIENCE's MatrixOne platform. Its official reference is a 900+ page,
two-column legacy PDF with no clean heading structure — the kind of
document everyone keeps open in a tab and nobody actually enjoys searching.

## What it does

Lets a developer just ask the question in plain language — "how do I
expand a relationship?", "what's the syntax for a temp query?" — and get
an answer grounded in that reference guide and a set of real production
admin scripts, citing exactly which chunk of which document it came from.

## How it is built

A hybrid retrieval index (vector embeddings + BM25) sits over two sources:
the MQL Reference Guide and a set of real `.mql` example scripts.
The model (Gemini) gets two tools — one per source — and decides which to
call itself, rather than always stuffing everything into the prompt. A
small Streamlit UI wraps it with a password gate, source citations, and
query history.

## A simple tech stack workflow to understand

```
PDF + example scripts
   → chunked & indexed (vector + BM25), one-time ingest
   → question asked in the Streamlit app
   → Gemini picks a tool, retrieves the matching chunks
   → grounded, cited answer
```

Everything the app does after that — the answer, the citation, the usage
stats, the query history — comes from that same loop: ask, retrieve,
answer, cite.

## Where it stands

An early-stage prototype developed to illustrate the vision for a larger
initiative — the Internal Knowledge Bot.
