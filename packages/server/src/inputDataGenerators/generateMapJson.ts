import { existsSync, readFileSync, rmSync, writeFileSync } from "fs";
import { GminaCoords } from "../types/shared";

const OUTPUT_COORDS_PRECISION = 4;

const serverRootDir = process.cwd();
const inputFilePath = serverRootDir + "\\data\\rawPolygons.json";
const saveDir = `${serverRootDir}\\..\\..\\packages\\client\\public\\map\\`;
const outputFilePath = `${saveDir}\\coords_prec_${OUTPUT_COORDS_PRECISION}.json`;
const inputGminasFile = readFileSync(inputFilePath, "utf8");
const inputGminasJson = JSON.parse(inputGminasFile) as GminaCoords[];
const transformedCoords = inputGminasJson.map<GminaCoords>((rawGmina) => ({
  id: rawGmina.id,
  name: rawGmina.name,
  coords: rawGmina.coords.map(([x, y]) => [
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
