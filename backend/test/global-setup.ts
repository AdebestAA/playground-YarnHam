import {
  PostgreSqlContainer,
  type StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";
import { execSync } from "child_process";
import type { TestProject } from "vitest/node";

let container: StartedPostgreSqlContainer;

// runs ONCE before all test files
export async function setup(project: TestProject) {
  console.log("🐳 starting postgres container...");
  container = await new PostgreSqlContainer("postgres:16-alpine").start();

  const databaseUrl = container.getConnectionUri();
  console.log("🐳 postgres ready at", databaseUrl);

  // same as what you did by hand in step 3
  execSync("npx ts-node ./src/db/migrate.ts", {
    stdio: "inherit",
    env: { ...process.env, DATABASE_URL: databaseUrl },
  });

  // hand the URL to the test files (we use this in step 6)
  project.provide("databaseUrl", databaseUrl);
}

// runs ONCE after all test files finish (same as your docker rm -f)
export async function teardown() {
  await container?.stop();
  console.log("🐳 postgres container removed");
}

declare module "vitest" {
  export interface ProvidedContext {
    databaseUrl: string;
  }
}
