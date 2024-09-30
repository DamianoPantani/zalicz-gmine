import { existsSync, readFileSync, rmSync, writeFileSync } from "fs";

import { Coord, VoivodeshipCoords } from "../types/shared";

type RawVoivodeships = {
  features: Feature[];
};

type Feature = {
  geometry: { coordinates: [Coord[]] };
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
const boundaryArray = inputJson.features.map<VoivodeshipCoords>((feature) => {
  const { geometry, properties } = feature;

  return {
    id: properties.id.toString(),
    name: properties.nazwa,
    polygon: geometry.coordinates[0],
  };
});

const transformedCoords = boundaryArray.map<VoivodeshipCoords>((rawCoords) => ({
  id: rawCoords.id,
  name: rawCoords.name,
  polygon: rawCoords.polygon.map(([y, x]) => [
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
