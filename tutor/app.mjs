import { chapterStep, correctSelection, finalQuestionRefs, goals, loadCourse, packPath, practiceQueue, topics } from './content.mjs';

const lesson = document.querySelector('#lesson');
const nav = document.querySelector('#chapters');
const courseMenu = document.querySelector('#course-menu');
const storageKey = 'objectscript-tutor-v1';
const phases = { theory: 'Studia', quiz: 'Rispondi', cases: 'Applica' };
const escape = value => String(value).replace(/[&<>"']/g, char => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[char]);
const paragraph = text => `<p class="prose">${escape(text)}</p>`;
const link = (path, label) => `<a href="${escape(packPath(path))}" target="_blank" rel="noopener">${escape(label)} ↗</a>`;
const heading = (label, text) => `<h3>${label}</h3>${paragraph(text)}`;

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

function renderNavigation() {
  const seen = chapters.reduce((sum, item) => sum + attempted(item), 0);
  const total = chapters.reduce((sum, item) => sum + item.quiz.length, 0);
  const errors = chapters.reduce((sum, item) => sum + missed(item), 0);
  const done = chapters.filter(item => !step(item)).length;
  const progress = document.querySelector('#progress');
  progress.max = total;
  progress.value = seen;
  document.querySelector('#progress-label').textContent =
    `${done}/${chapters.length} capitoli · ${seen}/${total} domande · ${errors} da rivedere${storageWorks ? '' : ' · salvataggio non disponibile'}`;
  courseMenu.innerHTML = Object.entries({ roadmap: 'Percorso', final: 'Verifica finale' }).map(([page, label]) =>
    `<button type="button" data-course="${page}" ${phase === page ? 'aria-current="page"' : ''}>${label}</button>`).join('');
  nav.innerHTML = Object.entries(topics).map(([code, name]) => `
    <section class="topic">
      <h2><span>${code}</span> ${name}</h2>
      ${chapters.filter(item => item.topic.startsWith(`${code}.`)).map(item => {
        const selected = item === chapter ? ' aria-current="true"' : '';
        const status = step(item) ? `${attempted(item)}/${item.quiz.length} domande` : 'Completato';
        const errors = missed(item);
        return `<button type="button" class="chapter-button" data-topic="${item.topic}"${selected}>
          <span><b>${item.topic}</b> ${escape(item.title.split(': ')[1])}</span>
          <small>${status}${errors ? `<span class="review-count"> · ${errors} da rivedere</span>` : ''}</small>
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
      <p class="eyebrow">CAPITOLO ${number} DI ${chapters.length} <span>·</span> ${escape(topics[chapter.topic.split('.')[0]])}</p>
      <h1>${escape(chapter.title)}</h1>
      <p class="lead">${escape(goals[chapter.topic])}</p>
    </header>
    <nav class="phases" aria-label="Fasi del capitolo">
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
  if (phase === 'final') {
    lesson.innerHTML = `
      <header class="lesson-header">
        <p class="eyebrow">ULTIMA TAPPA</p>
        <h1>Verifica finale</h1>
        <p class="lead">Una domanda per ciascun capitolo, in ordine misto. Le soluzioni arrivano al termine.</p>
      </header>
      <section id="panel" class="panel"></section>`;
    renderFinal(document.querySelector('#panel'));
    return;
  }

  const next = nextChapter();
  const started = chapters.some(item => attempted(item) || state.studied[item.topic] || completedCases(item));
  lesson.innerHTML = `
    <header class="lesson-header">
      <p class="eyebrow">PERCORSO DI CERTIFICAZIONE</p>
      <h1>InterSystems ObjectScript Specialist</h1>
      <p class="lead">Dai primi concetti alla verifica finale, un capitolo alla volta.</p>
    </header>
    <section class="panel">
      <h2 tabindex="-1">Come studiare con il tutor</h2>
      <ol class="roadmap">
        <li><strong>Studia.</strong> Leggi l’obiettivo, esplora le sezioni e prova a spiegare i concetti senza guardare.</li>
        <li><strong>Rispondi.</strong> Affronta tutte le domande del capitolo in inglese. Dopo ogni risposta, leggi il ragionamento in italiano e prova la variante.</li>
        <li><strong>Applica.</strong> Risolvi i casi guidati prima di aprire le soluzioni. Segna ogni caso svolto e torna sulle risposte che hai sbagliato.</li>
        <li><strong>Verifica.</strong> Alla fine affronta domande dai cinque argomenti e usa il riepilogo per scegliere cosa ripassare.</li>
      </ol>
      <div class="actions">
        <button type="button" class="primary" data-continue>${next ? (started ? 'Riprendi il percorso' : 'Inizia il percorso') : 'Vai alla verifica finale'}</button>
        ${next ? `<span class="muted">Prossimo passo · ${next.topic} · ${phases[step(next)]}</span>` : ''}
        ${chapters.some(missed) ? '<button type="button" data-review-next>Ripassa gli errori del percorso</button>' : ''}
      </div>
      <h3>Le cinque aree</h3>
      <ul class="roadmap">${Object.entries(topics).map(([code, name]) => {
        const group = chapters.filter(item => item.topic.startsWith(`${code}.`));
        return `<li><strong>${code} · ${name}</strong> <span class="muted">${group.filter(item => !step(item)).length}/${group.length} capitoli completati</span></li>`;
      }).join('')}</ul>
    </section>`;
}

function renderTheory(panel) {
  panel.innerHTML = `
    <h2 tabindex="-1">Concetti chiave</h2>
    <p>Apri le sezioni in ordine. Dopo averne letta una, richiudila e prova a spiegare a voce quando useresti il concetto. Poi passa agli esercizi.</p>
    <div class="sections">${chapter.sections.map((section, i) => `
      <details class="reading" ${i === 0 ? 'open' : ''}>
        <summary lang="en">${escape(section.title)}</summary>
        <ul lang="en">${section.points.map(point => `<li>${escape(point)}</li>`).join('')}</ul>
      </details>`).join('')}</div>
    <details class="reading">
      <summary>Schemi del capitolo (${chapter.diagrams.length})</summary>
      <div class="diagrams">${chapter.diagrams.map(({ alt, file }, i) => {
        const url = escape(packPath(`${chapter.folder}/${file}`));
        return `<figure><a href="${url}" target="_blank" rel="noopener" aria-label="Ingrandisci lo schema ${i + 1}">
          <img src="${url}" alt="${escape(alt)}" loading="lazy">
        </a><figcaption>Schema ${i + 1} · Apri per ingrandire</figcaption></figure>`;
      }).join('')}</div>
    </details>
    <div class="actions">
      <button type="button" class="primary" data-phase="quiz" data-study>${state.studied[chapter.topic] ? 'Vai al quiz' : 'Ho studiato · Vai al quiz'}</button>
      ${link(`${chapter.folder}/study.md`, 'Guida completa con esempi (Markdown)')}
    </div>`;
}

function renderQuiz(panel, question = queue[cursor]) {
  if (!question) {
    const errors = missed(chapter);
    const remaining = chapter.quiz.length - attempted(chapter);
    panel.innerHTML = `
      <h2 tabindex="-1">${reviewing ? 'Ripasso terminato' : 'Quiz del capitolo terminato'}</h2>
      <p>${attempted(chapter)} domande affrontate su ${chapter.quiz.length}.
        ${errors ? `${errors} da rivedere. Rileggi il ragionamento e riprova a risolverle.` : 'Tutte le risposte date sono corrette.'}
      </p>
      <div class="actions">
        ${errors ? '<button type="button" class="primary" data-phase="quiz" data-mode="review">Ripassa gli errori</button>' : ''}
        <button type="button" ${errors ? '' : 'class="primary"'} data-phase="cases">Apri i casi guidati</button>
        ${remaining
          ? '<button type="button" data-phase="quiz">Continua il quiz</button>'
          : '<button type="button" data-phase="quiz" data-mode="repeat">Rifai tutto il quiz</button>'}
        ${reviewing && !errors && chapters.some(missed) ? '<button type="button" data-review-next>Ripassa il prossimo capitolo</button>' : ''}
      </div>`;
    return;
  }

  const final = phase === 'final' ? state.final : null;
  const { id, options, type, correct, comment } = question;
  const inputType = type === 'multiple' ? 'checkbox' : 'radio';
  const letter = i => String.fromCharCode(65 + i);
  panel.innerHTML = `
    <div class="question-meta">
      <p class="eyebrow">${final ? 'VERIFICA FINALE' : reviewing ? 'RIPASSO' : 'ALLENAMENTO'} <span>·</span>
        ${final ? final.answers.length + 1 : cursor + 1} / ${final ? final.refs.length : queue.length} NELLA SESSIONE
      </p>
      ${!final && !reviewing && missed(chapter) ? '<button type="button" data-phase="quiz" data-mode="review">Ripassa gli errori</button>' : ''}
    </div>
    <h2 tabindex="-1">Domanda ${final ? final.answers.length + 1 : id}</h2>
    <p class="prompt prose" lang="en">${escape(question.question)}</p>
    <form>
      <fieldset>
        <legend>${type === 'multiple' ? 'Seleziona tutte le risposte corrette.' : 'Seleziona una risposta.'}</legend>
        ${options.map((option, i) => `<label class="option">
          <input type="${inputType}" name="option" value="${i}">
          <span class="letter">${letter(i)}</span><span lang="en" class="prose">${escape(option)}</span>
        </label>`).join('')}
      </fieldset>
      <div class="actions"><button type="submit" class="primary">${final ? 'Conferma e continua' : 'Verifica la risposta'}</button></div>
      <p class="validation" role="alert"></p>
    </form>
    <div id="feedback"></div>`;

  const form = panel.querySelector('form');
  form.addEventListener('submit', event => {
    event.preventDefault();
    const selected = new FormData(form).getAll('option').map(Number);
    const validation = form.querySelector('.validation');
    if (!selected.length) {
      validation.textContent = 'Scegli almeno una risposta prima di verificare.';
      form.querySelector('input').focus();
      return;
    }

    const passed = correctSelection(correct, selected);
    if (final) {
      final.answers.push(passed);
      save();
      render();
      return;
    }
    state.results[chapter.topic] ??= {};
    state.results[chapter.topic][id] = passed;
    save();
    renderNavigation();
    validation.textContent = '';
    form.querySelector('fieldset').disabled = true;
    form.querySelector('button').hidden = true;
    const split = comment.challenge.lastIndexOf('?') + 1;
    const feedback = panel.querySelector('#feedback');
    feedback.innerHTML = `
      <section class="feedback ${passed ? 'passed' : 'retry'}">
        <p class="eyebrow" tabindex="-1">${passed ? 'RISPOSTA CORRETTA' : 'DA RIPASSARE'} · ${correct.length === 1 ? 'SOLUZIONE' : 'SOLUZIONI'} ${correct.map(letter).join(', ')}</p>
        <h3>${escape(comment.title)}</h3>
        ${paragraph(comment.reason)}
        ${heading('Regola da portare al prossimo esercizio', comment.insight)}
        ${heading('Prova una variante', comment.challenge.slice(0, split))}
        <details><summary>Mostra la soluzione della variante</summary>${paragraph(comment.challenge.slice(split).trim())}</details>
        <details><summary>Spiegazione originale del quiz (EN)</summary><p class="prose" lang="en">${escape(question.explanation)}</p></details>
      </section>
      <div class="actions"><button type="button" class="primary" id="next">
        ${cursor + 1 < queue.length ? 'Prossima domanda' : 'Vedi il riepilogo'}
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
      <h2 tabindex="-1">Metti insieme quello che hai studiato</h2>
      <p>${chapters.length} domande in inglese, a risposta singola o multipla, tratte dallo Study Pack.
        Alla fine vedrai il risultato per area e il ragionamento per ogni errore.</p>
      ${left ? `<p>Hai ancora ${left} capitoli da completare. Il percorso ti riporta al primo passo in sospeso.</p>` : ''}
      <div class="actions">
        ${left ? '<button type="button" class="primary" data-continue>Riprendi il percorso</button>' : ''}
        ${chapters.some(missed) ? '<button type="button" data-review-next>Ripassa gli errori del percorso</button>' : ''}
        <button type="button" ${left ? '' : 'class="primary"'} data-start-final>Inizia la verifica</button>
      </div>`;
    return;
  }

  const questions = final.refs.map(ref => chapters.find(item => item.topic === ref.topic).quiz.find(q => q.id === ref.id));
  if (final.answers.length < questions.length) {
    renderQuiz(panel, questions[final.answers.length]);
    return;
  }

  const correct = final.answers.filter(Boolean).length;
  panel.innerHTML = `
    <h2 tabindex="-1">Riepilogo finale</h2>
    <p><strong>${correct} su ${questions.length} risposte corrette</strong> in questa verifica dello Study Pack.</p>
    <ul class="roadmap">${Object.entries(topics).map(([code, name]) => {
      const area = final.answers.filter((_, i) => final.refs[i].topic.startsWith(`${code}.`));
      return `<li><strong>${code} · ${name}</strong> — ${area.filter(Boolean).length}/${area.length} corrette</li>`;
    }).join('')}</ul>
    <h3>Che cosa ripassare</h3>
    ${correct === questions.length ? '<p>Hai risolto tutte le domande della verifica. Prova a spiegare a voce come affronteresti le varianti dei casi più difficili.</p>' : ''}
    ${questions.map(({ id, comment, question, correct: expected, options }, i) => {
      if (final.answers[i]) return '';
      const { topic } = final.refs[i];
      return `<details class="reading">
        <summary>${topic} · Q${id} · ${escape(comment.title)}</summary>
        <p class="prose" lang="en">${escape(question)}</p>
        <ul lang="en">${expected.map(index => `<li>${escape(options[index])}</li>`).join('')}</ul>
        ${paragraph(comment.reason)}
        ${heading('Regola da ricordare', comment.insight)}
        <button type="button" data-topic="${topic}" data-phase="theory">Rivedi la teoria di ${topic}</button>
      </details>`;
    }).join('')}
    <div class="actions">
      ${nextChapter() ? '<button type="button" class="primary" data-continue>Completa il percorso</button>' : ''}
      <button type="button" data-start-final>Fai una nuova verifica</button>
      <button type="button" data-course="roadmap">Torna al percorso</button>
    </div>`;
}

function renderCases(panel) {
  const errors = missed(chapter);
  panel.innerHTML = `
    <h2 tabindex="-1">Casi guidati</h2>
    <p>Leggi lo scenario, prova a risolverlo e poi confronta il tuo ragionamento con il commento. Prova la variante e segna il caso come svolto.</p>
    <p id="case-progress" class="muted" role="status"></p>
    ${chapter.cases.map((item, i) => `
      <details class="reading" ${i === 0 ? 'open' : ''}>
        <summary>${escape(item.title)}</summary>
        <div class="case">
          <p class="muted">Dal quiz · ${item.qs.map(id => `Q${id}`).join(', ')}</p>
          ${paragraph(item.scenario)}
          ${item.code ? `<pre><code>${escape(item.code)}</code></pre>` : ''}
          <details><summary>Mostra il ragionamento</summary>
            ${paragraph(item.reason)}
            ${heading('Errore tipico', item.trap)}
            ${heading('Regola da ricordare', item.lesson)}
          </details>
          ${heading('Prova una variante', item.challenge)}
          <details><summary>Mostra la soluzione della variante</summary>${paragraph(item.solution)}</details>
          <label class="case-done">
            <input type="checkbox" data-case="${i}" ${state.worked[chapter.topic]?.[item.file] ? 'checked' : ''}>
            <span>Ho svolto questo caso</span>
          </label>
        </div>
      </details>`).join('')}
    <details class="reading"><summary>Precisazioni rispetto al quiz</summary>${paragraph(chapter.notes)}</details>
    <div class="actions">
      ${attempted(chapter) < chapter.quiz.length ? '<button type="button" class="primary" data-phase="quiz">Completa il quiz</button>' : ''}
      ${errors ? '<button type="button" data-phase="quiz" data-mode="review">Ripassa gli errori</button>' : ''}
      <button type="button" class="primary" data-continue id="continue-after-cases" hidden></button>
      ${link(`${chapter.folder}/Approfondimenti esercizi/README.md`, 'Note ed esercizi illustrati (Markdown)')}
    </div>`;
  renderCaseProgress();
}

function renderCaseProgress() {
  const completed = completedCases(chapter);
  const next = nextChapter();
  const button = document.querySelector('#continue-after-cases');
  document.querySelector('#case-progress').textContent = `${completed}/${chapter.cases.length} casi svolti`;
  button.hidden = completed < chapter.cases.length;
  button.textContent = next ? `Prosegui · ${next.topic} · ${phases[step(next)]}` : 'Vai alla verifica finale';
}

nav.addEventListener('click', event => {
  const button = event.target.closest('[data-topic]');
  if (button) openChapter(chapters.find(item => item.topic === button.dataset.topic));
});

courseMenu.addEventListener('click', event => {
  const button = event.target.closest('[data-course]');
  if (button) openCourse(button.dataset.course);
});

lesson.addEventListener('click', event => {
  const button = event.target.closest('button');
  if (!button) return;
  if (button.hasAttribute('data-continue')) {
    continueCourse();
  } else if (button.hasAttribute('data-review-next')) {
    openChapter(chapters.find(missed), 'quiz', 'review');
  } else if (button.hasAttribute('data-start-final')) {
    state.final = { refs: finalQuestionRefs(chapters), answers: [] };
    openCourse('final');
  } else if (button.dataset.course) {
    openCourse(button.dataset.course);
  } else if (button.dataset.topic) {
    openChapter(chapters.find(item => item.topic === button.dataset.topic), button.dataset.phase);
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
  else openCourse(state.phase === 'final' ? 'final' : 'roadmap');
} catch (error) {
  lesson.innerHTML = '<h1>Impossibile aprire lo Study Pack</h1><p>Avvia il tutor dalla cartella principale del repository con il comando nel README, poi ricarica la pagina.</p>';
  console.error(error);
}
