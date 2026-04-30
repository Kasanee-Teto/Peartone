export default (sequelize, DataTypes) => {
  const LikedTrack = sequelize.define(
    "LikedTrack",
    {
      userId: { 
        type: DataTypes.UUID, 
        allowNull: false, 
        primaryKey: true 
      },
      trackId: { 
        type: DataTypes.UUID, 
        allowNull: false,
        primaryKey: true 
      },
      createdAt: { 
        type: DataTypes.DATE, 
        allowNull: false
      }
    },
    { tableName: "LikedTracks", timestamps: false }
  );

  return LikedTrack;
};