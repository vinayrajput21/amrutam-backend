const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const User = require('../models/user');
const { cryptoUtil } = require('../utils/cryptoUtil'); // For encryption

class AuthService {
  async register(userData) {
    const user = await User.create(userData);
    // Generate MFA secret
    const secret = speakeasy.generateSecret();
    user.mfaSecret = cryptoUtil.encrypt(secret.base32); // Encrypt secret
    await user.save();
    return user;
  }

  async login(email, password, otp) {
    const user = await User.findOne({ where: { email } });
    if (!user || !await bcrypt.compare(password, user.password)) {
      throw new Error('Invalid credentials');
    }
    // Verify MFA OTP
    const decryptedSecret = cryptoUtil.decrypt(user.mfaSecret);
    const verified = speakeasy.totp.verify({ secret: decryptedSecret, encoding: 'base32', token: otp });
    if (!verified) throw new Error('Invalid OTP');
    
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return { token };
  }
}

module.exports = AuthService;