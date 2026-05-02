"use strict";

/** @type {import("sequelize-cli").Seeder} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    await queryInterface.bulkInsert("Artists", [
      {
        id: "b29cb043-2f74-47d3-a107-ab70cdef58f7",
        name: "Kasane Teto",
        bio: "Vocal synth artist.",
        imageUrl: "/storage/artists/teto.jpg",
        createdAt: yesterday,
        updatedAt: now
      },
      {
        id: "c1f3f68a-6e84-4d2b-8f4f-2a5d7f2f3c10",
        name: "MIMI",
        bio: "MIMI is a Japanese composer and producer with a focus on blending the synthetic voices of the VOCALOID lineup with intricate piano instrumentation across a myriad of genres and styles, including pop, piano rock and ballad.",
        imageUrl: "/storage/artists/mimi.jpg",
        createdAt: yesterday,
        updatedAt: now
      },
      {
        id: "d8b64fd2-9b6f-4f5d-b3ae-0a1e6d0a77a1",
        name: "Hatsune Miku",
        bio: "Vocal synth character and voicebank.",
        imageUrl: "/storage/artists/miku.jpg",
        createdAt: yesterday,
        updatedAt: now
      },
      {
        id: "e6f3e2a1-2a5a-4e7d-9d2e-6b3f1b9c21a0",
        name: "マサラダ",
        bio: "Vocal synth producer.",
        imageUrl: "/storage/artists/masarada.jpg",
        createdAt: yesterday,
        updatedAt: now
      },
      {
      id: "f1a2b3c4-6d7e-4f8a-9b0c-1d2e3f4a5b6c",
      name: "32ki",
      bio: "Vocal synth producer.",
      imageUrl: "/storage/artists/32ki.jpg",
      createdAt: yesterday,
      updatedAt: now
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Artists", null, {});
  }
};