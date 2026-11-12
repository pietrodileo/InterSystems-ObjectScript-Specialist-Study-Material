import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';
import { loadCourse, packPath, searchCourse, topics } from './content.mjs';

test('course search retains collapsible area containers and original chapter cards', async () => {
  const chapters = await loadCourse(path => readFile(new URL(packPath(path), import.meta.url), 'utf8'));
  const source = await readFile(new URL('./app.mjs', import.meta.url), 'utf8');
  const nodes = {
    '#course-search': { value: '' }, '#course-overview': {},
    '#course-count': {}, '#course-results': {},
  };
  const context = vm.createContext({
    chapters, topics, searchCourse, state: { openTopics: ['T1'] },
    lesson: { querySelector: selector => nodes[selector] },
    escape: value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;'),
    markdownText: value => value, step: () => 'theory', attempted: () => 0,
    completedCases: () => 0, phases: { theory: 'Study' },
  });
  vm.runInContext(source.slice(source.indexOf('function renderHomeChapters('), source.indexOf('function renderCourse()')) +
    source.slice(source.indexOf('function renderCourseResults()'), source.indexOf('function renderDiagrams(')), context);
  vm.runInContext('renderCourseResults()', context);
  assert.equal((nodes['#course-results'].innerHTML.match(/<details class="home-area"/g) ?? []).length, 5);
  assert.equal((nodes['#course-results'].innerHTML.match(/class="home-chapter-card"/g) ?? []).length, 22);
  assert.match(nodes['#course-results'].innerHTML, /data-home-area="T1" open/);
  assert.match(nodes['#course-results'].innerHTML, /data-home-area="T2" >?/);
  assert.doesNotMatch(nodes['#course-results'].innerHTML, /data-home-area="T2" open/);
  nodes['#course-search'].value = 'storage definitions';
  vm.runInContext('renderCourseResults()', context);
  assert.match(nodes['#course-results'].innerHTML, /<details class="home-area"/);
  assert.match(nodes['#course-results'].innerHTML, /data-section="\d+"/);
  assert.match(nodes['#course-results'].innerHTML, /class="home-chapter-card"/);
  assert.match(nodes['#course-results'].innerHTML, /class="reading inset" open/);
  context.step = () => null;
  nodes['#course-search'].value = '';
  vm.runInContext('renderCourseResults()', context);
  assert.equal((nodes['#course-results'].innerHTML.match(/class="home-chapter-card"/g) ?? []).length, 22);
  assert.match(nodes['#course-results'].innerHTML, /Completed/);
  nodes['#course-search'].value = 'no-such-course-concept-xyz';
  vm.runInContext('renderCourseResults()', context);
  assert.match(nodes['#course-results'].innerHTML, /No chapters or concepts match/);
});
