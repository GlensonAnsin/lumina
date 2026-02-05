import { DataTypes } from 'sequelize';

class CreateUserTable {
  /**
   * Run the migrations.
   */
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT
      },
      firstname: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      lastname: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      email: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      role: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: 'user'
      },
      avatar: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
    });
  }

  /**
   * Reverse the migrations.
   */
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
}

export default new CreateUserTable();