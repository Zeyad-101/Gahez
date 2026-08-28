# Interview Trainer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static, no-build-step Interview Trainer that gives adaptive AI interview practice through Puter by default and supports mock mode and BYOK providers.

**Architecture:** Ordered classic scripts expose exactly four namespace objects: `InterviewStorage`, `InterviewAI`, `InterviewSession`, and `InterviewApp`. Session rules stay in `interview.js`, provider and parsing logic stays in `ai.js`, and screen/DOM work stays in `app.js`. The application works when `index.html` is opened through `file://`.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript, Node 24 built-in test runner, Puter.js, Google Fonts; no framework, build tool, package installation, backend, or database.

**Spec:** `docs/superpowers/specs/2026-08-28-interview-trainer-design.md`

## Global Constraints

- Load classic scripts in this exact order: `storage.js`, `ai.js`, `interview.js`, `app.js`; never use `type="module"`.
- Every file exposes one namespaced global and avoids generic top-level declarations such as `state`, `config`, or `data`.
- Only `ai.js` may identify, call, or parse Puter, Gemini, or OpenAI.
- The normal shipped path is live; mock mode is enabled only by `?mock=1`.
- Until Task 7, live mode is an intentional stub; test Tasks 1–6 with `?mock=1`.
- Keep the session in memory. Persist only the opaque AI-settings object via `localStorage`.
- Use the design tokens and the Fraunces, Inter, and IBM Plex Mono font roles from the spec.
- No real key may appear in source, fixtures, test output, or commits.
- The current workspace is not a Git repository. Do not initialize one without user authorization; record test evidence instead of committing.

## File map

| Path | Responsibility |
| --- | --- |
| `index.html` | Static screen markup, dialog markup, font/Puter script tags, ordered application script tags. |
| `css/styles.css` | Tokens, responsive layout, components, focus styles, rail, score bars, dialog, and reduced-motion rules. |
| `js/storage.js` | Opaque localStorage read/write/reset API. |
| `js/ai.js` | Mock bank/evaluator, settings validation, provider calls, prompts, parsing, normalization, error classification. |
| `js/interview.js` | Five-question state, attempts, topic aggregation, question/evaluation orchestration, summary math. |
| `js/app.js` | Screen transitions, DOM updates, events, error recovery, and accessibility focus handling. |
| `tests/storage.test.js` | Opaque settings persistence behavior. |
| `tests/ai.test.js` | URL mock mode, JSON normalization, mock outputs, provider settings validation, and controlled failure behavior. |
| `tests/interview.test.js` | Attempt, retry, topic, progression, and summary rules. |
| `tests/helpers/load-classic-scripts.js` | `node:vm` helper that loads classic namespace scripts with fake browser globals and configurable Puter/fetch replies. |
| `README.md` | Launch instructions, `?mock=1`, provider-key caveat, and architecture overview. |

---

### Task 1: Scaffold the static UI and test harness (Milestone 1)

**Files:**
- Create: `index.html`
- Create: `css/styles.css`
- Create: `tests/helpers/load-classic-scripts.js`
- Create: `tests/storage.test.js`
- Create: `js/storage.js`

**Interfaces:**
- Produces `InterviewStorage.getSettings()`, `InterviewStorage.saveSettings(value)`, and `InterviewStorage.clearSettings()`.
- Produces static elements addressed by `data-screen`, `data-action`, and `data-role` attributes; later JavaScript must query these instead of relying on presentation class names.

- [ ] **Step 1: Write the failing storage test.**

```js
// tests/storage.test.js
import test from 'node:test';
import assert from 'node:assert/strict';
import { loadScripts } from './helpers/load-classic-scripts.js';

test('InterviewStorage round-trips an opaque settings object', () => {
  const context = loadScripts(['js/storage.js']);
  const value = { provider: 'puter', byokKey: '' };
  context.InterviewStorage.saveSettings(value);
  assert.deepEqual(context.InterviewStorage.getSettings(), value);
  context.InterviewStorage.clearSettings();
  assert.deepEqual(context.InterviewStorage.getSettings(), {});
});
```

