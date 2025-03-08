export function sumArray(arr) {
  return arr.reduce((acc, curr) => acc + curr, 0);
}

export function isPalindrome(str) {
  const cleanedStr = str.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  return cleanedStr === cleanedStr.split('').reverse().join('');
}

export function getDeepValue(obj, path) {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}

export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function uniqueArray(arr) {
  return [...new Set(arr)];
}

export function formatDate(date, format = 'YYYY-MM-DD') {
  const pad = num => num.toString().padStart(2, '0');
  return format
      .replace('YYYY', date.getFullYear())
      .replace('MM', pad(date.getMonth() + 1))
      .replace('DD', pad(date.getDate()))
      .replace('HH', pad(date.getHours()))
      .replace('mm', pad(date.getMinutes()))
      .replace('ss', pad(date.getSeconds()));
}

export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export function isEmptyObject(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}

export function toCamelCase(str) {
  return str.replace(/[-_](.)/g, (_, char) => char.toUpperCase());
}