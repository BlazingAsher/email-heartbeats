/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up (knex) {
    return knex.schema.
        alterTable(
            "pushover_endpoints",
            function (table) {
                table.string("timezone").notNullable().
                    defaultTo("UTC");
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
            "pushover_endpoints",
            function (table) {
                table.dropColumn("timezone");
            }
        );
}
