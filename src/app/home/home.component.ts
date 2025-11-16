import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
  <div class="container py-4">
    <div class="row g-3">
      <div class="col-12">
        <h1 class="h3">LineFix</h1>
        <p class="text-muted">Тренажер фиксации взгляда и периферического распознавания.</p>
      </div>
      <div class="col-md-4">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">Режим 1: Одна буква</h5>
            <p class="card-text">Смотрите на точку, угадывайте появляющиеся буквы.</p>
            <a routerLink="/mode/single" class="btn btn-primary">Начать</a>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">Режим 2: Несколько букв</h5>
            <p class="card-text">Несколько букв и указатель-точка цели.</p>
            <a routerLink="/mode/multi" class="btn btn-primary">Начать</a>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">Режим 3: Движущаяся точка</h5>
            <p class="card-text">Точка плывет под буквами. Успейте нажать.</p>
            <a routerLink="/mode/moving" class="btn btn-primary">Начать</a>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">Настройки</h5>
            <p class="card-text">Размер шрифта, расстояния, алфавит и др.</p>
            <a routerLink="/settings" class="btn btn-outline-secondary">Открыть</a>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">Калибровка</h5>
            <p class="card-text">Настройка круга невидимой области.</p>
            <a routerLink="/calibration" class="btn btn-outline-secondary">Открыть</a>
          </div>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">Результаты</h5>
            <p class="card-text">История сессий, экспорт/очистка.</p>
            <a routerLink="/results" class="btn btn-outline-secondary">Открыть</a>
          </div>
        </div>
      </div>
    </div>
  </div>
  `,
})
export class HomeComponent {}
