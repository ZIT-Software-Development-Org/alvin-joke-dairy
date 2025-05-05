export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('likes', {
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'CASCADE',
      primaryKey: true
    },
    joke_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Joke',
        key: 'id'
      },
      onDelete: 'CASCADE',
      primaryKey: true
    }
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('likes');
}
