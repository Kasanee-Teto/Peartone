"use strict";

/** @type {import("sequelize-cli").Seeder} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    await queryInterface.bulkInsert("TrackArtists", [
      // Science (MIMI primary, TETO featured)
      {
        trackId: "e2cf4d12-0b65-4f1c-9df9-84d6c1f1c932",
        artistId: "b9d1e2f3-a4c5-40b9-8e7d-6c5b4a3f2e1d",
        artistOrder: 1,
        role: "primary",
        createdAt: yesterday,
        updatedAt: now
      },
      {
        trackId: "e2cf4d12-0b65-4f1c-9df9-84d6c1f1c932",
        artistId: "b29cb043-2f74-47d3-a107-ab70cdef58f7",
        artistOrder: 2,
        role: "featured",
        createdAt: yesterday,
        updatedAt: now
      },

      // Encore Dance
      {
        trackId: "0f4f6a6b-0bd3-4c9f-9b55-1d5ed4e2a111",
        artistId: "b9d1e2f3-a4c5-40b9-8e7d-6c5b4a3f2e1d",
        artistOrder: 1,
        role: "primary",
        createdAt: yesterday,
        updatedAt: now
      },
      {
        trackId: "0f4f6a6b-0bd3-4c9f-9b55-1d5ed4e2a111",
        artistId: "b29cb043-2f74-47d3-a107-ab70cdef58f7",
        artistOrder: 2,
        role: "featured",
        createdAt: yesterday,
        updatedAt: now
      },
      // Magic Maid
      {
        trackId: "1c2b0e6e-7e1a-4ad9-9d43-77d54fb1b222",
        artistId: "b9d1e2f3-a4c5-40b9-8e7d-6c5b4a3f2e1d",
        artistOrder: 1,
        role: "primary",
        createdAt: yesterday,
        updatedAt: now
      },
      {
        trackId: "1c2b0e6e-7e1a-4ad9-9d43-77d54fb1b222",
        artistId: "b29cb043-2f74-47d3-a107-ab70cdef58f7",
        artistOrder: 2,
        role: "featured",
        createdAt: yesterday,
        updatedAt: now
      },

      // Pyon (MIMI primary, Miku + Teto featured)
      {
        trackId: "2d9fb1b3-3c15-4f6b-90a2-1a1c9d7a3333",
        artistId: "b9d1e2f3-a4c5-40b9-8e7d-6c5b4a3f2e1d",
        artistOrder: 1,
        role: "primary",
        createdAt: yesterday,
        updatedAt: now
      },
      {
        trackId: "2d9fb1b3-3c15-4f6b-90a2-1a1c9d7a3333",
        artistId: "d8b64fd2-9b6f-4f5d-b3ae-0a1e6d0a77a1",
        artistOrder: 2,
        role: "featured",
        createdAt: yesterday,
        updatedAt: now
      },
      {
        trackId: "2d9fb1b3-3c15-4f6b-90a2-1a1c9d7a3333",
        artistId: "b29cb043-2f74-47d3-a107-ab70cdef58f7",
        artistOrder: 3,
        role: "featured",
        createdAt: yesterday,
        updatedAt: now
      },

      // TRICK HEART
      {
        trackId: "3a3d5df7-3aef-43b1-9a28-3bda4c444444",
        artistId: "b9d1e2f3-a4c5-40b9-8e7d-6c5b4a3f2e1d",
        artistOrder: 1,
        role: "primary",
        createdAt: yesterday,
        updatedAt: now
      },
      {
        trackId: "3a3d5df7-3aef-43b1-9a28-3bda4c444444",
        artistId: "b29cb043-2f74-47d3-a107-ab70cdef58f7",
        artistOrder: 2,
        role: "featured",
        createdAt: yesterday,
        updatedAt: now
      },

      // マサラダ tracks (primary)
      {
        trackId: "4b02dca2-5b2d-4d3f-8b73-0f5b1a2f1c01",
        artistId: "e6f3e2a1-2a5a-4e7d-9d2e-6b3f1b9c21a0",
        artistOrder: 1,
        role: "primary",
        createdAt: yesterday,
        updatedAt: now
      },
      {
        trackId: "5c13edb3-6c3e-4c4f-9c84-1a6c2b3f2d02",
        artistId: "e6f3e2a1-2a5a-4e7d-9d2e-6b3f1b9c21a0",
        artistOrder: 1,
        role: "primary",
        createdAt: yesterday,
        updatedAt: now
      },
      {
        trackId: "6d24fea4-7d4f-4d5f-8d95-2b7d3c4f3e03",
        artistId: "e6f3e2a1-2a5a-4e7d-9d2e-6b3f1b9c21a0",
        artistOrder: 1,
        role: "primary",
        createdAt: yesterday,
        updatedAt: now
      },
      {
        trackId: "7e350fb5-8e50-4e6f-9ea6-3c8e4d5f4f04",
        artistId: "e6f3e2a1-2a5a-4e7d-9d2e-6b3f1b9c21a0",
        artistOrder: 1,
        role: "primary",
        createdAt: yesterday,
        updatedAt: now
      },
      {
        trackId: "aa1b2c3d-4e5f-6789-a012-3456789abcde",
        artistId: "f1a2b3c4-6d7e-4f8a-9b0c-1d2e3f4a5b6c", // 32ki
        artistOrder: 1,
        role: "primary",
        createdAt: yesterday,
        updatedAt: now
      },
      {
        trackId: "aa1b2c3d-4e5f-6789-a012-3456789abcde",
        artistId: "d8b64fd2-9b6f-4f5d-b3ae-0a1e6d0a77a1", // Hatsune Miku
        artistOrder: 2,
        role: "featured",
        createdAt: yesterday,
        updatedAt: now
      },
      {
        trackId: "aa1b2c3d-4e5f-6789-a012-3456789abcde",
        artistId: "b29cb043-2f74-47d3-a107-ab70cdef58f7", // Kasane Teto
        artistOrder: 3,
        role: "featured",
        createdAt: yesterday,
        updatedAt: now
      },
      
      // Yorushika tracks
      {
        trackId: "550e8400-e29b-41d4-a716-446655440000",
        artistId: "c1f3f68a-6e84-4d2b-8f4f-2a5d7f2f3c10", 
        artistOrder: 1,
        role: "primary",
        createdAt: yesterday,
        updatedAt: now
      },
      {
        trackId: "4f8c92b1-e7a3-4b6d-9c1f-2e8d5b0a3f4c",
        artistId: "c1f3f68a-6e84-4d2b-8f4f-2a5d7f2f3c10", 
        artistOrder: 1,
        role: "primary",
        createdAt: yesterday,
        updatedAt: now
      },
      {
        trackId: "b9d1e2f3-a4c5-40b9-8e7d-6c5b4a3f2e1d",
        artistId: "c1f3f68a-6e84-4d2b-8f4f-2a5d7f2f3c10", 
        artistOrder: 1,
        role: "primary",
        createdAt: yesterday,
        updatedAt: now
      },
      {
        trackId: "a7c1e92d-b84f-4d3a-91e2-f6c5b4a3d2e1",
        artistId: "c1f3f68a-6e84-4d2b-8f4f-2a5d7f2f3c10", 
        artistOrder: 1,
        role: "primary",
        createdAt: yesterday,
        updatedAt: now
      },
      {
        trackId: "2d3e4f5a-6b7c-4890-a1b2-c3d4e5f6a7b8",
        artistId: "c1f3f68a-6e84-4d2b-8f4f-2a5d7f2f3c10", 
        artistOrder: 1,
        role: "primary",
        createdAt: yesterday,
        updatedAt: now
      },
       {
        trackId: "1faa1b7a-8214-48dc-956e-5fd2c8c60406",
        artistId: "c1f3f68a-6e84-4d2b-8f4f-2a5d7f2f3c10", 
        artistOrder: 1,
        role: "primary",
        createdAt: yesterday,
        updatedAt: now
      },
      {
        TrackId: "1e94fd52-bd3a-4a8d-ade7-3f2c3240d960",
        artistId: "c1f3f68a-6e84-4d2b-8f4f-2a5d7f2f3c10", 
        artistOrder: 1,
        role: "primary",
        createdAt: yesterday,
        updatedAt: now
      },
      {
        TrackId: "5c6c4049-4ded-45c5-bd77-e67a4c30c1fd",
        artistId: "c1f3f68a-6e84-4d2b-8f4f-2a5d7f2f3c10", 
        artistOrder: 1,
        role: "primary",
        createdAt: yesterday,
        updatedAt: now
      },
      {
        TrackId: "c40ca7e3-15ba-4245-8371-1cf9991b5775",
        artistId: "c1f3f68a-6e84-4d2b-8f4f-2a5d7f2f3c10", 
        artistOrder: 1,
        role: "primary",
        createdAt: yesterday,
        updatedAt: now
      },
      {
        TrackId: "d0890bd1-d629-4d9c-8a75-469edf2dc531",
        artistId: "c1f3f68a-6e84-4d2b-8f4f-2a5d7f2f3c10", 
        artistOrder: 1,
        role: "primary",
        createdAt: yesterday,
        updatedAt: now
      },
      {
        TrackId: "e3de4309-6683-4409-8aa5-8d44c25c8e68",
        artistId: "c1f3f68a-6e84-4d2b-8f4f-2a5d7f2f3c10", 
        artistOrder: 1,
        role: "primary",
        createdAt: yesterday,
        updatedAt: now
      },
      {
        TrackId: "b5a1926f-d459-4c59-89f5-70a1ed5f7d95",
        artistId: "c1f3f68a-6e84-4d2b-8f4f-2a5d7f2f3c10", 
        artistOrder: 1,
        role: "primary",
        createdAt: yesterday,
        updatedAt: now
      },
      {
        TrackId: "a5bdfc38-b847-48fd-86c7-8bab935f4443",
        artistId: "c1f3f68a-6e84-4d2b-8f4f-2a5d7f2f3c10", 
        artistOrder: 1,
        role: "primary",
        createdAt: yesterday,
        updatedAt: now
      },
      {
        TrackId: "bad4f94c-3042-4ff2-890f-9ba96e70dc05",
        artistId: "c1f3f68a-6e84-4d2b-8f4f-2a5d7f2f3c10", 
        artistOrder: 1,
        role: "primary",
        createdAt: yesterday,
        updatedAt: now
      },
      {
        TrackId: "73f3ec26-f230-4659-b699-9a6c6b196bef",
        artistId: "c1f3f68a-6e84-4d2b-8f4f-2a5d7f2f3c10", 
        artistOrder: 1,
        role: "primary",
        createdAt: yesterday,
        updatedAt: now
      },
      {
        TrackId: "6a1de18e-4683-43e0-a555-1c066ab12432",
        artistId: "c1f3f68a-6e84-4d2b-8f4f-2a5d7f2f3c10", 
        artistOrder: 1,
        role: "primary",
        createdAt: yesterday,
        updatedAt: now
      },
      {
        TrackId: "8a39d6ca-3d9b-43dd-aff4-4864aab7974a",
        artistId: "c1f3f68a-6e84-4d2b-8f4f-2a5d7f2f3c10", 
        artistOrder: 1,
        role: "primary",
        createdAt: yesterday,
        updatedAt: now
      },
      {
        TrackId: "49c2d747-3ec5-4f4a-9829-4e0742182b97",
        artistId: "c1f3f68a-6e84-4d2b-8f4f-2a5d7f2f3c10", 
        artistOrder: 1,
        role: "primary",
        createdAt: yesterday,
        updatedAt: now
      },
      {
        TrackId: "2c8c043a-34ca-42b1-8041-b2bc3b3dee87",
        artistId: "c1f3f68a-6e84-4d2b-8f4f-2a5d7f2f3c10", 
        artistOrder: 1,
        role: "primary",
        createdAt: yesterday,
        updatedAt: now
      },
      {
        TrackId: "2a5c3dbc-b375-433d-beb0-b48edd852f70",
        artistId: "c1f3f68a-6e84-4d2b-8f4f-2a5d7f2f3c10", 
        artistOrder: 1,
        role: "primary",
        createdAt: yesterday,
        updatedAt: now
      },
      {
        TrackId: "ebbb29a2-f47c-45ca-8d9a-57ac32b102fe",
        artistId: "c1f3f68a-6e84-4d2b-8f4f-2a5d7f2f3c10", 
        artistOrder: 1,
        role: "primary",
        createdAt: yesterday,
        updatedAt: now
      },
      {
        TrackId: "ddb5d380-202a-40dd-b130-90bfa2414a45",
        artistId: "c1f3f68a-6e84-4d2b-8f4f-2a5d7f2f3c10", 
        artistOrder: 1,
        role: "primary",
        createdAt: yesterday,
        updatedAt: now
      },
      {
        TrackId: "43ac4e00-0d06-4a78-91a7-99fea764db14",
        artistId: "c1f3f68a-6e84-4d2b-8f4f-2a5d7f2f3c10", 
        artistOrder: 1,
        role: "primary",
        createdAt: yesterday,
        updatedAt: now
      },
      {
        TrackId: "c0127eb7-b432-42a8-a568-a1c1021b7411",
        artistId: "c1f3f68a-6e84-4d2b-8f4f-2a5d7f2f3c10", 
        artistOrder: 1,
        role: "primary",
        createdAt: yesterday,
        updatedAt: now
      },
      {
        TrackId: "382d602d-411c-449b-8826-f88e0e8a0217",
        artistId: "c1f3f68a-6e84-4d2b-8f4f-2a5d7f2f3c10", 
        artistOrder: 1,
        role: "primary",
        createdAt: yesterday,
        updatedAt: now
      },
      {
        TrackId: "d28b927a-53a0-4732-bfe4-04ca2011590b",
        artistId: "c1f3f68a-6e84-4d2b-8f4f-2a5d7f2f3c10", 
        artistOrder: 1,
        role: "primary",
        createdAt: yesterday,
        updatedAt: now
      },
      {
        TrackId: "05f185bb-7c07-4106-9499-36b926231937",
        artistId: "c1f3f68a-6e84-4d2b-8f4f-2a5d7f2f3c10", 
        artistOrder: 1,
        role: "primary",
        createdAt: yesterday,
        updatedAt: now
      },
      {
        TrackId: "5ba55f09-db65-4c1d-8d48-01bb50b29593",
        artistId: "c1f3f68a-6e84-4d2b-8f4f-2a5d7f2f3c10", 
        artistOrder: 1,
        role: "primary",
        createdAt: yesterday,
        updatedAt: now
      },
      {
        TrackId: "4f264253-9ce4-4a26-aaeb-f0947fa1602e",
        artistId: "c1f3f68a-6e84-4d2b-8f4f-2a5d7f2f3c10", 
        artistOrder: 1,
        role: "primary",
        createdAt: yesterday,
        updatedAt: now
      },

      // Yoasobi tracks (featured)
      {
        trackId: "ab7927bc-3975-4f3c-9776-a085bd228347",
        artistId: "fe0e2083-43e2-4d44-a05e-445dc880ef52", 
        artistOrder: 1,
        role: "featured",
        createdAt: yesterday,
        updatedAt: now
      },
      {
        trackId: "ab7927bc-3975-4f3c-9776-a085bd228347",
        artistId: "3cf8e44e-9751-4aad-b055-6334b4bde54a", 
        artistOrder: 2,
        role: "featured",
        createdAt: yesterday,
        updatedAt: now
      },
      {
        trackId: "ae41d098-e0b9-4ac0-85d0-64640fd7ff28",
        artistId: "3cf8e44e-9751-4aad-b055-6334b4bde54a", 
        artistOrder: 1,
        role: "featured",
        createdAt: yesterday,
        updatedAt: now
      },
      {
        trackId: "ae41d098-e0b9-4ac0-85d0-64640fd7ff28",
        artistId: "3cf8e44e-9751-4aad-b055-6334b4bde54a", 
        artistOrder: 2,
        role: "featured",
        createdAt: yesterday,
        updatedAt: now
      },

      // Ayase tracks (primary)
      {
        trackId: "b40d7e91-ac9d-4a6f-ae24-242a41be9618",
        artistId: "3cf8e44e-9751-4aad-b055-6334b4bde54a", 
        artistOrder: 1,
        role: "primary",
        createdAt: yesterday,
        updatedAt: now
      },
      {
        trackId: "0687b2ca-e02b-4661-8415-c7a3565ef5e3",
        artistId: "3cf8e44e-9751-4aad-b055-6334b4bde54a", 
        artistOrder: 1,
        role: "primary",
        createdAt: yesterday,
        updatedAt: now
      },
      
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("TrackArtists", null, {});
  }
};