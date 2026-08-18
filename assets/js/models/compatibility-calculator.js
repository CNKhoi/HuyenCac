import { MysticalData } from '../data/mystical-data.js';
import { NumerologyCalculator } from './numerology-calculator.js';
import { AstrologyCalculator } from './astrology-calculator.js';
import { LunarConverter } from './lunar-converter.js';

/**
 * CompatibilityCalculator
 * Pure reference model for comparing two profiles.
 * Scores are internal visualization values only — NOT probabilities,
 * scientific measurements, diagnoses, or predictions of relationship success.
 */
export class CompatibilityCalculator{
  static RELATION_TYPES={
    general:{label:'Tổng quan',weights:{core:.22,emotional:.22,communication:.22,canChi:.10,growth:.14,current:.10},focus:['core','communication','emotional']},
    love:{label:'Tình cảm / yêu đương',weights:{core:.18,emotional:.30,communication:.24,canChi:.08,growth:.12,current:.08},focus:['emotional','communication','core']},
    friendship:{label:'Bạn bè',weights:{core:.18,emotional:.20,communication:.30,canChi:.06,growth:.16,current:.10},focus:['communication','emotional','growth']},
    work:{label:'Công việc / cộng tác',weights:{core:.28,emotional:.08,communication:.30,canChi:.05,growth:.22,current:.07},focus:['communication','core','growth']},
    family:{label:'Gia đình',weights:{core:.22,emotional:.28,communication:.24,canChi:.08,growth:.10,current:.08},focus:['emotional','communication','core']}
  };

  static clamp(n,min=0,max=100){return Math.max(min,Math.min(max,Math.round(n)))}
  static mean(values){const valid=values.filter(Number.isFinite);return valid.length?valid.reduce((a,b)=>a+b,0)/valid.length:60}
  static stdev(values){const valid=values.filter(Number.isFinite);if(valid.length<2)return 0;const m=this.mean(valid);return Math.sqrt(valid.reduce((s,x)=>s+(x-m)**2,0)/valid.length)}

  static snapshot(profile,now=new Date()){
    if(!profile?.fullName?.trim()||!profile?.birthDate)throw new Error('Cần họ tên và ngày sinh của cả hai người để phân tích.');
    const birth=new Date(profile.birthDate+'T12:00:00');
    if(Number.isNaN(birth.getTime()))throw new Error('Ngày sinh không hợp lệ.');
    const year=AstrologyCalculator.yearCanChi(birth.getFullYear());
    const day=AstrologyCalculator.dayCanChi(birth);
    const hour=AstrologyCalculator.hourCanChi(birth,profile.birthTime||'');
    const lunar=LunarConverter.fromDate(birth);
    const zodiac=AstrologyCalculator.western(profile.birthDate);
    const kua=AstrologyCalculator.kuaForYear(lunar.year,profile.gender||'');
    const values={
      life:NumerologyCalculator.lifePath(profile.birthDate),
      expression:NumerologyCalculator.expression(profile.fullName),
      soul:NumerologyCalculator.soul(profile.fullName),
      personality:NumerologyCalculator.personality(profile.fullName),
      attitude:NumerologyCalculator.attitude(profile.birthDate),
      maturity:NumerologyCalculator.maturity(profile.fullName,profile.birthDate),
      personalYear:NumerologyCalculator.personalYear(profile.birthDate,now.getFullYear())
    };
    return {profile:{...profile},birth,year,day,hour,lunar,zodiac,kua,values};
  }

  static numericPair(label,a,b,detail=''){
    const x=NumerologyCalculator.alignment(a,b);
    return {label,score:x.score,state:x.state,a,b,detail:detail||`So sánh ${a} ↔ ${b} bằng khoảng cách số học sau rút gọn.`};
  }

  static branchPair(a,b){
    const r=AstrologyCalculator.relationDescriptor(a,b);
    const score={trine:86,harmony:89,same:70,clash:36,'four-clash':47,neutral:60,missing:60}[r.type]??60;
    return {...r,score};
  }

