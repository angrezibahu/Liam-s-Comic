import type { Comic } from '../types/comic';

const COMICS_KEY = 'story-machine-comics';

export function loadComics(): Comic[] {
  try {
    const raw = localStorage.getItem(COMICS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveComic(comic: Comic): void {
  const comics = loadComics();
  const idx = comics.findIndex((c) => c.id === comic.id);
  if (idx >= 0) {
    comics[idx] = comic;
  } else {
    comics.push(comic);
  }
  localStorage.setItem(COMICS_KEY, JSON.stringify(comics));
}

export function deleteComic(id: string): void {
  const comics = loadComics().filter((c) => c.id !== id);
  localStorage.setItem(COMICS_KEY, JSON.stringify(comics));
}

export function getComic(id: string): Comic | undefined {
  return loadComics().find((c) => c.id === id);
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

export function getStorageSize(): string {
  let total = 0;
  for (const key of Object.keys(localStorage)) {
    total += (localStorage.getItem(key) || '').length * 2; // UTF-16
  }
  const mb = total / (1024 * 1024);
  return mb.toFixed(1);
}
