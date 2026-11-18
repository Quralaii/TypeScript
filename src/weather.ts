interface Weather {
  current: {
    time: number;
    temperature_2m: number;
    wind_speed_10m: number;
  };
}

async function getWeather(): Promise<Weather> {
  const url =
    "https://api.open-meteo.com/v1/forecast?latitude=43.24&longitude=76.89&current=temperature_2m,wind_speed_10m";
  const response = await fetch(url);
  // console.log(response);
  const data: Weather = await response.json();
  // console.log(data);
  return data;
}

async function main() {
  console.log("получаем погоду...");
  const weather = await getWeather();
  console.log("погода получена");
  // console.log(weather);
  console.log(`В Алматы сейчас ${weather.current.temperature_2m} °C`);
  console.log(`Ветер ${weather.current.wind_speed_10m} км/ч`);
}
console.log("старт");
main();

console.log("конец");