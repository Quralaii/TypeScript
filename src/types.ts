type FlightStatus = "scheduled" | "delayed" | "cancelled";

interface Aircraft {
  model: string;
  seats: number;
}

interface Flight {
  code: string;
  from: string;
  to: string;
  delayMin: number;
  status: FlightStatus;   // union
  aircraft: Aircraft;     // объект внутри объекта
  gate?: string;          // ? — поле можно не заполнять
}

const flight: Flight = {
  code: "KC 921",
  from: "ALA",
  to: "IST",
  delayMin: 45,
  status: "scheduled",
  aircraft: { model: "Airbus A321", seats: 200 },
};

const flights: Flight[] = [flight];   // список рейсов

console.log(flight.aircraft.model);
console.log(flight.gate);
console.log(flights.length);
