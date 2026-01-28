import User from '../models/User.js';

class UserService {
  async getAllUsers() {
    return await User.findAll({
      attributes: { exclude: ['password'] }
    });
  }

  async createUser(data: any) {
    // You can add hashing logic here using bcrypt
    return await User.create(data);
  }
}

export default new UserService();