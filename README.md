# Clay Consulting — website

Static HTML/CSS site for clayconsulting.co.uk. No build step, no framework, no dependencies.
Deployed on Netlify. Domain registered at 123 Reg.

---

## Structure

```
index.html      Home
approach.html   Approach
launch.html     Launch (service + onboarding form)
grow.html       Grow (service + FAQ)
contact.html    Contact (enquiry form)
privacy.html    Privacy policy  — DRAFT, needs review
404.html        Not found
resources.html  Resources / blog index — TO BUILD
styles.css      All styling for the whole site
nav.js          Mobile menu toggle
netlify.toml    Redirects, headers, caching
robots.txt      Crawler rules
/assets/        Images (headshot, og-image, favicon)
```

## Editing

**All styling lives in `styles.css`.** Nothing is styled inline. Change it once, it changes everywhere.

Key variables at the top of `styles.css`:

| Variable | What it controls |
|---|---|
| `--display` | Heading typeface. Currently Fraunces. |
| `--display-vf` | Fraunces axes, tuned to approximate P22 Mackinac. `SOFT` = terminal roundness, `opsz` = thick/thin contrast. |
| `--blush` / `--stone` / `--paper` | Background band colours |
| `--ink` / `--ink-soft` | Text colours |
| `--shell` | Max content width |
| `--y` | Vertical section rhythm |

**Cards have one definition.** `.card` is defined once and inverts automatically — grey on white sections, white on tinted ones. Don't add page-specific card styles; if a card needs to look different, that's a signal the design system needs a decision, not an override.

## Local preview

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000

## Deploying

Push to `main`. Netlify builds and publishes automatically, usually within a minute.
Every pull request gets its own preview URL.

Rollback: Netlify dashboard → Deploys → pick any previous deploy → Publish deploy.

## Forms

Both forms use Netlify Forms (`data-netlify="true"`). No backend required.
Submissions appear in the Netlify dashboard under Forms, and can be set to email you.
Each form has a honeypot field (`bot-field`) for spam.

**After first deploy:** check both forms actually submit, and set up the email notification.

## Before going live

- [ ] Add `/assets/` — headshot, og-image (1200×630), favicon
- [ ] Replace the draft privacy policy with reviewed copy
- [ ] Build `resources.html` and migrate blog posts
- [ ] Export all live URLs from Search Console; add 301s to `netlify.toml`
- [ ] Create `sitemap.xml`
- [ ] Add first client testimonial (placeholder block is in `index.html`)
- [ ] Test both forms end to end
- [ ] Test on a real phone, not just a narrow browser window

## DNS switch (last step)

Domain and email both sit at 123 Reg. Titan email uses the MX records.

**Change only the A / CNAME records for the website. Do not touch MX records.**
Screenshot the current DNS settings before changing anything.

Then: resubmit sitemap in Search Console, watch for a few days, and only then cancel Squarespace.

## Principles

- No subscriptions. Free and self-hosted first, always.
- No frameworks or build tooling unless there's a concrete reason.
- One card style. One stylesheet. One set of variables.
