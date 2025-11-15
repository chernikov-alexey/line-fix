import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { SettingsComponent } from './settings/settings.component';
import { CalibrationComponent } from './calibration/calibration.component';
import { ResultsComponent } from './results/results.component';
import { SingleLetterComponent } from './modes/single-letter/single-letter.component';
import { MultiLetterComponent } from './modes/multi-letter/multi-letter.component';
import { MovingComponent } from './modes/moving/moving.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'calibration', component: CalibrationComponent },
  { path: 'results', component: ResultsComponent },
  { path: 'mode/single', component: SingleLetterComponent },
  { path: 'mode/multi', component: MultiLetterComponent },
  { path: 'mode/moving', component: MovingComponent },
  { path: '**', redirectTo: '' },
];
