import Sequelize from "sequelize";

export default (sequelize, DataTypes) => {
  const Artist = sequelize.define(
    "Artist",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      bio: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      imageUrl: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      tableName: "Artists",
      timestamps: true
    }
  );

  Artist.associate = (models) => {
    Artist.belongsToMany(models.Track, {
      through: models.TrackArtist,
      foreignKey: "artistId",
      otherKey: "trackId"
    });
  };

  return Artist;
};