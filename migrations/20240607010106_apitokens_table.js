/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up (knex) {
    return knex.schema.
        createTable(
            "api_tokens",
            (table) => {
                table.string("id").primary();
                table.string("description");
            }
        );
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down (knex) {
    return knex.schema.
        dropTable("api_tokens");
}
