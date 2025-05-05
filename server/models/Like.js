export default (sequelize, DataTypes) => {
    const Like = sequelize.define("Like", {}, {
      timestamps: false,
      tableName: "likes",
    });
  
    return Like;
  };
  