module.exports = (req, res, next) => {
    req.user = { email: 'example@example.com' };
    next();
};
