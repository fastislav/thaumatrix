// core/engine.js
import { reduceNumber, cyrillicToNumber, parseDate } from './utils.js';
import { findResonances, generateInsight } from './resonance.js';
import Oracle from '../features/oracle-engine.js';

// Импортируем модули
import Numerology from '../modules/numerology.js';
import Matrix from '../modules/matrix.js';
// ... добавьте остальные импорты по мере создания

const MODULES = [Numerology, Matrix /*, Tarot, Runes... */];

export function init() {
  console.log('🔮 Thaumatrix Engine v2.0 Loaded');
  setupUI();
  createStars();
}

function setupUI() {
  document.getElementById('calcBtn')?.addEventListener('click', runAnalysis);
  document.getElementById('geoBtn')?.addEventListener('click', findCoordinates);
}

async function runAnalysis() {
  const input = gatherInput();
  if (!input.date) return alert('Введите дату рождения');
  
  const btn = document.getElementById('calcBtn');
  btn.textContent = '⏳ Синхронизация систем...';
  btn.disabled = true;
  
  await new Promise(r => setTimeout(r, 300)); // Небольшая задержка для анимации
  
  try {
    const results = {};
    
    // Запускаем каждый модуль
    for (const mod of MODULES) {
      if (mod.calculate) {
        results[mod.id] = mod.calculate(input);
        // Рендерим карточку, если есть контейнер
        const container = document.getElementById(`res-${mod.id}`);
        if (container && mod.render) {
          container.innerHTML = mod.render(results[mod.id]);
          container.closest('.module-card')?.style.setProperty('display', 'block');
        }
      }
    }
    
    // === РЕЗОНАНС ===
    const resonances = findResonances(results);
    const insight = generateInsight(input.name, resonances, results);
    
    document.getElementById('resonance-text').innerHTML = insight;
    document.getElementById('resonance-tags').innerHTML = resonances
      .map(r => `<span class="highlight-tag">✨ ${r}</span>`).join('');
    
    // === ЛОКАЛЬНЫЙ ОРАКУЛ (пока без API) ===
    const oracleReport = Oracle.generate(input, results);
    document.getElementById('oracle-text').innerHTML = oracleReport
      .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
      .replace(/\n/g, '<br>');
    document.getElementById('oracle-section').style.display = 'block';
    
    // Показываем результаты
    document.getElementById('results').classList.add('show');
    document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
    
  } catch (e) {
    console.error('Engine error:', e);
    alert('Ошибка расчета: ' + e.message);
  } finally {
    btn.textContent = '🔮 Активировать Резонанс';
    btn.disabled = false;
  }
}

function gatherInput() {
  return {
    name: document.getElementById('name')?.value || 'Искатель',
    date: document.getElementById('date')?.value,
    time: document.getElementById('time')?.value || '12:00',
    place: document.getElementById('place')?.value,
    geo: window.geoData || { lat: 55.75, lon: 37.61 }
  };
}

// Геолокация (глобальная функция)
window.findCoordinates = async function() {
  const city = document.getElementById('place').value;
  const status = document.getElementById('geoStatus');
  if (!city) return;
  
  status.textContent = "⏳ Поиск...";
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${city}&limit=1`);
    const data = await res.json();
    if (data.length > 0) {
      window.geoData = { 
        lat: parseFloat(data[0].lat), 
        lon: parseFloat(data[0].lon),
        name: data[0].display_name.split(',')[0]
      };
      status.innerHTML = `✅ ${window.geoData.name}<br><small>${window.geoData.lat.toFixed(2)}°, ${window.geoData.lon.toFixed(2)}°</small>`;
    }
  } catch(e) { status.textContent = "❌ Ошибка"; }
}

// Звездный фон
function createStars() {
  const container = document.getElementById('stars');
  if (!container) return;
  for (let i = 0; i < 80; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.cssText = `left:${Math.random()*100}%;animation-duration:${Math.random()*3+2}s;animation-delay:${Math.random()*5}s`;
    container.appendChild(star);
  }
}
