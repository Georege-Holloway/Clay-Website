# CLAUDE.md — Clay Consulting website

Context and working rules for this repo. Read before making changes.

---

## The business

Clay Consulting Group Ltd is a UK marketing and business consultancy for therapists,
counsellors and therapy organisations. Tagline: *Moulding the business side of therapy.*
Founded by George Holloway, who spent over a decade in commercial marketing (most recently
Senior Growth Manager at Amazon) and is training as a psychotherapist at CCPE (graduating 2027).

Two services:

- **Launch** — website, SEO and Google Business Profile for newly qualifying practitioners.
  £99 setup + £25/month. There is also an affiliate rate for institutional partners
  (£0 setup + £10/month) which is deliberately **not** published on the site.
- **Grow** — a structured Practice Health Check for established practices and organisations.
  Scoped per engagement, roughly £700–£1,000. Price is deliberately not published.

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
- **Body face:** DM Sans. (Aug 2026: a Caprasimo/Figtree swap was explored via a design
  mockup and explicitly rejected — George confirmed keeping Fraunces/DM Sans. Don't
  revisit without asking.)
- **Palette ("Warm Classic" refresh, Aug 2026):** `--blush` #e0c8bc, `--blush-light`
  #ecdcd3, `--stone` #eae9e6, `--paper` #efe4cf, `--bg` #f5ead8 (page background),
  `--ink` #201e1d, `--ink-soft` #3a3734, `--footer` #2e2b25. Pages alternate full-bleed
  colour bands on a cream (not white) body background.
- **Cards:** every `.card`/`.path`/`.post`/`.faq`/`.form--panel`/`.split__body` has a
  `1.5px solid var(--ink)` border and `var(--radius-card)` (28px) radius. Buttons are
  fully pill-shaped (`var(--radius-pill)`, 999px). This replaced the previous
  borderless/sharp-cornered look.
- **Scale is the point.** Large display type in a wide container with generous vertical
  rhythm is the site's whole personality. Do not shrink headings or narrow the shell to
  "tidy things up". Constrain *line length* for paragraphs (`--measure`), not layout.
- Nav and footer run full-bleed (`.shell--edge`); content sections use `.shell` (1560px).
- Nav has no separate "Contact" link — the "Contact us" pill CTA covers it, so it was
  removed from `.nav__links` to avoid duplication (Aug 2026).

---

## Current state

Built and reviewed: Home, Approach, Launch, Grow, Contact, Privacy, 404.
Also `netlify.toml`, `robots.txt`, `nav.js`.

`resources.html` and 6 articles under `/resources/` are migrated from the old Squarespace
blog — copy is faithful, but dates are placeholders and images were left out (see below).

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
visitors keep serving their old cached copy indefinitely. Current version: `v=9`.

---

## How to work with George

- He is commercially sharp and not a developer. Explain trade-offs in plain terms and give
  a recommendation, not a menu of options.
- He prefers being told when something is a bad idea. Push back rather than complying.
- Prefer showing the change over describing it at length.
- Ask clarifying questions before large changes rather than guessing and building the
  wrong thing.
