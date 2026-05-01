import Sequelize from "sequelize";

export default (sequelize, DataTypes) => {
  const Track = sequelize.define(
    "Track",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        primaryKey: true
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      genre: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "unknown" 
      },
      duration: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      audioUrl: { 
        type: DataTypes.STRING, 
        allowNull: false
      },
      audioPath: { 
        type: DataTypes.STRING, 
        allowNull: false
      },
      mimeType: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        defaultValue: "audio/mpeg"
      },
      fileSize: { 
        type: DataTypes.BIGINT, 
        allowNull: false, 
        defaultValue: 0
      },
      coverUrl: {
        type: DataTypes.STRING,
        allowNull: true
      },
      albumId: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      isPublished: { 
        type: DataTypes.BOOLEAN, 
        allowNull: false, 
        defaultValue: true
      },
      uploadedBy: { 
        type: DataTypes.UUID, 
        allowNull: true
      },
      listeners: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      }
    },
    {
      tableName: "Tracks",
      timestamps: true
    }
  );

  Track.associate = (models) => {
    Track.belongsTo(models.Album, { foreignKey: "albumId"});

    Track.belongsToMany(models.Artist, {
      through: models.TrackArtist,
      foreignKey: "trackId",
      otherKey: "artistId"
    });

    Track.hasOne(models.Lyrics, { foreignKey: "trackId"});

    Track.belongsToMany(models.User, {
      through: models.LikedTrack,
      foreignKey: "trackId",
      otherKey: "userId"
    });

    Track.belongsToMany(models.Playlist, {
      through: models.PlaylistTrack,
      foreignKey: "trackId",
      otherKey: "playlistId"
    });
  };

  return Track;
};