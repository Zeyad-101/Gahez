(function attachInterviewApp(root) {
  const $ = (selector, base = document) => base.querySelector(selector);
  const $$ = (selector, base = document) => Array.from(base.querySelectorAll(selector));
  const PROVIDER_LABELS = { puter: 'Puter', gemini: 'Gemini', openai: 'OpenAI', claude: 'Claude' };
  const RING_CIRCUMFERENCE = 326.7; // 2π × 52
  const CATEGORY_DESCRIPTIONS = {
    relevance:   'How directly your answer addresses the question',
    clarity:     'How easy your answer is to follow',
    structure:   'How well-organized your answer is',
    specificity: 'How concrete and detailed your examples are',
    confidence:  'How decisive and assured your delivery sounds'
  };
  const SCORE_LABELS = [
    { min: 90, text: 'Excellent',  className: 'is-excellent' },
    { min: 80, text: 'Strong',     className: 'is-strong' },
    { min: 70, text: 'Solid',      className: 'is-solid' },
    { min: 60, text: 'Progress',   className: 'is-progress' },
    { min:  0, text: 'Keep going', className: 'is-practice' }
  ];

  let retryOperation = null;
  let lastFocus = null;
  let confirmResolver = null;
  let toastTimer = null;

  const words = (text) => text.trim() ? text.trim().split(/\s+/).length : 0;
  const pad2 = (n) => String(n + 1).padStart(2, '0');
  const capitalize = (s) => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
  const escape = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const safeMessage = (raw) => {
    if (!raw) return '';
    let cleaned = String(raw);
    cleaned = cleaned.replace(/https?:\/\/\S+/g, '').replace(/\s+/g, ' ').trim();
    if (cleaned.length > 200) cleaned = cleaned.slice(0, 197) + '…';
    return cleaned;
  };
  const formatDuration = (ms) => {
    if (!ms || ms < 0) return '0 min';
    const totalSec = Math.round(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    if (min === 0) return sec + ' sec';
    if (min < 1) return 'less than a minute';
    return min + ' min ' + (sec ? sec + ' sec' : '').trim();
  };
  const scoreLabel = (score) => SCORE_LABELS.find((item) => score >= item.min);

  /* ---------- Screen routing ---------- */

  function showScreen(name) {
    $$('[data-screen]').forEach((element) => {
      element.classList.toggle('is-active', element.dataset.screen === name);
    });
    root.requestAnimationFrame(() => {
      const target = $('[data-screen="' + name + '"].is-active');
      if (target) {
        const heading = target.querySelector('h1:not(.visually-hidden), h2');
        heading && heading.focus && heading.focus({ preventScroll: true });
      }
    });
  }

  function setSessionContext(text) {
    const el = $('[data-role="top-context"]');
    el.textContent = text || '';
  }

  /* ---------- Theme ---------- */

  const THEME_ORDER = ['auto', 'light', 'dark'];
  const THEME_GLYPHS = { auto: '◐', light: '☀', dark: '☾' };
  const byokStorageKey = 'interview-trainer.byokKey';

  function applyTheme(theme) {
    const value = THEME_ORDER.includes(theme) ? theme : 'auto';
    const html = typeof document !== 'undefined' ? document.documentElement : null;
    if (html) {
      if (value === 'auto') html.removeAttribute('data-theme');
      else html.setAttribute('data-theme', value);
    }
    const btn = $('[data-role="theme-toggle"]');
    if (btn) {
      btn.dataset.state = value;
      btn.setAttribute('aria-label', 'Theme: ' + value + '. Click to change.');
      btn.setAttribute('title', 'Theme: ' + value);
      btn.textContent = THEME_GLYPHS[value] || '◐';
    }
  }

  function cycleTheme() {
    const current = root.InterviewStorage.getTheme();
    const next = THEME_ORDER[(THEME_ORDER.indexOf(current) + 1) % THEME_ORDER.length];
    root.InterviewStorage.saveTheme(next);
    applyTheme(next);
  }

  function isByokPersisted() {
    return Boolean(root.localStorage.getItem(byokStorageKey));
  }

  function renderProviderChip() {
    const current = root.InterviewAI.getSettings();
    const chip = $('[data-role="provider-chip"]');
    chip.dataset.provider = current.provider;
    $('[data-role="provider-chip-name"]').textContent = PROVIDER_LABELS[current.provider] || 'Puter';
    chip.setAttribute('aria-label', 'AI provider: ' + (PROVIDER_LABELS[current.provider] || 'Puter') + '. Click to change.');
  }

  /* ---------- Toast ---------- */

  function toast(message, kind) {
    const region = $('[data-role="toast-region"]');
    if (!region) return;
    const el = document.createElement('div');
    el.className = 'toast' + (kind ? ' is-' + kind : '');
    el.setAttribute('role', 'status');
    el.textContent = message;
    region.replaceChildren(el);
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.remove(), 3200);
  }

  /* ---------- Confirmation dialog ---------- */

  function confirmDialog(title, message) {
    return new Promise((resolve) => {
      const dialog = $('[data-role="confirm-dialog"]');
      $('[data-role="confirm-title"]').textContent = title;
      $('[data-role="confirm-message"]').textContent = message;
      confirmResolver = resolve;
      if (typeof dialog.showModal === 'function') {
        dialog.showModal();
      } else {
        resolve(true);
      }
    });
  }

  function closeConfirm(result) {
    const dialog = $('[data-role="confirm-dialog"]');
    if (dialog.open) dialog.close();
    if (confirmResolver) { confirmResolver(result); confirmResolver = null; }
  }

  /* ---------- Interview screen ---------- */

  function renderInterview() {
    const session = root.InterviewSession.getSession();
    if (!session) return;
    const index = session.currentIndex;
    const question = session.questions[index];

    setSessionContext('Question ' + (index + 1) + ' of 5');
    $('[data-role="question-counter"]').textContent = 'Question ' + (index + 1) + ' of 5';

    const topic = $('[data-role="question-topic"]');
    if (question.topic) { topic.hidden = false; topic.textContent = question.topic; }
    else { topic.hidden = true; topic.textContent = ''; }

    $('[data-role="question-text"]').textContent = question.question;

    const rail = $('[data-role="session-rail"]');
    rail.replaceChildren(...Array.from({ length: 5 }, (_, i) => {
      const item = document.createElement('div');
      const state = i < index ? 'is-complete' : i === index ? 'is-current' : '';
      item.className = 'rail-item ' + state;
      item.setAttribute('aria-label', 'Question ' + (i + 1) + (i < index ? ' (complete)' : i === index ? ' (current)' : ' (upcoming)'));
      item.textContent = pad2(i);
      return item;
    }));

    showScreen('interview');
    const input = $('[data-role="answer-input"]');
    const draft = root.InterviewStorage.getDraft();
    input.value = (index === session.currentIndex) ? draft : '';
    $('[data-role="word-count"]').textContent = words(input.value) + ' word' + (words(input.value) === 1 ? '' : 's');
    $('[data-role="answer-error"]').textContent = '';
    input.focus();
  }

  /* ---------- Evaluation screen ---------- */

  function list(items) {
    return items.map((item) => {
      const li = document.createElement('li');
      li.textContent = item;
      return li;
    });
  }

  function barClass(score) {
    if (score >= 80) return 'is-high';
    if (score >= 60) return 'is-mid';
    return 'is-low';
  }

  function renderEvaluation(result) {
    const evaluation = result.evaluation;
    const session = root.InterviewSession.getSession();

    $('[data-role="overall-score"]').firstChild.nodeValue = String(evaluation.overall_score);

    const ring = $('[data-role="score-ring-fill"]');
    ring.setAttribute('stroke-dasharray', String(RING_CIRCUMFERENCE));
    ring.setAttribute('stroke-dashoffset', String(RING_CIRCUMFERENCE));
    root.requestAnimationFrame(() => {
      ring.setAttribute('stroke-dashoffset', String(RING_CIRCUMFERENCE * (1 - evaluation.overall_score / 100)));
    });

    const attemptNote = $('[data-role="attempt-note"]');
    attemptNote.replaceChildren();
    if (result.attemptNumber > 1 && typeof result.delta === 'number') {
      const sign = result.delta > 0 ? '+' : '';
      const direction = result.delta > 0 ? 'is-up' : result.delta < 0 ? 'is-down' : '';
      attemptNote.appendChild(document.createTextNode('Attempt ' + result.attemptNumber + ' '));
      const deltaEl = document.createElement('span');
      deltaEl.className = 'attempt-delta ' + direction;
      deltaEl.textContent = sign + result.delta + ' vs last attempt';
      attemptNote.appendChild(deltaEl);
    } else if (result.attemptNumber > 1) {
      attemptNote.textContent = 'Attempt ' + result.attemptNumber;
    } else {
      attemptNote.textContent = 'First attempt';
    }

    const labelInfo = scoreLabel(evaluation.overall_score);
    const scoreLabelEl = $('[data-role="score-label"]');
    scoreLabelEl.textContent = labelInfo.text;
    scoreLabelEl.className = 'score-label ' + labelInfo.className;

    const bars = $('[data-role="category-bars"]');
    bars.replaceChildren(...Object.entries(evaluation.categories).map(([name, score]) => {
      const row = document.createElement('div');
      row.className = 'category-row';

      const label = document.createElement('span');
      label.title = CATEGORY_DESCRIPTIONS[name] || '';
      label.textContent = capitalize(name);

      const bar = document.createElement('div');
      bar.className = 'bar ' + barClass(score);
      bar.setAttribute('role', 'progressbar');
      bar.setAttribute('aria-label', name + ' score');
      bar.setAttribute('aria-valuemin', '0');
      bar.setAttribute('aria-valuemax', '100');
      bar.setAttribute('aria-valuenow', String(score));
      const fill = document.createElement('span');
      bar.appendChild(fill);

      const value = document.createElement('strong');
      value.textContent = String(score);

      row.appendChild(label);
      row.appendChild(bar);
      row.appendChild(value);
      root.requestAnimationFrame(() => { fill.style.width = score + '%'; });
      return row;
    }));

    $('[data-role="good-list"]').replaceChildren(...list(evaluation.good));
    $('[data-role="improve-list"]').replaceChildren(...list(evaluation.improve));
    $('[data-role="example-answer"]').textContent = evaluation.example_answer;
    $('[data-role="followup-list"]').replaceChildren(...list(evaluation.follow_up_questions));

    const nextBtn = $('[data-action="next-question"]');
    if (session.currentIndex === 4) {
      nextBtn.innerHTML = 'View summary <span aria-hidden="true">→</span>';
    } else {
      nextBtn.innerHTML = 'Next question <span aria-hidden="true">→</span>';
    }

    showScreen('evaluation');
  }

  /* ---------- Summary screen ---------- */

  function renderSummary() {
    const summary = root.InterviewSession.getSummary();
    $('[data-role="summary-average"]').firstChild.nodeValue = String(summary.averageScore);
    $('[data-role="strongest-category"]').textContent = capitalize(summary.strongestCategory);
    $('[data-role="weakest-category"]').textContent = capitalize(summary.weakestCategory);
    $('[data-role="session-duration"]').textContent = formatDuration(summary.durationMs);

    const list = $('[data-role="summary-questions"]');
    list.replaceChildren(...summary.questions.map((item, index) => {
      const li = document.createElement('li');
      li.className = 'question-results__item';

      const header = document.createElement('button');
      header.type = 'button';
      header.className = 'question-results__row';
      header.setAttribute('aria-expanded', 'false');
      header.setAttribute('aria-controls', 'summary-q-' + index);
      header.dataset.action = 'toggle-summary-question';
      header.dataset.index = String(index);

      const num = document.createElement('span');
      num.className = 'question-results__num';
      num.textContent = pad2(index);
      header.appendChild(num);

      const topic = document.createElement('span');
      topic.className = 'question-results__topic';
      const topicText = document.createElement('span');
      topicText.textContent = item.question.topic || 'Interview practice';
      const small = document.createElement('small');
      small.textContent = 'Question ' + (index + 1) + ' · ' + formatDuration(item.durationMs) +
        (item.attemptCount > 1 ? ' · ' + item.attemptCount + ' attempts' : '');
      topic.appendChild(topicText);
      topic.appendChild(small);
      header.appendChild(topic);

      const score = document.createElement('span');
      score.className = 'question-results__score';
      const scoreNum = document.createElement('strong');
      scoreNum.textContent = String(item.bestScore);
      const scoreSmall = document.createElement('small');
      scoreSmall.textContent = '/100';
      score.appendChild(scoreNum);
      score.appendChild(scoreSmall);
      header.appendChild(score);

      const details = document.createElement('div');
      details.className = 'question-results__details';
      details.id = 'summary-q-' + index;
      details.hidden = true;

      const qHeading = document.createElement('p');
      qHeading.className = 'question-results__q';
      const qLabel = document.createElement('span');
      qLabel.textContent = 'Question';
      const qText = document.createElement('span');
      qText.textContent = item.question.question;
      qHeading.appendChild(qLabel);
      qHeading.appendChild(qText);
      details.appendChild(qHeading);

      if (item.bestAnswer) {
        const aHeading = document.createElement('p');
        aHeading.className = 'question-results__a';
        const aLabel = document.createElement('span');
        aLabel.textContent = 'Your best answer';
        const aText = document.createElement('span');
        aText.textContent = item.bestAnswer;
        aHeading.appendChild(aLabel);
        aHeading.appendChild(aText);
        details.appendChild(aHeading);
      }

      li.appendChild(header);
      li.appendChild(details);
      return li;
    }));

    setSessionContext('Session complete');
    showScreen('summary');
  }

  function toggleSummaryQuestion(event) {
    const button = event.currentTarget;
    const item = button.closest('.question-results__item');
    if (!item) return;
    const details = item.querySelector('.question-results__details');
    if (!details) return;
    const isOpen = !details.hidden;
    details.hidden = isOpen;
    button.setAttribute('aria-expanded', String(!isOpen));
    item.classList.toggle('is-open', !isOpen);
  }

  function buildSummaryText() {
    const summary = root.InterviewSession.getSummary();
    if (!summary) return '';
    const lines = [];
    lines.push('Interview practice summary');
    lines.push('Average score: ' + summary.averageScore + '/100');
    lines.push('Session length: ' + formatDuration(summary.durationMs));
    lines.push('Strongest category: ' + capitalize(summary.strongestCategory));
    lines.push('Focus next: ' + capitalize(summary.weakestCategory));
    lines.push('');
    summary.questions.forEach((item, index) => {
      lines.push('Q' + (index + 1) + ' (' + item.bestScore + '/100, ' + formatDuration(item.durationMs) + ')');
      lines.push('  ' + item.question.question);
      if (item.bestAnswer) lines.push('  Answer: ' + item.bestAnswer);
      lines.push('');
    });
    return lines.join('\n').trim();
  }

  async function copySummary() {
    const text = buildSummaryText();
    if (!text) return;
    try {
      if (root.navigator.clipboard && root.navigator.clipboard.writeText) {
        await root.navigator.clipboard.writeText(text);
        toast('Summary copied to clipboard.', 'success');
        return;
      }
    } catch (error) { /* fall through to legacy path */ }
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'absolute';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand && document.execCommand('copy');
      document.body.removeChild(ta);
      toast(ok ? 'Summary copied to clipboard.' : 'Copy failed: select the text manually.', ok ? 'success' : 'error');
    } catch (error) {
      toast('Copy not supported in this browser.', 'error');
    }
  }

  /* ---------- Error screen ---------- */

  const ERROR_TAGS = {
    'auth-dismissed': 'Sign-in needed',
    'malformed-response': 'AI response',
    'network': 'Connection',
    'no-session': 'Session'
  };

  function showError(result, operation, back) {
    retryOperation = operation;
    const tag = ERROR_TAGS[result.errorCode] || 'Something went wrong';
    $('[data-role="error-tag"]').textContent = tag;
    $('[data-role="error-title"]').textContent =
      result.errorCode === 'auth-dismissed' ? 'Couldn’t connect with your provider' :
      result.errorCode === 'malformed-response' ? 'Couldn’t use that AI response' :
      'Couldn’t continue';
    const cleaned = safeMessage(result.message);
    $('[data-role="error-message"]').textContent = cleaned || 'Please try again.';
    $('[data-action="error-back"]').dataset.screen = back;
    showScreen('error');
  }

  /* ---------- Settings dialog ---------- */

  function openSettings() {
    lastFocus = document.activeElement;
    const dialog = $('[data-role="settings-dialog"]');
    const current = root.InterviewAI.getSettings();

    $$('input[name="provider"]', dialog).forEach((radio) => { radio.checked = radio.value === current.provider; });
    updateKeyField(current);

    const keyInput = dialog.querySelector('[name="byokKey"]');
    keyInput.value = current.byokKey || '';
    keyInput.type = 'password';
    const toggle = $('[data-action="toggle-key-visibility"]', dialog);
    toggle.textContent = 'Show';
    toggle.setAttribute('aria-pressed', 'false');

    const rememberCheckbox = $('[data-role="remember-key"]', dialog);
    rememberCheckbox.checked = isByokPersisted();

    const clearBtn = $('[data-action="clear-key"]', dialog);
    clearBtn.hidden = !current.byokKey;

    const status = $('[data-role="key-status"]', dialog);
    status.classList.remove('is-saved', 'is-error');
    status.textContent = current.byokKey ? 'A key is saved for this provider.' : 'No key saved yet.';

    $('[data-role="settings-error"]', dialog).textContent = '';
    if (typeof dialog.showModal === 'function') dialog.showModal();
    setTimeout(() => {
      const firstRadio = dialog.querySelector('input[name="provider"]:checked');
      if (firstRadio) firstRadio.focus();
    }, 0);
  }

  function updateKeyField(current) {
    const field = $('[data-role="key-field"]');
    const provider = current ? current.provider : ($('input[name="provider"]:checked')?.value || 'puter');
    field.classList.toggle('is-visible', provider !== 'puter');
    const rememberRow = $('[data-role="remember-row"]', field);
    if (rememberRow) rememberRow.hidden = provider === 'puter';
    const saveBtn = $('[data-role="settings-save"]');
    saveBtn.textContent = 'Save and use ' + (PROVIDER_LABELS[provider] || 'Puter');
  }

  function closeSettings() {
    const dialog = $('[data-role="settings-dialog"]');
    if (dialog.open) dialog.close();
    if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
  }

  async function saveSettings(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const provider = form.provider.value;
    const key = form.byokKey.value;
    const rememberCheckbox = form.querySelector('[data-role="remember-key"]');
    const persist = !!(rememberCheckbox && rememberCheckbox.checked);
    const result = root.InterviewAI.saveSettings(provider, key, { persist });
    if (!result.ok) {
      const errorEl = $('[data-role="settings-error"]');
      errorEl.textContent = result.error;
      return;
    }
    renderProviderChip();
    closeSettings();
    const note = provider === 'puter'
      ? 'Using Puter. No API key needed.'
      : (persist
          ? 'API key saved on this device for ' + PROVIDER_LABELS[provider] + '.'
          : 'API key kept for this tab only for ' + PROVIDER_LABELS[provider] + '.');
    toast(note, 'success');
  }

  function clearSavedKey() {
    const current = root.InterviewAI.getSettings();
    if (current.provider === 'puter') return;
    root.InterviewAI.clearKey();
    openSettings();
    toast('Saved key removed.', 'success');
  }

  /* ---------- Action handlers ---------- */

  async function startPractice() {
    const form = $('[data-role="setup-form"]');
    const config = Object.fromEntries(new FormData(form));
    if (!config.jobTitle || !config.jobTitle.trim()) {
      $('[data-role="setup-error"]').textContent = 'Add the role you want to practice for.';
      $('[name="jobTitle"]').focus();
      return;
    }
    $('[data-role="setup-error"]').textContent = '';
    $('[data-role="thinking-copy"]').textContent = 'Generating your first question…';
    $('[data-role="thinking-progress"]').textContent = 'Question 1 of 5';
    showScreen('thinking');
    const result = await root.InterviewSession.startSession(config);
    if (result.errorCode) showError(result, startPractice, 'setup');
    else renderInterview();
  }

  async function submitAnswer() {
    const input = $('[data-role="answer-input"]');
    const value = (input.value || '').trim();
    if (!value) {
      $('[data-role="answer-error"]').textContent = 'Write an answer before submitting.';
      input.focus();
      return;
    }
    if (words(value) < 8) {
      $('[data-role="answer-error"]').textContent = 'Add a few more sentences so there’s something to evaluate.';
      input.focus();
      return;
    }
    $('[data-role="answer-error"]').textContent = '';
    root.InterviewStorage.clearDraft();
    $('[data-role="thinking-copy"]').textContent = 'Reviewing your answer…';
    const session = root.InterviewSession.getSession();
    if (session) $('[data-role="thinking-progress"]').textContent = 'Question ' + (session.currentIndex + 1) + ' of 5';
    showScreen('thinking');
    const result = await root.InterviewSession.submitAnswer(value);
    if (result.errorCode) showError(result, submitAnswer, 'interview');
    else renderEvaluation(result);
  }

  async function nextQuestion() {
    if (root.InterviewSession.getSession().currentIndex >= 4) {
      renderSummary();
      return;
    }
    $('[data-role="thinking-copy"]').textContent = 'Preparing your next question…';
    const session = root.InterviewSession.getSession();
    if (session) $('[data-role="thinking-progress"]').textContent = 'Question ' + (session.currentIndex + 2) + ' of 5';
    showScreen('thinking');
    const result = await root.InterviewSession.advanceQuestion();
    if (result.errorCode) showError(result, nextQuestion, 'evaluation');
    else renderInterview();
  }

  async function tryAgain() {
    root.InterviewSession.retryQuestion();
    renderInterview();
  }

  async function endSession() {
    const ok = await confirmDialog('End this session?', 'Your answers and scores for this session will be discarded.');
    if (!ok) return;
    root.InterviewSession.resetSession();
    resetForNew();
  }

  async function newSession() {
    if (root.InterviewSession.getSession()) {
      const ok = await confirmDialog('Start a new session?', 'Your current session will be discarded.');
      if (!ok) return;
    }
    root.InterviewSession.resetSession();
    resetForNew();
  }

  function resetForNew() {
    setSessionContext('');
    $('[data-role="setup-form"]').reset();
    $('[name="jobTitle"]').focus();
    showScreen('setup');
  }

  async function retryOp() {
    if (typeof retryOperation === 'function') retryOperation();
  }

  function goBack(event) {
    const target = event.currentTarget.dataset.screen || 'setup';
    showScreen(target);
  }

  /* ---------- Init ---------- */

  function init() {
    renderProviderChip();
    applyTheme(root.InterviewStorage.getTheme());
    const yearEl = $('[data-role="copyright-year"]');
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    $('[data-role="setup-form"]').addEventListener('submit', (event) => { event.preventDefault(); startPractice(); });

    const answerInput = $('[data-role="answer-input"]');
    answerInput.addEventListener('input', (event) => {
      const value = event.target.value;
      const count = words(value);
      $('[data-role="word-count"]').textContent = count + ' word' + (count === 1 ? '' : 's');
      root.InterviewStorage.saveDraft(value);
    });
    answerInput.addEventListener('keydown', (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
        event.preventDefault();
        submitAnswer();
      }
    });

    $('[data-action="submit-answer"]').addEventListener('click', submitAnswer);
    $('[data-action="try-again"]').addEventListener('click', tryAgain);
    $('[data-action="next-question"]').addEventListener('click', nextQuestion);
    $('[data-action="end-session"]').addEventListener('click', endSession);
    $('[data-action="copy-summary"]').addEventListener('click', copySummary);
    $$('[data-action="toggle-summary-question"]').forEach((button) => button.addEventListener('click', toggleSummaryQuestion));
    $$('[data-action="new-session"]').forEach((button) => button.addEventListener('click', (event) => { event.preventDefault(); newSession(); }));
    $('[data-action="retry-operation"]').addEventListener('click', retryOp);
    $('[data-action="error-back"]').addEventListener('click', goBack);

    /* Settings dialog */
    const settingsDialog = $('[data-role="settings-dialog"]');
    $$('[data-action="open-settings"]').forEach((button) => button.addEventListener('click', openSettings));
    $$('[data-action="close-settings"]').forEach((button) => button.addEventListener('click', closeSettings));
    settingsDialog.addEventListener('click', (event) => { if (event.target === event.currentTarget) closeSettings(); });
    settingsDialog.addEventListener('cancel', (event) => { event.preventDefault(); closeSettings(); });

    const themeBtn = $('[data-action="cycle-theme"]');
    if (themeBtn) themeBtn.addEventListener('click', cycleTheme);

    $$('input[name="provider"]', settingsDialog).forEach((radio) => {
      radio.addEventListener('change', () => {
        const current = root.InterviewAI.getSettings();
        current.provider = radio.value;
        updateKeyField(current);
        const status = $('[data-role="key-status"]', settingsDialog);
        const clearBtn = $('[data-action="clear-key"]', settingsDialog);
        status.classList.remove('is-saved', 'is-error');
        if (radio.value === 'puter') {
          status.textContent = 'Puter doesn’t need an API key.';
          clearBtn.hidden = true;
        } else {
          status.textContent = current.byokKey ? 'A key is already saved.' : 'No key saved yet.';
          clearBtn.hidden = !current.byokKey;
        }
        const keyInput = settingsDialog.querySelector('[name="byokKey"]');
        if (radio.value === 'puter') { keyInput.value = ''; }
        else { keyInput.focus(); }
      });
    });

    $('[data-action="toggle-key-visibility"]', settingsDialog).addEventListener('click', (event) => {
      const input = settingsDialog.querySelector('[name="byokKey"]');
      const showing = input.type === 'text';
      input.type = showing ? 'password' : 'text';
      event.currentTarget.textContent = showing ? 'Show' : 'Hide';
      event.currentTarget.setAttribute('aria-pressed', showing ? 'false' : 'true');
      input.focus();
    });

    $('[data-action="clear-key"]', settingsDialog).addEventListener('click', clearSavedKey);

    $('[data-role="settings-form"]').addEventListener('submit', saveSettings);

    /* Confirm dialog */
    const confirmDialogEl = $('[data-role="confirm-dialog"]');
    $('[data-action="confirm-cancel"]').addEventListener('click', () => closeConfirm(false));
    $('[data-action="confirm-ok"]').addEventListener('click', () => closeConfirm(true));
    confirmDialogEl.addEventListener('cancel', (event) => { event.preventDefault(); closeConfirm(false); });
    confirmDialogEl.addEventListener('click', (event) => { if (event.target === event.currentTarget) closeConfirm(false); });
  }

  root.InterviewApp = { init };
  document.addEventListener('DOMContentLoaded', init);
}(globalThis));
