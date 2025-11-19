export function up(knex) {
  return knex.schema.createTable("buses", (table) => {
    table.increments("id").primary();
    table.string("bus_number", 50).notNullable();
    table.string("bus_name", 100).notNullable();
    table.decimal("fare", 10, 2).notNullable();
    table.integer("seats").notNullable();
    table.string("arrival_time", 20).notNullable();
    table.string("departure_time", 20).notNullable();
    table.string("from_location", 100).notNullable();
    table.string("to_location", 100).notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
}

export function down(knex) {
  return knex.schema.dropTableIfExists("buses");
}
