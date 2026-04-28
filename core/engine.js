// core/engine.js
// Thaumatrix Engine v2.0 - AI-Powered Resonance Engine

// ============================================
// 1. КОСМИЧЕСКИЙ ФОН
// ============================================
function initCosmicBackground() {
  const container = document.getElementById('cosmicBg');
  if (!container) return;
  
  container.innerHTML = '';
  
  // Звёзды (100 шт)
  for (let i = 0; i < 100; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.left = Math.random() * 100 + '%';
    star.style.animationDuration = (Math.random() * 3 + 2) + 's';
    star.style.animationDelay = Math.random() * 5 + 's';
    container.appendChild(star);
  }
  
  // Метеоры (5 шт)
  for (let i = 0; i < 5; i++) {
    const meteor = document.createElement('div');
    meteor.className = 'meteor';
    meteor.style.left = Math.random() * 100 + '%';
    meteor.style.top = Math.random() * 50 + '%';
    meteor.style.animationDuration = (Math.random() * 3 + 2) + 's';
    meteor.style.animationDelay = (Math.random() * 10 + i * 5) + 's';
    container.appendChild(meteor);
  }
  
  // Планеты (4 шт)
  ['planet-1', 'planet-2', 'planet-3', 'planet-4'].forEach(cls => {
    const p = document.createElement('div');
    p.className = `planet ${cls}`;
    container.appendChild(p);
  });
  
  console.log('🌌 Cosmic background initialized');
}

// ============================================
// 2. ГЕОЛОКАЦИЯ (ПОИСК ГОРОДА)
// ============================================
window.geoData = { lat: 55.7558, lon: 37.6173, name: 'Москва' };

