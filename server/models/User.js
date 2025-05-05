export default (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
      username: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: "user",
        validate: {
          isIn: [["user", "admin"]],
        },
      },
    }, {
      timestamps: true,
      createdAt: "created_at",
      tableName: "users",
      updatedAt: false,
    });
  
    User.associate = models => {
      User.hasMany(models.Joke, { foreignKey: 'user_id' });
      User.hasMany(models.Comment, { foreignKey: 'user_id' });
      User.belongsToMany(models.Joke, { through: models.Like, foreignKey: 'user_id', as: 'LikedJokes' });
    };
  
    return User;
  };
  