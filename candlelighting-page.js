/* Candle-lighting presentation only. Native calendar controls stay in place. */
(function () {
  if (!/^\/calendar\/candlelighting(?:_cdo\/|\.htm(?:\/|$))/i.test(location.pathname)) return;
  function init() {
    if (!document.getElementById('candle_lighting')) return;
    var script = document.currentScript || document.getElementById('tc-candlelighting-page');
    if (!script || !script.src) return;
    if (!document.getElementById('tc-candlelighting-styles')) {
      var link = document.createElement('link');
      link.id = 'tc-candlelighting-styles';
      link.rel = 'stylesheet';
      link.href = new URL('candlelighting-fixes.css', script.src).href;
      document.head.appendChild(link);
    }
    var viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) viewport.content = 'width=device-width, initial-scale=1.0';
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
