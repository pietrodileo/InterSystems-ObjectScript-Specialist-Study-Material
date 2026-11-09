import { assessmentAnswered, assessmentComplete, chapterStep, correctSelection, finalQuestionRefs, loadCourse, packPath, passedAnswer, practiceQueue, quizBlocks, recordPractice, reviewItems, topics } from './content.mjs?v=practice-feedback-1';
import { caseFocus, examAreaDescriptions, guides, variations } from './lesson-guides.mjs?v=practice-feedback-1';
import { diagramExamples, studyExamples } from './code-examples.mjs';
import './sidebar-controls.mjs';

const lesson = document.querySelector('#lesson');
const nav = document.querySelector('#chapters');
const courseMenu = document.querySelector('#course-menu');
const sidebar = document.querySelector('#course');
const sidebarToggle = document.querySelector('#sidebar-toggle');
const sidebarBrand = sidebarToggle.parentElement;
const sidebarHeader = sidebarBrand.parentElement;
const mobileMenu = window.matchMedia('(max-width: 720px)');
const exportProgress = document.querySelector('#export-progress');
const importProgress = document.querySelector('#import-progress');
const progressFile = document.querySelector('#progress-file');
const transferStatus = document.querySelector('#progress-transfer-status');
const storageKey = 'objectscript-tutor-v1';
const profileStorageKey = 'objectscript-tutor-profile-v1';
const phases = { theory: 'Study', quiz: 'Practice', cases: 'Apply' };
const escape = value => String(value).replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[char]);
const paragraph = text => `<p class="prose">${escape(text)}</p>`;
const markdownText = value => escape(value.replaceAll('&lt;', '<').replaceAll('&gt;', '>'))
  .replace(/`([^`]+)`/g, '<code translate="no">$1</code>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
const leadParagraphs = value => value.trim().split(/\n\s*\n/).map(block => `<p class=\"lead\">${markdownText(block.replace(/\s*\n\s*/g, ' '))}</p>`).join('');
const link = (url, label) => `<a href="${escape(url)}" target="_blank" rel="noopener">${markdownText(label)} ↗</a>`;
const letter = index => String.fromCharCode(65 + index);

let state = {};
let storageWorks = true;
try {
  state = JSON.parse(localStorage.getItem(storageKey)) || {};
} catch {
  storageWorks = false;
}
let profile = { firstName: '', lastName: '', role: '' };
let profileStatus = '';
try {
  const savedProfile = JSON.parse(localStorage.getItem(profileStorageKey));
  if (savedProfile && typeof savedProfile === 'object' && !Array.isArray(savedProfile)) {
    profile = Object.fromEntries(['firstName', 'lastName', 'role']
      .map(key => [key, typeof savedProfile[key] === 'string' ? savedProfile[key] : '']));
  }
} catch {
  // A missing or unavailable profile should not prevent the tutor from loading.
}
state.results ||= {};
state.studied ||= {};
state.worked ||= {};
state.history ||= {};
state.assessments ||= [];
state.openTopics ??= [state.topic?.split('.')[0] ?? 'T1'];

let chapters, chapter, phase, cursor, practiceMode, drafts, checked;
const results = item => state.results[item.topic] ?? {};
const attempted = item => item.quiz.filter(q => Object.hasOwn(results(item), q.id)).length;
const missed = item => item.quiz.filter(q => results(item)[q.id] === false).length;
const step = item => chapterStep(item, state);
const nextChapter = () => chapters.find(step);
const completedCases = item => item.cases.filter(exercise => state.worked[item.topic]?.[exercise.file]).length;

function save() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(state));
    storageWorks = true;
  } catch {
    storageWorks = false;
  }
}

function setSidebarOpen(open) {
  sidebar.hidden = !open;
  const label = open ? 'Collapse course index' : 'Expand course index';
  sidebarToggle.setAttribute('aria-expanded', String(open));
  if (mobileMenu.matches) {
    sidebarToggle.removeAttribute('aria-label');
    sidebarToggle.removeAttribute('title');
  } else {
    sidebarToggle.setAttribute('aria-label', label);
    sidebarToggle.title = label;
  }
}

function syncSidebarLayout() {
  const open = !mobileMenu.matches && (state.sidebarOpen ?? true);
  const focused = document.activeElement;
  if (mobileMenu.matches) sidebarHeader.append(sidebarToggle);
  else sidebarBrand.prepend(sidebarToggle);
  setSidebarOpen(open);
  if (focused === sidebarToggle || (!open && sidebar.contains(focused))) {
    sidebarToggle.focus({ preventScroll: true });
  }
}

syncSidebarLayout();
mobileMenu.addEventListener('change', syncSidebarLayout);
sidebarToggle.addEventListener('click', () => {
  const open = sidebar.hidden;
  setSidebarOpen(open);
  if (!mobileMenu.matches) {
    state.sidebarOpen = open;
    save();
  }
});

function renderNavigation() {
  const seen = chapters.reduce((sum, item) => sum + attempted(item), 0);
  const total = chapters.reduce((sum, item) => sum + item.quiz.length, 0);
  const errors = chapters.reduce((sum, item) => sum + missed(item), 0);
  const done = chapters.filter(item => !step(item)).length;
  const progress = document.querySelector('#progress');
  progress.max = total;
  progress.value = seen;
  document.querySelector('#progress-label').textContent =
    `${done}/${chapters.length} chapters complete. ${seen}/${total} quiz questions answered.${errors ? ` ${errors} to review.` : ''}${storageWorks ? '' : ' Progress could not be saved in this browser.'}`;
  courseMenu.innerHTML = Object.entries({ roadmap: 'Home', review: 'Answer review', final: 'Final assessment' }).map(([page, label]) =>
    `<button type="button" data-course="${page}" ${phase === page ? 'aria-current="page"' : ''}>${label}</button>`).join('');
  const activeArea = phase === 'area' ? state.area : chapter?.topic.split('.')[0];
  nav.innerHTML = Object.entries(topics).map(([code, name]) => {
    const group = chapters.filter(item => item.topic.startsWith(`${code}.`));
    const completed = group.filter(item => !step(item)).length;
    return `<button type="button" class="area-nav-button" data-area="${escape(code)}" ${activeArea === code ? 'aria-current="page"' : ''}>
      <span class="area-nav-code">${escape(code)}</span>
      <span class="area-nav-copy"><strong>${escape(name)}</strong><small>${completed}/${group.length} chapters complete</small></span>
    </button>`;
  }).join('');
}

function openChapter(item, nextPhase = step(item) ?? 'theory', mode = 'learn', questionId) {
  chapter = item;
  phase = nextPhase;
  practiceMode = mode;
  const first = questionId ?? practiceQueue(chapter.quiz, results(chapter), mode)[0]?.id;
  cursor = Math.max(0, chapter.quiz.findIndex(question => question.id === first));
  drafts = new Map();
  checked = new Map();
  const area = chapter.topic.split('.')[0];
  if (state.topic !== chapter.topic && !state.openTopics.includes(area)) state.openTopics.push(area);
  state.topic = chapter.topic;
  state.phase = phase;
  save();
  render();
}

