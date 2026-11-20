// Telegram-бот: погода в Алматы и курсы валют.
// Запуск: npm run bot  (токен берётся из файла .env, переменная BOT_TOKEN)

// В tsconfig нет типов Node, поэтому описываем нужную часть process сами
declare const process: { env: Record<string, string | undefined> };

interface Weather {
  current: {
    time: string;
    temperature_2m: number;
    wind_speed_10m: number;
  };
}

interface Rate {
  buy: number; // банк покупает валюту у вас
  sell: number; // банк продаёт валюту вам
}

interface HalykRates {
  result: boolean;
  data: {
    currencyHistory: {
      date: string;
      privatePersons: Record<string, Rate>;
    }[];
  };
}

// Ответ Telegram: обновления (сообщения) от пользователей
interface Update {
  update_id: number;
  message?: {
    chat: { id: number };
    text?: string;
  };
}

interface TelegramResponse<T> {
  ok: boolean;
  result: T;
  description?: string;
}

const token = process.env["BOT_TOKEN"];
if (token === undefined || token === "") {
  throw new Error("Нет BOT_TOKEN. Запускайте через: npm run bot");
}
const api = `https://api.telegram.org/bot${token}`;

// Вызов любого метода Telegram Bot API
async function telegram<T>(method: string, body: object): Promise<T> {
  const response = await fetch(`${api}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data: TelegramResponse<T> = await response.json();
  if (!data.ok) {
    throw new Error(`Telegram ${method}: ${data.description ?? response.status}`);
  }
  return data.result;
}

async function getWeather(): Promise<Weather> {
  const url =
    "https://api.open-meteo.com/v1/forecast?latitude=43.24&longitude=76.89&current=temperature_2m,wind_speed_10m&wind_speed_unit=ms";
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Погода: сервер ответил ${response.status}`);
  }
  const data: Weather = await response.json();
  return data;
}

// Неофициальный адрес Halyk Bank, формат может измениться
async function getRates(): Promise<{ date: string; rates: Record<string, Rate> }> {
  const response = await fetch("https://back.halykbank.kz/common/currency-history");
  if (!response.ok) {
    throw new Error(`Курсы: сервер ответил ${response.status}`);
  }
  const data: HalykRates = await response.json();
  const today = data.data?.currencyHistory?.[0];
  if (!data.result || today === undefined) {
    throw new Error("Курсы: неожиданный формат ответа");
  }
  return { date: today.date, rates: today.privatePersons };
}

const currencies: Record<string, string> = {
  USD: "доллар",
  EUR: "евро",
  RUB: "рубль",
  CNY: "юань",
};

function weatherText(weather: Weather): string {
  return `В Алматы сейчас ${weather.current.temperature_2m} °C, ветер ${weather.current.wind_speed_10m} м/с`;
}

function ratesText(date: string, rates: Record<string, Rate>): string {
  const lines = [`Курс Halyk Bank на ${date} (тенге за 1 единицу):`];
  lines.push(`${"".padEnd(16)}${"покупает".padEnd(10)}продаёт`);
  for (const code in currencies) {
    const name = `${currencies[code]} (${code})`;
    const rate = rates[`${code}/KZT`];
    if (rate === undefined) {
      lines.push(`${name.padEnd(16)}курса нет`);
      continue;
    }
    lines.push(`${name.padEnd(16)}${`${rate.buy} ₸`.padEnd(10)}${rate.sell} ₸`);
  }
  return `<pre>${lines.join("\n")}</pre>`; // <pre> — моноширинный шрифт, чтобы таблица была ровной
}

const helpText =
  "Привет! Я показываю погоду в Алматы и курсы валют.\n\n" +
  "/weather — погода\n" +
  "/rates — курсы валют\n" +
  "/all — погода и курсы вместе";

// Готовит ответ на команду
async function answer(command: string): Promise<string> {
  switch (command) {
    case "/start":
    case "/help":
      return helpText;
    case "/weather":
      return weatherText(await getWeather());
    case "/rates": {
      const { date, rates } = await getRates();
      return ratesText(date, rates);
    }
    case "/all": {
      // Оба запроса одновременно; allSettled — чтобы сбой одного не убрал ответ другого
      const [weather, rates] = await Promise.allSettled([getWeather(), getRates()]);
      const weatherPart =
        weather.status === "fulfilled" ? weatherText(weather.value) : "Погода недоступна";
      const ratesPart =
        rates.status === "fulfilled"
          ? ratesText(rates.value.date, rates.value.rates)
          : "Курсы недоступны";
      return `${weatherPart}\n\n${ratesPart}`;
    }
    default:
      return "Не знаю такую команду. Напишите /help";
  }
}

async function handle(update: Update): Promise<void> {
  const message = update.message;
  if (message?.text === undefined) {
    return; // фото, стикеры и т.п. пропускаем
  }
  // "/weather@MyBot args" -> "/weather"
  const command = message.text.split(" ")[0]?.split("@")[0] ?? "";
  let text: string;
  try {
    text = await answer(command);
  } catch (error) {
    text = `Не получилось: ${error instanceof Error ? error.message : String(error)}`;
  }
  await telegram("sendMessage", {
    chat_id: message.chat.id,
    text,
    parse_mode: "HTML",
  });
}

async function main(): Promise<void> {
  const me = await telegram<{ username: string }>("getMe", {});
  console.log(`Бот @${me.username} запущен. Остановить: Ctrl+C`);

  let offset = 0; // с какого обновления читать дальше
  while (true) {
    try {
      // long polling: Telegram держит запрос до 30 секунд, пока не придёт сообщение
      const updates = await telegram<Update[]>("getUpdates", { offset, timeout: 30 });
      for (const update of updates) {
        offset = update.update_id + 1;
        await handle(update);
      }
    } catch (error) {
      console.error(error instanceof Error ? error.message : error);
      await new Promise((resolve) => setTimeout(resolve, 5000)); // пауза перед повтором
    }
  }
}

main();
