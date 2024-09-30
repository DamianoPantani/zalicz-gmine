export type User = {
  userId: number;
};

export type GminaStatusChange = "d" | "a";

export type GminaPolygonResponse = {
  items: {
    i: string;
    n: string;
    c: string;
    z: string;
  }[];
  status: string;
};

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

export type Coord = [number, number];

export type GminaCoords = {
  id: string;
  name: string;
  polygons: Coord[][][];
};

export type VoivodeshipCoords = { id: string; name: string; polygon: Coord[] };

export type GminasStatus = Record<string, GminaStatusChange>;

export type DateForm = {
  month: number;
  day: number;
  year: number;
};
