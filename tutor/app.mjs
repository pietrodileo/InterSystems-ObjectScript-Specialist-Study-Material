import { assessmentAnswered, assessmentComplete, chapterStep, correctSelection, finalQuestionRefs, loadCourse, packPath, passedAnswer, practiceQueue, quizBlocks, recordPractice, reviewItems, topics } from './content.mjs';
import { caseFocus, guides, variations } from './lesson-guides.mjs';
import { diagramExamples, studyExamples } from './code-examples.mjs';

const lesson = document.querySelector('#lesson');
const nav = document.querySelector('#chapters');
const courseMenu = document.querySelector('#course-menu');
const sidebar = document.querySelector('#course');
const sidebarToggle = document.querySelector('#sidebar-toggle');
const sidebarChevron = document.querySelector('#sidebar-chevron');
const drawer = document.querySelector('#course-drawer');
const pinnedHeader = document.querySelector('#pinned-header');
const unpin = document.querySelector('#sidebar-unpin');
const exportProgress = document.querySelector('#export-progress');
const importProgress = document.querySelector('#import-progress');
const progressFile = document.querySelector('#progress-file');
const transferStatus = document.querySelector('#progress-transfer-status');
const compact = window.matchMedia('(max-width: 1040px)');
const storageKey = 'objectscript-tutor-v1';
const phases = { theory: 'Study', quiz: 'Practice', cases: 'Apply' };
const escape = value => String(value).replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[char]);
const paragraph = text => `<p class="prose">${escape(text)}</p>`;
const markdownText = value => escape(value.replaceAll('&lt;', '<').replaceAll('&gt;', '>'))
  .replace(/`([^`]+)`/g, '<code translate="no">$1</code>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
const link = (url, label) => `<a href="${escape(url)}" target="_blank" rel="noopener">${markdownText(label)} ↗</a>`;
const letter = index => String.fromCharCode(65 + index);

let state = {};
let storageWorks = true;
try {
  state = JSON.parse(localStorage.getItem(storageKey)) || {};
} catch {
  storageWorks = false;
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

const useDrawer = () => compact.matches && !state.sidebarPinned;

function updateSidebarToggle() {
  const drawerMode = useDrawer();
  const open = drawerMode ? drawer.open : !sidebar.hidden;
  const label = drawerMode
    ? open ? 'Close course index' : 'Open course index'
    : open ? 'Collapse course index' : 'Expand course index';
  sidebarToggle.setAttribute('aria-expanded', String(open));
  sidebarToggle.setAttribute('aria-label', label);
  sidebarToggle.title = label;
  sidebarChevron.setAttribute('d', open ? 'm15 9-3 3 3 3' : 'm12 9 3 3-3 3');
}

function placeSidebar() {
  pinnedHeader.hidden = !state.sidebarPinned;
  if (useDrawer()) {
    drawer.append(sidebar);
    sidebar.hidden = false;
    sidebarToggle.setAttribute('aria-controls', drawer.id);
    sidebarToggle.setAttribute('aria-haspopup', 'dialog');
  } else {
    drawer.close();
    lesson.before(sidebar);
    sidebar.hidden = !(state.sidebarOpen ?? true);
    sidebarToggle.setAttribute('aria-controls', sidebar.id);
    sidebarToggle.removeAttribute('aria-haspopup');
  }
  updateSidebarToggle();
}

placeSidebar();
compact.addEventListener('change', placeSidebar);
sidebarToggle.addEventListener('click', () => {
  if (useDrawer()) {
    if (drawer.open) drawer.close();
    else drawer.showModal();
  } else {
    state.sidebarOpen = sidebar.hidden;
    sidebar.hidden = !state.sidebarOpen;
    save();
  }
  updateSidebarToggle();
});
document.querySelector('#drawer-close').addEventListener('click', () => drawer.close());
document.querySelector('#drawer-pin').addEventListener('click', () => {
  state.sidebarPinned = true;
  state.sidebarOpen = true;
  placeSidebar();
  save();
  unpin.focus();
});
unpin.addEventListener('click', () => {
  state.sidebarPinned = false;
  placeSidebar();
  if (useDrawer()) drawer.showModal();
  else sidebarToggle.focus();
  updateSidebarToggle();
  save();
});
drawer.addEventListener('close', updateSidebarToggle);
drawer.addEventListener('click', event => {
  if (event.target === drawer) drawer.close();
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
  courseMenu.innerHTML = Object.entries({ roadmap: 'Study plan', review: 'Answer review', final: 'Final assessment' }).map(([page, label]) =>
    `<button type="button" data-course="${page}" ${phase === page ? 'aria-current="page"' : ''}>${label}</button>`).join('');
  nav.innerHTML = Object.entries(topics).map(([code, name]) => `
    <details class="topic" data-area="${code}" ${state.openTopics.includes(code) ? 'open' : ''}>
      <summary><span class="topic-code">${code}</span> <span>${name}</span></summary>
      <div class="topic-chapters">
        ${chapters.filter(item => item.topic.startsWith(`${code}.`)).map(item => {
          const selected = item === chapter ? ' aria-current="page"' : '';
          const status = step(item) ? `${attempted(item)}/${item.quiz.length} questions` : 'Complete';
          const errors = missed(item);
          return `<button type="button" class="chapter-button" data-topic="${item.topic}"${selected}>
            <span><b>${item.topic}</b> ${escape(item.title.split(': ')[1])}</span>
            <small>${status}${errors ? `<span class="review-count"> · ${errors} to review</span>` : ''}</small>
          </button>`;
        }).join('')}
      </div>
    </details>`).join('');
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
      ${phase === 'theory' ? `<p class="lead">${markdownText(guides[chapter.topic][0])}</p>` : ''}
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

function renderCourse() {
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

  const next = nextChapter();
  const started = chapters.some(item => attempted(item) || state.studied[item.topic] || completedCases(item));
  lesson.innerHTML = `
    <header class="lesson-header">
      <h1 tabindex="-1">InterSystems ObjectScript Specialist</h1>
      <p class="lead">${chapters.length} chapters on classes, SQL, ObjectScript APIs, and more, followed by a practice assessment.</p>
    </header>
    <section class="study-start">
      <div>
        <h2>${next ? escape(next.title) : 'Ready for the final assessment'}</h2>
        ${next ? `<p class="muted">Chapter ${chapters.indexOf(next) + 1} of ${chapters.length} · ${phases[step(next)]}</p>` : ''}
      </div>
      <div class="actions">
        <button type="button" class="primary" data-continue>${next ? (started ? 'Resume study plan' : 'Start study plan') : 'Go to final assessment'}</button>
      </div>
    </section>
    <section class="panel study-outline">
      <h2>The five exam areas</h2>
      <ul class="exam-areas">${Object.entries(topics).map(([code, name]) => {
        const group = chapters.filter(item => item.topic.startsWith(`${code}.`));
        return `<li><span class="topic-code">${code}</span> <strong>${name}</strong> <span class="muted">${group.filter(item => !step(item)).length}/${group.length} chapters complete</span></li>`;
      }).join('')}</ul>
      <h2>How each chapter works</h2>
      <ol class="roadmap">
        <li><strong>Study.</strong> Use the diagrams to explain each concept in your own words.</li>
        <li><strong>Practice.</strong> Answer the quiz questions and read the explanations.</li>
        <li><strong>Apply.</strong> Try the cases before opening their solutions. Check off each case you finish.</li>
      </ol>
      <p>After the final assessment, use Answer review to decide what to revisit.</p>
      <div class="actions"><button type="button" data-course="review">Open answer review</button></div>
    </section>`;
}

function renderDiagrams(diagrams, label) {
  return `<div class="diagrams">${diagrams.map(({ alt, file, width, height }, index) => {
    const url = escape(packPath(file));
    return `<figure><a href="${url}" target="_blank" rel="noopener" aria-label="Open ${label.toLowerCase()} ${index + 1} at full size">
      <img src="${url}" alt="${escape(alt)}" width="${width}" height="${height}" loading="lazy">
    </a><figcaption>${label} ${index + 1}. Open image at full size.</figcaption></figure>`;
  }).join('')}</div>`;
}

function renderCodeExamples(examples) {
  return examples.map(([title, code, observation]) => `
    <figure class="code-example">
      <figcaption>${escape(title)}</figcaption>
      <pre><code translate="no">${escape(code)}</code></pre>
      <p>${escape(observation)}</p>
    </figure>`).join('');
}

function renderTheory(panel) {
  panel.innerHTML = `
    <h2 tabindex="-1">Key concepts</h2>
    <p>Start with the diagrams, then open a concept to read about it. Where you see a code example, predict the result before reading the explanation below it.</p>
    ${renderDiagrams(chapter.diagrams, 'Study diagram')}
    <div class="sections">${chapter.sections.map((section, i) => {
      const examples = studyExamples[`${chapter.topic}/${i + 1}`] ?? [];
      return `
      <details class="reading" ${i === 0 ? 'open' : ''}>
        <summary><span>${markdownText(section.title)}
          ${examples.length ? `<small class="summary-note">${examples.length === 1 ? 'Code example' : `${examples.length} code examples`} · ${escape(examples[0][0])}</small>` : ''}
        </span></summary>
        <div class="disclosure-body">
          <p>${markdownText(section.prose)}</p>
          ${renderCodeExamples(examples)}
          <ul>${section.points.map(point => `<li>${markdownText(point)}</li>`).join('')}</ul>
          <div class="documentation">
            <h3>Official documentation</h3>
            <ul>${section.references.map(({ url, label }) => `<li>${link(url, label)}</li>`).join('')}</ul>
          </div>
        </div>
      </details>`;
    }).join('')}</div>
    <div class="actions">
      <button type="button" class="primary" data-phase="quiz" data-study>${state.studied[chapter.topic] ? 'Go to quiz' : 'Mark as studied and start quiz'}</button>
      <a href="${escape(packPath(`${chapter.folder}/study.md`))}" download="${escape(chapter.topic)}-study-notes.md">Download chapter notes (.md)</a>
    </div>`;
}

function answerOptions(question, selected) {
  return `<ul>${selected.map(index => `<li><strong>${letter(index)}.</strong> ${quizText(question.options[index])}</li>`).join('')}</ul>`;
}

function questionExplanation(item, question) {
  const panels = item.panels.filter(panel => panel.qs.includes(question.id));
  return `
    <h3>Why this answer is correct</h3>
    <p class="quiz-text">${quizText(question.explanation.replace(/\s*\(Reference:[^)]+\)/g, ''))}</p>
    ${panels.length ? `<details class="reading inset"><summary>Related examples and mistakes</summary>
      <div class="disclosure-body">${panels.map(panel => `<h4>${escape(panel.title)}</h4><p>${markdownText(panel.reason)}</p>`).join('')}</div>
    </details>` : ''}
    <h3>Chapter note</h3>
    <p>${markdownText(guides[item.topic][1])}</p>`;
}

function answerDetails(item, question, attempts) {
  const last = attempts.at(-1);
  const passed = passedAnswer(last);
  const outcome = passed ? 'Correct' : 'Incorrect';
  const recovered = passed && attempts.some(attempt => !passedAnswer(attempt));
  const lines = question.question.trim().split('\n');
  const prompt = lines.findLast(line => line.includes('?'))?.trim() || 'Open question';
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
      ${questionExplanation(item, question)}
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
            .map(({ question, attempts }) => answerDetails(item, question, attempts)).join('')}
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
        ${questionExplanation(item, question)}
      </section>` : ''}
      <section class="quiz-controls" aria-labelledby="quiz-controls-title">
        <h3 id="quiz-controls-title">${final ? 'Assessment controls' : 'Quiz controls'}</h3>
        <div class="quiz-control-row">
          ${final ? '<button type="button" class="primary" data-finish-final>Finish assessment</button>'
            : graded ? '<button type="button" data-edit-answer>Edit answer</button>'
            : '<button type="submit" class="primary">Check answer</button>'}
          <nav class="quiz-control-row" aria-label="Question navigation">
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
        ${answerDetails(item, question, [attempt])}
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

