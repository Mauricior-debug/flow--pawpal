export type DistanceUnit = 'km' | 'mi';
export type WeightUnit = 'lbs' | 'kg';

export function clock(totalSeconds: number) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(h)}:${pad(m)}:${pad(sec)}`;
}

export function convertDistance(km: number, unit: DistanceUnit) {
  return unit === 'mi' ? km * 0.621371 : km;
}

export function formatDistance(km: number, unit: DistanceUnit) {
  const value = convertDistance(km, unit);
  const text = trimNumber(value, 1);
  return { text, unit: unit === 'mi' ? 'mi' : 'km' };
}

export function formatWeight(lbs: number, unit: WeightUnit) {
  const value = unit === 'kg' ? lbs * 0.453592 : lbs;
  return { text: trimNumber(value, 1), unit };
}

export function trimNumber(value: number, digits: number) {
  const fixed = value.toFixed(digits);
  return fixed.endsWith('.0') ? fixed.slice(0, -2) : fixed;
}

export function remainLabel(target: number | null, now: number) {
  if (target == null) return null;
  const ms = target - now;
  if (ms <= 0) return 'Ready now';
  const minutes = Math.floor(ms / 60000);
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}

export function ageLabel(years: number) {
  if (years <= 0) return 'Age not set';
  return years === 1 ? '1 year old' : `${years} years old`;
}

export function monthGrid(date = new Date()) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const first = new Date(year, month, 1).getDay();
  const count = new Date(year, month + 1, 0).getDate();
  const cells: Array<number | null> = Array.from({ length: first }, () => null);
  for (let day = 1; day <= count; day += 1) cells.push(day);
  while (cells.length % 7 !== 0) cells.push(null);
  const label = date.toLocaleString('en-US', { month: 'long' });
  return { year, month, cells, label };
}
