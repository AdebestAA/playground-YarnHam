import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import pool from "../../src/configs/init-db";
import { sendVerificationToken } from "../../src/modules/auth-module/auth.service";
import request from "supertest";
import app from "../../src/app";

const endpoint = "/api/auth/register";
const payload = {
  nickname: "myname",
  email: "register-test@gmail.com",
  password: "1234567890",
};

vi.mock(
  "../../src/modules/auth-module/auth.service",
  async (importOriginal) => {
    const actual =
      await importOriginal<
        typeof import("../../src/modules/auth-module/auth.service")
      >();
    return {
      ...actual,
      sendVerificationToken: vi.fn(),
    };
  },
);
// vi.mock("../../src/configs/init-db", () => ({
//   pool: {
//     query: vi.fn(),
//   },
// }));

beforeAll(async () => {
  vi.clearAllMocks();
  await pool.query(`TRUNCATE users, otp RESTART IDENTITY CASCADE`);
});

afterAll(async () => {
  await pool.end();
});

describe("test signup route again for better understanding", () => {
  it("should successfully signup", async () => {
    const res = await request(app).post(endpoint).send(payload);

    // this checks for response 200
    expect(res.status).toBe(200);

    // checks if user actually exist after signup in the db

    const result = await pool.query(
      `SELECT email,nickname FROM users WHERE email = $1`,
      [payload.email],
    );
    console.log(result.rows);

    expect(result.rows).toHaveLength(2);

    // now checks if the sendVerificationToken was called
    expect(sendVerificationToken).toHaveBeenCalled();
  });
});
