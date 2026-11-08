import { chapterStep, correctSelection, finalQuestionRefs, loadCourse, packPath, passedAnswer, practiceQueue, recordPractice, reviewItems, topics } from './content.mjs';
import { guides, variations } from './lesson-guides.mjs';

const lesson = document.querySelector('#lesson');
const nav = document.querySelector('#chapters');
const courseMenu = document.querySelector('#course-menu');
const sidebar = document.querySelector('#course');
const sidebarToggle = document.querySelector('#sidebar-toggle');
const narrow = window.matchMedia('(max-width: 720px)');
const storageKey = 'objectscript-tutor-v1';
const phases = { theory: 'Study', quiz: 'Practice', cases: 'Apply' };
const escape = value => String(value).replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[char]);
const paragraph = text => `<p class="prose">${escape(text)}</p>`;
const markdownText = value => escape(value.replaceAll('&lt;', '<').replaceAll('&gt;', '>'))
  .replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
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

let chapters, chapter, phase, queue, cursor, reviewing;
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

function showSidebar(open) {
  sidebar.hidden = !open;
  sidebarToggle.setAttribute('aria-expanded', String(open));
  sidebarToggle.textContent = open ? 'Hide sidebar' : 'Show sidebar';
}

showSidebar(state.sidebarOpen ?? !narrow.matches);
sidebarToggle.addEventListener('click', () => {
  state.sidebarOpen = sidebar.hidden;
  showSidebar(state.sidebarOpen);
  save();
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
    `${done}/${chapters.length} chapters · ${seen}/${total} questions · ${errors} to review${storageWorks ? '' : ' · saving unavailable'}`;
  courseMenu.innerHTML = Object.entries({ roadmap: 'Study plan', review: 'Answer review', final: 'Final assessment' }).map(([page, label]) =>
    `<button type="button" data-course="${page}" ${phase === page ? 'aria-current="page"' : ''}>${label}</button>`).join('');
  nav.innerHTML = Object.entries(topics).map(([code, name]) => `
    <section class="topic">
      <h2><span>${code}</span> ${name}</h2>
      ${chapters.filter(item => item.topic.startsWith(`${code}.`)).map(item => {
        const selected = item === chapter ? ' aria-current="page"' : '';
        const status = step(item) ? `${attempted(item)}/${item.quiz.length} questions` : 'Complete';
        const errors = missed(item);
        return `<button type="button" class="chapter-button" data-topic="${item.topic}"${selected}>
          <span><b>${item.topic}</b> ${escape(item.title.split(': ')[1])}</span>
          <small>${status}${errors ? `<span class="review-count"> · ${errors} to review</span>` : ''}</small>
        </button>`;
      }).join('')}
    </section>`).join('');
}

function openChapter(item, nextPhase = step(item) ?? 'theory', mode = 'learn') {
  chapter = item;
  phase = nextPhase;
  reviewing = mode === 'review';
  queue = practiceQueue(chapter.quiz, results(chapter), mode);
  cursor = 0;
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
  lesson.querySelector('h2')?.focus();
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
      <p class="eyebrow">CHAPTER ${number} OF ${chapters.length} <span>·</span> ${escape(topics[chapter.topic.split('.')[0]])}</p>
      <h1>${escape(chapter.title)}</h1>
      <p class="lead">${escape(guides[chapter.topic][0])}</p>
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
        <p class="eyebrow">FINAL STEP</p>
        <h1>Final assessment</h1>
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
      <p class="eyebrow">CERTIFICATION STUDY PLAN</p>
      <h1>InterSystems ObjectScript Specialist</h1>
      <p class="lead">Work through the exam topics one chapter at a time, then check your understanding with a final assessment.</p>
    </header>
    <section class="panel">
      <h2 tabindex="-1">How to use the tutor</h2>
      <ol class="roadmap">
        <li><strong>Study.</strong> Read the chapter overview, explore the concepts and diagrams, and explain them in your own words.</li>
        <li><strong>Practice.</strong> Answer the chapter questions and read the reasoning after each submission.</li>
        <li><strong>Apply.</strong> Try each worked case before revealing its solution. Mark the cases you finish.</li>
        <li><strong>Assess.</strong> Take the final assessment and use Answer review to decide what to revisit.</li>
      </ol>
      <div class="actions">
        <button type="button" class="primary" data-continue>${next ? (started ? 'Resume study plan' : 'Start study plan') : 'Go to final assessment'}</button>
        ${next ? `<span class="muted">Next step · ${next.topic} · ${phases[step(next)]}</span>` : ''}
        <button type="button" data-course="review">Open answer review</button>
      </div>
      <h3>The five exam areas</h3>
      <ul class="roadmap">${Object.entries(topics).map(([code, name]) => {
        const group = chapters.filter(item => item.topic.startsWith(`${code}.`));
        return `<li><strong>${code} · ${name}</strong> <span class="muted">${group.filter(item => !step(item)).length}/${group.length} chapters complete</span></li>`;
      }).join('')}</ul>
    </section>`;
}

function renderDiagrams(diagrams, label) {
  return `<div class="diagrams">${diagrams.map(({ alt, file }, index) => {
    const url = escape(packPath(file));
    return `<figure><a href="${url}" target="_blank" rel="noopener" aria-label="Open ${label.toLowerCase()} ${index + 1} at full size">
      <img src="${url}" alt="${escape(alt)}" loading="lazy">
    </a><figcaption>${label} ${index + 1} · Open to enlarge</figcaption></figure>`;
  }).join('')}</div>`;
}

function renderTheory(panel) {
  panel.innerHTML = `
    <h2 tabindex="-1">Key concepts</h2>
    <p>Use the diagrams to get oriented. Then open each section for an explanation, key points, and links to the relevant InterSystems documentation.</p>
    ${renderDiagrams(chapter.diagrams, 'Study diagram')}
    <div class="sections">${chapter.sections.map((section, i) => `
      <details class="reading" ${i === 0 ? 'open' : ''}>
        <summary>${markdownText(section.title)}</summary>
        <p>${markdownText(section.prose)}</p>
        <ul>${section.points.map(point => `<li>${markdownText(point)}</li>`).join('')}</ul>
        <div class="documentation">
          <h3>Official documentation</h3>
          <ul>${section.references.map(({ url, label }) => `<li>${link(url, label)}</li>`).join('')}</ul>
        </div>
      </details>`).join('')}</div>
    <div class="actions">
      <button type="button" class="primary" data-phase="quiz" data-study>${state.studied[chapter.topic] ? 'Go to quiz' : 'Mark as studied and start quiz'}</button>
      ${link(packPath(`${chapter.folder}/study.md`), 'Full notes and code examples (Markdown)')}
    </div>`;
}

function answerOptions(question, selected) {
  return `<ul>${selected.map(index => `<li class="prose"><strong>${letter(index)}.</strong> ${escape(question.options[index])}</li>`).join('')}</ul>`;
}

function questionExplanation(item, question) {
  const panels = item.panels.filter(panel => panel.qs.includes(question.id));
  return `
    <h3>Why this answer is expected</h3>
    ${paragraph(question.explanation.replace(/\s*\(Reference:[^)]+\)/g, ''))}
    ${panels.length ? `<details><summary>Related concepts and common traps</summary>
      ${panels.map(panel => `<h3>${escape(panel.title)}</h3>${paragraph(panel.reason)}`).join('')}
    </details>` : ''}
    <h3>Chapter caveat</h3>
    ${paragraph(guides[item.topic][1])}`;
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
    <p class="prompt prose">${escape(question.question)}</p>
    <h3>Your answers</h3>
    <ol class="attempts">${attempts.map(attempt => `<li>
      <strong class="${passedAnswer(attempt) ? 'correct-text' : 'incorrect-text'}">${passedAnswer(attempt) ? 'Correct' : 'Incorrect'}</strong>
      ${typeof attempt === 'boolean' ? ' · Earlier result. The selected options were not recorded.' : answerOptions(question, attempt.selected)}
    </li>`).join('')}</ol>
    <h3>Expected answer</h3>
    ${answerOptions(question, question.correct)}
    ${questionExplanation(item, question)}
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
      <p class="eyebrow">QUIZ PROGRESS</p>
      <h1>Answer review</h1>
      <p class="lead">See what you chose, compare it with the expected answer, and find the chapters to revisit.</p>
    </header>
    <section class="panel">
      <h2 tabindex="-1">Chapter quiz results</h2>
      <p class="result-line"><strong class="correct-text">${answered - errors} correct</strong>
        <strong class="incorrect-text">${errors} incorrect</strong><span>${total - answered} unanswered</span></p>
      <p>Totals use your latest answer to each question. Chapters with the most current errors appear first. Open a question to see all its attempts.</p>
      ${!answered ? '<p>No quiz answers yet. Start a chapter quiz to build your review list.</p>' : ''}
      ${groups.filter(group => group.answers.length).map(({ item, answers, errors }) => `<details class="reading">
        <summary>${escape(item.title)} · ${answers.length - errors} correct · ${errors} incorrect · ${item.quiz.length - answers.length} unanswered</summary>
        <div class="actions">
          <button type="button" data-topic="${item.topic}" data-phase="theory">Review theory</button>
          ${errors ? `<button type="button" data-topic="${item.topic}" data-phase="quiz" data-mode="review">Retry missed questions</button>` : ''}
        </div>
        ${[...answers].sort((a, b) => Number(a.passed) - Number(b.passed))
          .map(({ question, attempts }) => answerDetails(item, question, attempts)).join('')}
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

function renderQuiz(panel, question = queue[cursor]) {
  if (!question) {
    const errors = missed(chapter);
    const remaining = chapter.quiz.length - attempted(chapter);
    panel.innerHTML = `
      <h2 tabindex="-1">${reviewing ? 'Review session complete' : 'Chapter quiz complete'}</h2>
      <p>${attempted(chapter)} questions answered out of ${chapter.quiz.length}.
        ${errors ? `${errors} to review. Read the explanations and try them again.` : 'All of your latest answers are correct.'}
      </p>
      <div class="actions">
        ${errors ? '<button type="button" class="primary" data-phase="quiz" data-mode="review">Retry missed questions</button>' : ''}
        <button type="button" ${errors ? '' : 'class="primary"'} data-phase="cases">Open worked cases</button>
        <button type="button" data-course="review">Open answer review</button>
        ${remaining
          ? '<button type="button" data-phase="quiz">Continue quiz</button>'
          : '<button type="button" data-phase="quiz" data-mode="repeat">Retake full quiz</button>'}
        ${reviewing && !errors && chapters.some(missed) ? '<button type="button" data-review-next>Review next chapter</button>' : ''}
      </div>`;
    return;
  }

  const final = phase === 'final' ? state.final : null;
  const { id, options, type, correct } = question;
  const inputType = type === 'multiple' ? 'checkbox' : 'radio';
  panel.innerHTML = `
    <div class="question-meta">
      <p class="eyebrow">${final ? 'FINAL ASSESSMENT' : reviewing ? 'REVIEW' : 'PRACTICE'} <span>·</span>
        ${final ? final.answers.length + 1 : cursor + 1} / ${final ? final.refs.length : queue.length} IN SESSION
      </p>
      ${!final && !reviewing && missed(chapter) ? '<button type="button" data-phase="quiz" data-mode="review">Retry missed questions</button>' : ''}
    </div>
    <h2 tabindex="-1">Question ${final ? final.answers.length + 1 : id}</h2>
    <p class="prompt prose">${escape(question.question)}</p>
    <form>
      <fieldset>
        <legend>${type === 'multiple' ? 'Select all correct answers.' : 'Select one answer.'}</legend>
        ${options.map((option, i) => `<label class="option">
          <input type="${inputType}" name="option" value="${i}">
          <span class="letter">${letter(i)}</span><span class="prose">${escape(option)}</span>
        </label>`).join('')}
      </fieldset>
      <div class="actions"><button type="submit" class="primary">${final ? 'Submit and continue' : 'Check answer'}</button></div>
      <p class="validation" role="alert"></p>
    </form>
    <div id="feedback"></div>`;

  const form = panel.querySelector('form');
  form.addEventListener('submit', event => {
    event.preventDefault();
    const selected = new FormData(form).getAll('option').map(Number);
    const validation = form.querySelector('.validation');
    if (!selected.length) {
      validation.textContent = 'Select at least one answer before submitting.';
      form.querySelector('input').focus();
      return;
    }

    const passed = correctSelection(correct, selected);
    const attempt = { passed, selected };
    if (final) {
      final.answers.push(attempt);
      save();
      render();
      return;
    }
    recordPractice(state, chapter.topic, id, attempt);
    save();
    renderNavigation();
    validation.textContent = '';
    form.querySelector('fieldset').disabled = true;
    form.querySelector('button').hidden = true;
    const feedback = panel.querySelector('#feedback');
    feedback.innerHTML = `
      <section class="feedback ${passed ? 'passed' : 'retry'}">
        <p class="eyebrow" tabindex="-1">${passed ? 'CORRECT' : 'INCORRECT'} · EXPECTED ${correct.map(letter).join(', ')}</p>
        ${questionExplanation(chapter, question)}
      </section>
      <div class="actions"><button type="button" class="primary" id="next">
        ${cursor + 1 < queue.length ? 'Next question' : 'See quiz summary'}
      </button></div>`;
    feedback.querySelector('.eyebrow').focus();
    feedback.querySelector('#next').addEventListener('click', () => {
      cursor++;
      render();
    });
  });
}

function renderFinal(panel) {
  const final = state.final;
  if (!final) {
    const left = chapters.filter(step).length;
    panel.innerHTML = `
      <h2 tabindex="-1">Put your knowledge together</h2>
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

  if (final.answers.length < final.refs.length) {
    const ref = final.refs[final.answers.length];
    const question = chapters.find(item => item.topic === ref.topic).quiz.find(q => q.id === ref.id);
    renderQuiz(panel, question);
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
  panel.innerHTML = `
    <h2 tabindex="-1">Worked cases</h2>
    <p>Predict the outcome before opening the worked example. Then try the follow-up and mark the case complete.</p>
    <p id="case-progress" class="muted" role="status"></p>
    ${chapter.cases.map((item, i) => {
      const [challenge, solution] = variations[chapter.topic][i];
      return `<details class="reading" ${i === 0 ? 'open' : ''}>
        <summary>${escape(item.title)}</summary>
        <div class="case">
          <p class="muted">Related quiz questions · ${item.qs.map(id => `Q${id}`).join(', ')}</p>
          ${item.code ? `<pre><code>${escape(item.code)}</code></pre>` : ''}
          <details><summary>Show the worked example and reasoning</summary>
            ${paragraph(item.example)}
            ${paragraph(item.reason)}
          </details>
          <h3>Try a variation</h3>
          ${paragraph(challenge)}
          <details><summary>Show the variation solution</summary>${paragraph(solution)}</details>
          <label class="case-done">
            <input type="checkbox" data-case="${i}" ${state.worked[chapter.topic]?.[item.file] ? 'checked' : ''}>
            <span>Mark case complete</span>
          </label>
        </div>
      </details>`;
    }).join('')}
    <h3>Exercise diagrams</h3>
    ${renderDiagrams(chapter.exerciseDiagrams, 'Exercise diagram')}
    <details class="reading"><summary>Further insights from the diagrams</summary>
      ${chapter.panels.slice(chapter.cases.length).map(item => `<h3>${escape(item.title)}</h3>${paragraph(item.example)}${paragraph(item.reason)}`).join('')}
    </details>
    <details class="reading"><summary>Chapter notes and quiz caveats</summary>${paragraph(guides[chapter.topic][1])}</details>
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

nav.addEventListener('click', event => {
  const button = event.target.closest('[data-topic]');
  if (!button) return;
  if (narrow.matches) showSidebar(false);
  openChapter(chapters.find(item => item.topic === button.dataset.topic));
});

courseMenu.addEventListener('click', event => {
  const button = event.target.closest('[data-course]');
  if (!button) return;
  if (narrow.matches) showSidebar(false);
  openCourse(button.dataset.course);
});

lesson.addEventListener('click', event => {
  const button = event.target.closest('button');
  if (!button) return;
  if (button.hasAttribute('data-continue')) {
    continueCourse();
  } else if (button.hasAttribute('data-review-next')) {
    openChapter(chapters.find(missed), 'quiz', 'review');
  } else if (button.hasAttribute('data-start-final')) {
    if (state.final && state.final.answers.length === state.final.refs.length) state.assessments.push(state.final);
    state.final = { refs: finalQuestionRefs(chapters), answers: [] };
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
