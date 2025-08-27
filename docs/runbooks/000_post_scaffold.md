# Post-Scaffold Runbook

## 1) Env

`.env.local` befüllen; `.env.example` aktuell halten.

## 2) Supabase minimal

- Nur `profiles` + Trigger, RLS aktiv
- Types generieren:

```bash
npx supabase gen types typescript --schema public > src/types/supabase.ts
```

## 3) Auth/Guards Smoke

- /catalog ohne Session → /login
- /login mit Session → /catalog
- /admin/\* als user → /catalog; als admin → OK

## 4) CSS

- `styles/{globals.css,tokens.css}` nutzen
- Tailwind auf Variablen mappen

## 5) CI-Gates

- `pages/` verbieten
- Service Role Key darf nicht im Bundle auftauchen

Done, wenn obige Punkte erfüllt sind.
