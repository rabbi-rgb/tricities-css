(function () {
  'use strict';
  var source = document.currentScript || document.getElementById('tc-homepage-repairs');
  function init() {
    if (!document.querySelector('.hp-table') || window.__tcHomepageRepairs) return;
    window.__tcHomepageRepairs = true;
    if (source && source.src && !document.getElementById('tc-homepage-repair-styles')) {
      var link = document.createElement('link');
      link.id = 'tc-homepage-repair-styles';
      link.rel = 'stylesheet';
      link.href = new URL('homepage-repairs.css', source.src).href;
      document.head.appendChild(link);
    }
    var viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) viewport.content = 'width=device-width, initial-scale=1.0';
    function enhance() {
      document.querySelectorAll('#injected-upcoming-events-section .events-carousel-arrow').forEach(function (button) {
        button.setAttribute('aria-label', button.classList.contains('prev') ? 'Previous events' : 'Next events');
      });
      var signup = document.querySelector('.hp-table .hp_subscribe');
      if (!signup) return;
      [['fname', 'First Name'], ['lname', 'Last Name'], ['email', 'Email Address']].forEach(function (field) {
        var input = signup.querySelector('input[name="' + field[0] + '"]');
        if (!input) return;
        input.setAttribute('aria-label', field[1]);
        // Duplicate native IDs also exist in the header popup. Keep the native
        // controls/IDs intact, but stop local labels targeting the other form.
        signup.querySelectorAll('label').forEach(function (label) {
          if (label.htmlFor !== input.id) return;
          label.removeAttribute('for');
          label.addEventListener('click', function () { if (!input.disabled) input.focus(); });
        });
      });
    }
    enhance();
    // Events arrive asynchronously. Observe additions, not attribute changes,
    // so our own accessible names do not trigger another update.
    new MutationObserver(function (records) {
      if (records.some(function (record) {
        return Array.from(record.addedNodes).some(function (node) {
          return node.nodeType === 1 && (node.matches('.events-carousel-arrow, .hp_subscribe') || node.querySelector('.events-carousel-arrow, .hp_subscribe'));
        });
      })) enhance();
    }).observe(document.body, {childList: true, subtree: true});
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
