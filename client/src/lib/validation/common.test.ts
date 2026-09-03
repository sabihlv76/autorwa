import { describe, expect, it } from "vitest";
import { phoneSchema } from "./common";

describe("phoneSchema", () => {
  it.each(["+250788100001", "0788100001", "078 810 0001", "078-810-0001"])(
    "accepts %s",
    (value) => {
      expect(phoneSchema.safeParse(value).success).toBe(true);
    },
  );

  it.each(["abc", "123", "", "078810000012345678901"])("rejects %s", (value) => {
    expect(phoneSchema.safeParse(value).success).toBe(false);
  });
});
