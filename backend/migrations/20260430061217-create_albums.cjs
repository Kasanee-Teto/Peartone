'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Albums", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        allowNull: false,
        primaryKey: true
      },
      artistId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Artists",
          key: "id"
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },
      coverUrl: {
        type: Sequelize.STRING,
        allowNull: true
      },
      releaseDate: {
        type: Sequelize.DATEONLY,
        allowNull: true
      },
      trackNumbers: {
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
      }
    });

    await queryInterface.addIndex("Albums", ["artistId"], { name: "idx_albums_artist_id" });
    await queryInterface.sequelize.query(
      `CREATE INDEX IF NOT EXISTS idx_albums_title_trgm ON "Albums" USING gin (title gin_trgm_ops);`
    );
  
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("Albums");
  }
};
