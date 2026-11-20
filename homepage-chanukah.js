(function () {
  'use strict';
  function start() {
    if (!document.querySelector('.hp-table') || document.getElementById('tc-home-chanukah')) return;
    if (window.__tcHomeChanukahWaiting) return;
    window.__tcHomeChanukahWaiting = true;
    function insert() {
      var events = document.getElementById('injected-upcoming-events-section');
      if (!events || !events.querySelector('.injected-event-card')) return false;
      if (document.getElementById('tc-home-chanukah')) return true;
      var style = document.createElement('style');
      style.id = 'tc-home-chanukah-styles';
      style.textContent = [
        'html body #tc-home-chanukah{box-sizing:border-box;width:calc(100% - 48px);max-width:1200px;margin:0 auto 42px;padding:24px 30px;display:flex;align-items:center;gap:24px;background:#143f49;color:#fff;border-radius:11px;text-align:left;font-family:Montserrat,Arial,sans-serif;}',
        'html body #tc-home-chanukah *{box-sizing:border-box;}',
        'html body #tc-home-chanukah .tc-hc-copy{flex:1;min-width:0;}',
        'html body #tc-home-chanukah h2{font-family:Montserrat,Arial,sans-serif;font-size:26px;line-height:1.2;font-weight:700;letter-spacing:-.5px;color:#fff;margin:0 0 8px;padding:0;text-transform:none;}',
        'html body #tc-home-chanukah h2:after{display:none;}',
        'html body #tc-home-chanukah p{font-family:Inter,Arial,sans-serif;font-size:15px;line-height:1.5;font-weight:400;color:#d2e3e5;margin:0;padding:0;}',
        'html body #tc-home-chanukah .tc-hc-link{flex-shrink:0;display:inline-flex;align-items:center;justify-content:center;gap:16px;min-height:46px;padding:13px 20px;border:0;border-radius:6px;background:#f0d58f;color:#183e46;font-family:Montserrat,Arial,sans-serif;font-size:14px;line-height:1.4;font-weight:700;text-decoration:none;text-transform:none;white-space:nowrap;}',
        'html body #tc-home-chanukah .tc-hc-link:hover{background:#ffe5a1;color:#183e46;text-decoration:none;}',
        'html body #tc-home-chanukah .tc-hc-link:focus-visible{outline:3px solid #8ed6de;outline-offset:4px;}',
        'html body #tc-home-chanukah .tc-hc-art{width:77px;flex-shrink:0;height:72px;position:relative;display:flex;justify-content:space-between;padding-top:15px;}',
        'html body #tc-home-chanukah .tc-hc-art i{position:relative;width:3px;height:30px;background:#eacd87;border-radius:1px;}',
        'html body #tc-home-chanukah .tc-hc-art i:before{content:"";position:absolute;top:-9px;left:-1px;width:5px;height:7px;background:#ffe8a8;border-radius:70% 30% 55% 45%;box-shadow:0 0 8px #f8d57c88;}',
        'html body #tc-home-chanukah .tc-hc-art i:nth-child(5){top:-12px;height:64px;}',
        'html body #tc-home-chanukah .tc-hc-art:before{content:"";position:absolute;left:0;top:32px;width:77px;height:26px;border:3px solid #eacd87;border-top:0;border-radius:0 0 26px 26px;}',
        'html body #tc-home-chanukah .tc-hc-art:after{content:"";position:absolute;bottom:2px;left:25px;width:27px;height:3px;background:#eacd87;}',
        '@media(max-width:820px){html body #tc-home-chanukah{flex-wrap:wrap;gap:18px;padding:24px;width:calc(100% - 32px);}html body #tc-home-chanukah .tc-hc-copy{flex-basis:calc(100% - 100px);}html body #tc-home-chanukah .tc-hc-link{width:100%;}html body #tc-home-chanukah h2{font-size:23px;}}',
        '@media(max-width:380px){html body #tc-home-chanukah .tc-hc-art{display:none;}html body #tc-home-chanukah .tc-hc-copy{flex-basis:100%;}html body #tc-home-chanukah{padding:22px;}}'
      ].join('\n');
      document.head.appendChild(style);
      var card = document.createElement('div');
      card.id = 'tc-home-chanukah';
      card.setAttribute('role', 'region');
      card.setAttribute('aria-labelledby', 'tc-hc-heading');
      card.innerHTML = '<div class="tc-hc-art" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>' +
        '<div class="tc-hc-copy"><h2 id="tc-hc-heading">Chanukah in the Tri-Cities</h2><p>A celebration for every age and stage here in the Tri-Cities.</p></div>' +
        '<a class="tc-hc-link" href="/7629340">Explore Chanukah <span aria-hidden="true">&rarr;</span></a>';
      events.insertAdjacentElement('afterend', card);
      return true;
    }
    if (insert()) return;
    var observer = new MutationObserver(function () {
      if (insert()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
