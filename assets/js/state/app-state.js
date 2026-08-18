import { StorageModel } from '../models/storage-model.js';

export const AppState={
  value:{view:'home',profile:StorageModel.load(),tarot:null,dates:null,showAllDates:false},
  listeners:new Set(),
  get(){return this.value},
  patch(patch){
    const changed={};
    for(const [key,value] of Object.entries(patch)){
      if(this.value[key]!==value) changed[key]=value;
    }
    if(!Object.keys(changed).length) return;
    this.value={...this.value,...changed};
    this.listeners.forEach(fn=>fn(this.value,changed));
  },
  subscribe(fn){this.listeners.add(fn);return()=>this.listeners.delete(fn)}
};

/* =========================================================
   FEATURE CONFIG — function-driven view metadata
   ========================================================= */
