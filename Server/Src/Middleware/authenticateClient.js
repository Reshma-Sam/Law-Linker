const jwt = require('jsonwebtoken');

const authenticateClient = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header
        if (!token) {
            return res.status(401).json({ success: false, message: 'Authentication failed. Token is missing.' })
        }

        // Verify and decode the JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (!decoded) {
            return res.status(403).json({ success: false, message: 'Authentication failed. Invalid token.' })
        }

        // Attach client details to the request object
        req.client = {
            email: decoded.email,
            mobile: decoded.mobile,
        };

        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error('Error in authMiddleware:', error);
        res.status(403).json({
            success: false,
            message: 'Authentication failed. Invalid or expired token.',
        });
    }
}

module.exports = authenticateClient
