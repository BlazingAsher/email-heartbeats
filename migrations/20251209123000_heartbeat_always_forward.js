export function up (knex) {
    return knex.schema.
        alterTable(
            "heartbeats",
            function (table) {
                table.boolean("always_forward").
                    notNullable().
                    defaultTo(false);
            }
        );
}

export function down (knex) {
    return knex.schema.
        alterTable(
            "heartbeats",
            function (table) {
                table.dropColumn("always_forward");
            }
        );
}
