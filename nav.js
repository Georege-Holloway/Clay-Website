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

  // GA4 events. GA4 (G-58WJDJ7ZCJ) went in on 17 Sep 2026, so these now fire for real.
  // Still guarded, since gtag is absent if the tag fails to load or is blocked.
  if (typeof gtag !== 'function') return;
  if (namespace === '30min') {
    gtag('event', 'book_call_open', { page: location.pathname });
  } else if (namespace === 'growth-session') {
    gtag('event', 'book_session_open', { page: location.pathname });
  }
}, true);

// Cookie consent banner, sitewide.
//
// GA4 sets non-essential cookies, which under UK PECR need consent before they are set.
// The gtag snippet in each page's head defaults analytics_storage to 'denied' and
// re-applies a stored acceptance before config, so nothing is stored until someone opts
// in here. This only builds the banner when no choice has been recorded yet.
//
// Injected rather than hardcoded into all 18 pages so there is one copy to maintain. No
// banner without JS is fine: GA4 needs JS too, so a no-JS visitor is never measured.
(function () {
  var KEY = 'clay-consent';
  var stored = null;
  try { stored = localStorage.getItem(KEY); } catch (e) { return; }
  if (stored === 'granted' || stored === 'denied') return;

  function record(choice) {
    try { localStorage.setItem(KEY, choice); } catch (e) {}
    if (choice === 'granted' && typeof gtag === 'function') {
      gtag('consent', 'update', {analytics_storage: 'granted'});
    }
    var el = document.querySelector('.consent');
    if (el) el.parentNode.removeChild(el);
  }

  function build() {
    var wrap = document.createElement('div');
    wrap.className = 'consent';
    wrap.setAttribute('role', 'region');
    wrap.setAttribute('aria-label', 'Cookie choice');
    wrap.innerHTML =
      '<div class="consent__inner">' +
        '<p class="consent__text">Clay uses Google Analytics to see which pages people ' +
        'actually find useful. It sets cookies, so it only runs if you accept. ' +
        '<a href="/privacy">Read the privacy policy</a>.</p>' +
        '<div class="consent__actions">' +
          '<button type="button" class="btn btn--outline" data-consent="denied">Decline</button>' +
          '<button type="button" class="btn btn--accent" data-consent="granted">Accept</button>' +
        '</div>' +
      '</div>';
    wrap.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-consent]');
      if (btn) record(btn.getAttribute('data-consent'));
    });
    document.body.appendChild(wrap);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
