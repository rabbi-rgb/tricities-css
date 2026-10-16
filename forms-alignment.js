(function () {
  'use strict';
  function start() {
    var content = document.querySelector('#co_content_container');
    var form = content && content.querySelector('form[name="subscribe"], form[name="feedback"]');
    if (form && !form.dataset.tcAligned) {
      form.dataset.tcAligned = 'true';
      if (form.name === 'subscribe') {
        var login = content.querySelector('a[href*="/tools/login/settings.asp?v=sub"]');
        if (login) {
          login.classList.add('tc-subscription-login');
          form.insertBefore(login, form.firstChild);
        }
        form.querySelectorAll('tr').forEach(function (row) {
          if (!row.querySelector('input[name="subscriptions"]')) return;
          Array.from(row.children).forEach(function (cell) {
            cell.classList.add(cell.querySelector('input[name="subscriptions"]') ? 'tc-choice-check' : 'tc-choice-copy');
            if (!cell.classList.contains('tc-choice-copy')) return;
            Array.from(cell.childNodes).forEach(function (node) {
              if (node.nodeType === 3 && /^[\s\-\[\]]*$/.test(node.textContent)) node.remove();
            });
          });
        });
      }
      document.querySelectorAll('#BodyContainer .co_local_menu').forEach(function (menu) {
        Array.from(menu.childNodes).forEach(function (node) {
          if (node.nodeType === 3 && /^\s*$/.test(node.textContent)) node.remove();
        });
        menu.classList.add('tc-aligned-side-menu');
        var heading = Array.from(menu.children).find(function (el) { return el.classList.contains('header'); });
        var links = Array.from(menu.children).find(function (el) { return el.classList.contains('body'); });
        if (heading && heading.textContent.trim() && links) {
          var section = document.createElement('div');
          section.className = 'tc-nav-card';
          menu.insertBefore(section, heading);
          section.appendChild(heading);
          section.appendChild(links);
        }
      });
    }
    var popup = document.querySelector('#HeaderSubscribeContainer');
    if (!popup) return;
    var fields = popup.querySelector('.co_form_container');
    if (fields) fields.classList.add('tc-popup-fields');
    popup.querySelectorAll('input:not([type="hidden"])').forEach(function (input) {
      if (input.type === 'submit') return;
      if (!input.getAttribute('aria-label')) input.setAttribute('aria-label', input.getAttribute('placeholder') || input.name);
      if (input.name === 'fname') input.autocomplete = 'given-name';
      if (input.name === 'lname') input.autocomplete = 'family-name';
      if (input.name === 'email') { input.autocomplete = 'email'; input.inputMode = 'email'; }
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
