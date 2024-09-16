import { PostgresDialect, Kysely } from "kysely";
import { Pool } from 'pg';
import { DB } from "./database.types";

const dialect = new PostgresDialect({
    pool: new Pool({
      max: 10,
      connectionString: process.env.DATABASE_URL,
    })
  });

  export const db = new Kysely<DB>({
    dialect,
  })
  