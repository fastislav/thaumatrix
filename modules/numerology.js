// modules/numerology.js
import { reduceNumber, cyrillicToNumber } from '../core/utils.js';

export default {
  id: 'numerology',
  name: '🔢 Нумерология',
  
  calculate(input) {
    if (!input.date) return null;
    const { year, month, day } = parseDateSimple(input.date);
    
    const lifePath = reduceNumber(day + month + year);
    const destiny = reduceNumber(cyrillicToNumber(input.name));
    
    // Связываем с библиотекой архетипов
    const archetypeMap = {
      1: 'leader', 2: 'diplomat', 3: 'creator', 4: 'builder',
      5: 'seeker', 6: 'mentor', 7: 'wise_one', 8: 'manager', 9: 'humanist'
    };
    
    return {
      lifePath,
      destiny,
      soul: Math.abs(lifePath - destiny) || 1,
      archetypes: [archetypeMap[lifePath] || 'universal']
    };
  },
  
  render(data) {
    return `
      <div class="result-item"><div class="result-value">${data.lifePath}</div><div class="result-label">Число Пути</div></div>
      <div class="result-item"><div class="result-value">${data.destiny}</div><div class="result-label">Число Судьбы</div></div>
      <div class="result-item"><div class="result-value">${data.soul}</div><div class="result-label">Число Души</div></div>
    `;
  }
};

function parseDateSimple(str) {
  const [y,m,d] = str.split('-').map(Number);
  return {year:y, month:m, day:d};
}
