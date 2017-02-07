// Update with your config settings.

module.exports = {

  development: {
    "client": "mysql2",
    "connection": {
      "host": "localhost",
      "user": "quest",
      "password": "",
      "database": "quest"
    }
  },

  staging: {
    "client": "mysql2",
    "connection": {
      "host": "localhost",
      "user": "quest",
      "password": "",
      "database": "quest"
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    "client": "mysql2",
    "connection": {
      "host": "localhost",
      "user": "quest",
      "password": "",
      "database": "quest"
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};