function openCourse(page) {
  chapter = null;
  phase = page;
  state.phase = page;
  save();
  render();
}

function openArea(code) {
  if (!Object.hasOwn(topics, code)) return;
  chapter = null;
  phase = 'area';
  state.area = code;
  state.phase = 'area';
  save();
  render();
}

function continueCourse() {
  const next = nextChapter();
  if (next) openChapter(next);
  else openCourse('final');
}

function focusLesson() {
  lesson.querySelector('h1')?.focus({ preventScroll: true });
  window.scrollTo(0, 0);
}

function render() {
  renderNavigation();
  if (!chapter) {
    renderCourse();
    focusLesson();
    return;
  }
  const number = chapters.indexOf(chapter) + 1;
  lesson.innerHTML = `
    <header class="lesson-header">
      <h1 tabindex="-1">${escape(chapter.title.split(': ')[1])}</h1>
      <p class="chapter-location">${escape(topics[chapter.topic.split('.')[0]])} / ${chapter.topic} / Chapter ${number} of ${chapters.length}</p>
      ${phase === 'theory' ? leadParagraphs(guides[chapter.topic][0]) : ''}
    </header>
    <nav class="phases" aria-label="Chapter steps">
      ${Object.entries(phases).map(([id, label], i) => `
        <button type="button" data-phase="${id}" ${phase === id ? 'aria-current="step"' : ''}><span>${i + 1}</span> ${label}</button>
      `).join('')}
    </nav>
    <section id="panel" class="panel"></section>`;
  const panel = document.querySelector('#panel');
  if (phase === 'theory') renderTheory(panel);
  if (phase === 'quiz') renderQuiz(panel);
  if (phase === 'cases') renderCases(panel);
  focusLesson();
}

function renderHomeChapters() {
  const sections = Object.entries(topics).map(([code, name]) => {
    const group = chapters.filter(item => item.topic.startsWith(`${code}.`));
    const unfinished = group.filter(item => step(item));
    if (!unfinished.length) return '';
    const completedCount = group.length - unfinished.length;
    const isOpen = state.openTopics.includes(code);
    return `<details class="home-area" data-home-area="${escape(code)}" ${isOpen ? 'open' : ''}>
      <summary class="home-area-summary">
        <span class="home-area-title">${escape(code)} · ${escape(name)}</span>
        <small>${completedCount}/${group.length} complete</small>
      </summary>
      <div class="home-chapter-list">
        ${unfinished.map(item => {
          const currentStep = step(item);
          const answered = attempted(item);
          const casesDone = completedCases(item);
          const title = item.title.split(': ').slice(1).join(': ');
          return `<button type="button" class="home-chapter-card" data-topic="${escape(item.topic)}">
            <span class="home-chapter-code">${escape(item.topic)}</span>
            <strong class="home-chapter-title">${escape(title)}</strong>
            <span class="home-chapter-open" aria-hidden="true">Open →</span>
            <small class="home-chapter-status">${phases[currentStep]} · ${answered}/${item.quiz.length} questions answered · ${casesDone}/${item.cases.length} cases complete</small>
          </button>`;
        }).join('')}
      </div>
    </details>`;
  }).join('');
  const allComplete = chapters.every(item => !step(item));
  return `<section class="home-chapters">
    <h2>Chapters to complete</h2>
    <p class="muted">All unfinished chapters are listed here. Choose any one to work on its current step.</p>
    ${allComplete
      ? `<div class="home-all-complete"><p>All chapters are complete. The final assessment is ready.</p><button type="button" class="primary" data-course="final">Start final assessment</button></div>`
      : sections}
  </section>`;
}
function renderCourse() {
  if (phase === 'area' && Object.hasOwn(topics, state.area)) {
    const code = state.area;
    const group = chapters.filter(item => item.topic.startsWith(`${code}.`));
    lesson.innerHTML = `
      <header class="lesson-header">
        <p class="chapter-location">Exam area · ${escape(code)}</p>
        <h1 tabindex="-1">${escape(topics[code])}</h1>
        <p class="lead">${escape(examAreaDescriptions[code] ?? '')}</p>
      </header>
      <section class="area-chapter-list" aria-label="${escape(topics[code])} chapters">
        ${group.map(item => {
          const number = chapters.indexOf(item) + 1;
          const currentStep = step(item);
          const completed = currentStep === null;
          const status = completed
            ? '<span class="completion-badge"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="m3 8 3 3 7-7"></path></svg>Completed</span>'
            : phases[currentStep];
          const title = item.title.split(': ').slice(1).join(': ');
          return `<button type="button" class="area-chapter-card${completed ? ' is-complete' : ''}" data-topic="${escape(item.topic)}">
            <span class="area-chapter-heading"><b>${escape(item.topic)}</b><strong>${escape(title)}</strong></span>
            <span class="area-chapter-status">Chapter ${number} of ${chapters.length} · ${status}</span>
          </button>`;
        }).join('')}
      </section>`;
    return;
  }
  if (phase === 'profile') {
    lesson.innerHTML = `
      <header class="lesson-header">
        <h1 tabindex="-1">Your profile</h1>
        <p class="lead">Add a few details to make your study space feel more like yours.</p>
      </header>
      <form id="profile-form" class="panel profile-panel">
        <div class="profile-fields">
          <label>First name
            <input name="firstName" type="text" autocomplete="given-name" maxlength="60" value="${escape(profile.firstName ?? '')}" required>
          </label>
          <label>Last name <span class="muted">(optional)</span>
            <input name="lastName" type="text" autocomplete="family-name" maxlength="60" value="${escape(profile.lastName ?? '')}">
          </label>
          <label class="profile-role">Role <span class="muted">(optional)</span>
            <input name="role" type="text" autocomplete="organization-title" maxlength="80" value="${escape(profile.role ?? '')}" placeholder="e.g. Software engineer">
          </label>
        </div>
        <p class="muted profile-note">These details are saved in this browser, personalize the home page, and are included in your backup.</p>
        <div class="actions"><button type="submit" class="primary">Save profile</button></div>
        <p class="profile-status" role="status" aria-live="polite">${escape(profileStatus)}</p>
      </form>`;
    return;
  }
  if (phase === 'review') {
    renderReview();
    return;
  }
  if (phase === 'final' || phase === 'past') {
    lesson.innerHTML = `
      <header class="lesson-header">
        <h1 tabindex="-1">Final assessment</h1>
        <p class="lead">Answer one question from each chapter in shuffled order. Review your answers when you finish.</p>
      </header>
      <section id="panel" class="panel"></section>`;
    const panel = document.querySelector('#panel');
    if (phase === 'past') renderAssessmentSummary(panel, state.assessments[state.assessmentIndex]);
    else renderFinal(panel);
    return;
  }

  lesson.innerHTML = `
    <header class="lesson-header home-header">
      <div class="home-heading">
        <h1 tabindex="-1">${profile.firstName ? `Hi, ${escape(profile.firstName)}` : 'Welcome to your study space'}</h1>
        <button type="button" class="home-settings-button" data-course="profile" aria-label="Edit profile" title="Edit profile">
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <circle cx="12" cy="12" r="3"></circle>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.1a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.1a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.08a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.1a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.08a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.1a1.65 1.65 0 0 0-1.5 1z"></path>
          </svg>
        </button>
      </div>
      <p class="lead">${profile.role
        ? `Your InterSystems ObjectScript Specialist course is ready when you are. Role: ${escape(profile.role)}.`
        : `Your InterSystems ObjectScript Specialist course is ready whenever you are.`}</p>
    </header>
    <section class="panel study-outline">
      <h2>The five exam areas</h2>
      <ul class="exam-areas">${Object.entries(topics).map(([code, name]) => {
        const group = chapters.filter(item => item.topic.startsWith(`${code}.`));
        return `<li>
          <span class="topic-code">${escape(code)}</span>
          <strong>${escape(name)}</strong>
          <span class="muted">${group.filter(item => !step(item)).length}/${group.length} chapters complete</span>
          <span class="muted exam-area-description">${escape(examAreaDescriptions[code])}</span>
        </li>`;
      }).join('')}</ul>
      ${renderHomeChapters()}
      <h2>How each chapter works</h2>
      <ol class="roadmap">
        <li><strong>Study.</strong> Read the chapter overview, use the diagrams, and open concepts for explanations, code examples, and official references.</li>
        <li><strong>Practice.</strong> Answer the chapter quiz, read why each answer is right or wrong, and retry missed questions from Answer review.</li>
        <li><strong>Apply.</strong> Work through each case and try its variation before opening the solution. Check off the case when you finish.</li>
      </ol>
      <p>After the final assessment, use Answer review to decide what to revisit.</p>
      <div class="actions"><button type="button" data-course="review">Open answer review</button></div>
    </section>`;
}

