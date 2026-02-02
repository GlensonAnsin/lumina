import User, { UserCreationAttributes } from '../models/User.js';
import Hash from '../utils/Hash.js';
import Paginator from '../utils/Paginator.js';

class UserService {
  /**
   * Get all users with pagination.
   */
  async getAllUsers(page: number, limit: number) {
    return await Paginator.paginate(User, page, limit, {
      attributes: { exclude: ['password'] },
      order: [['id', 'DESC']]
    });
  }

  async createUser(data: UserCreationAttributes) {
    // This is the perfect place to hash passwords before saving
    if (data.password) {
      data.password = await Hash.make(data.password);
    }
    return await User.create(data);
  }
}

export default new UserService();