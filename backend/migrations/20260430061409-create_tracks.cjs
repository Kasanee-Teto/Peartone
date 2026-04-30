'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable("Tracks", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        allowNull: false,
        primaryKey: true
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      duration: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      audioUrl: {
        type: Sequelize.STRING,
        allowNull: false
      },
      coverUrl: {
        type: Sequelize.STRING,
        allowNull: true
      },
      albumId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: "Albums", key: "id" },
        onDelete: "SET NULL",
        onUpdate: "CASCADE"
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("NOW()")
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("NOW()")
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("Tracks");
  }
};
