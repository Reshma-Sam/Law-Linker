const adminAccessOnly = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized: No user details found' });
    }

    // Check usertype
    if (req.user.usertype !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: Admin access only' });
    }

    next(); // Allow access if usertype is admin
};

module.exports = adminAccessOnly