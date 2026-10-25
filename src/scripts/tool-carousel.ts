/** Native scrolling, one copy of every link, and independent pause reasons. */
function initializeCarousel(row: HTMLElement) {
  const viewport = row.querySelector<HTMLElement>('[data-viewport]')!;
  const list = row.querySelector<HTMLElement>('.tool-list')!;
  const controls = row.querySelector<HTMLElement>('[data-controls]')!;
  const previous = row.querySelector<HTMLButtonElement>('[data-previous]')!;
  const next = row.querySelector<HTMLButtonElement>('[data-next]')!;
  const toggle = row.querySelector<HTMLButtonElement>('[data-toggle]')!;
  const toggleText = row.querySelector<HTMLElement>('[data-toggle-text]')!;
  const toggleIcon = row.querySelector<HTMLElement>('[data-toggle-icon]')!;
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  const label = row.dataset.label!;
  const state = {
    user: false,
    manual: false,
    hover: row.matches(':hover'),
    focus: row.contains(document.activeElement),
    reduced: motionPreference.matches,
    offscreen: true,
    hidden: document.hidden,
    fits: false,
    dragging: false,
  };
  let frame = 0;
  let lastTime = 0;
  let position = viewport.scrollLeft;
  let expectedScroll = position;
  let direction = 1;
  let maximum = 0;
  let drag: { pointerId: number; x: number; y: number; start: number; active: boolean } | null = null;
  let suppressedPointer: number | null = null;
  let suppressTimer: ReturnType<typeof setTimeout> | undefined;
  let pointerToggleAction: 'play' | 'pause' | null = null;

  const stickyPause = () => state.user || state.manual || state.reduced;
  const blocked = () => Object.values(state).some(Boolean);

  function updateControls() {
    const paused = stickyPause();
    toggleText.textContent = paused ? 'Play' : 'Pause';
    toggleIcon.textContent = paused ? '▷' : 'Ⅱ';
    toggle.setAttribute('aria-label', `${paused ? 'Play' : 'Pause'} ${label}`);
    previous.disabled = state.fits || viewport.scrollLeft <= 1;
    next.disabled = state.fits || viewport.scrollLeft >= maximum - 1;
    toggle.disabled = state.fits;
    // Useful both for diagnostics and behavioral tests; no noisy live announcements.
    row.dataset.pauseReasons = Object.entries(state).filter(([, active]) => active).map(([reason]) => reason).join(' ');
  }

  function reconcile() {
    updateControls();
    if (blocked()) {
      cancelAnimationFrame(frame);
      frame = 0;
      lastTime = 0;
    } else if (!frame) {
      position = viewport.scrollLeft;
      lastTime = 0;
      frame = requestAnimationFrame(animate);
    }
  }

  function animate(time: number) {
    frame = 0;
    if (blocked()) return;
    const delta = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 0;
    lastTime = time;
    position += direction * 24 * delta;
    if (position >= maximum) { position = maximum; direction = -1; }
    if (position <= 0) { position = 0; direction = 1; }
    viewport.scrollLeft = position;
    expectedScroll = viewport.scrollLeft;
    updateControls();
    frame = requestAnimationFrame(animate);
  }

  function manualPause() { state.manual = true; reconcile(); }
  function move(distance: number) {
    manualPause();
    viewport.scrollLeft = Math.min(maximum, Math.max(0, viewport.scrollLeft + distance));
    expectedScroll = viewport.scrollLeft;
    updateControls();
  }
  const cardStep = () => (list.firstElementChild?.getBoundingClientRect().width ?? 156) + 12;
  previous.addEventListener('click', () => move(-cardStep()));
  next.addEventListener('click', () => move(cardStep()));
  toggle.addEventListener('pointerdown', () => {
    // Remember the visible action before pointer focus itself pauses the row.
    pointerToggleAction = stickyPause() ? 'play' : 'pause';
  });
  toggle.addEventListener('pointercancel', () => { pointerToggleAction = null; });
  toggle.addEventListener('click', (event) => {
    const play = event.detail > 0 && pointerToggleAction ? pointerToggleAction === 'play' : stickyPause();
    pointerToggleAction = null;
    if (play) {
      state.user = false;
      state.manual = false;
      // Explicit Play may opt into motion; changing the system preference resets it.
      state.reduced = false;
    } else { state.user = true; }
    reconcile();
  });

  row.addEventListener('pointerenter', (event) => {
    if (event.pointerType === 'mouse' || event.pointerType === 'pen') { state.hover = true; reconcile(); }
  });
  row.addEventListener('pointerleave', (event) => {
    if (event.pointerType === 'mouse' || event.pointerType === 'pen') { state.hover = false; reconcile(); }
  });
  row.addEventListener('focusin', (event) => {
    state.focus = true;
    state.manual = true;
    reconcile();
    const target = event.target;
    if (target instanceof HTMLElement && target.matches('.tool-card')) {
      const card = target.getBoundingClientRect();
      const bounds = viewport.getBoundingClientRect();
      if (card.left < bounds.left + 6) viewport.scrollLeft += card.left - bounds.left - 6;
      if (card.right > bounds.right - 6) viewport.scrollLeft += card.right - bounds.right + 6;
      expectedScroll = viewport.scrollLeft;
      updateControls();
    }
  });
  row.addEventListener('focusout', () => {
    queueMicrotask(() => { state.focus = row.contains(document.activeElement); reconcile(); });
  });

  viewport.addEventListener('keydown', (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      move(cardStep() * (event.key === 'ArrowLeft' ? -1 : 1));
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      move(event.key === 'Home' ? -maximum : maximum);
    }
  });
  viewport.addEventListener('wheel', (event) => {
    if (event.deltaX !== 0 || event.shiftKey) manualPause();
  }, { passive: true });
  viewport.addEventListener('scroll', () => {
    // Native scrollbar, assistive technology and touch scrolling also persist pause.
    if (Math.abs(viewport.scrollLeft - expectedScroll) > 2) manualPause();
    updateControls();
  }, { passive: true });

  viewport.addEventListener('pointerdown', (event) => {
    clearTimeout(suppressTimer);
    suppressedPointer = null;
    if (event.pointerType !== 'mouse') { manualPause(); return; }
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    manualPause();
    drag = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, start: viewport.scrollLeft, active: false };
    // Do not capture until a real drag: ordinary anchor clicks retain native behavior.
  });
  viewport.addEventListener('pointermove', (event) => {
    if (!drag || event.pointerId !== drag.pointerId) return;
    const dx = event.clientX - drag.x;
    if (!drag.active && Math.abs(dx) >= 6 && Math.abs(dx) > Math.abs(event.clientY - drag.y)) {
      drag.active = true;
      state.dragging = true;
      viewport.setPointerCapture(event.pointerId);
      viewport.classList.add('is-dragging');
      reconcile();
    }
    if (drag.active) {
      event.preventDefault();
      viewport.scrollLeft = drag.start - dx;
      expectedScroll = viewport.scrollLeft;
    }
  });
  function release(event: PointerEvent) {
    if (!drag || event.pointerId !== drag.pointerId) return;
    if (drag.active) {
      suppressedPointer = event.pointerId;
      // Only the click dispatched by this release is consumed, never a later click.
      // After cancellation, retain the guard until the gesture ends or a new
      // pointerdown clears it. Some devices still deliver a trailing release.
      if (event.type === 'pointerup') suppressTimer = setTimeout(() => { suppressedPointer = null; }, 0);
    }
    if (viewport.hasPointerCapture(event.pointerId)) viewport.releasePointerCapture(event.pointerId);
    drag = null;
    state.dragging = false;
    viewport.classList.remove('is-dragging');
    reconcile();
  }
  window.addEventListener('pointerup', release);
  window.addEventListener('pointercancel', release);
  viewport.addEventListener('lostpointercapture', () => {
    drag = null;
    state.dragging = false;
    viewport.classList.remove('is-dragging');
    reconcile();
  });
  viewport.addEventListener('click', (event) => {
    if (suppressedPointer !== null && event.detail > 0 && event.button === 0 && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
      event.preventDefault();
      event.stopPropagation();
      suppressedPointer = null;
    }
  }, true);
  viewport.addEventListener('dragstart', (event) => event.preventDefault());

  const resizeObserver = new ResizeObserver(() => {
    maximum = Math.max(0, viewport.scrollWidth - viewport.clientWidth);
    state.fits = maximum <= 1;
    controls.hidden = state.fits;
    position = viewport.scrollLeft;
    expectedScroll = position;
    reconcile();
  });
  resizeObserver.observe(viewport);
  resizeObserver.observe(list);
  const visibilityObserver = new IntersectionObserver(([entry]) => {
    state.offscreen = !entry.isIntersecting;
    reconcile();
  }, { threshold: 0 });
  visibilityObserver.observe(viewport);
  document.addEventListener('visibilitychange', () => { state.hidden = document.hidden; reconcile(); });
  window.addEventListener('blur', () => { state.hidden = true; reconcile(); });
  window.addEventListener('focus', () => { state.hidden = document.hidden; reconcile(); });
  motionPreference.addEventListener('change', () => {
    state.reduced = motionPreference.matches;
    // A preference change never discards a prior user/manual pause.
    reconcile();
  });
  row.dataset.initialized = 'true';
  reconcile();
}

document.querySelectorAll<HTMLElement>('[data-carousel]').forEach(initializeCarousel);
