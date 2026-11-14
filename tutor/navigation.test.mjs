import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
import { readRoute, routeHref } from './navigation.mjs';
import { loadCourse, packPath, topics } from './content.mjs';

const chapters = await loadCourse(path => readFile(new URL(packPath(path), import.meta.url), 'utf8'));

test('destinations round-trip for pages, areas, chapters, concepts, and diagrams', () => {
  for (const page of ['roadmap', 'index', 'gallery', 'review', 'final', 'profile']) {
    assert.deepEqual(readRoute(routeHref({ page }), chapters, topics), { page });
  }
  assert.deepEqual(readRoute('#area=T3', chapters, topics), { area: 'T3' });
  for (const chapter of chapters) {
    for (const phase of ['theory', 'quiz', 'cases']) {
      const route = { topic: chapter.topic, phase, mode: 'learn' };
      assert.deepEqual(readRoute(routeHref(route), chapters, topics), route);
    }
  }
  for (const extra of [{ section: 0 }, { image: chapters[0].diagrams[0].file }, { mode: 'review' }]) {
    const route = { topic: chapters[0].topic, phase: 'theory', mode: 'learn', ...extra };
    assert.deepEqual(readRoute(routeHref(route), chapters, topics), route);
  }
  assert.deepEqual(readRoute(routeHref({ page: 'past', assessment: 0 }), chapters, topics), { page: 'past', assessment: 0 });
});

test('invalid direct links cannot select unknown material or unsafe indexes', () => {
  for (const hash of ['', '#lesson', '#page=unknown', '#area=__proto__', '#topic=unknown',
    '#topic=T1.1&phase=unknown', '#topic=T1.1&mode=unknown', '#topic=T1.1&section=-1',
    '#topic=T1.1&section=999', '#topic=T1.1&section=', '#topic=T1.1&section=1&phase=quiz',
    '#topic=T1.1&image=../../other.png', '#page=past&assessment=-1', '#page=past']) {
    assert.equal(readRoute(hash, chapters, topics), null, hash);
  }
});

test('all diagrams expose source-backed text alternatives and subject names', async () => {
  const source = await readFile(new URL('./app.mjs', import.meta.url), 'utf8');
  const context = vm.createContext({ markdownText: value => value, packPath, escape: value => String(value)
    .replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;') });
  vm.runInContext(source.slice(source.indexOf('function diagramInline('), source.indexOf('function renderGallery(')), context);
  for (const chapter of chapters) {
    for (const diagram of [...chapter.diagrams, ...chapter.exerciseDiagrams]) {
      assert.ok(diagram.description.length, diagram.file);
      assert.ok(diagram.description.every(text => text.trim()), diagram.file);
      context.diagrams = [diagram];
      const html = vm.runInContext("renderDiagrams(diagrams, 'Exercise diagram')", context);
      assert.ok(html.includes(`aria-label="Open ${context.escape(diagram.caption ?? diagram.alt)}"`));
      assert.ok(!html.includes('Read diagram explanation'));
      assert.ok(html.includes('<template data-diagram-details>'));
      const visibleCaption = html.match(/<figcaption>(.*?)<\/figcaption>/s)[1];
      assert.ok(!visibleCaption.includes('<ul>'));
      assert.ok(visibleCaption.length < 180, diagram.file);
      assert.ok(html.includes('data-diagram-caption'));
      assert.ok(html.includes('<ul data-diagram-explanation>'));
    }
  }
});

 test('multi-topic diagram captions use bullets, code, and escaped source text', async () => {
  const source = await readFile(new URL('./app.mjs', import.meta.url), 'utf8');
  const context = vm.createContext({});
  vm.runInContext(source.slice(source.indexOf('const escape ='), source.indexOf('const leadParagraphs =')) +
    source.slice(source.indexOf('function diagramInline('), source.indexOf('function renderDiagramDescription(')), context);
  const html = vm.runInContext('renderDiagramCaption(' + JSON.stringify(chapters.find(chapter => chapter.topic === 'T1.3').diagrams[1].alt) + ')', context);
  assert.equal((html.match(/<li>/g) ?? []).length, 4);
  assert.ok(html.includes('<code translate="no">##super</code>'));
  assert.ok(html.includes('<code translate="no">ByRef</code>'));
  assert.ok(html.includes('<code translate="no">.variable</code>'));
  assert.ok(vm.runInContext('renderDiagramCaption("<img src=x onerror=alert(1)>")', context).includes('&lt;img'));
  assert.equal(vm.runInContext('diagramInline("Use `##super` and **parent behavior**")', context),
    'Use <code translate="no">##super</code> and <strong>parent behavior</strong>');
});

test('grouped diagrams explain only the sections in their caption', () => {
  const diagrams = chapters.find(chapter => chapter.topic === 'T1.3').diagrams;
  assert.equal(diagrams[0].description.length, 4);
  assert.equal(diagrams[1].description.length, 4);
  assert.ok(diagrams[0].description[0].startsWith('1.'));
  assert.ok(diagrams[1].description[0].startsWith('5.'));
  assert.ok(diagrams[1].description.at(-1).startsWith('8.'));
});
