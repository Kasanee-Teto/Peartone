"use strict";

/** @type {import("sequelize-cli").Seeder} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    await queryInterface.bulkInsert("Tracks", [
      {
        id: "e2cf4d12-0b65-4f1c-9df9-84d6c1f1c932",
        title: "Science (feat. KASANE TETO)",
        duration: 183,
        genre: "Anime",
        audioUrl: "/storage/audio/Science_(feat._KASANE_TETO).mp3",
        audioPath: "storage/audio/Science_(feat._KASANE_TETO).mp3",
        mimeType: "audio/mpeg",
        albumId: "b29cb043-2f74-47d3-a107-ab70cdef58f7",
        fileSize: 5545055,
        coverUrl: "/storage/covers/Science_(feat._KASANE_TETO).jpg",
        albumId: null,
        createdAt: yesterday,
        updatedAt: now,
        listeners: 3000000
      },
      {
        id: "0f4f6a6b-0bd3-4c9f-9b55-1d5ed4e2a111",
        title: "Encore Dance (feat. KASANE TETO)",
        duration: 135,
        genre: "Anime",
        audioUrl: "/storage/audio/Encore_Dance_(feat._KASANE_TETO).mp3",
        audioPath: "storage/audio/Encore_Dance_(feat._KASANE_TETO).mp3",
        mimeType: "audio/mpeg",
        albumId: "b29cb043-2f74-47d3-a107-ab70cdef58f7",
        fileSize: 4198400,
        coverUrl: "/storage/covers/Encore_Dance_(feat._KASANE_TETO).jpg",
        albumId: null,
        createdAt: yesterday,
        updatedAt: now,
        listeners: 1800000
      },
      {
        id: "1c2b0e6e-7e1a-4ad9-9d43-77d54fb1b222",
        title: "Magic Maid (feat. KASANE TETO)",
        duration: 159,
        genre: "Anime",
        audioUrl: "/storage/audio/Magic_Maid_(feat._KASANE_TETO).mp3",
        audioPath: "storage/audio/Magic_Maid_(feat._KASANE_TETO).mp3",
        albumId: "b29cb043-2f74-47d3-a107-ab70cdef58f7",
        mimeType: "audio/mpeg",
        fileSize: 4198331,
        coverUrl: "/storage/covers/Magic_Maid_(feat._KASANE_TETO).jpg",
        albumId: null,
        createdAt: yesterday,
        updatedAt: now,
        listeners: 1500000
      },
      {
        id: "2d9fb1b3-3c15-4f6b-90a2-1a1c9d7a3333",
        title: "Pyon (feat. HATSUNE MIKU & KASANE TETO)",
        duration: 176,
        genre: "Anime",
        audioUrl: "/storage/audio/Pyon_(feat._HATSUNE_MIKU_&_KASANE_TETO).mp3",
        audioPath: "storage/audio/Pyon_(feat._HATSUNE_MIKU_&_KASANE_TETO).mp3",
        albumId: "d8b64fd2-9b6f-4f5d-b3ae-0a1e6d0a77a1",
        mimeType: "audio/mpeg",
        fileSize: 2819484,
        coverUrl: "/storage/covers/Pyon_(feat._HATSUNE_MIKU).jpg",
        albumId: null,
        createdAt: yesterday,
        updatedAt: now,
        listeners: 2200000
      },
      {
        id: "3a3d5df7-3aef-43b1-9a28-3bda4c444444",
        title: "TRICK HEART (feat. KASANE TETO)",
        duration: 157,
        genre: "Anime",
        audioUrl: "/storage/audio/TRICK_HEART_(feat._KASANE_TETO).mp3",
        audioPath: "storage/audio/TRICK_HEART_(feat._KASANE_TETO).mp3",
        albumId: "b29cb043-2f74-47d3-a107-ab70cdef58f7",
        mimeType: "audio/mpeg",
        fileSize: 4546560 ,
        coverUrl: "/storage/covers/TRICK_HEART_(feat._KASANE_TETO).jpg",
        albumId: null,
        createdAt: yesterday,
        updatedAt: now,
        listeners: 520000
      },

      // マサラダ tracks
      {
        id: "4b02dca2-5b2d-4d3f-8b73-0f5b1a2f1c01",
        title: "Liar Dancer",
        duration: 242,
        genre: "J-Pop",
        audioUrl: "/storage/audio/Liar_Dancer.mp3",
        audioPath: "storage/audio/Liar_Dancer.mp3",
        albumId: "e6f3e2a1-2a5a-4e7d-9d2e-6b3f1b9c21a0",
        mimeType: "audio/mpeg",
        fileSize: 7355450 ,
        coverUrl: "/storage/covers/Liar_Dancer.jpg",
        albumId: null,
        createdAt: yesterday,
        updatedAt: now,
        listeners: 24000000
      },
      {
        id: "5c13edb3-6c3e-4c4f-9c84-1a6c2b3f2d02",
        title: "●utlaws",
        duration: 210,
        genre: "J-Pop",
        audioUrl: "/storage/audio/●utlaws.mp3",
        audioPath: "storage/audio/●utlaws.mp3",
        albumId: "e6f3e2a1-2a5a-4e7d-9d2e-6b3f1b9c21a0",
        mimeType: "audio/mpeg",
        fileSize: 6136937 ,
        coverUrl: "/storage/covers/●utlaws.jpg",
        albumId: null,
        createdAt: yesterday,
        updatedAt: now,
        listeners: 8700000
      },
      {
        id: "6d24fea4-7d4f-4d5f-8d95-2b7d3c4f3e03",
        title: "Tiny Me",
        duration: 229,
        genre: "J-Pop",
        audioUrl: "/storage/audio/Tiny_Me.mp3",
        audioPath: "storage/audio/Tiny_Me.mp3",
        albumId: "e6f3e2a1-2a5a-4e7d-9d2e-6b3f1b9c21a0",
        mimeType: "audio/mpeg",
        fileSize: 7004053 , 
        coverUrl: "/storage/covers/Tiny_Me.jpg",
        albumId: null,
        createdAt: yesterday,
        updatedAt: now,
        listeners: 3200000
      },
      {
        id: "7e350fb5-8e50-4e6f-9ea6-3c8e4d5f4f04",
        title: "Ultra Trailer",
        duration: 273,
        genre: "J-Pop",
        audioUrl: "/storage/audio/Ultra_Trailer.mp3",
        audioPath: "storage/audio/Ultra_Trailer.mp3",
        albumId: "e6f3e2a1-2a5a-4e7d-9d2e-6b3f1b9c21a0",
        mimeType: "audio/mpeg",
        fileSize: 8250092,
        coverUrl: "/storage/covers/Ultra_Trailer.jpg",
        albumId: null,
        createdAt: yesterday,
        updatedAt: now,
        listeners: 1900000
      },
      {
        id: "aa1b2c3d-4e5f-6789-a012-3456789abcde",
        title: "メズマライザー (feat. 初音ミク&重音テト)",
        duration: 156,
        genre: "Anime",
        audioUrl: "/storage/audio/メズマライザー_(feat._初音ミク&重音テト).mp3",
        audioPath: "storage/audio/メズマライザー_(feat._初音ミク&重音テト).mp3",
        albumId: "f1a2b3c4-6d7e-4f8a-9b0c-1d2e3f4a5b6c",
        mimeType: "audio/mpeg",
        fileSize: 4713765,
        coverUrl: "/storage/covers/メズマライザー_(feat._初音ミク&重音テト).jpg",
        albumId: null,
        createdAt: yesterday,
        updatedAt: now,
        listeners: 48000000
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Tracks", null, {});
  }
};