function renderDiagrams(diagrams, label) {
  return `<div class="diagrams">${diagrams.map(({ alt, file, width, height }, index) => {
    const url = escape(packPath(file));
    return `<figure><a href="${url}" target="_blank" rel="noopener" data-image-viewer aria-haspopup="dialog" aria-controls="image-viewer" aria-label="Open ${label.toLowerCase()} ${index + 1}">
      <img src="${url}" alt="${escape(alt)}" width="${width}" height="${height}" loading="lazy">
    </a><figcaption>${label} ${index + 1}. Select the image to zoom or download it.</figcaption></figure>`;
  }).join('')}</div>`;
}


function renderStudyNotes(markdown, diagrams) {
  if (!markdown?.trim()) return '';
  const lines = markdown.trim().split(/\r?\n/);
  const html = [];
  const inline = value => escape(value)
    .replace(/\x60([^\x60]+)\x60/g, '<code translate="no">$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,
      (_, label, url) => '<a href="' + escape(url) + '" target="_blank" rel="noopener">' + escape(label) + ' ↗</a>');
  const cells = line => line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map(cell => cell.trim());
  const tableSeparator = line => /^\|.*\|$/.test(line.trim()) &&
    cells(line).every(cell => /^:?-{3,}:?$/.test(cell));
  const isBlockStart = index => /^(\x60{3}|#{1,6}\s|[-*]\s|\d+\.\s|\|.*\|$|!\[)/.test(lines[index].trim());
  for (let i = 0; i < lines.length;) {
    const line = lines[i].trim();
    if (!line) { i++; continue; }
    if (line.startsWith('\x60\x60\x60')) {
      const code = [];
      i++;
      while (i < lines.length && !lines[i].trim().startsWith('\x60\x60\x60')) code.push(lines[i++]);
      if (i < lines.length) i++;
      html.push('<pre><code translate="no">' + escape(code.join('\n')) + '</code></pre>');
      continue;
    }
    const heading = line.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      const tag = heading[1].length >= 4 ? 'h4' : 'h3';
      html.push('<' + tag + '>' + inline(heading[2]) + '</' + tag + '>');
      i++;
      continue;
    }
    const image = line.match(/^!\[[^\]]+\]\((visual-guide-[\w-]+\.png)\)$/);
    const diagram = image && diagrams.find(({ file }) => file.endsWith(`/${image[1]}`));
    if (diagram) {
      html.push(renderDiagrams([diagram], 'Worked diagram'));
      i++;
      continue;
    }
    if (i + 1 < lines.length && /^\|.*\|$/.test(line) && tableSeparator(lines[i + 1])) {
      const header = cells(line);
      i += 2;
      const rows = [];
      while (i < lines.length && /^\|.*\|$/.test(lines[i].trim())) rows.push(cells(lines[i++]));
      html.push('<div class="study-table-wrap"><table><thead><tr>' +
        header.map(cell => '<th scope="col">' + inline(cell) + '</th>').join('') +
        '</tr></thead><tbody>' + rows.map(row =>
          '<tr>' + row.map(cell => '<td>' + inline(cell) + '</td>').join('') + '</tr>').join('') +
        '</tbody></table></div>');
      continue;
    }
    if (/^[-*]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        items.push('<li>' + inline(lines[i++].trim().replace(/^[-*]\s+/, '')) + '</li>');
      }
      html.push('<ul>' + items.join('') + '</ul>');
      continue;
    }
    if (/^\d+\.\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push('<li>' + inline(lines[i++].trim().replace(/^\d+\.\s+/, '')) + '</li>');
      }
      html.push('<ol>' + items.join('') + '</ol>');
      continue;
    }
    const paragraphLines = [line];
    i++;
    while (i < lines.length && lines[i].trim() && !isBlockStart(i)) paragraphLines.push(lines[i++].trim());
    html.push('<p>' + inline(paragraphLines.join(' ')) + '</p>');
  }
  return '<div class="study-notes">' + html.join('') + '</div>';
}

function renderCodeExamples(examples) {
  return examples.map(([title, code, observation]) => `
    <figure class="code-example">
      <figcaption>${escape(title)}</figcaption>
      <pre><code translate="no">${escape(code)}</code></pre>
      ${observation ? `<p>${markdownText(observation)}</p>` : ''}
    </figure>`).join('');
}