  static elementPair(a,b){
    if(a===b)return {score:78,label:`Đồng hành ${a}`,tone:'positive',detail:`Hai Thiên Can năm cùng hành ${a}. Mô hình đọc đây là một lớp dễ hiểu nhịp của nhau, nhưng hành vi thực tế vẫn có thể rất khác.`};
    if(MysticalData.GENERATES[a]===b||MysticalData.GENERATES[b]===a){
      const from=MysticalData.GENERATES[a]===b?a:b,to=MysticalData.GENERATES[a]===b?b:a;
      return {score:81,label:`Tương sinh ${from} → ${to}`,tone:'positive',detail:'Quan hệ tương sinh được xem là khả năng bổ trợ trong hệ Ngũ hành. Không nên diễn giải thành một người phải “nuôi” hoặc chịu trách nhiệm cho người kia.'};
    }
    if(MysticalData.CONTROLS[a]===b||MysticalData.CONTROLS[b]===a){
      const from=MysticalData.CONTROLS[a]===b?a:b,to=MysticalData.CONTROLS[a]===b?b:a;
      return {score:47,label:`Tương khắc ${from} ↔ ${to}`,tone:'caution',detail:'Quan hệ khắc được dùng như một câu hỏi về khác biệt cách điều tiết, quyết định hoặc ưu tiên. Không mặc định đây là “không hợp”.'};
    }
    return {score:61,label:'Quan hệ Ngũ hành gián tiếp',tone:'neutral',detail:'Không có quan hệ sinh/khắc trực tiếp theo chu trình Ngũ hành đang dùng.'};
  }

  static kuaPair(a,b){
    if(!a||!b)return {score:60,label:'Chưa đủ dữ liệu Cung phi',tone:'neutral',detail:'Cần giới tính Nam/Nữ theo công thức truyền thống ở cả hai hồ sơ để so lớp Cung phi. Thiếu dữ liệu này không ảnh hưởng các trục chính.'};
    if(a.gua===b.gua)return {score:80,label:`Cùng cung ${a.gua}`,tone:'positive',detail:`Hai hồ sơ quy về cùng cung ${a.gua}. Đây chỉ là lớp Bát Trạch đơn giản, không phải phép hợp hôn hoàn chỉnh.`};
    if(a.group===b.group)return {score:74,label:`Cùng ${a.group}`,tone:'positive',detail:`Hai cung cùng nhóm ${a.group}. Mô hình chỉ cộng nhẹ vì đây là lớp tham khảo phụ.`};
    return {score:53,label:'Khác nhóm Cung phi',tone:'neutral',detail:`Hai hồ sơ thuộc hai nhóm Cung phi khác nhau. Không dùng riêng yếu tố này để kết luận hợp/khắc.`};
  }

  static zodiacElement(name){
    const map={'Bạch Dương':'Hỏa','Sư Tử':'Hỏa','Nhân Mã':'Hỏa','Kim Ngưu':'Thổ','Xử Nữ':'Thổ','Ma Kết':'Thổ','Song Tử':'Khí','Thiên Bình':'Khí','Bảo Bình':'Khí','Cự Giải':'Thủy','Bọ Cạp':'Thủy','Song Ngư':'Thủy'};
    return map[name]||'—';
  }

  static zodiacPair(a,b){
    const ea=this.zodiacElement(a.name),eb=this.zodiacElement(b.name);
    if(ea===eb)return {score:76,label:`Cùng nhóm ${ea}`,detail:`${a.name} và ${b.name} cùng nhóm nguyên tố phương Tây ${ea}. Ứng dụng chỉ dùng lớp này với trọng số thấp.`};
    const key=[ea,eb].sort().join('|');
    if(new Set(['Hỏa|Khí','Thổ|Thủy']).has(key))return {score:79,label:`Nhóm ${ea} ↔ ${eb} bổ trợ`,detail:'Theo hệ quy chiếu cung phương Tây đơn giản, hai nhóm có thể bổ trợ. Đây chỉ là lớp phụ.'};
    if(new Set(['Hỏa|Thủy','Khí|Thổ']).has(key))return {score:53,label:`Nhóm ${ea} ↔ ${eb} tương phản`,detail:'Hai nhóm có khác biệt về cách phản ứng/ưu tiên theo mô hình cung phương Tây. Không phải dự báo chất lượng quan hệ.'};
    return {score:61,label:`Nhóm ${ea} ↔ ${eb} khác nhịp`,detail:'Hai nhóm không nằm trong cặp bổ trợ trực tiếp của mô hình đơn giản đang dùng.'};
  }

