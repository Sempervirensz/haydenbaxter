# The offer screens — root cause and recommendation

## The problem is not styling

Six separate bugs were fixed in this thread. Every one of them is the same
decision wearing different clothes: **page-shaped content was put inside a
fixed-height card.**

| Symptom | Where it came from |
| --- | --- |
| Content overflows the card (886–1048px of offer in a 695px frame) | The card cannot grow |
| The panel scrolls inside a page that is already scrolling | Forced by the above |
| The photo has to blur 22px and dim to 40% | The image is competing with the copy for the same pixels |
| A bespoke "Back to options" control | A mini-SPA was built inside a card |
| Chapter rail and eyebrow overlapping | Two headers fighting for one top strip |
| Dead space below short panels | A fixed frame with variable content |

Fixing them individually is whack-a-mole. They regenerate because the container
is wrong for the content.

## The cost that isn't visible

Nested scroll is the *usability* problem, and it is real: on a trackpad the
page scrolls, the pointer crosses the panel, the panel takes over, then the
page resumes — with no affordance explaining any of it. On a phone it is worse,
because the panel and the page compete for the same drag.

But the **business** problem is bigger and completely invisible in a screenshot:

> **The offers have no URL.**

You cannot send anyone a link to your consulting offer. It cannot be
bookmarked, shared in a DM, put in an email signature, cited in a proposal, or
indexed by a search engine. The browser's back button does not know it exists.
For a portfolio whose job is business development, that is not a styling
nit — it is the single largest functional gap on the site.

## The second problem: the three offers are not parallel

They are currently poured into one template — eyebrow, title, lede, two blocks,
signals, note, two actions — because that is the shape the dossier panel had.
But:

- **Consulting** is a *service*. Its reader wants scope, process, and how to
  start.
- **WorldPulse** is a *venture*. Its reader wants positioning, who it is for,
  and what conversation is open.
- **Experience** is a *credential*. Its reader wants record, chronology, proof.

Forcing three different jobs through one template is why every layout in this
lab feels like a compromise somewhere. The template should flex per offer type.
That work is not done here, and it is the natural next step.

## Recommendation

**Promote the offers to routes.** `/offer-lab/[offer]` demonstrates it end to
end, and it is measurably better on every axis that was failing:

| | Panel in card | Offer as page |
| --- | --- | --- |
| Scroll | Nested | One |
| Blur needed | 22px + 40% dim | None |
| Addressable | No | Yes — deep links verified |
| Browser back | No | Yes — verified |
| Content limit | 695px, then clipped | None |
| Change your mind | Reverse out to the row | Two sibling links, no backtracking |

**Keep the CTA row exactly where it is.** The row is genuinely good in the
card: it is a moment, an invitation, and it belongs at the end of the Work
chapter. What it should do is *link out*, not disclose in place. In routed
mode the choices become real `<a href>` elements, which restores middle-click,
open-in-new-tab, copy-address, and the back button for free — and drops
`aria-expanded`, which was a lie to a screen reader the moment the control
started navigating.

## Try it

```
/cta-lab/in-site          → panel "Choices open into" → Routed pages
/offer-lab/consulting?layout=editorial&surface=dark
/offer-lab/worldpulse?layout=split&surface=paper
```

Layout and surface ride in the query string so a specific treatment stays
linkable while it is still being argued about.

## Verified

Homepage untouched. Choices are `<a>` with real hrefs and no `aria-expanded`.
Navigation works, browser back returns to the site, deep links resolve layout
and surface. **Zero nested scrollers and zero blurred elements** on the offer
pages. No horizontal overflow at 1440 / 768 / 390.
