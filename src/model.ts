type TaskStatus = "todo" | "in_progress" | "review" | "done"; // Union Type: статус может быть только одной из этих четырёх строк

// Описываем главную сущность TaskFlow — задачу
interface Task {
  id: number; // уникальный числовой идентификатор задачи
  title: string; // название задачи
  assignee: string; // имя исполнителя
  status: TaskStatus; // текущий статус (только значения из TaskStatus)
  createdAt: string; // дата создания в формате ISO: "2026-11-01"
  dueDate: string; // дедлайн в формате ISO: "2026-11-10"
} 


// Массив примеров: каждый элемент обязан соответствовать типу Task
const tasks: Task[] = [
  {
    id: 1, // идентификатор первой задачи
    title: "Сделать страницу авторизации", // название
    assignee: "Айдана", // исполнитель
    status: "done", // задача уже выполнена
    createdAt: "2026-10-28", // создана 28 октября 2026
    dueDate: "2026-11-05", // дедлайн 5 ноября 2026
  },
  {
    id: 2, // идентификатор второй задачи
    title: "Подключить уведомления по email", // название
    assignee: "Тимур", // исполнитель
    status: "in_progress", // задача в работе
    createdAt: "2026-11-01", // создана 1 ноября 2026
    dueDate: "2026-11-10", // дедлайн 10 ноября 2026 — может быть просрочена
  },
  {
    id: 3, // идентификатор третьей задачи
    title: "Написать документацию API", // название
    assignee: "Айдана", // исполнитель
    status: "todo", // работа ещё не начата
    createdAt: "2026-11-08", // создана 8 ноября 2026
    dueDate: "2026-11-18", // дедлайн 18 ноября 2026
  },
]; 


// Переводит дату в строку "ГГГГ-ММ-ДД" по местному календарю (без времени)
function toDayString(date: Date): string {
  const year = date.getFullYear(); // год по местному времени
  const month = String(date.getMonth() + 1).padStart(2, "0"); // месяц (в JS с 0, поэтому +1), добавляем ведущий ноль
  const day = String(date.getDate()).padStart(2, "0"); // день месяца с ведущим нулём
  return `${year}-${month}-${day}`; // собираем строку вида "2026-11-12"
} 


// Возвращает просроченные задачи: дедлайн раньше сегодняшнего дня, а статус не "done"
function getOverdueTasks(list: Task[], now: Date = new Date()): Task[] {
  const today = toDayString(now); // сегодняшний календарный день без времени
  return list.filter(
    (task) =>
      task.status !== "done" && // выполненные задачи просроченными не считаем
      task.dueDate.slice(0, 10) < today // сравниваем только дни; ISO-строки сравниваются корректно, а дедлайн «сегодня» не просрочен
  ); 
}


// Краткая запись о задаче: только название, исполнитель, дедлайн и статус
type DeadlineInfo = Pick<Task, "title" | "assignee" | "dueDate" | "status">;

// Находит невыполненные задачи, до дедлайна которых осталось не больше daysLeft дней (по умолчанию 3)
function getTasksNearDeadline(list: Task[], now: Date = new Date(), daysLeft: number = 3): DeadlineInfo[] {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // начало сегодняшнего дня (без времени)
  const msPerDay = 24 * 60 * 60 * 1000; // миллисекунд в сутках

  return list
    .filter((task) => {
      const due = new Date(`${task.dueDate.slice(0, 10)}T00:00:00`); // начало дня дедлайна по местному времени
      const diffDays = Math.round((due.getTime() - today.getTime()) / msPerDay); // сколько дней осталось до дедлайна
      return (
        task.status !== "done" && // выполненные задачи не показываем
        diffDays >= 0 && // дедлайн ещё не прошёл (просроченные сюда не входят)
        diffDays <= daysLeft // до дедлайна осталось не больше 3 дней
      );
    })
    .map((task) => ({
      title: task.title, // название задачи
      assignee: task.assignee, // имя исполнителя
      dueDate: task.dueDate, // дата дедлайна
      status: task.status, // текущий статус
    }));
}


export type { Task, TaskStatus, DeadlineInfo };  // Типы экспортируем через export type — этого требуют isolatedModules и verbatimModuleSyntax в tsconfig
export { tasks, getOverdueTasks, getTasksNearDeadline }; // Значения (массив и функции) экспортируем обычным export

console.log(getOverdueTasks(tasks)); // выводит просроченные задачи

// Для примера берём «сегодня» = 15 ноября 2026: до дедлайна задачи №3 (18 ноября) остаётся ровно 3 дня
console.log(getTasksNearDeadline(tasks, new Date("2026-11-15T12:00:00"))); // выводит задачи, у которых до дедлайна 3 дня или меньше