import dotenv from "dotenv";

// runs before EACH test file, before its imports, so the app connects to the test DB
dotenv.config({ path: ".env.test", override: true });

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl || !dbUrl.includes("_test")) {
  throw new Error(
    "can't run test db at the time, please check if db test or if the db url contains _test",
  );
}