nav.addEventListener('toggle', event => {
  const area = event.target.dataset.area;
  if (!area || !nav.contains(event.target)) return;
  const open = state.openTopics.includes(area);
  if (event.target.open === open) return;
  if (open) state.openTopics = state.openTopics.filter(code => code !== area);
  else state.openTopics.push(area);
  save();
}, true);

nav.addEventListener('click', event => {
  const button = event.target.closest('[data-topic]');
  if (!button) return;
  if (drawer.open) drawer.close();
  openChapter(chapters.find(item => item.topic === button.dataset.topic));
});

courseMenu.addEventListener('click', event => {
  const button = event.target.closest('[data-course]');
  if (!button) return;
  if (drawer.open) drawer.close();
  openCourse(button.dataset.course);
});

lesson.addEventListener('click', event => {
  const button = event.target.closest('button');
  if (!button) return;
  if (button.hasAttribute('data-continue')) {
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
  else openCourse(['final', 'review'].includes(state.phase) ? state.phase : 'roadmap');
} catch (error) {
  lesson.innerHTML = '<h1>Could not load the Study Pack</h1><p>Start the tutor from the repository root using the command in the README, then reload this page.</p>';
  console.error(error);
}

const backupFormat = 'objectscript-certification-tutor-progress';
const backupVersion = 1;

function progressSnapshot() {
  const keys = ['results', 'studied', 'worked', 'history', 'assessments', 'openTopics', 'topic', 'phase', 'assessmentIndex', 'final', 'sidebarOpen', 'sidebarPinned'];
  return Object.fromEntries(keys.filter(key => Object.hasOwn(state, key)).map(key => [key, state[key]]));
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
  if (saved.phase !== undefined && !['theory', 'quiz', 'cases', 'roadmap', 'review', 'final', 'past'].includes(saved.phase)) return null;
  if (saved.assessmentIndex !== undefined && (!Number.isInteger(saved.assessmentIndex) || saved.assessmentIndex < 0 || saved.assessmentIndex >= saved.assessments.length)) return null;
  if (saved.sidebarOpen !== undefined && typeof saved.sidebarOpen !== 'boolean') return null;
  if (saved.sidebarPinned !== undefined && typeof saved.sidebarPinned !== 'boolean') return null;

  return Object.fromEntries(['results', 'studied', 'worked', 'history', 'assessments', 'openTopics', 'topic', 'phase', 'assessmentIndex', 'final', 'sidebarOpen', 'sidebarPinned']
    .filter(key => Object.hasOwn(saved, key)).map(key => [key, saved[key]]));
}

exportProgress.addEventListener('click', () => {
  const backup = { format: backupFormat, version: backupVersion, exportedAt: new Date().toISOString(), progress: progressSnapshot() };
  const url = URL.createObjectURL(new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'objectscript-progress-' + new Date().toISOString().slice(0, 10) + '.json';
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  transferStatus.textContent = 'Progress backup downloaded. Keep the file somewhere safe.';
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
    localStorage.setItem(storageKey, JSON.stringify(restored));
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
