import assert from 'node:assert/strict';
import { open, readFile } from 'node:fs/promises';
import test from 'node:test';
import { assessmentAnswered, assessmentComplete, chapterStep, correctSelection, finalQuestionRefs, loadCourse, packPath, passedAnswer, practiceQueue, quizBlocks, recordPractice, reviewItems } from './content.mjs';

import { caseFocus, guides, variations } from './lesson-guides.mjs';
import { diagramExamples, studyExamples } from './code-examples.mjs';

test('the real study pack supplies every lesson, question, and worked case', async () => {
  const packFile = path => new URL(packPath(path), import.meta.url);
  const chapters = await loadCourse(path => readFile(packFile(path), 'utf8'));
  assert.equal(chapters.length, 22);
  assert.equal(chapters.flatMap(chapter => chapter.sections).length, 93);
  assert.equal(chapters.flatMap(chapter => chapter.quiz).length, 358);
  assert.equal(chapters.flatMap(chapter => chapter.cases).length, 66);
  assert.equal(chapters.flatMap(chapter => chapter.diagrams).length, 31);
  assert.equal(chapters.flatMap(chapter => chapter.exerciseDiagrams).length, 44);
  const studyKeys = chapters.flatMap(chapter => chapter.sections.map((_, i) => `${chapter.topic}/${i + 1}`));
  const diagramKeys = chapters.flatMap(chapter => chapter.panels.slice(chapter.cases.length)
    .map(panel => `${chapter.topic}/${panel.title}`));
  for (const [examples, keys] of [[studyExamples, studyKeys], [diagramExamples, diagramKeys]]) {
    for (const [key, entries] of Object.entries(examples)) {
      assert.ok(keys.includes(key), `Example has no visible section: ${key}`);
      assert.ok(entries.length && entries.every(entry => entry.length === 3 && entry.every(text => text.trim())), key);
    }
  }
  for (const chapter of chapters) {
    assert.ok(studyKeys.some(key => key.startsWith(`${chapter.topic}/`) && studyExamples[key]), chapter.topic);
  }
  const final = finalQuestionRefs(chapters);
  assert.deepEqual(new Set(final.map(ref => ref.topic)), new Set(chapters.map(chapter => chapter.topic)));
  assert.equal(final.length, chapters.length);
  for (const ref of final) assert.ok(chapters.find(chapter => chapter.topic === ref.topic).quiz.some(q => q.id === ref.id));
  for (const chapter of chapters) {
    assert.ok(guides[chapter.topic].every(Boolean));
    assert.equal(caseFocus[chapter.topic].length, chapter.cases.length);
    assert.ok(caseFocus[chapter.topic].every(context => context.trim()));
    assert.equal(variations[chapter.topic].length, chapter.cases.length);
    assert.ok(variations[chapter.topic].every(pair => pair.length === 2 && pair.every(Boolean)));
    assert.equal(chapter.panels.length, 7);
    for (const section of chapter.sections) {
      assert.ok(section.prose.length > 20 && section.references.length);
      assert.ok(section.references.every(({ url }) => new URL(url).origin === 'https://docs.intersystems.com'));
    }
    for (const { qs } of chapter.panels) {
      assert.ok(qs.length && qs.every(id => chapter.quiz.some(q => q.id === id)));
    }
    for (const [index, question] of chapter.quiz.entries()) {
      assert.equal(question.id, index + 1);
      assert.ok(['single', 'multiple'].includes(question.type));
      assert.ok(question.correct.length && question.correct.every(i => Number.isInteger(i) && i >= 0 && i < question.options.length));
      assert.equal(new Set(question.correct).size, question.correct.length);
      if (question.type === 'single') assert.equal(question.correct.length, 1);
      assert.ok(question.explanation.trim());
    }
    if (chapter.topic === 'T1.3') {
      const question = chapter.quiz.find(item => item.id === 2);
      assert.deepEqual(quizBlocks(question.options[0]), [{ text: question.options[0], code: true }]);
    }
    if (chapter.topic === 'T3.1') {
      const { question } = chapter.quiz.find(item => item.id === 15);
      const { table } = quizBlocks(question).find(block => block.table);
      assert.deepEqual(table.head, ['Feature', 'Local Var', 'PPG (^||)', 'Temp Global (^IRIS.Temp.*)', 'Persistent Global']);
      assert.deepEqual(table.rows.map(row => row.at(-1)), ['Database', 'All processes', '?', '?']);
    }
    if (chapter.topic === 'T3.5') {
      const { question } = chapter.quiz.find(item => item.id === 8);
      const blocks = quizBlocks(question);
      assert.ok(blocks.some(block => block.code && block.text.includes('%SYS.PTools')));
      assert.deepEqual(blocks.find(block => block.table).table.rows[0], ['JOIN step', '250,000', '500,000']);
    }
    for (const { file, width, height } of [...chapter.diagrams, ...chapter.exerciseDiagrams]) {
      const image = await open(packFile(file));
      try {
        const { buffer } = await image.read(Buffer.alloc(8), 0, 8, 16);
        assert.deepEqual([width, height], [buffer.readUInt32BE(0), buffer.readUInt32BE(4)], file);
      } finally {
        await image.close();
      }
    }
  }
});

