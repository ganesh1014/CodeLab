const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 20,             

    standardHeaders: "draft-8",
    legacyHeaders: false,

    skip: (req) => req.method === "OPTIONS",

    message: {
        success: false,
        message: "Too many requests. Please try again later."
    }
});


const authLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 20,

    standardHeaders: "draft-8",
    legacyHeaders: false,

    skip: (req) => req.method === "OPTIONS",

    message: {
        success: false,
        message: "Too many authentication attempts. Please try again after 15 minutes."
    }
});


module.exports = {
    apiLimiter,
    authLimiter
};