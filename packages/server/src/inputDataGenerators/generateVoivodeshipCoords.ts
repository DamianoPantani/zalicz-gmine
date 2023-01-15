import { existsSync, readFileSync, rmSync, writeFileSync } from "fs";

import { Coords, GminaCoords } from "../types/shared";

type RawVoivodeships = {
  features: Feature[];
};

type Feature = {
  geometry: { coordinates: [Coords] };
  properties: {
    id: number;
    nazwa: string;
  };
};

const OUTPUT_COORDS_PRECISION = 4;

const serverRootDir = process.cwd();
const inputFilePath = serverRootDir + "\\data\\rawVoivodeshipCoords.json";
const saveDir = `${serverRootDir}\\..\\client\\src\\resources\\`;
const outputFilePath = `${saveDir}\\voivodeships_prec_${OUTPUT_COORDS_PRECISION}.json`;
const inputString = readFileSync(inputFilePath, "utf8");
const inputJson = JSON.parse(inputString) as RawVoivodeships;
const boundaryArray = inputJson.features.map<GminaCoords>((feature) => {
  const { geometry, properties } = feature;

  return {
    id: properties.id.toString(),
    name: properties.nazwa,
    coords: geometry.coordinates[0],
  };
});

const transformedCoords = boundaryArray.map<GminaCoords>((rawCoords) => ({
  id: rawCoords.id,
  name: rawCoords.name,
  coords: rawCoords.coords.map(([y, x]) => [
    +x.toFixed(OUTPUT_COORDS_PRECISION),
    +y.toFixed(OUTPUT_COORDS_PRECISION),
  ]),
}));

if (existsSync(outputFilePath)) {
  rmSync(outputFilePath);
}

writeFileSync(outputFilePath, JSON.stringify(transformedCoords), {
  encoding: "utf-8",
});
