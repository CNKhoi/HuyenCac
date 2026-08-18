import assert from 'node:assert/strict';
import { NumerologyCalculator } from '../assets/js/models/numerology-calculator.js';
import { LunarConverter } from '../assets/js/models/lunar-converter.js';
import { AstrologyCalculator } from '../assets/js/models/astrology-calculator.js';
import { TarotEngine } from '../assets/js/models/tarot-engine.js';
import { DateScorer } from '../assets/js/models/date-scorer.js';

const profile={fullName:'Nguyễn Văn A',birthDate:'2001-11-18',birthTime:'08:30',gender:'male',birthPlace:'Bình Thuận'};

// Numerology
assert.equal(NumerologyCalculator.lifePath(profile.birthDate),5);
const numerology=NumerologyCalculator.calculate(profile,new Date('2026-08-18T12:00:00'));
assert.equal(numerology.metrics.length,8);
assert.equal(numerology.synthesis.axes.length,3);
assert.equal(numerology.synthesis.insights.length,3);
assert.ok(numerology.synthesis.axes.every(x=>x.score>=0&&x.score<=100));

// Lunar / Can Chi
const lunar=LunarConverter.fromDate(new Date('2026-08-17T12:00:00'));
assert.ok(lunar.day>0&&lunar.month>0&&lunar.year>0);
const yc=AstrologyCalculator.yearCanChi(2001);
assert.ok(yc.stem&&yc.branch);
const astro=AstrologyCalculator.analyze(profile);
assert.ok(astro.relationMatrix.length>=2);
assert.equal(astro.deepInsights.length,3);

// Tarot deterministic + synthesis
const tarotA=TarotEngine.draw(profile,{mode:'auto',topic:'general',question:'',presetQuestion:''},new Date('2026-08-18T12:00:00'));
const tarotB=TarotEngine.draw(profile,{mode:'auto',topic:'general',question:'',presetQuestion:''},new Date('2026-08-18T18:00:00'));
assert.equal(tarotA.picks.length,6);
assert.deepEqual(tarotA.picks.map(x=>[x.cardIndex,x.reversed]),tarotB.picks.map(x=>[x.cardIndex,x.reversed]));
assert.equal(tarotA.synthesis.cards.length,3);

// Date scorer deep output
const dates=DateScorer.range(profile,'general',new Date('2026-08-18T12:00:00'),new Date('2026-08-25T12:00:00'));
assert.equal(dates.list.length,8);
assert.equal(dates.top3.length,3);
assert.equal(Object.values(dates.distribution).reduce((a,b)=>a+b,0),8);
assert.ok(typeof dates.separation==='string');
assert.ok(dates.list.every(x=>x.factors.length===5));

console.log('✓ v5.2 deep-model smoke tests passed');
