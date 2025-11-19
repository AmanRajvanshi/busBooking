// knexfile.js
export default {
  development: {
    client: 'mysql2',
    connection: {
      host: '127.0.0.1',      // or your MySQL host
      port: 3306,             // default MySQL port
      user: 'root',           // your MySQL username
      password: '', // your MySQL password
      database: 'busbooking', // 🔴 IMPORTANT: this must be set!
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations',
    },
    seeds: {
      directory: './seeds',
    },
  },
};
