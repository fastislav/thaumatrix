// api/analyze.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { input, results } = req.body;
  
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

    const result = await response.json();
    return res.status(200).json({ 
      text: result.result.alternatives[0].message.text 
    });

  } catch (error) {
    console.error('AI Error:', error);
    return res.status(500).json({ error: 'AI service unavailable' });
  }
}
