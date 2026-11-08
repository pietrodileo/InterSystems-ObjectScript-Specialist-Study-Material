export const packPath = parts => `../ObjectScript%20Study%20Pack/${parts.split('/').map(encodeURIComponent).join('/')}`;

export const topics = {
  T1: 'Data modeling',
  T2: 'Basic programming',
  T3: 'IRIS features',
  T4: 'Functions and APIs',
  T5: 'Error handling and diagnostics',
};

export function studySections(markdown) {
  // shortcut: these readers follow the pack's heading structure. Update them if the pack changes format.
  const blocks = markdown.split(/^## (\d+\. .+)$/m);
  return blocks.filter((_, i) => i % 2 === 1).map((title, i) => {
    const body = blocks[i * 2 + 2].split(/^## /m)[0];
    const points = body.match(/^### Key Points\r?\n\r?\n(- .+(?:\r?\n- .+)*)/m)?.[1];
    const notes = body.split(/^### Detailed Notes$/m)[1]?.split(/^### Documentation References$/m)[0];
    const prose = notes?.replace(/^```[^\n]*\n[\s\S]*?^```[^\n]*$/gm, '').trim().split(/\n\s*\n/)
      .find(block => /^[A-Za-z`*%$]/.test(block) && /[.!?:]$/.test(block));
    const references = Array.from(body.matchAll(/^- \[([^\]]+)\]\((https:\/\/docs\.intersystems\.com\/[^\s)]+)\)/gm),
      ([, label, url]) => ({ label, url }));
    return { title, prose, references, points: points?.split(/\r?\n/).map(line => line.slice(2)) ?? [] };
  });
}

function exercisePanels(markdown) {
  return Array.from(markdown.matchAll(/^### Panel \d+ — (?:\d+\. )?(.+)\n\n\*\*Example or flow:\*\* (.+)\n\n\*\*Reasoning:\*\* (.+)\n\nRelated question analyses: (.+)$/gm),
    ([, title, example, reason, questions]) => ({
      title, example, reason, qs: Array.from(questions.matchAll(/\[Q(\d+)\]/g), ([, id]) => Number(id)),
    }));
}

export function recordPractice(state, topic, id, attempt) {
  const results = state.results[topic] ??= {};
  const history = (state.history[topic] ??= {});
  history[id] ??= Object.hasOwn(results, id) ? [results[id]] : [];
  history[id].push(attempt);
  results[id] = attempt.passed;
}

export const passedAnswer = attempt => typeof attempt === 'boolean' ? attempt : attempt.passed;

export function reviewItems(chapter, state) {
  const results = state.results[chapter.topic] ?? {};
  return chapter.quiz.filter(q => Object.hasOwn(results, q.id)).map(question => ({
    question,
    passed: results[question.id],
    attempts: state.history?.[chapter.topic]?.[question.id] ?? [results[question.id]],
  }));
}

const codeComments = {
  'aggiornamento protetto fra processi cooperanti': 'Update protected across cooperating processes',
  'eseguire il blocco da misurare': 'Run the block being measured',
  'corpo del metodo protetto dalla risorsa': 'Method body protected by the resource check',
  'controllare sc prima di eseguire': 'Check sc before executing',
  'eseguire query già preparata e consumare i risultati': 'Execute the prepared query and consume its results',
  'trasformazione': 'Transform the input',
  'operazione che può lanciare un’eccezione': 'Operation that may throw an exception',
  'registrare nome, posizione e contesto utile': 'Log the error name, location, and relevant context',
};

export function correctSelection(correct, selected) {
  const chosen = new Set(selected);
  return chosen.size === correct.length && correct.every(value => chosen.has(value));
}

export function practiceQueue(questions, results, mode = 'learn') {
  if (mode === 'repeat') return questions;
  if (mode === 'review') return questions.filter(q => results[q.id] === false);
  return questions.filter(q => !Object.hasOwn(results, q.id));
}

export function chapterStep(chapter, progress) {
  const topic = chapter.topic;
  if (!progress.studied?.[topic]) return 'theory';
  if (practiceQueue(chapter.quiz, progress.results?.[topic] ?? {}).length) return 'quiz';
  if (chapter.cases.some(item => !progress.worked?.[topic]?.[item.file])) return 'cases';
  return null;
}

export function finalQuestionRefs(chapters) {
  const refs = chapters.map(({ topic, quiz }) => ({
    topic, id: quiz[Math.floor(Math.random() * quiz.length)].id,
  }));
  for (let i = refs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [refs[i], refs[j]] = [refs[j], refs[i]];
  }
  return refs;
}

export async function loadCourse(read) {
  const [manifest, exercises] = await Promise.all([
    read('manifest.json').then(JSON.parse),
    read('exercise-focus-content.json').then(JSON.parse),
  ]);
  return Promise.all(manifest.map(async chapter => {
    const exercise = exercises.find(item => item.id === chapter.topic);
    const [rawQuiz, study, illustrated] = await Promise.all([
      read(`originals/quizzes/${chapter.topic}-quiz.json`).then(JSON.parse),
      read(`${chapter.folder}/study.md`),
      read(`${exercise.folder}/tavole-esercizi.md`),
    ]);
    const { questions } = rawQuiz.quiz;
    const sections = studySections(study);
    const diagrams = Array.from(study.matchAll(/^!\[([^\]]+)\]\((visual-guide-[\w-]+\.png)\)$/gm),
      ([, alt, file]) => ({ alt, file: `${chapter.folder}/${file}` }));
    const exerciseDiagrams = Array.from(illustrated.matchAll(/^!\[([^\]]+)\]\(<(schema-esercizi[\w-]*\.png)>\)$/gm),
      ([, alt, file]) => ({ alt, file: `${exercise.folder}/${file}` }));
    const panels = exercisePanels(illustrated);
    if (questions.length !== chapter.questions || sections.length !== chapter.sections ||
        sections.some(section => !section.points.length || !section.prose || !section.references.length) ||
        !exercise.cases.length || exerciseDiagrams.length !== 2 || panels.length < exercise.cases.length) {
      throw new Error(`Incomplete study material for ${chapter.topic}`);
    }
    const cases = exercise.cases.map(({ code, file }, i) => ({
      ...panels[i], file,
      code: code?.replace(/^(\s*; )(.+)$/gm, (_, prefix, comment) => prefix + (codeComments[comment] ?? comment)),
    }));
    return { ...chapter, cases, panels, sections, diagrams, exerciseDiagrams, quiz: questions };
  }));
}
