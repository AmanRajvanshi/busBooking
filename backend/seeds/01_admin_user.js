import bcrypt from "bcryptjs";

export async function seed(knex) {
  await knex("users").del();

  const hash = await bcrypt.hash("admin123", 10);

  await knex("users").insert([
    {
      name: "Admin",
      email: "admin@busbooking.com",
      password_hash: hash,
      role: "admin",
      phone: "9999999999",
    },
  ]);
}
