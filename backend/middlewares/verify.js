require('dotenv').config();

const { admin } = require("../services/admin");

const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        console.log('Token received:', token);
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

        // Verify the token using Firebase Admin SDK
        const decodedToken = await admin.auth().verifyIdToken(token);
        const user = await admin.auth().getUser(decodedToken.uid);

        req.user = {
            uid: user.uid,
            email: user.email,
            role: user.customClaims?.role || 'management_staff'
        };

        next();
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = { verifyToken }
