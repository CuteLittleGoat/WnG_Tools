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
