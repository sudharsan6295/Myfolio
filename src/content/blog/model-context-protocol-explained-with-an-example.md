---
title: "MCP: The Boring Standard That Makes AI Tool Use Maintainable"
description: "Every AI product used to write its own tool-calling glue. Here is what the Model Context Protocol actually is, what a server exposes, and one small server walked through end to end."
pubDate: 2026-09-01
category: "AI"
tags: ["MCP", "agents", "tools", "learning notes"]
featured: false
---

Every useful AI system eventually needs to touch something outside the model — a database, a calendar, a ticketing system, a file. The Model Context Protocol (MCP) is the standard for how that connection gets described. It is not exciting. That's the point.

## The problem it actually solves

Before a standard existed, every AI product wrote its own tool-calling glue. Your assistant needed a hand-written adapter for Jira, another for Postgres, another for Google Drive — each with its own auth handling, its own schema format, its own error conventions. Add a second model or a second app and you wrote all of it again.

That's an N × M problem: N applications times M systems they want to reach. MCP turns it into N + M. A system exposes itself once as an MCP server; any MCP-speaking client can use it.

## What MCP is, minus the jargon

MCP is a client–server protocol. The **server** wraps some capability — your database, your CRM, your file system — and describes what it can do in a machine-readable way. The **client** lives inside the AI application and connects to servers. The model never talks to your database directly; it asks the client to call a described capability, and the client does the actual work.

Three things a server can expose:

- **Tools** — actions the model can invoke. `create_ticket`, `search_orders`, `send_invoice`. These have side effects and are the ones worth being careful about.
- **Resources** — read-only content the client can pull in as context. A file, a schema, a config, a document.
- **Prompts** — reusable prompt templates the server offers, so common workflows don't get reinvented by every client.

Most of the value, in practice, sits in tools.

## A worked example: a subscriber list

Say I want an assistant that can answer questions about who subscribes to this blog, and add someone when I ask. The subscriber list lives in a JSON blob behind an API. Without MCP, I'd hardcode that into one app. With MCP, I write a small server once.

The server declares two tools. A declaration is just a name, a description, and a JSON Schema for the inputs:

```
{
  "name": "search_subscribers",
  "description": "Find subscribers by email fragment or by category
                  they opted into. Returns matching records.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "query":    { "type": "string" },
      "category": { "type": "string" }
    }
  }
}
```

And the whole exchange, start to finish:

```
1. Client connects       → server: "what do you have?"
2. Server responds       → tools: search_subscribers, add_subscriber
3. Client passes those tool descriptions to the model
4. I ask                 → "How many people follow the AI category?"
5. Model decides         → call search_subscribers { category: "AI" }
6. Client executes it    → server queries the blob, returns 41 records
7. Result goes back      → into the model's context as a tool result
8. Model answers         → "41 subscribers follow the AI category."
```

Step 5 is the only step the model does. It doesn't know what a blob is, doesn't hold my API key, and can't reach the network. It reads a description and picks a tool. Everything with real consequences happens in the client and server — code I wrote, running where I control it.

That separation is the actual design win. Swap the model, and the server is untouched. Point a different app at the same server, and it works immediately.

## What this changes in how you build

Once tools are described rather than hardcoded, the *description* becomes part of your product surface. A vague tool description produces a model that calls the wrong tool, and no amount of prompt tuning at the top level fixes it. Tool names, descriptions, and parameter docs deserve the same care as user-facing copy — they are, in a real sense, the prompt.

The other shift: capability becomes composable. Three servers connected to one client gives the model a combined toolset it can reason across — pull an order, look up the customer's ticket history, draft a reply — without anyone building a bespoke integration between those three systems.

## The honest limits

MCP standardizes *how* a capability is described and called. It doesn't decide whether the model should have that capability. A server exposing `delete_customer` is exactly as dangerous as it sounds, protocol or not — permissioning, confirmation, and audit logging are still yours to build.

It also doesn't make the model good at choosing. Hand it thirty tools with overlapping purposes and it will pick badly, reliably. The discipline of a small, clearly separated toolset matters more than the protocol does.

MCP is plumbing. Good plumbing is worth having, and it's still just plumbing.
