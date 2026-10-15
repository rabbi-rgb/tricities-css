
(function () {
  var p = window.location.pathname || "";
  var s = window.location.search || "";
  var isDonate =
    p.indexOf("/aid/4970020") !== -1 ||
    s.indexOf("aid=4970020") !== -1 ||
    p.replace(/\/$/, "") === "/4970020";
  if (!isDonate) return;

  // Remove the WebMk normalize stylesheet on the donate page only
  var links = document.querySelectorAll('link[href*="cdo-normalize"]');
  for (var i = 0; i !== links.length; i++) {
    links[i].parentNode.removeChild(links[i]);
  }

  // Mobile: stop the amount field's white background running past the box
  var style = document.createElement("style");
  style.textContent =
    "@media (max-width: 769px) {" +
    "#js-donate-form .custom-amount-wrapper {" +
    "background: transparent !important;" +
    "max-width: 100% !important;" +
    "box-sizing: border-box !important;" +
    "}" +
    "}";
  document.head.appendChild(style);
})();
