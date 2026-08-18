/**
 * Shared interaction layer.
 * Uses ONE delegated pointer listener + requestAnimationFrame to avoid
 * binding pointermove handlers on every card. Automatically disables
 * 3D motion for coarse pointers and prefers-reduced-motion users.
 */
export const InteractionManager = {
  enabled: false,
  frame: 0,
  pointer: null,
  active: null,
  reduceMotion: false,
  coarsePointer: false,

  init(){
    this.reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    this.coarsePointer = window.matchMedia?.('(pointer: coarse)').matches ?? false;
    this.enabled = !this.reduceMotion && !this.coarsePointer;

    document.documentElement.classList.toggle('reduce-motion', this.reduceMotion);
    if(!this.enabled) return;

    document.addEventListener('pointermove', e => {
      const target = e.target.closest('[data-tilt]');
      if(!target){
        if(this.active) this.reset(this.active);
        this.active = null;
        return;
      }
      this.active = target;
      this.pointer = {x:e.clientX,y:e.clientY,target};
      if(!this.frame) this.frame = requestAnimationFrame(() => this.apply());
    }, {passive:true});

    document.addEventListener('pointerout', e => {
      const target = e.target.closest?.('[data-tilt]');
      if(!target) return;
      const next = e.relatedTarget;
      if(next && target.contains(next)) return;
      this.reset(target);
      if(this.active === target) this.active = null;
    }, {passive:true});
  },

  apply(){
    this.frame = 0;
    const p = this.pointer;
    if(!p?.target?.isConnected) return;
    const el = p.target;
    const r = el.getBoundingClientRect();
    if(!r.width || !r.height) return;

    const px = Math.max(0,Math.min(1,(p.x-r.left)/r.width));
    const py = Math.max(0,Math.min(1,(p.y-r.top)/r.height));
    const strength = Number(el.dataset.tiltStrength || 7);
    const rx = (.5-py)*strength;
    const ry = (px-.5)*strength;
    el.style.setProperty('--tilt-rx',`${rx.toFixed(2)}deg`);
    el.style.setProperty('--tilt-ry',`${ry.toFixed(2)}deg`);
    el.style.setProperty('--pointer-x',`${Math.round(px*100)}%`);
    el.style.setProperty('--pointer-y',`${Math.round(py*100)}%`);
    el.classList.add('tilt-active');
  },

  reset(el){
    if(!el) return;
    el.classList.remove('tilt-active');
    el.style.removeProperty('--tilt-rx');
    el.style.removeProperty('--tilt-ry');
    el.style.removeProperty('--pointer-x');
    el.style.removeProperty('--pointer-y');
  }
};
