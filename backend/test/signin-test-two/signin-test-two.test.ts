import { describe, vi, it, beforeAll, afterAll, expect } from "vitest";
import pool from "../../src/configs/init-db";
import bcrypt from "bcrypt";
import request from "supertest";
import app from "../../src/app";
import { redisClient } from "../../src/configs/redis-config";

const endpoint = "/api/auth/signin";
const payload = {
  nickname: "mynick",
  email: "register-test@gmail.com",
  password: "1234567890",
};

vi.mock("../../src/configs/redis-config", () => {
  return {
    redisClient: {
      set: vi.fn(),
      get: vi.fn(),
      del: vi.fn(),
    },
  };
});
// vi.mock("../../src/configs/init-db",()=>{

//     return {
//         pool:{
//             query:vi.fn()
//         }
//     }
// })

beforeAll(async () => {
  await pool.query(`TRUNCATE users RESTART IDENTITY CASCADE`);
});

afterAll(async () => {
  await pool.end();
});

describe("SIGNIN ", () => {
  it("should signin user successfully", async () => {
    // first create the user first
    const hashedPassword = await bcrypt.hash(payload.password, 10);

    await pool.query(
      `INSERT INTO users(email,nickname,password,is_verified)
    VALUES($1,$2,$3,$4)
    `,
      [payload.email, payload.nickname, hashedPassword, 1],
    );

    // now the signin check gan gan

    const res = await request(app)
      .post(endpoint)
      .send({ email: payload.email, password: payload.password });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("success");

    expect(redisClient.set).toHaveBeenCalled();
  });
});
