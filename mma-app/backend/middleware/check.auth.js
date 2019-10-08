const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {
    // Could get it as a query paramater
    try {
        const token = req.headers.authorization.split(" ")[1];
        // needs the secret text to verify
        // using nodemon.json config file to inject the jwt key
        // TODO: Use process.env to store secret jwt key
        const decodedToken = jwt.verify(token, "CHANGE_SERCRET_SIGNING_KEY");
        // attaching a userData attribute to the request before it reaches the end of post
        req.userData = { email: decodedToken.email, userId: decodedToken.userId };
        // go to the next middleware
        next();
    } catch (error) {
        res.status(401).json({
            message: "You are not authorized"
        });
    }


};