- [ ] **Step 2: Run the test and verify it fails because the script is absent.**

Run: `node --test tests/storage.test.js`

Expected: FAIL with a missing-file or missing-namespace error.

- [ ] **Step 3: Create the VM loader and minimal opaque storage namespace.**

```js
// js/storage.js
(function attachInterviewStorage(root) {
  const storageKey = 'interview-trainer.settings';
  root.InterviewStorage = {
    getSettings() { try { return JSON.parse(root.localStorage.getItem(storageKey) || '{}'); } catch { return {}; } },
    saveSettings(value) { root.localStorage.setItem(storageKey, JSON.stringify(value)); },
    clearSettings() { root.localStorage.removeItem(storageKey); }
  };
}(globalThis));
```

`load-classic-scripts.js` must export `loadScripts(relativePaths, options = {})`. It supplies `globalThis`, an in-memory `localStorage`, `location.search`, `setTimeout`, and `clearTimeout` to `node:vm`, then loads each ordered relative path and returns the context. `options` supports `search`, `puterReply`, `puterResponses`, `fetchReply`, and `fetchThrows`; the helper records calls in `context.puter.ai.calls` and `context.fetch.calls`.

- [ ] **Step 4: Create `index.html` and `styles.css` with all hidden screen shells.**

Include setup, interview, thinking, evaluation, summary, error-recovery, and settings-dialog shells. Include the exact root tokens (`--bg: #F3F4F1`, `--accent: #26493D`, `--gold: #B8863C`, and the remaining spec tokens), Google Font links, Puter’s script source, and ordered classic script tags. Make setup the only initially visible screen.

- [ ] **Step 5: Run the test and inspect the static file.**

Run: `node --test tests/storage.test.js`

Expected: PASS. Then open `index.html?mock=1` and verify the setup form is visible, the other screen shells are hidden, and no module/CORS error appears.

### Task 2: Implement mock question generation and session startup (Milestone 1)

**Files:**
- Create: `js/ai.js`
- Create: `js/interview.js`
- Create: `tests/ai.test.js`
- Create: `tests/interview.test.js`

**Interfaces:**
- Consumes: `InterviewStorage`.
- Produces `InterviewAI.generateQuestion(config, session)` and `InterviewSession.startSession(config)`.
- `generateQuestion` resolves `{ question, topic }` in mock mode and a structured `{ errorCode, message }` failure object for unavailable live mode before Task 7.

- [ ] **Step 1: Write failing mock-mode tests.**

```js
test('mock mode returns a type-appropriate question', async () => {
  const context = loadScripts(['js/storage.js', 'js/ai.js'], { search: '?mock=1' });
  const question = await context.InterviewAI.generateQuestion(
    { interviewType: 'Technical', jobTitle: 'Frontend Developer', experienceLevel: 'Mid-level' },
    { questions: [], weakTopics: [], strongTopics: [] }
  );
  assert.equal(typeof question.question, 'string');
  assert.equal(typeof question.topic, 'string');
  assert.ok(question.question.length > 20);
});

test('session startup stores the first question at index zero', async () => {
  const context = loadScripts(['js/storage.js', 'js/ai.js', 'js/interview.js'], { search: '?mock=1' });
  await context.InterviewSession.startSession({ jobTitle: 'Designer', experienceLevel: 'Junior', interviewType: 'Behavioral' });
  assert.equal(context.InterviewSession.getSession().currentIndex, 0);
  assert.equal(context.InterviewSession.getSession().questions.length, 1);
});
```

- [ ] **Step 2: Run the tests and verify they fail.**

Run: `node --test tests/ai.test.js tests/interview.test.js`

Expected: FAIL because `InterviewAI` and `InterviewSession` do not exist.

- [ ] **Step 3: Implement the mock-only surface and five-question state.**

Use an IIFE for each namespace. `ai.js` determines mock mode with:

```js
const isMockMode = new URLSearchParams(root.location.search).get('mock') === '1';
```

Create at least three question templates for each Behavioral, Technical, HR, and Mixed type. The mock selector must prefer a topic not present in `session.questions`. `InterviewSession.startSession()` creates the exact spec shape, calls `InterviewAI.generateQuestion`, stores it, and returns a structured success/failure result.

