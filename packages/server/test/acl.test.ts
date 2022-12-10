import { rejectIfNoAuthTokenSet } from "../src/acl";

describe("acl", () => {
  it("should reject request with no auto token", () => {
    // given
    const json = jest.fn();
    const next = jest.fn();

    // when
    rejectIfNoAuthTokenSet(
      // @ts-ignore partial types are enough here
      {
        headers: {},
      },
      { status: () => ({ json }) },
      next
    );

    // then
    expect(json).toBeCalledWith({
      detailsString: undefined,
      type: "NO_AUTH_TOKEN_PROVIDED",
    });
    expect(next).not.toHaveBeenCalled();
  });
});
