'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const dialect = queryInterface.sequelize.getDialect();
    await queryInterface.createTable("Tracks", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      genre: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "unknown" 
      },
      duration: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      audioUrl: { 
        type: Sequelize.STRING, 
        allowNull: false 
      },
      audioPath: { 
        type: Sequelize.STRING, 
        allowNull: false 
      },
      mimeType: { 
        type: Sequelize.STRING, 
        allowNull: false,
        defaultValue: "audio/mpeg" 
      },
      fileSize: { 
        type: Sequelize.BIGINT, 
        allowNull: false, 
        defaultValue: 0 
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
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      isPublished: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      uploadedBy: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: "Users", key: "id" },
        onDelete: "SET NULL",
        onUpdate: "CASCADE"
      },
      listeners: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      }
    });

    await queryInterface.addIndex("Tracks", ["albumId"], { name: "idx_tracks_album_id" });
    if (dialect === "postgres") {
      await queryInterface.sequelize.query(
        `CREATE INDEX IF NOT EXISTS idx_tracks_title_trgm ON "Tracks" USING gin (title gin_trgm_ops);`
      );
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("Tracks");
  }
};
