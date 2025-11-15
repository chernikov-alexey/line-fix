import { Component, HostListener, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SettingsService } from '../../core/settings.service';
import { ResultsService } from '../../core/results.service';
import { Mode3Result } from '../../core/models';
import { randomWord } from '../../shared/letters';

@Component({
  selector: 'app-moving',
  standalone: true,
  imports: [CommonModule, RouterLink],
  styles: [`
    .stage { position: relative; width: 100%; height: calc(100vh - 160px); overflow: hidden; background: #fff; }
    .row-wrap { position:absolute; left:50%; transform: translateX(-50%); display:flex; align-items: flex-start; }
    .letter-box { position: relative; min-width: 72px; min-height: 96px; display:flex; flex-direction: column; align-items: center; justify-content: flex-start; }
    .letter { font-weight: 700; }
    .moving-dot { position:absolute; width:12px; height:12px; background:#212529; border-radius:50%; transition: left var(--dur) linear; }
    .overlay { position:absolute; inset:0; background: rgba(0,0,0,.4); display:flex; align-items:center; justify-content:center; }
  `],
  template: `
  <div class="container py-3 d-print-none">
    <div class="d-flex gap-2 align-items-center">
      <button class="btn btn-primary" (click)="start()" [disabled]="running()">Старт</button>
      <button class="btn btn-outline-secondary" (click)="stop()" [disabled]="!running()">Стоп</button>
      <div class="ms-auto">
        <span class="me-3">Слово: <strong>{{ word() }}</strong></span>
        <span class="text-success">Верных: <strong>{{ lettersCorrect() }}</strong>/<strong>{{ lettersTotal() }}</strong></span>
      </div>
    </div>
  </div>

  <div class="stage">
    <div class="row-wrap" [style.top]="lettersTop()" [style.width.px]="rowWidth()" [style.gap.px]="letterGapPx()" style="position: relative;">
      <div class="letter-box" *ngFor="let ch of letters(); let i = index" [style.lineHeight.px]="fontSizePx()">
        <div class="letter" [style.fontSize.px]="fontSizePx()" [style.color]="colorFor(i)">{{ ch }}</div>
      </div>
      <div class="moving-dot" [style.left.px]="dotLeft()" [style.top.px]="dotTopPx()" [style.marginTop.px]="letterOffsetPx()" [style.--dur]="dur()"></div>
    </div>
    <div class="overlay" *ngIf="finished()">
      <div class="card shadow" style="min-width:320px;">
        <div class="card-body">
          <h5 class="card-title mb-3">Режим 3 завершен</h5>
          <p class="mb-1">Верных букв: <strong>{{ lettersCorrect() }}</strong> из <strong>{{ lettersTotal() }}</strong></p>
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
export class MovingComponent {
  private settings = inject(SettingsService);
  private results = inject(ResultsService);

  running = signal(false);
  word = signal('');
  letters = signal<string[]>([]);
  index = signal(-1);
  answered = new Set<number>();
  perLetter: { index: number; char: string; correct: boolean }[] = [];
  finished = signal(false);
  durationMs = signal(0);
  private startedAt = 0;

  fontSizePx = computed(() => this.settings.settings().fontSizePx);
  private focusOffset = computed(() => this.settings.settings().focusDotOffsetY + (this.settings.settings().focusDotPosition === 'lower' ? 80 : 0));
  lettersTop = computed(() => `calc(50% + ${this.focusOffset()}px - ${this.settings.settings().letterOffsetPx}px)`);
  boxWidth = computed(() => Math.max(72, Math.round(this.fontSizePx() * 1.4)));
  letterGapPx = computed(() => this.settings.settings().letterGapPx);
  rowWidth = computed(() => {
    const n = this.letters().length;
    if (n <= 0) return 0;
    return this.boxWidth() * n + this.letterGapPx() * Math.max(0, n - 1);
  });
  letterOffsetPx = computed(() => this.settings.settings().letterOffsetPx);
  dotTopPx = computed(() => this.fontSizePx());
  lettersTotal = computed(() => this.letters().length);
  lettersCorrect = signal(0);
  dur = computed(() => this.settings.settings().timePerLetterMs + 'ms');

  private timer: any = null;

  private genWord() {
    const s = this.settings.settings();
    const w = randomWord(s.wordLength, s.alphabet);
    this.word.set(w);
    this.letters.set(w.split(''));
    this.index.set(-1);
    this.answered.clear();
    this.perLetter = [];
    this.lettersCorrect.set(0);
  }

  dotLeft = computed(() => {
    const idx = this.index();
    if (idx < 0) return 0;
    const bw = this.boxWidth();
    const gap = this.letterGapPx();
    return Math.round(idx * (bw + gap) + bw / 2 - 6); // center of box minus half dot width
  });

  colorFor(i: number) {
    return this.answered.has(i) ? '#16a34a' : '#212529';
  }

  start() {
    if (this.running()) return;
    this.running.set(true);
    this.finished.set(false);
    this.durationMs.set(0);
    this.startedAt = Date.now();
    this.genWord();
    this.advance();
    this.timer = setInterval(() => this.advance(), this.settings.settings().timePerLetterMs);
  }

  stop() {
    if (!this.running()) return;
    this.finishWord();
    this.running.set(false);
    if (this.timer) { clearInterval(this.timer); this.timer = null; }
  }

  private advance() {
    const prev = this.index();
    if (prev >= 0 && !this.answered.has(prev)) {
      this.perLetter.push({ index: prev, char: this.letters()[prev], correct: false });
    }
    const next = prev + 1;
    if (next >= this.letters().length) { this.finishWord(); return; }
    this.index.set(next);
  }

  private finishWord() {
    if (this.timer) { clearInterval(this.timer); this.timer = null; }
    const s = this.settings.settings();
    const payload: Mode3Result = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      timestamp: Date.now(),
      mode: 'moving',
      settings: s,
      wordLength: this.letters().length,
      lettersCorrect: this.answered.size,
      lettersTotal: this.letters().length,
      perLetter: this.perLetter.slice(),
      durationMs: Date.now() - this.startedAt,
    } as Mode3Result; // duration on SessionBase
    this.results.add(payload);
    this.durationMs.set(payload.durationMs!);
    this.running.set(false);
    this.finished.set(true);
  }

  @HostListener('window:keydown', ['$event'])
  onKey(ev: KeyboardEvent) {
    if (!this.running()) return;
    const idx = this.index();
    if (idx < 0 || idx >= this.letters().length) return;
    if (this.answered.has(idx)) return;
    const got = (ev.key || '').toUpperCase();
    if (got.length !== 1) return;
    const expected = this.letters()[idx].toUpperCase();
    const ok = got === expected;
    if (ok) {
      this.answered.add(idx);
      this.perLetter.push({ index: idx, char: this.letters()[idx], correct: true });
      this.lettersCorrect.update(v => v + 1);
    }
  }

  reset() {
    this.finished.set(false);
    this.word.set('');
    this.letters.set([]);
    this.index.set(-1);
    this.answered.clear();
    this.perLetter = [];
  }

  fmtDuration(ms: number) {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const ss = s % 60;
    return `${m}:${ss.toString().padStart(2,'0')}`;
  }
}
