"use strict";

const bcrypt = require("bcryptjs");
const { randomUUID } = require("crypto");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    const userHash = await bcrypt.hash("User12345!", 10);

    const users = [
      { 
        id: randomUUID(),
        username: "jessica29", 
        email: "jessicagunawan650@gmail.com", 
        passwordHash: userHash, 
        role: "user", 
        location: "Medan, Indonesia", 
        createdAt: yesterday, 
        updatedAt: now 
      },
      { 
        id: randomUUID(),
        username: "leon2s2kennedy", 
        email: "kennedyfam@gmail.com", 
        passwordHash: userHash, 
        role: "user", 
        location: "New York, USA", 
        createdAt: yesterday, 
        updatedAt: now 
      },
      { 
        id: randomUUID(),
        username: "johan1liebert2", 
        email: "johan22@gmail.com", 
        passwordHash: userHash, 
        role: "user", 
        location: "Berlin, Germany", 
        createdAt: yesterday, 
        updatedAt: now 
      },
      { 
        id: randomUUID(),
        username: "marie12antoniette", 
        email: "frenchrepublic23@gmail.com", 
        passwordHash: userHash, 
        role: "user", 
        location: "Paris, France", 
        createdAt: yesterday, 
        updatedAt: now 
      },
      { 
        id: randomUUID(),
        username: "budiOetomo12", 
        email: "buddi920@gmail.com", 
        passwordHash: userHash, 
        role: "user", 
        location: "Bandung, Indonesia", 
        createdAt: yesterday, 
        updatedAt: now 
      },
      { 
        id: randomUUID(),
        username: "victoria23sinclair", 
        email: "vict212@gmail.com", 
        passwordHash: userHash, 
        role: "user", 
        location: "New Delhi, India", 
        createdAt: yesterday, 
        updatedAt: now 
      },
      { 
        id: randomUUID(),
        username: "purpleHyacinth101", 
        email: "hyacinth456@gmail.com", 
        passwordHash: userHash, 
        role: "user", 
        location: "London, UK", 
        createdAt: yesterday, 
        updatedAt: now 
      },
      { 
        id: randomUUID(),
        username: "chrisRedblood234", 
        email: "bloodyhand234@gmail.com", 
        passwordHash: userHash, 
        role: "user", 
        location: "Racoon City, USA", 
        createdAt: yesterday, 
        updatedAt: now 
      },
      { 
        id: randomUUID(),
        username: "GangnamStyle23", 
        email: "richgangnam234@gmail.com", 
        passwordHash: userHash, 
        role: "user", 
        location: "Gangnam, South Korea", 
        createdAt: yesterday, 
        updatedAt: now 
      },
      { 
        id: randomUUID(),
        username: "white2swan", 
        email: "kieran234@gmail.com", 
        passwordHash: userHash, 
        role: "user", 
        location: "Chengdu, China", 
        createdAt: yesterday, 
        updatedAt: now 
      }
    ];

    await queryInterface.bulkInsert("Users", users, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(
      "Users",
      {
        email: {
          [Sequelize.Op.like]: "%@gmail.com",
        },
      },
      {}
    );
  },
};