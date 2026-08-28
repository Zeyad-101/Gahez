# Interview Trainer design

## Purpose and scope

Interview Trainer is a static, browser-only interview-practice web app. It runs by opening `index.html` directly or serving the folder statically. It has no backend, accounts, database, build step, framework, or default paid API dependency.

The app guides a user through five questions for a chosen job title, seniority, and interview type. It gives structured coaching after every answer, supports unlimited retries, adapts later prompts based on performance, and produces an in-memory session summary. Only AI provider settings persist between page loads.

Implementation is delivered in three reviewed batches:

1. Milestone 1: mock-mode setup and interview click-through, followed by a user checkpoint.
2. Milestones 2–5: mock evaluation, summary, settings UI, and live Puter integration, followed by a second checkpoint after Puter is exercised.
3. Milestones 6–8: BYOK, error/edge cases, and polish, followed by final review.

The app must be clicked through after every milestone; code completion alone is not sufficient verification.

## Runtime architecture

The app uses ordered classic scripts, not ES modules, so it works under `file://` as well as static hosting. Scripts load in this order:

1. `js/storage.js`
2. `js/ai.js`
3. `js/interview.js`
4. `js/app.js`

Every script owns a single namespaced browser API, avoiding generic top-level declarations in shared classic-script scope:

- `InterviewStorage`: opaque settings persistence only.
- `InterviewAI`: provider routing, prompts, parsing, normalization, and settings validation.
- `InterviewSession`: in-memory session state and interview rules.
- `InterviewApp`: DOM rendering, screen routing, and event wiring.

`app.js` must not build prompts, score answers, or make session-rule decisions. `interview.js` must not inspect provider text, determine the active provider, or parse provider responses. `ai.js` is the only file that knows providers exist.

## File structure

```
index.html
css/styles.css
js/storage.js
js/ai.js
js/interview.js
js/app.js
assets/
```

`index.html` contains all screens and the settings dialog. JavaScript shows and hides screens without reloading the page.

## AI and settings boundary

`InterviewAI` is the only public AI-facing interface used by `InterviewSession`:

- `InterviewAI.generateQuestion(config, session)` returns a normalized question object.
- `InterviewAI.evaluateAnswer(question, answerText, config)` returns a normalized evaluation object.
- `InterviewAI.getSettings()` returns `{ provider, byokKey, requiresApiKey }` for rendering the settings dialog.
- `InterviewAI.saveSettings(provider, byokKey)` validates and returns `{ ok, error, settings }`.

`InterviewStorage` simply stores and retrieves one opaque settings object in `localStorage`. It has no understanding of providers or API keys. `InterviewAI.saveSettings()` performs provider-specific validation before delegating persistence. The app displays and submits form values but makes no provider-name conditional decisions; it uses `requiresApiKey` for generic key-field visibility.

The delivered app selects mock mode only with `?mock=1`. With no query parameter, live mode is active. The URL-driven switch is deliberate: it offers an offline demo path without risking a shipped demo silently using fake data.

Until milestone 5 lands, the live-provider path is a stub and all milestone 1–4 verification must use `?mock=1`. From milestone 5 onward, the no-parameter live path becomes the primary verification path.

In live mode, the first click on **Start practicing** takes the user to a dedicated thinking screen and starts first-question generation. That state says: “Connect with Puter to generate your first question…”. The first `puter.ai.chat()` call triggers Puter authentication when needed. Later evaluation calls use the standard copy: “Reviewing your answer…”.

The default provider is Puter via `puter.ai.chat(prompt)` and the Puter browser script. Settings also support Gemini and OpenAI browser-side BYOK requests. The modal plainly explains that a key is stored only in the visitor’s browser and sent directly to the selected provider; it is only as safe as that browser and device. No API key is hard-coded anywhere.

Prompts require valid JSON only, with no markdown fence or commentary. `ai.js` removes code fences and surrounding commentary where possible, validates the required shape, supplies sensible field defaults, and clamps scores to 0–100. It converts failures into safe structured app-level failures rather than exposing raw provider output or throwing uncaught errors.

