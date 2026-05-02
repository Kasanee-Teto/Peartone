"use strict";

/** @type {import("sequelize-cli").Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("TrackArtists", {
      trackId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "Tracks", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        primaryKey: true
      },
      artistId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "Artists", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
        primaryKey: true
      },
      artistOrder: { 
        type: Sequelize.INTEGER, 
        allowNull: false, 
        defaultValue: 1
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
      },
      role: {
        type: Sequelize.ENUM("primary", "featured", "producer", "writer"),
        allowNull: false,
        defaultValue: "primary"
      },
    });


    await queryInterface.addConstraint("TrackArtists", {
      fields: ["trackId", "artistId"],
      type: "unique",
      name: "unique_track_artist_pairing"
    });

    await queryInterface.addIndex("TrackArtists", ["artistId"]);

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("TrackArtists");
    if (queryInterface.sequelize.getDialect() === "postgres") {
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_TrackArtists_role";');
    }
  }
};