import { Kysely, PostgresDialect } from 'kysely'
import { Pool } from 'pg'
import dotenv from 'dotenv'

dotenv.config()

interface Database {
}

const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
  }),
})

export const db = new Kysely<Database>({
  dialect,
})
