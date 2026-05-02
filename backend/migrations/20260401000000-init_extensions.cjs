"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    if (queryInterface.sequelize.getDialect() !== "postgres") {
      return;
    }
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "pgcrypto";');
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "pg_trgm";');
  },

  async down(queryInterface) {
    if (queryInterface.sequelize.getDialect() !== "postgres") {
      return;
    }
    await queryInterface.sequelize.query('DROP EXTENSION IF EXISTS "pg_trgm";');
    await queryInterface.sequelize.query('DROP EXTENSION IF EXISTS "pgcrypto";');
  },
};