import bcrypt from 'bcrypt';

class Hash {
  /**
   * Hash a plain text string.
   * Usage: await Hash.make('password123');
   */
  public async make(plainText: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(plainText, saltRounds);
  }

  /**
   * Verify a plain text string against a hash.
   * Usage: await Hash.check('password123', user.password);
   */
  public async check(plainText: string, hashedValue: string): Promise<boolean> {
    return await bcrypt.compare(plainText, hashedValue);
  }
}

export default new Hash();