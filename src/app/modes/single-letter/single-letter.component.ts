import { Component, HostListener, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SettingsService } from '../../core/settings.service';
import { ResultsService } from '../../core/results.service';
import { Mode1Result } from '../../core/models';
import { randomLetter } from '../../shared/letters';

@Component({
  selector: 'app-single-letter',
  standalone: true,
  imports: [CommonModule, RouterLink],
  styles: [`
    .stage { position: relative; width: 100%; height: calc(100vh - 160px); overflow: hidden; background: #fff; }
    .row-wrap { position:absolute; left:50%; transform: translateX(-50%); display:flex; align-items: flex-start; }
    .letter-box { position: relative; min-width: 72px; min-height: 96px; display:flex; flex-direction: column; align-items: center; justify-content: flex-start; }
    .letter { font-weight: 600; transition: opacity .25s ease, transform .25s ease; opacity: 0; }
    .letter.show { opacity: 1; transform: translateY(0); }
    .letter.hide { opacity: 0; transform: translateY(-8px); }
    .letter.correct { color: #16a34a; }
    .dot { width: 8px; height: 8px; background:#212529; border-radius:50%; opacity: .8; }
    .overlay { position:absolute; inset:0; background: rgba(0,0,0,.4); display:flex; align-items:center; justify-content:center; }
  `],
  template: `
  <div class="container py-3 d-print-none">
    <div class="d-flex gap-2 align-items-center">
      <button class="btn btn-primary" (click)="start()" [disabled]="running()">Старт</button>
      <button class="btn btn-outline-secondary" (click)="stop()" [disabled]="!running()">Стоп</button>
      <div class="btn-group ms-3" role="group" aria-label="Количество букв">
        <button type="button" class="btn" [class.btn-primary]="planned()===20" [class.btn-outline-primary]="planned()!==20" (click)="setPlanned(20)" [disabled]="running()">20</button>
        <button type="button" class="btn" [class.btn-primary]="planned()===50" [class.btn-outline-primary]="planned()!==50" (click)="setPlanned(50)" [disabled]="running()">50</button>
        <button type="button" class="btn" [class.btn-primary]="planned()===100" [class.btn-outline-primary]="planned()!==100" (click)="setPlanned(100)" [disabled]="running()">100</button>
      </div>
      <div class="ms-auto">
        <span class="me-3">Всего: <strong>{{ total() }}</strong></span>
        <span class="me-3 text-success">Верно: <strong>{{ correct() }}</strong></span>
        <span class="text-danger">Ошибок: <strong>{{ wrong() }}</strong></span>
      </div>
    </div>
  </div>

  <div class="stage">
    <div class="row-wrap" [style.top]="lettersTop()">
      <div class="letter-box" [style.lineHeight.px]="fontSizePx()">
        <div class="letter" [class.show]="letterState()==='show'" [class.hide]="letterState()==='hide'" [class.correct]="letterCorrect()" [style.fontSize.px]="fontSizePx()">
          {{ currentLetter() }}
        </div>
        <div class="dot" [style.marginTop.px]="letterOffsetPx()"></div>
      </div>
    </div>
    <div class="overlay" *ngIf="finished()">
      <div class="card shadow" style="min-width:320px;">
        <div class="card-body">
          <h5 class="card-title mb-3">Режим 1 завершен</h5>
          <p class="mb-1">Правильных: <strong>{{ correct() }}</strong> из <strong>{{ total() }}</strong></p>
          <p class="mb-1">Ошибок: <strong class="text-danger">{{ wrong() }}</strong></p>
          <p class="mb-1">Среднее время реакции: <strong>{{ avgReactionMs() }} мс</strong></p>
          <p class="mb-3">Время сессии: <strong>{{ fmtDuration(durationMs()) }}</strong></p>
          <div class="d-flex gap-2">
            <a routerLink="/" class="btn btn-primary">На главный экран</a>
            <button class="btn btn-outline-secondary" (click)="reset()">Ещё раз</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  `,
})
export class SingleLetterComponent {
  private settings = inject(SettingsService);
  private results = inject(ResultsService);

  running = signal(false);
  currentLetter = signal<string>('');
  letterState = signal<'show' | 'hide'>('hide');
  letterCorrect = signal(false);
  correct = signal(0);
  wrong = signal(0);
  total = signal(0);
  planned = signal<20 | 50 | 100>(20);
  finished = signal(false);
  avgReactionMs = signal(0);
  durationMs = signal(0);
  private startedAt = 0;
  private letterShownAt = 0;
  private reactionSum = 0;

  fontSizePx = computed(() => this.settings.settings().fontSizePx);
  private focusOffset = computed(() => this.settings.settings().focusDotOffsetY + (this.settings.settings().focusDotPosition === 'lower' ? 80 : 0));
  focusTop = computed(() => `calc(50% + ${this.focusOffset()}px)`);
  lettersTop = computed(() => `calc(50% + ${this.focusOffset()}px - ${this.settings.settings().letterOffsetPx}px)`);
  letterOffsetPx = computed(() => this.settings.settings().letterOffsetPx);

  private nextLetter() {
    const s = this.settings.settings();
    this.currentLetter.set(randomLetter(s.alphabet));
    this.letterCorrect.set(false);
    this.letterShownAt = Date.now();
    this.letterState.set('show');
  }

  start() {
    this.correct.set(0); this.wrong.set(0); this.total.set(0);
    this.avgReactionMs.set(0); this.durationMs.set(0);
    this.reactionSum = 0; this.startedAt = Date.now(); this.finished.set(false);
    this.running.set(true);
    this.nextLetter();
  }

  stop() {
    if (!this.running()) return;
    this.finishSession();
  }

  private handleGuess(ch: string) {
    if (!this.running()) return;
    const expected = (this.currentLetter() || '').toUpperCase();
    const got = (ch || '').toUpperCase();
    if (!expected || got.length !== 1) return;

    const ok = got === expected;
    this.total.update((v) => v + 1);
    if (ok) this.correct.update((v) => v + 1); else this.wrong.update((v) => v + 1);

    const rt = Date.now() - this.letterShownAt;
    this.reactionSum += rt;
    this.letterCorrect.set(ok);
    this.letterState.set('hide');
    setTimeout(() => {
      if (!this.running()) return;
      if (this.total() >= this.planned()) { this.finishSession(); return; }
      this.nextLetter();
    }, 250);
  }

  @HostListener('window:keydown', ['$event'])
  onKey(ev: KeyboardEvent) {
    const key = ev.key;
    if (key.length === 1) {
      this.handleGuess(key);
    }
  }

  setPlanned(n: 20 | 50 | 100) { if (!this.running()) this.planned.set(n); }

  private finishSession() {
    this.running.set(false);
    const dur = Date.now() - this.startedAt;
    this.durationMs.set(dur);
    const avg = this.total() > 0 ? Math.round(this.reactionSum / this.total()) : 0;
    this.avgReactionMs.set(avg);
    const s = this.settings.settings();
    const payload: Mode1Result = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      timestamp: Date.now(),
      mode: 'single',
      settings: s,
      total: this.total(),
      correct: this.correct(),
      wrong: this.wrong(),
      durationMs: dur,
      avgReactionMs: avg,
    };
    this.results.add(payload);
    this.finished.set(true);
  }

  reset() {
    this.finished.set(false);
    this.currentLetter.set('');
    this.letterState.set('hide');
  }

  fmtDuration(ms: number) {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const ss = s % 60;
    return `${m}:${ss.toString().padStart(2,'0')}`;
  }
}
