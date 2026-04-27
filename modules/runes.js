// modules/runes.js
export default {
  id: 'runes',
  name: 'ᚚ Руны Старшего Футарка',

  calculate(input) {
    if (!input.date) return null;
    const { year, month, day } = parseDate(input.date);
    
    // Расчет руны дня рождения
    const sum = day + month + year;
    const index = sum % 24;
    const rune = RUNES[index];

    return {
      name: rune.name,
      symbol: rune.symbol,
      meaning: rune.meaning,
      archetypes: [rune.archetype]
    };
  },

  render(data) {
    return `
      <div class="result-item" style="font-size: 2rem;">${data.symbol}</div>
      <div class="result-item">
        <div class="result-value">${data.name}</div>
        <div class="result-label">${data.meaning}</div>
      </div>
    `;
  }
};

// БАЗА ЗНАНИЙ РУН
const RUNES = [
  { symbol: "ᚠ", name: "Феху", meaning: "Богатство, начало", archetype: "creator" },
  { symbol: "ᚢ", name: "Уруз", meaning: "Сила, здоровье", archetype: "warrior" },
  { symbol: "ᚦ", name: "Турисаз", meaning: "Врата, защита", archetype: "warrior" },
  { symbol: "ᚨ", name: "Ансуз", meaning: "Знание, слово", archetype: "wise_one" },
  { symbol: "ᚱ", name: "Райдо", meaning: "Путь, движение", archetype: "seeker" },
  { symbol: "ᚲ", name: "Кеназ", meaning: "Огонь, творчество", archetype: "creator" },
  { symbol: "ᚷ", name: "Гебо", meaning: "Дар, партнерство", archetype: "diplomat" },
  { symbol: "ᚹ", name: "Вуньо", meaning: "Радость, гармония", archetype: "creator" },
  { symbol: "ᚺ", name: "Хагалаз", meaning: "Разрушение, град", archetype: "warrior" },
  { symbol: "ᚾ", name: "Наутиз", meaning: "Нужда, терпение", archetype: "wise_one" },
  { symbol: "ᛁ", name: "Иса", meaning: "Лед, застой", archetype: "wise_one" },
  { symbol: "ᛃ", name: "Йера", meaning: "Урожай, цикл", archetype: "creator" },
  { symbol: "ᛇ", name: "Эйваз", meaning: "Тис, защита", archetype: "mystic" },
  { symbol: "ᛈ", name: "Перт", meaning: "Тайна, судьба", archetype: "mystic" },
  { symbol: "ᛉ", name: "Альгиз", meaning: "Лось, оберег", archetype: "mystic" },
  { symbol: "ᛊ", name: "Соулу", meaning: "Солнце, успех", archetype: "leader" },
  { symbol: "ᛏ", name: "Тейваз", meaning: "Воин, победа", archetype: "warrior" },
  { symbol: "ᛒ", name: "Беркана", meaning: "Береза, рост", archetype: "mentor" },
  { symbol: "ᛖ", name: "Эваз", meaning: "Конь, доверие", archetype: "seeker" },
  { symbol: "ᛗ", name: "Манназ", meaning: "Человек, я", archetype: "wise_one" },
  { symbol: "ᛚ", name: "Лагуз", meaning: "Вода, поток", archetype: "mystic" },
  { symbol: "ᛝ", name: "Ингуз", meaning: "Плод, завершение", archetype: "creator" },
  { symbol: "ᛟ", name: "Отал", meaning: "Наследие, дом", archetype: "diplomat" },
  { symbol: "ᛞ", name: "Дагаз", meaning: "День, прорыв", archetype: "leader" }
];

function parseDate(str) {
  const [y,m,d] = str.split('-').map(Number);
  return {year:y, month:m, day:d};
}
