import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}


export const dataFetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const error = new Error(
      'An occured while fetching the data',
    ) as ApplicationError;
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }
  return res.json();
};