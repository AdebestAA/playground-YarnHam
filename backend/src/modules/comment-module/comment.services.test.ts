import pool from "../../configs/init-db";
import { vi, describe, expect, beforeEach, it } from "vitest";
import { addComment } from "./comment.services";

// npx vitest run src/modules/comment-module

vi.mock("../../configs/init-db", () => {
  return {
    default: {
      query: vi.fn(),
    },
  };
});

beforeEach(() => {
  vi.clearAllMocks();
  vi.resetAllMocks();
});

const arg = {
  email: "myemail@gmail.com",
  post_id: "1",
  comment: "for here now",
};
describe("addComment", () => {
  // should return error if it find no user in the first pool.query
  it.skip("should not find any user", async () => {
    vi.mocked(pool.query).mockResolvedValueOnce({ rows: [] } as any);
    vi.mocked(pool.query).mockResolvedValueOnce({ rows: [] } as any);

    await expect(addComment(arg)).rejects.toMatchObject({
      status: 404,
      message: "user doesn't exist",
    });
    expect(pool.query).toHaveBeenCalledTimes(1);
  });

  //   it should retrun error of post not found

  it.skip("should not find a post", async () => {
    vi.mocked(pool.query).mockResolvedValueOnce({
      rows: [{ email: "testemail@gmail.com", id: 1 }],
    } as any);
    vi.mocked(pool.query).mockRejectedValueOnce({ code: "23503" });

    //   const resp = await addComment(arg);
    await expect(addComment(arg)).rejects.toMatchObject({
      status: 404,
      message: "post not found",
    });

    expect(pool.query).toHaveBeenCalledTimes(2);
  });

  //   crash the db
  it.skip("crashes db and return status 500 ", async () => {
    vi.mocked(pool.query).mockRejectedValueOnce(
      new Error("something went wrong"),
    );

    await expect(addComment(arg)).rejects.toMatchObject({
      status: 500,
      message: "something went wrong",
    });

    expect(pool.query).toHaveBeenCalledTimes(1);
  });

  //   happy path

  // it(" should successfully run both queries successfully ", async () => {
  //   vi.mocked(pool.query).mockResolvedValueOnce({
  //     rows: [{ email: "testemail@gmail.com", id: 1 }],
  //   } as any);
  //   vi.mocked(pool.query).mockResolvedValueOnce();

  //   await addComment(arg);

  //   expect(pool.query).toHaveBeenCalledTimes(2);
  // })
});
