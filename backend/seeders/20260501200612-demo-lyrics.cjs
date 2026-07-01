
    "use strict";
    /** @type {import("sequelize-cli").Seeder} */
        module.exports = {
        async up(queryInterface, Sequelize) {
              const now = new Date();
              const yesterday = new Date(now);
              yesterday.setDate(now.getDate() - 1);

              const entries = [];

              await queryInterface.bulkInsert(
              "Lyrics",
              entries.map((entry) => ({
                  ...entry,
                  createdAt: yesterday,
                  updatedAt: now,
              })),
              {}
              );
          },

          async down(queryInterface, Sequelize) {
              await queryInterface.bulkDelete("Lyrics", null, {});
          },
        };
    