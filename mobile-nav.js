(function () {
  "use strict";
  function start() {
    function labelMenus() {
      var open = document.body.classList.contains("menu-open");
      document.querySelectorAll("#header .cs-mobile-menu-open").forEach(function (button) {
        button.setAttribute("aria-label", "Open menu");
        button.setAttribute("aria-controls", "co_menu_container");
        button.setAttribute("aria-expanded", String(open));
      });
      document.querySelectorAll("#header .js-mobile-menu-close").forEach(function (button) {
        button.setAttribute("aria-label", "Close menu");
      });
      document.querySelectorAll("#header .js-menu-item-toggle").forEach(function (button) {
        var row = button.closest(".co_menu_item");
        var link = row && row.querySelector("a.parent");
        if (link) button.setAttribute("aria-label", link.textContent.replace(/\s+/g, " ").trim() + " submenu");
      });
    }
    labelMenus();
    new MutationObserver(labelMenus).observe(document.body, { attributes: true, attributeFilter: ["class"] });
    var header = document.getElementById("header");
    if (header) new MutationObserver(labelMenus).observe(header, { childList: true, subtree: true });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})();
