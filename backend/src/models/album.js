import Sequelize from "sequelize";

export default (sequelize, DataTypes) => {
  const Album = sequelize.define(
    "Album",
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
      coverUrl: {
        type: DataTypes.STRING,
        allowNull: true
      },
      releaseDate: {
        type: DataTypes.DATEONLY,
        allowNull: true
      }
    },
    {
      tableName: "Albums",
      timestamps: true
    }
  );

  Album.associate = (models) => {
    Album.hasMany(models.Track, {
      foreignKey: "albumId"
    });
  };

  return Album;
};