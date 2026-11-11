type FlightStatus = "scheduled" | "delayed" | "cancelled";

interface Flight {
  code: string;
  from: string;
  to: string;
  delayMin: number;
  status: FlightStatus;
  international: boolean;
  id: number;
}

// type Car = "bmw" | "bugatti" | "mercedes" | "ferrari" | "porsche";
type Car = number | string;

const flights: Flight[] = [
  { code: "KC 851", from: "NQZ", to: "ALA", delayMin: 15, status: "delayed", international: false, id: 1 },
  { code: "KC 921", from: "ALA", to: "IST", delayMin: 45, status: "scheduled", international: true, id: 2 },
  { code: "DV 703", from: "NQZ", to: "URA", delayMin: 0, status: "cancelled", international: false, id: 3 },
];


const way : Car = 1;