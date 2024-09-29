export type User = {
  userId: number;
};

export type GminaStatusChange = "d" | "a";

export type Gmina = {
  id: string;
  name: string;
  county: string;
  voivodeship: string;
  area: string;
};

export type Voivodeship = {
  name: string;
  gminas: Gmina[];
};

export type UserGmina = Gmina & {
  date: string;
};

export type Coords = [number, number][];

export type GminaCoords = { id: string; name: string; coords: Coords };

export type GminasStatus = Record<string, GminaStatusChange>;

export type DateForm = {
  month: number;
  day: number;
  year: number;
};