test('quiz blocks distinguish code and prose even without a blank line', () => {
  assert.deepEqual(quizBlocks('The global contains:\n^Log(1) = "Started"\n\nWhat happens next?'), [
    { text: 'The global contains:', code: false },
    { text: '^Log(1) = "Started"', code: true },
    { text: 'What happens next?', code: false },
  ]);
  assert.equal(quizBlocks('Write the result to a log.')[0].code, false);
  assert.equal(quizBlocks('| A | B |\n| one | two |\n| three | four |')[0].table, undefined);
});

test('assessment answers can be saved out of order and require explicit submission', () => {
  const refs = [{}, {}, {}];
  const answer = { passed: false, selected: [0] };
  const final = { refs, answers: [], submitted: false };
  final.answers[2] = answer;
  const resumed = JSON.parse(JSON.stringify(final));
  assert.equal(assessmentAnswered(resumed), 1);
  assert.equal(assessmentComplete(resumed), false);
  resumed.answers[0] = answer;
  resumed.answers[1] = answer;
  assert.equal(assessmentAnswered(resumed), 3);
  assert.equal(assessmentComplete(resumed), false);
  resumed.submitted = true;
  assert.equal(assessmentComplete(resumed), true);
  assert.equal(assessmentComplete({ refs, answers: [false, true, false] }), true);
});

test('multiple answers need an exact match in any order', () => {
  assert.equal(correctSelection([0, 2], [2, 0]), true);
  assert.equal(correctSelection([0, 2], [0]), false);
  assert.equal(correctSelection([0, 2], [0, 1, 2]), false);
  assert.equal(correctSelection([0, 2], [0, 1]), false);
});

test('a resumed quiz skips answered questions and review includes only current misses', () => {
  const questions = [{ id: 1 }, { id: 2 }, { id: 3 }];
  const progress = { 1: true, 2: false };
  assert.deepEqual(practiceQueue(questions, progress), [questions[2]]);
  assert.deepEqual(practiceQueue(questions, progress, 'review'), [questions[1]]);
  progress[2] = true;
  assert.deepEqual(practiceQueue(questions, progress, 'review'), []);
  assert.deepEqual(practiceQueue(questions, progress, 'repeat'), questions);
});

test('progress finds the first unfinished stage, even when later stages were visited', () => {
  const chapter = { topic: 'T1.1', quiz: [{ id: 1 }, { id: 2 }], cases: [{ file: 'case.md' }] };
  const progress = { results: { 'T1.1': { 1: false } }, worked: { 'T1.1': { 'case.md': true } } };
  assert.equal(chapterStep(chapter, progress), 'theory');
  progress.studied = { 'T1.1': true };
  assert.equal(chapterStep(chapter, progress), 'quiz');
  progress.results['T1.1'][2] = true;
  progress.worked['T1.1']['case.md'] = false;
  assert.equal(chapterStep(chapter, progress), 'cases');
  progress.worked['T1.1']['case.md'] = true;
  assert.equal(chapterStep(chapter, progress), null);
});


test('answer history keeps every selection and retains legacy results', () => {
  const topic = 'T1.1';
  const quiz = [{ id: 1 }, { id: 2 }, { id: 3 }];
  const state = { results: { [topic]: { 1: false } }, history: {} };
  const wrong = { selected: [0], passed: false };
  const right = { selected: [0, 2], passed: true };
  assert.deepEqual(reviewItems({ topic, quiz }, state), [
    { question: quiz[0], passed: false, attempts: [false] },
  ]);

  recordPractice(state, topic, 1, right);
  recordPractice(state, topic, 2, wrong);
  recordPractice(state, topic, 2, right);
  const saved = JSON.parse(JSON.stringify(state));
  assert.deepEqual(reviewItems({ topic, quiz }, saved), [
    { question: quiz[0], passed: true, attempts: [false, right] },
    { question: quiz[1], passed: true, attempts: [wrong, right] },
  ]);
  assert.deepEqual(practiceQueue(quiz, saved.results[topic], 'review'), []);
  assert.deepEqual([true, false, wrong, right].map(passedAnswer), [true, false, false, true]);
});
