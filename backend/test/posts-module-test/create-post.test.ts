import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";

const endpoint = "/api/posts";
import app from "../../src/app";
import bcrypt from "bcrypt";
import pool from "../../src/configs/init-db";
import request from "supertest";
import { createAccessToken } from "../../src/modules/auth-module/auth.service";

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

// empty table before starting process
beforeEach(async () => {
  await pool.query("TRUNCATE users, otp RESTART IDENTITY CASCADE");
});

afterAll(async () => {
  await pool.end();
});

describe("test the post endpoint", async () => {
  it("creates user,assign a token and make a post", async () => {
    await createUser(1);

    const accessToken = await createAccessToken(testUser.email);

    const res = await request(app)
      .post(endpoint)
      .set("Authorization", `Bearer ${accessToken}`)
      .send({ content: "my post from here" });
    console.log(res.body);

    expect(res.status).toBe(200);
  });
});
