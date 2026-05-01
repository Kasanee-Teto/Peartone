"use strict";

/** @type {import("sequelize-cli").Seeder} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Tracks", [
      {
        id: "e2cf4d12-0b65-4f1c-9df9-84d6c1f1c932",
        title: "Science (feat. KASANE TETO)",
        duration: 183,
        audioUrl: "/storage/audio/Science (feat. KASANE TETO).mp3",
        audioPath: "/storage/audio/Science (feat. KASANE TETO).mp3",
        mimeType: "audio/mpeg",
        fileSize: 0,
        coverUrl: "/storage/covers/Science (feat. KASANE TETO).jpg",
        albumId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "0f4f6a6b-0bd3-4c9f-9b55-1d5ed4e2a111",
        title: "Encore Dance (feat. KASANE TETO)",
        duration: 135,
        audioUrl: "/storage/audio/Encore Dance (feat. KASANE TETO).mp3",
        audioPath: "/storage/audio/Encore Dance (feat. KASANE TETO).mp3",
        mimeType: "audio/mpeg",
        fileSize: 0,
        coverUrl: "/storage/covers/Encore Dance (feat. KASANE TETO).jpg",
        albumId: null,
        createdAt: new Date(),
        updatedAt: new Date() 
      },
      {
        id: "1c2b0e6e-7e1a-4ad9-9d43-77d54fb1b222",
        title: "Magic Maid (feat. KASANE TETO)",
        duration: 159,
        audioUrl: "/storage/audio/Magic Maid (feat. KASANE TETO).mp3",
        audioPath: "/storage/audio/Magic Maid (feat. KASANE TETO).mp3",
        mimeType: "audio/mpeg",
        fileSize: 0,
        coverUrl: "/storage/covers/Magic Maid (feat. KASANE TETO).jpg",
        albumId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "2d9fb1b3-3c15-4f6b-90a2-1a1c9d7a3333",
        title: "Pyon (feat. HATSUNE MIKU & KASANE TETO)",
        duration: 176,
        audioUrl: "/storage/audio/Pyon (feat. HATSUNE MIKU & KASANE TETO).mp3",
        audioPath: "/storage/audio/Pyon (feat. HATSUNE MIKU & KASANE TETO).mp3",
        mimeType: "audio/mpeg",
        fileSize: 0,
        coverUrl: "/storage/covers/Pyon (feat. HATSUNE MIKU).jpg",
        albumId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "3a3d5df7-3aef-43b1-9a28-3bda4c444444",
        title: "TRICK HEART (feat. KASANE TETO)",
        duration: 157,
        audioUrl: "/storage/audio/TRICK HEART (feat. KASANE TETO).mp3",
        audioPath: "/storage/audio/TRICK HEART (feat. KASANE TETO).mp3",
        mimeType: "audio/mpeg",
        fileSize: 0,
        coverUrl: "/storage/covers/TRICK HEART (feat. KASANE TETO).jpg",
        albumId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // マサラダ tracks
      {
        id: "4b02dca2-5b2d-4d3f-8b73-0f5b1a2f1c01",
        title: "Liar Dancer",
        duration: 242,
        audioUrl: "/storage/audio/Liar Dancer.mp3",
        audioPath: "/storage/audio/Liar Dancer.mp3",
        mimeType: "audio/mpeg",
        fileSize: 0,
        coverUrl: "/storage/covers/Liar Dancer.jpg",
        albumId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "5c13edb3-6c3e-4c4f-9c84-1a6c2b3f2d02",
        title: "●utlaws",
        duration: 210,
        audioUrl: "/storage/audio/●utlaws.mp3",
        audioPath: "/storage/audio/●utlaws.mp3",
        mimeType: "audio/mpeg",
        fileSize: 0,
        coverUrl: "/storage/covers/●utlaws.jpg",
        albumId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "6d24fea4-7d4f-4d5f-8d95-2b7d3c4f3e03",
        title: "Tiny Me",
        duration: 229,
        audioUrl: "/storage/audio/Tiny Me.mp3",
        audioPath: "/storage/audio/Tiny Me.mp3",
        mimeType: "audio/mpeg",
        fileSize: 0,
        coverUrl: "/storage/covers/Tiny Me.jpg",
        albumId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "7e350fb5-8e50-4e6f-9ea6-3c8e4d5f4f04",
        title: "Ultra Trailer",
        duration: 273,
        audioUrl: "/storage/audio/Ultra Trailer.mp3",
        audioPath: "/storage/audio/Ultra Trailer.mp3",
        mimeType: "audio/mpeg",
        fileSize: 0,
        coverUrl: "/storage/covers/Ultra Trailer.jpg",
        albumId: null,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "aa1b2c3d-4e5f-6789-a012-3456789abcde",
        title: "メズマライザー (feat. 初音ミク&重音テト)",
        duration: 156,
        audioUrl: "/storage/audio/メズマライザー (feat. 初音ミク&重音テト).mp3",
        audioPath: "/storage/audio/メズマライザー (feat. 初音ミク&重音テト).mp3",
        mimeType: "audio/mpeg",
        fileSize: 0,
        coverUrl: "/storage/covers/メズマライザー (feat. 初音ミク&重音テト).jpg",
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