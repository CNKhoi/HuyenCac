import { StorageModel } from '../models/storage-model.js';

export const AppState={
  value:{view:'home',profile:StorageModel.load(),tarot:null,dates:null,showAllDates:false},listeners:new Set(),
  get(){return this.value},
  patch(patch){this.value={...this.value,...patch};this.listeners.forEach(fn=>fn(this.value,patch))},
  subscribe(fn){this.listeners.add(fn);return()=>this.listeners.delete(fn)}
};

/* =========================================================
   FEATURE CONFIG — function-driven view metadata
   ========================================================= */
