import { MysticalData } from '../data/mystical-data.js';
import { Format } from '../utils/format.js';
import { NumerologyCalculator } from './numerology-calculator.js';
import { AstrologyCalculator } from './astrology-calculator.js';

/** Pure Tarot model. Deterministic by profile + query + calendar day. */
export class TarotEngine{
  static hash(str){let h=2166136261>>>0;for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}
  static rng(seed){return()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=seed;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}
  static normalize(q){return(q||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^\p{L}\p{N}]+/gu,' ').trim()}
  static topicInterpret(topic,position,meaning){const lens=MysticalData.TOPIC_LENS[topic]||MysticalData.TOPIC_LENS.general,verbs=['Nền tảng của vấn đề đang gợi','Trọng tâm hiện tại đang cho thấy','Hướng xử lý đáng cân nhắc là'];return `${verbs[position]} ${lens[position]}: ${meaning}.`}

  static phase(cardIndex){
    if(cardIndex<=6)return {key:'initiation',label:'Khởi mở & lựa chọn',detail:'nhóm 0–VI thường được dùng để soi cách một hành trình, giá trị hoặc lựa chọn đang hình thành'};
    if(cardIndex<=11)return {key:'agency',label:'Ý chí & điều chỉnh',detail:'nhóm VII–XI nhấn mạnh khả năng điều hướng, sức bền, trách nhiệm và cân bằng'};
    if(cardIndex<=16)return {key:'transform',label:'Chuyển hóa & tái cấu trúc',detail:'nhóm XII–XVI thường gợi việc đổi góc nhìn, buông cũ hoặc tái cấu trúc'};
    return {key:'integrate',label:'Hồi phục & tích hợp',detail:'nhóm XVII–XXI thường nghiêng về định hướng, sáng rõ, tổng kết và tích hợp'};
  }

  static synthesize(picks,meanings,mode,topic){
    const upright=picks.filter(p=>!p.reversed).length,reversed=picks.length-upright;
    const phases=picks.reduce((acc,p)=>{const phase=this.phase(p.cardIndex);acc[phase.key]=(acc[phase.key]||{...phase,count:0});acc[phase.key].count++;return acc},{});
    const dominant=Object.values(phases).sort((a,b)=>b.count-a.count)[0];
    const avgIndex=picks.reduce((s,p)=>s+p.cardIndex,0)/picks.length;
    const tempo=avgIndex<7?'Năng lượng mở đầu':avgIndex<14?'Giai đoạn điều chỉnh':'Giai đoạn tích hợp';
    const orientation=reversed===0?'Dòng chảy khá trực tiếp':reversed>=Math.ceil(picks.length/2)?'Nhiều điểm cần rà soát':'Có cả thuận dòng và điểm cần xem lại';
    const focus=mode==='auto'?'toàn cảnh sáu vùng':`chủ đề ${MysticalData.TOPIC_NAME[topic]?.toLowerCase()||'đang xem'}`;
    return {
      upright,reversed,dominant,tempo,orientation,
      cards:[
        {label:'XUÔI / NGƯỢC',value:`${upright} / ${reversed}`,detail:`${orientation}. Lá ngược được dùng như dấu hiệu cần rà soát, không mặc định là tiêu cực.`},
        {label:'PHA NỔI BẬT',value:dominant?.label||'—',detail:dominant?`${dominant.count}/${picks.length} lá nằm trong pha “${dominant.label}”; ${dominant.detail}.`:'—'},
        {label:'NHỊP TRẢI BÀI',value:tempo,detail:`Chỉ số thứ tự trung bình của Major Arcana là ${avgIndex.toFixed(1)}/21; dùng để mô tả nhịp biểu tượng của ${focus}, không phải xác suất dự báo.`}
      ],
      thread:`Mạch chung của trải bài đang nghiêng về <strong>${dominant?.label||'nhiều lớp khác nhau'}</strong>. ${orientation}. Khi đọc sâu, ưu tiên đối chiếu thông điệp của từng lá với dữ kiện thực tế thay vì coi chuỗi lá là một dự báo cố định.`
    };
  }

  static draw(profile,{mode,topic,question,presetQuestion},date=new Date()){
    let q='',qKey='',count=3,positions=[],domains=[];topic=mode==='auto'?'auto':topic;
    if(mode==='auto'){q='Toàn cảnh cá nhân hôm nay';qKey='auto-all';count=MysticalData.AUTO_DOMAINS.length;domains=MysticalData.AUTO_DOMAINS;positions=domains.map(x=>x.label)}
    else if(mode==='open'){q=`Không câu hỏi • ${MysticalData.TOPIC_NAME[topic]}`;qKey=`open-${topic}`;positions=['NỀN TẢNG','TRỌNG TÂM HIỆN TẠI','HƯỚNG TIẾP CẬN']}
    else if(mode==='preset'){q=presetQuestion||MysticalData.TAROT_PRESETS[topic][0];qKey=this.normalize(q);positions=['NỀN TẢNG','TRỌNG TÂM HIỆN TẠI','HƯỚNG TIẾP CẬN']}
    else{q=(question||'').trim();if(q.length<6)throw new Error('Hãy nhập câu hỏi rõ hơn (ít nhất 6 ký tự), hoặc chọn Auto/Không câu hỏi.');qKey=this.normalize(q);positions=['NỀN TẢNG','TRỌNG TÂM HIỆN TẠI','HƯỚNG TIẾP CẬN']}

    const today=Format.iso(date),base=[NumerologyCalculator.stripName(profile.fullName),profile.birthDate,profile.birthTime||'',profile.gender||'',mode,topic,qKey,today].join('|'),seed=this.hash(base),rand=this.rng(seed),pool=MysticalData.TAROT.map((_,i)=>i),picks=[];
    for(let i=0;i<count;i++){const idx=Math.floor(rand()*pool.length),ci=pool.splice(idx,1)[0];picks.push({card:MysticalData.TAROT[ci],cardIndex:ci,reversed:rand()<.32})}
    const meanings=picks.map(p=>p.reversed?p.card[3]:p.card[2]),yc=AstrologyCalculator.yearCanChi(new Date(profile.birthDate+'T12:00:00').getFullYear()),lp=NumerologyCalculator.lifePath(profile.birthDate),context=[mode==='auto'?'Auto toàn cảnh':mode==='open'?'Không câu hỏi':mode==='preset'?'Câu hỏi gợi ý':'Tự đặt câu hỏi',...(mode==='auto'?[]:[MysticalData.TOPIC_NAME[topic]]),`Ngày ${Format.vn(date,{day:'2-digit',month:'2-digit',year:'numeric'})}`,`Hồ sơ ${AstrologyCalculator.genderLabel(profile.gender)}`,`Số chủ đạo ${lp}`,`${yc.stem} ${yc.branch}`];
    const synthesis=this.synthesize(picks,meanings,mode,topic);
    let summary,actions;
    if(mode==='auto'){
      summary=`<h4>1. Mạch biểu tượng tổng thể</h4><p>${synthesis.thread}</p><h4>2. Toàn cảnh sáu vùng</h4><p>Trải bài dùng sáu vị trí độc lập. Có <strong>${synthesis.reversed}/${count} lá ngược</strong>; lá ngược được đọc như vùng cần rà soát hoặc điều chỉnh nhiều hơn, không mặc định là “xấu”.</p>`+domains.map((d,i)=>`<h4>${i+3}. ${d.title} — ${picks[i].card[1]}</h4><p>Ở vùng <strong>${d.lens}</strong>, thông điệp trọng tâm là <strong>${meanings[i]}</strong>. Lá này nằm trong pha <strong>${this.phase(picks[i].cardIndex).label}</strong>; hãy đối chiếu với dữ kiện thực tế trong 7–30 ngày gần nhất.</p>`).join('')+`<h4>${domains.length+3}. Cách sử dụng kết quả</h4><p>Chọn tối đa 1–2 vùng phản ánh đúng tình hình nhất để hành động. Các vùng còn lại nên được xem như câu hỏi kiểm tra.</p>`;
      actions=['Chọn 2 trong 6 vùng có liên hệ thực tế rõ nhất với cuộc sống hiện tại.',`Với vùng “${domains[5].title}”, viết ra một việc nằm trong quyền kiểm soát có thể làm trong 72 giờ.`,`Kiểm tra xem pha “${synthesis.dominant?.label||'nổi bật'}” có đang phản ánh một thay đổi thực tế hay chỉ là cảm giác nhất thời.`,'Nếu một lá khiến bạn lo lắng, kiểm tra lại bằng dữ kiện thay vì rút lại để tìm kết quả dễ chịu hơn.'];
    }else{
      const source=mode==='open'?`chủ đề ${MysticalData.TOPIC_NAME[topic].toLowerCase()}`:'câu hỏi đã chọn';
      summary=`<h4>1. Mạch diễn biến</h4><p>Nền tảng của ${source} xoay quanh <strong>${meanings[0]}</strong>. Ở hiện tại, lá thứ hai chuyển trọng tâm sang <strong>${meanings[1]}</strong>. Lá cuối được đọc như hướng xử lý hoặc điều cần kiểm chứng: <strong>${meanings[2]}</strong>.</p><h4>2. Mẫu biểu tượng</h4><p>${synthesis.thread}</p><h4>3. Liên hệ với ${MysticalData.TOPIC_NAME[topic].toLowerCase()}</h4><p>${this.topicInterpret(topic,0,meanings[0])} ${this.topicInterpret(topic,1,meanings[1])} ${this.topicInterpret(topic,2,meanings[2])}</p><h4>4. Điểm cần kiểm chứng ngoài đời thực</h4><p>Phân biệt ba lớp: dữ kiện đã biết, giả định chưa xác nhận và phần bạn có thể chủ động thay đổi.</p>`;
      actions=[`Viết ra một dữ kiện thực tế đang củng cố hoặc bác bỏ thông điệp của lá ${picks[1].card[1]}.`,`Chọn một hành động nhỏ liên quan đến “${MysticalData.TOPIC_LENS[topic][2]}” trong 24–72 giờ.`,`Đối chiếu pha “${synthesis.dominant?.label||'nổi bật'}” với tình huống hiện tại: điều gì đang bắt đầu, cần điều chỉnh, chuyển hóa hoặc khép lại?`,'Không rút lại chỉ vì không thích kết quả; nếu đổi câu hỏi hoặc bối cảnh, hãy thay dữ liệu đầu vào trước.'];
    }
    return {mode,topic,q,seed,session:(seed>>>0).toString(16).toUpperCase().padStart(8,'0'),positions,domains,picks,meanings,context,synthesis,summary,actions};
  }
}
