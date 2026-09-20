const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

function setupEnvironment() {
  const store = new Map();
  const mockStorage = {
    getItem: (k) => store.get(k) ?? null,
    setItem: (k, v) => store.set(k, String(v)),
    removeItem: (k) => store.delete(k),
    clear: () => store.clear()
  };

  const env = {
    localStorage: mockStorage,
    sessionStorage: mockStorage,
    location: { search: '' }
  };

  const code = fs.readFileSync('js/storage.js', 'utf8');
  eval(code.replace('(globalThis)', '(env)'));
  return env.InterviewStorage;
}

test('InterviewStorage defaults', () => {
  const storage = setupEnvironment();
  assert.equal(storage.getProvider(), 'puter');
  assert.equal(storage.getTheme(), 'auto');
  assert.equal(storage.getByokKey(), '');
  assert.equal(storage.getDraft(), '');
});

test('InterviewStorage provider & theme management', () => {
  const storage = setupEnvironment();
  storage.saveProvider('gemini');
  assert.equal(storage.getProvider(), 'gemini');

  storage.saveTheme('dark');
  assert.equal(storage.getTheme(), 'dark');
});

test('InterviewStorage draft management', () => {
  const storage = setupEnvironment();
  storage.saveDraft('my sample answer');
  assert.equal(storage.getDraft(), 'my sample answer');
  storage.clearDraft();
  assert.equal(storage.getDraft(), '');
});

test('InterviewStorage byokKey management', () => {
  const storage = setupEnvironment();
  storage.saveByokKey('test-key-123', { persist: true });
  assert.equal(storage.getByokKey(), 'test-key-123');
  storage.clearByokKey();
  assert.equal(storage.getByokKey(), '');
});
