// Role-Based Access Control middleware
// Usage: rbac(['admin', 'doctor']) - allows only these roles
module.exports = (allowedRoles) => (req, res, next) => {
  if (!req.user || !req.user.role) {
    return res.status(403).json({ msg: 'Access denied: No role assigned' });
  }

  if (!allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ msg: `Access denied: Role ${req.user.role} not allowed` });
  }

  next();
};