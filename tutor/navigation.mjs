const pages = new Set(['roadmap', 'index', 'gallery', 'review', 'final', 'profile', 'past']);
const phases = new Set(['theory', 'quiz', 'cases']);

export function routeHref(route) {
  const params = new URLSearchParams();
  if (route.topic) {
    params.set('topic', route.topic);
    params.set('phase', route.phase ?? 'theory');
    if (route.mode && route.mode !== 'learn') params.set('mode', route.mode);
    if (route.section !== undefined) params.set('section', route.section);
    if (route.image) params.set('image', route.image);
  } else if (route.area) params.set('area', route.area);
  else {
    params.set('page', route.page ?? 'roadmap');
    if (route.page === 'past') params.set('assessment', route.assessment);
  }
  return '#' + params;
}

export function readRoute(hash, chapters, topics) {
  const params = new URLSearchParams(hash.slice(1));
  const topic = params.get('topic');
  if (topic) {
    const chapter = chapters.find(item => item.topic === topic);
    const phase = params.get('phase') ?? 'theory';
    const mode = params.get('mode') ?? 'learn';
    if (!chapter || !phases.has(phase) || !['learn', 'review', 'repeat'].includes(mode)) return null;
    const route = { topic, phase, mode };
    if (params.has('section')) {
      const section = Number(params.get('section'));
      if (!/^\d+$/.test(params.get('section')) || !Number.isSafeInteger(section) || !chapter.sections[section] || phase !== 'theory') return null;
      route.section = section;
    }
    const image = params.get('image');
    if (image) {
      if (![...chapter.diagrams, ...chapter.exerciseDiagrams].some(diagram => diagram.file === image)) return null;
      route.image = image;
    }
    return route;
  }
  const area = params.get('area');
  if (area) return Object.hasOwn(topics, area) ? { area } : null;
  const page = params.get('page');
  if (!pages.has(page)) return null;
  if (page === 'past') {
    const assessment = Number(params.get('assessment'));
    if (!/^\d+$/.test(params.get('assessment') ?? '') || !Number.isSafeInteger(assessment)) return null;
    return { page, assessment };
  }
  return { page };
}
