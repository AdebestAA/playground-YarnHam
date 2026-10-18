import pool from "../../configs/init-db";
import { getPostByIdService } from "./post.services";
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("../../configs/init-db", () => {
  return {
    default: {
      query: vi.fn(),
    },
  };
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe("getPostIdServie", () => {
  it("returns the post when the database finds it", async () => {
    const fakePost = {
      id: "1",
      content: "hello world",
      nickname: "tester",
      images: [],
    };
    vi.mocked(pool.query).mockResolvedValueOnce({ rows: [fakePost] } as any);

    const post = await getPostByIdService("1");

    console.log("post from reqeust", post);

    expect(post).toEqual(fakePost);
  });

  it("throws 404 when the db founds nothing", async () => {
    vi.mocked(pool.query).mockResolvedValueOnce({ rows: [] } as any);

    await expect(getPostByIdService("1")).rejects.toMatchObject({
      status: 404,
      message: "post not found",
    });
  });

  it("throws 400 when the id entered is invalid", async () => {
    vi.mocked(pool.query).mockRejectedValueOnce({ code: "22P02" });

    await expect(getPostByIdService("1")).rejects.toMatchObject({
      status: 400,
      message: "invalid post id",
    });
  });

  it("throws 500 when the db crashes", async () => {
    vi.mocked(pool.query).mockRejectedValueOnce(
      new Error("connection refused"),
    );

    await expect(getPostByIdService("1")).rejects.toMatchObject({
      status: 500,
      message: "something went wrong",
    });
  });

  it("asks the database for the right id", async () => {
    vi.mocked(pool.query).mockResolvedValueOnce({
      rows: [{ id: "42" }],
    } as any);

    await getPostByIdService("42");

    expect(pool.query).toHaveBeenCalledWith(expect.any(String), ["42"]);
  });
});
