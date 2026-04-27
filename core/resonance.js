// core/resonance.js

export function findResonances(results) {
  const allArchetypes = [];
  
  // Собираем все архетипы из модулей
  Object.values(results).forEach(mod => {
    if (mod?.archetypes) {
      allArchetypes.push(...mod.archetypes);
    }
  });
  
  // Считаем частоту
  const freq = {};
  allArchetypes.forEach(a => freq[a] = (freq[a] || 0) + 1);
  
  // Возвращаем те, что встречаются 2+ раза (резонанс!)
  return Object.entries(freq)
    .filter(([_, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .map(([name]) => name);
}

export function generateInsight(name, resonances, results) {
  if (resonances.length === 0) {
    return `${name}, твой путь уникален и многогранен. Каждая система подсвечивает свою грань.`;
  }
  
  const themes = resonances.slice(0, 3).join(', ').toLowerCase();
  return `${name}, системы сходятся: твоя жизнь пронизана энергией <strong>${themes}</strong>. Это твой ключ к гармонии.`;
}
