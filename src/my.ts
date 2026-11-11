// Сколько часов в день уходит на соцсети
function socialMediaHours(minutesPerDay: number): number {
  return minutesPerDay / 60;
}

// Сколько часов в день уходит на дорогу до работы и домой
function commuteHours(toWorkMinutes: number, toHomeMinutes: number): number {
  return (toWorkMinutes + toHomeMinutes) / 60;
}

console.log(`Соцсети: ${socialMediaHours(120)} ч в день`); // 2
console.log(`Дорога: ${commuteHours(40, 50)} ч в день`); // 1.5
