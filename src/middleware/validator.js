const validator = {
    validateCity: (req, res, next) => {
        const { city } = req.params;
        if (!city || city.length < 2) {
            return res.status(400).json({
                error: "Validation Error",
                message: "Please provide a valid city name"
            });
        }
        next();
    },

    validateEmail: (req, res, next) => {
        const { email } = req.body;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            return res.status(400).json({
                error: "Validation Error",
                message: "Please provide a valid email address"
            });
        }
        next();
    },

    validateUser: (req, res, next) => {
        const { email, password } = req.body;
        if (!email || !password || password.length < 6) {
            return res.status(400).json({
                error: "Validation Error",
                message: "Please provide valid email and password (min 6 characters)"
            });
        }
        next();
    }
};

module.exports = validator;