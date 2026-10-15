(function () {
  'use strict';
  function start() {
    // The theme can assign body.home after this deferred script runs.
    // The parsed homepage structure is available without that timing dependency.
    if (!document.querySelector('.hp-table')) return;
    var signupNote = document.querySelector('.hp_subscribe fieldset > small');
    if (signupNote) signupNote.textContent = 'Stay in the know about what’s happening in our community.';
    var mission = Array.from(document.querySelectorAll('.hp-table .message')).find(function (el) {
      var heading = el.querySelector('h5');
      return heading && heading.textContent.trim().toLowerCase() === 'our mission';
    });
    if (mission) {
      var copy = mission.querySelector('.message_format > .bottom_padding');
      if (copy) {
        copy.textContent = 'A welcoming Jewish home for Coquitlam, Port Coquitlam, and Port Moody. Wherever you are on your Jewish journey, join us to celebrate, learn, connect, and discover the joy of Jewish life.';
        mission.classList.add('tc-home-mission');
      }
    }
    var hero = document.querySelector('.hp-row-first .promo_slider');
    if (!hero) return;
    var shortCopy = {
      'WELCOME TO CHABAD OF THE TRI-CITIES!': 'Judaism with joy! Your Jewish home for discovery, learning, and connection in the Tri-Cities.',
      'KABBALAH AND THE HIDDEN ARCHITECTURE OF YOU': 'Explore Kabbalah’s map of the soul in a practical course on clarity, purpose, and self-understanding.',
      'SHABBAT MORNING SERVICE': 'Join us for prayer, community, and a warm Shabbat morning. Everyone is welcome.',
      'HEBREW SCHOOL': 'Joyful Jewish learning, Hebrew, and holidays in a warm, welcoming community. Discover a Hebrew School your children will love.'
    };
    function wrap(span) {
      if (!span || span.querySelector('.tc-hero-full-copy')) return;
      var title = span.querySelector('big');
      if (!title) return;
      var text = shortCopy[title.textContent.trim().toUpperCase()];
      if (!text) return;
      var full = document.createElement('span');
      full.className = 'tc-hero-full-copy';
      while (title.nextSibling) full.appendChild(title.nextSibling);
      var brief = document.createElement('span');
      brief.className = 'tc-hero-short-copy';
      brief.textContent = text;
      span.appendChild(full);
      span.appendChild(brief);
    }
    hero.querySelectorAll('.captionList > li > span').forEach(wrap);
    function updateCaption() {
      hero.querySelectorAll('.captionList > li > span').forEach(wrap);
      var caption = hero.querySelector('.cycle-caption');
      if (caption) wrap(caption.querySelector('p > span'));
    }
    function enhanceControls() {
      document.querySelectorAll('.hp-table .cycle-directionNav a').forEach(function (link) {
      if (link.dataset.tcKeyboard) return;
      link.dataset.tcKeyboard = 'true';
      link.setAttribute('role', 'button');
      link.setAttribute('tabindex', '0');
      link.setAttribute('aria-label', link.classList.contains('cycle-prevNav') ? 'Previous slide' : 'Next slide');
      link.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          link.click();
        }
      });
      });
    }
    updateCaption();
    enhanceControls();
    new MutationObserver(function () {
      updateCaption();
      enhanceControls();
    }).observe(hero, { childList: true, subtree: true });
    window.addEventListener('load', enhanceControls, { once: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
