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
      duration: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      audioUrl: {
        type: DataTypes.STRING,
        allowNull: false
      },
      coverUrl: {
        type: DataTypes.STRING,
        allowNull: true
      },
      albumId: {
        type: DataTypes.UUID,
        allowNull: true
      }
    },
    {
      tableName: "Tracks",
      timestamps: true
    }
  );

  Track.associate = (models) => {
    Track.belongsTo(models.Album, {
      foreignKey: "albumId"
    });

    Track.belongsToMany(models.Artist, {
      through: models.TrackArtist,
      foreignKey: "trackId",
      otherKey: "artistId"
    });
  };

  return Track;
};