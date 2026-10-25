const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let effects = !reducedMotion.matches;
const effectButton = document.querySelector<HTMLButtonElement>('#effects-toggle');
const syncEffects = () => {
  document.documentElement.dataset.effects = effects && !reducedMotion.matches ? 'on' : 'off';
  if (effectButton) { effectButton.setAttribute('aria-pressed', String(effects && !reducedMotion.matches)); effectButton.textContent = `Motion: ${effects && !reducedMotion.matches ? 'on' : 'off'}`; }
};
syncEffects();
reducedMotion.addEventListener('change', syncEffects);
if (effectButton) { effectButton.hidden = false; effectButton.addEventListener('click', () => { effects = !effects; syncEffects(); }); }
document.querySelectorAll<HTMLButtonElement>('[data-palette]').forEach(button => {
  button.hidden = false;
  button.addEventListener('click', () => {
    document.documentElement.dataset.palette = button.dataset.palette;
    document.querySelectorAll('button[data-palette]').forEach(other => other.setAttribute('aria-pressed', String(other === button)));
  });
});
document.querySelectorAll<HTMLElement>('[data-tilt]').forEach(card => {
  card.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse' || !effects || reducedMotion.matches) return;
    const rect = card.getBoundingClientRect();
    card.style.setProperty('--rx', `${-(event.clientY - rect.top - rect.height / 2) / rect.height * 5}deg`);
    card.style.setProperty('--ry', `${(event.clientX - rect.left - rect.width / 2) / rect.width * 5}deg`);
  });
  card.addEventListener('pointerleave', () => { card.style.setProperty('--rx', '0deg'); card.style.setProperty('--ry', '0deg'); });
});
const projectButtons = document.querySelectorAll<HTMLButtonElement>('[data-filter]');
const filterProjects = (filter: string) => {
  let count = 0;
  document.querySelectorAll<HTMLElement>('[data-project-status]').forEach(card => {
    card.hidden = filter !== 'all' && (filter === 'built' ? card.dataset.projectStatus !== 'built' : card.dataset.projectStatus === 'built');
    if (!card.hidden) count++;
  });
  projectButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.filter === filter)));
  const result = document.querySelector('#project-count');
  if (result) result.textContent = `${String(count).padStart(2, '0')} projects selected`;
};
document.querySelector<HTMLElement>('.project-filters')?.removeAttribute('hidden');
projectButtons.forEach(button => button.addEventListener('click', () => filterProjects(button.dataset.filter!)));
if (projectButtons.length) filterProjects(location.hash === '#explorations' ? 'exploring' : 'built');
window.addEventListener('hashchange', () => { if (location.hash === '#explorations') filterProjects('exploring'); });
document.querySelectorAll<HTMLButtonElement>('[data-tool]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-tool]').forEach(other => other.setAttribute('aria-pressed', String(other === button)));
    const output = document.querySelector('#tool-readout');
    if (output) output.textContent = `${button.dataset.tool} selected / ${button.dataset.group}. ${button.dataset.exploring ? 'Currently exploring; not completed professional experience.' : 'Part of the tools I’ve worked with across projects, coursework, or development work.'}`;
  });
});
document.querySelector<HTMLElement>('#tool-readout')?.removeAttribute('hidden');
