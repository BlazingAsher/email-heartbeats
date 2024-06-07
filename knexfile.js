// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
export default {

    development: {
        client: 'better-sqlite3',
        connection: {
            filename: './email-heartbeats-dev.db'
        }
    },

    production: {
        client: 'pg',
        connection: process.env.DATABASE_URL,
    }

};