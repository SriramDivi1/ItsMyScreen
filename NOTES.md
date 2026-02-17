Copy the content below into the "Notes / README" field of the submission form.

---

## Your two fairness / anti-abuse mechanisms

### 1. Voter token (one vote per device)

- **What it does:** Each browser gets a unique token (`crypto.randomUUID`) stored in `localStorage`. The database enforces `unique(poll_id, voter_token)` so each token can vote only once per poll.
- **What it prevents:** The same user voting multiple times from the same browser on the same poll.
- **Limitations:** Clearing `localStorage`, using incognito/private mode, or a different browser/device creates a new token and allows another vote. This is acceptable for a no-sign-up product.

### 2. Vote cooldown (2 seconds)

- **What it does:** A 2-second cooldown between vote attempts, including changing one's vote. If the user tries again within 2 seconds, the request is blocked and a toast is shown.
- **What it prevents:** Accidental double-clicks, rapid automated clicking, and bot-style abuse.
- **Limitations:** Determined attackers could space out votes; the cooldown mainly improves UX and slows basic abuse.

**Additional integrity:** The `vote` and `change_vote` RPCs validate that the selected option belongs to the poll before counting, preventing cross-poll vote injection and malformed requests.

---

## Edge cases handled

- **Invalid poll ID** — "Poll not found" page with navigation to home
- **Duplicate options** — Client-side validation, form highlights duplicates
- **Option validation** — RPC rejects votes for options that don't belong to the poll
- **Clipboard fallback** — Copy link uses `document.execCommand('copy')` if `navigator.clipboard` is unavailable
- **Voter token fallback** — Session-based token if `localStorage` fails (e.g. private mode)
- **Realtime fallback** — 5-second polling when Realtime events don't arrive
- **Input limits** — Question (200), description (300), options (100) chars; sanitized before DB insert
- **Invalid dates** — `timeAgo` returns empty string for invalid date strings
- **Empty options** — Polls with no options show a fallback message
- **Orphan voted option** — "You voted for" only shown when the voted option still exists

---

## Known limitations / what could be improved next

- No poll closure or expiry — polls stay open indefinitely
- Voter token is device-based — multiple devices allow multiple votes per person
- No authentication — no ownership of polls; anyone can create
- No rate limiting on API — relies on Supabase defaults
- **Improvements:** Poll expiry, CAPTCHA, email verification, or optional sign-in for stricter fairness
