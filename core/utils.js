// core/utils.js

export function reduceNumber(num) {
  while (num > 9 && num !== 11 && num !== 22) {
    num = String(num).split('').reduce((a, b) => a + Number(b), 0);
  }
  return num;
}

export function cyrillicToNumber(str) {
  const map = {
    'а':1,'и':1,'с':1,'ъ':1, 'б':2,'й':2,'т':2,'ы':2, 'в':3,'к':3,'у':3,'ь':3,
    'г':4,'л':4,'ф':4,'э':4, 'д':5,'м':5,'х':5,'ю':5, 'е':6,'н':6,'ц':6,'я':6,
    'ё':7,'о':7,'ч':7, 'ж':8,'п':8,'ш':8, 'з':9,'р':9,'щ':9
  };
  let sum = 0;
  for (let char of str.toLowerCase()) {
    if (map[char]) sum += map[char];
  }
  return sum || 1;
}

export function parseDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  return { year: y, month: m, day: d };
}