function renderTheory(panel) {
  panel.innerHTML = `
    <h2 tabindex="-1">Chapter diagrams</h2>
    ${renderDiagrams(chapter.diagrams, 'Study diagram')}
    <div class="sections">${chapter.sections.map((section, i) => {
      const examples = studyExamples[`${chapter.topic}/${i + 1}`] ?? [];
      const exampleSummary = examples.length
        ? `${examples.length === 1 ? 'Worked example' : `${examples.length} worked examples`} · ${examples[0][0]} · full notes and examples`
        : `${section.noteExampleCount} code ${section.noteExampleCount === 1 ? 'example' : 'examples'} in the full explanation`;
      return `
      <details class="reading" ${i === 0 ? 'open' : ''}>
        <summary><span>${markdownText(section.title)}
          <small class="summary-note">${escape(exampleSummary)}</small>
        </span></summary>
        <div class="disclosure-body">
          <p>${markdownText(section.prose)}</p>
          <ul>${section.points.map(point => `<li>${markdownText(point)}</li>`).join('')}</ul>
          ${renderCodeExamples(examples)}
          <details class="reading inset" ${examples.length ? '' : 'open'}>
            <summary>Full explanation and ${section.noteExampleCount} ${section.noteExampleCount === 1 ? 'code example' : 'code examples'}</summary>
            <div class="disclosure-body">${renderStudyNotes(section.detail, chapter.diagrams)}</div>
          </details>
          <div class="documentation">
            <h3>Official documentation</h3>
            <ul>${section.references.map(({ url, label }) => `<li>${link(url, label)}</li>`).join('')}</ul>
          </div>
        </div>
      </details>`;
    }).join('')}</div>
    <section class="controls-panel" aria-labelledby="chapter-controls-title">
      <h3 id="chapter-controls-title">Chapter controls</h3>
      <div class="controls-row">
        <button type="button" class="primary" data-phase="quiz" data-study>${state.studied[chapter.topic] ? 'Go to quiz' : 'Mark as studied and start quiz'}</button>
        <a class="button-link" href="${escape(packPath(`${chapter.folder}/study.md`))}" download="${escape(chapter.topic)}-study-notes.md">Download chapter notes (.md)</a>
      </div>
    </section>`;
}

function answerOptions(question, selected) {
  return `<ul>${selected.map(index => `<li><strong>${letter(index)}.</strong> ${quizText(question.options[index])}</li>`).join('')}</ul>`;
}

function questionPrompt(question) {
  const lines = question.question.trim().split('\n');
  return lines.findLast(line => line.includes('?'))?.trim() || 'Open question';
}

function renderPracticeReferences() {
  const exampleCount = chapter.quiz.filter(question => question.feedback.example).length;
  const diagramCount = chapter.quiz.filter(question => question.feedback.diagram).length;
  const questions = chapter.quiz.map(question => {
    const { explanation, example, references, diagram } = question.feedback;
    const text = explanation.split('\n\n').map(part => '<p>' + quizInline(part) + '</p>').join('');
    const code = example ? renderCodeExamples([[example.title, example.code, example.note]]) : '';
    const docs = references.map(({ label, url }) => '<li>' + link(url, label) + '</li>').join('');
    const image = diagram ? '<h4>Related diagram</h4>' + renderDiagrams([diagram], 'Practice diagram') : '';
    return '<details class="reading inset apply-question-reference" data-apply-reference="' + question.id + '">' +
      '<summary>Q' + question.id + ' · ' + escape(questionPrompt(question)) + '</summary>' +
      '<div class="disclosure-body">' +
        '<h4>Practice question</h4><div class="prompt quiz-text">' + quizText(question.question, true) + '</div>' +
        '<h4>Why the answer is correct</h4>' + text + code +
        '<h4>Official documentation</h4><ul>' + docs + '</ul>' + image +
      '</div></details>';
  }).join('');
  const counts = chapter.quiz.length + ' questions' +
    (exampleCount ? ' · ' + exampleCount + ' code examples' : '') +
    (diagramCount ? ' · ' + diagramCount + ' diagrams' : '');
  return '<details class="reading apply-question-reference-group">' +
    '<summary><span>Practice explanations, examples and sources<small class="summary-note">' + counts + '</small></span></summary>' +
    '<div class="disclosure-body">' +
      '<p>Question-by-question explanations from Practice are collected here for review. Open a question to see why the answer is correct, its code example when available, links to the official documentation, and its related diagram.</p>' +
      questions +
    '</div></details>';
}

function questionExplanation(question) {
  const { explanation, example, references, diagram } = question.feedback;
  return `
    <h3>Answer explanation</h3>
    ${explanation.split('\n\n').map(paragraph => `<p>${quizInline(paragraph)}</p>`).join('')}
    ${example ? renderCodeExamples([[example.title, example.code, example.note]]) : ''}
    <h3>Official documentation</h3>
    <ul>${references.map(({ label, url }) => `<li>${link(url, label)}</li>`).join('')}</ul>
    ${diagram ? `<details class="reading inset">
      <summary>See the practice diagram</summary>
      <div class="disclosure-body">${renderDiagrams([diagram], 'Practice diagram')}</div>
    </details>` : ''}`;
}

function answerDetails(question, attempts) {
  const last = attempts.at(-1);
  const passed = passedAnswer(last);
  const outcome = passed ? 'Correct' : 'Incorrect';
  const recovered = passed && attempts.some(attempt => !passedAnswer(attempt));
  const prompt = questionPrompt(question);
  return `<details class="reading">
    <summary>Q${question.id} · ${outcome}${recovered ? ' on retry' : ''} · ${escape(prompt)}</summary>
    <div class="disclosure-body">
      <div class="prompt quiz-text">${quizText(question.question, true)}</div>
      <h3>Your answers</h3>
      <ol class="attempts">${attempts.map(attempt => `<li>
        <strong class="${passedAnswer(attempt) ? 'correct-text' : 'incorrect-text'}">${passedAnswer(attempt) ? 'Correct' : 'Incorrect'}</strong>
        ${typeof attempt === 'boolean' ? ' · Earlier result. The selected options were not recorded.' : answerOptions(question, attempt.selected)}
      </li>`).join('')}</ol>
      <h3>Expected answer</h3>
      ${answerOptions(question, question.correct)}
      ${questionExplanation(question)}
      ${chapter && chapter.quiz.includes(question) ? '<p class="muted">This explanation is also collected in Apply.</p><button type="button" data-phase="cases" data-apply-question="' + question.id + '">Find this explanation in Apply</button>' : ''}
    </div>
  </details>`;
}

function renderReview() {
  const groups = chapters.map(item => ({ item, answers: reviewItems(item, state), errors: missed(item) }))
    .sort((a, b) => b.errors - a.errors);
  const answered = groups.reduce((total, group) => total + group.answers.length, 0);
  const errors = groups.reduce((total, group) => total + group.errors, 0);
  const total = chapters.reduce((count, item) => count + item.quiz.length, 0);
  lesson.innerHTML = `
    <header class="lesson-header">
      <h1 tabindex="-1">Answer review</h1>
      <p class="lead">Compare your choices with the answers and see which chapters need another look.</p>
    </header>
    <section class="panel">
      <h2 tabindex="-1">Chapter quiz results</h2>
      <p class="result-line"><strong class="correct-text">${answered - errors} correct</strong>
        <strong class="incorrect-text">${errors} incorrect</strong><span>${total - answered} unanswered</span></p>
      <p>The totals count your latest answer to each question. Chapters with the most mistakes appear first. Open any question to see every attempt.</p>
      ${!answered ? '<p>No quiz answers yet. Start a chapter quiz to build your review list.</p>' : ''}
      ${groups.filter(group => group.answers.length).map(({ item, answers, errors }) => `<details class="reading">
        <summary>${escape(item.title)} · ${answers.length - errors} correct · ${errors} incorrect · ${item.quiz.length - answers.length} unanswered</summary>
        <div class="disclosure-body">
          <div class="actions">
            <button type="button" data-topic="${item.topic}" data-phase="theory">Review theory</button>
            ${errors ? `<button type="button" data-topic="${item.topic}" data-phase="quiz" data-mode="review">Retry missed questions</button>` : ''}
          </div>
          ${[...answers].sort((a, b) => Number(a.passed) - Number(b.passed))
            .map(({ question, attempts }) => answerDetails(question, attempts)).join('')}
        </div>
      </details>`).join('')}
      <div class="actions">
        <button type="button" data-course="roadmap">Back to study plan</button>
        <button type="button" data-course="final">Final assessment results</button>
      </div>
      ${state.assessments.length ? `<h3>Past assessments</h3>
        <ol class="roadmap">${state.assessments.map((final, index) => `<li><button type="button" data-assessment="${index}">
          Attempt ${index + 1} · ${final.answers.filter(passedAnswer).length}/${final.refs.length} correct
        </button></li>`).join('')}</ol>` : ''}
    </section>`;
}

