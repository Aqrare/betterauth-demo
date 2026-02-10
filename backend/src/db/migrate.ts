import { promises as fs } from 'fs'
import { Kysely, Migrator, FileMigrationProvider, PostgresDialect } from 'kysely'
import { Pool } from 'pg'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function migrateToLatest() {
  const db = new Kysely<any>({
    dialect: new PostgresDialect({
      pool: new Pool({
        connectionString: process.env.DATABASE_URL,
      }),
    }),
  })

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join(__dirname, 'migrations'),
    }),
  })

  const { error, results } = await migrator.migrateToLatest()

  results?.forEach((it) => {
    if (it.status === 'Success') console.log(`✅ Migration "${it.migrationName}" was executed successfully`)
    else if (it.status === 'Error') console.error(`❌ Failed to execute migration "${it.migrationName}"`)
  })

  if (error) {
    console.error('❌ Failed to migrate')
    console.error(error)
    process.exit(1)
  }

  console.log('✅ All migrations completed successfully')
  await db.destroy()
}

migrateToLatest()
