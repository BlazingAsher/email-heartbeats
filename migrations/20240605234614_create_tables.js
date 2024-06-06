/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema
        .createTable('heartbeats', function(table) {
            table.string('email_name').primary();
            table.bigint('last_heartbeat');
            table.integer('max_heartbeat_interval_seconds').notNullable();
            table.json('matching_criteria').notNullable();

            table.index('last_heartbeat');
        });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema
        .dropTable('heartbeats')
};
