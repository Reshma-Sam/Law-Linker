const jwt = require('jsonwebtoken'); // Ensure jwt is imported

const authUpdateCase = (req, res, next) => {
    try {
        // Extract the token from the Authorization header
        const token = req.header('Authorization')?.replace('Bearer ', '')
        if (!token) {
            return res.status(401).json({ success: false, message: 'Authentication failed, token is missing'})
        }

        // Verify and decode the JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        if (!decoded) {
            return res.status(403).json({ success: false, message: 'Authentication failed, invalid token'})
        }

        // Attach decoded user details to the request object
        req.user = {
            email: decoded.email,
            usertype: decoded.usertype,
        };
        console.log('👤 Decoded User:', req.user);


        // Ensure only authorized advocates (advocate or jr.advocate) can proceed
        if (req.user.usertype !== 'advocate' && req.user.usertype !== 'jr.advocate') {
            return res.status(403).json({success: false, message: 'You are not authorized to update this case' })
        }

        next(); // User is authenticated and authorized
    } catch (error) {
        console.error('Error in authUpdateCase middleware:', error);
        res.status(403).json({ success: false, message: 'Authentication failed, invalid or expired token'})
    }
}

module.exports = authUpdateCase;
