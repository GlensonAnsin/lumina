import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Hash from '../utils/Hash.js';

class AuthService {
  public async login(email: string, password: string) {
    const user = await User.findOne({ where: { email } });

    if (!user || !(await Hash.check(password, user.password))) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET as string,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' } as jwt.SignOptions
    );

    return { user, token };
  }
}

export default new AuthService();