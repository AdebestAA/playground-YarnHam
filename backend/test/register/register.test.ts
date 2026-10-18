import { it, describe, expect, vi, beforeEach, afterAll } from "vitest";
import request from "supertest";
import app from "../../src/app";
import { sendVerificationToken } from "../../src/modules/auth-module/auth.service";
import pool from "../../src/configs/init-db";
// import app from "../../src/"
const endpoint = "/api/auth/register";
const payload = {
  nickname: "myname",
  email: "register-test@gmail.com",
  password: "1234567890",
};

vi.mock(
  "../../src/modules/auth-module/auth.service",
  async (importOriginal) => {
    const real =
      await importOriginal<
        typeof import("../../src/modules/auth-module/auth.service")
      >();
    return { ...real, sendVerificationToken: vi.fn() };
  },
);

// empty table before starting process
beforeEach(async () => {
  await pool.query("TRUNCATE users, otp RESTART IDENTITY CASCADE");
  vi.mocked(sendVerificationToken).mockClear();
});

// end connection
afterAll(async () => {
  await pool.end();
});

console.log("TEST DB:", process.env.DATABASE_URL);

describe("Test the register functionality", () => {
  it("should register user", async () => {
    const res = await request(app)
      .post(endpoint)
      .send({ ...payload, email: "register-event@gmail.com" });

    expect(res.status).toBe(200);
    // to match the type stricty
    expect(res.body).toEqual({
      success: expect.any(Boolean),
      message: expect.any(String),
    });
  });
});
