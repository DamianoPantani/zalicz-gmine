import { existsSync, rmSync, writeFileSync } from "fs";

import { zgApi } from "../zgBroker";

const OUTPUT_COORDS_PRECISION = 4;

const serverRootDir = process.cwd();
const saveDir = `${serverRootDir}\\..\\client\\src\\resources\\`;
const outputFilePath = `${saveDir}\\coords_prec_${OUTPUT_COORDS_PRECISION}.json`;

(async () => {
  const gminas = await zgApi.getGminasCoords(OUTPUT_COORDS_PRECISION);

  existsSync(outputFilePath) && rmSync(outputFilePath);
  writeFileSync(outputFilePath, JSON.stringify(gminas), { encoding: "utf-8" });
})();
