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
  static phase(cardIndex){if(cardIndex<=6)return {key:'initiation',rank:1,label:'Khởi mở & lựa chọn',detail:'nhóm 0–VI thường được dùng để soi cách một hành trình, giá trị hoặc lựa chọn đang hình thành'};if(cardIndex<=11)return {key:'agency',rank:2,label:'Ý chí & điều chỉnh',detail:'nhóm VII–XI nhấn mạnh khả năng điều hướng, sức bền, trách nhiệm và cân bằng'};if(cardIndex<=16)return {key:'transform',rank:3,label:'Chuyển hóa & tái cấu trúc',detail:'nhóm XII–XVI thường gợi việc đổi góc nhìn, buông cũ hoặc tái cấu trúc'};return {key:'integrate',rank:4,label:'Hồi phục & tích hợp',detail:'nhóm XVII–XXI thường nghiêng về định hướng, sáng rõ, tổng kết và tích hợp'}}

  static synthesize(picks,meanings,mode,topic){
    const upright=picks.filter(p=>!p.reversed).length,reversed=picks.length-upright;
    const phases=picks.reduce((acc,p)=>{const phase=this.phase(p.cardIndex);acc[phase.key]=(acc[phase.key]||{...phase,count:0});acc[phase.key].count++;return acc},{});
    const dominant=Object.values(phases).sort((a,b)=>b.count-a.count)[0],avgIndex=picks.reduce((s,p)=>s+p.cardIndex,0)/picks.length;
    const tempo=avgIndex<7?'Năng lượng mở đầu':avgIndex<14?'Giai đoạn điều chỉnh':'Giai đoạn tích hợp';
    const orientation=reversed===0?'Dòng chảy khá trực tiếp':reversed>=Math.ceil(picks.length/2)?'Nhiều điểm cần rà soát':'Có cả thuận dòng và điểm cần xem lại';
    const focus=mode==='auto'?'toàn cảnh sáu vùng':`chủ đề ${MysticalData.TOPIC_NAME[topic]?.toLowerCase()||'đang xem'}`;
    const phaseRanks=picks.map(p=>this.phase(p.cardIndex).rank),direction=phaseRanks.at(-1)-phaseRanks[0];
    const movement=direction>=2?'Dịch chuyển mạnh về phía tích hợp / hoàn tất':direction===1?'Có xu hướng tiến sang giai đoạn kế tiếp':direction===0?'Các lá đang xoay quanh cùng một tầng vấn đề':'Có xu hướng quay lại xử lý nền tảng hoặc vấn đề chưa hoàn tất';
    const reversedPositions=picks.map((p,i)=>p.reversed?i:null).filter(i=>i!==null);
    return {upright,reversed,dominant,tempo,orientation,movement,reversedPositions,
      cards:[
        {label:'XUÔI / NGƯỢC',value:`${upright} / ${reversed}`,detail:`${orientation}. Lá ngược được dùng như dấu hiệu cần rà soát, không mặc định là tiêu cực.`},
        {label:'PHA NỔI BẬT',value:dominant?.label||'—',detail:dominant?`${dominant.count}/${picks.length} lá nằm trong pha “${dominant.label}”; ${dominant.detail}.`:'—'},
        {label:'NHỊP TRẢI BÀI',value:tempo,detail:`Chỉ số thứ tự trung bình của Major Arcana là ${avgIndex.toFixed(1)}/21; mô tả nhịp biểu tượng của ${focus}, không phải xác suất dự báo.`}
      ],
      thread:`Mạch chung đang nghiêng về <strong>${dominant?.label||'nhiều lớp khác nhau'}</strong>. ${orientation}. Về hướng dịch chuyển, trải bài cho thấy <strong>${movement.toLowerCase()}</strong>.`};
  }

  static expertSummary({mode,topic,picks,meanings,domains,synthesis}){
    if(mode==='auto'){
      const priority=picks.map((p,i)=>({i,score:(p.reversed?3:0)+this.phase(p.cardIndex).rank})).sort((a,b)=>b.score-a.score).slice(0,2).map(x=>x.i);
      const p1=domains[priority[0]],p2=domains[priority[1]];
      return `<div class="expert-report">
        <section class="expert-section expert-lead"><span class="expert-kicker">KẾT LUẬN ĐIỀU HÀNH</span><h4>${synthesis.dominant?.label||'Nhiều lớp'} · ${synthesis.orientation}</h4><p>${synthesis.thread} Với trải bài sáu vùng, điều quan trọng không phải “lá nào tốt/xấu” mà là <strong>vùng nào đang đòi hỏi kiểm chứng và hành động nhiều nhất</strong>. Hai vùng nổi bật theo cấu trúc hiện tại là <strong>${p1?.title||'—'}</strong> và <strong>${p2?.title||'—'}</strong>.</p></section>
        <section class="expert-section"><span class="expert-kicker">1. CẤU TRÚC TRẢI BÀI</span><h4>${synthesis.upright} lá xuôi · ${synthesis.reversed} lá ngược</h4><p>${synthesis.reversed===0?'Không có lá ngược, nên mạch đọc khá trực tiếp; vẫn cần tránh đồng nhất “xuôi” với chắc chắn thuận lợi.':synthesis.reversed>=3?'Tỷ lệ lá ngược cao cho thấy nhiều vùng nên được đọc theo hướng rà soát giả định, giới hạn hoặc phần chưa vận hành trơn tru.':'Có một số điểm nghẽn nhưng không chiếm toàn bộ trải bài.'} ${synthesis.movement}.</p></section>
        ${domains.map((d,i)=>`<section class="expert-section"><span class="expert-kicker">${i+2}. ${d.title.toUpperCase()}</span><h4>${picks[i].card[1]} · ${picks[i].reversed?'Lá ngược':'Lá xuôi'}</h4><p>Trong vùng <strong>${d.lens}</strong>, tín hiệu chính là <strong>${meanings[i]}</strong>. Lá thuộc pha <strong>${this.phase(picks[i].cardIndex).label}</strong>. Khi kiểm chứng, hãy tìm một ví dụ thực tế trong 7–30 ngày gần nhất: quyết định nào, hành vi nào hoặc dữ kiện nào đang phản ánh đúng mô-típ này?</p></section>`).join('')}
        <section class="expert-section expert-caution"><span class="expert-kicker">PHƯƠNG PHÁP ĐỌC CHUYÊN SÂU</span><h4>Tách biểu tượng khỏi dự báo</h4><p>Hãy phân loại từng thông điệp thành ba nhóm: <strong>dữ kiện đã có</strong>, <strong>giả định cần kiểm chứng</strong> và <strong>hành động nằm trong quyền kiểm soát</strong>. Chỉ ưu tiên hành động khi ít nhất một thông điệp khớp với dữ liệu thực tế; không dùng trải bài thay cho quyết định y tế, pháp lý hoặc tài chính.</p></section>
      </div>`;
    }
    const mid=1,critical=synthesis.reversedPositions.includes(mid)?mid:(synthesis.reversedPositions[0]??mid),source=mode==='open'?`chủ đề ${MysticalData.TOPIC_NAME[topic].toLowerCase()}`:'câu hỏi đã chọn';
    return `<div class="expert-report">
      <section class="expert-section expert-lead"><span class="expert-kicker">KẾT LUẬN ĐIỀU HÀNH</span><h4>${synthesis.movement}</h4><p>Nền của ${source} là <strong>${meanings[0]}</strong>; điểm đang chi phối hiện tại chuyển sang <strong>${meanings[1]}</strong>; hướng xử lý được gợi bởi <strong>${meanings[2]}</strong>. Vì vậy, trọng tâm không phải đoán kết quả cuối cùng mà là nhận ra <strong>cơ chế chuyển từ trạng thái hiện tại sang hành động kế tiếp</strong>.</p></section>
      <section class="expert-section"><span class="expert-kicker">1. NGUYÊN NHÂN / NỀN TẢNG</span><h4>${picks[0].card[1]} · ${picks[0].reversed?'Ngược':'Xuôi'}</h4><p>${this.topicInterpret(topic,0,meanings[0])} Đây là lớp nên dùng để nhận diện bối cảnh đã hình thành vấn đề; tránh nhầm nguyên nhân nền với tình trạng nhất thời.</p></section>
      <section class="expert-section"><span class="expert-kicker">2. NÚT THẮT HIỆN TẠI</span><h4>${picks[1].card[1]} · ${picks[1].reversed?'Ngược':'Xuôi'}</h4><p>${this.topicInterpret(topic,1,meanings[1])} ${critical===1?'Lá trung tâm đồng thời là điểm cần rà soát mạnh nhất, nên đây là nơi đáng kiểm chứng trước tiên.':'Lá trung tâm là trục nối giữa nền tảng và hướng hành động.'}</p></section>
      <section class="expert-section"><span class="expert-kicker">3. HƯỚNG HÀNH ĐỘNG</span><h4>${picks[2].card[1]} · ${picks[2].reversed?'Ngược':'Xuôi'}</h4><p>${this.topicInterpret(topic,2,meanings[2])} Hãy chuyển thông điệp thành một hành động nhỏ có thời hạn 24–72 giờ; nếu không thể diễn đạt thành hành động kiểm chứng được, coi nó là câu hỏi phản tư thay vì kết luận.</p></section>
      <section class="expert-section"><span class="expert-kicker">4. CẤU TRÚC BIỂU TƯỢNG</span><h4>${synthesis.dominant?.label||'Nhiều lớp'} · ${synthesis.orientation}</h4><p>${synthesis.thread} Lá cần chú ý nhất theo cấu trúc là <strong>${picks[critical].card[1]}</strong>, vì nó ${picks[critical].reversed?'đang ở trạng thái ngược / cần rà soát':'nằm ở vị trí trung tâm của mạch diễn biến'}.</p></section>
      <section class="expert-section expert-caution"><span class="expert-kicker">5. KIỂM CHỨNG NGOÀI ĐỜI</span><h4>Ba câu hỏi bắt buộc trước khi kết luận</h4><p><strong>1)</strong> Dữ kiện nào đang xác nhận thông điệp? <strong>2)</strong> Tôi đang giả định điều gì mà chưa có bằng chứng? <strong>3)</strong> Việc nhỏ nhất tôi có thể làm để kiểm tra giả định trong 72 giờ là gì? Cách đọc này giúp Tarot giữ vai trò phản tư thay vì trở thành dự báo cứng.</p></section>
    </div>`;
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
    const synthesis=this.synthesize(picks,meanings,mode,topic),summary=this.expertSummary({mode,topic,picks,meanings,domains,synthesis});
    const actions=mode==='auto'?[`Chọn 2 vùng có liên hệ thực tế rõ nhất và ghi 1 dữ kiện xác nhận cho mỗi vùng.`,`Với vùng ưu tiên, đặt một hành động có thể hoàn tất trong 72 giờ.`,`Nếu một lá ngược gây lo lắng, xác định điều gì đang nằm ngoài quyền kiểm soát và điều gì vẫn có thể xử lý.`,`Không rút lại chỉ để tìm kết quả dễ chịu hơn; chỉ đổi trải bài khi câu hỏi hoặc dữ liệu đầu vào thực sự thay đổi.`]:[`Ghi một dữ kiện đang củng cố hoặc bác bỏ thông điệp của lá trung tâm ${picks[1].card[1]}.`,`Chuyển lá thứ ba thành một hành động cụ thể trong 24–72 giờ.`,`Viết riêng “điều tôi biết” và “điều tôi đang suy đoán” để tránh nhập hai lớp thành một.`,`Nếu quyết định có hậu quả lớn, dùng Tarot như lớp phản tư bổ sung chứ không thay dữ liệu/chuyên môn thực tế.`];
    return {mode,topic,q,seed,session:(seed>>>0).toString(16).toUpperCase().padStart(8,'0'),positions,domains,picks,meanings,context,synthesis,summary,actions};
  }
}
