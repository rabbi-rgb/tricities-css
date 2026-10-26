(function () {
  if (!/\/tools\/events\/register_cdo\/eventid\/23975(?:\/|$)/.test(location.pathname)) return;

  var desired = 'Choose whatever works for you. Everyone is welcome.';
  var state = window.__tcFallWelcomeNoteCleanupV1;

  function updateNote() {
    var note = document.querySelector('#tcShabbatNightIntroV5 .tc-help-note');
    if (note && note.textContent !== desired) note.textContent = desired;
  }

  if (state) {
    state.update();
    return;
  }

  state = window.__tcFallWelcomeNoteCleanupV1 = {
    started: false,
    observer: null,
    update: updateNote
  };

  function start() {
    if (state.started) return;
    state.started = true;
    updateNote();
    state.observer = new MutationObserver(updateNote);
    state.observer.observe(document.body || document.documentElement, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
