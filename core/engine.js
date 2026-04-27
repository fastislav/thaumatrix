// core/engine.js

// 1. Импортируем все модули (пока только Нумерология для теста)
import Numerology from '../modules/numerology.js';
import AIReport from '../features/ai-report.js';

// 2. Реестр всех систем
const SYSTEMS = [
  Numerology,
  // Сюда потом добавим: Matrix, Tarot, Astro и т.д.
];

// 3. Инициализация (запускается при загрузке)
export function init() {
  console.log('🔮 Thaumatrix Engine Initialized');
  setupEventListeners();
  createStars();
}

function setupEventListeners() {
  document.getElementById('calcBtn').addEventListener('click', runAnalysis);
  document.getElementById('geoBtn').addEventListener('click', findCoordinates);
}

// 4. Главная функция запуска
async function runAnalysis() {
  const input = gatherInput();
  if (!input.date) return alert('Введите дату!');

  // Блокируем кнопку
  const btn = document.getElementById('calcBtn');
  btn.textContent = '⏳ Анализ систем...';
  
  // Даем браузеру отрисовать текст
  await new Promise(r => setTimeout(r, 100));

  try {
    let allResults = {};
    let allArchetypes = [];

    // Запускаем каждый модуль
    for (const system of SYSTEMS) {
      if (system.isActive !== false) {
        const result = system.calculate(input);
        allResults[system.id] = result;
        
        // Собираем архетипы для резонанса
        if (result.archetypes) {
          allArchetypes.push(...result.archetypes);
        }
        
        // Рендерим карточку модуля (если есть HTML элемент)
        const container = document.getElementById(`res-${system.id}`);
        if (container && system.render) {
          container.innerHTML = system.render(result);
          container.closest('.module-card').style.display = 'block';
        }
      }
    }

    // Запускаем ИИ-отчет (текстовый)
    const aiPrompt = AIReport.generate(allResults, input);
    document.getElementById('ai-prompt-box').innerText = aiPrompt;
    document.getElementById('ai-section').style.display = 'block';

    // Показываем результаты
    document.getElementById('results').classList.add('show');
    document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
    
    // Обновляем UI
    document.getElementById('resonance-count').innerText = `Найдено ${allArchetypes.length} пересечений`;

  } catch (e) {
    console.error(e);
    alert('Ошибка расчета: ' + e.message);
  } finally {
    btn.textContent = '🔮 Активировать Резонанс';
  }
}

// Сбор данных из формы
function gatherInput() {
  return {
    name: document.getElementById('name').value,
    date: document.getElementById('date').value,
    time: document.getElementById('time').value,
    place: document.getElementById('place').value,
    geo: window.geoData || {} // Берем глобальные координаты
  };
}

// Вспомогательная функция звезд (копия из старого кода)
function createStars() {
  const sC = document.getElementById('stars');
  for(let i=0; i<80; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    s.style.left = Math.random()*100 + '%';
    s.style.width = s.style.height = (Math.random()*2 + 1) + 'px';
    s.style.animationDuration = (Math.random()*3 + 2) + 's';
    s.style.animationDelay = Math.random()*5 + 's';
    sC.appendChild(s);
  }
}

// Глобальная функция для геолокации (доступна из HTML)
window.findCoordinates = async function() {
  const city = document.getElementById('place').value;
  const status = document.getElementById('geoStatus');
  status.textContent = "⏳ Поиск...";
  
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${city}&limit=1`);
    const data = await res.json();
    if (data.length > 0) {
      window.geoData = { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
      status.innerHTML = `✅ ${data[0].display_name.split(',')[0]} <br> <small>${window.geoData.lat.toFixed(2)}, ${window.geoData.lon.toFixed(2)}</small>`;
    } else {
      status.textContent = "❌ Не найдено";
    }
  } catch(e) { status.textContent = "❌ Ошибка сети"; }
}
