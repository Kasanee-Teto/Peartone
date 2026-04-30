export default (sequelize, DataTypes) => {
  const Lyrics = sequelize.define(
    "Lyrics",
    {
      trackId: { 
        type: DataTypes.UUID, 
        allowNull: false, 
        primaryKey: true 
      },
      language: { 
        type: DataTypes.STRING, 
        allowNull: false 
      },
      text: { 
        type: DataTypes.STRING, 
        allowNull: false 
      }
    },
    { tableName: "Lyrics", timestamps: true }
  );

  return Lyrics;
};