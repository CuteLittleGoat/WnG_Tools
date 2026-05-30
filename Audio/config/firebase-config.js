// Plik logiki modułu: konfiguracja, funkcje i obsługa zdarzeń / Module logic file: configuration, functions, and event handling
// Skopiuj ten plik jako: config/firebase-config.js (bez ".template")
// Następnie wklej swój firebaseConfig z:
// Firebase Console → Project settings → Your apps (Web) → Firebase SDK snippet (Config)

// WAŻNE WDROŻENIE: Każda grupa (każdy serwer) powinna mieć własny projekt Firebase i własny komplet kluczy poniżej.
// IMPORTANT DEPLOYMENT: Each group (each server) should use its own Firebase project and its own full key set below.
window.firebaseConfig = {
  apiKey: "INSERT_YOUR_API_KEY",
  authDomain: "INSERT_YOUR_AUTH_DOMAIN",
  projectId: "INSERT_YOUR_PROJECT_ID",
  storageBucket: "INSERT_YOUR_STORAGE_BUCKET",
  messagingSenderId: "INSERT_YOUR_MESSAGING_SENDER_ID",
  appId: "INSERT_YOUR_APP_ID"
};
