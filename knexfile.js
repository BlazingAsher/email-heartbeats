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
        client: 'better-sqlite3',
        connection: {
            filename: process.env.DATABASE || './eamil-heartbeats.db'
        }
    }

};