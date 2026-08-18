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
    if(n===11)return 'Trực giác';if(n===22)return 'Kiến tạo';if(n===33)return 'Phụng sự';
    const b=this.baseNumber(n);if([1,8].includes(b))return 'Chủ động';if([2,6].includes(b))return 'Kết nối';if([3,5].includes(b))return 'Biểu đạt';if(b===4)return 'Cấu trúc';if(b===7)return 'Chiêm nghiệm';return 'Nhân văn';
  }

  static alignmentNarrative(label,a,b){
    const x=this.alignment(a,b);
    let interpretation='';
    if(x.score>=88)interpretation='hai trục gần nhau, nên nhu cầu bên trong và cách vận hành có xu hướng dễ phối hợp; rủi ro là quá tin vào một cách làm quen thuộc.';
    else if(x.score>=66)interpretation='hai trục có nền chung nhưng vẫn tạo khác biệt đủ để bổ trợ; hiệu quả nhất khi bạn chủ động phân vai thay vì để chúng cạnh tranh.';
    else if(x.score>=44)interpretation='hai trục khá khác nhịp; đây không nhất thiết là mâu thuẫn, nhưng thường đòi hỏi bạn chuyển chế độ tùy bối cảnh.';
    else interpretation='độ tương phản cao; nếu thiếu tự quan sát, bạn có thể cảm thấy mình muốn một đằng nhưng lại biểu hiện hoặc hành động theo một hướng khác.';
    return {label,...x,interpretation};
  }

  static synthesis(values){
    const lifeExpression=this.alignment(values.life,values.expression),innerOuter=this.alignment(values.soul,values.personality),currentCycle=this.alignment(values.life,values.personalYear);
    const core=[values.life,values.expression,values.soul,values.personality,values.birthday,values.attitude,values.maturity];
    const familyCounts=core.reduce((acc,n)=>{const f=this.family(n);acc[f]=(acc[f]||0)+1;return acc},{});
    const dominant=Object.entries(familyCounts).sort((a,b)=>b[1]-a[1])[0]||['—',0];
    const axes=[
      {label:'Chủ đạo ↔ Biểu đạt',...lifeExpression,detail:`So sánh hướng vận hành từ ngày sinh (${values.life}) với cách năng lực được biểu đạt qua họ tên (${values.expression}).`},
      {label:'Linh hồn ↔ Nhân cách',...innerOuter,detail:`So sánh động lực bên trong (${values.soul}) với lớp biểu hiện người khác dễ nhận thấy (${values.personality}).`},
      {label:'Chủ đạo ↔ Năm cá nhân',...currentCycle,detail:`So sánh trục dài hạn (${values.life}) với nhịp của năm hiện tại (${values.personalYear}).`}
    ];
    const insights=[
      {label:'CỤM NỔI BẬT',value:dominant[0],detail:`${dominant[1]}/${core.length} chỉ số lõi nằm trong nhóm quy ước “${dominant[0]}”. Mẫu lặp này hữu ích để tìm chủ đề chung, nhưng không phải phép đo khoa học.`},
      {label:'TRONG ↔ NGOÀI',value:innerOuter.state,detail:`Linh hồn ${values.soul} và Nhân cách ${values.personality} có mức giao thoa nội bộ ${innerOuter.score}/100. Điểm này chỉ biểu diễn khoảng cách số học sau rút gọn.`},
      {label:'NHỊP HIỆN TẠI',value:currentCycle.state,detail:`Năm cá nhân ${values.personalYear} ${currentCycle.score>=66?'khá gần':'khá khác'} với trục Chủ đạo ${values.life}; nên đọc như gợi ý về nhịp ưu tiên, không phải dự báo.`}
    ];
    return {axes,insights,familyCounts,dominantFamily:dominant[0],dominantCount:dominant[1]};
  }

  static expertReading(values,now){
    const li=this.info(values.life),ei=this.info(values.expression),si=this.info(values.soul),pi=this.info(values.personality),mi=this.info(values.maturity);
    const le=this.alignment(values.life,values.expression),io=this.alignment(values.soul,values.personality),cycleRel=this.alignment(values.life,values.personalYear);
    const pm=this.personalMonthFromValues(values,now),pd=this.personalDayFromValues(values,now),dominant=this.synthesis(values).dominantFamily;
    const style=le.score>=80
      ?`Điều bạn muốn trở thành và cách bạn thường thể hiện ra ngoài khá cùng hướng. Khi đã tin vào một việc, bạn có xu hướng huy động năng lực tương đối liền mạch. Điểm cần để ý là đừng biến “đúng phong cách của mình” thành lý do để bỏ qua phản hồi.`
      :le.score>=58
      ?`Bên trong bạn có một hướng khá rõ, nhưng cách triển khai ra ngoài không phải lúc nào cũng đi cùng một nhịp. Đây thường là dạng hồ sơ có khả năng thích nghi tốt: cùng một mục tiêu nhưng có thể dùng nhiều cách tiếp cận. Khi mệt hoặc chịu áp lực, sự linh hoạt này dễ biến thành phân tán.`
      :`Giữa động lực cốt lõi và cách biểu đạt có độ tương phản đáng kể. Bạn có thể muốn một điều nhưng lại hành động theo cách khiến người khác hiểu thành một điều khác. Điểm mấu chốt không phải “sửa con số”, mà là học cách gọi tên nhu cầu trước khi phản ứng.`;
    const inner=io.score>=80
      ?`Điều bạn cần ở bên trong khá dễ đi ra thành cách cư xử mà người khác nhìn thấy. Ưu điểm là tính nhất quán; mặt trái là đôi khi bạn cho rằng người khác “phải tự hiểu” vì với bạn mọi thứ vốn đã rõ.`
      :io.score>=58
      ?`Bạn không phải lúc nào cũng biểu lộ đúng mức điều mình đang cần. Có lúc bạn rất hiểu cảm xúc hoặc mong muốn của mình, nhưng lớp bên ngoài lại chọn một cách nói an toàn hơn. Vì vậy giao tiếp rõ nhu cầu sẽ hữu ích hơn việc chờ người khác đoán.`
      :`Khoảng cách giữa đời sống bên trong và hình ảnh bên ngoài khá rõ trong mô hình này. Người khác có thể gặp một phiên bản rất khác với điều bạn thực sự đang trải qua. Nếu gần đây thường xuyên thấy “không ai hiểu mình”, hãy kiểm tra trước xem bạn đã nói đủ cụ thể hay chưa.`;
    const cycle=cycleRel.score>=70
      ?`Nhịp năm ${values.personalYear} đang khá thuận với cách bạn vốn vận hành. Đây là thời điểm hợp để làm sâu những gì đã chứng minh được hiệu quả, thay vì mở quá nhiều hướng chỉ vì cảm giác phải thay đổi.`
      :`Nhịp năm ${values.personalYear} đang yêu cầu một kiểu vận hành hơi khác thói quen dài hạn. Cảm giác “không đúng nhịp” không nhất thiết là dấu hiệu xấu; nó có thể là giai đoạn buộc bạn học thêm một năng lực mà bình thường ít dùng.`;
    const shadow=li[2];
    return `
      <div class="fortune-narrative">
        <section class="fortune-lead-story"><span class="expert-kicker">BỨC TRANH CHUNG</span><h4>${li[0]} — nhưng không chỉ có một con số</h4><p>Nếu đọc toàn hồ sơ như một câu chuyện, trục chính của bạn nghiêng về <strong>${li[1]}</strong>. Cụm chủ đề lặp lại nhiều nhất thuộc nhóm <strong>${dominant}</strong>, nên đây có thể là kiểu năng lượng bạn dùng khá tự nhiên trong công việc, quan hệ hoặc lúc ra quyết định. Tuy nhiên, điểm đáng giá nhất không nằm ở nhãn “số ${values.life}”, mà ở việc nhận ra <strong>khi nào thế mạnh này giúp bạn tiến lên và khi nào nó bị dùng quá mức</strong>.</p></section>
        <div class="fortune-story-grid">
          <section class="fortune-story-block"><span class="expert-kicker">KHI BẠN Ở TRẠNG THÁI TỐT</span><h4>Bạn phát huy mạnh khi có không gian dùng đúng cách của mình</h4><p>${style}</p></section>
          <section class="fortune-story-block"><span class="expert-kicker">BÊN TRONG & CÁCH NGƯỜI KHÁC THẤY</span><h4>Linh hồn ${values.soul} gặp Nhân cách ${values.personality}</h4><p>${inner}</p></section>
          <section class="fortune-story-block"><span class="expert-kicker">ĐIỂM DỄ MẮC KẸT</span><h4>Điểm mạnh khi dùng quá mức có thể trở thành áp lực</h4><p>Với trục ${values.life}, điều nên tự kiểm tra là: <strong>${shadow}</strong>. Khi căng thẳng, thay vì hỏi “mình có đúng với con số này không?”, hãy hỏi cụ thể hơn: <em>tôi đang né quyết định, ôm quá nhiều, kiểm soát quá chặt hay phân tán vì điều gì?</em> Một câu hỏi gắn với hành vi luôn hữu ích hơn một nhãn tính cách.</p></section>
          <section class="fortune-story-block"><span class="expert-kicker">GIAI ĐOẠN HIỆN TẠI</span><h4>Năm ${values.personalYear} → tháng ${pm} → ngày ${pd}</h4><p>${cycle} Chu kỳ tháng và ngày chỉ nên dùng để điều chỉnh <strong>cường độ và ưu tiên</strong>, không dùng để trì hoãn một việc cần làm hay phó mặc quyết định cho con số.</p></section>
        </div>
        <section class="fortune-practice"><span class="expert-kicker">THỬ TRONG 30 NGÀY</span><h4>Ba cách biến phần đọc thành dữ kiện thật</h4><ol><li>Ghi lại 2 tình huống bạn cảm thấy “rất là mình” và xem thế mạnh nào đang được sử dụng.</li><li>Ghi lại 1 tình huống khiến bạn mệt hoặc bị hiểu sai; đối chiếu xem vấn đề nằm ở nhu cầu bên trong hay cách biểu đạt ra ngoài.</li><li>Chọn một hành vi nhỏ phù hợp với giai đoạn hiện tại và đo bằng kết quả thực tế sau 2–4 tuần, thay vì dựa vào cảm giác “hợp số”.</li></ol><p class="fortune-disclaimer">Thần số học ở đây là một hệ quy chiếu phản tư. Nó không đo được toàn bộ tính cách, năng lực hay tương lai của một người. Bản thân bạn, trải nghiệm, môi trường và lựa chọn thực tế luôn có trọng lượng lớn hơn các phép tính này.</p></section>
      </div>`;
  }

  static personalMonthFromValues(values,date){return this.reduce(values.personalYear+date.getMonth()+1,false)}
  static personalDayFromValues(values,date){return this.reduce(this.personalMonthFromValues(values,date)+date.getDate(),false)}

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
    const reading=this.expertReading(values,now);
    const pm=this.personalMonth(ds,now),pd=this.personalDay(ds,now);
    const cycles=[{value:values.personalYear,label:'Năm cá nhân',text:MysticalData.CYCLE_TEXT[values.personalYear],meta:String(now.getFullYear())},{value:pm,label:'Tháng cá nhân',text:MysticalData.CYCLE_TEXT[pm],meta:`Tháng ${now.getMonth()+1}`},{value:pd,label:'Ngày cá nhân',text:MysticalData.CYCLE_TEXT[pd],meta:Format.vn(now,{day:'2-digit',month:'2-digit'})}];
    const clean=this.stripName(name),vowels=[...clean].filter(c=>'AEIOUY'.includes(c)).join(''),cons=[...clean].filter(c=>!'AEIOUY'.includes(c)).join('');
    const formulas=[['Số chủ đạo',`digits(${ds}) → tổng ${this.sumDigits(ds)} → ${values.life}`],['Số biểu đạt',`${clean||'—'} → Pythagoras 1–9 → ${values.expression}`],['Số linh hồn',`${vowels||'—'} → nguyên âm → ${values.soul}`],['Số nhân cách',`${cons||'—'} → phụ âm → ${values.personality}`],['Số thái độ',`${Number(ds.split('-')[1])} + ${Number(ds.split('-')[2])} → ${values.attitude}`],['Số trưởng thành',`${values.life} + ${values.expression} → ${values.maturity}`]];
    return {values,metrics,reading,cycles,formulas,synthesis:this.synthesis(values),genderReading:this.genderInsight(profile.gender,values.life,values.expression,values.soul,values.personality)};
  }
}
