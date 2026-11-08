import { correctSelection, goals, loadCourse, packPath, practiceQueue, topics } from './content.mjs';

const lesson = document.querySelector('#lesson');
const nav = document.querySelector('#chapters');
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

let chapters, chapter, phase, queue, cursor, reviewing;
const results = item => state.results[item.topic] ?? {};
const attempted = item => item.quiz.filter(q => Object.hasOwn(results(item), q.id)).length;
const missed = item => item.quiz.filter(q => results(item)[q.id] === false).length;

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
  const progress = document.querySelector('#progress');
  progress.max = total;
  progress.value = seen;
  document.querySelector('#progress-label').textContent =
    `${seen} / ${total} affrontate · ${errors} da rivedere${storageWorks ? '' : ' · salvataggio non disponibile'}`;
  nav.innerHTML = Object.entries(topics).map(([code, name]) => `
    <section class="topic">
      <h2><span>${code}</span> ${name}</h2>
      ${chapters.filter(item => item.topic.startsWith(`${code}.`)).map(item => {
        const selected = item === chapter ? ' aria-current="true"' : '';
        const status = `${attempted(item)}/${item.quiz.length}`;
        const errors = missed(item);
        return `<button type="button" class="chapter-button" data-topic="${item.topic}"${selected}>
          <span><b>${item.topic}</b> ${escape(item.title.split(': ')[1])}</span>
          <small>${status}${errors ? `<span class="review-count"> · ${errors} da rivedere</span>` : ''}</small>
        </button>`;
      }).join('')}
    </section>`).join('');
}

function openChapter(item, nextPhase = 'theory', mode = 'learn') {
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

function focusLesson() {
  lesson.querySelector('h2')?.focus();
  window.scrollTo(0, 0);
}

function render() {
  renderNavigation();
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
      <button type="button" class="primary" data-phase="quiz">${attempted(chapter) === chapter.quiz.length ? 'Vedi il riepilogo del quiz' : attempted(chapter) ? 'Continua con il quiz' : 'Inizia il quiz'}</button>
      ${link(`${chapter.folder}/study.md`, 'Guida completa con esempi (Markdown)')}
    </div>`;
}

function renderQuiz(panel) {
  const question = queue[cursor];
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
      </div>`;
    return;
  }

  const { id, options, type, correct, comment } = question;
  const inputType = type === 'multiple' ? 'checkbox' : 'radio';
  const letter = i => String.fromCharCode(65 + i);
  panel.innerHTML = `
    <div class="question-meta">
      <p class="eyebrow">${reviewing ? 'RIPASSO' : 'ALLENAMENTO'} <span>·</span> ${cursor + 1} / ${queue.length} NELLA SESSIONE</p>
      ${!reviewing && missed(chapter) ? '<button type="button" data-phase="quiz" data-mode="review">Ripassa gli errori</button>' : ''}
    </div>
    <h2 tabindex="-1">Domanda ${id}</h2>
    <p class="prompt prose" lang="en">${escape(question.question)}</p>
    <form>
      <fieldset>
        <legend>${type === 'multiple' ? 'Seleziona tutte le risposte corrette.' : 'Seleziona una risposta.'}</legend>
        ${options.map((option, i) => `<label class="option">
          <input type="${inputType}" name="option" value="${i}">
          <span class="letter">${letter(i)}</span><span lang="en" class="prose">${escape(option)}</span>
        </label>`).join('')}
      </fieldset>
      <div class="actions"><button type="submit" class="primary">Verifica la risposta</button></div>
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

function renderCases(panel) {
  const next = chapters[chapters.indexOf(chapter) + 1];
  const errors = missed(chapter);
  panel.innerHTML = `
    <h2 tabindex="-1">Casi guidati</h2>
    <p>Leggi lo scenario, prova a risolverlo e poi confronta il tuo ragionamento con il commento. Chiudi provando la variante.</p>
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
        </div>
      </details>`).join('')}
    <details class="reading"><summary>Precisazioni rispetto al quiz</summary>${paragraph(chapter.notes)}</details>
    <div class="actions">
      ${attempted(chapter) < chapter.quiz.length ? '<button type="button" class="primary" data-phase="quiz">Completa il quiz</button>' : ''}
      ${errors ? '<button type="button" data-phase="quiz" data-mode="review">Ripassa gli errori</button>' : ''}
      ${next ? `<button type="button" ${attempted(chapter) === chapter.quiz.length ? 'class="primary"' : ''} data-topic="${next.topic}">Capitolo successivo · ${next.topic}</button>` : ''}
      ${link(`${chapter.folder}/Approfondimenti esercizi/README.md`, 'Note ed esercizi illustrati (Markdown)')}
    </div>
    ${next ? '' : '<p>Per il ripasso finale, torna ai capitoli con domande da rivedere nel menu del percorso.</p>'}`;
}

nav.addEventListener('click', event => {
  const button = event.target.closest('[data-topic]');
  if (button) openChapter(chapters.find(item => item.topic === button.dataset.topic));
});

lesson.addEventListener('click', event => {
  const button = event.target.closest('button');
  if (button?.dataset.phase) openChapter(chapter, button.dataset.phase, button.dataset.mode);
  if (button?.dataset.topic) openChapter(chapters.find(item => item.topic === button.dataset.topic));
});

try {
  chapters = await loadCourse(async path => {
    const response = await fetch(packPath(path));
    if (!response.ok) throw new Error(`${path} (${response.status})`);
    return response.text();
  });
  openChapter(chapters.find(item => item.topic === state.topic) ?? chapters[0],
    Object.hasOwn(phases, state.phase) ? state.phase : 'theory');
} catch (error) {
  lesson.innerHTML = '<h1>Impossibile aprire lo Study Pack</h1><p>Avvia il tutor dalla cartella principale del repository con il comando nel README, poi ricarica la pagina.</p>';
  console.error(error);
}
