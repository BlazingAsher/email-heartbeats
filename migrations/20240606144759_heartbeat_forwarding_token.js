/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema
      .alterTable('heartbeats', function(table) {
          table.string('forwarding_token');
      });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema
      .alterTable('heartbeats', function(table) {
          table.dropColumn('forwarding_token');
      });
}