Add this shared fixture to `tests/helpers/load-classic-scripts.js` so later tests have a defined setup path:

```js
export async function startMockSession() {
  const context = loadScripts(['js/storage.js', 'js/ai.js', 'js/interview.js'], { search: '?mock=1' });
  await context.InterviewSession.startSession({ jobTitle: 'Designer', experienceLevel: 'Junior', interviewType: 'Behavioral' });
  return context.InterviewSession;
}
```

- [ ] **Step 4: Run tests and manually verify the first milestone behavior.**

Run: `node --test tests/ai.test.js tests/interview.test.js`

Expected: PASS. Open `index.html?mock=1`; starting a session must display a generated first question with the rail at question one of five.

### Task 3: Wire setup, interview, rail, and word count (Milestone 1 checkpoint)

**Files:**
- Modify: `index.html`
- Modify: `css/styles.css`
- Create: `js/app.js`

**Interfaces:**
- Consumes: `InterviewSession.startSession(config)` and `InterviewSession.getSession()`.
- Produces `InterviewApp.init()` and screen routing based on `data-screen`.

- [ ] **Step 1: Add a manual acceptance checklist before wiring.**

Create `tests/manual-milestone-1.md` containing these exact checks: setup validates job title; Start shows the connection-thinking copy; mock generation reaches question one; the rail has five dots with only the first current; typing `0`, `1`, and many words produces correct singular/plural word counts; empty submission shows inline feedback; Tab focus is visible.

- [ ] **Step 2: Implement minimal DOM wiring.**

`InterviewApp.init()` must bind DOMContentLoaded, setup submission, textarea input, and empty-answer validation. It must render the session counter, topic, question, and rail from `InterviewSession.getSession()`; it must not access providers or localStorage. Use a word counter implementation that handles whitespace-only input:

```js
const countWords = (text) => text.trim() ? text.trim().split(/\s+/).length : 0;
```

- [ ] **Step 3: Run automated tests and the manual checklist.**

Run: `node --test tests/storage.test.js tests/ai.test.js tests/interview.test.js`

Expected: PASS. Open `index.html?mock=1` and complete every line in `tests/manual-milestone-1.md`.

- [ ] **Step 4: Stop for the required user checkpoint.**

Do not begin Task 4 until the user has reviewed the mock setup/interview flow, session rail, and session data behavior.

### Task 4: Add mock evaluation, retries, and adaptive progression (Milestone 2)

**Files:**
- Modify: `js/ai.js`
- Modify: `js/interview.js`
- Modify: `js/app.js`
- Modify: `index.html`
- Modify: `css/styles.css`
- Modify: `tests/ai.test.js`
- Modify: `tests/interview.test.js`

**Interfaces:**
- Produces `InterviewAI.evaluateAnswer(question, answerText, config)` with the evaluation shape in the spec.
- Produces `InterviewSession.submitAnswer(answerText)`, `InterviewSession.retryQuestion()`, and `InterviewSession.advanceQuestion()`.

- [ ] **Step 1: Write failing evaluation and retry tests.**

```js
test('a developed mock answer scores higher than a one-word answer', async () => {
  const { InterviewAI } = loadScripts(['js/storage.js', 'js/ai.js'], { search: '?mock=1' });
  const question = { question: 'Describe a difficult project.', topic: 'Ownership' };
  const shortResult = await InterviewAI.evaluateAnswer(question, 'Fine.', {});
  const detailedResult = await InterviewAI.evaluateAnswer(question, 'I led a cross-functional project by defining milestones, aligning stakeholders, and measuring the result weekly.', {});
  assert.ok(detailedResult.overall_score > shortResult.overall_score);
  assert.equal(Object.keys(detailedResult.categories).length, 5);
});

test('retry appends an attempt and exposes the delta', async () => {
  const session = await startMockSession();
  const first = await session.submitAnswer('Short answer.');
  session.retryQuestion();
  const second = await session.submitAnswer('A detailed answer with situation, action, result, and an outcome.');
  assert.equal(session.getSession().attempts[0].length, 2);
  assert.equal(second.attemptNumber, 2);
  assert.equal(second.delta, second.evaluation.overall_score - first.evaluation.overall_score);
});
```

