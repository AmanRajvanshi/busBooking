// migrations/20250101000000_create_bookings_table.js
export function up(knex) {
  return knex.schema.createTable("bookings", (table) => {
    table.increments("id").primary();
    table
      .integer("user_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");

    table
      .integer("bus_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("buses")
      .onDelete("CASCADE");

    table.integer("seats_booked").unsigned().notNullable().defaultTo(1);
    table.date("travel_date").notNullable();
    table.string("status").notNullable().defaultTo("confirmed");
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
}

export function down(knex) {
  return knex.schema.dropTableIfExists("bookings");
}
