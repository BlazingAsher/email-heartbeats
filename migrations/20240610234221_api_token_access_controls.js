/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
  return knex.schema
      .alterTable("api_tokens", (table) => {
          table.string("access_controls").
              notNullable().
              defaultTo("");
      });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
  return knex.schema
      .alterTable("api_tokens", (table) => {
          table.dropColumn("access_controls");
      });
}
