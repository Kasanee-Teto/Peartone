export default (sequelize, DataTypes) => {
  const PlaylistTrack = sequelize.define(
    "PlaylistTrack",
    {
      playlistId: { 
        type: DataTypes.UUID, 
        allowNull: false, 
        primaryKey: true 
      },
      trackId: { 
        type: DataTypes.UUID, 
        allowNull: false,
        primaryKey: true 
      },
      position: { 
        type: DataTypes.INTEGER, 
        allowNull: false 
      },
      addedBy: { 
        type: DataTypes.UUID, 
        allowNull: true, 
        field: "added_by" 
      },
      addedAt: { 
        type: DataTypes.DATE, 
        allowNull: false
      }
    },
    { tableName: "PlaylistTracks", timestamps: false }
  );

  PlaylistTrack.associate = (models) => {
    PlaylistTrack.belongsTo(models.Track, { foreignKey: "trackId", as: "Track" });
  };

  return PlaylistTrack;
};