function quizInline(text) {
  const parts = text.split(/(##class\([^)]+\)(?:\.[%\w]+)*|(?:\${1,3}|%|\^(?:\|\|)?|\.\.?#?)[A-Za-z]\w*(?:\.\w+)*\*?|<[A-Z]+>)/g);
  return parts.map((part, i) => i % 2 ? `<code translate="no">${escape(part)}</code>` : escape(part)).join('');
}

function quizText(text, allowTables = false) {
  return quizBlocks(text).map(block => {
    if (allowTables && block.table) {
      const { head, rows } = block.table;
      return `<div class="quiz-table" role="region" aria-label="Question table" tabindex="0"><table>
        <thead><tr>${head.map(cell => `<th scope="col">${quizInline(cell)}</th>`).join('')}</tr></thead>
        <tbody>${rows.map(([label, ...cells]) => `<tr><th scope="row">${quizInline(label)}</th>
          ${cells.map(cell => `<td>${quizInline(cell)}</td>`).join('')}</tr>`).join('')}</tbody>
      </table></div>`;
    }
    if (block.code) return `<code class="quiz-code" translate="no">${escape(block.text)}</code>`;
    return `<span class="quiz-prose">${quizInline(block.text)}</span>`;
  }).join('');
}

function practiceAnswer(id) {
  return checked.get(id) ?? (practiceMode === 'learn' ? state.history[chapter.topic]?.[id]?.at(-1) : undefined);
}

function renderQuestionNav(panel, final) {
  const questions = final ? final.refs : chapter.quiz;
  const index = final ? final.cursor : cursor;
  const count = final ? assessmentAnswered(final) : attempted(chapter);
  const errors = final ? 0 : missed(chapter);
  panel.querySelector('.question-picker').innerHTML = `
    <p class="session-status">${count} of ${questions.length} answered${errors ? ` · ${errors} to review` : ''}</p>
    <div class="question-numbers">${questions.map((item, i) => {
      const answered = final ? final.answers[i] != null : Object.hasOwn(results(chapter), item.id);
      const needsReview = !final && results(chapter)[item.id] === false;
      const number = final ? i + 1 : item.id;
      const status = needsReview ? 'to review' : answered ? 'answered' : '';
      return `<button type="button" data-question="${i}" ${i === index ? 'aria-current="step"' : ''}
        class="${needsReview ? 'needs-review' : answered ? 'answered' : ''}" aria-label="Question ${number}${status ? `, ${status}` : ''}">${number}</button>`;
    }).join('')}</div>`;
  if (final) panel.querySelector('[data-finish-final]').disabled = count !== questions.length;
}

function renderQuizSummary(panel) {
  const errors = missed(chapter);
  const remaining = chapter.quiz.length - attempted(chapter);
  panel.innerHTML = `
    <h2 tabindex="-1">Chapter quiz summary</h2>
    <p>${attempted(chapter)} of ${chapter.quiz.length} questions answered.
      ${errors ? `${errors} to review.` : remaining ? '' : 'All of your latest answers are correct.'}
    </p>
    <div class="actions">
      <button type="button" class="primary" data-question="${cursor}">Back to questions</button>
      ${errors ? '<button type="button" data-phase="quiz" data-mode="review">Retry missed questions</button>' : ''}
      <button type="button" data-phase="cases">Open worked cases</button>
      <button type="button" data-course="review">Open answer review</button>
      ${!remaining ? '<button type="button" data-phase="quiz" data-mode="repeat">Retake full quiz</button>' : ''}
      ${!errors && chapters.some(missed) ? '<button type="button" data-review-next>Review next chapter</button>' : ''}
    </div>`;
  focusQuestion(panel);
}

function focusQuestion(panel) {
  const heading = panel.querySelector('h2');
  heading.focus({ preventScroll: true });
  panel.scrollIntoView({ block: 'start' });
}

function renderQuiz(panel, final = null) {
  const index = final ? final.cursor : cursor;
  const ref = final?.refs[index];
  const item = ref ? chapters.find(candidate => candidate.topic === ref.topic) : chapter;
  const question = ref ? item.quiz.find(q => q.id === ref.id) : item.quiz[index];
  const { id, options, type, correct } = question;
  const attempt = final ? final.answers[index] : drafts.has(id) ? undefined : practiceAnswer(id);
  const selected = attempt?.selected ?? (final ? [] : drafts.get(id) ?? []);
  const graded = !final && attempt !== undefined;
  const inputType = type === 'multiple' ? 'checkbox' : 'radio';

  panel.innerHTML = `
    <nav class="question-picker" aria-label="Jump to question"></nav>
    <div class="question-meta">
      <h2 tabindex="-1">Question ${final ? index + 1 : id}</h2>
      ${!final && practiceMode !== 'review' && missed(chapter) ? '<button type="button" data-phase="quiz" data-mode="review">Retry missed questions</button>' : ''}
    </div>
    <div class="question-prompt quiz-text">${quizText(question.question, true)}</div>
    <form autocomplete="off">
      <fieldset ${graded ? 'disabled' : ''}>
        <legend>${type === 'multiple' ? 'Select all correct answers.' : 'Select one answer.'}</legend>
        ${options.map((option, i) => `<label class="option">
          <input type="${inputType}" name="option" value="${i}" ${selected.includes(i) ? 'checked' : ''}>
          <span class="letter">${letter(i)}</span><span class="quiz-text">${quizText(option)}</span>
        </label>`).join('')}
      </fieldset>
      <p class="validation" role="alert"></p>
      ${graded ? `<section class="feedback ${passedAnswer(attempt) ? 'passed' : 'retry'}">
        <p class="feedback-status" tabindex="-1">${passedAnswer(attempt) ? 'Correct' : 'Incorrect'}. Expected ${correct.map(letter).join(', ')}.</p>
        ${questionExplanation(question)}
      </section>` : ''}
      <section class="controls-panel" aria-labelledby="quiz-controls-title">
        <h3 id="quiz-controls-title">${final ? 'Assessment controls' : 'Quiz controls'}</h3>
        <div class="controls-row">
          ${final ? '<button type="button" class="primary" data-finish-final>Finish assessment</button>'
            : graded ? '<button type="button" data-edit-answer>Edit answer</button>'
            : '<button type="submit" class="primary">Check answer</button>'}
          <nav class="controls-row" aria-label="Question navigation">
            ${index > 0 ? `<button type="button" data-question="${index - 1}">Previous question</button>` : ''}
            ${index + 1 < (final?.refs ?? chapter.quiz).length ? `<button type="button" data-question="${index + 1}">Next question</button>` : ''}
            ${final ? '' : '<button type="button" data-quiz-summary>Quiz summary</button>'}
          </nav>
        </div>
        ${final ? '<p class="muted">Your choices save as you go. Answer every question to finish.</p>' : ''}
      </section>
    </form>`;
  renderQuestionNav(panel, final);

  const form = panel.querySelector('form');
  const selection = () => new FormData(form).getAll('option').map(Number);
  form.addEventListener('change', () => {
    const chosen = selection();
    form.querySelector('.validation').textContent = '';
    if (!final) {
      drafts.set(id, chosen);
      return;
    }
    final.answers[index] = chosen.length ? { passed: correctSelection(correct, chosen), selected: chosen } : null;
    save();
    renderQuestionNav(panel, final);
  });
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (final || graded) return;
    const chosen = selection();
    if (!chosen.length) {
      form.querySelector('.validation').textContent = 'Select at least one answer before submitting.';
      form.querySelector('input').focus();
      return;
    }
    const answer = { passed: correctSelection(correct, chosen), selected: chosen };
    recordPractice(state, chapter.topic, id, answer);
    drafts.delete(id);
    checked.set(id, answer);
    save();
    renderNavigation();
    renderQuiz(panel);
    panel.querySelector('.feedback-status').focus();
  });
}

