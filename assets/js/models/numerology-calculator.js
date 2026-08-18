import { MysticalData } from '../data/mystical-data.js';
import { Format } from '../utils/format.js';

/** Pure numerology model. No DOM access. */
export class NumerologyCalculator{
  static stripName(s){return (s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/gi,'d').toUpperCase().replace(/[^A-Z]/g,'')}
  static reduce(n,masters=true){n=Math.abs(Number(n)||0);while(n>9&&!(masters&&[11,22,33].includes(n)))n=String(n).split('').reduce((a,b)=>a+Number(b),0);return n}
  static sumDigits(s){return String(s).replace(/\D/g,'').split('').reduce((a,b)=>a+Number(b),0)}
  static letterValue(ch){const i='ABCDEFGHIJKLMNOPQRSTUVWXYZ'.indexOf(ch);return i<0?0:(i%9)+1}
  static lifePath(ds){return this.reduce(this.sumDigits(ds),true)}
  static birthday(ds){return this.reduce(Number(ds.split('-')[2]),true)}
  static expression(name){return this.reduce([...this.stripName(name)].reduce((s,c)=>s+this.letterValue(c),0),true)}
  static soul(name){return this.reduce([...this.stripName(name)].filter(c=>'AEIOUY'.includes(c)).reduce((s,c)=>s+this.letterValue(c),0),true)}
  static personality(name){return this.reduce([...this.stripName(name)].filter(c=>!'AEIOUY'.includes(c)).reduce((s,c)=>s+this.letterValue(c),0),true)}
  static attitude(ds){const [,m,d]=ds.split('-').map(Number);return this.reduce(m+d,true)}
  static maturity(name,ds){return this.reduce(this.lifePath(ds)+this.expression(name),true)}
  static personalYear(ds,year=new Date().getFullYear()){const [,m,d]=ds.split('-').map(Number);return this.reduce(m+d+this.sumDigits(year),false)}
  static personalMonth(ds,date=new Date()){return this.reduce(this.personalYear(ds,date.getFullYear())+date.getMonth()+1,false)}
  static personalDay(ds,date=new Date()){return this.reduce(this.personalMonth(ds,date)+date.getDate(),false)}
  static info(n){return MysticalData.NUM_TEXT[n]||[`Số ${n}`,'một chỉ số bổ sung trong hồ sơ','đối chiếu với các chỉ số khác thay vì đọc riêng lẻ']}

  static baseNumber(n){return this.reduce(n,false)}
  static alignment(a,b){
    const x=this.baseNumber(a),y=this.baseNumber(b),distance=Math.abs(x-y),score=Math.max(18,Math.round(100-distance*11));
    const state=score>=88?'Giao thoa mạnh':score>=66?'Bổ trợ':score>=44?'Khác nhịp':'Độ tương phản cao';
    return {a,b,baseA:x,baseB:y,distance,score,state};
  }
  static family(n){
    if([11].includes(n))return 'Trực giác';
    if([22].includes(n))return 'Kiến tạo';
    if([33].includes(n))return 'Phụng sự';
    const b=this.baseNumber(n);
    if([1,8].includes(b))return 'Chủ động';
    if([2,6].includes(b))return 'Kết nối';
    if([3,5].includes(b))return 'Biểu đạt';
    if(b===4)return 'Cấu trúc';
    if(b===7)return 'Chiêm nghiệm';
    return 'Nhân văn';
  }
  static synthesis(values){
    const lifeExpression=this.alignment(values.life,values.expression);
    const innerOuter=this.alignment(values.soul,values.personality);
    const currentCycle=this.alignment(values.life,values.personalYear);
    const core=[values.life,values.expression,values.soul,values.personality,values.birthday,values.attitude,values.maturity];
    const familyCounts=core.reduce((acc,n)=>{const f=this.family(n);acc[f]=(acc[f]||0)+1;return acc},{});
    const dominant=Object.entries(familyCounts).sort((a,b)=>b[1]-a[1])[0]||['—',0];
    const axes=[
      {label:'Chủ đạo ↔ Biểu đạt',...lifeExpression,detail:`So sánh hướng vận hành từ ngày sinh (${values.life}) với cách năng lực được biểu đạt qua họ tên (${values.expression}).`},
      {label:'Linh hồn ↔ Nhân cách',...innerOuter,detail:`So sánh động lực bên trong (${values.soul}) với lớp biểu hiện người khác dễ nhận thấy (${values.personality}).`},
      {label:'Chủ đạo ↔ Năm cá nhân',...currentCycle,detail:`So sánh trục dài hạn (${values.life}) với nhịp của năm hiện tại (${values.personalYear}).`}
    ];
    const insights=[
      {label:'CỤM NỔI BẬT',value:dominant[0],detail:`${dominant[1]}/${core.length} chỉ số lõi nằm trong nhóm quy ước “${dominant[0]}”. Đây là cách nhóm nội bộ để nhìn mẫu lặp, không phải một phép đo khoa học.`},
      {label:'TRONG ↔ NGOÀI',value:innerOuter.state,detail:`Linh hồn ${values.soul} và Nhân cách ${values.personality} có mức giao thoa trực quan ${innerOuter.score}/100. Điểm này chỉ biểu diễn khoảng cách giữa hai con số sau rút gọn.`},
      {label:'NHỊP HIỆN TẠI',value:currentCycle.state,detail:`Năm cá nhân ${values.personalYear} ${currentCycle.score>=66?'khá gần':'khá khác'} với trục Chủ đạo ${values.life}; nên đọc như một gợi ý về nhịp ưu tiên, không phải dự báo.`}
    ];
    return {axes,insights,familyCounts,dominantFamily:dominant[0]};
  }

