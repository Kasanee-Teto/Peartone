import Sequelize from "sequelize";

export default (sequelize, DataTypes) => {
  const Album = sequelize.define(
    "Album",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      artistId: {
        type: DataTypes.UUID,
        allowNull: false
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true
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
    Album.belongsTo(models.Artist, { 
      foreignKey: "artistId"
    });
    
    Album.hasMany(models.Track, { 
      foreignKey: "albumId"
    });
  };

  return Album;
};