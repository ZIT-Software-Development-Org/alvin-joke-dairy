export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('comments', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    joke_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'jokes',
        key: 'id'
      },
      onDelete: 'CASCADE'
    },
    content: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    created_at: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    }
  });
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('comments');
}
