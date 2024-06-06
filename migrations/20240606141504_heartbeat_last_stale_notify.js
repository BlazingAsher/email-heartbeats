/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema
      .alterTable('heartbeats', function(table) {
          table.bigint('last_stale_notify');
      });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema
      .alterTable('heartbeats', function(table) {
          table.dropColumn('last_stale_notify');
      });
}
