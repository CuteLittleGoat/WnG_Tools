// --- Konfiguracja Firebase dla prywatnych danych DataVault / Firebase config for private DataVault data ---
// Ten plik podłącza DEMO/PREVIEW do tego samego projektu Firebase, którego używa rpg-dataslate-relay.
// This file connects DEMO/PREVIEW to the same Firebase project used by rpg-dataslate-relay.
// Hasło nie jest przechowywane w tym pliku. / The password is not stored in this file.

(function loadRelayPreviewFirebaseConfig(){
  document.write('<script src="https://cutelittlegoat.github.io/rpg-dataslate-relay/DataSlate/config/firebase-config.js"><\/script>');
  document.write('<script>window.WG_FIREBASE_CONFIG = Object.assign({}, window.firebaseConfig || {}, { databaseURL: "https://rpg-dataslate-relay-default-rtdb.europe-west1.firebasedatabase.app/" }); window.WG_DATA_ACCESS_EMAIL = "youhavebeenrickrolledbyme@gmail.com";<\/script>');
})();
