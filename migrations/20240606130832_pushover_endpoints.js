/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema
        .createTable('pushover_endpoints', function(table) {
            table.increments('id').primary();
            table.string('user_key');
            table.string('description');
        })
        .alterTable('heartbeats', function(table) {
            table.integer('endpoint_id')
                .references('id')
                .inTable('pushover_endpoints');
        });

}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
    return knex.schema
        .alterTable('heartbeats', function(table) {
            table.dropColumn('endpoint_id');
        })
        .dropTable('pushover_endpoints');
}
