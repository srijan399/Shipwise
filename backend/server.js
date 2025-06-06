require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { admin } = require('./services/admin')
const { verifyToken } = require('./middlewares/verify')
const { requireRole } = require('./middlewares/role');
const app = express();
const PORT = process.env.PORT || 3000;
const { getUsers, addNewUser, deleteUser } = require("./controllers/userManagement")
const prismaClient = require("@prisma/client");

// Initialize Prisma Client
const prisma = new prismaClient.PrismaClient();

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes

// Login Route
app.get('/api/user', verifyToken, async (req, res) => {
    res.json({
        uid: req.user.uid,
        email: req.user.email,
        role: req.user.role
    });
});

// User Management Routes (Admin only)
// verify token is called, then requireRole checks if the user has admin privileges, then the route handler executes
app.get('/api/users', verifyToken, requireRole(['admin']), getUsers);

// Create new user (Admin only)
app.post('/api/users', verifyToken, requireRole(['admin']), addNewUser);

// Delete user (Admin only)
app.delete('/api/users/:uid', verifyToken, requireRole(['admin']), deleteUser);

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