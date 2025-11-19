export function up(knex) {
  return knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.string("name", 100);
    table.string("email", 150).notNullable().unique();
    table.string("phone", 20);
    table.string("password_hash", 255).notNullable();
    table.enum("role", ["admin", "user"]).defaultTo("user");
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
}

export function down(knex) {
  return knex.schema.dropTableIfExists("users");
}
