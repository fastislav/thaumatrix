// modules/matrix.js
import { reduceNumber } from '../core/utils.js';

export default {
  id: 'matrix',
  name: '🌀 Матрица Судьбы',
  
  calculate(input) {
    if (!input.date) return null;
    const { year, month, day } = parseDateSimple(input.date);
    
    const sum = n => n > 22 ? reduceNumber(n) : n;
    const yearSum = reduceNumber(String(year).split('').reduce((a,b)=>a+Number(b), 0));
    
    return {
      day: sum(day),
      month: sum(month), 
      year: sum(yearSum),
      center: sum(day + month + yearSum),
      karma: sum(day + month),
      talent: sum(month + yearSum),
      money: sum(day + yearSum),
      love: sum(sum(day) + sum(month)),
      archetypes: getMatrixArchetypes(sum(day), sum(month), sum(yearSum))
    };
  },
  
  render(data) {
    return `
      <div class="result-item"><div class="result-value">${data.center}</div><div class="result-label" style="color:var(--gold)">Центр</div></div>
      <div class="result-item"><div class="result-value">${data.day}</div><div class="result-label">День</div></div>
      <div class="result-item"><div class="result-value">${data.month}</div><div class="result-label">Месяц</div></div>
      <div class="result-item"><div class="result-value">${data.year}</div><div class="result-label">Год</div></div>
      <div class="result-item"><div class="result-value">${data.karma}</div><div class="result-label">Карма</div></div>
      <div class="result-item"><div class="result-value">${data.talent}</div><div class="result-label">Талант</div></div>
    `;
  }
};

function parseDateSimple(str) {
  const [y,m,d] = str.split('-').map(Number);
  return {year:y, month:m, day:d};
}

function getMatrixArchetypes(d, m, y) {
  // Упрощенная связь арканов с архетипами
  const map = {
    1:'leader', 2:'diplomat', 3:'creator', 4:'builder', 5:'seeker',
    6:'mentor', 7:'wise_one', 8:'manager', 9:'humanist', 10:'leader',
    11:'wise_one', 12:'mystic', 13:'warrior', 14:'diplomat', 15:'creator',
    16:'warrior', 17:'mystic', 18:'mystic', 19:'leader', 20:'wise_one',
    21:'humanist', 22:'seeker'
  };
  return [map[d], map[m], map[y]].filter(Boolean);
}
