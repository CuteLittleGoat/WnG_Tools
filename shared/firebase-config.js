// --- Konfiguracja Firebase dla prywatnych danych DataVault / Firebase config for private DataVault data ---
// Ten plik NIE zawiera hasła. / This file does NOT contain the password.
// Hasło użytkownik wpisuje w formularzu aplikacji. / Password is entered by the user in the app form.
// Web firebaseConfig nie jest hasłem; bezpieczeństwo zapewniają Firebase Auth i reguły RTDB. / Web firebaseConfig is not a password; security is provided by Firebase Auth and RTDB rules.
window.WG_FIREBASE_CONFIG = {
  apiKey: "INSERT_YOUR_API_KEY",
  authDomain: "INSERT_YOUR_AUTH_DOMAIN",
  databaseURL: "INSERT_YOUR_DATABASE_URL",
  projectId: "INSERT_YOUR_PROJECT_ID",
  storageBucket: "INSERT_YOUR_STORAGE_BUCKET",
  messagingSenderId: "INSERT_YOUR_MESSAGING_SENDER_ID",
  appId: "INSERT_YOUR_APP_ID"
};

window.WG_DATA_ACCESS_EMAIL = "INSERT_YOUR_TECHNICAL_USER_EMAIL";
