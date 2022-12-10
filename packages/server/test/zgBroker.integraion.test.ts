import dotenv from "dotenv";

import { LoginRequest } from "../src/types/shared";
import { ZGApiError } from "../src/ZGApiError";
import { zgApi } from "../src/zgBroker";

dotenv.config();
jest.setTimeout(30000);

const {
  TEST_USER_ID: userId = "0",
  TEST_USER_USERNAME: username = "",
  TEST_USER_PASSWORD: password = "",
} = process.env;

describe("zgBroker", () => {
  it("should create new session cookie", async () => {
    // when
    const results = await zgApi.createNewSessionCookie();

    // then
    expect(results).toEqual({
      authToken: expect.stringMatching(/^[0-f]{32}$/),
    });
  });

  it("should get checked gmina ids", async () => {
    // when
    const results1 = await zgApi.getCheckedGminaIds("123"); // Kikuchiyo, 2 checked gminas
    const results2 = await zgApi.getCheckedGminaIds(userId); // test user - 450+ checked gminas

    // then
    expect(results1.checkedGminaIds).toHaveLength(2);
    expect(results1).toEqual({ checkedGminaIds: ["83", "2182"] });
    expect(results2).toEqual({
      checkedGminaIds: expect.arrayContaining([
        "1982", // Piekoszów,
        "1947", // Kielce,
        "850", // Kraków,
        "1485", // Solina
        "48", // Karpacz
      ]),
    });
    expect(results2.checkedGminaIds.length).toBeGreaterThan(449);
    expect(results2.checkedGminaIds.length).toBeLessThan(2480);
  });

  it("should get getVoivodeship", async () => {
    // when
    const holyCross = await zgApi.getVoivodeship(13);
    const lesserPolish = await zgApi.getVoivodeship(6);

    // then
    expect(holyCross).toContain('<a href="/communes/view/1982">Piekoszów</a>');
    expect(holyCross).toContain("Kielce");
    expect(holyCross).not.toContain("Kraków");
    expect(lesserPolish).toContain('<a href="/communes/view/850">Kraków</a>');
    expect(lesserPolish).not.toContain("Wąchock");
  });

  it("should throw session expiration error if wrong authtoken is set", async () => {
    try {
      // when
      await zgApi
        .setToken("00001111222233334444555566667777")
        .getUserFromSession();
      throw new Error("Expecting above expression to throw an error");
    } catch (e) {
      // then
      expect(e).toBeInstanceOf(ZGApiError);
      const error = e as ZGApiError;
      expect(error.details).toEqual({
        detailsString: undefined,
        type: "SESSION_EXPIRED",
      });
    }
  });

  it("should fail logging in with invalid credentials error", async () => {
    // given
    const request: LoginRequest = {
      password: "someUserNameThatDoesntExist",
      username: "someImaginaryPassword",
    };

    // when
    const { authToken } = await zgApi.createNewSessionCookie();

    try {
      await zgApi.setToken(authToken).loginToZG(request);
      throw new Error("Expecting above expression to throw an error");
    } catch (e) {
      // then
      expect(e).toBeInstanceOf(ZGApiError);
      const error = e as ZGApiError;
      expect(error.details).toEqual({
        detailsString: undefined,
        type: "INVALID_CREDENTIALS",
      });
    }
  });

  it("should login user", async () => {
    // given
    const request: LoginRequest = { username, password };

    // when
    const { authToken } = await zgApi.createNewSessionCookie();
    const { user } = await zgApi.setToken(authToken).loginToZG(request);
    const { user: res } = await zgApi.setToken(authToken).getUserFromSession();

    // then
    expect(user).toEqual(res);
    expect(user).toEqual({ userId: +userId, username });
  });

  it("should update gminas status", async () => {
    // given
    const request: LoginRequest = { username, password };

    // when
    const { authToken } = await zgApi.createNewSessionCookie();
    await zgApi.setToken(authToken).loginToZG(request);

    const checkedGminasBefore = await zgApi.getCheckedGminaIds(userId);

    await zgApi.setToken(authToken).updateGminasStatus({
      date: { day: 1, month: 1, year: 1970 },
      status: { 2025: "a", 2024: "a" },
    });

    const checkedGminasAfter = await zgApi.getCheckedGminaIds(userId);

    // revert
    await zgApi.setToken(authToken).updateGminasStatus({
      date: { day: 1, month: 1, year: 1970 },
      status: { 2025: "d", 2024: "d" },
    });

    const revertedGminas = await zgApi.getCheckedGminaIds(userId);

    // then
    expect(checkedGminasBefore.checkedGminaIds).toHaveLength(
      revertedGminas.checkedGminaIds.length
    );
    expect(checkedGminasBefore.checkedGminaIds).toHaveLength(
      checkedGminasAfter.checkedGminaIds.length - 2
    );
  });

  it("should logout user", async () => {
    // given
    const request: LoginRequest = { username, password };

    // when
    const { authToken } = await zgApi.createNewSessionCookie();
    const { user } = await zgApi.setToken(authToken).loginToZG(request);
    await zgApi.setToken(authToken).logoutFromZG();

    try {
      await zgApi.setToken(authToken).getUserFromSession();
      throw new Error("Expecting above expression to throw an error");
    } catch (e) {
      // then
      expect(e).toBeInstanceOf(ZGApiError);
      const error = e as ZGApiError;
      expect(user).toEqual({ userId: +userId, username });
      expect(error.details).toEqual({
        detailsString: undefined,
        type: "SESSION_EXPIRED",
      });
    }
  });

  it("should process with fake / custom auth token", async () => {
    // given
    const request: LoginRequest = { username, password };
    const fakeAuthToken = "fakeauthtoken";

    // when
    await zgApi.setToken(fakeAuthToken).loginToZG(request);
    const { user } = await zgApi.setToken(fakeAuthToken).getUserFromSession();

    // then
    expect(user).toEqual({ userId: +userId, username });
  });
});
