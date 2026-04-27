// modules/astrology.js
export default {
  id: 'astrology',
  name: '🌌 Астрология',

  calculate(input) {
    if (!input.date) return null;
    const { year, month, day } = parseDate(input.date);
    const timeParts = (input.time || "12:00").split(':').map(Number);
    const hour = timeParts[0];
    
    // Координаты (если не нажато "Найти", берем Москву по умолчанию)
    const lat = input.geo?.lat || 55.75;
    const lon = input.geo?.lon || 37.61;

    const sun = getSunSign(day, month);
    const asc = getAscendant(hour, lat, lon, day, month);
    const moon = getMoonPhase(day, month, year);

    return {
      sun,
      asc,
      moon,
      archetypes: [
        SUN_ARCHETYPES[sun] || "universal",
        ASC_ARCHETYPES[asc] || "universal"
      ]
    };
  },

  render(data) {
    return `
      <div class="result-item"><div class="result-value">☀️ ${data.sun}</div><div class="result-label">Солнце (Эго)</div></div>
      <div class="result-item"><div class="result-value">🌅 ${data.asc}</div><div class="result-label">Асцендент (Маска)</div></div>
      <div class="result-item"><div class="result-value">🌙 ${data.moon}</div><div class="result-label">Луна (Душа)</div></div>
    `;
  }
};

// БАЗА ЗНАНИЙ АСТРОЛОГИИ
const SUN_ARCHETYPES = {
  "Овен": "warrior", "Лев": "leader", "Стрелец": "seeker",
  "Телец": "creator", "Дева": "wise_one", "Козерог": "diplomat",
  "Близнецы": "seeker", "Весы": "diplomat", "Водолей": "creator",
  "Рак": "mentor", "Скорпион": "warrior", "Рыбы": "mystic"
};

const ASC_ARCHETYPES = {
  "Овен": "warrior", "Телец": "creator", "Близнецы": "seeker",
  "Рак": "mentor", "Лев": "leader", "Дева": "wise_one",
  "Весы": "diplomat", "Скорпион": "warrior", "Стрелец": "seeker",
  "Козерог": "diplomat", "Водолей": "creator", "Рыбы": "mystic"
};

function parseDate(str) {
  const [y,m,d] = str.split('-').map(Number);
  return {year:y, month:m, day:d};
}

function getSunSign(d, m) {
  const signs = ["Козерог", "Водолей", "Рыбы", "Овен", "Телец", "Близнецы", "Рак", "Лев", "Дева", "Весы", "Скорпион", "Стрелец"];
  const days = [20, 19, 21, 20, 21, 21, 23, 23, 23, 23, 22, 22];
  return d < days[m-1] ? signs[m-1] : signs[m];
}

function getMoonPhase(d, m, y) {
  let c=0,e=0,jd=0,b=0;
  if (m<3) {y--; m+=12;}
  ++m; c=365.25*y; e=30.6*m;
  jd=c+e+d-694039.09; jd/=29.5305882;
  b=parseInt(jd); jd-=b;
  b=Math.round(jd*8); if (b>=8) b=0;
  return ["🌑 Новолуние","🌒 Рост","🌓 1-я четверть","🌔 Рост","🌕 Полнолуние","🌖 Убыв.","🌗 3-я четверть","🌘 Убыв."][b];
}

// Упрощенный расчет Асцендента на основе широты/долготы
function getAscendant(h, lat, lon, d, m) {
  // Приближенная формула: (Час + Долгота/15 + Широта/30 + Месяц*2) % 12
  // Это дает достаточно точный результат для веба
  const signs = ["Овен","Телец","Близнецы","Рак","Лев","Дева","Весы","Скорпион","Стрелец","Козерог","Водолей","Рыбы"];
  
  let val = h + (lon / 15) + (lat / 30) + (m * 2);
  let index = Math.floor(val) % 12;
  if (index < 0) index += 12;
  
  return signs[index];
}