function renderFinal(panel) {
  const final = state.final;
  if (!final) {
    const left = chapters.filter(step).length;
    panel.innerHTML = `
      <h2 tabindex="-1">Before you start</h2>
      <p>${chapters.length} single- or multiple-answer questions from the Study Pack.
        At the end, review your results by exam area and compare your choices with the solutions.</p>
      ${left ? `<p>You have ${left} chapters left. Resume the study plan to pick up at the first unfinished step.</p>` : ''}
      <div class="actions">
        ${left ? '<button type="button" class="primary" data-continue>Resume study plan</button>' : ''}
        ${chapters.some(missed) ? '<button type="button" data-review-next>Retry missed questions</button>' : ''}
        <button type="button" ${left ? '' : 'class="primary"'} data-start-final>Start assessment</button>
      </div>`;
    return;
  }

  if (!assessmentComplete(final)) {
    final.submitted ??= false;
    final.cursor ??= Math.max(0, final.refs.findIndex((_, i) => final.answers[i] == null));
    renderQuiz(panel, final);
    return;
  }
  renderAssessmentSummary(panel, final);
}

function renderAssessmentSummary(panel, final) {
  const correct = final.answers.filter(passedAnswer).length;
  const ordered = final.refs.map((ref, index) => ({ ref, attempt: final.answers[index] }))
    .sort((a, b) => Number(passedAnswer(a.attempt)) - Number(passedAnswer(b.attempt)));
  panel.innerHTML = `
    <h2 tabindex="-1">${phase === 'past' ? `Assessment attempt ${state.assessmentIndex + 1}` : 'Assessment results'}</h2>
    <p class="result-line"><strong class="correct-text">${correct} correct</strong>
      <strong class="incorrect-text">${final.refs.length - correct} incorrect</strong></p>
    <ul class="roadmap">${Object.entries(topics).map(([code, name]) => {
      const area = final.answers.filter((_, i) => final.refs[i].topic.startsWith(`${code}.`));
      return `<li><strong>${code} · ${name}</strong> · ${area.filter(passedAnswer).length}/${area.length} correct</li>`;
    }).join('')}</ul>
    <h3>Review your answers</h3>
    ${ordered.map(({ ref, attempt }) => {
      const item = chapters.find(candidate => candidate.topic === ref.topic);
      const question = item.quiz.find(q => q.id === ref.id);
      return `<section class="assessment-item">
        <div class="result-line"><strong>${escape(item.title)}</strong>
          <button type="button" data-topic="${item.topic}" data-phase="theory">Review theory</button></div>
        ${answerDetails(question, [attempt])}
      </section>`;
    }).join('')}
    <div class="actions">
      ${phase === 'final' ? '<button type="button" data-start-final>Start a new assessment</button>' : '<button type="button" data-course="final">Current assessment</button>'}
      <button type="button" data-course="review">Open answer review</button>
    </div>`;
}

function renderCases(panel) {
  const errors = missed(chapter);
  const additionalPanels = chapter.panels.slice(chapter.cases.length);
  const extraExamples = additionalPanels.map(item => diagramExamples[`${chapter.topic}/${item.title}`] ?? []);
  const codeCount = extraExamples.flat().length;
  panel.innerHTML = `
    <h2 tabindex="-1">Worked cases</h2>
    <p>Predict what the code will do before opening the worked example. Then try the follow-up on your own.</p>
    <p id="case-progress" class="muted" role="status"></p>
    ${chapter.cases.map((item, i) => {
      const [challenge, solution] = variations[chapter.topic][i];
      return `<details class="reading" ${i === 0 ? 'open' : ''}>
        <summary>Case ${i + 1}. ${escape(item.title)}</summary>
        <div class="disclosure-body">
          <p>${markdownText(caseFocus[chapter.topic][i])}</p>
          ${item.code ? `<pre><code translate="no">${escape(item.code)}</code></pre>` : ''}
          <details class="reading inset"><summary>Worked example and explanation</summary>
            <div class="disclosure-body">
              ${paragraph(item.example)}
              ${paragraph(item.reason)}
            </div>
          </details>
          <h3>Try a variation</h3>
          <p>${markdownText(challenge)}</p>
          <details class="reading inset"><summary>Variation solution</summary>
            <div class="disclosure-body"><p>${markdownText(solution)}</p></div>
          </details>
          <label class="case-done">
            <input type="checkbox" data-case="${i}" ${state.worked[chapter.topic]?.[item.file] ? 'checked' : ''}>
            <span>Mark case complete</span>
          </label>
          <div class="case-quiz">
            <h3>Practice the same skill in the quiz</h3>
            <p>Use these questions to check whether you can apply the skill you just practiced.</p>
            <div class="case-questions">${item.qs.map(id => `
              <button type="button" data-case-question="${id}" aria-label="Open question ${id} in Practice">Q${id}</button>
            `).join('')}</div>
          </div>
        </div>
      </details>`;
    }).join('')}
    ${renderPracticeReferences()}
    <h3>Exercise diagrams</h3>
    ${renderDiagrams(chapter.exerciseDiagrams, 'Exercise diagram')}
    <details class="reading"><summary><span>Examples behind the diagrams
      <small class="summary-note">${additionalPanels.length} explanations${codeCount ? ` and ${codeCount} code ${codeCount === 1 ? 'example' : 'examples'}` : ''}</small>
    </span></summary>
      <div class="disclosure-body">
        ${additionalPanels.map((item, i) => `<section class="diagram-example">
          <h3>${escape(item.title)}</h3>
          <h4>Walkthrough</h4>
          <p>${markdownText(item.example)}</p>
          <h4>How to reason it through</h4>
          <p>${markdownText(item.reason)}</p>
          ${renderCodeExamples(extraExamples[i])}
        </section>`).join('')}
      </div>
    </details>
    <details class="reading"><summary>Chapter note</summary>
      <div class="disclosure-body"><p>${markdownText(guides[chapter.topic][1])}</p></div>
    </details>
    <div class="actions">
      ${attempted(chapter) < chapter.quiz.length ? '<button type="button" class="primary" data-phase="quiz">Finish quiz</button>' : ''}
      ${errors ? '<button type="button" data-phase="quiz" data-mode="review">Retry missed questions</button>' : ''}
      <button type="button" class="primary" data-continue id="continue-after-cases" hidden></button>
    </div>`;
  renderCaseProgress();
}

