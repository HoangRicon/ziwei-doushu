// prisma.config.ts — Prisma v7 configuration
import path from 'path';
import { config as dotenv } from 'dotenv';

const envPath = path.resolve(process.cwd(), '.env.local');
dotenv({ path: envPath });

import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env.DATABASE_URL!,
  },
});
