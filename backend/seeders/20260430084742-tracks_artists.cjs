"use strict";

/** @type {import("sequelize-cli").Seeder} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("TrackArtists", [
      // Science (MIMI primary, TETO featured)
      {
        trackId: "e2cf4d12-0b65-4f1c-9df9-84d6c1f1c932",
        artistId: "c1f3f68a-6e84-4d2b-8f4f-2a5d7f2f3c10",
        artistOrder: 1,
        role: "primary",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        trackId: "e2cf4d12-0b65-4f1c-9df9-84d6c1f1c932",
        artistId: "b29cb043-2f74-47d3-a107-ab70cdef58f7",
        artistOrder: 2,
        role: "featured",
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Encore Dance
      {
        trackId: "0f4f6a6b-0bd3-4c9f-9b55-1d5ed4e2a111",
        artistId: "c1f3f68a-6e84-4d2b-8f4f-2a5d7f2f3c10",
        artistOrder: 1,
        role: "primary",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        trackId: "0f4f6a6b-0bd3-4c9f-9b55-1d5ed4e2a111",
        artistId: "b29cb043-2f74-47d3-a107-ab70cdef58f7",
        artistOrder: 2,
        role: "featured",
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Magic Maid
      {
        trackId: "1c2b0e6e-7e1a-4ad9-9d43-77d54fb1b222",
        artistId: "c1f3f68a-6e84-4d2b-8f4f-2a5d7f2f3c10",
        artistOrder: 1,
        role: "primary",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        trackId: "1c2b0e6e-7e1a-4ad9-9d43-77d54fb1b222",
        artistId: "b29cb043-2f74-47d3-a107-ab70cdef58f7",
        artistOrder: 2,
        role: "featured",
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Pyon (MIMI primary, Miku + Teto featured)
      {
        trackId: "2d9fb1b3-3c15-4f6b-90a2-1a1c9d7a3333",
        artistId: "c1f3f68a-6e84-4d2b-8f4f-2a5d7f2f3c10",
        artistOrder: 1,
        role: "primary",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        trackId: "2d9fb1b3-3c15-4f6b-90a2-1a1c9d7a3333",
        artistId: "d8b64fd2-9b6f-4f5d-b3ae-0a1e6d0a77a1",
        artistOrder: 2,
        role: "featured",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        trackId: "2d9fb1b3-3c15-4f6b-90a2-1a1c9d7a3333",
        artistId: "b29cb043-2f74-47d3-a107-ab70cdef58f7",
        artistOrder: 3,
        role: "featured",
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // TRICK HEART
      {
        trackId: "3a3d5df7-3aef-43b1-9a28-3bda4c444444",
        artistId: "c1f3f68a-6e84-4d2b-8f4f-2a5d7f2f3c10",
        artistOrder: 1,
        role: "primary",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        trackId: "3a3d5df7-3aef-43b1-9a28-3bda4c444444",
        artistId: "b29cb043-2f74-47d3-a107-ab70cdef58f7",
        artistOrder: 2,
        role: "featured",
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // マサラダ tracks (primary)
      {
        trackId: "4b02dca2-5b2d-4d3f-8b73-0f5b1a2f1c01",
        artistId: "e6f3e2a1-2a5a-4e7d-9d2e-6b3f1b9c21a0",
        artistOrder: 1,
        role: "primary",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        trackId: "5c13edb3-6c3e-4c4f-9c84-1a6c2b3f2d02",
        artistId: "e6f3e2a1-2a5a-4e7d-9d2e-6b3f1b9c21a0",
        artistOrder: 1,
        role: "primary",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        trackId: "6d24fea4-7d4f-4d5f-8d95-2b7d3c4f3e03",
        artistId: "e6f3e2a1-2a5a-4e7d-9d2e-6b3f1b9c21a0",
        artistOrder: 1,
        role: "primary",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        trackId: "7e350fb5-8e50-4e6f-9ea6-3c8e4d5f4f04",
        artistId: "e6f3e2a1-2a5a-4e7d-9d2e-6b3f1b9c21a0",
        artistOrder: 1,
        role: "primary",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("TrackArtists", null, {});
  }
};