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

// PostHog capture, only once the visitor has made a choice on the banner and PostHog has
// started (with cookies if they accepted, cookieless if they declined). Before that the head
// snippet's stub would queue calls and replay them after the choice, which would send events
// from before the visitor had chosen.
function phCapture(name, props) {
  if (!window.clayPosthogStarted || typeof posthog === 'undefined') return;
  posthog.capture(name, props);
}

// PostHog booking events, from the Cal.com embed's own lifecycle events.
//
// Event names are from Cal.com's embed events reference (cal.com/help/embedding/embed-events):
// bookingSuccessfulV2 fires on a fresh booking (it replaces the deprecated bookingSuccessful),
// bookerViewed fires the first time a modal's booker is shown, and bookerReopened on each
// reopen after the modal was closed. Namespaces are registered by each page's loader at the
// top of <body>; a page without one of them (only Growth Sessions has growth-session) skips it.
// The namespace names match the event slugs, so they double as event_type.
(function () {
  if (!window.Cal || !window.Cal.ns) return;
  ['30min', 'growth-session'].forEach(function (namespace) {
    var api = window.Cal.ns[namespace];
    if (!api) return;
    function send(name) {
      return function () {
        phCapture(name, { event_type: namespace, page: location.pathname });
      };
    }
    api('on', { action: 'bookerViewed', callback: send('booking_popup_opened') });
    api('on', { action: 'bookerReopened', callback: send('booking_popup_opened') });
    api('on', { action: 'bookingSuccessfulV2', callback: send('booking_completed') });
  });
})();

// PostHog enquiry event for Netlify Forms.
//
// Netlify only redirects to /thanks after it has accepted a submission, so arriving there is
// the success signal. The page the form was on is stashed at submit time and read back on
// /thanks, so `page` is the form's page rather than /thanks. Nothing from the form's fields is
// read or sent. A direct visit or refresh of /thanks finds nothing stashed and sends nothing.
(function () {
  var KEY = 'clay_form_page';
  document.addEventListener('submit', function (e) {
    if (!e.target.matches('form[data-netlify="true"]')) return;
    try { sessionStorage.setItem(KEY, location.pathname); } catch (err) {}
  });
  if (location.pathname.replace(/\.html$/, '') !== '/thanks') return;
  var page = null;
  try { page = sessionStorage.getItem(KEY); sessionStorage.removeItem(KEY); } catch (err) {}
  if (page) phCapture('enquiry_submitted', { page: page });
})();

