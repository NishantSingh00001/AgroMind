# Security Review — AgroMind

Code-grounded review against the standard 20-point pen-test checklist. AgroMind is a fully
client-side, offline-first static site (vanilla HTML/CSS/JS + bundled Three.js). It has no
backend, no accounts, no auth, and no server-controlled secrets. The only network calls are
two unauthenticated GET requests to the free open-meteo API (`app.js:48-49`) for geocoding and
weather — no API key, no cookies, no write operations.

| # | Check | Result |
|---|-------|--------|
| 1 | HTTP/2 Rapid Reset (CVE-2023-44487) | N/A — no server component in this repo |
| 2 | bcrypt 72-byte truncation | N/A — no auth, no password hashing |
| 3 | SAML signature bypass (CVE-2024-45409) | N/A — no SAML/SSO |
| 4 | nOAuth | N/A — no OAuth |
| 5 | GraphQL alias batching | N/A — no GraphQL |
| 6 | TOTP replay (RFC 6238 §5.2) | N/A — no TOTP/2FA |
| 7 | ReDoS | No — only regex is `esc()`'s `/[&<>]/g` (`core.js:6`), linear and unexploitable |
| 8 | JWT algorithm confusion | N/A — no JWT |
| 9 | HTTP request smuggling | N/A — no server to smuggle requests to |
| 10 | Web cache poisoning | N/A — static site, no server-side cache keyed on headers |
| 11 | Spoofed X-Forwarded-For | N/A — no backend reading that header |
| 12 | Postgres views bypassing RLS | N/A — no database |
| 13 | `Math.random()` for security tokens | No — only use is decorative: 500 particle positions for the 3D terrain hero (`core.js:101`). Not used for IDs, tokens, or anything security-relevant |
| 14 | Timing attacks on secret comparison | N/A — no secrets compared |
| 15 | Padding oracle | N/A — no encryption/decryption |
| 16 | Server-side prototype pollution | N/A — no server; client-side `Object.assign(S, JSON.parse(...))` on JSON import (`app.js:126`) only ever merges into the local `S` state object used for rendering the user's own browser, no `__proto__`-reachable sink |
| 17 | Server-side template injection | N/A — no server-side templating |
| 18 | XXE | N/A — no XML parsing anywhere |
| 19 | Cross-site WebSocket hijacking | N/A — no WebSocket use |
| 20 | Unicode username normalization | N/A — no usernames/accounts |

## Findings outside the 20-point list

None. Details checked:

- **Escaping is consistent.** `esc()` (`core.js:6`) escapes `&<>` (no quote-escaping) and is used
  everywhere free text is interpolated into `innerHTML`: the field-journal plot name, crop label,
  and note (`app.js:114`, fields `jplot`/`jnote` — `field.html:16-18`), and the weather-search
  error message (`app.js:106`). None of these `esc()` calls build an `href`, `src`, or inline
  event-handler attribute — they only ever land inside text nodes (inside `<b>`, `<span>`, plain
  text) — so the missing quote-escaping is safe as used. Every other string placed into
  `innerHTML` across `index.html`/`crops.html`/`planner.html`/`calculators.html`/`field.html`
  (crop names, stats, calculator labels) comes from the hardcoded internal `CROPS` array or
  computed numbers, never from user or third-party text.
- **JSON import (`app.js:126`)** reads an arbitrary user-selected file and merges it into `S` via
  `Object.assign(S, JSON.parse(r.result))`, then every journal entry it contains is still rendered
  through the same `esc()` path in `jr()` — so a malicious exported/edited JSON file doesn't gain
  any injection path beyond what's already covered.
- **Weather API responses** (`geocode()`/`weather()`, `app.js:48-49`) are inserted into `innerHTML`
  unescaped (place name `g.name`, `field.html` forecast rendering) but come only from the
  reputable open-meteo geocoding/forecast API, not arbitrary user-supplied HTML — no code path
  turns a search string into anything other than a real place-name lookup against that API.
- No `fetch`/`XMLHttpRequest`/`WebSocket` calls beyond the two open-meteo endpoints (confirmed via
  grep across all `.js` files excluding the bundled `three.min.js`).
- No secrets, API keys, or tokens anywhere in the repo (confirmed — open-meteo needs none).

Not fixed — no findings required fixing in this repo.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01RCiZNqYmetGt5SuieaZQcC
