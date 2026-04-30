"use strict";

/** @type {import("sequelize-cli").Seeder} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Tracks", [
      {
        id: "e2cf4d12-0b65-4f1c-9df9-84d6c1f1c932",
        title: "Science (feat. KASANE TETO)",
        duration: 210,
        audioUrl: "/storage/audio/Science (feat. KASANE TETO).mp3",
        coverUrl: "/storage/covers/Science (feat. KASANE TETO).jpg",
        albumId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Tracks", null, {});
  }
};