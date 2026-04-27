// modules/tarot.js
export default {
  id: 'tarot',
  name: '🃏 Таро: Аркан Судьбы',

  calculate(input) {
    if (!input.date) return null;
    const { year, month, day } = parseDate(input.date);

    // Формула расчета Старшего Аркана
    // (День + Месяц + Год) % 22
    const yearSum = String(year).split('').reduce((a, b) => a + Number(b), 0);
    let sum = day + month + yearSum;
    
    while (sum > 22) {
      sum = String(sum).split('').reduce((a, b) => a + Number(b), 0);
    }
    if (sum === 0) sum = 22; // Шут

    const card = CARDS[sum - 1];
    
    return {
      arcanaNum: sum,
      arcanaName: card.name,
      description: card.desc,
      archetypes: card.archetypes // Отправляем в резонанс
    };
  },

  render(data) {
    return `
      <div class="result-item" style="grid-column: span 2;">
        <div class="result-value">${data.arcanaNum}. ${data.arcanaName}</div>
        <div class="result-label">${data.description}</div>
      </div>
    `;
  }
};

// БАЗА ЗНАНИЙ ТАРО
const CARDS = [
  { num: 1, name: "Маг", desc: "Волшебник, начало пути, сила воли", archetypes: ["leader", "creator"] },
  { num: 2, name: "Жрица", desc: "Тайные знания, интуиция", archetypes: ["mystic", "wise_one"] },
  { num: 3, name: "Императрица", desc: "Плодородие, изобилие, природа", archetypes: ["creator", "mentor"] },
  { num: 4, name: "Император", desc: "Власть, структура, закон", archetypes: ["leader", "warrior"] },
  { num: 5, name: "Иерофант", desc: "Традиции, обучение, вера", archetypes: ["wise_one", "mentor"] },
  { num: 6, name: "Влюбленные", desc: "Выбор сердца, любовь, гармония", archetypes: ["creator", "diplomat"] },
  { num: 7, name: "Колесница", desc: "Победа, движение, контроль", archetypes: ["warrior", "leader"] },
  { num: 8, name: "Сила", desc: "Внутренняя мощь, терпение", archetypes: ["warrior", "wise_one"] },
  { num: 9, name: "Отшельник", desc: "Мудрость, уединение, поиск", archetypes: ["wise_one", "mystic"] },
  { num: 10, name: "Колесо Фортуны", desc: "Судьба, циклы, перемены", archetypes: ["mystic", "seeker"] },
  { num: 11, name: "Справедливость", desc: "Баланс, карма, истина", archetypes: ["wise_one", "diplomat"] },
  { num: 12, name: "Повешенный", desc: "Иной взгляд, жертва, пауза", archetypes: ["mystic", "wise_one"] },
  { num: 13, name: "Смерть", desc: "Трансформация, конец старого", archetypes: ["warrior", "mystic"] },
  { num: 14, name: "Умеренность", desc: "Гармония, терпение, золотая середина", archetypes: ["diplomat", "creator"] },
  { num: 15, name: "Дьявол", desc: "Искушение, страсть, зависимости", archetypes: ["warrior", "creator"] },
  { num: 16, name: "Башня", desc: "Разрушение старого, озарение", archetypes: ["warrior", "leader"] },
  { num: 17, name: "Звезда", desc: "Надежда, вдохновение, исцеление", archetypes: ["creator", "mystic"] },
  { num: 18, name: "Луна", desc: "Иллюзии, подсознание, страхи", archetypes: ["mystic", "wise_one"] },
  { num: 19, name: "Солнце", desc: "Радость, успех, ясность", archetypes: ["leader", "creator"] },
  { num: 20, name: "Суд", desc: "Возрождение, призыв, прощение", archetypes: ["wise_one", "warrior"] },
  { num: 21, name: "Мир", desc: "Завершение, целостность, путешествие", archetypes: ["creator", "diplomat"] },
  { num: 22, name: "Шут", desc: "Начало, свобода, спонтанность", archetypes: ["creator", "seeker"] }
];

function parseDate(str) {
  const [y,m,d] = str.split('-').map(Number);
  return {year:y, month:m, day:d};
}
