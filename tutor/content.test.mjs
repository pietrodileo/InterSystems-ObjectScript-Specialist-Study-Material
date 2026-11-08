import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';
import { chapterStep, correctSelection, finalQuestionRefs, loadCourse, packPath, passedAnswer, practiceQueue, recordPractice, reviewItems } from './content.mjs';

import { guides, variations } from './lesson-guides.mjs';

test('the real study pack supplies every lesson, question, and worked case', async () => {
  const packFile = path => new URL(packPath(path), import.meta.url);
  const chapters = await loadCourse(path => readFile(packFile(path), 'utf8'));
  assert.equal(chapters.length, 22);
  assert.equal(chapters.flatMap(chapter => chapter.sections).length, 93);
  assert.equal(chapters.flatMap(chapter => chapter.quiz).length, 358);
  assert.equal(chapters.flatMap(chapter => chapter.cases).length, 66);
  assert.equal(chapters.flatMap(chapter => chapter.diagrams).length, 31);
  assert.equal(chapters.flatMap(chapter => chapter.exerciseDiagrams).length, 44);
  const final = finalQuestionRefs(chapters);
  assert.deepEqual(new Set(final.map(ref => ref.topic)), new Set(chapters.map(chapter => chapter.topic)));
  assert.equal(final.length, chapters.length);
  for (const ref of final) assert.ok(chapters.find(chapter => chapter.topic === ref.topic).quiz.some(q => q.id === ref.id));
  for (const chapter of chapters) {
    assert.ok(guides[chapter.topic].every(Boolean));
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
    for (const { file } of [...chapter.diagrams, ...chapter.exerciseDiagrams]) await access(packFile(file));
  }
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
