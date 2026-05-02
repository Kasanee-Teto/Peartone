'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const dialect = queryInterface.sequelize.getDialect();
    await queryInterface.createTable("Artists", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      bio: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      imageUrl: {
        type: Sequelize.STRING,
        allowNull: true
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

    if (dialect === "postgres") {
      await queryInterface.sequelize.query(
        `CREATE INDEX IF NOT EXISTS idx_artists_name_trgm ON "Artists" USING gin (name gin_trgm_ops);`
      );
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("Artists");
  }
};
