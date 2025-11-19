import { defineConfig, env } from "prisma/config";
import * as dotenv from "dotenv";

// Load .env manually since Prisma config disables automatic loading
dotenv.config();

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    // Reference DATABASE_URL from .env
    url: env("DATABASE_URL"),
  },
});

