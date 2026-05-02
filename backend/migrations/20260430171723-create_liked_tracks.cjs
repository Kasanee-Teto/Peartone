"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("LikedTracks", {
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "Users", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        primaryKey: true
      },
      trackId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "Tracks", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        primaryKey: true
      },
      createdAt: { 
        type: Sequelize.DATE, 
        allowNull: false, 
        defaultValue: Sequelize.NOW
      },
      updatedAt: { 
        type: Sequelize.DATE, 
        allowNull: false, 
        defaultValue: Sequelize.NOW
      }
    });

    await queryInterface.addIndex("LikedTracks", ["userId"], { name: "idx_liked_tracks_user_id" });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("LikedTracks");
  }
};