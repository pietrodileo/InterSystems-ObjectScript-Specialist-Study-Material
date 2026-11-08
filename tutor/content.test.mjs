import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import test from 'node:test';
import { correctSelection, loadCourse, packPath, practiceQueue } from './content.mjs';

test('the real study pack supplies every lesson, question, and worked case', async () => {
  const packFile = path => new URL(packPath(path), import.meta.url);
  const chapters = await loadCourse(path => readFile(packFile(path), 'utf8'));
  assert.equal(chapters.length, 22);
  assert.equal(chapters.flatMap(chapter => chapter.sections).length, 93);
  assert.equal(chapters.flatMap(chapter => chapter.quiz).length, 358);
  assert.equal(chapters.flatMap(chapter => chapter.cases).length, 66);
  assert.equal(chapters.flatMap(chapter => chapter.diagrams).length, 31);
  for (const chapter of chapters) {
    for (const [index, question] of chapter.quiz.entries()) {
      assert.equal(question.id, index + 1);
      assert.ok(['single', 'multiple'].includes(question.type));
      assert.ok(question.correct.length && question.correct.every(i => Number.isInteger(i) && i >= 0 && i < question.options.length));
      assert.equal(new Set(question.correct).size, question.correct.length);
      if (question.type === 'single') assert.equal(question.correct.length, 1);
      assert.ok(question.comment.reason && question.comment.insight && /\?\s*\S/.test(question.comment.challenge));
    }
    for (const { file } of chapter.diagrams) await access(packFile(`${chapter.folder}/${file}`));
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
