---
title: "A Framework for Building Agents That Don't Fall Over"
description: "Six parts every working agent has, whether or not the team building it named them. A practical structure for scoping, building, and containing an agent — before the demo becomes a product."
pubDate: 2026-09-03
category: "AI"
tags: ["agents", "frameworks", "product", "learning notes"]
featured: false
---

An agent demo takes an afternoon. An agent that survives real users takes considerably longer, and the gap between the two is almost never the model. It's the six things around the model that nobody built.

## Start with the loop, not the model

Every agent is the same loop underneath: receive a goal, decide an action, take it, observe what happened, decide again, stop when done. Everything else is a decision about how that loop is constrained. Picking a model first is picking the least differentiated part of the system first.

```
Goal
  → decide next action        (the model's only real job)
  → execute it                (your code, your permissions)
  → observe the result        (what actually comes back)
  → still not done? loop      (with a hard ceiling)
  → done                      (a definition you wrote, not one it invented)
```

## The six parts

**1. Scope — what it is allowed to be asked.** The single highest-leverage decision, and the one most often skipped. "An agent that handles customer support" is not a scope; it's a category. "An agent that answers shipping-status questions for orders placed in the last 90 days, and escalates everything else" is a scope. A narrow scope makes every other decision below tractable. A broad one makes them all guesses.

**2. Tools — what it can actually do.** Each tool is a capability you are handing over. Keep the set small and non-overlapping: models choose badly among thirty similar tools and well among six distinct ones. Separate reads from writes deliberately, because they carry different risk, and describe each tool as carefully as you'd write UI copy — the description *is* the instruction the model acts on.

**3. Context — what it knows when it decides.** This covers the system prompt, retrieved documents, conversation history, and any state carried between steps. The failure mode here is quiet: an agent that had no way to know something looks identical to an agent that reasoned poorly. When an agent behaves stupidly, check what was actually in its context before blaming the model.

**4. The control loop — how far it runs on its own.** Step limits, timeouts, and the stopping condition. "Stop when the model says it's done" is a stopping condition an agent can talk itself out of. A hard step ceiling is the cheapest safety mechanism that exists, and the one that saves you at 3am.

**5. Guardrails — what happens when it's wrong.** Not if. Input validation before tools run, output checks before results are shown, human confirmation on anything irreversible, and a logged trace of every decision. The design question worth asking out loud: *when this agent is confidently wrong, who notices, and how fast?*

**6. Evaluation — how you know any of this is working.** A test set with known-good answers, run on every meaningful change. Without it, every improvement is a vibe and every regression is a surprise. This one is large enough to deserve its own treatment, and it shapes the other five more than it looks like it should.

## Where teams actually go wrong

**Building the loop before the scope.** The loop is the fun part. Scope is the part that determines whether the loop can ever work.

**Giving it too many tools too early.** Every added tool multiplies the ways a decision can go wrong. The instinct is to expand capability when the agent underperforms; usually the fix is the opposite.

**Trusting the model to stop.** An unbounded loop with a plausible-sounding self-assessment is how a small failure becomes an expensive one.

**Treating a good demo as evidence.** A demo is one path through the system, chosen because it works. The value of an agent is entirely in the paths you didn't choose.

**Leaving evaluation until "after it works."** You can't tell whether it works. That's what evaluation is for.

## Start smaller than feels worth it

The version of this that works is almost embarrassing at first: one narrow task, three tools, a five-step ceiling, a human confirming anything that writes, and twenty test cases you wrote by hand. That agent is boring and it ships. Widen the scope only when the evaluation set says the narrow version is genuinely solid.

Most agents that fail didn't fail because the model wasn't good enough. They failed because nobody decided where the thing was supposed to stop.
