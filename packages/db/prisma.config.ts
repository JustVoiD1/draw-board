import { config } from "dotenv";
import { defineConfig } from "prisma/config";
import path from "node:path";
import { fileURLToPath } from "node:url";

const directory = path.dirname(fileURLToPath(import.meta.url));

config({ path: path.resolve(directory, "../../apps/http-backend/.env") });
config({ path: path.resolve(directory, "../../apps/ws-backend/.env") });
config({ path: path.resolve(directory, "../../.env") });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL,
  },
});
