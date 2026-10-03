---
title: "AI Flow Diagram"
summary: "An interactive, ten-stage visual guide to how AI systems are built — from one prompt to an enterprise platform. Plain English by default, technical detail one click away, with a step-through player and a request simulator."
status: "live"
startDate: 2026-10-03
stack: ["HTML/CSS", "Vanilla JavaScript", "Inline SVG", "GitHub Pages"]
links:
  demo: "https://sudharsan6295.github.io/AI-Flow-Diagram/"
  repo: "https://github.com/sudharsan6295/AI-Flow-Diagram"
featured: false
order: 9
---

## The Problem

"AI system" means very different things depending on who is saying it. A
non-technical stakeholder pictures a chatbot; an engineer pictures
retrieval, tool calls, agents, evals and guardrails. Most explainers pick
one audience and lose the other, or show the finished enterprise
architecture without ever saying why each layer exists — so the diagram
looks like a wall of boxes instead of a series of decisions.

## What it does

A single-page walkthrough in ten stages: LLM, prompts and structured
outputs, RAG, tool use and MCP, a single agent, multi-agent systems,
evals, guardrails, observability, and the full enterprise reference
architecture. Each stage adds one layer to the same diagram, with the new
parts highlighted, plus a plain-English summary, an everyday comparison,
and what can go wrong. A General/Technical switch changes the depth, a
step-through player builds the system up one layer at a time, and a
request simulator in the last stage follows three scenarios (a warranty
check needing approval, a board summary with an unsupported claim
removed, a suspicious uploaded document) through the platform.

## How it is built

One self-contained `index.html`: HTML, CSS, JavaScript and inline SVG, no
build step, no framework and no network calls at runtime. Each diagram is
hand-built SVG whose boxes are keyboard-focusable and carry short
explanations; hover or focus highlights a box's connections. Light and
dark themes, reduced-motion support, and a printable view come from the
same file, and two PDFs (general and technical) sit alongside it. A
sources section lists the papers, protocols and standards the page
relies on, with the date they were last reviewed.

## A simple tech stack workflow to understand

```
index.html (HTML + CSS + JS + inline SVG)
   → pick General or Technical view (remembered in the browser)
   → step through the ten stages, or press Play on the player
   → each stage adds components to the same SVG diagram
   → click a box for what it does; run a scenario in stage 10
   → published as static files on GitHub Pages
```

Nothing is fetched while you read; the whole guide is one file the
browser already has.

## Where it stands

Live on GitHub Pages. A review pass fixed share-preview metadata, a dead
reference link and a few content gaps (query-time access control in RAG,
indirect prompt injection, cost and latency levers). Product and
framework names are examples, not endorsements, and the references are
dated because the field moves quickly.
