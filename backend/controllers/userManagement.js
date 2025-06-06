const prismaClient = require("@prisma/client")
const prisma = new prismaClient.PrismaClient();
const { admin } = require("../services/admin");

const getUsers = async (req, res) => {
    try {
        // const listUsers = await admin.auth().listUsers();
        // const users = listUsers.users.map(user => ({
        //     uid: user.uid,
        //     email: user.email,
        //     role: user.customClaims?.role || 'management_staff',
        //     disabled: user.disabled,
        //     emailVerified: user.emailVerified,
        //     creationTime: user.metadata.creationTime
        // }));

        try {
            const usersWithRole = await prisma.user.findMany();
            console.log('Users from Prisma:', usersWithRole);
            res.json({ users: usersWithRole, ok: true });
        } catch (error) {
            console.error('Error fetching users from Prisma:', error);
            res.status(500).json({ error: 'Failed to fetch users from Prisma' });
        }
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Failed to fetch users' });
    }
}

const addNewUser = async (req, res) => {
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

        const user = {
            id: userRecord.uid,
            email: userRecord.email,
            password: password,
            role: role
        };

        const prismaRes = await prisma.user.create({ data: user });
        console.log('User created in Prisma:', prismaRes);

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
}

const deleteUser = async (req, res) => {
    try {
        const { uid } = req.params;

        if (uid === req.user.uid) {
            return res.status(400).json({ error: 'Cannot delete your own account' });
        }

        await admin.auth().deleteUser(uid);
        const user = await prisma.user.findUnique({ where: { id: uid } });
        console.log("deleting user: ", user);
        await prisma.user.delete({ where: { id: uid } });
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
}

module.exports = { getUsers, addNewUser, deleteUser };