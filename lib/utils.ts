export const numberFormat = new Intl.NumberFormat("en-US");

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function average(values: number[]) {
  if (!values.length) return 0;
  return values.reduce((sum, item) => sum + item, 0) / values.length;
}

export function formatSeconds(sec: number) {
  if (sec < 60) return `${Math.round(sec)}s`;
  const min = Math.floor(sec / 60);
  const rem = Math.round(sec % 60);
  return `${min}m ${rem}s`;
}

export function hourLabel(hour: number) {
  return `${hour.toString().padStart(2, "0")}:00`;
}

export function toIsoDay(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function topEntries<T extends [string, number]>(entries: T[], limit = 10) {
  return [...entries].sort((a, b) => b[1] - a[1]).slice(0, limit);
}
