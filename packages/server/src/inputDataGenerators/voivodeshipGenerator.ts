/* eslint-disable no-console */
import { existsSync, rmSync, writeFileSync } from "fs";

import { parseVoivodeship } from "../htmlBodyParser";
import { Voivodeship } from "../types/shared";
import { isDefined } from "../utils";
import { zgApi } from "../zgBroker";

/** Fetches all gminas info from the server, except for the coords, then saves JSONs to /server/data/voivodeships */

const getVoivodeships = async (): Promise<Voivodeship[]> => {
  const voivodeshipsCount = 16;
  const voivodeshipHtmls = await Promise.all(
    Array(voivodeshipsCount)
      .fill(null)
      .map((_, i) => {
        const voi = zgApi.getVoivodeship(i + 1);
        console.log(`Done fetching voivodeship ${i}`);

        return voi;
      })
  );

  console.log("Parsing all");
  const voivodeships = voivodeshipHtmls.map(parseVoivodeship).filter(isDefined);

  if (voivodeshipsCount !== voivodeships.length) {
    throw new Error("Couldn't parse all voivodeships");
  }

  return voivodeships;
};

const serverRootDir = process.cwd();

getVoivodeships().then((voivodeships) => {
  const saveDir = `${serverRootDir}\\..\\client\\public\\map\\`;
  console.log(`Done, saving to ${saveDir}`);
  voivodeships.forEach((voivodeship) => {
    const outputFilePath = `${saveDir}${voivodeship.name}.json`;
    if (existsSync(outputFilePath)) {
      rmSync(outputFilePath);
    }

    writeFileSync(outputFilePath, JSON.stringify(voivodeship, null, 2), {
      encoding: "utf-8",
    });
  });
});