  static genderInsight(g,lp,ex,so,pe){
    if(g==='male')return `<strong>Hồ sơ Nam:</strong> giới tính không làm thay đổi phép tính. Với Chủ đạo <strong>${lp}</strong> và Biểu đạt <strong>${ex}</strong>, hãy quan sát cách bạn dùng tính tự chủ, trách nhiệm và khả năng chia sẻ nhu cầu. Linh hồn <strong>${so}</strong> so với Nhân cách <strong>${pe}</strong> hữu ích để nhận ra khoảng cách giữa điều thực sự cần và hình ảnh bạn đang duy trì.`;
    if(g==='female')return `<strong>Hồ sơ Nữ:</strong> giới tính không làm thay đổi phép tính. Với Chủ đạo <strong>${lp}</strong> và Biểu đạt <strong>${ex}</strong>, hãy quan sát sự cân bằng giữa tự chủ, ranh giới và kỳ vọng bên ngoài. Linh hồn <strong>${so}</strong> và Nhân cách <strong>${pe}</strong> giúp soi rõ phần nhu cầu bên trong chưa được biểu đạt đủ.`;
    if(g==='other')return `<strong>Hồ sơ không dùng phân loại Nam/Nữ:</strong> các chỉ số vẫn được tính đầy đủ. Hãy đọc Chủ đạo <strong>${lp}</strong>, Biểu đạt <strong>${ex}</strong>, Linh hồn <strong>${so}</strong> và Nhân cách <strong>${pe}</strong> theo trải nghiệm cá nhân.`;
    return 'Bạn chưa chọn giới tính. Các phép tính vẫn hoạt động bình thường; chỉ lớp diễn giải theo Nam/Nữ được bỏ qua.';
  }

  static calculate(profile,now=new Date()){
    const ds=profile.birthDate,name=profile.fullName;
    const values={life:this.lifePath(ds),expression:this.expression(name),soul:this.soul(name),personality:this.personality(name),birthday:this.birthday(ds),attitude:this.attitude(ds),maturity:this.maturity(name,ds),personalYear:this.personalYear(ds,now.getFullYear())};
    const metrics=[
      {label:'SỐ CHỦ ĐẠO',value:values.life,title:this.info(values.life)[0],note:'Tổng chữ số ngày sinh'},
      {label:'SỐ BIỂU ĐẠT',value:values.expression,title:this.info(values.expression)[0],note:'Giá trị chữ cái họ tên'},
      {label:'SỐ LINH HỒN',value:values.soul,title:this.info(values.soul)[0],note:'Chỉ nguyên âm'},
      {label:'SỐ NHÂN CÁCH',value:values.personality,title:this.info(values.personality)[0],note:'Chỉ phụ âm'},
      {label:'SỐ NGÀY SINH',value:values.birthday,title:this.info(values.birthday)[0],note:'Rút gọn ngày sinh'},
      {label:'SỐ THÁI ĐỘ',value:values.attitude,title:this.info(values.attitude)[0],note:'Tháng sinh + ngày sinh'},
      {label:'SỐ TRƯỞNG THÀNH',value:values.maturity,title:this.info(values.maturity)[0],note:'Chủ đạo + Biểu đạt'},
      {label:'NĂM CÁ NHÂN',value:values.personalYear,title:`Chu kỳ ${values.personalYear}`,note:`Năm ${now.getFullYear()}`}
    ];
    const li=this.info(values.life),ei=this.info(values.expression),si=this.info(values.soul),pi=this.info(values.personality);
    const reading=`<strong>Trục chính ${values.life} — ${li[0]}:</strong> thiên về ${li[1]}; điểm cần chú ý là ${li[2]}.<br><br><strong>Biểu đạt ${values.expression}</strong> nghiêng về ${ei[1]}. <strong>Linh hồn ${values.soul}</strong> gợi động lực bên trong thiên về ${si[1]}, còn <strong>Nhân cách ${values.personality}</strong> mô tả lớp biểu hiện người khác dễ nhận thấy: ${pi[1]}.<br><br>Các chỉ số khác nhau không cần ép thành một tính cách duy nhất; có thể hiểu là các lớp động lực, biểu hiện và cách vận hành trong thực tế.`;
    const pm=this.personalMonth(ds,now),pd=this.personalDay(ds,now);
    const cycles=[{value:values.personalYear,label:'Năm cá nhân',text:MysticalData.CYCLE_TEXT[values.personalYear],meta:String(now.getFullYear())},{value:pm,label:'Tháng cá nhân',text:MysticalData.CYCLE_TEXT[pm],meta:`Tháng ${now.getMonth()+1}`},{value:pd,label:'Ngày cá nhân',text:MysticalData.CYCLE_TEXT[pd],meta:Format.vn(now,{day:'2-digit',month:'2-digit'})}];
    const clean=this.stripName(name),vowels=[...clean].filter(c=>'AEIOUY'.includes(c)).join(''),cons=[...clean].filter(c=>!'AEIOUY'.includes(c)).join('');
    const formulas=[['Số chủ đạo',`digits(${ds}) → tổng ${this.sumDigits(ds)} → ${values.life}`],['Số biểu đạt',`${clean||'—'} → Pythagoras 1–9 → ${values.expression}`],['Số linh hồn',`${vowels||'—'} → nguyên âm → ${values.soul}`],['Số nhân cách',`${cons||'—'} → phụ âm → ${values.personality}`],['Số thái độ',`${Number(ds.split('-')[1])} + ${Number(ds.split('-')[2])} → ${values.attitude}`],['Số trưởng thành',`${values.life} + ${values.expression} → ${values.maturity}`]];
    return {values,metrics,reading,cycles,formulas,synthesis:this.synthesis(values),genderReading:this.genderInsight(profile.gender,values.life,values.expression,values.soul,values.personality)};
  }
}
