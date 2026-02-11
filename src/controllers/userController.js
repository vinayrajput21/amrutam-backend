const UserService = require('../services/userService');

const getProfile = async (req, res, next) => {
  try {
    const profile = await new UserService().getProfile(req.user.id);
    res.json(profile);
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const updatedProfile = await new UserService().updateProfile(req.user.id, req.body);
    res.json(updatedProfile);
  } catch (err) {
    next(err);
  }
};

const assignRole = async (req, res, next) => {
  try {
    // Assuming admin only, checked by RBAC middleware
    const { userId, role } = req.body;
    const updatedUser = await new UserService().assignRole(userId, role);
    res.json(updatedUser);
  } catch (err) {
    next(err);
  }
};

module.exports = { getProfile, updateProfile, assignRole };