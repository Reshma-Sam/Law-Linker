const checkAdvocateAccess = (req, res, next) => {
    try {
        if (!req.user || !req.user.usertype) {
            return res.status(403).json({ success: false, message: 'Access denied. User is not authenticated or usertype is missing.'})
        }

        const { usertype } = req.user;

        // Check if the usertype is 'advocate' or 'jr.advocate'
        if (usertype === 'advocate' || usertype === 'jr.advocate') {
            return next() // User has the required role, proceed to the next middleware or route handler.
        }

        return res.status(403).json({ success: false, message: 'Access denied. Only advocates or jr.advocates can perform this action.',})
    } catch (error) {
        console.error('Error in middleware:', error);
        res.status(500).json({ success: false, message: 'Server error in authorization middleware.'})
    }
}

module.exports = checkAdvocateAccess;

