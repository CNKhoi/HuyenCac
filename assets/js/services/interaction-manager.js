/**
 * v5.3 InteractionManager
 * - One delegated pointer listener
 * - requestAnimationFrame throttling
 * - stable active-target switching
 * - no direct inline transform (CSS owns transforms)
 * - disabled on coarse pointer / reduced motion
 */
export const InteractionManager={
  enabled:false, frame:0, pointer:null, active:null,
  reduceMotion:false, coarsePointer:false,

  init(){
    this.reduceMotion=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    this.coarsePointer=window.matchMedia?.('(pointer: coarse)').matches ?? false;
    this.enabled=!this.reduceMotion&&!this.coarsePointer;
    document.documentElement.classList.toggle('reduce-motion',this.reduceMotion);
    document.documentElement.classList.toggle('coarse-pointer',this.coarsePointer);
    if(!this.enabled)return;

    document.addEventListener('pointermove',e=>{
      const target=e.target.closest?.('[data-tilt]')||null;
      if(target!==this.active){
        if(this.active)this.reset(this.active);
        this.active=target;
      }
      if(!target)return;
      this.pointer={x:e.clientX,y:e.clientY,target};
      if(!this.frame)this.frame=requestAnimationFrame(()=>this.apply());
    },{passive:true});

    document.addEventListener('pointerleave',()=>this.clear(),{passive:true});
    window.addEventListener('blur',()=>this.clear(),{passive:true});
    document.addEventListener('visibilitychange',()=>{if(document.hidden)this.clear()},{passive:true});
  },

  apply(){
    this.frame=0;
    const p=this.pointer;
    const el=p?.target;
    if(!el?.isConnected)return;
    const r=el.getBoundingClientRect();
    if(r.width<2||r.height<2)return;
    const px=Math.max(0,Math.min(1,(p.x-r.left)/r.width));
    const py=Math.max(0,Math.min(1,(p.y-r.top)/r.height));
    const strength=Math.max(1,Math.min(10,Number(el.dataset.tiltStrength||5)));
    const rx=(.5-py)*strength;
    const ry=(px-.5)*strength;
    el.style.setProperty('--tilt-rx',`${rx.toFixed(2)}deg`);
    el.style.setProperty('--tilt-ry',`${ry.toFixed(2)}deg`);
    el.style.setProperty('--pointer-x',`${(px*100).toFixed(1)}%`);
    el.style.setProperty('--pointer-y',`${(py*100).toFixed(1)}%`);
    el.classList.add('tilt-active');
  },

  reset(el){
    if(!el)return;
    el.classList.remove('tilt-active');
    el.style.removeProperty('--tilt-rx');
    el.style.removeProperty('--tilt-ry');
    el.style.removeProperty('--pointer-x');
    el.style.removeProperty('--pointer-y');
  },

  clear(){
    if(this.frame){cancelAnimationFrame(this.frame);this.frame=0}
    if(this.active)this.reset(this.active);
    this.active=null;this.pointer=null;
  }
};
