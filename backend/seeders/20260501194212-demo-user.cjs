"use strict";

const bcrypt = require("bcryptjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    const userHash = await bcrypt.hash("User12345!", 10);

    const users = [
      { 
        username: "jessica29", 
        email: "jessicagunawan650@gmail.com", 
        passwordHash: userHash, 
        role: "user", 
        location: "Medan, Indonesia", 
        createdAt: now, 
        updatedAt: now 
      },
      { 
        username: "leon2s2kennedy", 
        email: "kennedyfam@gmail.com", 
        passwordHash: userHash, 
        role: "user", 
        location: "New York, USA", 
        createdAt: now, 
        updatedAt: now 
      },
      { 
        username: "johan1liebert2", 
        email: "johan22@gmail.com", 
        passwordHash: userHash, 
        role: "user", 
        location: "Berlin, Germany", 
        createdAt: now, 
        updatedAt: now 
      },
      { 
        username: "marie12antoniette", 
        email: "frenchrepublic23@gmail.com", 
        passwordHash: userHash, 
        role: "user", 
        location: "Paris, France", 
        createdAt: now, 
        updatedAt: now 
      },
      { 
        username: "budiOetomo12", 
        email: "buddi920@gmail.com", 
        passwordHash: userHash, 
        role: "user", 
        location: "Bandung, Indonesia", 
        createdAt: now, 
        updatedAt: now 
      },
      { 
        username: "victoria23sinclair", 
        email: "vict212@gmail.com", 
        passwordHash: userHash, 
        role: "user", 
        location: "New Delhi, India", 
        createdAt: now, 
        updatedAt: now 
      },
      { 
        username: "purpleHyacinth101", 
        email: "hyacinth456@gmail.com", 
        passwordHash: userHash, 
        role: "user", 
        location: "London, UK", 
        createdAt: now, 
        updatedAt: now 
      },
      { 
        username: "chrisRedblood234", 
        email: "bloodyhand234@gmail.com", 
        passwordHash: userHash, 
        role: "user", 
        location: "Racoon City, USA", 
        createdAt: now, 
        updatedAt: now 
      },
      { 
        username: "GangnamStyle23", 
        email: "richgangnam234@gmail.com", 
        passwordHash: userHash, 
        role: "user", 
        location: "Gangnam, South Korea", 
        createdAt: now, 
        updatedAt: now 
      },
      { 
        username: "white2swan", 
        email: "kieran234@gmail.com", 
        passwordHash: userHash, 
        role: "user", 
        location: "Chengdu, China", 
        createdAt: now, 
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