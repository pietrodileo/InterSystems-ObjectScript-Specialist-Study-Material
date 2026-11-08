export const packPath = parts => `../ObjectScript%20Study%20Pack/${parts.split('/').map(encodeURIComponent).join('/')}`;

export const topics = {
  T1: 'Modello dati',
  T2: 'Programmazione di base',
  T3: 'Funzionalità di IRIS',
  T4: 'Funzioni e API',
  T5: 'Errori e diagnostica',
};

export const goals = {
  'T1.1': 'Spiega la differenza tra riferimento in memoria, ID persistente e chiave applicativa. Poi trova il global effettivo di un indice nella definizione di storage.',
  'T1.2': 'Progetta una classe con un campo obbligatorio, un dato di grandi dimensioni e un indice. Motiva la scelta dell’indice e il comportamento della chiave esterna in cancellazione.',
  'T1.3': 'Leggi una firma di metodo e prevedi chi può chiamarlo, quali argomenti può modificare e quale implementazione viene eseguita quando interviene l’ereditarietà.',
  'T1.4': 'Scegli come rappresentare un payload JSON e come leggere o scrivere un contenuto grande. Spiega quando serve uno stream di caratteri e quando uno binario.',
  'T2.1': 'Segui due processi che modificano lo stesso dato. Indica quando acquisire un lock, dove termina la transazione e che cosa può annullare un rollback.',
  'T2.2': 'Parti da un’operazione lenta. Individua dove cercarne i dati e quali eventi, identificativi e metriche ti servono per seguirla nel tempo.',
  'T2.3': 'Riconosci i punti in cui dati o permessi attraversano un confine: visibilità delle variabili, accesso alle risorse e parametri di una query.',
  'T3.1': 'Per uno stesso dato temporaneo, scegli tra variabile locale, global privato del processo e global condiviso. Motiva la scelta in termini di visibilità e durata.',
  'T3.2': 'Segui un valore tra ObjectScript e SQL. Spiega come cambiano tipo e rappresentazione e quali segnali controllare dopo una query.',
  'T3.3': 'Distingui valore assente, stringa vuota, carattere nullo e SQL NULL. Prevedi che cosa succede in un confronto e nel passaggio tra ObjectScript e SQL.',
  'T3.4': 'Pianifica una modifica a una classe che contiene già dati. Spiega come verificare gli effetti su dati esistenti, indici e query in cache.',
  'T3.5': 'Davanti a una query lenta, usa statistiche e piano di esecuzione per formulare un’ipotesi. Scegli poi una misura che permetta di verificarla.',
  'T4.1': 'Disegna un array a più livelli. Prevedi l’ordine dei subscripts e distingui i nodi con valore, discendenti o entrambi.',
  'T4.2': 'Data una lista, scegli come leggerla, aggiornarla o scorrerla. Spiega come distinguere una lista ObjectScript da una stringa delimitata.',
  'T4.3': 'Parti da un input reale e motiva la funzione che useresti per estrarre, sostituire o codificare il testo. Prova mentalmente anche un caso limite.',
  'T4.4': 'Calcola il risultato di un’espressione e segui una data dalla rappresentazione interna a quella visualizzata. Controlla il cambio di giorno.',
  'T4.5': 'Segui il flusso di uno snippet con postcondizionali, cicli e uscite. Identifica quali comandi vengono eseguiti e quale livello termina.',
  'T4.6': 'Scegli tra chiamata dinamica di istanza, chiamata di classe e introspezione. Indica da dove ottieni il nome o il tipo che ti serve.',
  'T4.7': 'Abbina stream e API di rete al caso d’uso. Identifica la gestione delle risorse e il punto in cui verificare l’esito dell’operazione.',
  'T5.1': 'Decidi da dove partire in caso di compilazione fallita o di prestazioni degradate. Indica che evidenza raccogli prima di cambiare il codice.',
  'T5.2': 'Segui un errore dalla sua origine al log. Distingui uno status restituito da un’eccezione e indica come recuperare messaggio e stack.',
  'T5.3': 'Dato un errore di runtime, risali alla riga e allo stato che lo producono. Formula una verifica concreta per distinguere due cause plausibili.',
};

export function studySections(markdown) {
  // shortcut: this reads the pack's numbered headings and Key Points blocks. Update it if those headings change.
  const blocks = markdown.split(/^## (\d+\. .+)$/m);
  return blocks.filter((_, i) => i % 2 === 1).map((title, i) => {
    const points = blocks[i * 2 + 2].match(/^### Key Points\r?\n\r?\n(- .+(?:\r?\n- .+)*)/m)?.[1];
    return { title, points: points?.split(/\r?\n/).map(line => line.slice(2).replaceAll('**', '')) ?? [] };
  });
}

export function correctSelection(correct, selected) {
  const chosen = new Set(selected);
  return chosen.size === correct.length && correct.every(value => chosen.has(value));
}

export function practiceQueue(questions, results, mode = 'learn') {
  if (mode === 'repeat') return questions;
  if (mode === 'review') return questions.filter(q => results[q.id] === false);
  return questions.filter(q => !Object.hasOwn(results, q.id));
}

export function chapterStep(chapter, progress) {
  const topic = chapter.topic;
  if (!progress.studied?.[topic]) return 'theory';
  if (practiceQueue(chapter.quiz, progress.results?.[topic] ?? {}).length) return 'quiz';
  if (chapter.cases.some(item => !progress.worked?.[topic]?.[item.file])) return 'cases';
  return null;
}

export function finalQuestionRefs(chapters) {
  const refs = chapters.map(({ topic, quiz }) => ({
    topic, id: quiz[Math.floor(Math.random() * quiz.length)].id,
  }));
  for (let i = refs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [refs[i], refs[j]] = [refs[j], refs[i]];
  }
  return refs;
}

export async function loadCourse(read) {
  const [manifest, comments, exercises] = await Promise.all([
    read('manifest.json').then(JSON.parse),
    read('question-focus-content.json').then(JSON.parse),
    read('exercise-focus-content.json').then(JSON.parse),
  ]);
  return Promise.all(manifest.map(async chapter => {
    const [rawQuiz, study] = await Promise.all([
      read(`originals/quizzes/${chapter.topic}-quiz.json`).then(JSON.parse),
      read(`${chapter.folder}/study.md`),
    ]);
    const { questions } = rawQuiz.quiz;
    const sections = studySections(study);
    const diagrams = Array.from(study.matchAll(/^!\[([^\]]+)\]\((visual-guide-[\w-]+\.png)\)$/gm), ([, alt, file]) => ({ alt, file }));
    const exercise = exercises.find(item => item.id === chapter.topic);
    const notes = comments[chapter.topic];
    if (!goals[chapter.topic] || questions.length !== chapter.questions || notes?.length !== questions.length ||
        sections.length !== chapter.sections || sections.some(section => !section.points.length) || !exercise?.cases.length) {
      throw new Error(`Materiale incompleto per ${chapter.topic}`);
    }
    return {
      ...chapter, cases: exercise.cases, notes: exercise.notes, sections, diagrams,
      quiz: questions.map((question, index) => ({ ...question, comment: notes[index] })),
    };
  }));
}
