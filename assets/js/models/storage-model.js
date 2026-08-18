import { MysticalData } from '../data/mystical-data.js';

export class StorageModel{
  static load(){try{return JSON.parse(localStorage.getItem(MysticalData.STORE))||null}catch{return null}}
  static save(profile){localStorage.setItem(MysticalData.STORE,JSON.stringify(profile))}
  static clear(){localStorage.removeItem(MysticalData.STORE)}
}
