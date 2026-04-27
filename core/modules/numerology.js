// modules/numerology.js

export default {
  id: 'numerology',
  name: '🔢 Нумерология',
  isActive: true, // Можно выключать модули из реестра

  calculate(input) {
    if (!input.date) return null;
    const [y, m, d] = input.date.split('-').map(Number);
    
    // Логика расчета
    const lifePath = reduce(d + m + y);
    const destiny = reduce(input.name.split('').reduce((a, b) => a + charCode(b), 0));
    
    return {
      lifePath,
      destiny,
      archetypes: getArchetypes(lifePath) // Возвращаем ключевые слова для ИИ и Резонанса
    };
  },

  render(data) {
    return `
      <div class="result-item"><div class="result-value">${data.lifePath}</div><div class="result-label">Число Пути</div></div>
      <div class="result-item"><div class="result-value">${data.destiny}</div><div class="result-label">Число Судьбы</div></div>
    `;
  }
};

// Внутренние утилиты модуля
function reduce(num) {
  while (num > 9 && num !== 11 && num !== 22) {
    num = String(num).split('').reduce((a, b) => a + Number(b), 0);
  }
  return num;
}

function charCode(c) {
  const map = {'а':1,'б':2,'в':3,'г':4,'д':5,'е':6,'ё':7,'ж':8,'з':9,'и':1,'й':2,'к':3,'л':4,'м':5,'н':6,'о':7,'п':8,'р':9,'с':1,'т':2,'у':3,'ф':4,'х':5,'ц':6,'ч':7,'ш':8,'щ':9,'ъ':1,'ы':2,'ь':3,'э':4,'ю':5,'я':6};
  return map[c.toLowerCase()] || 0;
}

function getArchetypes(n) {
  const map = { 1: ['Лидер'], 2: ['Партнер'], 3: ['Творец'], 4: ['Строитель'], 5: ['Искатель'], 6: ['Наставник'], 7: ['Мудрец'], 8: ['Бизнесмен'], 9: ['Гуманист'] };
  return map[n] || ['Универсал'];
}
