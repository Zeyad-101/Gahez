(function attachInterviewSession(root) {
  let session = null;
  const names = ['relevance', 'clarity', 'structure', 'specificity', 'confidence'];
  const unique = (items) => [...new Set(items.filter(Boolean))];
  const average = (values) => values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;

  function getSession() { return session; }

  async function startSession(config) {
    session = { config, questions: [], attempts: {}, currentIndex: 0, weakTopics: [], strongTopics: [], startedAt: Date.now(), questionStartedAt: Date.now() };
    const question = await root.InterviewAI.generateQuestion(config, session);
    if (question.errorCode) { session = null; return question; }
    session.questions.push(question);
    session.attempts[0] = [];
    return { ok: true, question };
  }

  function topics(evaluation) {
    const evaluations = Object.values(session.attempts).flat().map((attempt) => attempt.evaluation);
    names.forEach((name) => {
      const score = average(evaluations.map((item) => item.categories[name]));
      if (score < 65) session.weakTopics = unique([...session.weakTopics, name]);
      if (score > 85) session.strongTopics = unique([...session.strongTopics, name]);
    });
    session.weakTopics = unique([...session.weakTopics, ...(evaluation.weak_topics || [])]);
  }

  async function submitAnswer(answerText) {
    if (!session) return { errorCode: 'no-session', message: 'Start a session first.' };
    const evaluation = await root.InterviewAI.evaluateAnswer(session.questions[session.currentIndex], answerText, session.config);
    if (evaluation.errorCode) return evaluation;
    const attempts = session.attempts[session.currentIndex];
    const previous = attempts.at(-1);
    attempts.push({ answerText, evaluation, timestamp: Date.now() });
    topics(evaluation);
    return { evaluation, attemptNumber: attempts.length, delta: previous ? evaluation.overall_score - previous.evaluation.overall_score : null };
  }

  function retryQuestion() {
    return { ok: Boolean(session), question: session?.questions[session.currentIndex] };
  }

  async function advanceQuestion() {
    if (!session) return { errorCode: 'no-session', message: 'Start a session first.' };
    if (session.currentIndex >= 4) return { complete: true };
    const question = await root.InterviewAI.generateQuestion(session.config, session);
    if (question.errorCode) return question;
    session.currentIndex += 1;
    session.questionStartedAt = Date.now();
    session.questions.push(question);
    session.attempts[session.currentIndex] = [];
    return { ok: true, question };
  }

  function getSummary() {
    if (!session) return null;
    const questions = session.questions.map((question, index) => {
      const attempts = session.attempts[index] || [];
      const best = attempts.reduce(
        (winner, item) => !winner || item.evaluation.overall_score > winner.evaluation.overall_score ? item : winner,
        null
      );
      const startedAt = index === 0 ? session.startedAt : session.questionStartedAt;
      const durationMs = best ? best.timestamp - startedAt : 0;
      return {
        question,
        bestScore: best?.evaluation.overall_score || 0,
        bestAnswer: best?.answerText || '',
        attemptCount: attempts.length,
        durationMs,
        evaluation: best?.evaluation || null
      };
    });
    const evaluations = questions.map((item) => item.evaluation).filter(Boolean);
    const scores = Object.fromEntries(names.map((name) => [name, average(evaluations.map((item) => item.categories[name]))]));
    const ordered = [...names].sort((a, b) => scores[b] - scores[a]);
    return {
      averageScore: Math.round(average(questions.map((item) => item.bestScore))),
      strongestCategory: ordered[0] || '—',
      weakestCategory: ordered.at(-1) || '—',
      questions,
      durationMs: session.startedAt ? Date.now() - session.startedAt : 0
    };
  }

  function resetSession() { session = null; }

  root.InterviewSession = { startSession, getSession, submitAnswer, retryQuestion, advanceQuestion, getSummary, resetSession };
}(globalThis));
