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



  static ageOn(ds,date=new Date()){
    const [y,m,d]=ds.split('-').map(Number);let age=date.getFullYear()-y;
    const before=date.getMonth()+1<m||(date.getMonth()+1===m&&date.getDate()<d);if(before)age--;
    return Math.max(0,age);
  }

  static ageStage(age){
    if(age<18)return {key:'learning',label:'Giai đoạn xây nền',range:'Dưới 18',focus:'học kỹ năng, tạo thói quen và hiểu giá trị của tiền/cảm xúc trước khi gánh quyết định dài hạn'};
    if(age<=24)return {key:'explore',label:'Giai đoạn thử nghiệm có kiểm soát',range:'18–24',focus:'tích lũy kỹ năng, trải nghiệm có giới hạn và xây nền tự lập'};
    if(age<=34)return {key:'build',label:'Giai đoạn xây nền dài hạn',range:'25–34',focus:'ổn định năng lực kiếm sống, chọn hướng dài hạn và xây các cam kết có chất lượng'};
    if(age<=44)return {key:'expand',label:'Giai đoạn mở rộng & tái cân bằng',range:'35–44',focus:'cân bằng tăng trưởng với sức bền, gia đình, trách nhiệm và chất lượng lựa chọn'};
    if(age<=54)return {key:'optimize',label:'Giai đoạn tối ưu & củng cố',range:'45–54',focus:'lọc bớt thứ kém hiệu quả, bảo toàn thành quả và ưu tiên chiều sâu hơn số lượng'};
    return {key:'preserve',label:'Giai đoạn bảo toàn & truyền lại giá trị',range:'55+',focus:'duy trì sự chủ động, bảo toàn nguồn lực và dành năng lượng cho điều có ý nghĩa lâu dài'};
  }

  static financeGuidance(values,age,now=new Date()){
    const family=this.family(values.life),exprFamily=this.family(values.expression),py=values.personalYear,stage=this.ageStage(age);
    const patterns={
      'Chủ động':{strength:'khả năng quyết nhanh, nhìn nguồn lực theo mục tiêu và chủ động tạo cơ hội',risk:'dễ quá tự tin, tập trung quá nhiều vào một lựa chọn hoặc quyết định nhanh khi chưa đủ dữ kiện'},
      'Kết nối':{strength:'khả năng thương lượng, duy trì quan hệ và tạo giá trị qua hợp tác',risk:'dễ chi tiêu theo cảm xúc, khó nói “không” hoặc nhường quá nhiều trong chuyện tiền bạc'},
      'Biểu đạt':{strength:'khả năng tìm cơ hội qua giao tiếp, sáng tạo và thích nghi nhanh',risk:'dễ phân tán nguồn thu, mua theo hứng hoặc chạy theo cơ hội mới trước khi tối ưu cái đang có'},
      'Cấu trúc':{strength:'khả năng lập kế hoạch, giữ kỷ luật và xây nền tài chính đều đặn',risk:'dễ quá thận trọng, bỏ lỡ cơ hội hợp lý hoặc giữ một mô hình cũ quá lâu chỉ vì nó quen thuộc'},
      'Chiêm nghiệm':{strength:'khả năng nghiên cứu, soi rủi ro và không dễ bị cuốn theo đám đông',risk:'dễ chậm quyết định vì muốn đủ chắc chắn hoặc bỏ qua cơ hội vì phân tích quá lâu'},
      'Nhân văn':{strength:'khả năng nhìn tiền như công cụ phục vụ giá trị lớn hơn và tạo tác động',risk:'dễ cho đi quá tay, định giá thấp công sức hoặc đặt lý tưởng cao hơn giới hạn nguồn lực'},
      'Trực giác':{strength:'khả năng nhận ra mô-típ, xu hướng và cơ hội khác thường',risk:'dễ đánh đồng trực giác với bằng chứng, đặc biệt khi quyết định có yếu tố đầu cơ'},
      'Kiến tạo':{strength:'khả năng nghĩ dài hạn, xây hệ thống và biến mục tiêu lớn thành cấu trúc',risk:'dễ mở rộng quá nhanh, ôm dự án lớn hoặc dùng đòn bẩy trước khi nền dòng tiền đủ chắc'},
      'Phụng sự':{strength:'khả năng tạo giá trị bền nhờ trách nhiệm, chất lượng dịch vụ và uy tín',risk:'dễ làm nhiều hơn mức được trả hoặc đặt nhu cầu người khác lên trên an toàn tài chính của mình'}
    };
    const p=patterns[family]||patterns['Biểu đạt'];
    const ageAdvice={
      learning:['Tập thói quen ghi chép tiền vào/ra và hiểu khác biệt giữa nhu cầu với ham muốn.','Không vay/nợ hoặc mua sắm theo áp lực bạn bè; ưu tiên học kỹ năng trước khi tìm “cách kiếm tiền nhanh”.'],
      explore:['Xây quỹ dự phòng nhỏ, đầu tư vào kỹ năng tạo thu nhập và tập đều một thói quen tiết kiệm.','Tránh nợ tiêu dùng, đầu cơ theo FOMO và dồn phần lớn tiền vào một cơ hội chưa hiểu rõ.'],
      build:['Ưu tiên quỹ dự phòng, bảo hiểm phù hợp, tăng năng lực kiếm tiền và tích lũy đều theo kế hoạch.','Tránh nâng mức sống nhanh hơn thu nhập bền vững hoặc gánh khoản vay dài hạn chỉ vì áp lực so sánh.'],
      expand:['Đa dạng hóa nguồn lực, rà soát rủi ro gia đình/công việc và dành tỷ lệ rõ cho mục tiêu dài hạn.','Tránh dùng đòn bẩy quá mức, mở rộng nhiều dự án cùng lúc hoặc xem thu nhập hiện tại là chắc chắn vĩnh viễn.'],
      optimize:['Củng cố tài sản, giảm khoản kém hiệu quả, kiểm tra kế hoạch nghỉ hưu và tính thanh khoản.','Tránh giữ khoản đầu tư chỉ vì “đã bỏ nhiều tiền” hoặc chấp nhận rủi ro cao để bù cho thời gian đã qua.'],
      preserve:['Ưu tiên bảo toàn vốn, thanh khoản, chống gian lận và kế hoạch chuyển giao/tài sản rõ ràng.','Tránh sản phẩm phức tạp không hiểu rõ, cam kết lợi nhuận cao và quyết định tài chính do người khác gây áp lực.']
    }[stage.key];
    const cycleTip={1:'Năm 1 hợp để rà soát cấu trúc thu nhập và bắt đầu một thói quen tài chính mới ở quy mô nhỏ.',2:'Năm 2 nhấn mạnh hợp tác: tiền bạc nên có quy ước rõ khi liên quan người khác.',3:'Năm 3 dễ có nhiều ý tưởng và chi tiêu trải nghiệm; cần một ngân sách vui chơi rõ ràng.',4:'Năm 4 hợp với kỷ luật, trả nợ, tích lũy và tối ưu quy trình tài chính.',5:'Năm 5 dễ có biến động/thử nghiệm; nên tăng quỹ đệm trước khi mở rộng rủi ro.',6:'Năm 6 thường kéo trách nhiệm gia đình/cam kết lên cao; nên phân biệt hỗ trợ hợp lý và gánh thay.',7:'Năm 7 hợp với rà soát, học sâu và tránh quyết định đầu tư vì sốt ruột.',8:'Năm 8 phù hợp đặt mục tiêu tài chính đo được, nhưng càng cần kỷ luật rủi ro và minh bạch số liệu.',9:'Năm 9 hợp để dọn khoản kém hiệu quả, khép nghĩa vụ cũ và tránh mở cam kết dài hạn chỉ vì cảm xúc.'}[py];
    return {title:`Tài chính ở tuổi ${age}`,stage,profile:`Trục ${values.life} (${family}) kết hợp Biểu đạt ${values.expression} (${exprFamily}) cho thấy bạn có thể phát huy tốt ở ${p.strength}.`,risk:p.risk,doNow:ageAdvice[0],avoid:ageAdvice[1],cycleTip,disclaimer:'Đây là góc nhìn hành vi và quản trị rủi ro, không phải dự báo giàu/nghèo hay khuyến nghị đầu tư cá nhân.'};
  }

  static futureGuidance(values,age,now=new Date()){
    const stage=this.ageStage(age),py=values.personalYear,life=this.info(values.life),maturity=this.info(values.maturity);
    const cycle={
      1:{do:'chọn một hướng mới đủ nhỏ để bắt đầu ngay và đặt mốc kiểm tra sau 30–90 ngày',avoid:'mở quá nhiều dự án cùng lúc hoặc đổi hướng chỉ vì cảm giác muốn làm mới'},
      2:{do:'đầu tư vào quan hệ, kỹ năng lắng nghe và những việc cần phối hợp bền bỉ',avoid:'ép tiến độ khi điều kiện chưa chín hoặc im lặng quá lâu để giữ hòa khí'},
      3:{do:'đưa ý tưởng ra ngoài, thử sản phẩm/nội dung/kỹ năng giao tiếp và đo phản hồi thực tế',avoid:'chạy theo cảm hứng mà thiếu lịch hoàn thành'},
      4:{do:'xây quy trình, chuẩn hóa thói quen và hoàn thiện nền tảng đang còn lỏng',avoid:'cứng nhắc với kế hoạch khi dữ kiện thực tế đã thay đổi'},
      5:{do:'thử nghiệm có giới hạn, học kỹ năng mới và chủ động tạo phương án dự phòng',avoid:'đánh đồng thay đổi với tiến bộ hoặc bỏ cái đang tốt chỉ vì chán'},
      6:{do:'làm rõ cam kết, trách nhiệm và cân bằng giữa mình với gia đình/đội nhóm',avoid:'ôm trách nhiệm của người khác đến mức cạn năng lượng'},
      7:{do:'học sâu, rà soát hướng đi và dành thời gian cho công việc cần tập trung chất lượng cao',avoid:'cô lập hoặc trì hoãn vô hạn vì chưa cảm thấy “đủ chắc”'},
      8:{do:'đặt mục tiêu kết quả đo được, quản lý nguồn lực và học cách đàm phán giá trị của mình',avoid:'để áp lực thành tích khiến quyết định ngắn hạn lấn át rủi ro dài hạn'},
      9:{do:'hoàn tất việc dang dở, đóng vòng cũ và giải phóng nguồn lực cho chu kỳ kế tiếp',avoid:'níu giữ một hướng đã không còn hiệu quả chỉ vì tiếc công sức đã bỏ ra'}
    }[py];
    return {age,stage,headline:`${stage.label} • Năm cá nhân ${py}`,context:`Ở tuổi ${age}, ưu tiên phát triển hợp lý thường là ${stage.focus}. Trục Chủ đạo ${values.life} (${life[0]}) cho thấy cách bạn thường khởi động vấn đề, còn Số trưởng thành ${values.maturity} (${maturity[0]}) gợi hướng năng lực cần được tích hợp nhiều hơn khi tuổi và trách nhiệm tăng lên.`,should:cycle.do,avoid:cycle.avoid,checkpoint:`Trong 6–12 tháng tới, hãy chọn tối đa 2 mục tiêu có thể đo được. Mỗi quý tự hỏi: “việc này đang tạo năng lực/tài sản/quan hệ tốt hơn, hay chỉ đang làm tôi bận hơn?”`,disclaimer:'Phần “tương lai” không dự đoán sự kiện sẽ xảy ra. Nó chỉ chuyển độ tuổi + chu kỳ hiện tại thành các ưu tiên thực hành để bạn tự quyết định.'};
  }

  static loveGuidance(values,age,now=new Date()){
    const soul=this.info(values.soul),personality=this.info(values.personality),life=this.info(values.life),py=values.personalYear,stage=this.ageStage(age);
    const ageFocus=age<25?'ưu tiên hiểu ranh giới, nhịp riêng và kiểu quan tâm khiến bạn cảm thấy được tôn trọng':age<35?'ưu tiên phân biệt hấp dẫn ban đầu với sự tương thích về giá trị, trách nhiệm và kế hoạch sống':age<45?'ưu tiên khả năng cùng gánh trách nhiệm, sửa chữa sau xung đột và giữ không gian phát triển cá nhân':age<55?'ưu tiên chất lượng đồng hành, sự trung thực, tôn trọng nhịp sống và cách hai người chăm sóc mối quan hệ qua thời gian':'ưu tiên sự bình an, tin cậy, quyền tự chủ và khả năng đồng hành thực tế hơn là hình ảnh lý tưởng về một mối quan hệ';
    const cycleHint=[2,6].includes(py)?'Chu kỳ hiện tại đặt nhiều chú ý vào hợp tác/cam kết; đây là lúc phù hợp để nói rõ nhu cầu và kỳ vọng thay vì chỉ đoán ý nhau.':py===5?'Chu kỳ hiện tại có nhiều năng lượng thay đổi; nếu tình cảm biến động, cần phân biệt nhu cầu tự do lành mạnh với phản ứng bốc đồng.':py===7?'Chu kỳ hiện tại thiên về nhìn lại; khoảng riêng có thể hữu ích nếu được giao tiếp rõ, nhưng im lặng kéo dài dễ biến thành xa cách.':py===9?'Chu kỳ hiện tại hợp với việc khép những mô-típ cũ; thay vì cố giữ mọi thứ, hãy xem điều gì cần được sửa, tha thứ hoặc kết thúc có trách nhiệm.':'Chu kỳ hiện tại không phải “năm tình duyên” cố định; hãy dùng nó như nhịp nền để điều chỉnh cách giao tiếp và mức cam kết.';
    return {title:'Đường tình duyên & cách bạn gắn kết',need:`Linh hồn ${values.soul} (${soul[0]}) gợi nhu cầu bên trong nghiêng về ${soul[1]}. Trong tình cảm, điều quan trọng là biến nhu cầu này thành câu nói/hành vi cụ thể thay vì chờ người kia tự hiểu.`,outer:`Nhân cách ${values.personality} (${personality[0]}) là lớp người khác dễ nhìn thấy. Nếu lớp này khác với điều bạn cần bên trong, bạn có thể tạo cảm giác mạnh mẽ/bình thản hơn thực tế và khiến đối phương đọc sai tín hiệu.`,pattern:`Chủ đạo ${values.life} (${life[0]}) cho thấy mô-típ dài hạn của bạn là ${life[1]}. Ở tuổi ${age}, ${ageFocus}.`,cycleHint,greenFlags:['tôn trọng ranh giới và quyền nói “không”','nói được chuyện tiền bạc, gia đình, thời gian và cam kết mà không né tránh','sau xung đột có hành động sửa chữa chứ không chỉ xin lỗi bằng lời'],redFlags:['buộc bạn phải thu nhỏ bản thân để giữ quan hệ','kiểm soát, gây sợ hãi hoặc làm bạn mất quyền tự quyết','lời nói và hành vi liên tục không nhất quán trong thời gian dài'],disclaimer:'Không có con số nào xác định bạn “sẽ yêu ai” hay “khi nào kết hôn”. Chất lượng tình duyên phụ thuộc vào lựa chọn, kỹ năng giao tiếp, ranh giới, sự an toàn và cách hai người cùng trưởng thành.'};
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
    const age=this.ageOn(ds,now),ageStage=this.ageStage(age),finance=this.financeGuidance(values,age,now),future=this.futureGuidance(values,age,now),love=this.loveGuidance(values,age,now);
    return {values,metrics,reading,cycles,formulas,synthesis:this.synthesis(values),genderReading:this.genderInsight(profile.gender,values.life,values.expression,values.soul,values.personality),age,ageStage,finance,future,love};
  }
}
