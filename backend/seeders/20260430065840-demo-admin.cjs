'use strict';

const bcrypt = require("bcryptjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const passwordHash = await bcrypt.hash("Admin12345!", 10);

        await queryInterface.bulkInsert("Users", [
          {
            id: Sequelize.literal("gen_random_uuid()"),
            email: "denver@admin.local",
            username: "denver21",
            passwordHash,
            role: "admin",
            location: "Jakarta, Indonesia",
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: Sequelize.literal("gen_random_uuid()"),
            email: "yolklore@admin.local",
            username: "egg21yolk",
            passwordHash,
            role: "admin",
            location: "Surabaya, Indonesia",
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: Sequelize.literal("gen_random_uuid()"),
            email: "blueprince@admin.local",
            username: "princeBlue234",
            passwordHash,
            role: "admin",
            location: "Beijing, China",
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: Sequelize.literal("gen_random_uuid()"),
            email: "blackthorn@admin.local",
            username: "thornHeart33",
            passwordHash,
            role: "admin",
            location: "Kolkata, India",
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: Sequelize.literal("gen_random_uuid()"),
            email: "foreigngov@admin.local",
            username: "foreign2gov",
            passwordHash,
            role: "admin",
            location: "Erithrea, South Africa",
            createdAt: new Date(),
            updatedAt: new Date()
          }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      "Users",
      {
        email: {
          [Sequelize.Op.like]: "%@admin.local",
        },
      },
      {}
    );
  },
};
