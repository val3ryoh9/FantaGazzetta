export const uid = () =>
  Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

export const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString("it-IT", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

// Ridimensiona un file immagine lato client e restituisce una data URL JPEG,
// cosi le foto pesano poco anche salvate come base64.
export const resizeImage = (file, maxW = 1000, quality = 0.82) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        let w = img.width;
        let h = img.height;
        if (w > maxW) {
          h = Math.round(h * (maxW / w));
          w = maxW;
        }
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
      img.src = ev.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

export const loadLS = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

export const saveLS = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.error("Errore di salvataggio", e);
    return false;
  }
};

// Accesso ricordato: lega, pagina e modalità di login restano validi per
// SAVED_ACCESS_TTL_MS dall'ultimo utilizzo; scaduti si torna al login.
export const SAVED_ACCESS_TTL_MS = 30 * 60 * 1000;
const SAVED_ACCESS_KEY = "Fantagazzetta_saved_access";

export const loadSavedAccess = () => {
  const saved = loadLS(SAVED_ACCESS_KEY, null);
  if (!saved?.lastAccess) return null;
  if (Date.now() - saved.lastAccess > SAVED_ACCESS_TTL_MS) return null;
  return saved;
};

export const saveSavedAccess = (patch = {}) =>
  saveLS(SAVED_ACCESS_KEY, {
    ...(loadSavedAccess() || {}),
    ...patch,
    lastAccess: Date.now(),
  });

export const clearSavedAccess = () => {
  try {
    localStorage.removeItem(SAVED_ACCESS_KEY);
  } catch {
    // storage non disponibile: niente da pulire
  }
};
