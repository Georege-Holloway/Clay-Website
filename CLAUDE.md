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

**Sep 2026: "Strategy session" and "Health Check" renamed and unbundled — supersedes the Aug 2026
positioning above.** Two problems drove this: "Health Check" undersold a full strategic review, and
the two products cannibalised each other (the £120 session fee credited in full against a Health
Check told buyers they were the same product at two prices). Fix: three named products, no credit
between them, each standing alone.

- **Strategy session → Growth Sessions** (plural — the service, not a single unit). Still £120,
  still one hour, but repositioned as a recurring thinking-partner service (monthly, weekly or
  one-off, no contract) rather than a single fixed-scope session. Own page: `/growth-sessions`.
- **Health Check → Growth Blueprint**. Same full strategic review (website, search visibility,
  directories, GBP, competitors), same scoped/no-published-price model. Own page:
  `/growth-blueprint`.
- **The £120 credit is gone entirely.** Growth Sessions and a Growth Blueprint are peer services,
  not a ladder — copy must never imply one leads to the other. Don't reintroduce "Health Check",
  "Strategy session" (as a product name) or any £120-comes-off wording anywhere on the site.
- **Growth Check** — a new free 12-question quiz/lead tool, built but **not published**:
  `growth-check.html` exists on disk with `noindex, nofollow`, is excluded from `sitemap.xml`, has
  no nav entry and no inbound internal links from any live page — reachable by direct URL only.
  Three items are still open before it can go live: email-gating decision, how Neil's separate quiz
  build integrates (in-page/embed/link-out — currently a placeholder block), and the final question
  count. The file has a comment at the top listing all five things to reverse when it does go live.
- **Nav gained a dropdown.** Services is still a direct link to `/services`; a separate
  `.nav__dropdown-toggle` button (reusing the `.chev` accordion chevron, state driven by
  `aria-expanded`) reveals Growth Sessions / Growth Blueprint. Desktop also opens on `:hover`
  **only** (not `:focus-within` — that caused a real bug: Escape closes the menu and returns focus
  to the toggle per `nav.js`, and the toggle sits inside `.nav__item`, so `:focus-within` alone
  would keep the panel visually open right after Escape "closed" it). Mobile expands inline within
  the existing mobile-nav accordion pattern. `nav.js` also handles Escape-to-close-and-refocus and
  ArrowUp/ArrowDown between the two dropdown links. **Do not add Growth Check to this dropdown**
  while it's unpublished.
- **Services thinned into a hub.** The old "In detail" accordion section and the "What happens
  afterwards" / "Who this is not for" two-column section are gone from `/services` — that content
  now lives on the two detail pages. The visible FAQ trimmed from 8 questions to 3 genuinely
  cross-cutting ones; product-specific FAQs moved to their own pages.
- **`/grow` now redirects to `/growth-blueprint`**, not `/services` (`_redirects` +
  `netlify.toml`'s `/grow.html` block) — it carries real search/generative-search equity and must
  keep 301ing rather than 404. **`/launch` is unresolved** — still points to `/services` for now;
  George has not confirmed whether it should redirect to `/growth-blueprint`, Home, or 404 once
  Launch is properly retired as a product line. Don't change it without confirming first.
- Two `approach.html` "How we work" cards ("One team, one bill, one place" and "Your practice, in
  your name") still describe a done-for-you managed-service model that doesn't cleanly match this
  three-product advisory structure. Flagged for George, not rewritten — the Sep 2026 handover was
  explicit that these needed his review rather than an assumed rewrite.

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

Built and reviewed: Home, Approach, Services, Contact, Privacy, 404, Growth Sessions, Growth
Blueprint. Growth Check is built but deliberately unpublished (see the Sep 2026 restructure
note above).

**Sep 2026: Home rewritten.** Split hero (heading + intro + photo of George, `assets/george-holloway.jpg`,
CTA to `/contact`), a condensed "pathway" summary linking to `/services`, then the
existing clinic-door/what-we-cover/who-we-are/why-this-matters/closing sections, all reworded to
first person and to drop the Launch/Grow references. No "trained" in reference to CCPE anywhere on
the site — George has not graduated (course completes end of 2027, full UKCP registration mid-2028)
— always "training" / "currently training".

**Sep 2026 (later revision): "pathway" model corrected from three peer options to one universal
free call + two peer options.** The free 15-minute call is not a peer choice alongside Strategy
session and Health Check — it's the universal first step, and Strategy session / Health Check are
peer options after it, neither more "advanced" than the other. On Home this means **two** price
cards only (Strategy session, Health Check), no numbering (`price-card__num` removed), no accent/
ranking fill on either (`price-card--accent` removed) — a credited-fee note sits below both as a
`.note`, not a third card. On Services, the hero gained a lede sentence stating this framing
explicitly, and the credit-terms callout was reworded to drop "they run in sequence" (which
contradicted the peer framing). The three-column comparison grid on Services (Free call / Strategy
session / Health Check) was deliberately left as three columns — neither revision handover asked for
that layout to change, only the surrounding copy.

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

**Sep 2026: Homepage sections reordered — content unchanged.** Per the Homepage Restructure
Handover, `index.html`'s section order is now Hero → Problem ("Most therapy training ends at
the clinic door") → Who we are → What we cover → How we work (the `#pathway` price-cards
section) → *(testimonials marker — see below)* → Why this matters → Final CTA. Previously
"How we work" sat right after the hero and "Who we are" sat after "What we cover" — pure
reorder, no copy touched, no section restyled. A future testimonials section (pending a
quote from Aaron) slots in between "How we work" and "Why this matters" — there's an HTML
comment marking the spot; don't build a placeholder until real content exists. The
handover's own copy snapshot for "How we work" was stale on two points and NOT carried
over: it proposed reverting the intro line to a "two ways to work with me" framing (the
current three-peer-card framing is correct and unchanged) and re-adding a £120-credit note
between Growth Sessions and a Growth Blueprint (removed deliberately in the Sep 2026 rename
— they're peer services with no credit between them; don't reintroduce that note). This was
a structure-only pass; individual sections' visual treatment was redesigned in a
follow-up (see below).

**Sep 2026: Home section redesigns.** Note for next time — `Clay website redesign
options.zip` (in the parent folder, referenced early in this task) turned out to be a
**stale** package: Warm Classic tokens, Caprasimo font, Launch/Grow as separate pages, all
long superseded. The actual reference was three mockup screenshots the user pasted directly
into chat, labelled 1A / 1B / "2a hero" by them. Section changes, all on `index.html` only:
- **Hero → "2a hero":** replaced the split photo+text hero (`.hero2`, now unused but kept
  in `styles.css` in case another page wants that pattern) with a centred, text-only
  layout (`.hero3`): the large logo lockup (`assets/clay-logo-hero.png`, cropped and
  chroma-keyed from the same brand sheet as the nav/footer logo — see below) sits above the
  H1, then lede, then both CTAs, centred. George's photo and the eyebrow/credibility line
  are gone from Home's hero (the photo is still used on Approach and now also on the new
  "Who we are" section below).
