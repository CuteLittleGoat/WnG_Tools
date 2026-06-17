// config/firebase-config.js
// DEMO/PREVIEW: final Firebase values are supplied by ../shared/firebase-config.js.
(function loadSharedPreviewFirebaseConfig(){
  if (!window.WG_FIREBASE_CONFIG) {
    var request = new XMLHttpRequest();
    request.open("GET", "../shared/firebase-config.js", false);
    request.send(null);
    if (request.status === 0 || (request.status >= 200 && request.status < 300)) {
      new Function(request.responseText)();
    }
  }
  window.firebaseConfig = window.firebaseConfig || window.WG_FIREBASE_CONFIG || {};
})();

// UI LANGUAGE FIX POINT / PUNKT POPRAWKI JĘZYKA UI:
// NPCGenerator currently keeps the old Bestiary checkbox label outside the normal labels map.
// This helper keeps the visible text correct without changing data-language aliases.
(function keepOldBestiaryToggleLocalized(){
  var labels = {
    en: "Show outdated entries?",
    pl: "Czy wyświetlić zdezaktualizowane wpisy?"
  };

  function applyLabel(){
    var lang = document.documentElement.getAttribute("lang") || "en";
    var input = document.getElementById("bestiary-show-old");
    var label = input && input.parentElement ? input.parentElement.querySelector("span") : null;
    if (label) label.textContent = labels[lang] || labels.en;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", applyLabel);
  } else {
    applyLabel();
  }

  var observer = new MutationObserver(applyLabel);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
})();
