// 1. Читать 1 книгу на неделю: выполнено, если прочитана хотя бы одна книга
function readBookThisWeek(booksRead: number): boolean {
  return booksRead >= 1;
}

// 2. Пройти курс английского языка: выполнено, если пройдены все уроки
function finishedEnglishCourse(
  completedLessons: number,
  totalLessons: number,
): boolean {
  return completedLessons >= totalLessons;
}

// 3. Заниматься спортом: выполнено, если была хотя бы одна тренировка
function didSport(workouts: number): boolean {
  return workouts >= 1;
}

function status(done: boolean): string {
  return done ? "выполнено" : "не выполнено";
}

// Недельный расчёт: все три задачи выполнены или нет
function weeklyResult(
  booksRead: number,
  completedLessons: number,
  totalLessons: number,
  workouts: number,
): boolean {
  const book = readBookThisWeek(booksRead);
  const english = finishedEnglishCourse(completedLessons, totalLessons);
  const sport = didSport(workouts);

  console.log(`Читать 1 книгу в неделю: ${status(book)}`);
  console.log(`Курс английского: ${status(english)}`);
  console.log(`Заниматься спортом: ${status(sport)}`);

  return book && english && sport;
}

const allDone = weeklyResult(1, 8, 20, 3);
console.log(`Итог недели: все задачи ${status(allDone)}`); // не выполнено
