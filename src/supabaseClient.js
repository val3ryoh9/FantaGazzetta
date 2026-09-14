import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const placeholderValues = [
  "https://your-project.supabase.co",
  "https://il-tuo-progetto.supabase.co",
  "https://howzpcpzffqfrekjeign.supabase.co/rest/v1/",
  "your-anon-key",
  "la-tua-chiave-anon-public",
];
const hasRealConfig =
  supabaseUrl &&
  supabaseAnonKey &&
  !placeholderValues.includes(supabaseUrl) &&
  !placeholderValues.includes(supabaseAnonKey);

export const supabase = hasRealConfig
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
