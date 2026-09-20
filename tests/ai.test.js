const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

function setupAI(isMock = true) {
  const env = {
    location: { search: isMock ? '?mock=1' : '' },
    InterviewStorage: {
      getProvider: () => 'puter',
      getByokKey: () => '',
      saveProvider: () => {},
      saveByokKey: () => {},
      clearByokKey: () => {}
    }
  };

  const code = fs.readFileSync('js/ai.js', 'utf8');
  eval(code.replace('(globalThis)', '(env)'));
  return env.InterviewAI;
}

test('InterviewAI listProviders', () => {
  const ai = setupAI();
  const providers = ai.listProviders();
  assert.equal(providers.length, 4);
  assert.equal(providers[0].id, 'puter');
  assert.equal(providers[0].free, true);
});

test('InterviewAI testConnection mock mode', async () => {
  const ai = setupAI(true);
  const res = await ai.testConnection();
  assert.equal(res.ok, true);
});

test('InterviewAI generateQuestion in mock mode', async () => {
  const ai = setupAI(true);
  const q = await ai.generateQuestion(
    { jobTitle: 'Software Engineer', experienceLevel: 'Mid', interviewType: 'Technical' },
    { questions: [], weakTopics: [] }
  );
  assert.ok(q.question);
  assert.ok(q.topic);
});

test('InterviewAI evaluateAnswer with salary and rubric', async () => {
  const ai = setupAI(true);
  const evalResult = await ai.evaluateAnswer(
    { question: 'Tell me about a complex project.', topic: 'Architecture' },
    'I led the migration of our monolithic payment gateway to microservices over 3 months, reducing checkout latency by 45% for 120,000 daily users.',
    { jobTitle: 'Software Engineer', experienceLevel: 'Senior', interviewType: 'Technical' }
  );

  assert.ok(evalResult.overall_score >= 50);
  assert.equal(typeof evalResult.categories.relevance, 'number');
  assert.equal(typeof evalResult.categories.specificity, 'number');
  assert.equal(typeof evalResult.categories.structure, 'number');
  assert.equal(typeof evalResult.categories.clarity, 'number');
  assert.equal(typeof evalResult.categories.confidence, 'number');

  assert.ok(evalResult.salary_range);
  assert.ok(evalResult.salary_range.min >= 0);
  assert.equal(evalResult.salary_range.currency, 'EGP');
  assert.ok(evalResult.seniority_label);
});
