// api/analyze.js

export default async function handler(req, res) {
  // 1. Разрешаем CORS (чтобы сайт с thaumatrix.com мог сюда обратиться)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { input, results } = req.body;
  
  if (!input || !results) {
    return res.status(400).json({ error: 'No data provided' });
  }

  const systemPrompt = `
Ты — Thaumatrix Oracle. Ты анализируешь данные человека через 9 эзотерических систем.
Твой стиль: глубокий, мистический, но точный. Избегай общих фраз.
Дай ответ на русском языке.

Структура ответа:
1. 🔮 ГЛАВНЫЙ АРХЕТИП (Суть души)
2. ⚡ КАРМИЧЕСКАЯ ЗАДАЧА (Зачем он здесь)
3. 🔮 ПРОГНОЗ (Что ждет в ближайший цикл)
4. ⚠️ ПРЕДОСТЕРЕЖЕНИЕ (Слабое место)
`;

  const userPrompt = `Данные человека: ${JSON.stringify({ input, results })}`;

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
    
    if (!response.ok) {
      console.error('Yandex API Error:', data);
      return res.status(500).json({ error: `Yandex Error: ${JSON.stringify(data)}` });
    }

    const text = data.result?.alternatives?.[0]?.message?.text;
    
    if (!text) {
      return res.status(500).json({ error: 'Empty response from Yandex' });
    }

    return res.status(200).json({ text });

  } catch (error) {
    console.error('Server Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
