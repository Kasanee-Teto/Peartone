"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("PlaylistTracks", {
      playlistId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "Playlists", key: "id" },
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
      added_by: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: "Users", key: "id" },
        onDelete: "SET NULL",
        onUpdate: "CASCADE"
      },
      added_at: { 
        type: Sequelize.DATE, 
        allowNull: false, 
        defaultValue: Sequelize.literal("NOW()") 
      }
    });

  },

  async down(queryInterface) {
    await queryInterface.dropTable("PlaylistTracks");
  }
};