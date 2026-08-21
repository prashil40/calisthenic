  /* ---------- backend configuration --------------------------------
     The publishable key is meant to be public: it ships in the page,
     and Row Level Security — not secrecy — is what stops one person
     reading another's log. Rotate it from the Supabase dashboard if
     you ever need to; nothing here is a secret.

     What must NEVER appear in this file, or anywhere in the client:
     the service_role key. It bypasses RLS entirely.                  */
  const SUPABASE = {
    url: "https://vargmtkzmrpefjmpstdz.supabase.co",
    key: "sb_publishable_MD1CPJZFPSyuHSqLZIyAHA_WnNGpIRF"
  };
