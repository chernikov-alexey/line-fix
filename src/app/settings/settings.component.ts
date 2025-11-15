import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingsService } from '../core/settings.service';
import { Settings } from '../core/models';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
  <div class="container py-4">
    <h2 class="h4 mb-3">Настройки</h2>
    <form class="row g-3" (ngSubmit)="save()">
      <div class="col-md-4">
        <label class="form-label">Размер шрифта (px)</label>
        <input type="number" class="form-control" [(ngModel)]="model.fontSizePx" name="fontSizePx" min="12" max="200">
        <div class="form-text">≈ {{ toDeg(model.fontSizePx) }}°</div>
      </div>
      <div class="col-md-4">
        <label class="form-label">Расстояние буквы от точки (px)</label>
        <input type="number" class="form-control" [(ngModel)]="model.letterOffsetPx" name="letterOffsetPx" min="0" max="600">
        <div class="form-text">≈ {{ toDeg(model.letterOffsetPx) }}°</div>
      </div>
      <div class="col-md-4">
        <label class="form-label">Межбуквенный интервал (px)</label>
        <input type="number" class="form-control" [(ngModel)]="model.letterGapPx" name="letterGapPx" min="0" max="120">
      </div>
      <div class="col-md-4">
        <label class="form-label">Смещение точки по вертикали (px)</label>
        <input type="number" class="form-control" [(ngModel)]="model.focusDotOffsetY" name="focusDotOffsetY" min="-400" max="400">
      </div>
      <div class="col-md-4">
        <label class="form-label">Положение точки фиксации</label>
        <select class="form-select" [(ngModel)]="model.focusDotPosition" name="focusDotPosition">
          <option value="center">По центру</option>
          <option value="lower">Ниже центра</option>
        </select>
      </div>
      <div class="col-md-4">
        <label class="form-label">Алфавит</label>
        <select class="form-select" [(ngModel)]="model.alphabet" name="alphabet">
          <option value="RU">Русский</option>
          <option value="EN">Английский</option>
        </select>
      </div>
      <div class="col-md-4">
        <label class="form-label">Фланкеры</label>
        <select class="form-select" [(ngModel)]="model.flankers" name="flankers">
          <option value="none">Нет</option>
          <option value="left">Слева</option>
          <option value="right">Справа</option>
          <option value="both">Слева и справа</option>
        </select>
      </div>
      <div class="col-md-4">
        <label class="form-label">Слов на сессию (режим 2)</label>
        <input type="number" class="form-control" [(ngModel)]="model.wordsPerSession" name="wordsPerSession" min="5" max="100">
      </div>
      <div class="col-md-4">
        <label class="form-label">Мин. букв в наборе (режим 2)</label>
        <input type="number" class="form-control" [(ngModel)]="model.multiLettersMin" name="multiLettersMin" min="2" max="10">
      </div>
      <div class="col-md-4">
        <label class="form-label">Макс. букв в наборе (режим 2)</label>
        <input type="number" class="form-control" [(ngModel)]="model.multiLettersMax" name="multiLettersMax" min="2" max="10">
      </div>
      <div class="col-md-4">
        <label class="form-label">Длина слова (режим 3)</label>
        <input type="number" class="form-control" [(ngModel)]="model.wordLength" name="wordLength" min="3" max="12">
      </div>
      <div class="col-md-4">
        <label class="form-label">Время на букву (мс, режим 3)</label>
        <input type="number" class="form-control" [(ngModel)]="model.timePerLetterMs" name="timePerLetterMs" min="300" max="5000" step="100">
      </div>
      <div class="col-md-4">
        <label class="form-label">Плотность пикселей (px/см)</label>
        <input type="number" class="form-control" [(ngModel)]="model.pixelsPerCm" name="pixelsPerCm" min="10" max="200">
      </div>
      <div class="col-md-4">
        <label class="form-label">Дистанция до монитора (см)</label>
        <input type="number" class="form-control" [(ngModel)]="model.viewingDistanceCm" name="viewingDistanceCm" min="20" max="200">
      </div>
      <div class="col-12">
        <button class="btn btn-primary" type="submit">Сохранить</button>
      </div>
    </form>
  </div>
  `,
})
export class SettingsComponent {
  private readonly settings = inject(SettingsService);
  model: Settings = this.settings.settings();

  constructor() {
    effect(() => {
      this.model = { ...this.settings.settings() };
    });
  }

  save() {
    this.settings.update(this.model);
  }

  toDeg(px: number): string {
    const cm = px / Math.max(1, this.model.pixelsPerCm || 1);
    const dist = Math.max(1, this.model.viewingDistanceCm || 1);
    const deg = 2 * Math.atan(cm / (2 * dist)) * 180 / Math.PI;
    return deg.toFixed(2);
  }
}
