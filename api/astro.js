// api/astro.js
import { Astronomy, Observer, Vector } from 'astronomy-engine';

export default async function handler(req, res) {
  // Разрешаем CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { date, time, lat, lon } = req.body;
    const [year, month, day] = date.split('-').map(Number);
    const [hour, minute] = time.split(':').map(Number);

    // 1. Создаем наблюдателя (координаты)
    const observer = new Observer(lat, lon, 0);

    // 2. Создаем время наблюдения
    const dateObj = new Date(year, month - 1, day, hour, minute);
    const timeObj = Astronomy.MakeTime(dateObj);

    // 3. Расчет Солнца
    const sunVector = Astronomy.GeoVector(Astronomy.Body.Sun, timeObj, true);
    const sunEquator = Astronomy.Equator(Astronomy.Body.Sun, timeObj, observer, true, true);
    
    // Получаем знак Солнца (эклиптическая долгота)
    const sunEcliptic = Astronomy.Ecliptic(sunVector);
    const sunSign = getZodiacSign(sunEcliptic.elon);

    // 4. Расчет Асцендента
    // Асцендент = точка восхождения эклиптики на горизонте
    const ascVector = Astronomy.Horizon(timeObj, observer, sunVector, 'normal'); // Используем вектор для примера, но нужен расчет LST
    
    // Более точный расчет Асцендента через LST (Местное Звездное Время)
    const gmst = Astronomy.SiderealTime(timeObj); // Гринвичское звездное время
    const lst = (gmst + lon / 15.0) % 24; // Местное звездное время (в часах)
    const lstDegrees = lst * 15; // В градусы
    
    // Формула Асцендента: arctan(cos(RAMC) / -(sin(RAMC)*cos(eps) + tan(lat)*sin(eps)))
    // RAMC (Right Ascension of Midheaven) = LST * 15
    const ramc = lstDegrees;
    const eps = 23.4397; // Наклон эклиптики
    const latRad = lat * Math.PI / 180;
    const ramcRad = ramc * Math.PI / 180;
    const epsRad = eps * Math.PI / 180;

    const numerator = Math.cos(ramcRad);
    const denominator = -(Math.sin(ramcRad) * Math.cos(epsRad) + Math.tan(latRad) * Math.sin(epsRad));
    
    let ascDeg = Math.atan2(numerator, denominator) * 180 / Math.PI;
    if (ascDeg < 0) ascDeg += 360;
    
    const ascSign = getZodiacSign(ascDeg);

    return res.status(200).json({
      sun: sunSign,
      asc: ascSign
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
}

function getZodiacSign(degrees) {
  const signs = [
    'Овен', 'Телец', 'Близнецы', 'Рак', 'Лев', 'Дева', 
    'Весы', 'Скорпион', 'Стрелец', 'Козерог', 'Водолей', 'Рыбы'
  ];
  const index = Math.floor(degrees / 30) % 12;
  return signs[index];
}
