// backend/src/models/playlist.js
export default (sequelize, DataTypes) => {
  const Playlist = sequelize.define(
    "Playlist",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      trackNumbers: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      isPublic: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      tableName: "Playlists",
      timestamps: true,
    }
  );

  Playlist.associate = (models) => {
    Playlist.belongsTo(models.User, { foreignKey: "userId" });

    // REQUIRED: Direct hasMany so listMine can include PlaylistTrack
    // without this, Sequelize throws "PlaylistTrack is not associated to Playlist!"
    Playlist.hasMany(models.PlaylistTrack, {
      foreignKey: "playlistId",
      as: "PlaylistTracks",
    });

    Playlist.belongsToMany(models.Track, {
      through: models.PlaylistTrack,
      foreignKey: "playlistId",
      otherKey: "trackId",
    });
  };

  return Playlist;
};