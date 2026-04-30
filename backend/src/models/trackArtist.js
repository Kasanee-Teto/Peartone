import Sequelize from "sequelize";

export default (sequelize, DataTypes) => {
  const TrackArtist = sequelize.define(
    "TrackArtist",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        primaryKey: true
      },
      trackId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      artistId: {
        type: DataTypes.UUID,
        allowNull: false
      }
    },
    {
      tableName: "TrackArtists",
      timestamps: true
    }
  );

  return TrackArtist;
};