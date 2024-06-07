/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up (knex) {
    return knex.schema.
        createTable(
            "emails",
            (table) => {
                table.increments("id").primary();
                table.bigint("received_time").notNullable();
                table.string("to").notNullable();
                table.string("from").notNullable();
                table.string("subject").notNullable();
                table.text("body").notNullable();

                table.index("received_time");
            }
        );
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down (knex) {
    return knex.schema.
        dropTable("emails");
}
