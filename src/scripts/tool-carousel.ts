/** Native swiping with equivalent visual buffers around one accessible set of links. */
function initializeCarousel(row: HTMLElement) {
  const viewport = row.querySelector<HTMLElement>('[data-viewport]')!;
  const list = row.querySelector<HTMLElement>('.tool-list')!;
  const originals = Array.from(list.children) as HTMLElement[];
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const state = { hover: row.matches(':hover'), focus: false, reduced: motion.matches, offscreen: true, hidden: document.hidden, fits: true, touching: false, settling: false, dragging: false };
  let cycle = 0, frame = 0, lastTime = 0, position = 0, expectedScroll = 0;
  let keyboardInput = true;
  let drag: { id: number; x: number; y: number; start: number; active: boolean } | null = null;
  let suppressedPointer: number | null = null;
  let suppressTimer: ReturnType<typeof setTimeout> | undefined;
  let settleTimer: ReturnType<typeof setTimeout> | undefined;

  function cloneGroup() {
    return originals.map((original) => {
      const clone = original.cloneNode(true) as HTMLElement;
      clone.dataset.clone = 'true';
      clone.setAttribute('aria-hidden', 'true');
      clone.querySelectorAll<HTMLElement>('a').forEach((link) => { link.tabIndex = -1; });
      return clone;
    });
  }
  function writeScroll(value: number) {
    viewport.scrollLeft = value;
    expectedScroll = viewport.scrollLeft;
  }
  function wrap(value: number) {
    return state.fits || !cycle ? value : cycle + ((value - cycle) % cycle + cycle) % cycle;
  }
  function reconcile() {
    row.dataset.pauseReasons = Object.entries(state).filter(([, active]) => active).map(([reason]) => reason).join(' ');
    if (Object.values(state).some(Boolean)) {
      cancelAnimationFrame(frame);
      frame = 0;
      lastTime = 0;
    } else if (!frame) {
      position = wrap(viewport.scrollLeft);
      writeScroll(position);
      lastTime = 0;
      frame = requestAnimationFrame(animate);
    }
  }
  function animate(time: number) {
    frame = 0;
    const delta = lastTime ? Math.min((time - lastTime) / 1000, 0.05) : 0;
    lastTime = time;
    position = wrap(position + 24 * delta);
    writeScroll(position);
    frame = requestAnimationFrame(animate);
  }
  function settle() {
    state.settling = true;
    clearTimeout(settleTimer);
    settleTimer = setTimeout(() => { state.settling = false; reconcile(); }, 180);
    reconcile();
  }
  function resize() {
    const oldCycle = cycle;
    const offset = oldCycle && !state.fits ? ((viewport.scrollLeft - oldCycle) % oldCycle + oldCycle) % oldCycle : viewport.scrollLeft;
    const gap = parseFloat(getComputedStyle(list).columnGap) || 0;
    cycle = originals.reduce((width, card) => width + card.offsetWidth + gap, 0);
    const fits = cycle - gap <= viewport.clientWidth - 12;
    if (fits !== state.fits || !row.dataset.initialized) {
      list.querySelectorAll('[data-clone]').forEach((clone) => clone.remove());
      if (!fits) { list.prepend(...cloneGroup()); list.append(...cloneGroup()); }
    }
    state.fits = fits;
    row.dataset.cycleWidth = String(cycle);
    writeScroll(fits ? 0 : cycle + (oldCycle ? offset * cycle / oldCycle : offset));
    position = viewport.scrollLeft;
    row.dataset.initialized = 'true';
    reconcile();
  }
  row.addEventListener('pointerenter', (event) => {
    if (event.pointerType !== 'touch') { state.hover = true; reconcile(); }
  });
  row.addEventListener('pointerleave', (event) => {
    if (event.pointerType !== 'touch') { state.hover = false; reconcile(); }
  });
  document.addEventListener('keydown', () => {
    keyboardInput = true;
    state.focus = row.contains(document.activeElement);
    reconcile();
  });
  document.addEventListener('pointerdown', () => {
    keyboardInput = false;
    state.focus = false;
    reconcile();
  }, true);
  row.addEventListener('focusin', (event) => {
    state.focus = keyboardInput;
    reconcile();
    const target = event.target;
    if (state.focus && target instanceof HTMLElement && target.matches('.tool-card')) {
      const card = target.getBoundingClientRect(), bounds = viewport.getBoundingClientRect();
      if (card.left < bounds.left + 6) writeScroll(viewport.scrollLeft + card.left - bounds.left - 6);
      if (card.right > bounds.right - 6) writeScroll(viewport.scrollLeft + card.right - bounds.right + 6);
    }
  });
  row.addEventListener('focusout', () => {
    queueMicrotask(() => { state.focus = keyboardInput && row.contains(document.activeElement); reconcile(); });
  });
  viewport.addEventListener('keydown', (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const step = (originals[0]?.offsetWidth ?? 156) + (parseFloat(getComputedStyle(list).columnGap) || 0);
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      writeScroll(wrap(viewport.scrollLeft + step * (event.key === 'ArrowLeft' ? -1 : 1)));
    }
  });
  viewport.addEventListener('wheel', (event) => { if (event.deltaX || event.shiftKey) settle(); }, { passive: true });
  viewport.addEventListener('scroll', () => {
    if (Math.abs(viewport.scrollLeft - expectedScroll) <= 1) return;
    if (!state.focus) {
      const current = viewport.scrollLeft, wrapped = wrap(current);
      if (wrapped !== current) {
        if (drag) drag.start += wrapped - current;
        writeScroll(wrapped);
      }
    }
    settle();
  }, { passive: true });
  viewport.addEventListener('pointerdown', (event) => {
    clearTimeout(suppressTimer);
    suppressedPointer = null;
    if (event.pointerType !== 'mouse') { state.touching = true; reconcile(); return; }
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    drag = { id: event.pointerId, x: event.clientX, y: event.clientY, start: viewport.scrollLeft, active: false };
  });
  viewport.addEventListener('pointermove', (event) => {
    if (!drag || event.pointerId !== drag.id) return;
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
      const value = drag.start - dx, wrapped = wrap(value);
      drag.start += wrapped - value;
      writeScroll(wrapped);
    }
  });
  function release(event: PointerEvent) {
    if (event.pointerType !== 'mouse' && state.touching) { state.touching = false; settle(); }
    if (!drag || event.pointerId !== drag.id) return;
    if (drag.active) {
      suppressedPointer = event.pointerId;
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
  new ResizeObserver(resize).observe(viewport);
  new IntersectionObserver(([entry]) => { state.offscreen = !entry.isIntersecting; reconcile(); }).observe(viewport);
  document.addEventListener('visibilitychange', () => { state.hidden = document.hidden; reconcile(); });
  window.addEventListener('blur', () => { state.hidden = true; reconcile(); });
  window.addEventListener('focus', () => { state.hidden = document.hidden; reconcile(); });
  motion.addEventListener('change', () => { state.reduced = motion.matches; reconcile(); });
  resize();
}

document.querySelectorAll<HTMLElement>('[data-carousel]').forEach(initializeCarousel);
