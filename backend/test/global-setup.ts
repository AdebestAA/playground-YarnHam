import { execSync } from "child_process";
import dotenv from "dotenv";

// runs ONCE before all tests: make sure the test DB has every table
export function setup() {
  const testEnv = dotenv.config({ path: ".env.test" }).parsed ?? {};

  const dbUrl = testEnv.DATABASE_URL;
  if (!dbUrl || !dbUrl.includes("_test")) {
    throw new Error(
      "can't run test db at the time, please check if db test or if the db url contains _test",
    );
  }
  // run migration on every test run
  execSync("npx ts-node ./src/db/migrate.ts", {
    stdio: "inherit",
    env: { ...process.env, ...testEnv },
  });
}