- **Who we are → "1B":** two-column `.split-feature` — small-caps `.eyebrow` label
  ("WHO WE ARE"), blurb, "More on how I work →" link on the left; George's photo
  (`.washed`, same treatment as the old hero) on the right.
- **What we cover → "1B":** two-column `.cover-split` — heading on the left
  (`.h2-flat`, freed up since "How we work"'s heading moved to `.h-section`); on the right,
  the three items as a vertical list reusing `.process-list`/`.process-item` (the same
  numbered-circle component built for the Growth Blueprint's "How it runs" steps) instead
  of the old 3-column `.cover-grid`. Copy unchanged.
- **How we work:** kept exactly as-is per instruction — only its heading changed from
  `.h2-flat` to `.h-section` (matching every other section title's size) and the lede
  gained `margin-inline:auto` so it actually centres under the ancestor's
  `text-align:center` (it wasn't before — the paragraph's own `max-width` meant
  text-align alone left it visually left-aligned).
- **Why this matters:** `.why-panel--text-only` lost its `max-width:70ch` cap so the panel
  now spans the full `.shell` width ("stretch to the edges"); the text itself is wrapped in
  a new `.why-panel__body{max-width:62ch}` so paragraphs don't stretch full-width and
  become hard to read. **Still needs a real photo** to complete the mockup's two-column
  `.why-panel` (image left, stat+text right) — per this repo's own established rule, don't
  ship a placeholder box for it. George to supply something in the spirit of the mockups'
  own suggested captions ("desk, notebook, or practice space", "hands, chair, window
  light") — a calm, real photo, not stock-looking. Swap `why-panel--text-only` back to the
  plain `.why-panel` grid and add a `.why-panel__figure` once supplied.
- **Final CTA:** unchanged, per instruction.

**Sep 2026: Growth Blueprint given a fixed, published price — £1,200 flat, sitewide.**
Supersedes every earlier "scoped per engagement, no fixed price" note above — this was a
deliberate reversal George made directly (asked for by name, after being warned it
contradicted the FAQ copy explaining why there was no fixed price). £1,200 was chosen over
£1,199/£1,195 on the grounds that a "£X99" ending reads as retail/impulse pricing, which
cuts against the brand's plain, no-upsell voice. Flat means flat: it does not vary by
practice size or organisation — updated everywhere accordingly:
- `growth-blueprint.html`: hero price line, `Service` JSON-LD (now `price`/`priceCurrency`
  instead of a priceless `PriceSpecification`), the "How much does a Growth Blueprint
  cost?" FAQ (both visible and `FAQPage` JSON-LD, rewritten — it used to argue *for* having
  no number), and the "Proposal" step in "How it runs" (dropped "price" from what the
  proposal sets out, since it's no longer determined per engagement — scope and what's out
  of scope still are).
- `services.html` and `index.html`: comparison table/price-card "Scoped" → "£1,200", plus
  their own `Service` JSON-LD offers updated the same way as growth-blueprint.html's.
- `llms.txt`: "(scoped and agreed per engagement, no fixed price)" → "(£1,200, flat fee)".
Do not reintroduce "scoped"/"no fixed price" language for the Blueprint anywhere without
George explicitly asking — grep for "scoped" and "per engagement" before adding any new
Blueprint copy.

**Sep 2026 (13th): Services page retired; nav flattened; its comparison table moved to
Home.** Supersedes the "Nav gained a dropdown" entry above — the dropdown lasted about a
day. Per the Homepage & Navigation Update handover (dated the same day, explicitly
superseding an earlier homepage-reorder-only handover):
- **`services.html` is deleted.** No unique content survived once its one comparison table
  moved to Home and the nav pointed straight at the two service pages. `/services` and
  `/services.html` both 301 to `/` (`_redirects` + `netlify.toml`) rather than 404, in case
  of inbound links or AI-assistant citations. Removed from `sitemap.xml`.
- **Nav dropdown removed, sitewide.** Every page's `<li class="nav__item">` (Services link +
  `.nav__dropdown-toggle` button + `.nav__dropdown` submenu) became two plain top-level
  `<li>`s: Growth Sessions, Growth Blueprint. Nav is now Home / Growth Sessions / Growth
  Blueprint / Approach / Resources / Contact (Contact still button-only on desktop, as
  before — unrelated pre-existing behaviour). The dropdown's CSS (`.nav__item`,
  `.nav__dropdown-toggle`, `.nav__dropdown` and their mobile/hover rules) and JS
  (everything in `nav.js` past the hamburger toggle) were both fully dead once no page
  referenced them, so both were deleted rather than left as unused code — this was a
  genuine retirement, not a visual-only change, so there was no reason to keep it around
  "just in case." `.chev` itself stays — it's shared with the FAQ accordions.
- **Home's "Ways to work together" section** now holds the full three-column comparison
  table (`.compare` / `.compare--mobile`), reusing the exact markup/classes from the old
  Services page verbatim — not the three simple price-cards from the Sep 2026 section
  redesign pass. The "More on Growth Sessions/Blueprint →" links that sat below the table
  on Services were deliberately not carried over (they'd duplicate the table's own
  per-column CTAs), and neither was the old "See how it works →" link (pointed at the
  now-gone `/services`).
- **Home's hero** lost its secondary "See how it works →" CTA (same reason: pointed at
  `/services`) — single CTA only now, "Book a free 15-minute call".
