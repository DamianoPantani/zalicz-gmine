import { load } from "cheerio";
import { parse } from "csv-string";

import { Gmina, User, UserGmina, Voivodeship } from "./types/shared";

export const parseUser = (htmlString: string): User | undefined => {
  const $ = load(htmlString);
  const userIdLink = $("li a[href*='users/view']").attr("href");
  const userId = userIdLink?.split("/users/view/")[1];

  // TODO: ZG no longer shows user name anywhere on the landing page
  // const headerText = $(".users h1").text();
  // const username = headerText.split("Profil: ")[1];

  if (userId) {
    return {
      userId: +userId,
    };
  }

  return undefined;
};

export const parseVoivodeship = (
  htmlString: string
): Voivodeship | undefined => {
  const $ = load(htmlString);
  const nameHeader = $("#forms h1").first();
  const gminaRows = $("#forms table tr:not(:first-of-type)");

  const voiName = nameHeader.text().split(" ")[1];
  const gminas = gminaRows
    .map((_, row): Gmina => {
      const data = $(row);
      const firstCol = data.find("a").first();

      return {
        area: data.find("td.right").text().split(" ")[0],
        county: data.find("td:not(.right)").last().text().trim(),
        id: firstCol.attr("href")?.split("/").pop() ?? "",
        name: firstCol.text(),
        voivodeship: voiName,
      };
    })
    .get();

  if (voiName && gminas.length) {
    return {
      name: voiName,
      gminas,
    };
  }

  return undefined;
};

export const parseGminasCSV = (csvString: string): UserGmina[] => {
  const gminas = parse(csvString).map<UserGmina>((row) => ({
    id: row[0],
    name: row[1],
    date: row[2],
    county: row[3],
    voivodeship: row[4],
    area: row[5],
  }));

  gminas.shift(); // removes header

  return gminas;
};
