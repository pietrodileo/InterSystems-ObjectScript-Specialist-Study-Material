import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import vm from 'node:vm';
import { routeHref } from './navigation.mjs';
import { loadCourse, packPath, searchCourse, topics } from './content.mjs';

test('course search retains collapsible area containers and original chapter cards', async () => {
  const chapters = await loadCourse(path => readFile(new URL(packPath(path), import.meta.url), 'utf8'));
  const source = await readFile(new URL('./app.mjs', import.meta.url), 'utf8');
  const nodes = {
    '#course-search': { value: '' }, '#course-overview': {},
    '#course-count': {}, '#course-results': {},
  };
  const context = vm.createContext({
    chapters, topics, searchCourse, routeHref, state: { openTopics: ['T1'], studied: {} },
    lesson: { querySelector: selector => nodes[selector] },
    escape: value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('"', '&quot;'),
    markdownText: value => value, step: () => 'theory', attempted: () => 0,
    completedCases: () => 0, phases: { theory: 'Study' },
  });
  vm.runInContext(source.slice(source.indexOf('function renderHomeChapters('), source.indexOf('function renderCourse()')) +
    source.slice(source.indexOf('function renderCourseResults()'), source.indexOf('function renderDiagrams(')), context);
  vm.runInContext('renderCourseResults()', context);
  assert.equal((nodes['#course-results'].innerHTML.match(/<details class="home-area"/g) ?? []).length, 5);
  assert.equal((nodes['#course-results'].innerHTML.match(/class="nav-link home-chapter-card"/g) ?? []).length, 22);
  assert.equal((nodes['#course-results'].innerHTML.match(/class="home-chapter"/g) ?? []).length, 22);
  assert.equal((nodes['#course-results'].innerHTML.match(/class="chapter-concepts"/g) ?? []).length, 22);
  assert.match(nodes['#course-results'].innerHTML, /class="home-chapter">[\s\S]*?<\/a>\s*<details class="chapter-concepts"/);
  assert.match(nodes['#course-results'].innerHTML, /data-home-area="T1" open/);
  assert.match(nodes['#course-results'].innerHTML, /data-home-area="T2" >?/);
  assert.doesNotMatch(nodes['#course-results'].innerHTML, /data-home-area="T2" open/);
  assert.doesNotMatch(nodes['#course-results'].innerHTML, /Ongoing/);
  context.state.studied[chapters[0].topic] = true;
  vm.runInContext('renderCourseResults()', context);
  assert.equal((nodes['#course-results'].innerHTML.match(/Ongoing/g) ?? []).length, 1);
  context.state.studied = {};
  context.attempted = item => item === chapters[0] ? 1 : 0;
  vm.runInContext('renderCourseResults()', context);
  assert.equal((nodes['#course-results'].innerHTML.match(/Ongoing/g) ?? []).length, 1);
  context.attempted = () => 0;
  context.completedCases = item => item === chapters[0] ? 1 : 0;
  vm.runInContext('renderCourseResults()', context);
  assert.equal((nodes['#course-results'].innerHTML.match(/Ongoing/g) ?? []).length, 1);
  nodes['#course-search'].value = 'storage definitions';
  vm.runInContext('renderCourseResults()', context);
  assert.match(nodes['#course-results'].innerHTML, /<details class="home-area"/);
  assert.match(nodes['#course-results'].innerHTML, /data-section="\d+"/);
  assert.match(nodes['#course-results'].innerHTML, /class="nav-link home-chapter-card"/);
  assert.match(nodes['#course-results'].innerHTML, /class="chapter-concepts" open/);
  context.step = () => null;
  nodes['#course-search'].value = '';
  vm.runInContext('renderCourseResults()', context);
  assert.equal((nodes['#course-results'].innerHTML.match(/class="nav-link home-chapter-card"/g) ?? []).length, 22);
  assert.match(nodes['#course-results'].innerHTML, /Completed/);
  assert.doesNotMatch(nodes['#course-results'].innerHTML, /Ongoing/);
  nodes['#course-search'].value = 'no-such-course-concept-xyz';
  vm.runInContext('renderCourseResults()', context);
  assert.match(nodes['#course-results'].innerHTML, /No chapters or concepts match/);
});