- **"What we cover"'s Visibility line** reworded: "your website, your directory listings,
  and increasingly what AI assistants say about you" → "and whether that turns into
  enquiries, especially as search shifts toward AI assistants" (the old phrasing duplicated
  the Growth Blueprint description and read as tied to the retired website-audit framing).
- Every other body-copy link that pointed at `/services` (`build.html`'s "See how I work
  with practices →", and a "compare both options on the Services overview →" line on both
  `growth-sessions.html` and `growth-blueprint.html`) was repointed at `/` and reworded
  ("...on the homepage →") rather than left dangling.
- `/launch` in `_redirects` was pointing at `/services` as its interim default — retargeted
  to `/` since `/services` no longer exists. The underlying question (should `/launch`
  eventually go to Home, `/growth-blueprint`, or 404) is still open and still George's to
  confirm — this only avoided a redirect chain through a page that's now gone.
- Testimonials are still not built — same reason as ever (pending a quote from Aaron), same
  HTML comment marking the slot between "Ways to work together" and "Why this matters".
- **Bug caught and fixed while cleaning up dead CSS**: the `.price-card p.price-card__price`
  selector introduced two commits ago (to fix a specificity bug where `.price-card p{margin:0}`
  was overriding it) accidentally scoped the whole price-line style to `.price-card`
  ancestors. That silently broke the standalone `<p class="price-card__price">` price line
  on `growth-sessions.html`/`growth-blueprint.html` (unstyled, browser-default serif at
  16px) the moment `.price-card` itself stopped being used anywhere. Fixed by restoring a
  plain, unscoped `.price-card__price` rule now that the old scoping problem is moot (its
  container is gone). Worth remembering: deleting the last user of a component doesn't
  make everything that referenced its classes safe — check for other unrelated elements
  reusing the same class name standalone before assuming a class is fully retired.

