// api/analyze.js

export default async function handler(req, res) {
  // 1. Разрешаем запросы с любых доменов (CORS)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); // Разрешаем всем
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Если это предварительный запрос браузера, отвечаем ОК и выходим
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Разрешаем только POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { input, results } = req.body;
  
  // Системный промпт
  const systemPrompt = `
Ты — Thaumatrix Oracle. Анализируй данные через 9 систем.
Стиль: глубокий, мистический, точный.
Структура ответа:
1. 🔮 ГЛАВНЫЙ АРХЕТИП
2. ⚡ КАРМИЧЕСКАЯ ЗАДАЧА
3. 🔮 ПРОГНОЗ
4. ⚠️ ПРЕДОСТЕРЕЖЕНИЕ
`;

  const userPrompt = `Данные: ${JSON.stringify({ input, results })}`;

  try {
    // Запрос к YandexGPT
    const response = await fetch('https://llm.api.cloud.yandex.net/foundationModels/v1/completion', {
      method: 'POST',
      headers: {
        'Authorization': `Api-Key ${process.env.YANDEX_API_KEY}`,
        'Content-Type': 'application/json',
        'x-folder-id': process.env.FOLDER_ID
      },
      body: JSON.stringify({
        modelUri: `gpt://${process.env.FOLDER_ID}/yandexgpt-lite/latest`,
        completionOptions: { stream: false, temperature: 0.7, maxTokens: 1000 },
        messages: [
          { role: 'system', text: systemPrompt },
          { role: 'user', text: userPrompt }
        ]
      })
    });

    const data = await response.json();
    
    // Проверяем, есть ли текст в ответе Яндекса
    const text = data.result?.alternatives[0]?.message?.text || "Оракул молчит...";
    
    return res.status(200).json({ text });

  } catch (error) {
    console.error('AI Error:', error);
    return res.status(500).json({ error: 'AI service unavailable' });
  }
}
