import { describe, expect, it } from "vitest";
import { generateOtp } from "./generate-otp";

describe("generateOtp", () => {
  // it(" returns string", () => {
  //   for (let i = 0; i < 3; i++) {
  //     expect(typeof generateOtp()).toBe("string");
  //   }
  // });

  // it(" expect 6 digit value", () => {
  //   for (let i = 0; i < 3; i++) {
  //     expect(generateOtp()).toHaveLength(6);
  //   }
  // });

  // it("returns only digits", () => {
  //   for (let i = 0; i < 3; i++) {
  //     expect(generateOtp()).toMatch(/^\d{6}$/);
  //   }
  // });

  it("does not always return same value", () => {
    const s = new Set();
    for (let i = 0; i < 100; i++) {
      const otp = generateOtp();

      s.add(otp);
    }

    expect(s.size).toBeGreaterThan(1);
  });
});