async function findCoordinates() {
  const city = document.getElementById('birthPlace').value.trim();
  const status = document.getElementById('geoStatus');
  const btn = document.getElementById('geoBtn');
  
  if (!city) {
    status.textContent = '❌ Введите название города';
    status.className = 'geo-status error';
    return;
  }
  
  btn.disabled = true;
  btn.textContent = '⏳ Поиск...';
  status.textContent = '';
  status.className = 'geo-status';
  
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}&limit=1`, {
      headers: { 'User-Agent': 'ThaumatrixApp/1.0' }
    });
    const data = await response.json();
    
    if (data && data.length > 0) {
      const place = data[0];
      window.geoData = {
        lat: parseFloat(place.lat),
        lon: parseFloat(place.lon),
        name: place.display_name.split(',')[0]
      };
      
      const parts = place.display_name.split(',');
      const region = parts[1] ? parts[1].trim() : '';
      const country = parts[parts.length - 1] ? parts[parts.length - 1].trim() : '';
      
      status.innerHTML = `✅ <strong>${window.geoData.name}</strong><br><small>${region}, ${country}<br>📍 ${window.geoData.lat.toFixed(2)}°, ${window.geoData.lon.toFixed(2)}°</small>`;
      status.className = 'geo-status success';
    } else {
      status.textContent = '❌ Город не найден. Попробуйте написать на английском.';
      status.className = 'geo-status error';
    }
  } catch (error) {
    console.error('Geo error:', error);
    status.textContent = '❌ Ошибка сети или блокировка запроса.';
    status.className = 'geo-status error';
  } finally {
    btn.disabled = false;
    btn.textContent = '🔍 Поиск';
  }
}

// ============================================
// 3. УТИЛИТЫ
// ============================================
function reduceNumber(num) {
  while (num > 9 && num !== 11 && num !== 22) {
    num = String(num).split('').reduce((a, b) => a + Number(b), 0);
  }
  return num;
}

function cyrillicToNumber(str) {
  const map = {
    'а':1,'и':1,'с':1,'ъ':1,
    'б':2,'й':2,'т':2,'ы':2,
    'в':3,'к':3,'у':3,'ь':3,
    'г':4,'л':4,'ф':4,'э':4,
    'д':5,'м':5,'х':5,'ю':5,
    'е':6,'н':6,'ц':6,'я':6,
    'ё':7,'о':7,'ч':7,
    'ж':8,'п':8,'ш':8,
    'з':9,'р':9,'щ':9
  };
  let sum = 0;
  for (let c of str.toLowerCase()) {
    if (map[c]) sum += map[c];
  }
  return sum || 1;
}

function parseDate(str) {
  const [y, m, d] = str.split('-').map(Number);
  return { year: y, month: m, day: d };
}

// ============================================
// 4. МОДУЛИ РАСЧЁТА
// ============================================
const MODULES = [
  {
    id: 'numerology',
    name: '🔢 Нумерология',
    calculate(input) {
      if (!input.date) return null;
      const { year, month, day } = parseDate(input.date);
      const lifePath = reduceNumber(day + month + year);
      const destiny = reduceNumber(cyrillicToNumber(input.name));
      const archMap = {
        1: 'Лидер', 2: 'Дипломат', 3: 'Творец', 4: 'Строитель',
        5: 'Искатель', 6: 'Наставник', 7: 'Мудрец', 8: 'Управленец', 9: 'Гуманист'
      };
      return {
        lifePath,
        destiny,
        soul: Math.abs(lifePath - destiny) || 1,
        archetypes: [archMap[lifePath] || 'Универсал']
      };
    },
    render(d) {
      return `
        <div class="result-item"><div class="result-value">${d.lifePath}</div><div class="result-label">Путь</div></div>
        <div class="result-item"><div class="result-value">${d.destiny}</div><div class="result-label">Судьба</div></div>
        <div class="result-item"><div class="result-value">${d.soul}</div><div class="result-label">Душа</div></div>
      `;
    }
  },
  {
    id: 'matrix',
    name: '🌀 Матрица Судьбы',
    calculate(input) {
      if (!input.date) return null;
      const { year, month, day } = parseDate(input.date);
      const sum = n => n > 22 ? reduceNumber(n) : n;
      const ySum = reduceNumber(String(year).split('').reduce((a, b) => a + Number(b), 0));
      return {
        day: sum(day),
        month: sum(month),
        year: ySum,
        center: sum(day + month + ySum),
        karma: sum(day + month),
        talent: sum(month + ySum),
        money: sum(day + ySum),
        love: sum(sum(day) + sum(month)),
        archetypes: ['Мудрец', 'Трансформация']
      };
    },
    render(d) {
      return `
        <div class="result-item"><div class="result-value" style="color:var(--gold)">${d.center}</div><div class="result-label">Центр</div></div>
        <div class="result-item"><div class="result-value">${d.day}</div><div class="result-label">День</div></div>
        <div class="result-item"><div class="result-value">${d.month}</div><div class="result-label">Месяц</div></div>
        <div class="result-item"><div class="result-value">${d.year}</div><div class="result-label">Год</div></div>
      `;
    }
  },
  {
    id: 'tarot',
    name: '🃏 Таро',
    calculate(input) {
      if (!input.date) return null;
      const { year, month, day } = parseDate(input.date);
      const yearSum = String(year).split('').reduce((a, b) => a + Number(b), 0);
      let sum = day + month + yearSum;
      while (sum > 22) sum = String(sum).split('').reduce((a, b) => a + Number(b), 0);
      if (sum === 0) sum = 22;
      const cards = [
        'Шут','Маг','Жрица','Императрица','Император','Иерофант',
        'Влюбленные','Колесница','Сила','Отшельник','Колесо Фортуны',
        'Справедливость','Повешенный','Смерть','Умеренность','Дьявол',
        'Башня','Звезда','Луна','Солнце','Суд','Мир'
      ];
      return {
        arcana: sum,
        name: cards[sum - 1],
        archetypes: ['Архетип', cards[sum - 1]]
      };
    },
    render(d) {
      return `
        <div class="result-item"><div class="result-value">${d.arcana}</div><div class="result-label">${d.name}</div></div>
      `;
    }
  },
  {
    id: 'astrology',
    name: '🌌 Астрология',
    calculate(input) {
      if (!input.date) return null;
      const { year, month, day } = parseDate(input.date);
      const h = parseInt((input.time || '12:00').split(':')[0]);
      const lat = input.geo?.lat || 55.75;
      const lon = input.geo?.lon || 37.61;
      
      const signs = [
        'Козерог','Водолей','Рыбы','Овен','Телец','Близнецы',
        'Рак','Лев','Дева','Весы','Скорпион','Стрелец'
      ];
      const days = [20,19,21,20,21,21,23,23,23,23,22,22];
      const sun = signs[day < days[month - 1] ? month - 1 : month];
      
      const ascIndex = Math.floor((h + (lon / 15) + (lat / 30) + (month * 2)) % 12);
      const ascSigns = [
        'Овен','Телец','Близнецы','Рак','Лев','Дева',
        'Весы','Скорпион','Стрелец','Козерог','Водолей','Рыбы'
      ];
      const asc = ascSigns[ascIndex < 0 ? ascIndex + 12 : ascIndex];
      
      return {
        sun,
        asc,
        archetypes: [sun, asc]
      };
    },
    render(d) {
      return `
        <div class="result-item"><div class="result-value">☀️ ${d.sun}</div><div class="result-label">Солнце</div></div>
        <div class="result-item"><div class="result-value">🌅 ${d.asc}</div><div class="result-label">Асцендент</div></div>
      `;
    }
  },
  {
    id: 'runes',
    name: 'ᚚ Руны',
    calculate(input) {
      if (!input.date) return null;
      const { year, month, day } = parseDate(input.date);
      const runes = [
        'Феху','Уруз','Турисаз','Ансуз','Райдо','Кеназ','Гебо','Вуньо',
        'Хагалаз','Наутиз','Иса','Йера','Эйваз','Перт','Альгиз','Соулу',
        'Тейваз','Беркана','Эваз','Манназ','Лагуз','Ингуз','Отал','Дагаз'
      ];
      const r = runes[(day + month + year) % 24];
      return {
        rune: r,
        archetypes: [r, 'Древний символ']
      };
    },
    render(d) {
      return `
        <div class="result-item"><div class="result-value">ᚚ</div><div class="result-label">${d.rune}</div></div>
      `;
    }
  }
];

// ============================================
// 5. ДВИЖОК РЕЗОНАНСА
// ============================================
function findResonances(archetypes) {
  const freq = {};
  archetypes.forEach(a => freq[a] = (freq[a] || 0) + 1);
  return Object.entries(freq)
    .filter(([_, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .map(([name]) => name);
}

function generateResonanceText(name, resonances, results) {
  if (resonances.length === 0) {
    return `${name}, твой путь уникален. Каждая система подсвечивает свою грань.`;
  }
  const theme = resonances.slice(0, 3).join(', ').toLowerCase();
  return `${name}, системы сходятся: твоя жизнь пронизана энергией <strong>${theme}</strong>. Это твой ключ к гармонии. То, что казалось случайным, обретает форму. ⚠️ Следующие 14 дней — окно высокой синхронизации.`;
}

// ============================================
// 6. AI ОРАКУЛ (ЗАПРОС К VERCEL API)
// ============================================
async function fetchAIReport(input, results) {
  const output = document.getElementById('oracle-output');
  if (!output) return;
  
  output.innerHTML = '⏳ Связь с Оракулом...';
  
  try {
    // ЗАМЕНИТЕ НА ВАШ URL ИЗ VERCEL!
    const vercelUrl = 'https://thaumatrix.vercel.app/api/analyze';
    
    const response = await fetch(vercelUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input, results })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.text) {
      output.innerHTML = data.text.replace(/\n/g, '<br>');
    } else {
      output.innerHTML = '⚠️ Оракул получил данные, но не дал ответа.';
    }
  } catch (e) {
    console.error('AI Error:', e);
    output.innerHTML = `⚠️ Ошибка соединения с Оракулом.<br><small>${e.message}</small><br><br>Проверьте:<br>1. API файл создан в папке api/analyze.js<br>2. Ключи добавлены в Vercel<br>3. URL в коде правильный`;
  }
}

// ============================================
// 7. ГЛАВНЫЙ ЗАПУСК
// ============================================
async function runAnalysis() {
  const input = {
    name: document.getElementById('fullName').value || 'Искатель',
    date: document.getElementById('birthDate').value,
    time: document.getElementById('birthTime').value || '12:00:00',
    place: document.getElementById('birthPlace').value,
    geo: window.geoData
  };
  
  if (!input.date) {
    alert('Введите дату рождения');
    return;
  }
  
  const btn = document.getElementById('calcBtn');
  btn.textContent = '⏳ Анализ систем...';
  btn.disabled = true;
  
  await new Promise(r => setTimeout(r, 300));
  
  try {
    const results = {};
    let allArchetypes = [];
    
    // Запуск всех модулей
    MODULES.forEach(mod => {
      try {
        const res = mod.calculate(input);
        results[mod.id] = res;
        
        if (res?.archetypes) {
          allArchetypes.push(...res.archetypes);
        }
        
        const container = document.getElementById(`res-${mod.id}`);
        const card = document.getElementById(`card-${mod.id}`);
        
        if (container && mod.render && res) {
          container.innerHTML = mod.render(res);
          card.style.display = 'block';
        }
      } catch (e) {
        console.warn(`[MODULE ${mod.id}] Error:`, e);
      }
    });
    
    // Резонанс
    const resonances = findResonances(allArchetypes);
    document.getElementById('resonanceText').innerHTML = generateResonanceText(input.name, resonances, results);
    document.getElementById('resonanceHighlights').innerHTML = resonances.slice(0, 6).map(r => 
      `<span class="highlight-tag">✨ ${r}</span>`
    ).join('');
    document.getElementById('confidenceLevel').textContent = `Резонанс систем: ${Math.min(98, 60 + resonances.length * 12)}%`;
    
    // AI Оракул (асинхронно)
    fetchAIReport(input, results);
    
    // Показ результатов
    document.getElementById('results').classList.add('show');
    setTimeout(() => {
      document.getElementById('results').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 300);
    
  } catch (e) {
    console.error('Engine error:', e);
    alert('Ошибка расчета: ' + e.message);
  } finally {
    btn.textContent = '🔮 Активировать резонанс';
    btn.disabled = false;
  }
}

// ============================================
// 8. ИНИЦИАЛИЗАЦИЯ
// ============================================
function setupEventListeners() {
  document.getElementById('calcBtn').addEventListener('click', runAnalysis);
  document.getElementById('geoBtn').addEventListener('click', findCoordinates);
}

// Запуск при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  initCosmicBackground();
  setupEventListeners();
  console.log('🔮 Thaumatrix Core Online v2.0');
});
