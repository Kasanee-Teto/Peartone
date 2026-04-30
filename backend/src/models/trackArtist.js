import Sequelize from "sequelize";

export default (sequelize, DataTypes) => {
  const TrackArtist = sequelize.define(
    "TrackArtist",
    {
      trackId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true
      },
      artistId: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true
      },
      artistOrder: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        defaultValue: 1
      },
      role: { 
        type: DataTypes.ENUM("primary", "featured", "producer", "writer"), 
        allowNull: false, 
        defaultValue: "primary" 
      }
    },
    {
      tableName: "TrackArtists",
      timestamps: true
    }
  );

  return TrackArtist;
};