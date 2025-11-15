export const RU_ALPHABET = Array.from('АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ');
export const EN_ALPHABET = Array.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ');

export function randomLetter(alphabet: 'RU' | 'EN'): string {
  const pool = alphabet === 'RU' ? RU_ALPHABET : EN_ALPHABET;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function randomWord(len: number, alphabet: 'RU' | 'EN'): string {
  let w = '';
  for (let i = 0; i < len; i++) w += randomLetter(alphabet);
  return w;
}
