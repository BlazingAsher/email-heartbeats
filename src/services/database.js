import knex from "knex";

export const db = knex({
    client: 'better-sqlite3',
    connection: {
        filename: './email-heartbeats-dev.db'
    },
    useNullAsDefault: true
});