import { Model, ModelAttributes, InitOptions } from 'sequelize';

/**
 * BaseModel provides shared configuration for all models.
 * It automatically enables Soft Deletes (paranoid), Timestamps, and Underscored naming.
 */
export default class BaseModel<TAttributes extends {} = any, TCreationAttributes extends {} = any> 
  extends Model<TAttributes, TCreationAttributes> {
  
  /**
   * Helper to initialize the model with default options.
   */
  public static init<MS extends Model, M extends typeof Model>(
    attributes: ModelAttributes<MS, any>,
    options: InitOptions<MS>
  ): M {
    return super.init(attributes, {
      paranoid: true,
      timestamps: true,
      underscored: true,
      ...options,
    }) as unknown as M;
  }
}
