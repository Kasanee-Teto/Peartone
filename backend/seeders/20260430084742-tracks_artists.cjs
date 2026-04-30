"use strict";

/** @type {import("sequelize-cli").Seeder} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("TrackArtists", [
      {
        id: "3ef0d2f5-2f9e-4f2e-9dc0-fd6f6a1e5a33",
        trackId: "e2cf4d12-0b65-4f1c-9df9-84d6c1f1c932",
        artistId: "b29cb043-2f74-47d3-a107-ab70cdef58f7",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "7b6a9c41-6c2e-4aa2-a4aa-9d6e21b4e9d2",
        trackId: "e2cf4d12-0b65-4f1c-9df9-84d6c1f1c932",
        artistId: "c1f3f68a-6e84-4d2b-8f4f-2a5d7f2f3c10",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("TrackArtists", null, {});
  }
};