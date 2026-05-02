"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("History", {
      id: { 
        type: Sequelize.BIGINT,
        autoIncrement: true, 
        primaryKey: true, 
        allowNull: false 
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: "Users", key: "id" },
        onDelete: "SET NULL",
        onUpdate: "CASCADE"
      },
      trackId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: "Tracks", key: "id" },
        onDelete: "SET NULL",
        onUpdate: "CASCADE"
      },
      playedAt: { 
        type: Sequelize.DATE, 
        allowNull: false, 
        defaultValue: Sequelize.NOW 
      },
      msPlayed: { 
        type: Sequelize.INTEGER, 
        allowNull: true 
      }
    });

    await queryInterface.addIndex("History", ["userId", "playedAt"], {
      name: "idx_play_history_user_time"
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("History");
  }
};