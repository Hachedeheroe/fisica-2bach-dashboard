import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

export function formatPercentage(value: number): string {
  return `${Math.round(value * 100)}%`;
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function formatDateTime(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function calculateGrade(score: number, maxScore: number): number {
  return Math.round((score / maxScore) * 10 * 100) / 100;
}

export function getColorByScore(score: number): string {
  if (score >= 9) return 'text-green-600';
  if (score >= 7) return 'text-emerald-500';
  if (score >= 5) return 'text-amber-500';
  return 'text-red-500';
}

export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}