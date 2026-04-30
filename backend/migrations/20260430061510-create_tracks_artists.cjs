"use strict";

/** @type {import("sequelize-cli").Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("TrackArtists", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        allowNull: false,
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
        defaultValue: Sequelize.literal("NOW()")
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("NOW()")
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
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_TrackArtists_role";');
  }
};