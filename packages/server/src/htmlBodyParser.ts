import { load } from "cheerio";
import { User } from "./types/shared";

const LOGOUT_BUTTON = "Wyloguj: ";
const PROFILE_BUTTON = "Mój profil";

export const parseUser = (htmlString: string): User | undefined => {
  const $ = load(htmlString);
  const logoutLinkText = $(`#menu a:contains('${LOGOUT_BUTTON}')`).text();
  const userIdLink = $(`#menu a:contains('${PROFILE_BUTTON}')`).attr("href");

  const username = logoutLinkText.split(LOGOUT_BUTTON)[1];
  const userId = userIdLink?.split("/users/view/")[1];

  if (userId && username) {
    return {
      userId: +userId,
      username,
    };
  }

  return undefined;
};