function renderCaseProgress() {
  const completed = completedCases(chapter);
  const next = nextChapter();
  const button = document.querySelector('#continue-after-cases');
  document.querySelector('#case-progress').textContent = `${completed}/${chapter.cases.length} cases complete`;
  button.hidden = completed < chapter.cases.length;
  button.textContent = next ? `Continue · ${next.topic} · ${phases[step(next)]}` : 'Go to final assessment';
}

lesson.addEventListener('toggle', event => {
  const details = event.target;
  if (!details.matches?.('details[data-home-area]')) return;
  const code = details.dataset.homeArea;
  if (details.open) {
    if (!state.openTopics.includes(code)) state.openTopics.push(code);
  } else state.openTopics = state.openTopics.filter(area => area !== code);
  save();
}, true);

nav.addEventListener('click', event => {
  const button = event.target.closest('[data-area]');
  if (!button) return;
  if (mobileMenu.matches) setSidebarOpen(false);
  openArea(button.dataset.area);
});

courseMenu.addEventListener('click', event => {
  const button = event.target.closest('[data-course]');
  if (!button) return;
  if (mobileMenu.matches) setSidebarOpen(false);
  openCourse(button.dataset.course);
});

lesson.addEventListener('submit', event => {
  if (event.target.id !== 'profile-form') return;
  event.preventDefault();
  const form = new FormData(event.target);
  profile = {
    firstName: String(form.get('firstName') ?? '').trim(),
    lastName: String(form.get('lastName') ?? '').trim(),
    role: String(form.get('role') ?? '').trim(),
  };
  try {
    localStorage.setItem(profileStorageKey, JSON.stringify(profile));
    profileStatus = 'Profile saved in this browser.';
  } catch {
    profileStatus = 'The browser could not save your profile.';
  }
  render();
});

lesson.addEventListener('click', event => {
  const button = event.target.closest('button');
  if (!button) return;
  if (button.dataset.applyQuestion !== undefined) {
    const targetChapter = chapter;
    const questionId = Number(button.dataset.applyQuestion);
    openChapter(targetChapter, 'cases');
    const reference = lesson.querySelector('[data-apply-reference="' + questionId + '"]');
    const group = reference?.closest('.apply-question-reference-group');
    if (group) group.open = true;
    if (reference) {
      reference.open = true;
      reference.scrollIntoView({ behavior: 'smooth', block: 'center' });
      reference.querySelector('summary')?.focus({ preventScroll: true });
    }
  } else if (button.hasAttribute('data-continue')) {
    continueCourse();
  } else if (button.hasAttribute('data-review-next')) {
    openChapter(chapters.find(missed), 'quiz', 'review');
  } else if (button.dataset.caseQuestion !== undefined) {
    openChapter(chapter, 'quiz', 'learn', Number(button.dataset.caseQuestion));
    focusQuestion(document.querySelector('#panel'));
  } else if (button.dataset.question !== undefined) {
    const panel = document.querySelector('#panel');
    const index = Number(button.dataset.question);
    const final = phase === 'final' ? state.final : null;
    if (final) {
      final.cursor = index;
      save();
    } else cursor = index;
    renderQuiz(panel, final);
    focusQuestion(panel);
  } else if (button.hasAttribute('data-edit-answer')) {
    const id = chapter.quiz[cursor].id;
    drafts.set(id, practiceAnswer(id)?.selected ?? []);
    const panel = document.querySelector('#panel');
    renderQuiz(panel);
    panel.querySelector('input:checked, input').focus();
  } else if (button.hasAttribute('data-quiz-summary')) {
    renderQuizSummary(document.querySelector('#panel'));
  } else if (button.hasAttribute('data-finish-final')) {
    if (assessmentAnswered(state.final) !== state.final.refs.length) return;
    state.final.submitted = true;
    save();
    render();
  } else if (button.hasAttribute('data-start-final')) {
    if (state.final && assessmentComplete(state.final)) state.assessments.push(state.final);
    state.final = { refs: finalQuestionRefs(chapters), answers: [], submitted: false };
    openCourse('final');
  } else if (button.dataset.assessment !== undefined) {
    state.assessmentIndex = Number(button.dataset.assessment);
    openCourse('past');
  } else if (button.dataset.course) {
    openCourse(button.dataset.course);
  } else if (button.dataset.topic) {
    openChapter(chapters.find(item => item.topic === button.dataset.topic), button.dataset.phase, button.dataset.mode);
  } else if (button.dataset.phase) {
    if (button.hasAttribute('data-study')) state.studied[chapter.topic] = true;
    openChapter(chapter, button.dataset.phase, button.dataset.mode);
  }
});

lesson.addEventListener('change', event => {
  const input = event.target.closest('input[data-case]');
  if (!input) return;
  state.worked[chapter.topic] ??= {};
  state.worked[chapter.topic][chapter.cases[Number(input.dataset.case)].file] = input.checked;
  save();
  renderCaseProgress();
  renderNavigation();
});

try {
  chapters = await loadCourse(async path => {
    const response = await fetch(packPath(path));
    if (!response.ok) throw new Error(`${path} (${response.status})`);
    return response.text();
  });
  const previous = chapters.find(item => item.topic === state.topic);
  if (previous && Object.hasOwn(phases, state.phase)) openChapter(previous, state.phase);
  else if (state.phase === 'past' && state.assessments[state.assessmentIndex]) openCourse('past');
  else if (state.phase === 'area' && Object.hasOwn(topics, state.area)) openArea(state.area);
  else openCourse(['final', 'review', 'profile'].includes(state.phase) ? state.phase : 'roadmap');
} catch (error) {
  lesson.innerHTML = '<h1>Could not load the Study Pack</h1><p>Start the tutor from the repository root using the command in the README, then reload this page.</p>';
  console.error(error);
}

