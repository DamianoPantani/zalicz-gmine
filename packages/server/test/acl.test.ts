import { rejectIfNoAuthTokenSet } from "../src/acl";

describe("acl", () => {
  it("should reject request with no auto token", () => {
    // given
    const json = jest.fn();
    const next = jest.fn();
    const req = { headers: {} };
    const res = { status: () => ({ json }) };

    // when
    // @ts-ignore partial types are enough here
    rejectIfNoAuthTokenSet(req, res, next);

    // then
    expect(next).not.toHaveBeenCalled();
    expect(json).toBeCalledWith({
      detailsString: undefined,
      type: "NO_AUTH_TOKEN_PROVIDED",
    });
  });

  it("should invoke NextFn if auto token is set", () => {
    // given
    const json = jest.fn();
    const next = jest.fn();
    const req = { headers: { authorization: "Bearer 123" } };
    const res = { status: () => ({ json }), locals: "DEFAULT LOCALS" };

    // when
    // @ts-ignore partial types are enough here
    rejectIfNoAuthTokenSet(req, res, next);

    // then
    expect(next).toHaveBeenCalled();
    expect(res.locals).toEqual({ authToken: "123" });
  });
});
