import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingsService } from '../core/settings.service';

@Component({
  selector: 'app-calibration',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styles: [`
    .calibration-area { position: relative; width: 100%; height: calc(100vh - 140px); background: #f8f9fa; border: 1px dashed #ced4da; border-radius: .5rem; }
    .ring { position:absolute; border: 2px dashed #0d6efd; border-radius: 50%; left:50%; top:50%; transform: translate(-50%,-50%); background: rgba(13,110,253,0.05); }
    .focus-dot { position:absolute; width:12px; height:12px; background:#212529; border-radius:50%; left:50%; top:50%; transform: translate(-50%,-50%); }
  `],
  template: `
  <div class="container py-4">
    <h2 class="h4 mb-3">Калибровка</h2>
    <div class="row g-3">
      <div class="col-md-4">
        <label class="form-label">Радиус невидимой области (px)</label>
        <input type="range" min="0" max="400" [(ngModel)]="radiusValue" class="form-range">
        <div class="form-text">Подберите размер так, чтобы кольцо соответствовало области, где вы не видите объекты.</div>
      </div>
      <div class="col-md-8">
        <div class="calibration-area">
          <div class="ring" [style.width.px]="radiusValue*2" [style.height.px]="radiusValue*2"></div>
          <div class="focus-dot"></div>
        </div>
      </div>
    </div>
  </div>
  `,
})
export class CalibrationComponent {
  private settings = inject(SettingsService);
  radius = signal(120);
  radiusValue = 120;
}
