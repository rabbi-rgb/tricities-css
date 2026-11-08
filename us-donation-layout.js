/* Progressive two-step presentation. All native U.S. donation fields and handlers remain in place. */
(function () {
  'use strict';
  function init() {
    var canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) return false;
    if (!/\/aid\/6406028\//.test(canonical.href)) return true;
    var form = document.getElementById('6406028');
    if (!form) return false;
    if (form.dataset.tcUsSteps) return true;
    var list = form.querySelector('.form-section');
    var firstIds = ['id_15', 'id_8'];
    var secondIds = ['id_3', 'id_4', 'id_14', 'id_7', 'id_13', 'id_2'];
    var first = firstIds.map(function (id) { return form.querySelector('#' + id); });
    var second = secondIds.map(function (id) { return form.querySelector('#' + id); });
    var other = form.querySelector('#input_8');
    var amountGrid = form.querySelector('#cid_8 .form-multiple-column');
    if (!list || !other || !amountGrid || first.concat(second).some(function (el) { return !el; })) return false;
    // The native width equalizer temporarily clones checked radios into this same form.
    // Our CSS owns this grid, so exclude only this container from those measurement probes.
    amountGrid.classList.replace('form-multiple-column', 'tc-us-amount-grid');
    var backRow = document.createElement('li');
    backRow.className = 'tc-us-step-nav';
    var back = document.createElement('button');
    back.type = 'button'; back.className = 'tc-us-back'; back.textContent = 'Back to gift amount';
    backRow.appendChild(back);
    var heading = document.createElement('h2');
    heading.className = 'tc-us-details-title'; heading.textContent = 'Your details'; heading.tabIndex = -1;
    backRow.appendChild(heading);
    var nextRow = document.createElement('li');
    nextRow.className = 'tc-us-step-nav';
    var error = document.createElement('p');
    error.id = 'tc-us-amount-error'; error.setAttribute('role', 'alert'); error.hidden = true;
    var next = document.createElement('p');
    next.className = 'tc-us-flow-hint'; next.textContent = 'Choose an amount to continue.';
    nextRow.appendChild(error); nextRow.appendChild(next);
    first.forEach(function (el) { list.appendChild(el); });
    list.appendChild(nextRow); list.appendChild(backRow);
    second.forEach(function (el) { list.appendChild(el); });
    var step = 1;
    var slideTimer;
    var panel = form.querySelector('.form-all') || form;
    function finishSlide() {
      clearTimeout(slideTimer);
      list.classList.remove('tc-us-page-forward', 'tc-us-page-back');
      panel.classList.remove('tc-us-page-moving');
    }
    list.addEventListener('animationend', function (event) {
      if (event.target === list) finishSlide();
    });
    function slidePage(value) {
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      panel.classList.add('tc-us-page-moving');
      void list.offsetWidth;
      list.classList.add(value === 2 ? 'tc-us-page-forward' : 'tc-us-page-back');
      slideTimer = setTimeout(finishSlide, 470);
    }
    function show(value, focus) {
      finishSlide();
      step = value;
      clearTimeout(pendingAdvance);
      first.concat([nextRow]).forEach(function (el) { el.hidden = value !== 1; });
      second.concat([backRow]).forEach(function (el) { el.hidden = value !== 2; });
      form.dataset.tcUsStep = String(value);
      if (focus) {
        var target = value === 2 ? heading : form.querySelector('#id_8 input[type="radio"]:checked') || form.querySelector('#input_8_0');
        target.focus();
        (value === 2 ? backRow : first[0]).scrollIntoView({ block: 'start', behavior: 'auto' });
        slidePage(value);
      }
    }
    function advance() {
      var chosen = form.querySelector('#id_8 input[type="radio"]:checked');
      var valid = chosen && (chosen.id !== 'other_8' || (other.value !== '' && other.validity.valid && Number(other.value) >= Number(other.min || 1)));
      error.hidden = !!valid;
      if (!valid) {
        error.textContent = 'Please choose a gift amount or enter an amount of at least $1 USD.';
        (chosen && chosen.id === 'other_8' ? other : form.querySelector('#input_8_0')).focus();
        return;
      }
      show(2, true);
    }
    var pendingAdvance;
    function queueAdvance() {
      clearTimeout(pendingAdvance);
      pendingAdvance = setTimeout(function () { if (step === 1) advance(); }, 120);
    }
    amountGrid.addEventListener('change', function (event) {
      if (event.target.id === 'other_8') clearTimeout(pendingAdvance);
      else if (event.target.matches('input[type="radio"]')) queueAdvance();
    });
    amountGrid.addEventListener('click', function (event) {
      var item = event.target.closest('.form-radio-item');
      var radio = item && item.querySelector('input[type="radio"]');
      if (radio && radio.id === 'other_8') clearTimeout(pendingAdvance);
      else if (radio && radio.checked) queueAdvance();
    });
    first[0].addEventListener('click', function () { clearTimeout(pendingAdvance); });
    other.addEventListener('blur', function (event) {
      var destination = event.relatedTarget;
      if (destination && destination.closest('#id_8, #id_15, .tc-us-back')) return;
      clearTimeout(pendingAdvance);
      pendingAdvance = setTimeout(function () {
        var chosen = form.querySelector('#other_8');
        if (step === 1 && chosen.checked && other.value !== '' && other.validity.valid && Number(other.value) >= Number(other.min || 1) && !form.querySelector('#id_8').contains(document.activeElement) && !first[0].contains(document.activeElement)) advance();
      }, 120);
    });
    back.addEventListener('click', function () { show(1, true); });
    form.addEventListener('keydown', function (event) {
      if (step === 1 && event.key === 'Enter' && event.target !== next) { event.preventDefault(); event.stopImmediatePropagation(); advance(); }
    }, true);
    form.addEventListener('submit', function (event) {
      if (step === 1) { event.preventDefault(); event.stopImmediatePropagation(); advance(); }
    }, true);
    form.dataset.tcUsSteps = 'ready';
    show(1, false);
    return true;
  }
  if (!init()) {
    var observer = new MutationObserver(function () { if (init()) observer.disconnect(); });
    observer.observe(document.documentElement, { childList: true, subtree: true });
    setTimeout(function () { observer.disconnect(); }, 15000);
  }
}());
