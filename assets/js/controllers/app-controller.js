import { AppState } from '../state/app-state.js';
import { StorageModel } from '../models/storage-model.js';
import { TarotEngine } from '../models/tarot-engine.js';
import { CompatibilityCalculator } from '../models/compatibility-calculator.js';
import { DateScorer } from '../models/date-scorer.js';
import { Format } from '../utils/format.js';
import { UIManager } from '../views/ui-manager.js';

export const AppController={
  init(){
    AppState.subscribe((state,patch)=>UIManager.render(state,patch));
    this.bindDelegatedEvents();
    this.initDates();
    UIManager.render(AppState.get(),{});

    let scrollFrame=0;
    window.addEventListener('scroll',()=>{
      if(scrollFrame)return;
      scrollFrame=requestAnimationFrame(()=>{
        scrollFrame=0;
        UIManager.q('#topbar')?.classList.toggle('scrolled',window.scrollY>10);
      });
    },{passive:true});
  },

  bindDelegatedEvents(){
    document.addEventListener('click',e=>{
      const target=e.target.closest('[data-action]');
      if(!target){if(e.target.id==='profileModal')UIManager.closeProfile();return}
      const action=target.dataset.action;
      if(action==='view'){
        e.preventDefault();
        AppState.patch({view:target.dataset.view});
      }else if(action==='profile-open')UIManager.openProfile(AppState.get().profile);
      else if(action==='profile-close')UIManager.closeProfile();
      else if(action==='profile-clear'){
        StorageModel.clear();
        AppState.patch({profile:null,tarot:null,compatibility:null,dates:null});
        UIManager.closeProfile();
      }
      else if(action==='tarot-draw')this.drawTarot();
      else if(action==='tarot-reset')AppState.patch({tarot:null});
      else if(action==='compatibility-analyze')this.analyzeCompatibility();
      else if(action==='compatibility-reset'){
        UIManager.resetCompatibilityForm();
        AppState.patch({compatibility:null});
      }
      else if(action==='dates-scan')this.scanDates();
      else if(action==='dates-toggle')AppState.patch({showAllDates:!AppState.get().showAllDates});
    });

    document.addEventListener('change',e=>{
      if(e.target.id==='tarotMode')UIManager.updateTarotModeUI();
      if(e.target.id==='tarotTopic'&&UIManager.q('#tarotMode')?.value==='preset')UIManager.renderTarotPreset();
    });

    document.addEventListener('submit',e=>{
      if(e.target.id!=='profileForm')return;
      e.preventDefault();
      const profile={
        fullName:UIManager.q('#fullName').value.trim(),
        birthDate:UIManager.q('#birthDate').value,
        birthTime:UIManager.q('#birthTime').value,
        gender:UIManager.q('#gender').value,
        birthPlace:UIManager.q('#birthPlace').value.trim()
      };
      StorageModel.save(profile);
      AppState.patch({profile,tarot:null,compatibility:null,dates:null});
      UIManager.closeProfile();
    });

    document.addEventListener('keydown',e=>{if(e.key==='Escape')UIManager.closeProfile()});
  },

  initDates(){
    const t=new Date();
    UIManager.q('#dateFrom').value=Format.iso(t);
    UIManager.q('#dateTo').value=Format.iso(Format.addDays(t,21));
  },

  requireProfile(){
    const p=AppState.get().profile;
    if(!p){UIManager.openProfile(null);return null}
    return p;
  },

  drawTarot(){
    const profile=this.requireProfile();if(!profile)return;
    try{
      const opts={
        mode:UIManager.q('#tarotMode').value,
        topic:UIManager.q('#tarotTopic').value,
        question:UIManager.q('#tarotQuestion').value,
        presetQuestion:UIManager.q('#tarotPresetQuestion').value
      };
      AppState.patch({tarot:TarotEngine.draw(profile,opts,new Date())});
    }catch(err){UIManager.toast(err.message)}
  },

  analyzeCompatibility(){
    const profile=this.requireProfile();if(!profile)return;
    const partner={
      fullName:UIManager.q('#partnerName')?.value.trim()||'',
      birthDate:UIManager.q('#partnerBirthDate')?.value||'',
      birthTime:UIManager.q('#partnerBirthTime')?.value||'',
      gender:UIManager.q('#partnerGender')?.value||'',
      birthPlace:UIManager.q('#partnerBirthPlace')?.value.trim()||''
    };
    const relationType=UIManager.q('#relationshipType')?.value||'general';
    if(!partner.fullName||!partner.birthDate){UIManager.toast('Vui lòng nhập họ tên và ngày sinh của người muốn so sánh.');return}
    try{
      const result=CompatibilityCalculator.analyze(profile,partner,relationType,new Date());
      AppState.patch({compatibility:result});
    }catch(err){UIManager.toast(err.message)}
  },

  scanDates(){
    const profile=this.requireProfile();if(!profile)return;
    const fv=UIManager.q('#dateFrom').value,tv=UIManager.q('#dateTo').value,purpose=UIManager.q('#datePurpose').value;
    if(!fv||!tv){UIManager.toast('Vui lòng chọn đủ từ ngày và đến ngày.');return}
    try{
      const data=DateScorer.range(profile,purpose,new Date(fv+'T12:00:00'),new Date(tv+'T12:00:00'));
      AppState.patch({dates:data,showAllDates:false});
    }catch(err){UIManager.toast(err.message)}
  }
};
