import User, { UserCreationAttributes } from '../models/User.js';
import Paginator from '../utils/Paginator.js';

class UserService {
  /**
   * Get all users with pagination.
   */
  public async getAllUsers(page: number, limit: number) {
    return await Paginator.paginate(User, page, limit, {
      attributes: { exclude: ['password'] },
      order: [['id', 'DESC']]
    });
  }

  public async createUser(data: UserCreationAttributes) {
    return await User.create(data);
  }

  public async updateAvatar(userId: number, avatarPath: string) {
    const user = await User.findByPk(userId);

    if (!user) {
      throw new Error('User not found');
    }

    user.avatar = avatarPath;
    return await user.save();
  }
}

export default new UserService();