// features/oracle-engine.js
import archetypeLib from '../data/archetype-library.json' assert { type: 'json' };

export default {
  generate(input, results) {
    const { name } = input;
    
    // 1. Собираем все архетипы
    const allArchetypes = [];
    Object.values(results).forEach(mod => {
      if (mod?.archetypes) allArchetypes.push(...mod.archetypes);
    });
    
    // 2. Находим доминирующий
    const freq = {};
    allArchetypes.forEach(a => freq[a] = (freq[a]||0)+1);
    const dominant = Object.entries(freq).sort((a,b)=>b[1]-a[1])[0]?.[0] || 'universal';
    
    // 3. Берем описание из библиотеки
    const arch = archetypeLib.archetypes[dominant] || archetypeLib.archetypes.universal;
    
    // 4. Генерируем текст
    let report = `🔮 **Послание для ${name}**\n\n`;
    report += `**Твоя суть:** ${arch.name}\n`;
    report += `Ты обладаешь даром ${arch.keywords[0]}. Это твой ключ к гармонии.\n\n`;
    
    // Валидация прошлого
    report += `🕰️ **Эхо прошлого**\n`;
    report += `Период 2019-2021 стал для тебя временем трансформации. То, что ушло — освободило место для нового.\n\n`;
    
    // Прогноз
    report += `🔭 **Вектор судьбы**\n`;
    report += `Ближайшие 3 месяца — время ${arch.keywords[1]}. Доверься потоку, но не теряй фокус.\n\n`;
    
    // Предостережение
    report += `⚠️ **Точка внимания**\n`;
    report += `${arch.shadow ? `Остерегайся ${arch.shadow[0]}.` : 'Будь внимателен к деталям.'}\n`;
    
    return report;
  }
};
