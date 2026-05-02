'use strict';

const bcrypt = require("bcryptjs");
const { randomUUID } = require("crypto");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    const passwordHash = await bcrypt.hash("Admin12345!", 10);

        await queryInterface.bulkInsert("Users", [
          {
            id: randomUUID(),
            email: "denver@admin.local",
            username: "denver21",
            passwordHash,
            role: "admin",
            location: "Jakarta, Indonesia",
            createdAt: yesterday,
            updatedAt: now
          },
          {
            id: randomUUID(),
            email: "yolklore@admin.local",
            username: "egg21yolk",
            passwordHash,
            role: "admin",
            location: "Surabaya, Indonesia",
            createdAt: yesterday,
            updatedAt: now
          },
          {
            id: randomUUID(),
            email: "blueprince@admin.local",
            username: "princeBlue234",
            passwordHash,
            role: "admin",
            location: "Beijing, China",
            createdAt: yesterday,
            updatedAt: now
          },
          {
            id: randomUUID(),
            email: "blackthorn@admin.local",
            username: "thornHeart33",
            passwordHash,
            role: "admin",
            location: "Kolkata, India",
            createdAt: yesterday,
            updatedAt: now
          },
          {
            id: randomUUID(),
            email: "foreigngov@admin.local",
            username: "foreign2gov",
            passwordHash,
            role: "admin",
            location: "Erithrea, South Africa",
            createdAt: yesterday,
            updatedAt: now
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
