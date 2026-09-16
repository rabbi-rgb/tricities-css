(function () {
  'use strict';

  // Safe to load site-wide: only runs on the Kabbalah course page.
  if (!window.location.pathname.includes('/aid/7510976/')) return;

  var replacementText = 'Address and Zoom link provided upon registering.';
  var selector = '.jlik-cd-echo-address';

  function replaceAddress() {
    document.querySelectorAll(selector).forEach(function (el) {
      if (el.textContent.trim() !== replacementText) {
        el.textContent = replacementText;
      }
    });
  }

  function start() {
    replaceAddress();

    // JLI content may render after the initial page load, so watch briefly
    // and replace the address if the component is inserted later.
    var observer = new MutationObserver(replaceAddress);
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });

    window.setTimeout(function () {
      observer.disconnect();
    }, 10000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
