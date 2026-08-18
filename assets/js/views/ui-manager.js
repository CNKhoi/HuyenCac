import { MysticalData } from '../data/mystical-data.js';
import { Format } from '../utils/format.js';
import { NumerologyCalculator } from '../models/numerology-calculator.js';
import { LunarConverter } from '../models/lunar-converter.js';
import { AstrologyCalculator } from '../models/astrology-calculator.js';
import { TarotEngine } from '../models/tarot-engine.js';
import { CompatibilityCalculator } from '../models/compatibility-calculator.js';
import { DateScorer } from '../models/date-scorer.js';
import { FeatureConfig } from '../config/feature-config.js';

export const UIManager={
  q(sel,root=document){return root.querySelector(sel)},qa(sel,root=document){return [...root.querySelectorAll(sel)]},
  setText(sel,text){const el=this.q(sel);if(el)el.textContent=text},setHTML(sel,html){const el=this.q(sel);if(el)el.innerHTML=html},
  icon(id,cls='icon'){return `<svg class="${cls}"><use href="${id}"/></svg>`},
  genderLabel(g){return AstrologyCalculator.genderLabel(g)},
  render(state,patch={}){
    const initial=Object.keys(patch).length===0;
    if(initial||'view' in patch)this.renderView(state.view);
    if(initial||'profile' in patch){this.renderProfile(state.profile);this.renderHome(state.profile);this.renderNumerology(state.profile);this.renderHoroscope(state.profile);this.renderCompatibilityProfile(state.profile);this.renderDateProfile(state.profile)}
    if(initial||'tarot' in patch)this.renderTarot(state.tarot);
    if(initial||'compatibility' in patch)this.renderCompatibility(state.compatibility);
    if(initial||'dates' in patch||'showAllDates' in patch)this.renderDates(state.dates,state.showAllDates);
    this.updateTarotModeUI();
    requestAnimationFrame(()=>this.motion(this.q('.view.active')));
  },
  renderView(view){document.body.dataset.view=view;this.qa('.view').forEach(v=>v.classList.toggle('active',v.id===`view-${view}`));this.qa('.nav-link').forEach(b=>b.classList.toggle('active',b.dataset.view===view));window.scrollTo({top:0,behavior:'smooth'})},
  renderProfile(profile){
    if(!profile){this.setText('#profileAvatar','?');this.setText('#profileNameTop','Chưa có hồ sơ');this.setText('#profileMetaTop','Thiết lập để cá nhân hóa');return}
    const year=AstrologyCalculator.yearCanChi(new Date(profile.birthDate+'T12:00:00').getFullYear()),z=AstrologyCalculator.western(profile.birthDate);this.setText('#profileAvatar',profile.fullName.trim().charAt(0).toUpperCase());this.setText('#profileNameTop',profile.fullName);this.setText('#profileMetaTop',`${this.genderLabel(profile.gender)} • ${year.stem} ${year.branch} • ${z.name}`)
  },
  renderHome(profile){
    if(!profile){this.setText('#homeDateLabel','CHƯA CÓ DỮ LIỆU');this.setText('#homeName','Tạo hồ sơ để bắt đầu');this.setText('#homeSummary','Thông tin được dùng chung cho tất cả chức năng.');['#homeLife','#homeYearPillar','#homeLunar','#homeZodiac'].forEach(s=>this.setText(s,'—'));return}
    const birth=new Date(profile.birthDate+'T12:00:00'),yc=AstrologyCalculator.yearCanChi(birth.getFullYear()),lu=LunarConverter.fromDate(birth),z=AstrologyCalculator.western(profile.birthDate),lp=NumerologyCalculator.lifePath(profile.birthDate);this.setText('#homeDateLabel',`SINH ${Format.vn(birth,{day:'2-digit',month:'2-digit',year:'numeric'})}`);this.setText('#homeName',profile.fullName);this.setText('#homeSummary',`${yc.animal} • ${yc.element} • ${z.name}`);this.setText('#homeLife',lp);this.setText('#homeYearPillar',`${yc.stem} ${yc.branch}`);this.setText('#homeLunar',`${lu.day}/${lu.month}${lu.leap?'N':''}/${lu.year}`);this.setText('#homeZodiac',z.name)
  },
  renderResultPanel(type,data,config){
    if(type==='metrics')return data.map((m,i)=>{const base=m.value>9?NumerologyCalculator.reduce(m.value,false):m.value;const v=Math.max(12,Math.min(100,Math.round(base/9*100)));return `<article class="metric-card ${i===0?'primary-metric':''}" data-tilt data-tilt-strength="4"><div class="metric-top"><div class="donut" style="--v:${v}"><b>${m.value}</b></div><div><small>${m.label}</small><strong>${m.title}</strong></div></div><p>${m.note}</p></article>`}).join('');
    if(type==='pillars')return data.map(p=>`<article class="pillar-card panel reveal" data-tilt data-tilt-strength="4"><small>${p.label}</small><strong>${p.value}</strong><span>${p.meta}</span><p>${p.description}</p></article>`).join('');
    return '';
  },
  renderNumerology(profile){
    if(!profile){this.setHTML('#numerologyReading','Tạo hồ sơ để xem phân tích.');this.setHTML('#cycleStack','');this.setHTML('#numerologyMetrics','');this.setHTML('#numerologyFormula','');this.setHTML('#numerologyInsightGrid','<div class="empty-inline">Tạo hồ sơ để xem ba điểm nổi bật.</div>');this.setHTML('#numerologyAxisBars','');this.setText('#numerologyGenderTitle','Theo hồ sơ');this.setText('#numerologyGenderBadge','Cần hồ sơ');this.setHTML('#numerologyGenderReading','Chọn thông tin hồ sơ để bổ sung lớp diễn giải.');return}
    const d=NumerologyCalculator.calculate(profile,new Date()),axes=d.synthesis.axes;
    this.setHTML('#numerologyReading',d.reading);
    this.setText('#currentDateBadge',Format.vn(new Date(),{day:'2-digit',month:'2-digit',year:'numeric'}));
    this.setHTML('#cycleStack',d.cycles.map(c=>`<article class="cycle-card"><b>${c.value}</b><strong>${c.label}</strong><p>${c.text}</p><span class="chip" style="margin-top:8px">${c.meta}</span></article>`).join(''));
    this.setText('#numerologyGenderTitle',`${this.genderLabel(profile.gender)} • góc nhìn bổ sung`);this.setText('#numerologyGenderBadge',this.genderLabel(profile.gender));this.setHTML('#numerologyGenderReading',d.genderReading);
    this.setHTML('#numerologyMetrics',this.renderResultPanel('metrics',d.metrics,FeatureConfig.fortune));
    this.setHTML('#numerologyFormula',d.formulas.map(x=>`<div class="formula-item"><b>${x[0]}</b><code>${x[1]}</code></div>`).join(''));
    const inner=axes[1],current=axes[2];
    const cues=[
      {label:'CHỦ ĐỀ LẶP LẠI',value:d.synthesis.dominantFamily,detail:`Nhiều chỉ số cùng chạm vào nhóm “${d.synthesis.dominantFamily}”. Hãy xem đây là một chủ đề thường quay lại trong cách bạn làm việc hoặc phản ứng, không phải nhãn cố định.`},
      {label:'BÊN TRONG ↔ BÊN NGOÀI',value:inner.score>=80?'Khá liền mạch':inner.score>=58?'Có độ chuyển dịch':'Dễ bị hiểu khác',detail:inner.score>=80?'Nhu cầu bên trong khá dễ biểu lộ ra ngoài; thử chú ý xem bạn có đang mặc định người khác sẽ tự hiểu mình không.':inner.score>=58?'Bạn có khả năng điều chỉnh cách biểu đạt theo bối cảnh; điều cần giữ là nói rõ nhu cầu cốt lõi để không tự mệt vì thích nghi quá nhiều.':'Điều bạn cảm nhận và điều người khác thấy có thể cách nhau khá xa. Giao tiếp bằng ví dụ cụ thể sẽ hiệu quả hơn chờ người khác suy đoán.'},
      {label:'NHỊP HIỆN TẠI',value:current.score>=70?'Thuận với thói quen':'Đang buộc bạn học thêm',detail:current.score>=70?'Giai đoạn này khá hợp để làm sâu những cách làm đã chứng minh hiệu quả và chọn ít mục tiêu hơn nhưng làm đến nơi.':'Giai đoạn hiện tại có thể tạo cảm giác hơi trái tay. Thay vì xem đó là “xui”, hãy thử nhận diện năng lực mới mà hoàn cảnh đang buộc bạn luyện.'}
    ];
    this.setHTML('#numerologyInsightGrid',cues.map(x=>`<article class="insight-card fortune-cue" data-tilt data-tilt-strength="3"><small>${x.label}</small><strong>${x.value}</strong><p>${x.detail}</p></article>`).join(''));
    this.setHTML('#numerologyAxisBars',axes.map(x=>`<div class="axis-row"><div class="axis-meta"><span>${x.label}</span><b>${x.state} • ${x.score}/100</b></div><div class="axis-track"><i style="--axis:${x.score}%"></i></div><p>${x.detail}</p></div>`).join(''))
  },
  renderHoroscope(profile){
    if(!profile){this.setText('#horoscopeName','Chưa có dữ liệu');this.setText('#horoscopeSub','Thiết lập ngày sinh để phân tích.');this.setHTML('#horoscopeTags','');this.setHTML('#horoscopePillars',this.renderResultPanel('pillars',[{label:'TUỔI CAN CHI',value:'—',meta:'—',description:'Can Chi năm sinh.'},{label:'NGÀY SINH ÂM LỊCH',value:'—',meta:'UTC+7',description:'Ngày âm quy đổi.'},{label:'CAN CHI NGÀY SINH',value:'—',meta:'—',description:'Can Chi ngày sinh.'},{label:'CAN CHI GIỜ SINH',value:'—',meta:'—',description:'Cần giờ sinh.'}],FeatureConfig.horoscope));this.setHTML('#compatibilityBox','');this.setHTML('#elementBars','');this.setHTML('#horoscopeReading','Chưa đủ dữ liệu.');this.setHTML('#genderAstroBox','');this.setHTML('#genderAstroReading','Chọn giới tính để đánh dấu Cung phi tương ứng.');this.setText('#genderAstroBadge','Cần hồ sơ');this.setHTML('#horoscopeInsightGrid','<div class="empty-inline">Tạo hồ sơ để xem ma trận cấu trúc.</div>');this.setHTML('#horoscopeRelationMatrix','');return}
    const d=AstrologyCalculator.analyze(profile),{yc,dc,hc,lunar,z}=d;this.setText('#zodiacOrb',z.symbol);this.setText('#horoscopeName',profile.fullName);this.setText('#horoscopeSub',`${this.genderLabel(profile.gender)} • Dương lịch ${Format.vn(d.birth,{day:'2-digit',month:'2-digit',year:'numeric'})}${profile.birthTime?` • ${profile.birthTime}`:''}${profile.birthPlace?` • ${profile.birthPlace}`:''}`);this.setHTML('#horoscopeTags',[this.genderLabel(profile.gender),`${yc.stem} ${yc.branch}`,yc.element,z.name,`Âm ${lunar.day}/${lunar.month}${lunar.leap?' nhuận':''}`].map(x=>`<span class="chip">${x}</span>`).join(''));
    const pillars=[{label:'TUỔI CAN CHI',value:`${yc.stem} ${yc.branch}`,meta:`${yc.animal} • Can ${yc.element} • Chi ${MysticalData.BRANCH_ELEMENT[yc.branchIndex]}`,description:`<b>Thiên Can:</b> ${AstrologyCalculator.stemFull(yc.stemIndex)}.<br><b>Địa Chi:</b> ${AstrologyCalculator.branchFull(yc.branchIndex)}.`},{label:'NGÀY SINH ÂM LỊCH',value:`${lunar.day}/${lunar.month}/${lunar.year}${lunar.leap?' N':''}`,meta:lunar.leap?'Tháng nhuận • UTC+7':'Âm lịch Việt Nam • UTC+7',description:'Quy đổi bằng mô hình thiên văn Sóc + kinh độ Mặt Trời.'},{label:'CAN CHI NGÀY SINH',value:`${dc.stem} ${dc.branch}`,meta:`${dc.animal} • Can ${dc.element} • Chi ${MysticalData.BRANCH_ELEMENT[dc.branchIndex]}`,description:`<b>Thiên Can:</b> ${AstrologyCalculator.stemFull(dc.stemIndex)}.<br><b>Địa Chi:</b> ${AstrologyCalculator.branchFull(dc.branchIndex)}.`},{label:'CAN CHI GIỜ SINH',value:hc?`${hc.stem} ${hc.branch}`:'Chưa nhập',meta:hc?`Giờ ${hc.branch} • Can ${hc.element}`:'—',description:hc?`<b>Giờ sinh:</b> ${profile.birthTime}.<br><b>Thiên Can:</b> ${AstrologyCalculator.stemFull(hc.stemIndex)}.`:'Bổ sung giờ sinh để tính Thiên Can và Địa Chi giờ.'}];this.setHTML('#horoscopePillars',this.renderResultPanel('pillars',pillars,FeatureConfig.horoscope));this.setHTML('#horoscopeReading',d.reading);
    const relHtml=x=>`<div class="relation-item"><div class="relation-label">${x[0]}</div><strong>${x[1]}</strong><p>${x[2]}</p></div>`;this.setHTML('#compatibilityBox',d.relationsMain.map(relHtml).join('')+`<details class="relation-more"><summary>Xem thêm Chi ngày, Chi giờ và ghi chú Nam/Nữ</summary>${d.relationExtra.map(relHtml).join('')}</details>`);
    this.setText('#genderAstroBadge',`Hồ sơ ${this.genderLabel(profile.gender)}`);this.setHTML('#genderAstroBox',[{g:'male',label:'NAM',kua:d.maleKua},{g:'female',label:'NỮ',kua:d.femaleKua}].map(x=>`<article class="gender-kua ${profile.gender===x.g?'active':''}"><div class="gender-kua-head"><span>${x.label}</span>${profile.gender===x.g?'<b>ĐANG DÙNG</b>':''}</div><strong>Quái số ${x.kua.number} • Cung ${x.kua.gua}</strong><p><b>Ngũ hành cung:</b> ${x.kua.element}</p><p><b>Nhóm mệnh:</b> ${x.kua.group}</p><small><b>Nhóm phương vị:</b> ${x.kua.directions}</small></article>`).join(''));this.setHTML('#genderAstroReading',`<strong>Địa Chi không đổi theo giới tính:</strong> ${AstrologyCalculator.branchFull(yc.branchIndex)} thuộc Tam hợp <strong>${d.tri.name} — ${d.tri.bureau}</strong>; Lục hợp với <strong>${MysticalData.BRANCHES[d.harm]}</strong>; đối xung trực tiếp với <strong>${MysticalData.BRANCHES[d.rel.clash]}</strong>; nằm trong nhóm Tứ hành xung <strong>${d.four.name}</strong>.<br><br>${AstrologyCalculator.genderInsight(profile.gender,d.selectedKua,yc,dc,hc)}`);
    this.setHTML('#horoscopeInsightGrid',d.deepInsights.map(x=>`<article class="insight-card" data-tilt data-tilt-strength="4"><small>${x.label}</small><strong>${x.value}</strong><p>${x.detail}</p></article>`).join(''));this.setHTML('#horoscopeRelationMatrix',d.relationMatrix.map(x=>`<article class="matrix-card ${x.tone}"><div><small>${x.from} ↔ ${x.to}</small><strong>${x.a} ↔ ${x.b}</strong></div><span>${x.label}</span><p>${x.detail}</p></article>`).join(''));this.setText('#elementTitle',`${yc.element} — Thiên Can năm ${yc.stem}`);this.setHTML('#elementBars',Object.entries(d.counts).map(([e,c])=>`<div class="element-row"><span>${e} — ${c}/${d.total}</span><div class="element-track"><div class="element-fill" style="width:${Math.round(c/d.total*100)}%"></div></div><b>${Math.round(c/d.total*100)}%</b></div>`).join(''));this.setHTML('#elementDesc',`<b>Thiên Can năm:</b> ${AstrologyCalculator.stemFull(yc.stemIndex)} → <b>${yc.element}</b>.<br><b>Thiên Can ngày:</b> ${AstrologyCalculator.stemFull(dc.stemIndex)} → <b>${dc.element}</b>.${hc?`<br><b>Thiên Can giờ:</b> ${AstrologyCalculator.stemFull(hc.stemIndex)} → <b>${hc.element}</b>.`:''}`);this.setText('#westernZodiac',`${z.symbol} ${z.name}`);this.setHTML('#westernDesc',`<b>Khoảng cung:</b> ${AstrologyCalculator.zodiacRange(z.name)}.<br><b>Diễn giải:</b> ${z.text}.`)
  },

  renderCompatibilityProfile(profile){
    if(!profile){
      this.setText('#compatSelfName','Chưa có hồ sơ');
      this.setText('#compatSelfMeta','Tạo hồ sơ của bạn trước khi so sánh.');
      this.setHTML('#compatSelfTags','');
      return;
    }
    const birth=new Date(profile.birthDate+'T12:00:00'),yc=AstrologyCalculator.yearCanChi(birth.getFullYear()),z=AstrologyCalculator.western(profile.birthDate),life=NumerologyCalculator.lifePath(profile.birthDate);
    this.setText('#compatSelfName',profile.fullName);
    this.setText('#compatSelfMeta',`${Format.vn(birth,{day:'2-digit',month:'2-digit',year:'numeric'})} • ${yc.stem} ${yc.branch} • ${z.name}`);
    this.setHTML('#compatSelfTags',[`Chủ đạo ${life}`,`Tuổi ${yc.animal}`,yc.element,this.genderLabel(profile.gender)].map(x=>`<span class="chip">${x}</span>`).join(''));
  },

  renderCompatibility(result){
    const empty=this.q('#compatEmpty'),box=this.q('#compatResult'),deep=this.q('#compatDeepPanel');
    if(!result){
      empty?.classList.remove('hidden');box?.classList.add('hidden');deep?.classList.add('hidden');
      this.setHTML('#compatDimensionGrid','');
      return;
    }
    empty?.classList.add('hidden');box?.classList.remove('hidden');deep?.classList.remove('hidden');
    const {A,B}=result;

    this.animateNumber('#compatScore',result.overall,850);
    this.setText('#compatLabel',result.label);
    this.setText('#compatRelationLabel',result.relationLabel);
    this.setHTML('#compatSummary',result.summary);
    const ring=this.q('#compatScoreRing');if(ring)ring.style.setProperty('--compat-score',`${result.overall*3.6}deg`);
    this.setText('#compatDataCompleteness',`${result.dataCompleteness}% dữ liệu đầu vào`);
    this.setText('#compatMissing',result.missing.length?`Có thể bổ sung: ${result.missing.join(' • ')}.`:'Các trường tùy chọn chính cho mô hình hiện tại đã có đủ.');

    const profileCard=(x,side)=>`<article class="pair-profile ${side}"><small>${side==='self'?'BẠN':'NGƯỜI SO SÁNH'}</small><strong>${x.profile.fullName}</strong><span>${x.year.stem} ${x.year.branch} • ${x.year.animal} • ${x.zodiac.name}</span><div class="pair-mini"><b>Chủ đạo ${x.values.life}</b><b>Biểu đạt ${x.values.expression}</b><b>Linh hồn ${x.values.soul}</b></div></article>`;
    this.setHTML('#compatPairProfiles',`${profileCard(A,'self')}<div class="pair-link"><svg class="icon icon-lg"><use href="#i-compatibility"/></svg><span>${result.relationLabel}</span></div>${profileCard(B,'partner')}`);

    this.animateNumber('#compatNaturalScore',result.naturalFit,700);
    this.setText('#compatNaturalText',result.naturalFit>=75?'Nhiều trục chính đang khá cùng nhịp.':result.naturalFit>=60?'Có nền chung nhưng vẫn cần thương lượng ở một số vùng.':'Khác biệt giữa các trục chính khá rõ; nên ưu tiên kiểm chứng ngoài đời thực.');
    this.setText('#compatEffortLevel',result.effort.label);
    this.setText('#compatEffortText',result.effort.text);
    this.setText('#compatPatternTitle',result.pattern.title);
    this.setText('#compatPatternText',result.pattern.text);
    this.setHTML('#compatStory',`<span class="eyebrow">CÂU CHUYỆN TƯƠNG TÁC</span><h3>${result.story.title}</h3><p>${result.story.body}</p>`);
    this.setText('#compatSpreadLabel',result.spreadLabel);

    const entries=Object.entries(result.dimensions);
    this.setHTML('#compatDimensionGrid',entries.map(([key,d])=>`<article class="compat-axis ${key}"><div class="compat-axis-head"><div><small>${d.label}</small><strong>${d.short}</strong></div><b>${d.score}</b></div><div class="compat-track"><i style="--compat-bar:${d.score}%"></i></div><details><summary>Vì sao hệ thống đọc như vậy?</summary><p>${d.detail}</p></details></article>`).join(''));

    this.setHTML('#compatExpertReport',result.expertSections.map((x,i)=>`<section class="expert-section ${i===0?'expert-lead':''}"><span class="expert-kicker">${x.kicker}</span><h4>${x.title}</h4><p>${x.body}</p></section>`).join(''));
    this.setHTML('#compatStrengths',result.strengths.map(x=>`<li><strong>${x.label}</strong><span>${x.short}</span></li>`).join(''));
    this.setHTML('#compatChallenges',result.challenges.map(x=>`<li><strong>${x.label}</strong><span>${x.short}</span></li>`).join(''));
    this.setHTML('#compatConversationPrompts',result.conversationPrompts.map(x=>`<article class="compat-prompt"><b>${String(x.number).padStart(2,'0')}</b><p>${x.question}</p></article>`).join(''));
    this.setHTML('#compatAdvice',result.practicalAdvice.slice(0,3).map(x=>`<li>${x}</li>`).join(''));
    this.setHTML('#compatRealityChecklist',result.realityChecklist.map((x,i)=>`<label class="reality-check"><input type="checkbox"><span><b>${String(i+1).padStart(2,'0')}</b>${x}</span></label>`).join(''));
    this.setHTML('#compatTraditional',`<div class="traditional-grid"><article><small>ĐỊA CHI NĂM</small><strong>${result.branch.label}</strong><p>${result.branch.detail}</p></article><article><small>NGŨ HÀNH THIÊN CAN</small><strong>${result.element.label}</strong><p>${result.element.detail}</p></article><article><small>CUNG PHI</small><strong>${result.kua.label}</strong><p>${result.kua.detail}</p></article><article><small>CUNG HOÀNG ĐẠO</small><strong>${result.zodiac.label}</strong><p>${result.zodiac.detail}</p></article></div>`);
    this.setText('#compatDisclaimer',result.disclaimer);
    this.halo('#compatibilityResultPanel');
    this.motion(this.q('#view-compatibility'));
  },

  resetCompatibilityForm(){
    const ids=['#partnerName','#partnerBirthDate','#partnerBirthTime','#partnerBirthPlace'];ids.forEach(sel=>{const el=this.q(sel);if(el)el.value=''});
    const gender=this.q('#partnerGender');if(gender)gender.value='';
    const type=this.q('#relationshipType');if(type)type.value='general';
  },
  renderDateProfile(profile){if(!profile){this.setText('#dateProfileBranch','—');this.setText('#dateProfileElement','—');return}const by=AstrologyCalculator.yearCanChi(new Date(profile.birthDate+'T12:00:00').getFullYear());this.setText('#dateProfileBranch',`${by.stem} ${by.branch}`);this.setText('#dateProfileElement',`Tuổi ${by.animal} • ${by.element}`)},
  tarotSigil(index){const n=index%4;return n===0?`<svg class="icon-xl"><use href="#i-star"/></svg>`:n===1?`<svg class="icon-xl"><use href="#i-moon"/></svg>`:n===2?`<svg class="icon-xl"><use href="#i-compass"/></svg>`:`<svg class="icon-xl"><use href="#i-horoscope"/></svg>`},
  renderTarot(result){
    if(!result){this.q('#tarotEmpty')?.classList.remove('hidden');this.q('#tarotResult')?.classList.add('hidden');this.q('#tarotAnalysisPanel')?.classList.add('hidden');return}
    this.q('#tarotEmpty')?.classList.add('hidden');this.q('#tarotResult')?.classList.remove('hidden');this.q('#tarotAnalysisPanel')?.classList.remove('hidden');this.setText('#tarotResultQuestion',result.q);this.setText('#tarotSessionCode',result.session);this.setText('#tarotSpreadLabel',result.mode==='auto'?'TRẢI BÀI AUTO • 6 LÁ':'TRẢI BÀI 3 LÁ');this.setText('#tarotAnalysisTitle',result.mode==='auto'?'Toàn cảnh theo 6 vùng đời sống':'Mạch chính của trải bài');this.setText('#tarotAnalysisBadge',result.mode==='auto'?'Auto toàn cảnh':result.mode==='open'?'Không câu hỏi':result.mode==='preset'?'Câu hỏi gợi ý':'Tự đặt câu hỏi');this.setHTML('#tarotContext',result.context.map(x=>`<span class="chip">${x}</span>`).join(''));
    this.setHTML('#tarotPatternGrid',result.synthesis.cards.map(x=>`<article class="pattern-card" data-tilt data-tilt-strength="4"><small>${x.label}</small><strong>${x.value}</strong><p>${x.detail}</p></article>`).join(''));const grid=this.q('#tarotGrid');grid.classList.toggle('auto',result.mode==='auto');grid.innerHTML=result.picks.map((p,i)=>{const [roman,name,up,rev]=p.card,meaning=p.reversed?rev:up,interp=result.mode==='auto'?`${result.domains[i].title}: ${result.domains[i].lens}. Lá này nhấn mạnh ${meaning}.`:TarotEngine.topicInterpret(result.topic,i,meaning);return `<article class="tarot-reading"><div class="tarot-position">${result.positions[i]}</div><div class="tarot-card-shell" data-tilt data-tilt-strength="8"><div class="tarot-card-inner"><div class="tarot-card-back"><div class="back-frame">${this.tarotSigil(i)}<span>HUYỀN CÁC</span></div></div><div class="tarot-card-face ${p.reversed?'reversed':''}"><div class="card-roman">${roman}</div><div class="card-sigil">${this.tarotSigil(i)}</div><div class="card-name">${name}</div><div class="card-state">${p.reversed?'LÁ NGƯỢC':'LÁ XUÔI'}</div></div></div></div><div class="tarot-meaning"><strong>${result.mode==='auto'?result.domains[i].title:(p.reversed?'Mặt cần xem lại':'Ý nghĩa trọng tâm')}</strong><p>${meaning}.</p><p>${interp}</p></div></article>`}).join('');this.setHTML('#tarotSummary',result.summary);this.setHTML('#tarotActions',result.actions.map(x=>`<li>${x}</li>`).join(''));this.dealAnimation();this.halo('#tarotResultPanel')
  },
  renderDates(data,showAll=false){
    if(!data){this.setText('#bestDate','—');this.setText('#bestScore','—');this.setText('#goodDateCount','—');this.setText('#bestDateMeta','Chưa phân tích');this.setText('#dateSeparation','—');this.setHTML('#bestHighlights','<div class="empty-inline">Các lý do chính sẽ xuất hiện sau khi phân tích.</div>');this.setHTML('#dateTop3','<div class="empty-inline">Chưa có dữ liệu Top 3.</div>');this.setHTML('#dateDistribution','');this.setText('#dateDecisionNote','Chọn khoảng ngày ở phía trên để hệ thống so sánh.');this.setHTML('#dateResults','<div class="empty-state compact"><p>Chọn khoảng ngày rồi bấm “Tìm ngày phù hợp”.</p></div>');this.q('#toggleAllDates')?.classList.add('hidden');return}
    const {best,good,by,purpose,list,top3,distribution,gap,separation}=data;
    this.setText('#bestDate',Format.vn(best.date,{day:'2-digit',month:'2-digit'}));this.setText('#bestDateMeta',`${Format.vn(best.date,{weekday:'long',day:'2-digit',month:'2-digit',year:'numeric'})} • ${best.dc.stem} ${best.dc.branch}`);this.animateNumber('#bestScore',best.score);this.animateNumber('#goodDateCount',good);this.setText('#dateProfileBranch',`${by.stem} ${by.branch}`);this.setText('#dateProfileElement',`Tuổi ${by.animal} • ${by.element}`);this.setText('#dateRankingTitle',`${MysticalData.PURPOSE_NAME[purpose]} — toàn bộ xếp hạng`);this.setText('#dateSeparation',separation);
    const positive=[...best.factors].filter(f=>f.score>0).sort((a,b)=>b.score-a.score).slice(0,2),negative=[...best.factors].filter(f=>f.score<0).sort((a,b)=>a.score-b.score).slice(0,1),highlights=[...positive,...negative];
    this.setHTML('#bestHighlights',(highlights.length?highlights:[...best.factors].slice(0,3)).map(f=>`<article class="date-highlight ${f.score<0?'risk':'plus'}"><span>${f.score<0?'Cần cân nhắc':'Điểm hỗ trợ'}</span><strong>${f.label}</strong><p>${f.detail}</p><b>${f.score>0?'+':''}${f.score}</b></article>`).join(''));
    this.setHTML('#dateTop3',top3.map((x,i)=>{const [label]=DateScorer.rank(x.score);return `<article class="top3-card rank-${i+1}" data-tilt data-tilt-strength="3"><div class="top3-rank">#${i+1}</div><div><small>${label}</small><strong>${Format.vn(x.date,{day:'2-digit',month:'2-digit'})}</strong><span>${x.dc.stem} ${x.dc.branch}</span></div><b>${x.score}</b></article>`}).join(''));
    const total=list.length,distItems=[['Rất phù hợp',distribution.excellent,'excellent'],['Khá phù hợp',distribution.good,'good'],['Trung tính',distribution.neutral,'neutral'],['Cân nhắc',distribution.low,'low']];this.setHTML('#dateDistribution',distItems.map(([label,count,cls])=>`<div class="distribution-row ${cls}"><span>${label}<b>${count} ngày</b></span><div><i style="--dist:${total?Math.round(count/total*100):0}%"></i></div></div>`).join(''));
    const gapMessage=gap<=2?'Ba ngày đầu gần như ngang nhau. Đừng tuyệt đối hóa vị trí #1; hãy chọn ngày thuận tiện hơn về lịch, con người và điều kiện thực tế.':gap<=6?`Ngày đứng đầu chỉ nhỉnh hơn vị trí #2 khoảng ${gap} điểm. Có thể xem Top 3 như một nhóm lựa chọn tốt thay vì cố chốt đúng một ngày.`:`Ngày đứng đầu tạo khoảng cách ${gap} điểm so với vị trí #2, nên nổi bật hơn trong chính mô hình tham khảo này. Vẫn cần ưu tiên điều kiện thực tế.`;
    this.setHTML('#dateDecisionNote',gapMessage);
    const visible=showAll?list:list.slice(0,8),toggle=this.q('#toggleAllDates');toggle?.classList.toggle('hidden',list.length<=8);if(toggle)toggle.textContent=showAll?'Thu gọn':'Xem toàn bộ';
    this.setHTML('#dateResults',visible.map((x,index)=>{const [label,cls]=DateScorer.rank(x.score);return `<article class="date-item"><div class="date-main"><div class="date-cal"><small>${Format.vn(x.date,{month:'short'})}</small><strong>${String(x.date.getDate()).padStart(2,'0')}</strong><small>${Format.vn(x.date,{weekday:'short'})}</small></div><div class="date-info"><strong>${index===0?'★ ':''}${x.dc.stem} ${x.dc.branch} • Âm ${x.lunar.day}/${x.lunar.month}${x.lunar.leap?'N':''}</strong><p>${label}. Mở lý do nếu bạn cần kiểm tra kỹ.</p></div><div class="score ${cls}"><strong>${x.score}</strong><small>${label}</small></div></div><details class="factor-details"><summary>Xem các yếu tố cộng / trừ</summary><div class="score-breakdown">${x.factors.map(f=>`<div class="factor ${f.score>0?'plus':f.score<0?'minus':'zero'}"><span><b>${f.label}</b><br>${f.detail}</span><b>${f.score>0?'+':''}${f.score}</b></div>`).join('')}</div></details></article>`}).join(''));this.halo('#bestDatePanel');this.motion(this.q('#view-dates'))
  },
  renderTarotPreset(){const topic=this.q('#tarotTopic')?.value||'general',sel=this.q('#tarotPresetQuestion'),items=MysticalData.TAROT_PRESETS[topic]||MysticalData.TAROT_PRESETS.general,old=sel?.value;if(sel){sel.innerHTML=items.map(q=>`<option value="${q.replace(/"/g,'&quot;')}">${q}</option>`).join('');if(items.includes(old))sel.value=old}},
  updateTarotModeUI(){const mode=this.q('#tarotMode')?.value||'auto';this.q('#tarotTopicField')?.classList.toggle('hidden',mode==='auto');this.q('#tarotPresetField')?.classList.toggle('hidden',mode!=='preset');this.q('#tarotQuestionField')?.classList.toggle('hidden',mode!=='custom');if(mode==='preset')this.renderTarotPreset();const info={auto:['Auto toàn cảnh 6 lá','Không cần chọn chủ đề hay nhập câu hỏi. Đọc 6 vùng: tổng quan, tình cảm, công việc, tài chính, phát triển và ưu tiên.'],open:['Không câu hỏi • 3 lá','Chỉ cần chọn chủ đề. Ba lá mô tả nền tảng, trọng tâm hiện tại và hướng tiếp cận.'],preset:['Câu hỏi gợi ý • 3 lá','Chọn chủ đề rồi chọn một câu hỏi viết sẵn để trải bài có trọng tâm.'],custom:['Tự đặt câu hỏi • 3 lá','Câu hỏi càng cụ thể, phần diễn giải theo ngữ cảnh càng dễ dùng.']}[mode];this.setHTML('#tarotModeInfo',`<strong>${info[0]}</strong><br>${info[1]}`)},
  openProfile(profile){if(profile){this.q('#fullName').value=profile.fullName||'';this.q('#birthDate').value=profile.birthDate||'';this.q('#birthTime').value=profile.birthTime||'';this.q('#gender').value=profile.gender||'';this.q('#birthPlace').value=profile.birthPlace||'';this.q('#privacyAgree').checked=true}else this.q('#profileForm')?.reset();this.q('#profileModal')?.classList.remove('hidden');document.body.style.overflow='hidden'},
  closeProfile(){this.q('#profileModal')?.classList.add('hidden');document.body.style.overflow=''},
  toast(message){alert(message)},
  motion(scope=document){if(!scope)return;this.qa('.reveal',scope).forEach((el,i)=>{el.classList.remove('visible');el.style.transitionDelay=`${Math.min(i,8)*65}ms`;requestAnimationFrame(()=>el.classList.add('visible'))})},
  halo(sel){const el=this.q(sel);if(!el)return;el.classList.remove('halo');requestAnimationFrame(()=>el.classList.add('halo'))},
  animateNumber(sel,to,duration=700){const el=this.q(sel);if(!el)return;const from=Number(el.dataset.n||0),start=performance.now();const tick=now=>{const p=Math.min(1,(now-start)/duration),v=Math.round(from+(to-from)*(1-Math.pow(1-p,3)));el.textContent=v;if(p<1)requestAnimationFrame(tick);else el.dataset.n=String(to)};requestAnimationFrame(tick)},
  dealAnimation(){const grid=this.q('#tarotGrid');if(!grid)return;grid.classList.add('dealing');const cards=this.qa('.tarot-reading',grid);cards.forEach((card,i)=>{card.classList.remove('dealt','revealed');setTimeout(()=>card.classList.add('dealt'),90+i*120);setTimeout(()=>card.classList.add('revealed'),430+i*145)});setTimeout(()=>grid.classList.remove('dealing'),1250+cards.length*90)},
  tiltInit(){}
};

/* =========================================================
   --- CONTROLLER --- Event delegation + state transitions
   ========================================================= */
