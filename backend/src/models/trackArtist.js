import Sequelize from "sequelize";

export default (sequelize, DataTypes) => {
  const TrackArtist = sequelize.define(
    "TrackArtist",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      trackId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      artistId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      artistOrder: { 
        type: DataTypes.INTEGER, 
        allowNull: false, 
        defaultValue: 1
      },
      role: { 
        type: DataTypes.STRING, 
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