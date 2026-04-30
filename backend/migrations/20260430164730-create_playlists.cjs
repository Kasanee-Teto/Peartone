"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Playlists", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        allowNull: false,
        primaryKey: true
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "Users", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE"
      },
      name: { 
        type: Sequelize.STRING, 
        allowNull: false 
      },
      description: { 
        type: Sequelize.STRING, 
        allowNull: true 
      },
      isPublic: { 
        type: Sequelize.BOOLEAN, 
        allowNull: false, 
        defaultValue: false 
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

    await queryInterface.addIndex("Playlists", ["userId"], { name: "idx_playlists_user_id" });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Playlists");
  }
};