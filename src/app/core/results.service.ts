import { Injectable, inject } from '@angular/core';
import { AnyResult } from './models';
import { STORAGE_PROVIDER, StorageProvider } from './storage/storage.token';

const RESULTS_KEY = 'linefix.results.v1';

@Injectable({ providedIn: 'root' })
export class ResultsService {
  private storage = inject<StorageProvider>(STORAGE_PROVIDER);

  list(): AnyResult[] {
    return this.storage.get<AnyResult[]>(RESULTS_KEY) ?? [];
  }

  add(result: AnyResult) {
    const all = this.list();
    all.push(result);
    this.storage.set(RESULTS_KEY, all);
  }

  clear() {
    this.storage.remove(RESULTS_KEY);
  }
}
