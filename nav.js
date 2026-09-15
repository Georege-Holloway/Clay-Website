var nav = document.querySelector('.nav');
var toggle = document.querySelector('.nav__toggle');
if (nav && toggle) {
  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });
}

// GA4 event hooks for the Cal.com pop-up triggers, sitewide. Guarded on gtag existing:
// no GA4 script is installed yet (see privacy.html, which currently states the site uses
// no analytics), so this is a no-op until that's added, at which point a cookie banner
// is also needed per that same page. Wiring it now means the events are ready the moment
// GA4 is actually installed, rather than a separate follow-up sweep of every page.
document.addEventListener('click', function (e) {
  var trigger = e.target.closest('[data-cal-namespace]');
  if (!trigger || typeof gtag !== 'function') return;
  var namespace = trigger.getAttribute('data-cal-namespace');
  if (namespace === '30min') {
    gtag('event', 'book_call_open', { page: location.pathname });
  } else if (namespace === 'growth-session') {
    gtag('event', 'book_session_open', { page: location.pathname });
  }
});