- [ ] **Step 2: Run tests and verify they fail.**

Run: `node --test tests/ai.test.js tests/interview.test.js`

Expected: FAIL because the evaluator and attempt APIs are absent.

- [ ] **Step 3: Implement the mock evaluator and evaluation rendering.**

The evaluator returns `{ overall_score, categories, good, improve, example_answer, follow_up_questions, weak_topics }`; categories are relevance, clarity, structure, specificity, and confidence. Scores increase with word count but remain clamped. Render score bars with `aria-valuenow`, four feedback blocks, attempt number, and delta only after the first attempt. Retry reopens the same question without deleting attempts.

- [ ] **Step 4: Implement deterministic/adaptive topic logic and next-question UI.**

Category averages below 65 add their topic to `weakTopics`; averages above 85 add to `strongTopics`. Add and deduplicate evaluator-provided `weak_topics`; do not let them remove or override threshold-derived values. `advanceQuestion()` calls `generateQuestion` with prior question topics and weak/strong arrays, then creates the next question only when the current index is below four.

- [ ] **Step 5: Run verification.**

Run: `node --test tests/ai.test.js tests/interview.test.js`

Expected: PASS. In `?mock=1`, submit twice on one question, confirm Attempt 2 and a delta, then advance to question two with a different topic.

### Task 5: Build the session summary and reset behavior (Milestone 3)

**Files:**
- Modify: `js/interview.js`
- Modify: `js/app.js`
- Modify: `index.html`
- Modify: `css/styles.css`
- Modify: `tests/interview.test.js`

**Interfaces:**
- Produces `InterviewSession.getSummary()` and `InterviewSession.resetSession()`.
- `getSummary()` returns `{ averageScore, strongestCategory, weakestCategory, questions }`, with each question holding its best attempt score.

- [ ] **Step 1: Write failing summary tests.**

```js
test('summary selects the best, rather than last, attempt for a question', async () => {
  const session = await startMockSession();
  const first = await session.submitAnswer('A detailed situation, action, result, and measurable outcome.');
  session.retryQuestion();
  await session.submitAnswer('Brief.');
  for (let index = 1; index < 5; index += 1) {
    await session.advanceQuestion();
    await session.submitAnswer('A complete answer with context, action, result, learning, and a measurable outcome.');
  }
  const summary = session.getSummary();
  assert.equal(summary.questions[0].bestScore, first.evaluation.overall_score);
  assert.equal(summary.questions.length, 5);
});

test('reset removes in-memory session data', async () => {
  const session = await startMockSession();
  session.resetSession();
  assert.equal(session.getSession(), null);
});
```

- [ ] **Step 2: Run tests and verify they fail.**

Run: `node --test tests/interview.test.js`

Expected: FAIL because summary/reset APIs are absent.

- [ ] **Step 3: Implement summary math and the summary screen.**

Use each question’s maximum attempt score, round the five-question average to the nearest integer, average every category across those best evaluations, and identify the maximum/minimum category name. After the fifth evaluation, route to summary; **Start new session** invokes `resetSession()`, clears fields/rail/error UI, and focuses job title.

- [ ] **Step 4: Run verification.**

Run: `node --test tests/interview.test.js`

Expected: PASS. Complete five mock questions with a retry, then confirm the first question shows its best—not last—score in summary and reset returns to setup.

### Task 6: Add the settings dialog and opaque settings flow (Milestone 4)

**Files:**
- Modify: `index.html`
- Modify: `css/styles.css`
- Modify: `js/ai.js`
- Modify: `js/app.js`
- Modify: `tests/ai.test.js`

**Interfaces:**
- Produces `InterviewAI.getSettings()` → `{ provider, byokKey, requiresApiKey }`.
- Produces `InterviewAI.saveSettings(provider, byokKey)` → `{ ok, error, settings }`.

- [ ] **Step 1: Write failing settings tests.**

