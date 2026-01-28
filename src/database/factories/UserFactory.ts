import { faker } from '@faker-js/faker';
import User from '../../models/User.js'; // Import your Model
import Factory from './Factory.js';

class UserFactory extends Factory<User> {
  protected model = User;

  protected definition() {
    return {
      firstname: faker.person.firstName(),
      lastname: faker.person.lastName(),
      email: faker.internet.email(),
      password: '$2b$10$YourHashedPasswordHere',
      role: 'user',
      is_deleted: false,
    };
  }

  public admin() {
    return {
      role: 'admin',
    };
  }
}

export default new UserFactory();