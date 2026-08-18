import assert from 'node:assert/strict';
import { NumerologyCalculator } from '../assets/js/models/numerology-calculator.js';
import { LunarConverter } from '../assets/js/models/lunar-converter.js';
import { AstrologyCalculator } from '../assets/js/models/astrology-calculator.js';
import { TarotEngine } from '../assets/js/models/tarot-engine.js';
import { DateScorer } from '../assets/js/models/date-scorer.js';

const profile={fullName:'Nguyễn Văn A',birthDate:'2001-11-18',birthTime:'08:30',gender:'male',birthPlace:'Bình Thuận'};
assert.equal(NumerologyCalculator.lifePath(profile.birthDate), 5);
const lunar=LunarConverter.fromDate(new Date('2026-08-17T12:00:00'));
assert.ok(lunar.day>0 && lunar.month>0 && lunar.year>0);
const yc=AstrologyCalculator.yearCanChi(2001);
assert.ok(yc.stem && yc.branch);
const tarot=TarotEngine.draw(profile,{mode:'auto',topic:'general',question:'',presetQuestion:''},new Date('2026-08-18T12:00:00'));
assert.equal(tarot.picks.length,6);
const dates=DateScorer.range(profile,'general',new Date('2026-08-18T12:00:00'),new Date('2026-08-25T12:00:00'));
assert.equal(dates.list.length,8);
console.log('✓ Model smoke tests passed');
