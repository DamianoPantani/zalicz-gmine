import axios from "axios";
import { RequestHandler } from "express";
import { LoginRequest } from "./types/shared";

export const loginUser: RequestHandler<unknown, unknown, LoginRequest> = (
  req,
  res
) => {
  const { password, username } = req.body;

  axios({
    method: "POST",
    url: "https://zaliczgmine.pl/users/login",
    data: `_method=POST&data%5BUser%5D%5Busername%5D=${username}&data%5BUser%5D%5Bpassword%5D=${password}`,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      "accept-encoding": "gzip, deflate, br",
      "accept-language": "en,en-US;q=0.9,en-GB;q=0.8,pl;q=0.7",
      "cache-control": "max-age=0",
      "content-length": "97",
      "content-type": "application/x-www-form-urlencoded",
      cookie:
        "__gads=ID=b100b625b584e609-22dc06b54bcd00c5:T=1645799180:RT=1645799180:S=ALNI_MbGsCorLiz_r99nNRIrdIUFTWhK5Q; __utmz=74396953.1651649550.8.2.utmcsr=google|utmccn=(organic)|utmcmd=organic|utmctr=(not%20provided); ZALICZGMINEPL=e6671b35348ccc0638238307989872bf; __utmc=74396953; __utma=74396953.165689667.1645799180.1663351950.1663354069.46; __utmt=1; __utmb=74396953.4.10.1663354069",
      dnt: "1",
      origin: "https://zaliczgmine.pl",
      referer: "https://zaliczgmine.pl/users/login",
      "sec-ch-ua": `" Not A;Brand";v="99", "Chromium";v="104", "Opera";v="90"`,
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "Windows",
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "same-origin",
      "sec-fetch-user": "?1",
      "upgrade-insecure-requests": "1",
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.102 Safari/537.36 OPR/90.0.4480.84",
    },
  })
    .then((zgResponse) => {
      const { path } = zgResponse.request;
      debugger;
      res.json({ path });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};
