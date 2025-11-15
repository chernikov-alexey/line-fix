# LineFix: Тренажер для зрения и слепой печати

## Описание
LineFix — приложение для восстановления зрительной фиксации после ожога сетчатки, которое также служит тренажером слепой печати. Три режима:
1. **Одиночные буквы**: Фиксация на точке, угадывание букв периферийным зрением
2. **Слова**: Последовательное угадывание букв в слове с точкой под активной буквой
3. **Движущаяся точка**: Нажатие клавиши при прохождении точки под буквой

## Медицинское обоснование
- Центральная скотома после повреждения фовеа (например, ожога сетчатки) может компенсироваться формированием «предпочтительного участка фиксации» (Preferred Retinal Locus, PRL) за пределами повреждённой зоны.
- Благодаря нейропластичности мозг способен переобучать систему фиксации так, чтобы точка взгляда смещалась в область сетчатки ниже/выше/латеральнее поражения. Это снижает влияние скотомы при чтении и при рассмотрении объектов вдали.
- LineFix тренирует устойчивую фиксацию на опорной точке и распознавание букв периферией: последовательное угадывание букв и режим с движущейся точкой помогают закрепить новый PRL и улучшить скорость/точность чтения.
- Приложение не является медицинским изделием; используйте по согласованию с врачом-офтальмологом или специалистом по низкому зрению.

## Рекомендации по использованию
- Проконсультируйтесь со специалистом по низкому зрению/офтальмологом перед началом.
- Проведите калибровку: подберите размер шрифта, «Расстояние буквы от точки (px)», положение точки.
- Начинайте с крупного шрифта и меньшего объёма, постепенно усложняйте.
- Продолжительность сессии 10–20 минут, 1–2 раза в день. Делайте перерывы.
- Избегайте переутомления глаз, боли и дискомфорта; при появлении симптомов — прекратите занятие.
- Обеспечьте хорошее освещение и фиксируйте прогресс в разделе «Результаты».

## Ограничения и противопоказания
- Острота процесса (воспаления), сильная глазная боль, выраженная астенопия/головная боль — прекратите занятия и обратитесь к врачу.
- Свежие травмы/операции глаз, диплопия, предписанные ограничения — занятия только после разрешения врача.
- Детям — только под присмотром взрослых и по назначению специалиста.
- Приложение не заменяет медицинскую реабилитацию и не является медицинским устройством.

## Ссылки на исследования (PRL / нейропластичность)
- Preferred retinal locus in macular disease: characteristics and ... (PubMed): https://pubmed.ncbi.nlm.nih.gov/18628727/
- Preferred retinal loci relationship to macular scotomas in a ... (PubMed): https://pubmed.ncbi.nlm.nih.gov/9111255/
- Preferred Retinal Locus locations in age-related macular degeneration (PubMed): https://pubmed.ncbi.nlm.nih.gov/29065012/
- The effect of prism on preferred retinal locus (PubMed): https://pubmed.ncbi.nlm.nih.gov/28940374/
- Automatic Detection of Preferred Retinal Locus (PRL) for Low Vision ... (PubMed): https://pubmed.ncbi.nlm.nih.gov/30441225/

## Особенности
- Настройки: размер шрифта, расстояние буквы от точки, язык (RU/EN)
- Статистика по сессиям (точность, время реакции)
- Сохранение результатов в localStorage

## Технологии
- Angular 20
- Bootstrap 5.3.8

## Установка
```bash
npm install
npm start
```

---

# LineFix: Vision and Touch Typing Trainer

## Description
LineFix helps restore visual fixation after retinal burns while also serving as touch typing trainer. Three modes:
1. **Single Letters**: Fixate on dot, guess letters with peripheral vision
2. **Words**: Sequentially guess letters in words with dot under active letter
3. **Moving Dot**: Press key when dot passes under letter

## Medical rationale
- Central scotoma after foveal damage (e.g., retinal burn) can be compensated by developing a Preferred Retinal Locus (PRL) outside the lesion.
- Through neuroplasticity, fixation can be retrained to a region of the retina inferior/superior/lateral to the damaged area, reducing the scotoma’s impact on reading and on recognizing distant objects.
- LineFix trains steady fixation on a reference dot and peripheral letter recognition: sequential letter‑guessing and the moving‑dot task help reinforce a new PRL and improve reading speed/accuracy.
- This app is not a medical device; use under guidance of an ophthalmologist or low‑vision specialist.

## Recommendations
- Consult an ophthalmologist/low-vision specialist before starting.
- Calibrate first: choose font size, letter-to-dot distance, and dot position.
- Start with larger fonts and smaller workloads; progress gradually.
- 10–20 minute sessions, 1–2 times per day. Take breaks.
- Stop if you experience eye strain, pain, or significant discomfort.
- Ensure good lighting and track progress in “Results”.

## Contraindications & Limitations
- Acute ocular conditions, significant pain, pronounced asthenopia/headache — stop and consult a physician.
- Recent ocular trauma/surgery, diplopia, or prescribed activity limits — only after medical clearance.
- Children: only under adult supervision and specialist guidance.
- This app does not replace medical rehabilitation and is not a medical device.

## References (PRL / neuroplasticity)
- Preferred retinal locus in macular disease: characteristics and ... (PubMed): https://pubmed.ncbi.nlm.nih.gov/18628727/
- Preferred retinal loci relationship to macular scotomas in a ... (PubMed): https://pubmed.ncbi.nlm.nih.gov/9111255/
- Preferred Retinal Locus locations in age-related macular degeneration (PubMed): https://pubmed.ncbi.nlm.nih.gov/29065012/
- The effect of prism on preferred retinal locus (PubMed): https://pubmed.ncbi.nlm.nih.gov/28940374/
- Automatic Detection of Preferred Retinal Locus (PRL) for Low Vision ... (PubMed): https://pubmed.ncbi.nlm.nih.gov/30441225/

## Features
- Settings: font size, letter-to-dot distance, language (RU/EN)
- Session statistics (accuracy, reaction time)
- localStorage persistence

## Technologies
- Angular 20
- Bootstrap 5.3.8

## Installation
```bash
npm install
npm start
```
