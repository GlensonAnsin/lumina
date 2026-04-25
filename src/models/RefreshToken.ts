import { DataTypes, Sequelize, Optional } from 'sequelize';
import BaseModel from './BaseModel.js';

interface RefreshTokenAttributes {
  id: number;
  user_id: number;
  token: string;
  expires_at: Date;
  revoked: boolean;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null;
}

export interface RefreshTokenCreationAttributes extends Optional<RefreshTokenAttributes, 'id' | 'revoked' | 'created_at' | 'updated_at' | 'deleted_at'> {}

class RefreshToken extends BaseModel<RefreshTokenAttributes, RefreshTokenCreationAttributes> implements RefreshTokenAttributes {
  declare id: number;
  declare user_id: number;
  declare token: string;
  declare expires_at: Date;
  declare revoked: boolean;
  declare created_at: Date;
  declare updated_at: Date;
  declare deleted_at: Date | null;

  static initModel(sequelize: Sequelize) {
    RefreshToken.init(
      {
        id: {
          type: DataTypes.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        token: {
          type: DataTypes.STRING(512),
          allowNull: false,
          unique: true,
        },
        expires_at: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        revoked: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
      },
      {
        sequelize,
        modelName: 'RefreshToken',
        tableName: 'refresh_tokens',
      }
    );
  }

  static associate(models: any) {
    RefreshToken.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user',
    });
  }
}

export default RefreshToken;