const backupFormat = 'objectscript-certification-tutor-progress';
const backupVersion = 1;

function progressSnapshot() {
  const keys = ['results', 'studied', 'worked', 'history', 'assessments', 'openTopics', 'topic', 'phase', 'area', 'assessmentIndex', 'final', 'sidebarOpen'];
  return {
    ...Object.fromEntries(keys.filter(key => Object.hasOwn(state, key)).map(key => [key, state[key]])),
    profile: { firstName: profile.firstName ?? '', lastName: profile.lastName ?? '', role: profile.role ?? '' },
  };
}

function isRecord(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isValidAttempt(attempt, question) {
  if (typeof attempt === 'boolean') return true;
  return isRecord(attempt) && typeof attempt.passed === 'boolean' && Array.isArray(attempt.selected) &&
    attempt.selected.length > 0 && attempt.selected.every(index => Number.isInteger(index) && index >= 0 && index < question.options.length) &&
    new Set(attempt.selected).size === attempt.selected.length;
}

function validateProgressBackup(backup) {
  if (!isRecord(backup) || backup.format !== backupFormat || backup.version !== backupVersion || !isRecord(backup.progress)) return null;
  const saved = backup.progress;
  if (!isRecord(saved.results) || !isRecord(saved.studied) || !isRecord(saved.worked) || !isRecord(saved.history) ||
      !Array.isArray(saved.assessments) || !Array.isArray(saved.openTopics)) return null;

  const byTopic = new Map(chapters.map(item => [item.topic, {
    questions: new Map(item.quiz.map(question => [String(question.id), question])),
    cases: new Set(item.cases.map(exercise => exercise.file)),
  }]));
  const validTopicMap = (value, validate) => isRecord(value) && Object.entries(value).every(([topic, entries]) => {
    const known = byTopic.get(topic);
    return Boolean(known && validate(entries, known));
  });
  const validResults = validTopicMap(saved.results, (entries, known) => isRecord(entries) && Object.entries(entries).every(([id, passed]) => known.questions.has(id) && typeof passed === 'boolean'));
  const validHistory = validTopicMap(saved.history, (entries, known) => isRecord(entries) && Object.entries(entries).every(([id, attempts]) =>
    known.questions.has(id) && Array.isArray(attempts) && attempts.every(attempt => isValidAttempt(attempt, known.questions.get(id)))));
  const validStudied = validTopicMap(saved.studied, entries => isRecord(entries) && Object.values(entries).every(value => typeof value === 'boolean'));
  const validWorked = validTopicMap(saved.worked, (entries, known) => isRecord(entries) && Object.entries(entries).every(([file, done]) => known.cases.has(file) && typeof done === 'boolean'));
  if (!validResults || !validHistory || !validStudied || !validWorked || !saved.openTopics.every(topic => Object.hasOwn(topics, topic))) return null;
  const validProfile = saved.profile === undefined || (isRecord(saved.profile) &&
    typeof saved.profile.firstName === 'string' && saved.profile.firstName.length <= 60 &&
    (saved.profile.lastName === undefined || (typeof saved.profile.lastName === 'string' && saved.profile.lastName.length <= 60)) &&
    (saved.profile.role === undefined || (typeof saved.profile.role === 'string' && saved.profile.role.length <= 80)) &&
    Object.keys(saved.profile).every(key => ['firstName', 'lastName', 'role'].includes(key)));
  if (!validProfile || (saved.area !== undefined && !Object.hasOwn(topics, saved.area)) ||
      (saved.phase === 'area' && !Object.hasOwn(topics, saved.area))) return null;

  const validFinal = final => {
    if (!isRecord(final) || !Array.isArray(final.refs) || !Array.isArray(final.answers) || final.refs.length !== final.answers.length ||
        (final.submitted !== undefined && typeof final.submitted !== 'boolean') ||
        (final.cursor !== undefined && (!Number.isInteger(final.cursor) || final.cursor < 0 || final.cursor >= final.refs.length))) return false;
    return final.refs.every((ref, index) => {
      if (!isRecord(ref) || typeof ref.topic !== 'string') return false;
      const question = byTopic.get(ref.topic)?.questions.get(String(ref.id));
      const answer = final.answers[index];
      return Boolean(question && (answer === null || isValidAttempt(answer, question)));
    });
  };
  if (!saved.assessments.every(validFinal) || (saved.final !== undefined && !validFinal(saved.final))) return null;
  if (saved.topic !== undefined && !byTopic.has(saved.topic)) return null;
  if (saved.phase !== undefined && !['theory', 'quiz', 'cases', 'roadmap', 'review', 'final', 'past', 'profile', 'area'].includes(saved.phase)) return null;
  if (saved.assessmentIndex !== undefined && (!Number.isInteger(saved.assessmentIndex) || saved.assessmentIndex < 0 || saved.assessmentIndex >= saved.assessments.length)) return null;
  if (saved.sidebarOpen !== undefined && typeof saved.sidebarOpen !== 'boolean') return null;

  const restored = Object.fromEntries(['results', 'studied', 'worked', 'history', 'assessments', 'openTopics', 'topic', 'phase', 'area', 'assessmentIndex', 'final', 'sidebarOpen']
    .filter(key => Object.hasOwn(saved, key)).map(key => [key, saved[key]]));
  if (saved.profile !== undefined) restored.profile = {
    firstName: saved.profile.firstName ?? '', lastName: saved.profile.lastName ?? '', role: saved.profile.role ?? '',
  };
  return restored;
}

exportProgress.addEventListener('click', () => {
  const backup = { format: backupFormat, version: backupVersion, exportedAt: new Date().toISOString(), progress: progressSnapshot() };
  const url = URL.createObjectURL(new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'objectscript-progress-' + new Date().toISOString().slice(0, 10) + '.json';
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  transferStatus.textContent = 'Course progress and profile backup downloaded. Keep the file somewhere safe.';
});

importProgress.addEventListener('click', () => progressFile.click());
progressFile.addEventListener('change', async () => {
  const file = progressFile.files?.[0];
  if (!file) return;
  transferStatus.textContent = '';
  try {
    if (file.size > 1_000_000) throw new Error();
    const restored = validateProgressBackup(JSON.parse(await file.text()));
    if (!restored) throw new Error();
    if (!window.confirm('Importing this backup will replace the progress currently saved in this browser. Continue?')) {
      transferStatus.textContent = 'Import cancelled.';
      return;
    }
    const { profile: importedProfile, ...restoredProgress } = restored;
    localStorage.setItem(storageKey, JSON.stringify(restoredProgress));
    if (importedProfile) localStorage.setItem(profileStorageKey, JSON.stringify(importedProfile));
    window.location.reload();
  } catch {
    transferStatus.textContent = 'This file is not a valid progress backup, or the browser could not save it.';
  } finally {
    progressFile.value = '';
  }
});

if (chapters) {
  exportProgress.disabled = false;
  importProgress.disabled = false;
}
