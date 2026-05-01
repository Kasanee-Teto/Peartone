"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Lyrics", {
      trackId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "Tracks", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        primaryKey: true
      },
      language: { 
        type: Sequelize.STRING, 
        allowNull: false, 
        defaultValue: "id" 
      },
      text: { 
        type: Sequelize.TEXT, 
        allowNull: false 
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

  async down(queryInterface) {
    await queryInterface.dropTable("Lyrics");
  }
};