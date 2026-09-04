# CLAUDE.md — Clay Consulting website

Context and working rules for this repo. Read before making changes.

---

## The business

Clay Consulting Group Ltd is a UK marketing and business consultancy for therapists,
counsellors and therapy organisations. Tagline: *Moulding the business side of therapy.*
Founded by George Holloway, who spent over a decade in commercial marketing (most recently
Senior Growth Manager at Amazon) and is training as a psychotherapist at CCPE (graduating 2027).

**Aug 2026: "Launch" and "Grow" retired as tiered product names.** Clay is now positioned as a
consultancy with three sequential offers, all on one page, `/services`:

- **A free 15-minute call** — no cost, 15 minutes, a fit check.
- **A strategy session** — £120, one hour, a written objective and next actions.
- **A Practice Health Check** — scoped per engagement, no published number. Credits the £120
  session fee in full if started within three months of one. May recommend a rebuilt website as
  a follow-on, but that is never sold as a standalone priced product any more.

Free single-page websites are still handled by **Build** (`/build`, unaffected by this change).
`/launch` and `/grow` now 301 to `/services` (`_redirects` + `netlify.toml`). Do not reintroduce
"Launch" or "Grow" as product names anywhere.

**Known gap:** the Home page (`index.html`) still names "Launch" and "Grow" in its body copy and
links directly to `/launch`/`/grow` (which redirect, so nothing breaks, but the wording is stale).
Home was explicitly out of scope for the Services rewrite — update it in a follow-up task.

Primary audience: newly qualified therapists with little income and low confidence about the
business side. Secondary and strategically important: training organisations who might refer
their alumni.

## Why this repo exists

The site was on Squarespace. It was slow to edit (25+ hours of rework), cost £18/month, and
the platform's constraints were shaping the design. This is a straight static rebuild:
faithful content, better structure, no recurring cost.

---

## Hard constraints

1. **No new subscriptions. Ever, unless genuinely unavoidable.** Reducing recurring cost is
   the entire point of this migration. Never propose a paid font, CMS, plugin, or service
   without first exhausting free and self-hosted options, and always state the cost explicitly.
   If something seems to require payment, say so and stop — do not quietly add it.
2. **No frameworks, no build step, no dependencies** unless there is a concrete, stated reason.
   Plain HTML and CSS. It should still work if opened directly from disk.
3. **One stylesheet.** All styling lives in `styles.css`. No inline `style=` attributes, no
   `<style>` blocks in pages, no per-page overrides.
4. **One card definition.** `.card` is defined once and inverts by background band. If a card
   needs to look different somewhere, raise it rather than adding a variant.
5. **British English** throughout — "organisation", "prioritised", "personalise".
6. **Never invent facts about George, Clay, or its clients.** Training status, pricing, job
   titles, client names. If a fact isn't in this file or already on the site, ask.

## Voice

Direct, warm, unpretentious. Short sentences. No marketing throat-clearing, no hedging
("we hope", "we believe we can help"). It should read like a person who knows the sector
from inside it, because he does. Honesty over upsell is an actual stated principle on the
Approach page — the copy should never contradict it.

---

## Design system

Everything is controlled by variables at the top of `styles.css`.

- **Display face:** Fraunces, tuned via `--display-vf` to approximate P22 Mackinac
  (the licensed Adobe font Squarespace was serving). `SOFT` controls terminal roundness,
  `opsz` controls thick/thin contrast. **Do not switch to a paid font.**
- **Body face:** Figtree (Sep 2026). Replaces DM Sans site-wide — a July/Aug 2026 note
  said a Figtree swap had been explicitly rejected; that decision was superseded by the
  Sep 2026 design_handoff_2026 redesign, which explicitly asked for it. If a future brief
  wants to revert, confirm first — don't assume the old rejection still stands, and don't
  assume this new choice is permanent either.