```js
test('a non-Puter provider without a key is rejected by InterviewAI', () => {
  const { InterviewAI } = loadScripts(['js/storage.js', 'js/ai.js'], { search: '?mock=1' });
  const result = InterviewAI.saveSettings('gemini', '');
  assert.equal(result.ok, false);
  assert.match(result.error, /key/i);
});

test('settings exposes a generic key-field flag', () => {
  const { InterviewAI } = loadScripts(['js/storage.js', 'js/ai.js'], { search: '?mock=1' });
  InterviewAI.saveSettings('openai', 'test-key');
  assert.equal(InterviewAI.getSettings().requiresApiKey, true);
});
```

- [ ] **Step 2: Run tests and verify they fail.**

Run: `node --test tests/ai.test.js`

Expected: FAIL because settings functions are absent.

- [ ] **Step 3: Implement the provider-aware AI API and provider-agnostic dialog.**

Keep provider validation solely in `ai.js`. The dialog includes Puter/Gemini/OpenAI choices, password input, storage warning, inline returned error, and Save/Cancel. `app.js` toggles the key field only from `requiresApiKey`, opens from the gear button, closes on Escape/backdrop, traps focus while open, and restores focus to the gear button on close.

- [ ] **Step 4: Run tests and manual accessibility checks.**

Run: `node --test tests/ai.test.js`

Expected: PASS. In `?mock=1`, tab through the dialog, close with Escape and backdrop, confirm focus returns to the gear, and confirm a Gemini/OpenAI empty key cannot save.

### Task 7: Implement and verify real Puter question/evaluation calls (Milestone 5 checkpoint)

**Files:**
- Modify: `js/ai.js`
- Modify: `js/app.js`
- Modify: `tests/ai.test.js`
- Modify: `README.md`

**Interfaces:**
- Replaces the pre-milestone live stub with `InterviewAI.askAI(prompt)` and live `generateQuestion`/`evaluateAnswer` behavior.
- `askAI` is the only low-level provider caller and uses `puter.ai.chat(prompt)` when the selected provider is Puter.

- [ ] **Step 1: Write failing parser and live-routing tests using a Puter stub.**

```js
test('normalizes fenced JSON and clamps scores', async () => {
  const context = loadScripts(['js/storage.js', 'js/ai.js'], { puterReply: '```json\n{"overall_score":150,"categories":{}}\n```' });
  const result = await context.InterviewAI.evaluateAnswer({ question: 'Q', topic: 'T' }, 'Answer', {});
  assert.equal(result.overall_score, 100);
  assert.equal(result.categories.relevance, 0);
});

test('Puter is called once with a JSON-only prompt', async () => {
  const context = loadScripts(['js/storage.js', 'js/ai.js'], { puterReply: '{"question":"Q","topic":"T"}' });
  await context.InterviewAI.generateQuestion({ interviewType: 'HR' }, { questions: [], weakTopics: [], strongTopics: [] });
  assert.equal(context.puter.ai.calls.length, 1);
  assert.match(context.puter.ai.calls[0], /only valid JSON/i);
});
```

- [ ] **Step 2: Run tests and verify they fail.**

Run: `node --test tests/ai.test.js`

Expected: FAIL because the live stub has no parser or Puter implementation.

- [ ] **Step 3: Implement one low-level `askAI` and hardened normalizers.**

`askAI(prompt)` chooses Puter when saved provider is Puter, calls `root.puter.ai.chat(prompt)`, extracts text from known response shapes, and classifies rejected/missing authentication as `auth-dismissed`, network-like errors as `network`, and unparseable text as `malformed-response`. Prompt builders must require only valid JSON and contain job config, current question context, weak topics, and asked topics where relevant. Normalizers fill all five category scores, arrays, and strings with safe defaults and clamp all numbers.

- [ ] **Step 4: Update app thinking/error states and README.**

The first question call shows “Connect with Puter to generate your first question…”. Evaluations show “Reviewing your answer…”. Error panels map `auth-dismissed` to reconnect copy, `network` to retry copy, and `malformed-response` to retry/rephrase copy. README must state that live Puter is the default and `?mock=1` is the offline/demo path.

- [ ] **Step 5: Run automated tests and complete the live checkpoint.**

