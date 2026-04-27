// core/engine.js

// === ИМПОРТ МОДУЛЕЙ ===
// Убедитесь, что файлы существуют в папке modules/
import Numerology from '../modules/numerology.js';
import Matrix from '../modules/matrix.js';
import Tarot from '../modules/tarot.js';
import Astrology from '../modules/astrology.js';
import Runes from '../modules/runes.js';

const MODULES = [Numerology, Matrix, Tarot, Astrology, Runes];

// === ИНИЦИАЛИЗАЦИЯ ===
export function init() {
  console.log('[THAUMATRIX] System Online');
  initStars();
  setupEvents();
}

function setupEvents() {
  document.getElementById('calcBtn').addEventListener('click', runCalculation);
  document.getElementById('geoBtn').addEventListener('click', syncLocation);
}

// === ГЕНЕРАЦИЯ ЗВЕЗД (ИСПРАВЛЕНО) ===
function initStars() {
  const container = document.getElementById('starfield');
  if (!container) return;
  container.innerHTML = '';
  const count = 120;
  for (let i = 0; i < count; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    const size = Math.random() * 2 + 1;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.animationDuration = `${Math.random() * 4 + 2}s`;
    star.style.animationDelay = `${Math.random() * 5}s`;
    container.appendChild(star);
  }
}

// === ГЕОЛОКАЦИЯ (ИСПРАВЛЕНО) ===
window.geoData = { lat: 55.7558, lon: 37.6173, name: 'Москва' }; // Default

async function syncLocation() {
  const input = document.getElementById('place');
  const status = document.getElementById('geoStatus');
  const city = input.value.trim();
  
  if (!city) { status.textContent = 'ВВЕДИТЕ ГОРОД'; status.className = 'geo-status'; return; }
  
  status.textContent = 'ПОИСК СПУТНИКОВ...';
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city)}&limit=1`);
    const data = await res.json();
    
    if (data.length > 0) {
      const p = data[0];
      window.geoData = { lat: parseFloat(p.lat), lon: parseFloat(p.lon), name: p.display_name.split(',')[0] };
      status.innerHTML = `SYNC OK: ${window.geoData.name} <br> [${window.geoData.lat.toFixed(2)}, ${window.geoData.lon.toFixed(2)}]`;
      status.className = 'geo-status ok';
    } else {
      status.textContent = 'ЛОКАЦИЯ НЕ НАЙДЕНА';
      status.className = 'geo-status';
    }
  } catch (e) {
    status.textContent = 'ОШИБКА СЕТИ';
    status.className = 'geo-status';
  }
}

// === ГЛАВНЫЙ РАСЧЕТ ===
async function runCalculation() {
  const btn = document.getElementById('calcBtn');
  const input = {
    name: document.getElementById('name').value.trim() || 'SUBJECT_01',
    date: document.getElementById('date').value,
    time: document.getElementById('time').value || '12:00:00',
    place: document.getElementById('place').value,
    geo: window.geoData
  };

  if (!input.date) return alert('[ERROR] DATE REQUIRED');

  btn.textContent = 'PROCESSING...';
  btn.disabled = true;
  
  await new Promise(r => setTimeout(r, 400)); // UI delay

  try {
    const results = {};
    let allArchetypes = [];

    // 1. Запуск модулей
    for (const mod of MODULES) {
      try {
        const res = mod.calculate(input);
        results[mod.id] = res;
        if (res?.archetypes) allArchetypes.push(...res.archetypes);
        
        const container = document.getElementById(`res-${mod.id}`);
        const card = document.getElementById(`card-${mod.id}`);
        if (container && mod.render && res) {
          container.innerHTML = mod.render(res);
          card.style.display = 'block';
        }
      } catch (e) { console.warn(`[MODULE ${mod.id}] Error:`, e); }
    }

    // 2. Резонанс
    const resonance = computeResonance(allArchetypes);
    renderResonance(resonance);

    // 3. Оракул
    const oracleText = generateOracle(input, results, resonance);
    document.getElementById('oracle-output').innerHTML = oracleText;

    // 4. Показать
    document.getElementById('results').classList.add('show');
    document.getElementById('results').scrollIntoView({ behavior: 'smooth', block: 'start' });

  } catch (e) {
    console.error('[CORE] Critical Error:', e);
    alert('[SYSTEM FAILURE] CHECK CONSOLE');
  } finally {
    btn.textContent = 'ЗАПУСТИТЬ РАСЧЕТ';
    btn.disabled = false;
  }
}

// === ДВИЖОК РЕЗОНАНСА ===
function computeResonance(archetypes) {
  const freq = {};
  archetypes.forEach(a => freq[a] = (freq[a] || 0) + 1);
  return Object.entries(freq)
    .filter(([_, c]) => c >= 2)
    .sort((a, b) => b[1] - a[1])
    .map(([name]) => name);
}

function renderResonance(tags) {
  const container = document.getElementById('resonance-tags');
  if (tags.length === 0) {
    container.innerHTML = '<span class="tag">NO CROSS-SYSTEM RESONANCE DETECTED</span>';
    return;
  }
  container.innerHTML = tags.map(t => `<span class="tag">◈ ${t.toUpperCase()}</span>`).join('');
}

// === ЛОКАЛЬНЫЙ ОРАКУЛ (БЕЗ API) ===
function generateOracle(input, results, resonance) {
  const name = input.name;
  const theme = resonance[0] || 'UNIVERSAL';
  
  const templates = {
    leader: `${name}, системы фиксируют доминирующую частоту ЛИДЕРА. Ты здесь, чтобы структурировать хаос. Твоя сила в инициативе, но тень — в контроле. Ближайший цикл требует делегирования.`,
    warrior: `${name}, зафиксирована энергия ВОИНА. Ты проходишь через фазу прорыва. Сопротивление среды временно. Действуй четко, но избегай фронтового импульса.`,
    mystic: `${name}, резонанс указывает на МИСТИКА. Твой канал открыт через интуицию, а не логику. Знаки будут приходить во снах и случайных совпадениях. Записывай их.`,
    wise_one: `${name}, частота МУДРЕЦА активна. Время анализа и паузы. Не форсируй события. Ответ придет через структурированное наблюдение.`,
    creator: `${name}, зафиксирован поток ТВОРЦА. Реальность пластична для тебя сейчас. Завершай начатое, иначе энергия рассеется.`,
    universal: `${name}, мультисистемный сканер не выявил жесткой доминанты. Это признак гибкости. Ты адаптер. Используй текущий момент для калибровки внутренних параметров.`
  };

  const base = templates[theme] || templates.universal;
  
  // Добавляем валидацию прошлого (эвристика)
  const birthYear = new Date(input.date).getFullYear();
  const age = new Date().getFullYear() - birthYear;
  const cycleHit = [22, 29, 36, 44].some(c => Math.abs(age - c) <= 1);
  
  let validation = cycleHit 
    ? `<br><br>⏳ <b>КАРМИЧЕСКИЙ ЦИКЛ:</b> Возраст ${age} лет совпадает с точкой пересмотра жизненного контракта (22/29/36/44 года). То, что казалось стабильным, требует обновления.`
    : `<br><br>⏳ <b>ХРОНО-МАРКЕР:</b> Период 2019-2021 оставил структурный след в твоей матрице. Отпущенное тогда освободило ресурс для текущего этапа.`;

  return `<b>// ORACLE OUTPUT</b><br>${base}${validation}<br><br><i>Confidence: ${85 + Math.floor(Math.random()*14)}%</i>`;
}

// Экспорт для запуска
init();
