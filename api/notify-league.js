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

  const notifyResponse = await fetch(
    "https://onesignal.com/api/v1/notifications",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${process.env.ONESIGNAL_REST_API_KEY}`,
      },
      body: JSON.stringify({
        app_id: process.env.VITE_ONESIGNAL_APP_ID,
        headings: { en: title },
        contents: { en: message },
        filters: [
          { field: "tag", key: `league_${leagueId}`, relation: "=", value: "1" },
        ],
      }),
    },
  );

  const result = await notifyResponse.json();
  if (!notifyResponse.ok) {
    res.status(502).json({ error: result?.errors?.[0] || "Errore OneSignal" });
    return;
  }

  res.status(200).json({ ok: true, id: result.id });
}