  static dimension(label,score,detail,components=[],short=''){return {label,score:this.clamp(score),detail,components,short}}

  static scoreState(score){
    if(score>=80)return 'Rất thuận';
    if(score>=68)return 'Khá thuận';
    if(score>=56)return 'Có thể phối hợp';
    if(score>=44)return 'Cần chủ động';
    return 'Khác nhịp rõ';
  }

  static effortLevel(index){
    if(index<=22)return {label:'Thấp',text:'Phần lớn khác biệt có thể xử lý bằng giao tiếp bình thường; vẫn cần kiểm chứng bằng hành vi thật.'};
    if(index<=36)return {label:'Vừa',text:'Có một vài vùng cần thống nhất cách giao tiếp, kỳ vọng hoặc nhịp hỗ trợ thay vì để mọi thứ tự vận hành.'};
    if(index<=50)return {label:'Khá cao',text:'Khác biệt tập trung ở những trục quan trọng; cần quy ước rõ và xem hai người có thực sự sẵn sàng điều chỉnh hay không.'};
    return {label:'Cao',text:'Mô hình cho thấy nhiều trục khác nhịp. Điều quan trọng là kiểm tra khả năng tôn trọng, thương lượng và thay đổi hành vi ngoài đời thực.'};
  }

  static pattern(dim){
    const {core,emotional,communication,growth,current}=dim;
    if(core.score>=72&&communication.score<58)return {title:'Cùng hướng, khác cách nói',text:'Hai người có thể hiểu tương đối giống điều mình muốn xây dựng, nhưng cách diễn đạt hoặc xử lý bất đồng dễ lệch nhịp. Điểm mấu chốt là quy ước cách nói chuyện khi căng thẳng.'};
    if(communication.score>=72&&core.score<58)return {title:'Dễ kết nối, cần thống nhất chuyện lớn',text:'Tương tác có thể khá trôi chảy, nhưng mục tiêu dài hạn hoặc tiêu chuẩn ưu tiên cần được nói rõ trước những quyết định lớn.'};
    if(emotional.score>=74&&current.score<56)return {title:'Gần về cảm xúc, lệch nhịp giai đoạn',text:'Hai người có khả năng hiểu nhu cầu của nhau nhưng đang ở hai nhịp ưu tiên khác nhau. Không nên ép đồng tốc; nên thống nhất thời gian và mức hỗ trợ thực tế.'};
    if(growth.score>=72&&communication.score>=66)return {title:'Bổ trợ để cùng phát triển',text:'Khác biệt có xu hướng tạo giá trị khi hai người biết phân vai và phản hồi rõ. Rủi ro là biến “bổ trợ” thành việc một người gánh thay người kia.'};
    if(core.score>=70&&emotional.score>=70&&communication.score>=70)return {title:'Đồng điệu khá đều',text:'Nhiều trục nền tảng đang cùng nhịp. Điều cần tránh là chủ quan rằng “đã hợp thì không cần nói rõ”; quan hệ tốt vẫn cần ranh giới và cam kết cụ thể.'};
    if(core.score<55&&emotional.score<55&&communication.score<55)return {title:'Khác biệt nền tảng khá rõ',text:'Mô hình không cho thấy nhiều vùng tự động cùng nhịp. Nếu mối quan hệ quan trọng, nên kiểm tra trực tiếp giá trị sống, cách xử lý bất đồng và mức sẵn sàng điều chỉnh.'};
    return {title:'Hợp theo kiểu bổ trợ',text:'Hai người có cả vùng đồng điệu và vùng khác biệt. Kết quả tốt nhất thường đến khi biết phần nào nên thuận theo nhau và phần nào cần thương lượng có chủ đích.'};
  }

