import User, { UserCreationAttributes } from '../models/User.js';

class UserService {
  async getAllUsers() {
    return await User.findAll({
      attributes: { exclude: ['password'] }
    });
  }

  async createUser(data: UserCreationAttributes) {
    // This is the perfect place to hash passwords before saving
    // const hashedPassword = await bcrypt.hash(data.password, 10);
    // data.password = hashedPassword;
    return await User.create(data);
  }
}

export default new UserService();