import { MysticalData } from '../data/mystical-data.js';

export class StorageModel{
  static memory=null;

  static load(){
    try{
      const raw=localStorage.getItem(MysticalData.STORE);
      return raw?JSON.parse(raw):this.memory;
    }catch{
      return this.memory;
    }
  }

  static save(profile){
    this.memory=profile;
    try{localStorage.setItem(MysticalData.STORE,JSON.stringify(profile))}catch{}
    return profile;
  }

  static clear(){
    this.memory=null;
    try{localStorage.removeItem(MysticalData.STORE)}catch{}
  }
}
