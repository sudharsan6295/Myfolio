---
title: "What Business and AI Together Look Like: The Value vs. Effort Matrix I Actually Use"
description: "Most 'AI and business' conversations skip the part where you decide what to build first. Here's the value-vs-effort framework I use to sort real initiatives from expensive demos."
pubDate: 2026-08-10
updatedDate: 2026-08-25
category: "Business"
tags: ["AI strategy", "prioritization", "product management"]
featured: true
---

I spent ten years running delivery for enterprise PLM programs — upgrades,
migrations, cloud moves — where the actual scarce resource was never
enthusiasm for the roadmap; it was capacity to build anything at all. Every
program board I've sat in devolves into the same argument: this initiative
and that initiative both look strategic on a slide, but only one of them
ships this quarter. AI hasn't changed that constraint. If anything it's made
it worse, because now the ideas are cheap enough to generate that everyone
in the room has three.

What "business and AI together" actually looks like in practice isn't a
strategy document. It's whichever handful of initiatives survive contact
with a sequencing conversation — and the tool I've found does that
conversation the least badly is a plain value-versus-effort matrix.

## Business and AI, without the deck

Most "AI transformation" conversations I've sat in start from the
technology: what can a model do now that it couldn't two years ago. That's
an interesting conversation and the wrong starting point. The version of
"business and AI together" that actually survives a budget cycle starts
from a business outcome that already matters — a cost that's too high, a
decision that's too slow, a queue that's too backed up — and only then asks
whether AI is the right lever for it. Sometimes it isn't. A slow decision
caused by three people needing to sign off in sequence isn't an AI problem;
it's a process problem an LLM will happily paper over instead of fix.

Once you've filtered down to the initiatives where AI genuinely is the
right lever, you still have more of them than you have capacity. That's the
real prioritization problem, and it's the one the matrix solves.

## The value vs. effort matrix

Two axes, four quadrants, nothing exotic:

- **Value (vertical)** — what happens if this works: revenue protected or
  unlocked, cost removed, risk reduced, hours given back to people who
  currently spend them on the thing. I score this in the same terms a
  program sponsor already uses to justify budget, not in "AI-native" terms
  — a finance sponsor doesn't care that something uses an LLM, they care
  what it's worth.
- **Effort (horizontal)** — what it actually costs to get there: data
  readiness (does the input already exist somewhere usable, or does
  someone have to go build a pipeline first), model complexity (a
  classification call versus an agent making multi-step decisions),
  integration surface (one system or five), and the change-management cost
  of getting the people downstream to actually trust and adopt the output.

Four quadrants fall out of that:

**Quick wins — high value, low effort.** Ship these first, always. In
practice this is usually something narrow: auto-drafting a first-pass
summary a human still reviews, or tagging and routing that used to be
manual and rules-based. Low glamour, real return, and — just as important —
a fast enough feedback loop that the organization learns what "good" looks
like before it commits to anything bigger.

**Big bets — high value, high effort.** Worth doing, but they need the same
discipline a multi-quarter PLM migration needs: staged rollout, a real
rollback plan, and a sponsor who understands it won't be done in one
sprint. This is where program-management habits carry over almost
unchanged — the risk register just has different line items on it now.

**Fill-ins — low value, low effort.** Fine to do when a team has slack,
actively wrong to prioritize over anything above. The trap here is that
these are the easiest demos to build, so they're overrepresented in every
"look what AI can do" deck — easy to build isn't the same as worth
building.

**Thankless — low value, high effort.** Kill these in the planning
conversation, not six months into the build. The giveaway is usually a
proposal that leads with the technology ("we could use an agent for this")
instead of the outcome — if you can't state the value in the sponsor's own
terms, the effort number won't save it.

## Where this actually earns its keep

The matrix itself isn't the hard part — drawing four boxes takes five
minutes. The hard part, and the part that's genuinely the same skill I used
sequencing PLM cutover risk, is getting a room of technical and business
stakeholders to agree on where a given initiative actually sits before
anyone's built anything. That's a translation job as much as an analysis
job, and it's the reason I think it's the right seat for someone with a
delivery background to be sitting in — not because the framework is
clever, but because getting people to agree on the inputs to it is the
actual work.
