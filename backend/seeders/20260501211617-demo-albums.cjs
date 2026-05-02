"use strict";

/** @type {import("sequelize-cli").Seeder} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    await queryInterface.bulkInsert(
      "Albums",
      [
        {
          id: "b29cb043-2f74-47d3-a107-ab70cdef58f7", 
          artistId: "b29cb043-2f74-47d3-a107-ab70cdef58f7",
          title: "Kasane Teto - Collection",
          description: "Album of Kasane Teto.",
          coverUrl: "/storage/albums/teto.png",
          releaseDate: "2024-01-01",
          trackNumbers: 5,
          createdAt: yesterday,
          updatedAt: now,
        },
        {
          id: "c1f3f68a-6e84-4d2b-8f4f-2a5d7f2f3c10", 
          artistId: "c1f3f68a-6e84-4d2b-8f4f-2a5d7f2f3c10",
          title: "MIMI - Collection",
          description: "Album of MIMI.",
          coverUrl: "/storage/albums/mimi.webp",
          releaseDate: "2023-06-10",
          trackNumbers: 8,
          createdAt: yesterday,
          updatedAt: now,
        },
        {
          id: "d8b64fd2-9b6f-4f5d-b3ae-0a1e6d0a77a1", 
          artistId: "d8b64fd2-9b6f-4f5d-b3ae-0a1e6d0a77a1",
          title: "Hatsune Miku - Collection",
          description: "Album of Hatsune Miku.",
          coverUrl: "/storage/albums/miku.jpg",
          releaseDate: "2022-12-01",
          trackNumbers: 6,
          createdAt: yesterday,
          updatedAt: now,
        },
        {
          id: "e6f3e2a1-2a5a-4e7d-9d2e-6b3f1b9c21a0", 
          artistId: "e6f3e2a1-2a5a-4e7d-9d2e-6b3f1b9c21a0",
          title: "マサラダ - Collection",
          description: "Album of マサラダ.",
          coverUrl: "/storage/albums/masarada.jpg",
          releaseDate: "2024-03-15",
          trackNumbers: 4,
          createdAt: yesterday,
          updatedAt: now,
        },
        {
          id: "f1a2b3c4-6d7e-4f8a-9b0c-1d2e3f4a5b6c", 
          artistId: "f1a2b3c4-6d7e-4f8a-9b0c-1d2e3f4a5b6c",
          title: "32ki - Collection",
          description: "Album of 32ki.",
          coverUrl: "/storage/albums/32ki.jpg",
          releaseDate: "2021-09-20",
          trackNumbers: 7,
          createdAt: yesterday,
          updatedAt: now,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Albums", null, {});
  }
};