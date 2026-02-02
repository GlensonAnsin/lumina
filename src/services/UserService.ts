import User, { UserCreationAttributes } from '../models/User.js';
import Hash from '../utils/Hash.js';

class UserService {
  async getAllUsers() {
    return await User.findAll({
      attributes: { exclude: ['password'] }
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