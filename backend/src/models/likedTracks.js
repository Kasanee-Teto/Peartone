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

  LikedTrack.associate = (models) => {
    LikedTrack.belongsTo(models.Track, { foreignKey: "trackId" });
  };

  return LikedTrack;
};