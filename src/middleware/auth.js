module.exports = (req, res, next) => {
    // Mock authentication example
    req.user = { email: 'example@example.com' }; // Add user data to request
    next(); // Proceed to the next middleware/handler
};
