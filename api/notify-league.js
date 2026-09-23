import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const accessToken = (req.headers.authorization || "").replace("Bearer ", "");
  const { leagueId, title, message } = req.body || {};

  if (!accessToken || !leagueId || !title || !message) {
    res.status(400).json({ error: "Parametri mancanti" });
    return;
  }

  const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_ANON_KEY,
    { global: { headers: { Authorization: `Bearer ${accessToken}` } } },
  );

  const { data: userData, error: userError } =
    await supabase.auth.getUser(accessToken);
  if (userError || !userData?.user) {
    res.status(401).json({ error: "Sessione non valida" });
    return;
  }

  const [{ data: profile }, { data: membership }] = await Promise.all([
    supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", userData.user.id)
      .maybeSingle(),
    supabase
      .from("league_members")
      .select("role")
      .eq("league_id", leagueId)
      .eq("user_id", userData.user.id)
      .maybeSingle(),
  ]);

  const isAdmin = Boolean(profile?.is_admin) || membership?.role === "admin";
  if (!isAdmin) {
    res.status(403).json({ error: "Non autorizzato" });
    return;
  }

  const apiKey = (process.env.ONESIGNAL_REST_API_KEY || "").trim();
  const appId = process.env.VITE_ONESIGNAL_APP_ID;
  if (!apiKey || !appId) {
    console.error("OneSignal non configurato: manca ONESIGNAL_REST_API_KEY o VITE_ONESIGNAL_APP_ID");
    res.status(500).json({ error: "OneSignal non configurato sul server" });
    return;
  }

  // Le nuove App API Key (os_v2_app_...) usano lo schema "Key", le legacy "Basic"
  const authScheme = apiKey.startsWith("os_v2_") ? "Key" : "Basic";

  const notifyResponse = await fetch(
    "https://api.onesignal.com/notifications?c=push",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${authScheme} ${apiKey}`,
      },
      body: JSON.stringify({
        app_id: appId,
        target_channel: "push",
        headings: { en: title },
        contents: { en: message },
        filters: [
          { field: "tag", key: `league_${leagueId}`, relation: "=", value: "1" },
        ],
      }),
    },
  );

  const result = await notifyResponse.json().catch(() => null);
  if (!notifyResponse.ok) {
    console.error("OneSignal error:", notifyResponse.status, result);
    res.status(502).json({ error: result?.errors?.[0] || "Errore OneSignal" });
    return;
  }

  // OneSignal risponde 200 anche se nessun utente corrisponde al filtro
  if (!result?.id || result?.errors) {
    console.warn("OneSignal: notifica non inviata", result);
    res.status(200).json({ ok: false, result });
    return;
  }

  res.status(200).json({ ok: true, id: result.id });
}
