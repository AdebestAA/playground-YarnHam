import { describe, expect, it } from "vitest";
import { createError, getErrorStatus } from "../util/create-error";

describe("createError", () => {
  it("returns error instance", () => {
    expect(createError(401, "unauthenticated")).toBeInstanceOf(Error);
    expect(createError(401, "unauthenticated")).toHaveProperty("status", 401);
    expect(createError(401, "unauthenticated")).toHaveProperty(
      "message",
      "unauthenticated",
    );
  });
});

// describe("getErrorStatus",()=>{

//     it("should return error status",()=>{
//         expect(getErrorStatus(Error)).is
//     })
// })
