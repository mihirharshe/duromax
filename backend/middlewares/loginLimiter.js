const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5, // limit each IP to 5 requests per windowMs
    message: 'Too many login attempts from this IP, please try again after a minute',
    standardHeaders: true, // Return rate limit info in the 'RateLimit-*' headers
    legacyHeaders: false // Disable the 'X-RateLimit-*' headers
});

module.exports = loginLimiter
