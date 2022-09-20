export type User = { userId: number; username: string };

export enum GminaStatusChange {
  remove = "d",
  add = "a",
}

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

export type GminasStatus = Record<number, GminaStatusChange>;

export type DateForm = {
  month: number; // TODO: add trailing 0?
  day: number;
  year: number;
};
