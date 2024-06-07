/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up (knex) {
    return knex.schema.
        alterTable(
            "emails",
            (table) => {
                table.string("email_name").
                    references("email_name").
                    inTable("heartbeats");
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
            "emails",
            (table) => {
                table.dropColumn("email_name");
            }
        );
}