Run: `node --test tests/ai.test.js tests/interview.test.js`

Expected: PASS. Then open `index.html` without `?mock=1`, start a session, complete Puter sign-in, confirm a real first question/evaluation appears, and document observed latency/auth outcome. Stop for the required user checkpoint before Task 8.

### Task 8: Add direct browser BYOK routing (Milestone 6)

**Files:**
- Modify: `js/ai.js`
- Modify: `tests/ai.test.js`
- Modify: `README.md`

**Interfaces:**
- `InterviewAI.askAI(prompt)` routes saved `gemini` and `openai` settings to provider REST calls, always returning normalized app data or structured failures.

- [ ] **Step 1: Write failing fetch-contract tests.**

```js
test('OpenAI settings send the key directly as a bearer header', async () => {
  const context = loadScripts(['js/storage.js', 'js/ai.js'], { fetchReply: { choices: [{ message: { content: '{"question":"Q","topic":"T"}' } }] } });
  context.InterviewAI.saveSettings('openai', 'secret-test-key');
  await context.InterviewAI.generateQuestion({}, { questions: [], weakTopics: [], strongTopics: [] });
  assert.equal(context.fetch.calls[0].options.headers.Authorization, 'Bearer secret-test-key');
});

test('Gemini settings send the key directly in the documented API-key header', async () => {
  const context = loadScripts(['js/storage.js', 'js/ai.js'], { fetchReply: { candidates: [{ content: { parts: [{ text: '{"question":"Q","topic":"T"}' }] } }] } });
  context.InterviewAI.saveSettings('gemini', 'gemini-test-key');
  await context.InterviewAI.generateQuestion({}, { questions: [], weakTopics: [], strongTopics: [] });
  assert.equal(context.fetch.calls[0].options.headers['x-goog-api-key'], 'gemini-test-key');
  assert.match(context.fetch.calls[0].url, /generativelanguage\.googleapis\.com\/v1beta\/models\//);
});
```

- [ ] **Step 2: Run tests and verify they fail.**

Run: `node --test tests/ai.test.js`

Expected: FAIL because BYOK routes are absent.

- [ ] **Step 3: Implement Gemini and OpenAI request adapters inside `ai.js`.**

Use `fetch` directly from the browser, never a proxy. OpenAI uses `POST https://api.openai.com/v1/chat/completions` with a Bearer header and JSON chat message. Gemini uses `POST https://generativelanguage.googleapis.com/v1beta/models/<current-supported-model>:generateContent`, a `x-goog-api-key` header (not a key in the URL), and a `contents[0].parts[0].text` prompt body. Before implementation, recheck the official Gemini REST reference for the currently supported model name and request shape. Both adapters must extract generated text, feed the shared normalizers, and classify non-OK responses as structured failures without including the secret in UI, logs, or errors.

- [ ] **Step 4: Run tests and verify settings persistence guidance.**

Run: `node --test tests/ai.test.js`

Expected: PASS. Review README’s warning that keys are stored locally and sent directly to the chosen provider; it must not promise stronger security than the browser/device provides.

### Task 9: Complete failure recovery and input edge cases (Milestone 7)

**Files:**
- Modify: `js/ai.js`
- Modify: `js/interview.js`
- Modify: `js/app.js`
- Modify: `index.html`
- Modify: `tests/ai.test.js`
- Modify: `tests/interview.test.js`

**Interfaces:**
- Consumes normalized `{ errorCode, message }` failures from `InterviewAI`.
- Produces an app recovery action that retries the same pending operation without discarding a valid answer/session.

- [ ] **Step 1: Write failing controlled-failure tests.**

