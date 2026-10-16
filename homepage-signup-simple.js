(function () {
  'use strict';
  function start() {
    var signup = document.querySelector('.hp-table .hp_subscribe');
    if (!signup) return;
    var wrapper = signup.querySelector('.wrapper');
    var content = signup.querySelector('.widget_content');
    var note = signup.querySelector('fieldset > small:not(#response)');
    if (!wrapper || !content || !note) return;
    note.classList.add('tc-home-signup-note');
    note.textContent = 'Stay connected with what’s happening in our community.';
    wrapper.insertBefore(note, content);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
