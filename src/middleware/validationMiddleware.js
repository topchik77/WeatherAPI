const Joi = require('joi');

const signupSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(6).required(),
  email: Joi.string().email().required(),
});

const loginSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(6).required(),
});

const validateRegisterData = (req, res, next) => {
  const { error } = signupSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: JSON.stringify(error.details) });
  }
  next();

};

const validateLoginData = (req, res, next) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

const protect = async (req, res, next) => {
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.sessionId !== decoded.sessionId) {
      return res.status(401).json({ message: 'Unauthorized, session expired' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized, token is invalid or expired' });
  }
};

const protectAPI = async (req, res, next) => {
  const apiKey = req.query.apiKey; // Get API key from query params

  if (!apiKey) {
    return res.status(401).json({ message: 'API key is required' });
  }

  try {
    const user = await User.findOne({ apiKey });

    if (!user) {
      return res.status(403).json({ message: 'Invalid API key' });
    }

    req.user = user; // Attach user info to request
    next();
  } catch (error) {
    res.status(500).json({ message: 'Authentication failed', error: error.message });
  }
};


module.exports = { validateRegisterData, validateLoginData, protect, protectAPI};
