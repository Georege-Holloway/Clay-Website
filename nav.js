var nav = document.querySelector('.nav');
var toggle = document.querySelector('.nav__toggle');
if (nav && toggle) {
  toggle.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });
}

// Services dropdown: click/Enter/Space to toggle (native <button> behaviour),
// Escape to close, arrow keys to move between dropdown items.
var dropToggle = document.querySelector('.nav__dropdown-toggle');
if (dropToggle) {
  var dropdown = dropToggle.nextElementSibling;
  var dropLinks = dropdown ? Array.prototype.slice.call(dropdown.querySelectorAll('a')) : [];

  function closeDropdown(focusToggle) {
    dropToggle.setAttribute('aria-expanded', 'false');
    if (focusToggle) dropToggle.focus();
  }

  function openDropdown() {
    dropToggle.setAttribute('aria-expanded', 'true');
  }

  dropToggle.addEventListener('click', function () {
    var isOpen = dropToggle.getAttribute('aria-expanded') === 'true';
    if (isOpen) {
      closeDropdown(false);
    } else {
      openDropdown();
    }
  });

  dropToggle.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown' || e.key === 'Down') {
      e.preventDefault();
      openDropdown();
      if (dropLinks[0]) dropLinks[0].focus();
    } else if (e.key === 'Escape' || e.key === 'Esc') {
      closeDropdown(true);
    }
  });

  dropLinks.forEach(function (link, i) {
    link.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown' || e.key === 'Down') {
        e.preventDefault();
        var next = dropLinks[i + 1] || dropLinks[0];
        next.focus();
      } else if (e.key === 'ArrowUp' || e.key === 'Up') {
        e.preventDefault();
        var prev = dropLinks[i - 1] || dropLinks[dropLinks.length - 1];
        prev.focus();
      } else if (e.key === 'Escape' || e.key === 'Esc') {
        closeDropdown(true);
      }
    });
  });

  // Close on outside click (desktop) and on focus leaving the whole item.
  document.addEventListener('click', function (e) {
    var item = dropToggle.closest('.nav__item');
    if (item && !item.contains(e.target)) {
      closeDropdown(false);
    }
  });

  var navItem = dropToggle.closest('.nav__item');
  if (navItem) {
    navItem.addEventListener('focusout', function (e) {
      if (!navItem.contains(e.relatedTarget)) {
        closeDropdown(false);
      }
    });
  }
}
