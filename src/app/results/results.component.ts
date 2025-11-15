import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResultsService } from '../core/results.service';
import { AnyResult, Mode1Result, Mode2Result, Mode3Result } from '../core/models';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div class="container py-4">
    <div class="d-flex align-items-center justify-content-between mb-3">
      <h2 class="h4 m-0">Результаты</h2>
      <div class="d-flex gap-2">
        <button class="btn btn-outline-secondary btn-sm" (click)="refresh()">Обновить</button>
        <button class="btn btn-outline-danger btn-sm" (click)="clearAll()">Очистить</button>
        <button class="btn btn-outline-primary btn-sm" (click)="exportJSON()">Экспорт JSON</button>
      </div>
    </div>

    <div class="table-responsive">
      <table class="table table-sm align-middle">
        <thead>
          <tr>
            <th>Дата</th>
            <th>Режим</th>
            <th>Итоги</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let r of results()">
            <td>{{ fmtDate(r.timestamp) }}</td>
            <td>{{ r.mode }}</td>
            <td>{{ summary(r) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div *ngIf="exported()" class="mt-3">
      <textarea class="form-control" rows="8" readonly>{{ exported() }}</textarea>
    </div>
  </div>
  `,
})
export class ResultsComponent {
  private resultsService = inject(ResultsService);
  results = signal<AnyResult[]>(this.resultsService.list());
  exported = signal<string>('');

  refresh() { this.results.set(this.resultsService.list()); }
  clearAll() { this.resultsService.clear(); this.refresh(); this.exported.set(''); }
  exportJSON() { this.exported.set(JSON.stringify(this.results(), null, 2)); }

  fmtDate(ts: number) { return new Date(ts).toLocaleString(); }

  summary(r: AnyResult): string {
    switch (r.mode) {
      case 'single': {
        const a = r as Mode1Result;
        return `Правильных ${a.correct}/${a.total}, ошибок ${a.wrong}`;
      }
      case 'multi': {
        const b = r as Mode2Result;
        return `Безошибочных слов ${b.wordsCorrect}/${b.wordsTotal}`;
      }
      case 'moving': {
        const c = r as Mode3Result;
        return `Верных букв ${c.lettersCorrect}/${c.lettersTotal}`;
      }
    }
  }
}
