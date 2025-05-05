export default (sequelize, DataTypes) => {
    const Joke = sequelize.define("Joke", {
      title: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    }, {
      timestamps: true,
      createdAt: "created_at",
      tableName: "jokes",
      updatedAt: false,
    });
  
    Joke.associate = models => {
      Joke.belongsTo(models.User, { foreignKey: 'user_id' });
      Joke.hasMany(models.Comment, { foreignKey: 'joke_id' });
      Joke.belongsToMany(models.User, { through: models.Like, foreignKey: 'joke_id', as: 'LikedByUsers' });
    };
  
    return Joke;
  };
  