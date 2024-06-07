/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up (knex) {
    return knex.schema.
        alterTable(
            "heartbeats",
            (table) => {
                table.text("description");
            }
        );
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down (knex) {
    return knex.schema.
        alterTable(
            "heartbeats",
            (table) => {
                table.dropColumn("description");
            }
        );
}
