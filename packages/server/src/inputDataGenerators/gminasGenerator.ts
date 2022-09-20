import { existsSync, rmSync, writeFileSync } from "fs";
import { parseVoivodeship } from "../htmlBodyParser";
import { Voivodeship } from "../types/shared";
import { isDefined } from "../utils";
import { zgApi } from "../zgBroker";

/** Fetches all gminas info from the server, except for the coords, then saves JSONs to /server/data/voivodeships */

const getVoivodeships = async (): Promise<Voivodeship[]> => {
  const voivodeshipsCount = 16;
  const voivodshipHtmls = await Promise.all(
    Array(voivodeshipsCount)
      .fill(null)
      .map((_, i) => zgApi.getVoivodeship(i + 1))
  );

  const voivodeships = voivodshipHtmls.map(parseVoivodeship).filter(isDefined);

  if (voivodeshipsCount !== voivodeships.length) {
    throw new Error("Couldn't parse all voivodeships");
  }

  return voivodeships;
};

const serverRootDir = process.cwd();

getVoivodeships().then((voivodeships) => {
  voivodeships.forEach((voivodeship) => {
    const outputFilePath =
      serverRootDir + "\\data\\voivodeships\\" + voivodeship.name + ".json";
    if (existsSync(outputFilePath)) {
      rmSync(outputFilePath);
    }

    writeFileSync(outputFilePath, JSON.stringify(voivodeship, null, 2), {
      encoding: "utf-8",
    });

    return outputFilePath;
  });
});
