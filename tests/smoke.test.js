const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

test('End-to-end 5-question interview smoke test in mock mode', async () => {
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

  const is = env.InterviewSession;
  const config = {
    jobTitle: 'Product Manager',
    experienceLevel: 'Mid',
    interviewType: 'Mixed'
  };

  const start = await is.startSession(config);
  assert.equal(start.ok, true);

  for (let i = 0; i < 5; i++) {
    const currentQ = is.getSession().questions[is.getSession().currentIndex];
    assert.ok(currentQ);

    const submission = await is.submitAnswer(
      `For question ${i + 1}, I led cross-functional discovery across 14 enterprise clients, prioritized our top 3 MVP capabilities, and reduced churn by 22% over 6 months.`
    );
    assert.ok(submission.evaluation);
    assert.ok(submission.evaluation.salary_range);
    assert.ok(submission.evaluation.seniority_label);

    if (i < 4) {
      const adv = await is.advanceQuestion();
      assert.equal(adv.ok, true);
    }
  }

  const summary = is.getSummary();
  assert.equal(summary.questions.length, 5);
  assert.ok(summary.averageScore >= 50);
  assert.ok(summary.questions.every((q) => q.bestScore > 0));
  assert.ok(summary.questions.every((q) => q.evaluation.salary_range.min > 0));
});
