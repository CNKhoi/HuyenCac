import { MysticalData } from '../data/mystical-data.js';
import { NumerologyCalculator } from './numerology-calculator.js';
import { LunarConverter } from './lunar-converter.js';

/** Pure Can Chi / horoscope model. No DOM access. */
export class AstrologyCalculator{
  static yearCanChi(y){const si=(y+6)%10,bi=(y+8)%12;return this.pack(si,bi)}
  static dayCanChi(date){const jd=LunarConverter.jdFromDate(date.getDate(),date.getMonth()+1,date.getFullYear()),si=((jd+9)%10+10)%10,bi=((jd+1)%12+12)%12;return {...this.pack(si,bi),jd}}
  static hourBranchIndex(time){if(!time)return null;const [h,m]=time.split(':').map(Number),mins=h*60+m;if(mins>=1380||mins<60)return 0;return Math.floor((mins-60)/120)+1}
  static hourCanChi(date,time){const bi=this.hourBranchIndex(time);if(bi===null)return null;const day=this.dayCanChi(date),si=((day.stemIndex%5)*2+bi)%10;return this.pack(si,bi)}
  static pack(si,bi){return {stemIndex:si,branchIndex:bi,stem:MysticalData.STEMS[si],branch:MysticalData.BRANCHES[bi],animal:MysticalData.ANIMALS[bi],element:MysticalData.STEM_ELEMENT[si]}}
  static relations(bi){const tri=MysticalData.TRINES.find(x=>x.includes(bi))||[],cl=MysticalData.CLASH.find(x=>x.includes(bi))||[];return {trine:tri.filter(x=>x!==bi),clash:cl.find(x=>x!==bi)}}
  static trineInfo(i){return MysticalData.TRINE_DETAIL.find(x=>x.members.includes(i))}
  static fourClashInfo(i){return MysticalData.FOUR_CLASH.find(x=>x.members.includes(i))}
  static branchFull(i){return `${MysticalData.BRANCHES[i]} (${MysticalData.ANIMALS[i]} • ${MysticalData.BRANCH_ELEMENT[i]} • ${MysticalData.BRANCH_POLARITY[i]})`}
  static stemFull(i){return `${MysticalData.STEMS[i]} (${MysticalData.STEM_ELEMENT[i]} • ${MysticalData.STEM_POLARITY[i]})`}
  static relationBetween(a,b){if(b===null||b===undefined)return 'Chưa có dữ liệu';if(a===b)return `Đồng chi ${MysticalData.BRANCHES[a]}`;const r=this.relations(a);if(r.trine.includes(b))return `Tam hợp — cùng nhóm ${this.trineInfo(a).name}`;if(r.clash===b)return `Lục xung / đối xung trực tiếp — ${MysticalData.BRANCHES[a]} ↔ ${MysticalData.BRANCHES[b]}`;if(MysticalData.SIX_HARMONY[a]===b)return `Lục hợp — ${MysticalData.BRANCHES[a]} ↔ ${MysticalData.BRANCHES[b]}`;const f=this.fourClashInfo(a);if(f?.members.includes(b))return `Cùng nhóm Tứ hành xung ${f.name}, nhưng không phải cặp đối xung trực tiếp`;return `Không thuộc Tam hợp, Lục hợp hoặc cặp đối xung trực tiếp`}
  static relationDescriptor(a,b){
    if(b===null||b===undefined)return {type:'missing',tone:'neutral',label:'Chưa có dữ liệu',detail:'Cần thêm dữ liệu để so sánh.'};
    if(a===b)return {type:'same',tone:'neutral',label:'Đồng Chi',detail:`Cùng Địa Chi ${MysticalData.BRANCHES[a]}.`};
    const rel=this.relations(a);
    if(rel.trine.includes(b))return {type:'trine',tone:'positive',label:'Tam hợp',detail:`${MysticalData.BRANCHES[a]} và ${MysticalData.BRANCHES[b]} cùng nhóm ${this.trineInfo(a).name}.`};
    if(MysticalData.SIX_HARMONY[a]===b)return {type:'harmony',tone:'positive',label:'Lục hợp',detail:`${MysticalData.BRANCHES[a]} và ${MysticalData.BRANCHES[b]} là cặp Lục hợp.`};
    if(rel.clash===b)return {type:'clash',tone:'caution',label:'Lục xung',detail:`${MysticalData.BRANCHES[a]} ↔ ${MysticalData.BRANCHES[b]} là cặp đối xung trực tiếp.`};
    const group=this.fourClashInfo(a);
    if(group?.members.includes(b))return {type:'four-clash',tone:'caution',label:'Cùng Tứ hành xung',detail:`Cùng nhóm ${group.name}, nhưng không phải cặp đối xung trực tiếp.`};
    return {type:'neutral',tone:'neutral',label:'Trung tính',detail:'Không thuộc Tam hợp, Lục hợp hoặc cặp Lục xung trực tiếp.'};
  }
  static western(ds){const [,m,d]=ds.split('-').map(Number),md=m*100+d;let idx=0;if(md>=120&&md<=218)idx=1;else if(md>=219&&md<=320)idx=2;else if(md>=321&&md<=419)idx=3;else if(md>=420&&md<=520)idx=4;else if(md>=521&&md<=620)idx=5;else if(md>=621&&md<=722)idx=6;else if(md>=723&&md<=822)idx=7;else if(md>=823&&md<=922)idx=8;else if(md>=923&&md<=1022)idx=9;else if(md>=1023&&md<=1121)idx=10;else if(md>=1122&&md<=1221)idx=11;return {name:MysticalData.ZODIAC[idx][0],symbol:MysticalData.ZODIAC[idx][1],text:MysticalData.ZODIAC[idx][2]}}
  static zodiacRange(name){return ({'Ma Kết':'22/12 – 19/01','Bảo Bình':'20/01 – 18/02','Song Ngư':'19/02 – 20/03','Bạch Dương':'21/03 – 19/04','Kim Ngưu':'20/04 – 20/05','Song Tử':'21/05 – 20/06','Cự Giải':'21/06 – 22/07','Sư Tử':'23/07 – 22/08','Xử Nữ':'23/08 – 22/09','Thiên Bình':'23/09 – 22/10','Bọ Cạp':'23/10 – 21/11','Nhân Mã':'22/11 – 21/12'})[name]||'—'}
  static kuaForYear(year,gender){if(!['male','female'].includes(gender))return null;const factor=NumerologyCalculator.reduce(NumerologyCalculator.sumDigits(String(year).slice(-2)),false);let n;if(year>=2000)n=gender==='male'?9-factor:6+factor;else n=gender==='male'?10-factor:5+factor;n=NumerologyCalculator.reduce(n,false);if(n===0)n=9;if(n===5)n=gender==='male'?2:8;return {number:n,...MysticalData.KUA_INFO[n]}}
  static genderLabel(g){return g==='male'?'Nam':g==='female'?'Nữ':g==='other'?'Khác':'Chưa chọn'}
  static genderInsight(g,kua,yc,dc,hc){if(!kua)return g==='other'?'Cung phi Bát Trạch truyền thống dùng công thức phân biệt Nam/Nữ, nên hệ thống không tự quy đổi khi hồ sơ chọn “Khác”.':'Chọn Nam hoặc Nữ trong hồ sơ để kích hoạt lớp Cung phi. Can Chi, Tam hợp và đối xung vẫn được tính bình thường.';const focus=g==='male'?'Quan sát cách bạn dùng tính chủ động, trách nhiệm và ranh giới trong công việc lẫn quan hệ.':'Quan sát cách bạn cân bằng tự chủ, ranh giới và trách nhiệm cảm xúc trong quan hệ và công việc.';return `<strong>${this.genderLabel(g)} • Cung ${kua.gua} ${kua.element} • Quái số ${kua.number}.</strong> Thuộc <strong>${kua.group}</strong>; nhóm phương vị tham khảo: ${kua.directions}. ${focus} Trụ năm <strong>${yc.stem} ${yc.branch}</strong>, trụ ngày <strong>${dc.stem} ${dc.branch}</strong>${hc?` và trụ giờ <strong>${hc.stem} ${hc.branch}</strong>`:''} không đổi theo giới tính.`}
  static elementSummary(counts,total){
    const entries=Object.entries(counts).sort((a,b)=>b[1]-a[1]);
    const dominant=entries[0],missing=entries.filter(([,c])=>c===0).map(([e])=>e),unique=entries.filter(([,c])=>c>0).length;
    return {dominant:dominant?.[0]||'—',dominantCount:dominant?.[1]||0,missing,unique,total,diversity:Math.round(unique/5*100)};
  }

