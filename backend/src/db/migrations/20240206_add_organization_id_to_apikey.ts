import { Kysely } from 'kysely'

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .alterTable('apikey')
    .addColumn('organizationId', 'text', (col) =>
      col.references('organization.id').onDelete('cascade')
    )
    .execute()
  await db.schema
    .createIndex('idx_apikey_organization_id')
    .on('apikey')
    .column('organizationId')
    .execute()
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema
    .dropIndex('idx_apikey_organization_id')
    .execute()

  await db.schema
    .alterTable('apikey')
    .dropColumn('organizationId')
    .execute()
}
