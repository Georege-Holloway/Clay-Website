var nav = document.querySelector('.nav');
var toggle = document.querySelector('.nav__toggle');
if (nav && toggle) {
  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });
}

// Cal.com pop-up triggers, sitewide.
//
// We open the pop-up ourselves rather than relying on the embed script's own automatic
// binding of [data-cal-link] elements. That binding does not reliably attach to these
// triggers: verified against the live site, with the markup, namespace, event slug and
// origin all correct and both namespaces registered, clicks still fell through to the
// href instead of opening anything. Calling the modal API directly is deterministic, and
// it is the same call the embed would have made.
//
// Capture phase plus stopImmediatePropagation, so that if the embed's own binding does
// attach on some element, it cannot fire a second time and open two modals.
//
// The href="/contact" on each trigger stays as the no-JS fallback: if the embed script is
// unavailable, this bails out before preventDefault and the link navigates normally.
document.addEventListener('click', function (e) {
  var target = e.target;
  if (!target || typeof target.closest !== 'function') return;
  var trigger = target.closest('[data-cal-link]');
  if (!trigger) return;

  var namespace = trigger.getAttribute('data-cal-namespace');
  var calLink = trigger.getAttribute('data-cal-link');
  var api = window.Cal && window.Cal.ns ? window.Cal.ns[namespace] : null;
  if (!api || !calLink) return;

  var config = {};
  try { config = JSON.parse(trigger.getAttribute('data-cal-config') || '{}'); } catch (err) {}

  e.preventDefault();
  e.stopImmediatePropagation();
  api('modal', { calLink: calLink, config: config });

  // GA4 events. Guarded on gtag existing: no GA4 script is installed yet (see
  // privacy.html, which states the site uses no analytics), so this is a no-op until
  // that's added, at which point a cookie banner is also needed per that same page.
  if (typeof gtag !== 'function') return;
  if (namespace === '30min') {
    gtag('event', 'book_call_open', { page: location.pathname });
  } else if (namespace === 'growth-session') {
    gtag('event', 'book_session_open', { page: location.pathname });
  }
}, true);