  static stemElementRelation(a,b){
    if(a===b)return {label:`Đồng hành ${a}`,tone:'neutral',detail:`Hai Thiên Can cùng hành ${a}; trong mô hình hiện tại đây là quan hệ đồng pha.`};
    if(MysticalData.GENERATES[a]===b)return {label:`${a} sinh ${b}`,tone:'positive',detail:`Hành ${a} tạo sinh cho ${b}; đọc như dòng hỗ trợ từ trục trước sang trục sau.`};
    if(MysticalData.GENERATES[b]===a)return {label:`${b} sinh ${a}`,tone:'positive',detail:`Hành ${b} tạo sinh cho ${a}; đọc như trục sau có khả năng bổ sung nguồn lực cho trục trước.`};
    if(MysticalData.CONTROLS[a]===b)return {label:`${a} khắc ${b}`,tone:'caution',detail:`Hành ${a} khắc ${b}; nên đọc như một điểm ma sát hoặc yêu cầu điều tiết, không mặc định là xấu.`};
    if(MysticalData.CONTROLS[b]===a)return {label:`${b} khắc ${a}`,tone:'caution',detail:`Hành ${b} khắc ${a}; mô hình gợi một quan hệ cần quản trị thay vì để hai xu hướng kéo ngược nhau.`};
    return {label:'Quan hệ gián tiếp',tone:'neutral',detail:'Không có quan hệ sinh/khắc trực tiếp trong chu trình Ngũ hành đang dùng.'};
  }
  static polaritySummary(pillars){
    const values=[];pillars.forEach(x=>{if(!x)return;values.push(MysticalData.STEM_POLARITY[x.stemIndex],MysticalData.BRANCH_POLARITY[x.branchIndex])});
    const yang=values.filter(x=>x==='Dương').length,yin=values.length-yang;
    const label=Math.abs(yang-yin)<=1?'Tương đối cân bằng':yang>yin?'Nghiêng Dương':'Nghiêng Âm';
    return {yang,yin,total:values.length,label};
  }
  static expertReading(profile,d){
    const {yc,dc,hc,z,selectedKua,relationMatrix,elementSummary}=d;
    const yDay=this.stemElementRelation(yc.element,dc.element),dHour=hc?this.stemElementRelation(dc.element,hc.element):null,pol=this.polaritySummary([yc,dc,hc]);
    const positives=relationMatrix.filter(x=>x.tone==='positive').length,cautions=relationMatrix.filter(x=>x.tone==='caution').length;
    const branchConclusion=positives>cautions?'cấu trúc Chi thiên về liên kết/hỗ trợ':cautions>positives?'cấu trúc Chi có nhiều điểm ma sát cần quản trị':'cấu trúc Chi tương đối cân bằng, không có một hướng áp đảo';
    return `<div class="expert-report">
      <section class="expert-section expert-lead"><span class="expert-kicker">KẾT LUẬN ĐIỀU HÀNH</span><h4>${dc.stem} ${dc.branch} làm trục tham chiếu ngày sinh</h4><p>Trong cách đọc Tứ trụ, <strong>Thiên Can ngày</strong> thường được dùng làm mốc Nhật chủ. Bản ứng dụng này chỉ dùng trụ ngày như <strong>trục tham chiếu một phần</strong> vì chưa tính trụ tháng và không đánh giá vượng/suy, dụng thần hay đại vận. Với dữ liệu hiện có, Nhật Can <strong>${dc.stem} — ${dc.element}</strong> gợi mô-típ ${MysticalData.ELEMENT_TEXT[dc.element]}; còn ma trận Địa Chi cho thấy <strong>${branchConclusion}</strong>.</p></section>
      <section class="expert-section"><span class="expert-kicker">1. THIÊN CAN NĂM ↔ NGÀY</span><h4>${yc.stem} ${yc.element} ↔ ${dc.stem} ${dc.element} · ${yDay.label}</h4><p>${yDay.detail} Trụ năm thường được ứng dụng này dùng như lớp bối cảnh/gốc tuổi, trong khi trụ ngày làm mốc vận hành cá nhân. Vì vậy, quan hệ này hữu ích để quan sát xem môi trường nền và cách phản ứng cá nhân đang bổ trợ hay tạo ma sát.</p></section>
      ${hc?`<section class="expert-section"><span class="expert-kicker">2. THIÊN CAN NGÀY ↔ GIỜ</span><h4>${dc.stem} ${dc.element} ↔ ${hc.stem} ${hc.element} · ${dHour.label}</h4><p>${dHour.detail} Trong mô hình ứng dụng, trụ giờ được xem như lớp bổ sung cho cách biểu hiện ở phạm vi riêng tư/mục tiêu về sau; đây là diễn giải tham khảo chứ không thay thế Bát tự đầy đủ.</p></section>`:''}
      <section class="expert-section"><span class="expert-kicker">${hc?'3':'2'}. MA TRẬN ĐỊA CHI</span><h4>${positives} hỗ trợ · ${cautions} ma sát · ${relationMatrix.length-positives-cautions} trung tính</h4><p>${relationMatrix.map(x=>`<strong>${x.from}–${x.to}:</strong> ${x.a} ↔ ${x.b} = ${x.label}`).join(' · ')}. Khi có Lục xung/Tứ hành xung, nên đọc là vùng có xu hướng cần điều tiết hoặc thay đổi nhịp; không đồng nhất với “xấu”. Khi có Tam hợp/Lục hợp, đọc là vùng có tính liên kết dễ hình thành hơn.</p></section>
      <section class="expert-section"><span class="expert-kicker">${hc?'4':'3'}. ÂM DƯƠNG & NGŨ HÀNH</span><h4>${pol.label} · Dương ${pol.yang}/${pol.total} · Âm ${pol.yin}/${pol.total}</h4><p>Phân bố Âm/Dương hiện chỉ đếm Can và Chi của các trụ đang có dữ liệu. Thiên Can nổi bật là hành <strong>${elementSummary.dominant}</strong> (${elementSummary.dominantCount}/${elementSummary.total}). ${elementSummary.missing.length?`Các hành chưa xuất hiện ở lớp Thiên Can đang xét: <strong>${elementSummary.missing.join(', ')}</strong>.`:'Các hành đều có mặt trong dữ liệu đang xét.'} Không nên dùng thống kê này để kết luận cân bằng Ngũ hành toàn lá số vì thiếu trụ tháng và các lớp tàng can.</p></section>
      <section class="expert-section"><span class="expert-kicker">${hc?'5':'4'}. CUNG PHI & CUNG HOÀNG ĐẠO</span><h4>${selectedKua?`Cung ${selectedKua.gua} ${selectedKua.element} · ${selectedKua.group}`:'Chưa áp dụng Cung phi'} · ${z.name}</h4><p>${selectedKua?`Cung phi được tính theo giới tính và năm âm lịch trong công thức truyền thống của ứng dụng; nên dùng chủ yếu cho lớp tham khảo phương vị.`:'Chưa chọn Nam/Nữ nên hệ thống không ép quy đổi Cung phi.'} Cung hoàng đạo <strong>${z.name}</strong> bổ sung một mô-típ phương Tây: ${z.text}. Hai hệ quy chiếu này nên được đọc tách lớp, không cộng gộp thành một “điểm số số mệnh”.</p></section>
      <section class="expert-section expert-caution"><span class="expert-kicker">GIỚI HẠN MÔ HÌNH</span><h4>Chưa phải lá số Bát tự/Tử vi hoàn chỉnh</h4><p>Ứng dụng hiện có trụ năm, ngày và giờ; chưa dùng trụ tháng, tiết khí đầy đủ, tàng can, thập thần, vượng suy, dụng thần, đại vận/lưu niên. Vì vậy phần trên là <strong>phân tích cấu trúc Can Chi có kiểm soát</strong>, phù hợp để tham khảo và học hệ quy chiếu hơn là dự đoán chắc chắn tương lai.</p></section>
    </div>`;
  }

