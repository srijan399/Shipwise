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
const { getTransporters, createTransporter, deleteTransporter } = require('./controllers/transportersManagement');

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
            resetLink
        });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ error: 'Failed to reset password' });
    }
});

// Bid Routes (Management Staff and Admin)
app.get('/api/bids', verifyToken, requireRole(['admin', 'management_staff']), (req, res) => {
    prisma.bid.findMany()
        .then(bids => {
            res.json({ bids, ok: true });
        })
        .catch(error => {
            console.error('Error fetching bids:', error);
            res.status(500).json({ error: 'Failed to fetch bids', ok: false });
        });
});

app.post('/api/bids', verifyToken, requireRole(['admin', 'management_staff']), (req, res) => {
    const { materialType, quantity, pickupLocation, deliveryLocation, deadline, transporterRequirements } = req.body;
    prisma.bid.create({
        data: {
            materialType,
            quantity,
            pickupLocation,
            deliveryLocation,
            deadline,
            transporterRequirements
        }
    })
        .then(bid => {
            res.status(201).json({ message: 'Bid created successfully', bid });
        })
        .catch(error => {
            console.error('Error creating bid:', error);
            res.status(500).json({ error: 'Failed to create bid' });
        });
});

app.delete('/api/bids/:id', verifyToken, requireRole(['admin', 'management_staff']), async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.bid.delete({
            where: { id: id }
        });
        res.json({ message: 'Bid deleted successfully', ok: true });
    } catch (error) {
        console.error('Error deleting bid:', error);
        res.status(500).json({ error: 'Failed to delete bid', ok: false });
    }
});

// Transporter Routes (Management Staff and Admin)
app.post('/api/transporters', verifyToken, requireRole(['admin']), createTransporter);

app.get('/api/transporters', verifyToken, requireRole(['admin', 'management_staff']), getTransporters);

app.delete('/api/transporters/:id', verifyToken, requireRole(['admin']), deleteTransporter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;