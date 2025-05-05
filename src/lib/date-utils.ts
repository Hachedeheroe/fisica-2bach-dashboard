import { format, parseISO, isValid, isBefore, isAfter, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';

export function formatDateToLocale(date: string | Date, formatStr = 'dd/MM/yyyy'): string {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(dateObj)) return '';
  
  return format(dateObj, formatStr, { locale: es });
}

export function formatDateTimeToLocale(date: string | Date): string {
  return formatDateToLocale(date, 'dd/MM/yyyy HH:mm');
}

export function formatDateRelative(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(dateObj)) return '';
  
  const now = new Date();
  const diffDays = differenceInDays(now, dateObj);
  
  if (diffDays === 0) return 'Hoy';
  if (diffDays === 1) return 'Ayer';
  if (diffDays < 7) return `Hace ${diffDays} días`;
  
  return formatDateToLocale(date);
}

export function isDateBeforeToday(date: string | Date): boolean {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(dateObj)) return false;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return isBefore(dateObj, today);
}

export function isDateAfterToday(date: string | Date): boolean {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  if (!isValid(dateObj)) return false;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return isAfter(dateObj, today);
}

export function getWeekRange(date: Date): { start: Date; end: Date } {
  const start = new Date(date);
  start.setDate(date.getDate() - date.getDay() + 1); // Lunes
  start.setHours(0, 0, 0, 0);
  
  const end = new Date(start);
  end.setDate(start.getDate() + 6); // Domingo
  end.setHours(23, 59, 59, 999);
  
  return { start, end };
}

export function getMonthRange(date: Date): { start: Date; end: Date } {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  start.setHours(0, 0, 0, 0);
  
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  end.setHours(23, 59, 59, 999);
  
  return { start, end };
}