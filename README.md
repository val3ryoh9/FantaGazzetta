# Fantagazzetta (React)

Magazine + rose + classifica per la tua lega di fantacalcio, convertito in un progetto React (Vite) con **styled-components** per il layout editoriale e **antd** per i componenti interattivi (form, upload immagine, tabelle di input, conferme di eliminazione).

## Avvio rapido

```bash
npm install
npm run dev
```

Il sito si apre su `http://localhost:5173`.

Per una build di produzione:

```bash
npm run build
npm run preview
```

## Struttura

```
src/
  main.jsx                     -> ConfigProvider antd + ThemeProvider styled-components
  App.jsx                      -> stato globale, caricamento/salvataggio, routing tra pagine
  theme.js                     -> palette e token condivisi (pitch green + oro editoriale)
  GlobalStyle.js                -> font Google e reset base
  utils.js                     -> id, formattazione date, ridimensionamento immagini, helper localStorage
  seedData.js                  -> contenuti di esempio al primo avvio
  components/
    Header.jsx                 -> nav sticky con wordmark
    Magazine/
      MagazinePage.jsx         -> orchestratore della sezione magazine
      ArticleComposer.jsx      -> form "Scrivi un articolo" (antd Form + Upload)
      ArticleList.jsx          -> pezzo in evidenza + elenco articoli
      ArticleDetail.jsx        -> pagina di lettura articolo
      MiniClassifica.jsx       -> classifica ridotta in sidebar (e link alla pagina completa)
    Rose/
      RosePage.jsx             -> card per squadra con giocatori modificabili
    Classifica/
      ClassificaPage.jsx       -> tabella classifica completa e modificabile
```

## Backend, autenticazione e ruoli

Il progetto usa Supabase per autenticazione e persistenza. Gli articoli, le rose e la classifica sono salvati in `league_data` e associati alla singola lega. Le policy RLS impediscono a un membro di modificare i dati anche se prova a chiamare direttamente l'API.

1. Crea un progetto su Supabase.
2. Apri **SQL Editor** ed esegui tutto il file `supabase/schema.sql`.
3. In **Authentication > Providers** abilita **Anonymous Sign-Ins**.
4. Copia `.env.example` in `.env` e inserisci URL e anon key da **Project Settings > API**.
5. Avvia l'app con `npm run dev` e accedi usando solo un nome utente.
6. Per rendere admin la tua sessione anonima, copia il relativo `user id` dai log o dalla tabella `profiles` e usa il comando admin presente in fondo a `supabase/schema.sql`.

La password iniziale della lega è `Ciao1`. Gli utenti possono entrare nella lega usando solo un nome utente, ma solo i membri con ruolo `admin` vedono e possono usare gli strumenti di modifica. L'accesso username-only non è un'autenticazione forte: chiunque può dichiarare lo stesso nome e una sessione anonima può cambiare se si cancellano i dati del browser. Per una protezione reale serve email/password o un provider OAuth. Per aggiungere altre leghe inserisci una nuova riga in `public.leagues`, usando `crypt('password', gen_salt('bf'))` per la password.

Il file `.env` non va committato: contiene la configurazione specifica del progetto.

## Personalizzazione

- Colori e font: `src/theme.js` (usato sia da styled-components sia dal tema antd via `ConfigProvider`).
- Nomi delle squadre di esempio: `src/seedData.js`.