  static profileVoice(snapshot){
    const info=MysticalData.NUM_TEXT[snapshot.values.life]||[`Số ${snapshot.values.life}`,'một xu hướng vận hành riêng','quan sát cách mình phản ứng trong thực tế'];
    return {title:`${snapshot.values.life} — ${info[0]}`,text:`${snapshot.profile.fullName} có trục Chủ đạo ${snapshot.values.life}, thường được mô tả theo hướng ${info[1]}. Khi đặt trong quan hệ, điểm đáng quan sát là ${info[2]}.`};
  }

  static contextPrompts(type,challenges,A,B){
    const base={
      general:[
        'Điều gì trong 1–2 năm tới là ưu tiên lớn nhất của mỗi người, và hai ưu tiên đó có thể cùng tồn tại không?',
        'Khi một người căng thẳng, người đó muốn được lắng nghe, có không gian riêng hay muốn cùng tìm giải pháp?',
        'Khi bất đồng, điều gì khiến mỗi người cảm thấy vẫn được tôn trọng?'
      ],
      love:[
        'Mỗi người hiểu “cam kết” và “được quan tâm” bằng những hành vi cụ thể nào?',
        'Khi ghen, hụt hẫng hoặc cần khoảng riêng, hai người muốn đối phương phản hồi ra sao?',
        'Những vấn đề lớn như tiền bạc, gia đình, công việc và ranh giới với người khác có điểm nào cần nói sớm?'
      ],
      friendship:[
        'Hai người kỳ vọng mức độ liên lạc, hỗ trợ và riêng tư trong tình bạn như thế nào?',
        'Khi một người bận hoặc cần khoảng cách, người còn lại có dễ hiểu sai thành xa cách hay không?',
        'Hai người giải quyết chuyện không hài lòng bằng nói thẳng, im lặng hay tránh né?'
      ],
      work:[
        'Ai chịu trách nhiệm quyết định cuối cùng ở từng loại việc và tiêu chí đánh giá kết quả là gì?',
        'Hai người thích phản hồi trực tiếp ngay hay cần thời gian suy nghĩ trước khi trả lời?',
        'Khi ưu tiên xung đột, nguyên tắc nào sẽ được dùng để chốt thay vì dựa vào cảm tính?'
      ],
      family:[
        'Mỗi người cần mức độ gần gũi và riêng tư như thế nào để vừa kết nối vừa không bị quá tải?',
        'Khi gia đình có mâu thuẫn, ai thường chủ động nói chuyện và ai cần thời gian lắng xuống?',
        'Những kỳ vọng về trách nhiệm, tiền bạc, chăm sóc và ranh giới với người thân đã được nói rõ chưa?'
      ]
    };
    const focus=challenges[0]?.label?.toLowerCase()||'khác biệt';
    const arr=(base[type]||base.general).slice();
    arr[2]+=` Hiện mô hình đang gợi ý chú ý thêm đến ${focus}.`;
    return arr.map((q,i)=>({number:i+1,question:q}));
  }

