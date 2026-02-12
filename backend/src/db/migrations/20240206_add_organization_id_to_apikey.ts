import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('apikey')
    .addColumn('organization_id', 'text', (col) =>
      col.references('services.id').onDelete('cascade')
    )
    .execute()
  await db.schema
    .createIndex('idx_apikey_organization_id')
    .on('apikey')
    .column('organization_id')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .dropIndex('idx_apikey_organization_id')
    .execute()

  await db.schema
    .alterTable('apikey')
    .dropColumn('organization_id')
    .execute()
}
