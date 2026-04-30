"use strict";

/** @type {import("sequelize-cli").Seeder} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Artists", [
      {
        id: "b29cb043-2f74-47d3-a107-ab70cdef58f7",
        name: "KASANE TETO",
        bio: "Vocal synth artist.",
        imageUrl: "/storage/artists/teto.jpg",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "c1f3f68a-6e84-4d2b-8f4f-2a5d7f2f3c10",
        name: "MIMI",
        bio: "MIMI is a Japanese composer and producer with a focus on blending the synthetic voices of the VOCALOID lineup with intricate piano instrumentation across a myriad of genres and styles, including pop, piano rock and ballad.",
        imageUrl: "/storage/artists/mimi.webp",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Artists", null, {});
  }
};