```js
test('malformed live output is a safe result, not a thrown provider string', async () => {
  const context = loadScripts(['js/storage.js', 'js/ai.js'], { puterReply: 'not json at all' });
  const result = await context.InterviewAI.evaluateAnswer({ question: 'Q', topic: 'T' }, 'Answer', {});
  assert.equal(result.errorCode, 'malformed-response');
  assert.equal(typeof result.message, 'string');
});

test('failed evaluation leaves the prior attempt list unchanged', async () => {
  const context = loadScripts(['js/storage.js', 'js/ai.js', 'js/interview.js'], {
    puterResponses: ['{"question":"Q","topic":"T"}', new Error('network unavailable')]
  });
  await context.InterviewSession.startSession({ jobTitle: 'Engineer', experienceLevel: 'Mid-level', interviewType: 'Technical' });
  const result = await context.InterviewSession.submitAnswer('An answer that should be retained for retry.');
  assert.equal(result.errorCode, 'network');
  assert.equal(context.InterviewSession.getSession().attempts[0]?.length || 0, 0);
});
```

- [ ] **Step 2: Run tests and verify they fail.**

Run: `node --test tests/ai.test.js tests/interview.test.js`

Expected: FAIL because failure classification/retry preservation is incomplete.

- [ ] **Step 3: Implement recoverable error behavior.**

Ensure a failed generation does not create an empty question, and a failed evaluation does not append an invalid attempt. Preserve the submitted textarea value so retry does not require retyping. Recovery retry repeats the same operation. An auth failure includes the connection copy; network and malformed failures remain distinct. Do not add a mock fallback in any live error path.

- [ ] **Step 4: Run tests and browser checks.**

Run: `node --test tests/ai.test.js tests/interview.test.js`

Expected: PASS. Use test stubs or browser devtools offline mode to exercise all three recovery panels and submit whitespace-only, one-word, and long answers.

### Task 10: Final responsive, accessibility, and documentation pass (Milestone 8)

**Files:**
- Modify: `css/styles.css`
- Modify: `index.html`
- Modify: `js/app.js`
- Modify: `README.md`
- Create: `tests/manual-final.md`

**Interfaces:**
- Preserves all existing namespace APIs; this task changes presentation and interaction affordances only.

- [ ] **Step 1: Write the final manual acceptance list.**

`tests/manual-final.md` must list: 320px and desktop layouts; visible keyboard focus for every action; dialog Tab loop/Escape/backdrop/focus return; rail state at questions 1, 3, and 5; zero/one/many-word labels; `prefers-reduced-motion`; all error panels; five-question summary; `?mock=1`; no-param live Puter; and no secret shown after saving settings.

- [ ] **Step 2: Implement focused polish.**

Add responsive breakpoints that stack the rail above content on narrow screens, preserve a tap target of at least 44px for icon actions, set visible `:focus-visible` outlines, and disable spinner animation inside `@media (prefers-reduced-motion: reduce)`. Ensure all score bars have accessible names and values, form controls have labels, and modal controls have accessible dialog semantics.

- [ ] **Step 3: Run automated tests and final browser verification.**

Run: `node --test tests/storage.test.js tests/ai.test.js tests/interview.test.js`

Expected: PASS. Then complete every item in `tests/manual-final.md` in both `?mock=1` and the normal live path where authentication is available.

- [ ] **Step 4: Record final delivery evidence.**

Update README with direct-open instructions, mock URL, Puter sign-in behavior, BYOK warning, and test command. Record the final test command output and any unavailable external-live verification condition in the implementation handoff.

## Plan self-review

**Spec coverage:** Tasks 1–3 cover static setup/interview, ordered classic scripts, mock mode, rail, and word count. Tasks 4–5 cover evaluation, retries, topic adaptation, summary, and reset. Task 6 covers settings/modal accessibility. Task 7 implements real Puter, parsing, the first-call message, and its checkpoint. Tasks 8–9 cover BYOK and all structured error recovery. Task 10 covers responsive, motion, keyboard, and delivery documentation.

**Placeholder scan:** The plan contains no deferred implementation markers. Every task names exact files, interfaces, commands, and acceptance behavior.

**Type consistency:** `InterviewAI` owns generate/evaluate/settings APIs throughout; `InterviewSession` owns session state and summary; `InterviewApp` remains DOM-only. All failure flows use structured `errorCode`/`message` objects rather than raw provider responses.

## Execution checkpoints

1. User reviews after Task 3 (milestone 1 mock setup/interview click-through).
2. User reviews after Task 7 (milestone 5 live Puter authentication and parsing).
3. User receives final review after Task 10.