- **Two palettes now coexist, on purpose.** The Sep 2026 redesign (Home + Services) uses
  a cream ground with terracotta/sage accents and drops the blush/stone alternation. The
  old "Warm Classic" variables (`--blush`, `--blush-light`, `--stone`, `--paper`,
  `--accent-terracotta`, `--hair`) are kept defined in `styles.css` **only** because
  `build.html`, `approach.html`, the resources articles, and contact/privacy/404/thanks
  still use them via `.section--stone`/`.section--blush`/bordered `.card`. Don't reuse the
  old variables in new work, and don't delete them until those pages get their own pass.
  Current tokens: `--bg` #f5ead8 (shared page ground), `--surface` #fbf5ea, `--ink` #201e1d,
  `--ink-soft` #4a453d, `--ink-muted` #6b6459, `--rule` #ddd0bc, `--terracotta` #c67139,
  `--terracotta-deep` #8c4a1e, `--terracotta-tint` #f6ded0, `--sage` #7a8a5e, `--sage-tint`
  #e8eddc, `--footer-bg`/`--footer-fg`.
- **Cards, two systems:** old pages keep `.card`/`.path`/`.post`/`.faq`/`.form--panel`/
  `.split__body` — `1.5px solid var(--ink)` border, `var(--radius-card)` radius (now
  **24px**, was 28px — a sitewide change, since it's one shared variable). Home and
  Services use new, separate classes instead (`.price-card`, `.cover-item`, `.compare*`,
  `.compare-card`, `.detail-list`, `.faq2`) — `--surface` fill, no border, soft shadow.
  Don't mix the two systems on the same page.
- **Scale is the point.** Large display type in a wide container with generous vertical
  rhythm is the site's whole personality. Do not shrink headings or narrow the shell to
  "tidy things up". Constrain *line length* for paragraphs (`--measure`), not layout.
- Nav and footer run full-bleed (`.shell--edge`); content sections use `.shell` (1560px).
- Nav CTA (Sep 2026): accent-filled pill, labelled "Book a free call", pointing at
  `/contact` on every page **except** `services.html` (that page's own CTAs carry it, per
  the redesign brief — no `.nav__cta` in its header markup). Footer: brand + tagline now
  grouped in one `.footer__brand-block`; the old `<hr class="footer__rule">` is gone.

---

## Current state

Built and reviewed: Home, Approach, Services, Contact, Privacy, 404.

**Sep 2026: Home rewritten.** Split hero (heading + intro + photo of George, `assets/george-holloway.jpg`,
CTA to `/contact`), a condensed three-card "pathway" summary linking to `/services`, then the
existing clinic-door/what-we-cover/who-we-are/why-this-matters/closing sections, all reworded to
first person and to drop the Launch/Grow references. No "trained" in reference to CCPE anywhere on
the site — George has not graduated (course completes end of 2027, full UKCP registration mid-2028)
— always "training" / "currently training".

**Sep 2026: Home + Services visually redesigned** (`design_handoff_2026` package: `README.md` +
`addendum.md`). Copy unchanged except three explicitly-authorised restructurings: the "4 in 10"
stat pulled out as a display figure on Home, the three "What we cover" paragraphs trimmed of their
leading clause, and Services' three long prose sections compressed into a comparison grid (desktop)
/ stacked cards (mobile) with the full prose kept verbatim in "In detail" accordions below. The SVG
pathway diagram on Services is gone, replaced by the grid + a credit-terms callout. Home's "Why this
matters" panel is shipping **text-only** — a photo was promised separately and hasn't arrived; flag
it and drop it in (`.why-panel--text-only` → `.why-panel`) once supplied, per the design brief's own
instruction not to ship a placeholder box. `approach.html`, `resources.html`, `contact.html`,
`privacy.html`, `404.html`, `thanks.html`, `build.html` and the resources articles were explicitly
left out of this pass and now look inconsistent with Home/Services — that's expected, and is its own
future task, not a bug.

**Nav simplified to five items:** Home, Services, Approach, Resources, Contact. **`Build` removed
from the sitewide nav** (not deleted as a page — `/build` still exists and is still linked to from
Services and the setup-guide article — it's just no longer a top-level nav item, since it's a
pre-launch/waitlist-only feature). This was explicit in the Home-page handover, not a Home-page-only
change; every page's nav was swept.
Also `netlify.toml`, `robots.txt`, `nav.js`.

`resources.html` and 6 articles under `/resources/` are migrated from the old Squarespace
blog — copy is faithful, but dates are placeholders and images were left out (see below).

`/resources/how-to-set-up-a-therapy-practice-uk` (Aug 2026) replaced the old
`free-practice-setup-guide` gate page — full SEO/content rebuild, real numbers, no email
gate, no FAQPage schema (deliberate; see spec). It has genuinely real ICO/MTD/directory
figures, dated `2026-08-27`. Retention copy says "a minimum of six years" for adults,
matching BACP's own published minimum (the source PDF said seven; six is correct). The
professional body fee range quoted (£86–£216) has the £216 upper bound confirmed
(BACP Accredited); the £86 lower bound could not be independently sourced. `_redirects`
now sends both old legacy paths straight to this new URL.

Home has had light improvements applied. The other pages are faithful copies of the
Squarespace originals — an improvement pass is planned but **has not happened yet**, so do
not "fix" copy on those pages unless asked.

### Known outstanding work

- [ ] `/assets/og-image.jpg` and `/assets/favicon.svg` are placeholders (blush background,
      ink monogram) so nothing 404s. Swap for real versions when George has them.
      `george-holloway.jpg` is in, cropped from `IMG_7253.jpeg` — reselect the crop if needed.
- [ ] Blog post dates (`resources.html` and each article) are placeholders spaced a week
      apart from 21 July 2026 backward — not real publish dates. Update when George confirms.
- [ ] Blog post images were deliberately left out during migration — add back later.
- [ ] Privacy policy content is filled in — merged from the reviewed copy live on the
      Squarespace site (data collected, retention, rights) with corrected technical facts
      for the new stack (Netlify/Netlify Forms instead of Squarespace, no analytics/cookies
      currently in use). George should still give it a final read before launch.
- [ ] Grow FAQ answers were written from inference — the originals were collapsed in the
      screenshots. Need verifying against the live Squarespace page.
- [ ] Contact page "I'm looking to…" dropdown options are partly inferred.
- [ ] 301 redirect map from Squarespace URLs. Skeleton is in `netlify.toml`; the real list
      comes from Search Console.
- [ ] `sitemap.xml`.
- [ ] First client testimonial. There's a placeholder block in `index.html` — it must not
      go live with placeholder text.

### Deliberately not done

- No analytics or cookie banner yet. Decide whether GA4 is needed at all before adding
  either; if the site sets no non-essential cookies, no consent banner is required, which
  is the simplest and cheapest position.
- No CMS. Blog posts are hand-written HTML for now, on purpose — the friction should be
  felt before machinery is built to solve it.

---

## Deployment

GitHub → Netlify, auto-deploy on push to `main`. Domain at 123 Reg.

**Critical:** Titan email runs on this domain's MX records. When DNS is switched, change
only A/CNAME records for the website. Touching MX breaks george@clayconsulting.co.uk.

Forms use Netlify Forms (`data-netlify="true"`) with honeypot fields. No backend.

**Cache-busting `styles.css`:** `netlify.toml` caches `/styles.css` for a year
(`max-age=31536000`). Every page links to it as `/styles.css?v=N`. **Whenever you edit
`styles.css`, bump `?v=N` to `?v=N+1` on every page that links it** — otherwise returning
visitors keep serving their old cached copy indefinitely. Current version: `v=17`.

---

## How to work with George

- He is commercially sharp and not a developer. Explain trade-offs in plain terms and give
  a recommendation, not a menu of options.
- He prefers being told when something is a bad idea. Push back rather than complying.
- Prefer showing the change over describing it at length.
- Ask clarifying questions before large changes rather than guessing and building the
  wrong thing.
