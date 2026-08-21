import assert from 'node:assert/strict';
import { NumerologyCalculator } from '../assets/js/models/numerology-calculator.js';
import { LunarConverter } from '../assets/js/models/lunar-converter.js';
import { AstrologyCalculator } from '../assets/js/models/astrology-calculator.js';
import { TarotEngine } from '../assets/js/models/tarot-engine.js';
import { CompatibilityCalculator } from '../assets/js/models/compatibility-calculator.js';
import { DateScorer } from '../assets/js/models/date-scorer.js';
import { Identity } from '../assets/js/utils/identity.js';

const profile={fullName:'Nguyễn Văn A',birthDate:'2001-11-18',birthTime:'08:30',gender:'male',birthPlace:'Bình Thuận'};

// Numerology
assert.equal(NumerologyCalculator.lifePath(profile.birthDate),5);
const numerology=NumerologyCalculator.calculate(profile,new Date('2026-08-18T12:00:00'));
assert.equal(numerology.metrics.length,8);
assert.equal(numerology.synthesis.axes.length,3);
assert.equal(numerology.synthesis.insights.length,3);
assert.ok(numerology.synthesis.axes.every(x=>x.score>=0&&x.score<=100));
assert.match(numerology.reading,/BỨC TRANH CHUNG/);
assert.equal(numerology.age,24);
assert.ok(numerology.finance?.doNow&&numerology.finance?.avoid);
assert.ok(numerology.future?.should&&numerology.future?.avoid);
assert.ok(numerology.love?.need&&numerology.love?.greenFlags.length===3);


// Optional identity discriminator: raw values are converted to a fingerprint only
const idA=await Identity.fingerprint({cccd:'123456789012',phone:'0901234567',fullName:profile.fullName,birthDate:profile.birthDate});
const idB=await Identity.fingerprint({cccd:'123456789013',phone:'0901234567',fullName:profile.fullName,birthDate:profile.birthDate});
assert.ok(idA&&idB&&idA!==idB);
assert.equal(Identity.sourceLabel('123456789012','0901234567'),'CCCD + số điện thoại');

// Lunar / Can Chi
const lunar=LunarConverter.fromDate(new Date('2026-08-17T12:00:00'));
assert.ok(lunar.day>0&&lunar.month>0&&lunar.year>0);
const yc=AstrologyCalculator.yearCanChi(2001);
assert.ok(yc.stem&&yc.branch);
const astro=AstrologyCalculator.analyze(profile);
assert.ok(astro.relationMatrix.length>=2);
assert.equal(astro.deepInsights.length,3);
assert.match(astro.reading,/GIỚI HẠN MÔ HÌNH/);

// Tarot deterministic + synthesis
const tarotA=TarotEngine.draw(profile,{mode:'auto',topic:'general',question:'',presetQuestion:''},new Date('2026-08-18T12:00:00'));
const tarotB=TarotEngine.draw(profile,{mode:'auto',topic:'general',question:'',presetQuestion:''},new Date('2026-08-18T18:00:00'));
assert.equal(tarotA.picks.length,6);
assert.deepEqual(tarotA.picks.map(x=>[x.cardIndex,x.reversed]),tarotB.picks.map(x=>[x.cardIndex,x.reversed]));
assert.equal(tarotA.synthesis.cards.length,3);
assert.match(tarotA.summary,/KẾT LUẬN ĐIỀU HÀNH/);


// Compatibility model: reference score + multi-dimensional analysis
const partner={fullName:'Trần Thị B',birthDate:'2002-05-12',birthTime:'14:15',gender:'female',birthPlace:'Lâm Đồng'};
const compatibility=CompatibilityCalculator.analyze(profile,partner,'love',new Date('2026-08-18T12:00:00'));
assert.ok(compatibility.overall>=0&&compatibility.overall<=100);
assert.equal(Object.keys(compatibility.dimensions).length,6);
assert.equal(compatibility.strengths.length,2);
assert.equal(compatibility.challenges.length,2);
assert.equal(compatibility.realityChecklist.length,4);
assert.equal(compatibility.expertSections.length,3);
assert.equal(compatibility.conversationPrompts.length,3);
assert.ok(compatibility.naturalFit>=0&&compatibility.naturalFit<=100);
assert.ok(compatibility.effortIndex>=0&&compatibility.effortIndex<=100);
assert.ok(compatibility.pattern?.title);
assert.match(compatibility.disclaimer,/không phải xác suất|không thể thay thế/i);

// Date scorer deep output
const dates=DateScorer.range(profile,'general',new Date('2026-08-18T12:00:00'),new Date('2026-08-25T12:00:00'));
assert.equal(dates.list.length,8);
assert.equal(dates.top3.length,3);
assert.equal(Object.values(dates.distribution).reduce((a,b)=>a+b,0),8);
assert.ok(typeof dates.separation==='string');
assert.ok(dates.list.every(x=>x.factors.length===5));
assert.match(dates.expertAnalysis,/ĐỘ ỔN ĐỊNH CỦA KẾT QUẢ/);

console.log('✓ v5.9 easy-read + private-identity smoke tests passed');
