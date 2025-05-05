export default (sequelize, DataTypes) => {
    const Comment = sequelize.define("Comment", {
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    }, {
      timestamps: true,
      createdAt: "created_at",
      tableName: "comments",
      updatedAt: false,
    });
  
    Comment.associate = models => {
      Comment.belongsTo(models.User, { foreignKey: 'user_id' });
      Comment.belongsTo(models.Joke, { foreignKey: 'joke_id' });
    };
  
    return Comment;
  };
  