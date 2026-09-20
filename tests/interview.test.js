const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

function setupSession() {
  const env = {
    location: { search: '?mock=1' },
    InterviewStorage: {
      getProvider: () => 'puter',
      getByokKey: () => '',
      saveProvider: () => {},
      saveByokKey: () => {},
      clearByokKey: () => {}
    }
  };

  const aiCode = fs.readFileSync('js/ai.js', 'utf8');
  eval(aiCode.replace('(globalThis)', '(env)'));

  const sessionCode = fs.readFileSync('js/interview.js', 'utf8');
  eval(sessionCode.replace('(globalThis)', '(env)'));

  return env.InterviewSession;
}

test('InterviewSession lifecycle', async () => {
  const is = setupSession();
  is.resetSession();
  assert.equal(is.getSession(), null);

  const start = await is.startSession({
    jobTitle: 'Finance Analyst',
    experienceLevel: 'Mid',
    interviewType: 'Behavioral'
  });
  assert.equal(start.ok, true);
  assert.ok(start.question);
  assert.equal(is.getSession().questions.length, 1);

  const submission = await is.submitAnswer(
    'In my previous role I automated monthly reconciliation with Python and SQL, saving 15 hours per close.'
  );
  assert.ok(submission.evaluation);
  assert.equal(submission.attemptNumber, 1);

  const summary = is.getSummary();
  assert.ok(summary.averageScore > 0);
  assert.ok(summary.strongestCategory);
  assert.ok(summary.weakestCategory);
  assert.equal(summary.questions.length, 1);

  is.resetSession();
  assert.equal(is.getSession(), null);
});
