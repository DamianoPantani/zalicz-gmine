import { existsSync, readFileSync, rmSync, writeFileSync } from "fs";

import { Coord } from "../types/shared";

const OUTPUT_COORDS_PRECISION = 3;

const serverRootDir = process.cwd();
const inputFilePath = serverRootDir + "\\data\\rawCapitalCoords.json";
const saveDir = `${serverRootDir}\\..\\client\\src\\resources\\`;
const outputFilePath = `${saveDir}\\capital_coords_prec_${OUTPUT_COORDS_PRECISION}.json`;
const inputFile = readFileSync(inputFilePath, "utf8");
const inputJson = JSON.parse(inputFile) as Coord[];
const transformedCoords: Coord[] = inputJson.map(([x, y]) => [
  +x.toFixed(OUTPUT_COORDS_PRECISION),
  +y.toFixed(OUTPUT_COORDS_PRECISION),
]);

if (existsSync(outputFilePath)) {
  rmSync(outputFilePath);
}

writeFileSync(outputFilePath, JSON.stringify(transformedCoords), {
  encoding: "utf-8",
});
