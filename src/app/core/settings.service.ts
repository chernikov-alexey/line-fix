import { Injectable, computed, inject, signal } from '@angular/core';
import { Settings } from './models';
import { STORAGE_PROVIDER, StorageProvider } from './storage/storage.token';

const SETTINGS_KEY = 'linefix.settings.v1';

const DEFAULTS: Settings = {
  fontSizePx: 64,
  letterOffsetPx: 20,
  focusDotOffsetY: 0,
  focusDotPosition: 'center',
  alphabet: 'RU',
  multiLettersMin: 2,
  multiLettersMax: 6,
  wordsPerSession: 20,
  timePerLetterMs: 1200,
  wordLength: 6,
};

@Injectable({ providedIn: 'root' })
export class SettingsService {
  private storage = inject<StorageProvider>(STORAGE_PROVIDER);
  private _settings = signal<Settings>(DEFAULTS);

  readonly settings = computed(() => this._settings());

  constructor() {
    const saved = this.storage.get<Settings>(SETTINGS_KEY);
    if (saved) {
      this._settings.set({ ...DEFAULTS, ...saved });
    }
  }

  update(partial: Partial<Settings>) {
    this._settings.update((s) => ({ ...s, ...partial }));
    this.save();
  }

  save() {
    this.storage.set(SETTINGS_KEY, this._settings());
  }
}
