export function up (knex) {
    const client = knex.client.config.client;

    if (client === "mysql" || client === "mysql2") {
        return knex.schema.
            raw("CREATE INDEX emails_email_name_received_time_desc_idx ON emails (email_name, received_time)");
    }

    return knex.schema.
        raw("CREATE INDEX IF NOT EXISTS emails_email_name_received_time_desc_idx ON emails (email_name, received_time DESC)");
}

export function down (knex) {
    const client = knex.client.config.client;

    if (client === "mysql" || client === "mysql2") {
        return knex.schema.
            raw("DROP INDEX emails_email_name_received_time_desc_idx ON emails");
    }

    return knex.schema.
        raw("DROP INDEX IF EXISTS emails_email_name_received_time_desc_idx");
}
