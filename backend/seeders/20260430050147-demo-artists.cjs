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
        name: "Yorushika",
        bio: "Yorushika (ヨルシカ) is a Japanese rock duo founded in 2017. The group is composed of N-buna, a Vocaloid producer, and Suis, a female vocalist.",
        imageUrl: "/storage/artists/yorushika.jpg",
        createdAt: yesterday,
        updatedAt: now
      },
      {
        id: "b9d1e2f3-a4c5-40b9-8e7d-6c5b4a3f2e1d",
        name: "MIMI",
        bio: "MIMI is a vocal synth producer with a focus on blending the synthetic voices of the VOCALOID lineup with intricate piano instrumentation across a myriad of genres and styles, including pop, piano rock and ballad.",
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
      },
      {
        id: "fe0e2083-43e2-4d44-a05e-445dc880ef52",
        name: "Yoasobi",
        bio: "Yoasobi is a Japanese musical duo formed in 2019. It consists of songwriter and producer Ayase and vocalist Ikura.",
        imageUrl: "/storage/artists/yoasobi.jpg",
        createdAt: yesterday,
        updatedAt: now
      },
      {
        id: "3cf8e44e-9751-4aad-b055-6334b4bde54a",
        name: "Ayase",
        bio: "Ayase is a Japanese musician, singer, songwriter, and record producer. He is best known as a vocaloid producer and songwriter for Yoasobi, a musical duo composed of himself and vocalist Ikura. He was also a vocalist of the rock band Davinci until its disbandment in 2020.",
        imageUrl: "/storage/artists/ayase.jpg",
        createdAt: yesterday,
        updatedAt: now
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Artists", null, {});
  }
};