import { it, describe, expect, vi, beforeEach, afterAll } from "vitest";
import request from "supertest";
import app from "../../src/app";
import bcrypt from "bcrypt";
import pool from "../../src/configs/init-db";
import { redisClient } from "../../src/configs/redis-config";

const endpoint = "/api/auth/signin";
vi.mock("../../src/configs/redis-config", () => {
  return {
    redisClient: {
      set: vi.fn(),
      get: vi.fn(),
      del: vi.fn(),
    },
  };
});

const testUser = {
  email: "test-email@gmail.com",
  password: "#Password123",
  nickname: "test-nickname",
};

const createUser = async (isVerified: number) => {
  const hashedPassword = await bcrypt.hash(testUser.password, 10);

  await pool.query(
    "INSERT INTO users (email, password, nickname, is_verified) VALUES ($1, $2, $3, $4)",
    [testUser.email, hashedPassword, testUser.nickname, isVerified],
  );
};

beforeEach(async () => {
  vi.clearAllMocks();
  await pool.query(`TRUNCATE users,otp RESTART IDENTITY CASCADE`);
});

afterAll(async () => {
  await pool.end();
});

describe("test user sign", () => {
  // test for successful login
  it.skip("should successfully signin users with status 200", async () => {
    await createUser(1);

    const res = await request(app)
      .post(endpoint)
      .send({ ...testUser });

    expect(res.status).toBe(200);
  });

  //
  it("should through error for wrong password", async () => {
    await createUser(1);
    const res = await request(app)
      .post(endpoint)
      .send({ email: testUser.email, password: "1234567890" });
    console.log(res.body);

    expect(res.status).toBe(401);
  });
  it("should have access token and refresh token on successful login", async () => {
    await createUser(1);
    const res = await request(app)
      .post(endpoint)
      .send({ email: testUser.email, password: testUser.password });
    console.log(res.body);
    const cookies = res.headers["set-cookie"];
    console.log("cookeis", cookies);
    console.log("headers", res.headers);

    expect(res.status).toBe(200);
  });
});
