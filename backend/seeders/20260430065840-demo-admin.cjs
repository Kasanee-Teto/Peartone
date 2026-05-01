'use strict';

const bcrypt = require("bcryptjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const passwordHash = await bcrypt.hash("Admin123!", 10);

        await queryInterface.bulkInsert("Users", [
          {
            id: Sequelize.literal("gen_random_uuid()"),
            email: "admin@peartone.local",
            username: "peartone21",
            passwordHash,
            role: "admin",
            location: "Jakarta, Indonesia",
            createdAt: new Date(),
            updatedAt: new Date()
          }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", { email: "admin@peartone.local", username: "peartone21" });
  }
};
