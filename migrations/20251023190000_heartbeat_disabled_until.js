export function up (knex) {
    return knex.schema.
        alterTable(
            "heartbeats",
            function (table) {
                table.bigint("disabled_until");
            }
        );
}

export function down (knex) {
    return knex.schema.
        alterTable(
            "heartbeats",
            function (table) {
                table.dropColumn("disabled_until");
            }
        );
}
