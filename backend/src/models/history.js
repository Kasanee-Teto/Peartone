export default (sequelize, DataTypes) => {
  const History = sequelize.define(
    "History",
    {
      id: { 
        type: DataTypes.BIGINT, 
        primaryKey: true, 
        autoIncrement: true 
      },
      userId: { 
        type: DataTypes.UUID, 
        allowNull: true
      },
      trackId: { 
        type: DataTypes.UUID, 
        allowNull: true
      },
      playedAt: { 
        type: DataTypes.DATE, 
        allowNull: false
      },
      msPlayed: { 
        type: DataTypes.INTEGER, 
        allowNull: true
      },
    },
    { tableName: "History", timestamps: false }
  );

  History.associate = (models) => {
    History.belongsTo(models.Track, { foreignKey: "trackId", as: "Track" });
  };

  return History;
};