// Cookie consent banner, sitewide.
//
// GA4 and PostHog set non-essential cookies, which under UK PECR need consent before they
// are set. The gtag snippet in each page's head defaults analytics_storage to 'denied' and
// re-applies a stored acceptance before config. The PostHog snippet loads nothing until a
// choice is stored: with cookies on Accept, and in cookieless mode (nothing stored on the
// device) on Decline, so declined visits are still counted anonymously (Oct 2026). Nothing
// is stored by either tool until someone accepts here. The banner builds
// itself when no choice has been recorded yet, and the footer's "Cookie settings" link
// ([data-cookie-settings]) reopens it at any time, showing the current choice, since
// withdrawing consent has to be as easy as giving it.
//
// A change applies on the spot, no reload: GA4 gets a consent update either way, and
// PostHog is opted out (session recording stopped too) or started and opted in. Opt-in is
// always called after starting, because opt_out_capturing() persists its own flag in
// PostHog's storage and would otherwise keep a re-accepting visitor opted out.
//
// Injected rather than hardcoded into every page so there is one copy to maintain. No
// banner without JS is fine: GA4 needs JS too, so a no-JS visitor is never measured. The
// footer link falls back to the Cookies section of the privacy policy.
(function () {
  var KEY = 'clay-consent';

  function current() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }

  function apply(choice) {
    if (typeof gtag === 'function') {
      gtag('consent', 'update', {analytics_storage: choice === 'granted' ? 'granted' : 'denied'});
    }
    if (choice === 'granted') {
      if (typeof clayPosthogInit === 'function') clayPosthogInit();
      if (window.clayPosthogStarted) {
        posthog.set_config({disable_persistence: false});
        posthog.opt_in_capturing();
      }
    } else {
      // Already running with cookies (they had accepted, and now decline via Cookie settings):
      // stop it outright for the rest of this page. Opt out before stopping the recording, or
      // stopping it flushes a last $snapshot. disable_persistence removes PostHog's cookie and
      // storage and stops the still-running instance writing them back, which it otherwise does
      // within seconds. From the next page it starts in cookieless mode (head snippet).
      if (window.clayPosthogStarted) {
        posthog.opt_out_capturing();
        posthog.set_config({disable_persistence: true});
        posthog.stopSessionRecording();
      } else if (typeof clayPosthogInit === 'function') {
        // Not running yet (first visit): start it cookieless, so this visit is counted
        // anonymously without anything being stored on the device.
        clayPosthogInit('denied');
      }
      clearAnalyticsStorage();
    }
  }

  // On reject, remove what was already set: PostHog's ph_* cookies and GA4's _ga/_ga_*
  // cookies, plus PostHog's ph_* localStorage keys, which hold the same visitor ID. Both
  // tools set cookies on a parent domain (.clayconsulting.co.uk), so each name is expired
  // on every domain it could live on. PostHog's own opt-out flag (__ph_opt_in_out_*) does
  // not match and is kept, so it stays opted out.
  function clearAnalyticsStorage() {
    var parts = location.hostname.split('.');
    var domains = [''];
    for (var i = 0; i < parts.length - 1; i++) {
      var d = parts.slice(i).join('.');
      domains.push('; domain=' + d, '; domain=.' + d);
    }
    document.cookie.split(';').forEach(function (c) {
      var name = c.split('=')[0].trim();
      if (!/^(ph_|_ga$|_ga_)/.test(name)) return;
      domains.forEach(function (domain) {
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + domain;
      });
    });
    try {
      Object.keys(localStorage).forEach(function (k) {
        if (k.indexOf('ph_') === 0) localStorage.removeItem(k);
      });
    } catch (e) {}
  }

  function close() {
    var el = document.querySelector('.consent');
    if (el) el.parentNode.removeChild(el);
  }

  function record(choice) {
    var previous = current();
    try { localStorage.setItem(KEY, choice); } catch (e) {}
    if (choice !== previous) apply(choice);
    close();
  }

  function build(focus) {
    close();
    var choice = current();
    var status = choice === 'granted' ? ' Your current choice: accepted.'
      : choice === 'denied' ? ' Your current choice: declined.' : '';
    var wrap = document.createElement('div');
    // ph-no-capture keeps PostHog autocapture off the banner: otherwise the Decline click
    // itself is recorded a moment before the opt-out runs, and sent after it.
    wrap.className = 'consent ph-no-capture';
    wrap.setAttribute('role', 'region');
    wrap.setAttribute('aria-label', 'Cookie choice');
    wrap.innerHTML =
      '<div class="consent__inner">' +
        '<p class="consent__text">Clay uses Google Analytics and PostHog to see which pages ' +
        'people actually find useful. They only set cookies if you accept. If you decline, ' +
        'PostHog just counts the visit anonymously, with nothing stored on your device. ' +
        '<a href="/privacy">Read the privacy policy</a>.' + status + '</p>' +
        '<div class="consent__actions">' +
          '<button type="button" class="btn btn--outline" data-consent="denied" aria-pressed="' +
            (choice === 'denied') + '">Decline</button>' +
          '<button type="button" class="btn btn--accent" data-consent="granted" aria-pressed="' +
            (choice === 'granted') + '">Accept</button>' +
        '</div>' +
      '</div>';
    wrap.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-consent]');
      if (btn) record(btn.getAttribute('data-consent'));
    });
    document.body.appendChild(wrap);
    if (focus) wrap.querySelector('button').focus();
  }

  document.addEventListener('click', function (e) {
    var link = e.target.closest && e.target.closest('[data-cookie-settings]');
    if (!link) return;
    e.preventDefault();
    build(true);
  });

  var stored = current();
  if (stored === 'granted' || stored === 'denied') return;
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () { build(false); });
  } else {
    build(false);
  }
})();

// Home testimonials carousel.
//
// The slides are plain markup in index.html, so they read fine without JS. This shows one
// at a time and builds a dot per slide, so adding a testimonial is just adding a figure.
// Arrows wrap at both ends; with a single slide they fade it out and straight back in.
// No autoplay, on purpose: the quotes are long and people need time to read them.
(function () {
  var root = document.querySelector('.testimonials');
  if (!root) return;
  var slides = root.querySelectorAll('.testimonial');
  var controls = root.querySelector('.testimonials__controls');
  var dotsWrap = root.querySelector('.testimonials__dots');
  if (!slides.length || !controls || !dotsWrap) return;

  var index = 0;
  var timer;
  var dots = [];

  Array.prototype.forEach.call(slides, function (slide, i) {
    slide.setAttribute('aria-label', (i + 1) + ' of ' + slides.length);
    var dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'testimonials__dot';
    dot.setAttribute('aria-label', 'Show testimonial ' + (i + 1));
    dot.addEventListener('click', function () { go(i); });
    dotsWrap.appendChild(dot);
    dots.push(dot);
  });

  function render() {
    Array.prototype.forEach.call(slides, function (slide, i) {
      slide.classList.toggle('is-active', i === index);
    });
    dots.forEach(function (dot, i) {
      dot.setAttribute('aria-current', String(i === index));
    });
  }

  function go(n) {
    var current = slides[index];
    clearTimeout(timer);
    current.classList.add('is-fading');
    timer = setTimeout(function () {
      current.classList.remove('is-fading');
      index = (n + slides.length) % slides.length;
      render();
    }, 200);
  }

  controls.addEventListener('click', function (e) {
    var arrow = e.target.closest('[data-dir]');
    if (arrow) go(index + Number(arrow.getAttribute('data-dir')));
  });

  root.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') go(index - 1);
    else if (e.key === 'ArrowRight') go(index + 1);
  });

  render();
  root.classList.add('is-ready');
  controls.hidden = false;
})();
