# Gahez?

A calm, role-tailored five-question interview practice with concrete coaching feedback after every answer. Pick a role, get one question at a time, see what you did well, what to improve, and a worked example.

![setup](screenshots/01-setup.png)

## Highlights

- **Role-tailored questions** — PM, designer, frontend, sales, marketing, ops, finance, HR, and more. Each role has its own question bank that draws from real day-to-day work, not generic STAR.
- **Concrete coaching** — five scored categories (relevance, clarity, structure, specificity, confidence) plus a worked example answer and likely follow-up questions.
- **Bring your own key** — use Puter for free, or paste your own API key for Anthropic Claude, OpenAI, or Google Gemini. Keys are kept in the browser only; nothing is stored on a server because there is no server.
- **Works offline once loaded** — no analytics, no trackers, no CDN scripts beyond what is needed to reach the AI provider you choose.
- **Mobile / tablet / laptop / desktop** — the layout adapts; controls are 44–48px on touch devices; the keyboard `Ctrl+Enter` submits answers.

## Quick start

It's a static site — no build step.

```sh
# clone
git clone https://github.com/Zeyad-101/gahez.git
cd gahez

# serve locally (any static server works)
python -m http.server 8000
# or
npx serve .
```

Open `http://localhost:8000`. That's it.

### Optional: use Puter (no API key needed)

Puter is the default provider and is free for most sessions. Nothing to configure.

### Optional: bring your own key

Click the gear icon in the topbar → pick a provider → paste your key. The "Remember on this device" checkbox is **off by default** — the key lives only in this tab and is cleared when you close it.

## Mock mode (no network)

Add `?mock=1` to the URL to use the built-in mock evaluator. Useful for trying the app, taking screenshots, or running tests without spending API credits.

## Run the tests

```sh
npm install       # (no deps, but creates node_modules so the runner is local)
npm test          # 35 tests
npm run lint      # node --check on every script
npm run check     # both
```

The test suite covers storage, AI settings, session lifecycle, prompt parsing, and end-to-end script boot. No flaky network tests; everything runs offline in `node --test`.

## Architecture

Four classic scripts, no build step:

| File | Role |
|---|---|
| `index.html` | The whole UI, screen templates, dialogs |
| `css/styles.css` | All design tokens, themes, responsive rules |
| `js/storage.js` | `localStorage` (provider, theme) + `sessionStorage` (key, draft) |
| `js/ai.js` | Provider registry, mock + real evaluators, prompt-injection-safe prompts |
| `js/interview.js` | Session state machine, scoring, summary |
| `js/app.js` | DOM rendering, screen routing, dialogs, theme toggle, event wiring |

Namespaces: `InterviewStorage`, `InterviewAI`, `InterviewSession`, `InterviewApp`.

## Security posture

This is a static, no-backend app. The threat model is "what could a malicious page or compromised extension do to a user on this origin?"

- **Strict CSP** — no `unsafe-inline` for scripts, no third-party scripts except the Puter SDK, no `eval` / `new Function` / `document.write`.
- **API keys** — `sessionStorage` by default, `localStorage` only when the user explicitly opts in. Never sent to anything but the provider the user selected.
- **Prompt-injection defense** — every user-controlled value (job title, question text, answer) is wrapped in `<<<UNTRUSTED_*>>>` delimiters; the model is told to treat those blocks as data, not instructions.
- **XSS surface** — all user data is rendered via `textContent` or programmatic DOM construction. Zero `innerHTML` writes of user data.
- **Referrer policy** — `strict-origin-when-cross-origin`. The user's prompt is not leaked via `Referer` to AI providers.
- **Permissions-Policy** — denies camera, microphone, geolocation, USB, payment, Bluetooth, MIDI, and friends. The app doesn't need any of them.
- **No third-party trackers, no analytics, no cookies.**

What this does **not** protect against: a compromised browser extension running in the same origin, a compromised device, or social engineering of the user into pasting their key into a phishing site. The key, when persisted, is only as safe as the browser and device.

## Adding a new role

Edit `js/ai.js`. Find `roleKeywords` and add an entry, then add a matching key in `roleBank` with three to five `(topic, question)` pairs. No other code changes needed.

## License

MIT — see [LICENSE](LICENSE).
