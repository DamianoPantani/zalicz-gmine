import axios from "axios";
import { RequestHandler } from "express";
import cookie from "cookie";
import { LoginRequest } from "./types/shared";

export const loginUser: RequestHandler<unknown, unknown, LoginRequest> = async (
  req,
  res
) => {
  try {
    const { password, username } = req.body;

    const { headers } = await axios.get("https://zaliczgmine.pl", {
      headers: {
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.102 Safari/537.36 OPR/90.0.4480.84",
      },
    });

    const zgCookies = headers["set-cookie"]?.[0] ?? "";
    const { expires, path, ZALICZGMINEPL } = cookie.parse(zgCookies);

    const zgResponse = await axios({
      method: "POST",
      url: "https://zaliczgmine.pl/users/login",
      data: `_method=POST&data%5BUser%5D%5Busername%5D=${username}&data%5BUser%5D%5Bpassword%5D=${password}`,
      headers: {
        cookie: zgCookies,
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.102 Safari/537.36 OPR/90.0.4480.84",
      },
    });

    const { path: redirectUrl } = zgResponse.request;

    res
      .cookie("ZALICZGMINEPL", ZALICZGMINEPL, {
        expires: new Date(expires),
        path,
        secure: true,
      })
      .json({ redirectUrl });
  } catch (error) {
    res.status(400).json({ error });
  }
};
