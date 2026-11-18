interface Weather {
  current: {
    time: string;
    temperature_2m: number;
    wind_speed_10m: number;
  };
}

interface Rate {
  buy: number;  // банк покупает валюту у вас
  sell: number; // банк продаёт валюту вам
}

interface HalykRates {
  result: boolean;
  data: {
    currencyHistory: {
      date: string;
      privatePersons: Record<string, Rate>; // ключи вида "USD/KZT"
    }[];
  };
}

// Погода в Алматы (ветер сразу в м/с)
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

// Курсы покупки/продажи для физлиц из публичного JSON Halyk Bank.
// Это неофициальный (недокументированный) адрес, формат может измениться.
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

async function main() {
  try {
    // Оба запроса уходят одновременно, ждём результат обоих
    const [weather, { date, rates }] = await Promise.all([getWeather(), getRates()]);

    console.log(
      `В Алматы сейчас ${weather.current.temperature_2m} °C, ветер ${weather.current.wind_speed_10m} м/с`
    );

    const currencies: Record<string, string> = {
      USD: "доллар",
      EUR: "евро",
      RUB: "рубль",
      CNY: "юань",
    };

    console.log(`Курс Halyk Bank на ${date} (тенге за 1 единицу):`);
    // Заголовок один раз, дальше в строках только цифры
    console.log(`${"".padEnd(16)}${"покупает".padEnd(10)}продаёт`);
    for (const code in currencies) {
      const name = `${currencies[code]} (${code})`;
      const rate = rates[`${code}/KZT`];
      if (rate === undefined) {
        console.log(`${name.padEnd(16)}курса нет`);
        continue;
      }
      console.log(`${name.padEnd(16)}${`${rate.buy} ₸`.padEnd(10)}${rate.sell} ₸`);
    }
  } catch (error) {
    console.error("Не получилось:", error instanceof Error ? error.message : error);
  }
}

main();
