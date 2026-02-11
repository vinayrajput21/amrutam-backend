const AuthService = require('../services/authService');

const register = async (req, res, next) => {
  try {
    const user = await new AuthService().register(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { token } = await new AuthService().login(req.body.email, req.body.password, req.body.otp);
    res.json({ token });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login };