// core/engine.js

// === ИМПОРТ МОДУЛЕЙ ===
import Numerology from '../modules/numerology.js';
import Matrix from '../modules/matrix.js';
import Tarot from '../modules/tarot.js';
import Astrology from '../modules/astrology.js';
import Runes from '../modules/runes.js';

const MODULES = [Numerology, Matrix, Tarot, Astrology, Runes];

// === ИНИЦИАЛИЗАЦИЯ ===
export function init() {
  console.log('🔮 Thaumatrix Engine v2.0 Loaded');
  createCosmicBackground();
  setupEventListeners();
}

function setupEventListeners() {
  document.getElementById('calcBtn').addEventListener('click', runAnalysis);
  document.getElementById('geoBtn').addEventListener('click', findCoordinates);
}

// === КОСМИЧЕСКИЙ ФОН (Звёзды + Метеоры + Планеты) ===
function createCosmicBackground() {
  const container = document.getElementById('cosmicBg');
  if (!container) return;
  
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
  
  // Планеты (уже есть в CSS, но можно добавить динамически)
  const planets = [
    { class: 'planet planet-1' },
    { class: 'planet planet-2' },
    { class: 'planet planet-3' },
    { class: 'planet planet-4' }
  ];
  
  planets.forEach(p => {
    const planet = document.createElement('div');
    planet.className = p.class;
    container.appendChild(planet);
  });
}

// === ГЕОЛОКАЦИЯ (ПОИСК ГОРОДА) ===
window.geoData = { lat: 55.7558, lon: 37.6173, name: 'Москва' };

async function findCoordinates() {
  const city = document.getElementById('birthPlace').value.trim();
  const status = document.getElementById('geoStatus');
  
  if (!city) {
    status.textContent = '❌ Введите название города';
    status.className = 'geo-status error';
    return;
  }
  
  status.textContent = '⏳ Поиск координат...';
  status.className = 'geo-status';
  
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}&limit=1`);
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
      status.textContent = '❌ Город не найден';
      status.className = 'geo-status error';
    }
  } catch (error) {
    status.textContent = '❌ Ошибка сети';
    status.className = 'geo-status error';
  }
}

// === ГЛАВНЫЙ РАСЧЁТ ===
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
    
    // Запуск модулей
    for (const mod of MODULES) {
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
    }
    
    // Резонанс
    const resonances = findResonances(allArchetypes);
    const text = generateResonanceText(input.name, resonances, results);
    const confidence = Math.min(98, 60 + resonances.length * 12);
    
    document.getElementById('resonanceText').innerHTML = text;
    document.getElementById('resonanceHighlights').innerHTML = resonances.slice(0, 6).map(r => 
      `<span class="highlight-tag">✨ ${r}</span>`
    ).join('');
    document.getElementById('confidenceLevel').textContent = `Резонанс систем: ${confidence}%`;
    
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

// === ДВИЖОК РЕЗОНАНСА ===
function findResonances(archetypes) {
  const freq = {};
  archetypes.forEach(a => freq[a] = (freq[a] || 0) + 1);
  
  return Object.entries(freq)
    .filter(([_, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .map(([name]) => name);
}

function generateResonanceText(name, resonances, results) {
  const templates = [
    `${name}, системы сходятся. Ваш путь пронизан энергией <strong>${resonances[0] || 'глубинной трансформации'}</strong>.`,
    `То, что казалось случайным, обретает форму. ${resonances[1] ? `Ваша сила — в ${resonances[1].toLowerCase()}.` : ''}`,
    `Астрологически вы ${results.astrology?.sun || 'искатель'}, а резонанс указывает на <strong>${resonances[0] || 'уникальный путь'}</strong>.`,
    `Сейчас время ${results.biorhythms?.intuit > 50 ? 'внутреннего наблюдения и доверия интуиции' : 'активного действия и проявления воли'}.`,
    `⚠️ Следующие 14 дней — окно высокой синхронизации. Не форсируйте события.`
  ];
  
  return templates.filter(t => t.trim()).join('<br><br>');
}
