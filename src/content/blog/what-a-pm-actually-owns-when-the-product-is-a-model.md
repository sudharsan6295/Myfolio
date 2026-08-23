---
title: "What a Product Manager Actually Owns When the Product Is a Model"
description: "The job description doesn't change much on paper. The day-to-day is almost unrecognizable. Notes on where the boundaries actually sit."
pubDate: 2026-04-18
category: "AI Product Management"
tags: ["role definition", "evals", "team structure"]
featured: false
---

"AI product manager" is still a job title people are figuring out in real
time, which means everyone's doing it slightly differently. Here's the
division of ownership that's worked for the teams I've been on, and — more
usefully — where it *doesn't* work and why.

## The three things I own that a traditional PM often doesn't

**The eval set.** Not writing every test case myself, but owning that it
exists, that it's reviewed regularly, and that it reflects real usage instead
of the launch demo. An eval set that never changes after launch is a museum
piece, not a safety net.

**The confidence threshold.** Somewhere in the system there's a number —
explicit or implicit — that decides "confident enough to act automatically"
versus "hand this to a human." That number is a product decision dressed up
as an engineering constant, and I've seen it get set by whoever happened to
be in the code that week if nobody claims it on purpose.

**The fallback experience.** What the user sees when the model is uncertain,
wrong, or unavailable isn't a loading-spinner afterthought — it's a design
surface I spend real time on, because for a meaningful slice of users, the
fallback *is* the product.

## A small piece of the eval harness, for context

I'm not the one implementing this, but I need to be able to read it, argue
with it, and know what it's actually checking:

```python
def score_response(response: str, expected: EvalCase) -> EvalResult:
    """Score a single model response against a hand-labeled eval case.

    Correctness alone isn't enough — a response that's right but
    unconfident, or right but violates a guardrail, still fails.
    """
    if violates_guardrail(response, expected.guardrails):
        return EvalResult(passed=False, reason="guardrail_violation")

    if not is_semantically_correct(response, expected.answer):
        return EvalResult(passed=False, reason="incorrect")

    if requires_high_confidence(expected) and not is_well_calibrated(response):
        return EvalResult(passed=False, reason="overconfident")

    return EvalResult(passed=True, reason="ok")
```

Being able to read that function, question the three failure reasons in it,
and argue for a fourth is, in practice, most of the job.

## Where the traditional PM skills still do all the work

Discovery, prioritization, stakeholder alignment, writing a spec someone can
actually build from — none of that goes away, and I'd argue it matters more,
not less, because the failure modes are less intuitive to explain to a
skeptical stakeholder than "the button was in the wrong place." You still
need every muscle a good PM already has. You're just adding a few new ones,
and the eval set is the one I'd tell any PM moving into this space to build
first.
