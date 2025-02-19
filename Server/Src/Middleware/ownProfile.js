// Middleware to check if the logged-in user is updating their own profile
//-------------------------------------------------------------------------
exports.ownProfile = (req, res, next) => {
    if (req.user.id !== req.params.id) {
        return res.status(403).json({ success: false, message: "You are not authorized to perform this action!" })
    }
    next();
}