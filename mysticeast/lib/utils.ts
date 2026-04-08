import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

export function getElementColor(element: string): string {
  const colors: Record<string, string> = {
    wood: '#228B22',
    fire: '#DC143C',
    earth: '#D2691E',
    metal: '#71717a',
    water: '#1E3A5F',
  };
  return colors[element.toLowerCase()] || '#2C2C2C';
}

export function getElementName(element: string): string {
  const names: Record<string, string> = {
    wood: 'Wood',
    fire: 'Fire',
    earth: 'Earth',
    metal: 'Metal',
    water: 'Water',
  };
  return names[element.toLowerCase()] || element;
}
