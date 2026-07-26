/// <reference types="node" />

import "dotenv/config";
import { defineConfig } from "prisma/config";

const uri = process.env["DATABASE_URL"];

if (!uri) {
  throw new Error("DATABASE_URL is not set");
}

export default defineConfig({
  schema: "prisma/",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: uri,
  },
});
