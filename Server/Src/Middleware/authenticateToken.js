require('dotenv').config()
const jwt = require('jsonwebtoken')

const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1] // Extract token from Bearer header
    console.log("Token received:", token);
    if (!token) {
        return res.status(401).json({ message: 'No token provided' })
    }
    // console.log("JWT Secret:", process.env.JWT_SECRET_KEY);


    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        // console.log("Using Secret Key:", process.env.JWT_SECRET_KEY); // Log the secret
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
        // Attach user info to the request object
        req.user = {
            id: decoded.id,
            email: decoded.email,
            usertype: decoded.usertype,
        };
        console.log("Decoded Token User:", req.user)
        next();
    });
    
};

module.exports = authenticateToken;
