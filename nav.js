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

// PostHog capture, only once the visitor has accepted the banner and PostHog has started.
// Before that the head snippet's stub would queue calls and replay them after a later
// Accept, which would send events from before consent was given.
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
// re-applies a stored acceptance before config; the PostHog snippet only initialises on a
// stored acceptance. So nothing is stored until someone opts in here. This only builds the
// banner when no choice has been recorded yet.
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
    if (choice === 'granted' && typeof clayPosthogInit === 'function') clayPosthogInit();
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
        '<p class="consent__text">Clay uses Google Analytics and PostHog to see which pages ' +
        'people actually find useful. They set cookies, so they only run if you accept. ' +
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