**Sep 2026 (13th): Growth Sessions / Growth Blueprint rebuilt from a design export.**
Source was a Claude Design export (`Growth sessions page redesign.zip`) — a self-decoding
preview bundle, not production markup, so the actual build reused the site's existing
static HTML/CSS conventions rather than any of the export's own runtime/custom elements.
Typography: the export used Caprasimo/Figtree; George confirmed keeping Fraunces (the
site standard, already paired with Figtree) rather than a two-page-only type change.
New, `gp-`-prefixed classes added to `styles.css`, explicitly scoped to these two pages
(per the handover's own instruction) rather than folded into shared components:
- **`.gp-hero`** — dark hero band (reuses `--sage-deep`, already defined but previously
  unused in any HTML) replacing the plain cream hero background. No hero photo: the
  export's `<image-slot placeholder="Abstract photograph">` had no real asset behind it,
  so — same call as the Home "Why this matters" panel — shipped text-only rather than a
  placeholder box. Add one later by giving `.gp-hero .shell` a two-column split.
- **`.gp-sticky`** — a new component: a `position:sticky` price/CTA bar sitting directly
  under the nav (`top:84px` desktop / `68px` mobile, matching nav height), translucent
  `--surface` background via `color-mix()`.
- **`.gp-tint--peach`/`.gp-tint--cream`** — section background alternation (reuses
  `--terracotta-tint`/`--surface` — not the export's own slightly-different hex tints,
  to stay inside the site's existing palette rather than adding near-duplicate tokens).
- **`.gp-table`** — the numbered ("What people bring") and labelled ("What gets looked
  at") two-column row lists, replacing plain `<ul>`s.
- **`.gp-cards-3`** — Growth Sessions' "How often" (Monthly/Weekly/single session), three
  cards where there used to be plain paragraphs.
- **`.process-list--row`** — a horizontal-grid modifier on the *existing* `.process-list`/
  `.process-item`/`.cover-item__num` component (used vertically elsewhere, e.g. the
  Blueprint's own "How it runs"), reused here for Sessions' "Why me for this" three-step
  instead of inventing a parallel numbered-badge component.
- **`.gp-cross`** — the "Sessions or a Blueprint?" / "Who it's for, who it isn't" two-card
  cross-link sections.
- **`.gp-callout`**, **`.gp-tags`** — small labelled box ("Guidance, not supervision") and
  pill tags (Now/Next/Later) respectively.
- **`.gp-cta-band`** — solid terracotta closing-CTA section (as opposed to `.section--tint`,
  which is the *light* terracotta-tint used elsewhere) — needed its own text-link/button
  colour overrides for contrast (plain black `.btn`, not `.btn--accent`, since accent
  *is* terracotta and would vanish into the band).
Copy: every em dash in this handover's copy was already rewritten (colons/full
stops/commas) before it reached this repo — carried over verbatim, including into both
pages' `FAQPage` JSON-LD, which had been quietly left with the old em-dash phrasing.
Testimonials again shipped off — an HTML comment marks the slot, no placeholder block.
Both pages' "compare both options" links now point at `/#pathway` specifically (not just
`/`), and `#pathway` got `scroll-margin-top:100px` so the anchor doesn't land under the
sticky nav — refining a fix already made in the Services-retirement commit two tasks ago
(that one pointed both links at plain `/`). Of the handover's two flagged "fixes to make,"
only one was still live: the other — Blueprint's "resources are free in the meantime" line
supposedly self-linking — was already pointing at `/resources` before this task started,
so the handover's claim there was stale; flagged rather than silently no-op'd.

**Sep 2026 (13th), follow-up fixes:** George caught three real bugs from the pass above —
- **`.gp-sticky` removed entirely** (HTML, CSS, mobile overrides). It duplicated the hero's
  own price/CTA content and, being `position:sticky` right under the equally-sticky nav,
  visually congested the top of the viewport on scroll. Its content wasn't lost: both
  hero `.gp-hero__actions` blocks now carry the secondary "Free 15-minute call" button
  alongside the primary CTA, so nothing the sticky bar offered is gone, it's just not
  pinned. Needed a same-turn addendum: the secondary button uses `.btn--outline`, which
  is dark-on-transparent by default and invisible against the dark `.gp-hero` background
  — added `.gp-hero .btn--outline{border-color:#fff;color:#fff}`.
- **`.gp-card` and `.gp-side` were invisible against their own section backgrounds.**
  `.gp-tint--cream` and the un-tinted default state of both components all resolved to
  the same `--surface` token, so "How often"'s three cards (Growth Sessions) and two of
  the four `.gp-side` callouts (one per page) had no visible boundary at all — just
  paragraphs of uneven length sitting directly on the page background, which is what
  actually read as "formatting issues" rather than a deliberately plain layout. Fixed
  `.gp-card` to a flat `#fff` (matches this repo's established "cards invert on tinted
  bands" convention, e.g. `.section--stone .card{background:#fff}`) and added
  `.gp-tint--cream .gp-side{background:#fff}` alongside the existing peach-band override.
- **"Why me for this" (Growth Sessions) had a real alignment bug**, not just a design
  choice: its intro heading+paragraph were wrapped in `.article` (68ch measure,
  `margin-inline:auto` — i.e. centred and narrower than the shell), sitting directly above
  `.process-list--row` and `.gp-callout`, both full shell width with no such centring. The
  intro visibly started indented relative to everything below it. New `.gp-intro`
  class (60ch cap, no auto-centring, left flush) replaces `.article` here specifically —
  don't reach for `.article` when a narrow block sits above a full-width grid; the mismatch
  is exactly this bug.

**Sep 2026: text wordmark replaced with the real logo, sitewide.** George supplied
`Clay Consulting Logo.zip` — two full brand-sheet exports (`clay-logo-light.png` /
`clay-logo-dark.png`, each a flat-background canvas showing four lockup variants: a large
hero wordmark+tagline, a compact horizontal "— Clay" mark, a pill badge, and a circular "C"
monogram), not pre-cut transparent assets. George chose the compact horizontal mark for
the nav/footer. `assets/clay-logo-header.png` (black text + terracotta dash, for the light
nav background) and `assets/clay-logo-footer.png` (cream text + sage dash, for the dark
footer) were cropped from those sheets and chroma-keyed to transparent PNGs — both
280×97, sized in CSS via `.nav__brand img{height:32px}` / `.footer__brand img{height:36px}`.
Every page's `<a class="nav__brand">` and `<p class="footer__brand">` now hold an `<img
alt="Clay Consulting">` instead of the text string. The large hero wordmark+tagline variant
was cropped the same way as `assets/clay-logo-hero.png` (925×479 native, sized via
`.hero3__logo{width:min(380px,60%)}`) once Home's hero was redesigned to use it as its
centrepiece — see the Home section-redesigns entry above. The pill badge and circular
monogram from the brand sheet still aren't used for anything — the monogram in particular
would be a good candidate for `/assets/favicon.svg`/`.png`, which are still placeholders
(see below), if George wants to revisit that.

**Sep 2026 (14th): Growth Blueprint renamed to Growth Strategy, sitewide — better for
ranking, per George.** Treated as a full URL migration, not just a copy change, since the
old page had live traffic and search/generative-search equity to carry over:
- `growth-blueprint.html` renamed to `growth-strategy.html` (`git mv`). New canonical URL
  is `/growth-strategy` everywhere: nav, footer, JSON-LD, sitemap, llms.txt, and every
  cross-link from `growth-sessions.html`, `growth-check.html`, `index.html` and the
  resources articles.
- **`/growth-blueprint` now 301s to `/growth-strategy`** (`_redirects`), mirroring the same
  care already given to `/grow` and `/services` when they were retired. `netlify.toml`'s
  own `/grow.html` rule was auto-updated to point at `/growth-strategy` too; no separate
  `.html`-suffixed rule was needed for the renamed page itself.
- The mechanical find-replace only handled the full "Growth Blueprint" phrase and
  `/growth-blueprint` URLs. Every bare "Blueprint" callback noun needed manual, context-
  sensitive rewording instead:
  - `growth-strategy.html`'s "A blueprint, not the building" pun (relied on the word
    "blueprint" and no longer maps to the product name) became **"The plan, not the
    build"**, with its body now saying "the report" instead of "the Blueprint" — ties back
    to the hero's own "a plan you can act on" line rather than trying to force a new pun.
  - Other bare references in `growth-strategy.html` ("what the Blueprint is for", "a
    Blueprint is the right fit", "a Blueprint won't tell you much", the FAQ's "A Blueprint
    gives you evidence... start with the Blueprint", both visible and in the `FAQPage`
    JSON-LD) became "the Strategy" / "a Growth Strategy" / "the Growth Strategy" as fit
    each sentence. The two FAQ anchor IDs (`blueprint-cost`, `session-vs-blueprint`) were
    renamed to `strategy-cost` / `session-vs-strategy` — confirmed nothing links to them.
  - `growth-sessions.html`'s cross-link heading "Sessions or a Blueprint?" / "Or a
    Blueprint?" became "Sessions or a Strategy?" / "Or a Strategy?".
  - `index.html`'s comparison-table CTA "Book a Blueprint" (both desktop `.compare` and
    mobile `.compare-card` versions) became **"Book a Strategy"**, matching the sibling
    "Book a session" button's short form.
- `sitemap.xml` `lastmod` bumped to 2026-09-14 for `/`, `/growth-sessions` and
  `/growth-strategy` — the three pages actually touched today.
- Re-ran the sitewide internal-link sweep after the rename: no new broken links (the one
  pre-existing `/resources/free-practice-setup-guide` reference in `thanks.html` is
  unrelated and already covered by its own 301).

**Sep 2026 (14th): mobile bug in `.gp-table__row--labelled` fixed.** Its mobile rule was
sharing the numbered variant's cramped `grid-template-columns:2.25rem 1fr` (fine for a
2-digit number, not for a multi-word label like "Google Business Profile and reviews"),
causing the label to wrap and visually overlap the adjacent description column — this is
what showed up in George's "what gets looked at" mobile screenshot. Split into its own
mobile rule: `.gp-table__row--labelled{grid-template-columns:1fr}` below 860px, stacking
the label above its description instead of forcing them side by side; `.gp-table__row`
(the numbered variant, used on Growth Sessions' "What people bring") is untouched and still
gets its narrow `2.25rem 1fr` column. Confirmed via computed-style checks at 375px (labels
now full-width, no overlap) and at 1400px (desktop `minmax(140px,13rem) 1fr` layout
unaffected). `styles.css?v=41` → `v=42` bumped across all 18 pages that link it.

**Sep 2026 (15th): Growth Strategy hero gained a real report image.** George supplied
`assets/growth-strategy-report-cover.png` (a mockup cover page of an example report).
`growth-strategy.html`'s `.gp-hero` was split into a two-column `.gp-hero__grid` (new,
`gp-`-scoped, same proportions as the site's existing split-hero pattern): headline,
price, body copy and CTAs on the left, the image on the right with a drop-shadow so it
lifts off the dark band. Stacks to one column below 860px. The lone paragraph inside
`.hero2-cols` was left with half its row empty at the new narrower column width, so
`.gp-hero__grid .hero2-cols{grid-template-columns:1fr}` scopes a fix to just this hero
rather than touching the shared `.hero2-cols` component used elsewhere. `styles.css?v=42`
→ `v=43`.

**Sep 2026 (15th): enquiry routing rebuilt, per the Clay Consulting Enquiry Routing
Handover.** Every CTA on the site used to link to `/contact`, which only offered a free
call and a generic form, so "Book a Growth Session" and "Enquire about a Growth Strategy"
both landed somewhere you could do neither. Fixed with one destination per intent, firing
in place on the page that did the selling:
- **Cal.com pop-ups, three namespaces.** `freecall` (`clay-consulting-ws6xph/30min`, the
  free call, used everywhere) and `session` (`clay-consulting-ws6xph/growth-session`,
  £120 via Stripe, `growth-sessions.html` only) coexist on Growth Sessions under separate
  namespaces, per Cal.com's requirement for multiple embeds on one page. The retired
  `15min` event and namespace are gone everywhere, including `/contact`'s own embed.
  Every page now carries the loader + `freecall` init before `</body>`; the header
  "Book a free call" button fires it in place, sitewide, keeping a plain `href="/contact"`
  fallback for no-JS. The loader boilerplate is reused verbatim from `/contact`'s
  already-live embed rather than re-pulled from the Cal.com dashboard, since this session
  has no dashboard access; the IIFE itself is stable across event types, only the
  `Cal("init", ...)` namespace and the `data-cal-link` event slug change.
- **Growth Sessions**: primary CTA (hero pair and closing section) now fires the paid
  `session` pop-up, matching this page's own "book a session directly" copy. Secondary
  CTA reworded to "Not sure? Book a free 30-minute call", `.btn--outline` as before so it
  reads as secondary. New payment/cancellation notice (reusing `.gp-callout`, no new CSS)
  sits directly below the hero CTAs: 48+ hours before, full refund or one free
  reschedule; inside 24 hours, no refund. Wording is the handover's own proposed text,
  confirmed with George rather than shipped as a guess.
- **Growth Strategy**: primary CTA reworded to "Start with a free 30-minute call" (both
  CTA pair and closing section), since the page's own process already puts the free call
  at step one. New secondary CTA, "Send details about your practice", anchors to a new
  `#enquire` section: a Netlify form (`strategy-enquiry`, distinct from the `contact` form
  so submissions separate in the Netlify dashboard) with first/last name, email, practice
  website, time in practice, what's prompting this, and an optional catch-all field,
  reusing the `.form.form--panel`/`.field` components verbatim. One real bug caught while
  building it: the practice-website field was typed `type="url"`, which isn't in
  `styles.css`'s shared input selector list, so it rendered unstyled and tiny; fixed by
  using `type="text" inputmode="url"` instead of extending the shared selector, since the
  handover asked not to touch `styles.css` globally.
- **Home**: hero and closing CTAs now fire `freecall`. Comparison table's free-call row
  fires `freecall` on both desktop and mobile; "Book a session" stays a plain link to
  `/growth-sessions` deliberately (£120 asked from a comparison table before someone's
  read what the hour is, is too cold); "Book a Blueprint"/"Book a Strategy" (the label
  from the previous rename task) is now "Explore a Growth Strategy". Also fixed a
  standing grammar bug in the meta description ("Growth Strategys") introduced by the
  mechanical Blueprint→Strategy replace two tasks ago.
- **Contact**: embed renamed to `freecall`/30min. Added a required "What's this about?"
  select (A Growth Session / A Growth Strategy / Something else) above the free-text
  question, existing form name kept so historical submissions stay together.
- **Every page, 15 minutes → 30 minutes**: copy, meta descriptions, OG descriptions,
  and the `growth-sessions.html` FAQ (visible and its `FAQPage` JSON-LD).
- **Email standardised on `george@clayconsulting.co.uk`** sitewide (confirmed with
  George; was split between `george@` inline on the growth pages and `hello@` in every
  footer plus Home's `ProfessionalService` JSON-LD).
- **GA4 event hooks added, but GA4 itself was not installed.** `nav.js` now fires
  `book_call_open`/`book_session_open` on any `[data-cal-namespace]` click, and `/thanks`
  fires `contact_form_submit` (with the enquiry-type value, round-tripped via
  `sessionStorage` since it doesn't survive the form redirect) or `strategy_enquiry_submit`
  based on a `?src=` param each form's `action` now carries. Every call is guarded on
  `typeof gtag === 'function'`, so none of this actually sends anything: `privacy.html`
  still correctly states the site uses no analytics, and installing GA4 for real needs a
  measurement ID from George plus, per that same page, a cookie consent banner under UK
  PECR. This wiring means no separate follow-up sweep is needed once that happens.
- **Not done, and worth flagging rather than silently skipping:** the handover's QA
  checklist asks to verify the live Cal.com pop-ups actually open, show the right
  price/duration, and behave inside 375px, and to confirm `/growth-blueprint` and
  `/services` 301 (they already did, correctly, from the previous rename task — the
  handover's claim that they served full content was stale). None of the pop-up
  interaction could be verified in this session's sandboxed browser, since it has no
  route to `app.cal.com` (the script never loads, so clicks fall through to the `href`
  fallback exactly as designed, but the actual modal was never seen). George needs to
  click through both pop-ups on a real deploy before calling this done. The handover's
  optional Cal.com booking-lifecycle-event tracking (open vs. actually booked) also
  wasn't built, and `/health-check` wasn't added to the redirect rules since nothing in
  this repo's history suggests that URL ever existed.

**Sep 2026 (15th), same-day fix: the Cal.com pop-ups above didn't actually open.** George
confirmed live: every "book a call" button just navigated to `/contact` instead of firing
a pop-up in place. Root cause was exactly the risk flagged above: the loader snippet was
reused from `/contact`'s pre-existing (and, per its own commit history, never actually
verified) 15-minute embed rather than pulled fresh from Cal.com's dashboard, and it had
`origin:"https://cal.com"` where the dashboard's real generated code uses
`origin:"https://app.cal.com"`. George pasted the current dashboard code for both events
directly, which also surfaced two more differences: a missing
`Cal.config.forwardQueryParams = true` line, and a `useSlotsViewOnSmallScreen` key
Cal.com recommends in every trigger's `data-cal-config`. Fixed sitewide:
- `origin` corrected to `https://app.cal.com` in every `Cal("init", ...)` call.
- Namespaces renamed to match the dashboard's own naming exactly, rather than the
  invented `freecall`/`session`: **`30min`** (free call, every page) and
  **`growth-session`** (paid, `growth-sessions.html` only). `nav.js`'s GA4 hook and every
  `data-cal-namespace`/`data-cal-config` attribute updated to match.
- Added `Cal.config = Cal.config || {}; Cal.config.forwardQueryParams = true;` once per
  page, and `"useSlotsViewOnSmallScreen":"true"` to every trigger's `data-cal-config`.
- Dropped the invented `styles.branding.brandColor` customisation from the `"ui"` calls,
  since it wasn't part of what the dashboard actually generates for either event and this
  fix is about matching the verified source exactly, not layering opinion on top of it.
  Worth revisiting as a deliberate, separate polish pass once booking itself is confirmed
  working.
Still not verified in this session: same sandboxed-browser limitation as before, no route
to `app.cal.com` here. George needs to click through both pop-ups again after this
deploys, on both event types and at 375px, before this is actually closed out. If it's
still broken after this, the next thing to check is the event slugs themselves
(`clay-consulting-ws6xph/30min`, `clay-consulting-ws6xph/growth-session`) against what's
live on Cal.com, since those came from the handover, not from pasted dashboard code.

**Sep 2026 (15th), second same-day fix: the origin fix above wasn't the whole story.**
Testing directly against the live site (this browser does have real internet access, so
the sandboxed-local caveat above stopped applying once tested against the deployed URL
rather than a local static server) showed the standalone "Book my free call" button on
`/contact` reliably opens the calendar, but the header "Book a free call" link, present
on every page, does not — even holding the page, config and namespace identical. That's
a timing race, not a config error: every page's Cal.com loader script sat at the very
bottom of `<body>`, after every image, font and other script, so on a fresh page load a
click on the header CTA (the very first thing a visitor sees) could beat the script's own
initialisation. **Moved the Cal.com loader to immediately after `<body>` opens, before
the skip link, nav, or anything else** on all 18 pages, so it starts downloading and
initialising before there's anything on screen to click. Nothing else about the loader
changed. This is a plausible fix, empirically consistent with what was observed, but
wasn't reproducible on demand even before the move (sometimes the header link worked,
sometimes it silently did nothing, sometimes it navigated after a delay) — so George
needs to click through it several times, not just once, before trusting it's solid.

### Known outstanding work

- [ ] `/assets/og-image.jpg` and `/assets/favicon.svg` are placeholders (blush background,
      ink monogram) so nothing 404s. Swap for real versions when George has them — the new
      logo sheet's circular "C" monogram (see above) could be the source for the favicon.
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

Forms use Netlify Forms (`data-netlify="true"`) with honeypot fields, except the "Book a call"
section of `/contact` (see below), which has no form at all. No backend.

**Sep 2026: Cal.com booking added to `/contact`.** The page now has two sections: `.contact--book`
(a single button, Cal.com "element click" pop-up embed, event `clay-consulting-ws6xph/15min`,
namespace `15min` — no Netlify form) and `.contact--enquiry` (the shortened Netlify form for people
not ready to book: name, email, phone, one open "Message" field). The practitioner-type,
practice-context and preferred-times fields from the previous contact-form rewrite are gone — that
context is now a Cal.com booking question instead. Both sections reuse `.contact`/`.contact__intro`/
`.contact__grid`; two new modifiers, `.contact--book` and `.contact--enquiry`, tighten and
differentiate the padding between them (added because the two sections otherwise doubled up on
`.contact`'s padding and blended into one oversized block with no visual separation — confirmed by
testing locally before deciding it needed a fix, not just a flag). The nav's "Book a free call"
button still links to plain `/contact`, not the Cal.com pop-up directly — that's a deliberate,
separate follow-up if wanted. **Not verified end-to-end**: the embed script initialises correctly
(`window.Cal.loaded`, namespace registered) but no popup calendar rendered in local sandboxed
testing — needs a real click-through test once deployed, per the handover's own post-deploy checklist.

**Sep 2026, follow-up polish:** both `.contact-title` headings (the "Book a call" h1 and "Other
enquiries" h2) and the whole-section centring came in as a fully-formed replacement file, but with
its CSS as an inline `<style>` block in the page `<head>` — a hard violation of this repo's "no
per-page style blocks, everything lives in `styles.css`" rule (see below). Moved into `styles.css`
instead of copied verbatim, and one rule was dropped rather than ported: the "Book a call" intro
paragraph had `white-space:nowrap`, which would have forced an 85-character sentence onto one line
and reliably overflowed on mobile — confirmed by rough character-width math before it was ever
written to disk, not discovered after. The two `.contact-title` headings keep `white-space:nowrap`
(tested down to a 320px viewport with no overflow), since they're much shorter.

**Cache-busting `styles.css`:** `netlify.toml` caches `/styles.css` for a year
(`max-age=31536000`). Every page links to it as `/styles.css?v=N`. **Whenever you edit
`styles.css`, bump `?v=N` to `?v=N+1` on every page that links it** — otherwise returning
visitors keep serving their old cached copy indefinitely. Current version: `v=42`.

**Sep 2026: GEO visibility recovery.** The Sep 8 title/description fix over-corrected: "grow" and
"marketing" as ordinary descriptive words got removed along with Build/Launch/Grow as product
names, even though a product name and a verb aren't the same thing. Restored on Home only:
title/description now lead with "Marketing & Business Strategy", "Who we are"'s opening line and
the "Visibility" pillar both use "grow"/"marketing" again as plain verbs/nouns, never as capitalised
product names. Home's `ProfessionalService` JSON-LD description now matches the "Who we are" opening
sentence verbatim, and a `Service` block (Strategy session £120, Health Check scoped) was added to
the homepage's own JSON-LD — previously only `/services` carried one. Added `/llms.txt` at root: a
plain-text summary of the business, the three offers, and links to the five live pages, opening with
the same sentence as the JSON-LD description and the "Who we are" block, for consistency across every
surface a model or crawler might read. `sitemap.xml`'s `lastmod` dates were stale (all Aug
2026, despite every page having actually changed in September) — corrected to each page's real last-
commit date. Redirects, robots.txt and canonicals were all independently audited and already correct;
nothing needed fixing there. Submitting the sitemap and requesting indexing in Google Search Console
is still a manual step for George — this repo work can't do that part.

**Sep 2026: pathway connector diagram added to Home's `#pathway` section.** A "Free 15-minute
call" card (`.pathway__top`) sits above the two peer cards, joined by a small decorative SVG fork
(`.pathway__connector`, hidden below 680px — a dedicated breakpoint, not the sitewide 860px one,
tuned to when `.price-cards` itself wraps to one column). The credited-fee note and the "See how it
works →" link are now grouped in `.note-wrap` below all three cards, replacing the link that used to
sit up in the section header. Source file (again) shipped its CSS as an inline `<style>` block and
(again) had a `white-space:nowrap` on the ~107-character note sentence with no mobile fallback —
moved the CSS into `styles.css` and added the same kind of mobile override used for `/contact`'s
enquiry paragraph (`#pathway .note{white-space:normal}` below 860px), confirmed by testing rather
than assumed safe.

---

## How to work with George

- He is commercially sharp and not a developer. Explain trade-offs in plain terms and give
  a recommendation, not a menu of options.
- He prefers being told when something is a bad idea. Push back rather than complying.
- Prefer showing the change over describing it at length.
- Ask clarifying questions before large changes rather than guessing and building the
  wrong thing.
