import OneSignal from "react-onesignal";

export const SELECTED_LEAGUE_KEY = "Fantagazzetta_selected_league";
export const LAST_PAGE_KEY = "Fantagazzetta_last_page";

// react-onesignal esegue le chiamate appena lo script è caricato, senza
// aspettare la fine di init: ogni chiamata deve passare da oneSignalReady
export const oneSignalReady = OneSignal.init({
  appId: import.meta.env.VITE_ONESIGNAL_APP_ID,
  allowLocalhostAsSecureOrigin: true,
  notifyButton: { enable: false },
  serviceWorkerPath: "sw.js",
  serviceWorkerParam: { scope: "/" },
}).catch((initError) => {
  console.error("Inizializzazione OneSignal fallita:", initError);
  throw initError;
});

export const getRequiresPassword = (isGlobalAdmin) =>
  !isGlobalAdmin &&
  sessionStorage.getItem("Fantagazzetta_auth_mode") !== "login";

export const getSavedPage = () => {
  const savedPage = sessionStorage.getItem(LAST_PAGE_KEY);
  return savedPage === "coppaCirco" ? savedPage : "magazine";
};

export const clearSavedNavigation = () => {
  sessionStorage.removeItem(SELECTED_LEAGUE_KEY);
  sessionStorage.removeItem(LAST_PAGE_KEY);
};

export const getMembership = (result) =>
  Array.isArray(result) ? result[0] : result;

export const notifyLeague = async ({ leagueId, accessToken, title, message }) => {
  if (!leagueId || !accessToken) return;
  try {
    const response = await fetch("/api/notify-league", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ leagueId, title, message }),
    });
    const result = await response.json().catch(() => null);
    if (!response.ok || !result?.ok) {
      console.error("Invio notifica fallito:", response.status, result);
    }
  } catch (notifyError) {
    // la notifica è un extra, un fallimento qui non deve bloccare la pubblicazione
    console.error("Invio notifica fallito:", notifyError);
  }
};