Mock mode contains a realistic question bank for behavioral, technical, HR, and mixed interviews. Its evaluator includes an intentionally short delay and loosely increases quality scores with answer development so the app can be tested entirely offline.

## Session model and interview flow

The session is in-memory only and uses this shape:

```
{
  config,
  questions: [],
  attempts: { [questionIndex]: [{ answerText, evaluation, timestamp }] },
  currentIndex,
  weakTopics: [],
  strongTopics: []
}
```

The fixed session length is five questions.

1. On setup submission, `InterviewSession` records the config and requests question one.
2. A whitespace-only answer remains on the interview screen and receives inline guidance.
3. Submission evaluates the answer and appends an attempt under the current question index.
4. **Try again** reopens the same question and retains all earlier attempts. Retries are intentionally unlimited; the session still has only five questions. The evaluation view shows the attempt count, and, after the first attempt, a score delta such as “+18 vs your last attempt.”
5. **Next question** derives topic signals, requests an adaptive unused-topic question, and advances the index. After question five is evaluated, it opens the summary.

Score thresholds are the deterministic primary source for topic signals: a category average below approximately 65 adds the associated weakness; above approximately 85 adds a strength. The AI evaluation’s `weak_topics` values are additive and deduplicated; they never override the threshold result. The next-question prompt includes weak topics and already-asked topics so it can test weaknesses from another angle rather than repeat a question.

The summary uses the best attempt for every question, calculates an average overall score, and calculates strongest and weakest categories from the session’s category averages. **Start new session** clears all in-memory session state and returns to setup.

## Screens and interaction

The calm, professional visual system uses the exact requested color tokens, Fraunces for sparse display text, Inter for general UI text, and IBM Plex Mono for data-like labels. Corners use 6/10/16px values with restrained shadows and light borders. No retro, game, or chatbot presentation is used.

- **Top bar:** small wordmark, the active question counter once a session has started, and a gear button. It shows no session context during setup.
- **Setup:** centered form for job title, experience level, and interview type. **Start practicing** begins the first-generation thinking state.
- **Interview:** a left vertical five-dot session rail is the signature element: completed dots filled, the current dot ringed, and future dots hollow. The main pane has a mono counter and topic label, large Fraunces question, textarea, live word count, and one primary submit button.
- **Thinking:** spinner with reduced-motion support. It uses the distinct connection and reviewing messages described above.
- **Evaluation:** large score out of 100, horizontal bars for relevance, clarity, structure, specificity, and confidence; separate blocks for strengths, improvements, example answer, and anticipated follow-ups; retry and adaptive-next actions; attempt count and retry delta where applicable.
- **Summary:** average, strongest/weakest category, and five questions with their best score.
- **Settings:** a centered accessible modal/dialog with a backdrop. Escape and backdrop interactions close it and return focus to the gear button. The key input is password-style and follows `requiresApiKey`.

## Failure behavior

No AI path may leave a permanent spinner or a raw JavaScript/provider error. The app replaces thinking with a clear recovery panel that distinguishes:

- dismissed or unavailable Puter sign-in: reconnect and retry;
- network/provider failure: retry the request;
- malformed model response: retry or rephrase the answer.

Recovery returns to an appropriate point in the flow without losing valid session state. The app never silently falls back from live mode to mock data.

## Verification

Verification is proportional to the risk of each milestone and includes:

- direct `file://` mock-mode click-through from setup through all five questions and reset;
- retry and best-attempt summary calculations;
- weak/strong topic threshold and additive-feedback behavior;
- settings validation and `requiresApiKey` behavior;
- mocked malformed response, authentication dismissal, and network-error recovery paths;
- live Puter authentication and parseable-response behavior at the milestone-five checkpoint;
- responsive behavior through mobile width;
- keyboard navigation, focus indicators, dialog focus return, and Escape handling;
- `prefers-reduced-motion` spinner behavior;
- word-count behavior at empty and long-answer boundaries.
