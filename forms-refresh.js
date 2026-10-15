(function () {
  'use strict';
  function start() {
    var forms = Array.from(document.querySelectorAll('#co_content_container form[name="asktherabbi"], #co_content_container form[name="subscribe"], #co_content_container form[name="feedback"]'));
    forms.forEach(function (form) {
      if (form.dataset.tcFormReady) return;
      form.dataset.tcFormReady = 'true';
      form.querySelectorAll('textarea').forEach(function (textarea) {
        textarea.style.removeProperty('height');
      });
      Array.from(form.querySelectorAll('input:not([type="hidden"])')).forEach(function (input) {
        var name = (input.name || '').toLowerCase();
        if (/^(firstname|fname)$/.test(name)) input.setAttribute('autocomplete', 'given-name');
        if (/^(lastname|lname)$/.test(name)) input.setAttribute('autocomplete', 'family-name');
        if (/^(email|middlename|middlename2)$/.test(name)) {
          input.setAttribute('autocomplete', 'email');
          input.setAttribute('inputmode', 'email');
        }
      });
      if (form.name === 'subscribe') {
        form.querySelectorAll('.subscribe_form tr').forEach(function (row, index) {
          var input = row.querySelector('input');
          var cell = row.querySelector('td');
          if (!input || !cell || cell.querySelector('label')) return;
          if (!input.id) input.id = 'tc-subscribe-field-' + index;
          var label = document.createElement('label');
          label.htmlFor = input.id;
          label.textContent = cell.textContent.trim();
          cell.replaceChildren(label);
        });
      }
      if (form.name === 'asktherabbi') {
        form.querySelectorAll('[tabindex]').forEach(function (el) {
          if (Number(el.getAttribute('tabindex')) > 0) el.removeAttribute('tabindex');
        });
        var optin = form.querySelector('.co_optin');
        if (optin && optin.parentElement.parentElement.querySelector('.co_global_button')) {
          var optinBox = optin.parentElement;
          var actions = optinBox.parentElement;
          actions.insertBefore(optinBox, actions.firstChild);
          actions.classList.add('tc-form-actions');
        }
      }
      var submitLabel = form.querySelector('button[type="submit"] > span');
      if (submitLabel && form.name === 'asktherabbi') submitLabel.textContent = 'Send Question';
      if (submitLabel && form.name === 'feedback') submitLabel.textContent = 'Send Message';
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
