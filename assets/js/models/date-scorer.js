import { MysticalData } from '../data/mystical-data.js';
import { Format } from '../utils/format.js';
import { NumerologyCalculator } from './numerology-calculator.js';
import { LunarConverter } from './lunar-converter.js';
import { AstrologyCalculator } from './astrology-calculator.js';

/** Transparent reference scorer. Pure model, no DOM. */
export class DateScorer{
  static elementRelation(dayEl,userEl){if(dayEl===userEl)return {score:6,label:`Đồng hành ${dayEl}`,detail:`Can ngày và Can năm sinh cùng hành ${dayEl}`};if(MysticalData.GENERATES[dayEl]===userEl)return {score:10,label:'Ngày sinh trợ tuổi',detail:`${dayEl} sinh ${userEl}: cộng điểm hỗ trợ`};if(MysticalData.GENERATES[userEl]===dayEl)return {score:3,label:'Tuổi sinh cho ngày',detail:`${userEl} sinh ${dayEl}: thuận nhưng hao lực hơn`};if(MysticalData.CONTROLS[dayEl]===userEl)return {score:-10,label:'Ngày khắc tuổi',detail:`${dayEl} khắc ${userEl}: trừ điểm`};if(MysticalData.CONTROLS[userEl]===dayEl)return {score:-4,label:'Tuổi khắc ngày',detail:`${userEl} khắc ${dayEl}: có độ ma sát`};return {score:0,label:'Ngũ hành trung tính',detail:'Không có quan hệ sinh/khắc trực tiếp trong mô hình'}}
  static weekday(date,purpose){const d=date.getDay();if(['work','contract','study'].includes(purpose)){if(d>=1&&d<=5)return {score:5,label:'Tính thực tiễn ngày làm việc',detail:'Ngày trong tuần thuận hơn cho cơ quan, ký kết hoặc học tập'};return {score:-3,label:'Tính thực tiễn cuối tuần',detail:'Cuối tuần có thể hạn chế lịch cơ quan/dịch vụ'}}if(purpose==='travel'){if(d===0||d===6)return {score:4,label:'Nhịp cuối tuần',detail:'Cộng nhẹ cho mục đích đi lại/du lịch'};return {score:1,label:'Ngày thường',detail:'Không có ưu/nhược điểm lớn theo lịch làm việc'}}return {score:0,label:'Thứ trong tuần',detail:'Không áp dụng hệ số thực tiễn đáng kể'}}
  static purposeElement(el,purpose){const preferred={general:['Thổ','Mộc'],work:['Hỏa','Kim'],contract:['Kim','Thổ'],travel:['Thủy','Mộc'],love:['Mộc','Hỏa'],study:['Mộc','Thủy']};if((preferred[purpose]||[]).includes(el))return {score:6,label:`Can ngày ${el} hợp mục đích`,detail:`Mô hình ưu tiên ${preferred[purpose].join('/')} cho ${MysticalData.PURPOSE_NAME[purpose]}`};return {score:0,label:`Can ngày ${el}`,detail:'Không thuộc nhóm hành ưu tiên của mục đích'}}
  static personalDay(profile,date,purpose){const n=NumerologyCalculator.personalDay(profile.birthDate,date),map={general:[1,6,8],work:[1,4,8],contract:[2,4,8],travel:[3,5,9],love:[2,3,6],study:[4,7,9]};if((map[purpose]||[]).includes(n))return {score:5,label:`Ngày cá nhân ${n}`,detail:`Số ${n} được cộng nhẹ cho ${MysticalData.PURPOSE_NAME[purpose]}`};return {score:0,label:`Ngày cá nhân ${n}`,detail:'Không có hệ số cộng/trừ cho mục đích đã chọn'}}
  static branchRelation(userBranch,dayBranch){
    const rel=AstrologyCalculator.relations(userBranch);
    if(rel.trine.includes(dayBranch))return {score:18,label:'Tam hợp Địa Chi',detail:`Ngày ${MysticalData.BRANCHES[dayBranch]} nằm trong Tam hợp với tuổi ${MysticalData.BRANCHES[userBranch]}`};
    if(MysticalData.SIX_HARMONY[userBranch]===dayBranch)return {score:12,label:'Lục hợp Địa Chi',detail:`${MysticalData.BRANCHES[userBranch]} ↔ ${MysticalData.BRANCHES[dayBranch]} là cặp Lục hợp trực tiếp`};
    if(dayBranch===rel.clash)return {score:-28,label:'Lục xung / Đối xung',detail:`Ngày ${MysticalData.BRANCHES[dayBranch]} đối xung trực tiếp tuổi ${MysticalData.BRANCHES[userBranch]}`};
    if(dayBranch===userBranch)return {score:5,label:'Đồng Chi',detail:`Ngày và tuổi cùng Chi ${MysticalData.BRANCHES[userBranch]}`};
    const four=AstrologyCalculator.fourClashInfo(userBranch);
    if(four?.members.includes(dayBranch))return {score:-8,label:'Cùng nhóm Tứ hành xung',detail:`${MysticalData.BRANCHES[userBranch]} và ${MysticalData.BRANCHES[dayBranch]} cùng nhóm ${four.name}, nhưng không phải cặp đối xung trực tiếp`};
    return {score:0,label:'Quan hệ Địa Chi trung tính',detail:`${MysticalData.BRANCHES[dayBranch]} không Tam hợp, Lục hợp hoặc Lục xung trực tiếp với ${MysticalData.BRANCHES[userBranch]}`};
  }
  static score(profile,date,purpose){
    const by=AstrologyCalculator.yearCanChi(new Date(profile.birthDate+'T12:00:00').getFullYear()),dc=AstrologyCalculator.dayCanChi(date),factors=[];
    let score=56;
    factors.push(this.branchRelation(by.branchIndex,dc.branchIndex),this.elementRelation(dc.element,by.element),this.purposeElement(dc.element,purpose),this.weekday(date,purpose),this.personalDay(profile,date,purpose));
    factors.forEach(f=>score+=f.score);score=Math.max(12,Math.min(96,score));
    const positives=factors.filter(f=>f.score>0).sort((a,b)=>b.score-a.score),negatives=factors.filter(f=>f.score<0).sort((a,b)=>a.score-b.score);
    return {date,score,dc,lunar:LunarConverter.fromDate(date),factors,positives,negatives};
  }
  static range(profile,purpose,from,to){
    const diff=Math.round((to-from)/86400000);if(diff<0)throw new Error('Đến ngày phải sau hoặc bằng từ ngày.');if(diff>60)throw new Error('Khoảng phân tích tối đa 60 ngày.');
    const list=[];for(let i=0;i<=diff;i++)list.push(this.score(profile,Format.addDays(from,i),purpose));
    list.sort((a,b)=>b.score-a.score||b.positives.length-a.positives.length||a.date-b.date);
    const best=list[0],good=list.filter(x=>x.score>=68).length,by=AstrologyCalculator.yearCanChi(new Date(profile.birthDate+'T12:00:00').getFullYear()),top3=list.slice(0,3);
    const distribution={excellent:list.filter(x=>x.score>=80).length,good:list.filter(x=>x.score>=68&&x.score<80).length,neutral:list.filter(x=>x.score>=52&&x.score<68).length,low:list.filter(x=>x.score<52).length};
    const gap=list.length>1?best.score-list[1].score:best.score;
    const separation=gap>=10?'Tách biệt rõ':gap>=5?'Có ưu thế':gap>=2?'Khá sát nhau':'Gần như ngang điểm';
    const bestReason={positive:best.positives[0]||null,caution:best.negatives[0]||null};
    return {purpose,list,best,good,by,top3,distribution,gap,separation,bestReason};
  }
  static rank(s){return s>=80?['Rất phù hợp','excellent']:s>=68?['Khá phù hợp','good']:s>=52?['Trung tính','neutral']:['Nên cân nhắc','low']}
}
