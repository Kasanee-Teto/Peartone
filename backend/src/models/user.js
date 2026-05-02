export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      username: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        unique: true 
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      },
      passwordHash: {
        type: DataTypes.STRING,
        allowNull: false
      },
      role: {
        type: DataTypes.ENUM("admin", "user"),
        allowNull: false,
        defaultValue: "user"
      },
      location: {
        type: DataTypes.STRING,
        allowNull: true
      },
      bio: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    },
    {
      tableName: "Users",
      timestamps: true
    }
  );

  User.associate = (models) => {
    User.hasMany(models.Playlist, { foreignKey: "userId" });
    User.belongsToMany(models.Track, {
      through: models.LikedTrack,
      foreignKey: "userId",
      otherKey: "trackId"
    });
  };

  return User;
};