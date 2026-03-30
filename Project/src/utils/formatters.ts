// src/utils/formatters.ts
export const formatDuration = (minutes: number | undefined): string => {
  if (!minutes) return '—';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}ч ${mins}мин`;
};

export const formatDate = (dateString?: string): string => {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  } catch {
    return '—';
  }
};

export const formatMoney = (value?: string | number): string => {
  if (!value) return '—';
  return String(value);
};

export const joinList = (list?: string[]): string => {
  if (!list || list.length === 0) return '—';
  return list.join(', ');
};