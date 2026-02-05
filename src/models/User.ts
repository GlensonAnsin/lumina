import { Model, DataTypes, Sequelize, Optional } from 'sequelize';
import Hash from '../utils/Hash.js';

interface UserAttributes {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: string;
  avatar: string | null;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'role' | 'avatar'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  declare id: number;
  declare firstname: string;
  declare lastname: string;
  declare email: string;
  declare password: string;
  declare role: string;
  declare avatar: string | null;
  declare created_at: Date;
  declare updated_at: Date;
  declare deleted_at?: Date | null;

  static initModel(sequelize: Sequelize) {
    User.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        firstname: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        lastname: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        email: {
          type: DataTypes.STRING,
          unique: true,
          allowNull: false,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        role: {
          type: DataTypes.STRING,
          allowNull: false,
          defaultValue: 'user',
        },
        avatar: {
          type: DataTypes.TEXT,
          allowNull: true,
          defaultValue: null,
        },
      },
      {
        sequelize,
        modelName: 'User',
        tableName: 'users',
        paranoid: true,
        timestamps: true,
        underscored: true,
        hooks: {
          beforeCreate: async (user: User) => {
            if (user.password) {
              user.password = await Hash.make(user.password);
            }
          },
          beforeUpdate: async (user: User) => {
            if (user.changed('password')) {
              user.password = await Hash.make(user.password);
            }
          },
        },
      }
    );
  }
}

export default User;