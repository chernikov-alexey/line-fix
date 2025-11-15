import { InjectionToken } from '@angular/core';

export interface StorageProvider {
  get<T = unknown>(key: string): T | null;
  set<T = unknown>(key: string, value: T): void;
  remove(key: string): void;
}

export const STORAGE_PROVIDER = new InjectionToken<StorageProvider>('STORAGE_PROVIDER');

export class LocalStorageProvider implements StorageProvider {
  get<T = unknown>(key: string): T | null {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  }
  set<T = unknown>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore
    }
  }
  remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
  }
}
