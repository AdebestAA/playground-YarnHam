import { describe, it, expect, vi } from "vitest";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { authMiddleware } from "./auth.middleware";
import { accessTokenSecret } from "../constants";

const makeReq = (authorization?: string) =>
  ({ headers: { authorization } }) as unknown as Request;

const makeRes = () => {
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  };
  return res as unknown as Response & typeof res;
};

describe("authMiddleware", () => {
  it("rejects a request with no token", async () => {
    const req = makeReq(undefined);
    const res = makeRes();
    const next = vi.fn();

    await authMiddleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "unauthorized",
    });
    expect(next).not.toHaveBeenCalled();
  });
});
