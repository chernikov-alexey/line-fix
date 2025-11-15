import { Component, HostListener, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SettingsService } from '../../core/settings.service';
import { ResultsService } from '../../core/results.service';
import { Mode2Result } from '../../core/models';
import { randomLetter } from '../../shared/letters';

interface LetterItem { char: string; state: 'show' | 'hide' | 'correct' | 'wrong'; }

@Component({
  selector: 'app-multi-letter',
  standalone: true,
  imports: [CommonModule, RouterLink],
  styles: [`
    .stage { position: relative; width: 100%; height: calc(100vh - 160px); overflow: hidden; background:#fff; }
    .center-dot { position:absolute; width:12px; height:12px; background:#212529; border-radius:50%; left:50%; transform: translateX(-50%); }
    .row-wrap { position:absolute; left:50%; transform: translateX(-50%); display:flex; gap: 24px; align-items: flex-start; }
    .letter-box { position: relative; min-width: 72px; min-height: 96px; display:flex; flex-direction: column; align-items: center; justify-content: flex-start; }
    .letter { font-weight: 700; transition: opacity .35s ease, transform .35s ease; opacity: 1; }
    .letter.hide { opacity: 0; transform: translateY(-8px); }
    .letter.correct { color: #16a34a; }
    .letter.wrong { color: #dc3545; }
    .dot { width: 8px; height: 8px; background:#212529; border-radius:50%; opacity: .8; }
    .overlay { position:absolute; inset:0; background: rgba(0,0,0,.4); display:flex; align-items:center; justify-content:center; }
  `],
  template: `
  <div class="container py-3 d-print-none">
    <div class="d-flex gap-2 align-items-center">
      <button class="btn btn-primary" (click)="start()" [disabled]="running()">Старт</button>
      <button class="btn btn-outline-secondary" (click)="stop()" [disabled]="!running()">Стоп</button>
      <div class="ms-auto">
        <span class="me-3">Слово: <strong>{{ index()+1 }}</strong>/{{ totalWords() }}</span>
        <span class="text-success">Безошибочно: <strong>{{ wordsCorrect() }}</strong></span>
      </div>
    </div>
  </div>

  <div class="stage">
    <div class="row-wrap" [style.top]="lettersTop()">
      <div class="letter-box" *ngFor="let it of currentSet(); let i = index" [style.lineHeight.px]="fontSizePx()">
        <div class="letter" [class.hide]="it.state==='hide'" [class.correct]="it.state==='correct'" [class.wrong]="it.state==='wrong'" [style.fontSize.px]="fontSizePx()">{{ it.char }}</div>
        <div class="dot" *ngIf="i===activeIndex()" [style.marginTop.px]="letterOffsetPx()"></div>
      </div>
    </div>
    <div class="overlay" *ngIf="finished()">
      <div class="card shadow" style="min-width:320px;">
        <div class="card-body">
          <h5 class="card-title mb-3">Режим 2 завершен</h5>
          <p class="mb-1">Безошибочных слов: <strong>{{ wordsCorrect() }}</strong> из <strong>{{ totalWords() }}</strong></p>
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
export class MultiLetterComponent {
  private settings = inject(SettingsService);
  private results = inject(ResultsService);

  running = signal(false);
  index = signal(0);
  totalWords = computed(() => this.settings.settings().wordsPerSession);
  wordsCorrect = signal(0);
  setSizes: number[] = [];

  currentSet = signal<LetterItem[]>([]);
  activeIndex = signal(0);
  private wordHasError = false;
  finished = signal(false);
  durationMs = signal(0);
  private startedAt = 0;

  fontSizePx = computed(() => this.settings.settings().fontSizePx);
  private focusOffset = computed(() => this.settings.settings().focusDotOffsetY + (this.settings.settings().focusDotPosition === 'lower' ? 80 : 0));
  focusTop = computed(() => `calc(50% + ${this.focusOffset()}px)`);
  lettersTop = computed(() => `calc(50% + ${this.focusOffset()}px - ${this.settings.settings().letterOffsetPx}px)`);
  letterOffsetPx = computed(() => this.settings.settings().letterOffsetPx);

  private genSet() {
    const s = this.settings.settings();
    const min = Math.max(2, Math.min(10, s.multiLettersMin));
    const max = Math.max(min, Math.min(10, s.multiLettersMax));
    const count = Math.floor(Math.random() * (max - min + 1)) + min;
    const arr: LetterItem[] = Array.from({ length: count }, () => ({ char: randomLetter(s.alphabet), state: 'show' }));
    this.currentSet.set(arr);
    this.activeIndex.set(0);
    this.wordHasError = false;
    this.setSizes.push(count);
  }

  start() {
    this.running.set(true);
    this.index.set(0);
    this.wordsCorrect.set(0);
    this.setSizes = [];
    this.finished.set(false);
    this.durationMs.set(0);
    this.startedAt = Date.now();
    this.genSet();
  }

  stop() {
    if (!this.running()) return;
    this.finishSession();
  }

  private resolveRound(ok: boolean) {
    if (!ok) {
      // Неправильный ввод: подсветить красным активную букву и остаться на текущем слове
      const idx = this.activeIndex();
      this.currentSet.set(this.currentSet().map((it, i) => i === idx ? { ...it, state: 'wrong' as const } : it));
      this.wordHasError = true;

      const nextLetter = idx + 1;
      // Для промежуточных букв — короткая красная вспышка и переход к следующей букве
      if (nextLetter < this.currentSet().length) {
        setTimeout(() => {
          if (!this.running()) return;
          const arr = this.currentSet();
          if (!arr[idx] || arr[idx].state !== 'wrong') return; // уже изменилось (например, успели угадать)
          const back: LetterItem[] = arr.map((it, i) => i === idx ? { ...it, state: 'show' as const } : it);
          this.currentSet.set(back);
        }, 350);
        this.activeIndex.set(nextLetter);
        return;
      }

      // Неправильная последняя буква — завершить слово (не увеличивая счётчик безошибочных)
      this.currentSet.set(this.currentSet().map(it => ({ ...it, state: 'hide' as const })));
      setTimeout(() => {
        if (!this.running()) return;
        const nextIdx = this.index() + 1;
        if (nextIdx >= this.totalWords()) { this.finishSession(); return; }
        this.index.set(nextIdx);
        this.genSet();
      }, 400);
      return;
    }
    // Правильный ввод: пометить текущую букву зеленым и перейти к следующей букве
    const idx = this.activeIndex();
    this.currentSet.set(this.currentSet().map((it, i) => i === idx ? { ...it, state: 'correct' as const } : it));
    const nextLetter = idx + 1;
    if (nextLetter < this.currentSet().length) {
      this.activeIndex.set(nextLetter);
      return;
    }
    // Слово завершено: посчитать, без ошибок ли
    if (!this.wordHasError) this.wordsCorrect.update(v => v + 1);
    // Анимация исчезновения слова
    this.currentSet.set(this.currentSet().map(it => ({ ...it, state: 'hide' })));
    setTimeout(() => {
      if (!this.running()) return;
      const nextIdx = this.index() + 1;
      if (nextIdx >= this.totalWords()) { this.finishSession(); return; }
      this.index.set(nextIdx);
      this.genSet();
    }, 400);
  }

  @HostListener('window:keydown', ['$event'])
  onKey(ev: KeyboardEvent) {
    if (!this.running()) return;
    const key = ev.key; if (key.length !== 1) return;
    const expected = this.currentSet()[this.activeIndex()].char.toUpperCase();
    const got = key.toUpperCase();
    this.resolveRound(got === expected);
  }

  private finishSession() {
    this.running.set(false);
    const dur = Date.now() - this.startedAt;
    this.durationMs.set(dur);
    const s = this.settings.settings();
    const payload: Mode2Result = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      timestamp: Date.now(),
      mode: 'multi',
      settings: s,
      wordsTotal: this.totalWords(),
      wordsCorrect: this.wordsCorrect(),
      setSizes: this.setSizes,
      durationMs: dur,
    } as Mode2Result; // duration on SessionBase
    this.results.add(payload);
    this.finished.set(true);
  }

  reset() {
    this.finished.set(false);
  }

  fmtDuration(ms: number) {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const ss = s % 60;
    return `${m}:${ss.toString().padStart(2,'0')}`;
  }
}
