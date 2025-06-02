const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Firebase Admin SDK
const serviceAccount = {
    type: "service_account",
    project_id: process.env.PROJECT_ID,
    private_key_id: process.env.PRIVATE_KEY_ID,
    private_key: process.env.PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.CLIENT_EMAIL,
    client_id: process.env.CLIENT_ID,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.CLIENT_EMAIL}`
};

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Auth middleware to verify Firebase token
const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }

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

// Role-based access middleware
const requireRole = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Insufficient permissions' });
        }
        next();
    };
};

// Routes

// Get current user info
app.get('/api/user', verifyToken, (req, res) => {
    res.json({
        uid: req.user.uid,
        email: req.user.email,
        role: req.user.role
    });
});

// User Management Routes (Admin only)
// verify token is called, then requireRole checks if the user has admin privileges, then the route handler executes
app.get('/api/users', verifyToken, requireRole(['admin']), async (req, res) => {
    try {
        const listUsers = await admin.auth().listUsers();
        const users = listUsers.users.map(user => ({
            uid: user.uid,
            email: user.email,
            role: user.customClaims?.role || 'management_staff',
            disabled: user.disabled,
            emailVerified: user.emailVerified,
            creationTime: user.metadata.creationTime
        }));
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

// Create new user (Admin only)
app.post('/api/users', verifyToken, requireRole(['admin']), async (req, res) => {
    try {
        const { email, password, role } = req.body;

        if (!email || !password || !role) {
            return res.status(400).json({ error: 'Email, password, and role are required' });
        }

        if (!['admin', 'management_staff'].includes(role)) {
            return res.status(400).json({ error: 'Invalid role' });
        }

        // Create user
        const userRecord = await admin.auth().createUser({
            email,
            password,
            emailVerified: true
        });

        // Set custom claims for role
        await admin.auth().setCustomUserClaims(userRecord.uid, { role });

        res.json({
            uid: userRecord.uid,
            email: userRecord.email,
            role,
            message: 'User created successfully'
        });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: error.message || 'Failed to create user' });
    }
});

// Update user role (Admin only)
app.put('/api/users/:uid/role', verifyToken, requireRole(['admin']), async (req, res) => {
    try {
        const { uid } = req.params;
        const { role } = req.body;

        if (!['admin', 'management_staff'].includes(role)) {
            return res.status(400).json({ error: 'Invalid role' });
        }

        await admin.auth().setCustomUserClaims(uid, { role });
        res.json({ message: 'Role updated successfully' });
    } catch (error) {
        console.error('Error updating role:', error);
        res.status(500).json({ error: 'Failed to update role' });
    }
});

// Reset user password (Admin only)
app.post('/api/users/:uid/reset-password', verifyToken, requireRole(['admin']), async (req, res) => {
    try {
        const { uid } = req.params;
        const user = await admin.auth().getUser(uid);

        // Generate password reset link
        const resetLink = await admin.auth().generatePasswordResetLink(user.email);

        res.json({
            message: 'Password reset link generated',
            resetLink // In production, you'd email this instead of returning it
        });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ error: 'Failed to reset password' });
    }
});

// Delete user (Admin only)
app.delete('/api/users/:uid', verifyToken, requireRole(['admin']), async (req, res) => {
    try {
        const { uid } = req.params;

        // Prevent admin from deleting themselves
        if (uid === req.user.uid) {
            return res.status(400).json({ error: 'Cannot delete your own account' });
        }

        await admin.auth().deleteUser(uid);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

// Bid Routes (Management Staff and Admin)
app.get('/api/bids', verifyToken, requireRole(['admin', 'management_staff']), (req, res) => {
    res.json([
        { id: 1, title: 'Freight Bid 1', status: 'active', createdBy: req.user.email },
        { id: 2, title: 'Freight Bid 2', status: 'completed', createdBy: req.user.email }
    ]);
});

app.post('/api/bids', verifyToken, requireRole(['admin', 'management_staff']), (req, res) => {
    // Create bid logic here
    res.json({ message: 'Bid created successfully', bid: req.body });
});

// Transporter Routes (Management Staff and Admin)
app.get('/api/transporters', verifyToken, requireRole(['admin', 'management_staff']), (req, res) => {
    // Mock data - replace with database queries
    res.json([
        { id: 1, name: 'Transporter A', status: 'active', rating: 4.5 },
        { id: 2, name: 'Transporter B', status: 'active', rating: 4.2 }
    ]);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;