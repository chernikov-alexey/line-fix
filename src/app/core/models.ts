export type Alphabet = 'RU' | 'EN';

export interface Settings {
  fontSizePx: number;
  letterOffsetPx: number;
  letterGapPx: number;
  focusDotOffsetY: number;
  focusDotPosition: 'center' | 'lower';
  alphabet: Alphabet;
  flankers: 'none' | 'left' | 'right' | 'both';
  multiLettersMin: number;
  multiLettersMax: number;
  wordsPerSession: number;
  timePerLetterMs: number;
  wordLength: number;
  pixelsPerCm: number;
  viewingDistanceCm: number;
  adaptiveEnabled?: boolean;
  adaptiveWindowN?: number;
  adaptiveStepPx?: number;
  adaptiveUpPercent?: number;
  adaptiveDownPercent?: number;
  catchEnabled?: boolean;
  catchKey?: string;
  catchWindowMs?: number;
  catchProbability?: number;
}

export type Mode = 'single' | 'multi' | 'moving';

export interface SessionBase {
  id: string;
  timestamp: number;
  mode: Mode;
  settings: Settings;
  durationMs?: number;
}

export interface Mode1Result extends SessionBase {
  total: number;
  correct: number;
  wrong: number;
  avgReactionMs?: number;
  catchTotal?: number;
  catchSuccess?: number;
}

export interface Mode2Result extends SessionBase {
  wordsTotal: number;
  wordsCorrect: number;
  setSizes: number[];
}

export interface Mode3Result extends SessionBase {
  wordLength: number;
  lettersCorrect: number;
  lettersTotal: number;
  perLetter: { index: number; char: string; correct: boolean }[];
}

export type AnyResult = Mode1Result | Mode2Result | Mode3Result;