  static analyze(profile){
    const birth=new Date(profile.birthDate+'T12:00:00'),yc=this.yearCanChi(birth.getFullYear()),dc=this.dayCanChi(birth),hc=this.hourCanChi(birth,profile.birthTime),lunar=LunarConverter.fromDate(birth),z=this.western(profile.birthDate),rel=this.relations(yc.branchIndex),tri=this.trineInfo(yc.branchIndex),four=this.fourClashInfo(yc.branchIndex),harm=MysticalData.SIX_HARMONY[yc.branchIndex];
    const maleKua=this.kuaForYear(lunar.year,'male'),femaleKua=this.kuaForYear(lunar.year,'female'),selectedKua=this.kuaForYear(lunar.year,profile.gender);
    const elements=[yc.element,dc.element,...(hc?[hc.element]:[])],counts={Mộc:0,Hỏa:0,Thổ:0,Kim:0,Thủy:0};elements.forEach(e=>counts[e]++);const total=elements.length,elementSummary=this.elementSummary(counts,total);
    const relationsMain=[
      ['Địa Chi năm sinh',this.branchFull(yc.branchIndex),`Tuổi ${yc.animal}; đây là Chi làm mốc cho các quan hệ bên dưới.`],
      ['Tam hợp',`${tri.name} • ${tri.bureau}`,`Ba Chi trong nhóm: ${tri.members.map(i=>this.branchFull(i)).join(' • ')}.`],
      ['Lục hợp / Nhị hợp',`${this.branchFull(yc.branchIndex)} ↔ ${this.branchFull(harm)}`,`Cặp hợp trực tiếp của Chi ${yc.branch} là ${MysticalData.BRANCHES[harm]}.`],
      ['Lục xung / Đối xung',`${this.branchFull(yc.branchIndex)} ↔ ${this.branchFull(rel.clash)}`,`Đây là Chi nằm đối diện trực tiếp với ${yc.branch} trong vòng 12 Địa Chi.`],
      ['Tứ hành xung',four.name,`Nhóm gồm: ${four.members.map(i=>this.branchFull(i)).join(' • ')}. Không phải mọi cặp trong nhóm đều đối xung trực tiếp.`]
    ];
    const relationExtra=[['Chi ngày sinh',this.branchFull(dc.branchIndex),`So với Chi năm ${yc.branch}: ${this.relationBetween(yc.branchIndex,dc.branchIndex)}.`],['Chi giờ sinh',hc?this.branchFull(hc.branchIndex):'Chưa nhập giờ sinh',hc?`So với Chi năm ${yc.branch}: ${this.relationBetween(yc.branchIndex,hc.branchIndex)}.`:'Nhập giờ sinh để xác định Địa Chi giờ.'],['Nam cùng năm sinh',`${tri.name} • đối xung ${yc.branch} ↔ ${MysticalData.BRANCHES[rel.clash]}`,'Các quan hệ Địa Chi không đổi theo giới tính.'],['Nữ cùng năm sinh',`${tri.name} • đối xung ${yc.branch} ↔ ${MysticalData.BRANCHES[rel.clash]}`,'Khác biệt Nam/Nữ nằm ở Cung phi, không phải Tam hợp.']];
    const relationMatrix=[
      {from:'Năm',to:'Ngày',a:yc.branch,b:dc.branch,...this.relationDescriptor(yc.branchIndex,dc.branchIndex)},
      ...(hc?[{from:'Năm',to:'Giờ',a:yc.branch,b:hc.branch,...this.relationDescriptor(yc.branchIndex,hc.branchIndex)},{from:'Ngày',to:'Giờ',a:dc.branch,b:hc.branch,...this.relationDescriptor(dc.branchIndex,hc.branchIndex)}]:[])
    ];
    const positives=relationMatrix.filter(x=>x.tone==='positive').length,cautions=relationMatrix.filter(x=>x.tone==='caution').length;
    const structureLabel=positives>cautions?'Thiên về liên kết':cautions>positives?'Có điểm ma sát cần đọc kỹ':'Cân bằng / trung tính';
    const deepInsights=[
      {label:'CẤU TRÚC ĐỊA CHI',value:structureLabel,detail:`Trong ${relationMatrix.length} cặp trụ có dữ liệu: ${positives} quan hệ hỗ trợ, ${cautions} quan hệ cần lưu ý và ${relationMatrix.length-positives-cautions} quan hệ trung tính/đồng Chi.`},
      {label:'THIÊN CAN NỔI BẬT',value:elementSummary.dominant,detail:`Hành ${elementSummary.dominant} xuất hiện ${elementSummary.dominantCount}/${total} Thiên Can đang có dữ liệu. ${elementSummary.missing.length?`Chưa xuất hiện: ${elementSummary.missing.join(', ')}.`:'Cả năm hành đều có mặt trong dữ liệu đang xét.'}`},
      {label:'CUNG PHI',value:selectedKua?`${selectedKua.gua} • ${selectedKua.element}`:'Chưa áp dụng',detail:selectedKua?`Quái số ${selectedKua.number}, thuộc ${selectedKua.group}. Đây là lớp thay đổi theo Nam/Nữ trong mô hình hiện tại.`:'Cần chọn Nam hoặc Nữ nếu muốn áp dụng công thức Cung phi truyền thống.'}
    ];
    const partial={birth,yc,dc,hc,lunar,z,rel,tri,four,harm,maleKua,femaleKua,selectedKua,counts,total,elementSummary,relationsMain,relationExtra,relationMatrix,deepInsights};
    const reading=this.expertReading(profile,partial);
    return {...partial,reading};
  }
}