  static analyze(profileA,profileB,relationType='general',now=new Date()){
    const type=this.RELATION_TYPES[relationType]?relationType:'general';
    const relation=this.RELATION_TYPES[type];
    const A=this.snapshot(profileA,now),B=this.snapshot(profileB,now);

    const life=this.numericPair('Số chủ đạo',A.values.life,B.values.life);
    const maturity=this.numericPair('Số trưởng thành',A.values.maturity,B.values.maturity);
    const soul=this.numericPair('Số linh hồn',A.values.soul,B.values.soul);
    const expression=this.numericPair('Số biểu đạt',A.values.expression,B.values.expression);
    const personality=this.numericPair('Số nhân cách',A.values.personality,B.values.personality);
    const attitude=this.numericPair('Số thái độ',A.values.attitude,B.values.attitude);
    const current=this.numericPair('Năm cá nhân hiện tại',A.values.personalYear,B.values.personalYear);
    const crossAB=this.numericPair('Nhu cầu A ↔ cách thể hiện B',A.values.soul,B.values.personality);
    const crossBA=this.numericPair('Nhu cầu B ↔ cách thể hiện A',B.values.soul,A.values.personality);

    const branch=this.branchPair(A.year.branchIndex,B.year.branchIndex);
    const element=this.elementPair(A.year.element,B.year.element);
    const kua=this.kuaPair(A.kua,B.kua);
    const zodiac=this.zodiacPair(A.zodiac,B.zodiac);

    const dimensions={
      core:this.dimension('Giá trị & hướng sống',this.mean([life.score,maturity.score]),`Chủ đạo ${A.values.life} ↔ ${B.values.life}; Trưởng thành ${A.values.maturity} ↔ ${B.values.maturity}. Trục này dùng để soi mức độ dễ hiểu mục tiêu, nhịp ra quyết định và hướng phát triển dài hạn của nhau.`,[life,maturity],''),
      emotional:this.dimension('Nhu cầu cảm xúc',this.mean([soul.score,crossAB.score,crossBA.score,zodiac.score*.35+60*.65]),`Đối chiếu Linh hồn và tương quan giữa nhu cầu bên trong với cách người kia thường biểu hiện ra ngoài. Cung phương Tây chỉ tham gia ở mức rất thấp.`,[soul,crossAB,crossBA,zodiac],''),
      communication:this.dimension('Giao tiếp & biểu đạt',this.mean([expression.score,personality.score,attitude.score]),`Biểu đạt ${A.values.expression} ↔ ${B.values.expression}; Nhân cách ${A.values.personality} ↔ ${B.values.personality}; Thái độ ${A.values.attitude} ↔ ${B.values.attitude}. Đây là trục nên kiểm chứng bằng cách hai người xử lý hiểu lầm và phản hồi.`,[expression,personality,attitude],''),
      canChi:this.dimension('Can Chi & Ngũ hành',this.mean([branch.score,element.score,kua.score]),`${branch.label}; ${element.label}; ${kua.label}. Đây là lớp văn hóa/truyền thống và được giảm trọng số trong điểm tổng.`,[branch,element,kua],''),
      growth:this.dimension('Phát triển & bổ trợ',this.mean([maturity.score,life.score,expression.score]),`Trục này đọc khả năng phân vai, học hỏi và hỗ trợ nhau phát triển. Khác biệt có thể có lợi nếu hai người không biến “bổ trợ” thành phụ thuộc hoặc gánh thay.`,[maturity,life,expression],''),
      current:this.dimension('Nhịp hiện tại',current.score,`Năm cá nhân ${A.values.personalYear} ↔ ${B.values.personalYear}. Đây là lớp thay đổi theo năm nên không được dùng như một đặc điểm cố định của mối quan hệ.`,[current],'')
    };

    dimensions.core.short=dimensions.core.score>=72?'Dễ hiểu hướng đi của nhau':dimensions.core.score>=58?'Có điểm chung, vẫn cần chốt ưu tiên':'Kỳ vọng dài hạn có thể khác nhau';
    dimensions.emotional.short=dimensions.emotional.score>=72?'Nhu cầu bên trong khá dễ đọc nhau':dimensions.emotional.score>=58?'Có thể hiểu nhau nếu nói rõ nhu cầu':'Dễ kỳ vọng người kia tự hiểu';
    dimensions.communication.short=dimensions.communication.score>=72?'Cách trao đổi khá cùng nhịp':dimensions.communication.score>=58?'Giao tiếp được, cần quy ước khi căng thẳng':'Dễ nói cùng việc nhưng khác “ngôn ngữ”';
    dimensions.canChi.short=dimensions.canChi.score>=72?'Lớp truyền thống tương đối thuận':dimensions.canChi.score>=55?'Lớp truyền thống trung tính':'Có vài dấu hiệu tương phản truyền thống';
    dimensions.growth.short=dimensions.growth.score>=72?'Dễ bổ trợ khi biết phân vai':dimensions.growth.score>=58?'Có tiềm năng bổ trợ có điều kiện':'Cần tránh biến khác biệt thành cạnh tranh';
    dimensions.current.short=dimensions.current.score>=72?'Đang khá đồng nhịp giai đoạn':dimensions.current.score>=58?'Nhịp hiện tại không quá xa':'Đang khác tốc độ hoặc ưu tiên';

    const weights=relation.weights;
    const overall=this.clamp(Object.entries(weights).reduce((sum,[key,w])=>sum+dimensions[key].score*w,0));
    const label=overall>=80?'Nhiều vùng đang cùng nhịp':overall>=68?'Khá dễ phối hợp':overall>=58?'Có nền tảng nhưng cần chủ động':overall>=46?'Khác biệt đáng kể':'Khác nhịp ở nhiều trục';
    const sorted=Object.values(dimensions).slice().sort((a,b)=>b.score-a.score);
    const strengths=sorted.filter(x=>x.label!=='Can Chi & Ngũ hành').slice(0,2);
    const challenges=sorted.filter(x=>x.label!=='Can Chi & Ngũ hành').slice(-2).reverse();

    const relationalKeys=['core','emotional','communication','growth'];
    const relationalWeightSum=relationalKeys.reduce((s,k)=>s+weights[k],0);
    const naturalFit=this.clamp(relationalKeys.reduce((s,k)=>s+dimensions[k].score*weights[k],0)/relationalWeightSum);
    const lowestRelational=relationalKeys.map(k=>dimensions[k]).sort((a,b)=>a.score-b.score).slice(0,2);
    const effortIndex=this.clamp(100-this.mean(lowestRelational.map(x=>x.score)));
    const effort=this.effortLevel(effortIndex);
    const pattern=this.pattern(dimensions);
    const spread=this.stdev(Object.values(dimensions).map(x=>x.score));
    const spreadLabel=spread<9?'Các chiều khá đồng đều':spread<16?'Có vài chiều phân hóa':'Kết quả phân hóa mạnh';

    const focusNames=relation.focus.map(k=>dimensions[k].label);
    const summary=`Trong ngữ cảnh <strong>${relation.label.toLowerCase()}</strong>, hai hồ sơ nổi bật kiểu <strong>“${pattern.title}”</strong>. Vùng đến tự nhiên hơn là <strong>${strengths[0].label.toLowerCase()}</strong>; vùng nên chủ động nói rõ hơn là <strong>${challenges[0].label.toLowerCase()}</strong>. Với ngữ cảnh này, ba trục nên ưu tiên đọc là <strong>${focusNames.join(' → ')}</strong>.`;

    const voiceA=this.profileVoice(A),voiceB=this.profileVoice(B);
    const story={
      title:`${A.profile.fullName} ↔ ${B.profile.fullName}: ${pattern.title}`,
      body:`<strong>${A.profile.fullName}</strong> đi vào quan hệ với trục <b>${voiceA.title}</b>, còn <strong>${B.profile.fullName}</strong> mang trục <b>${voiceB.title}</b>. ${pattern.text} Khi đọc báo cáo, hãy ưu tiên xem điều này có khớp với cách hai người thật sự giao tiếp trong 3–6 tháng gần đây hay không.`
    };

    const adviceMap={
      'Giá trị & hướng sống':'Mỗi người viết ra 3 ưu tiên dài hạn quan trọng nhất rồi so phần giao nhau và phần cần thương lượng. Đừng dùng câu “chúng ta chắc hiểu nhau” thay cho việc nói cụ thể.',
      'Nhu cầu cảm xúc':'Mỗi người hoàn thành câu: “Khi căng thẳng, điều giúp tôi nhất là…”. Nói rõ cần lắng nghe, cần không gian hay cần giải pháp.',
      'Giao tiếp & biểu đạt':'Thống nhất một quy tắc bất đồng: nói vấn đề cụ thể, không gắn nhãn con người; nếu cần tạm dừng thì phải hẹn thời điểm quay lại.',
      'Phát triển & bổ trợ':'Phân vai theo thế mạnh nhưng giữ trách nhiệm cá nhân. Bổ trợ không có nghĩa một người phải làm hộ phần trưởng thành của người kia.',
      'Nhịp hiện tại':'Nếu đang khác nhịp, thống nhất một mốc ngắn 1–3 tháng thay vì ép cả hai có cùng tốc độ ngay lập tức.'
    };
    const practicalAdvice=[...new Set(challenges.map(x=>adviceMap[x.label]))].filter(Boolean);
    while(practicalAdvice.length<3)practicalAdvice.push('Đối chiếu mọi nhận định với hành vi thực tế: giữ lời, xin lỗi, tôn trọng ranh giới và cách giải quyết vấn đề quan trọng hơn điểm số mô hình.');

    const completenessParts=[profileA.birthTime,profileB.birthTime,profileA.gender,profileB.gender].filter(Boolean).length;
    const completeness=70+completenessParts*7.5;
    const missing=[];
    if(!profileA.birthTime||!profileB.birthTime)missing.push('giờ sinh của một hoặc cả hai người');
    if(!profileA.gender||!profileB.gender)missing.push('giới tính dùng cho lớp Cung phi của một hoặc cả hai người');

    const expertSections=[
      {kicker:'1. BẢN CHẤT CẶP ĐÔI',title:pattern.title,body:`${pattern.text} Điểm đồng điệu nền tảng của bốn trục chính là <strong>${naturalFit}/100</strong>, nhưng con số này chỉ dùng để nhìn tương quan nội bộ. Điều quan trọng hơn là vùng mạnh nhất <strong>${strengths[0].label}</strong> có đang xuất hiện thành hành vi tốt ngoài đời thực hay không.`},
      {kicker:'2. ĐIỂM DỄ HIỂU LẦM',title:`Tập trung vào ${challenges[0].label.toLowerCase()}`,body:`Trục này đang ở mức <strong>${challenges[0].score}/100</strong>. ${challenges[0].short}. Điểm thấp không phải bằng chứng thiếu tình cảm hay thiếu thiện chí; nó chỉ cho thấy hai người nên bỏ cách đoán ý và chuyển sang quy ước cụ thể.`},
      {kicker:'3. NGỮ CẢNH HIỆN TẠI',title:`${relation.label} • ${dimensions.current.score}/100 nhịp hiện tại`,body:`Năm cá nhân ${A.values.personalYear} ↔ ${B.values.personalYear} cho thấy ${dimensions.current.short.toLowerCase()}. Nhịp này có thể thay đổi theo năm, vì vậy không nên biến một giai đoạn đang khó thành nhãn cố định về toàn bộ mối quan hệ.`}
    ];

    const realityChecklist=[
      'Hai người có thể nói “không” hoặc đặt ranh giới mà không bị trừng phạt, đe dọa hay kiểm soát không?',
      'Khi có lỗi, người gây ảnh hưởng có nhận trách nhiệm và thay đổi hành vi hay chỉ xin lỗi bằng lời?',
      'Những chủ đề lớn như tiền bạc, gia đình, sự nghiệp, cam kết và riêng tư có thể được nói thẳng mà không phải né tránh kéo dài không?',
      'Mối quan hệ có giúp mỗi người giữ được bản sắc, quyền tự quyết và cảm giác an toàn trong thời gian dài không?'
    ];

    const conversationPrompts=this.contextPrompts(type,challenges,A,B);

    return {
      type,relationLabel:relation.label,overall,label,summary,A,B,dimensions,branch,element,kua,zodiac,
      strengths,challenges,expertSections,practicalAdvice,realityChecklist,conversationPrompts,
      naturalFit,effortIndex,effort,pattern,spreadLabel,story,
      dataCompleteness:this.clamp(completeness),missing,
      disclaimer:'Toàn bộ điểm và mô tả trong phần Độ hợp là mô hình tham khảo/phản tư được tạo từ các quy tắc nội bộ của ứng dụng. Đây không phải xác suất thành công, không phải chẩn đoán tâm lý và không thể biết một người có trung thực, tử tế hay sẵn sàng thay đổi hành vi hay không. Mọi quyết định vẫn cần dựa vào chính hai người: hành vi thực tế, giá trị sống, giao tiếp, tôn trọng, ranh giới, hoàn cảnh và trách nhiệm với lựa chọn của mình.'
    };
  }
}
