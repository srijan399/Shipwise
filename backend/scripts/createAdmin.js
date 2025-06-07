const prismaClient = require("@prisma/client");
const { admin } = require("../services/admin");
require('dotenv').config();

const createInitialAdmin = async () => {
    const adminEmail = process.env.INITIAL_ADMIN_EMAIL || 'admin@yourcompany.com';
    const adminPassword = process.env.INITIAL_ADMIN_PASSWORD || 'password';
    const prisma = new prismaClient.PrismaClient();

    try {
        console.log('Creating initial admin user...');

        try {
            const existingUser = await admin.auth().getUserByEmail(adminEmail);
            console.log('Admin user already exists:', existingUser.uid);
            return;
        } catch (error) {
            if (error.code !== 'auth/user-not-found') {
                throw error;
            }
        }

        const userRecord = await admin.auth().createUser({
            email: adminEmail,
            password: adminPassword,
            emailVerified: true,
            displayName: 'Administrator'
        });

        console.log('Firebase user created:', userRecord.uid);

        // Option 1: Set custom claims (recommended for Firebase)
        await admin.auth().setCustomUserClaims(userRecord.uid, {
            role: 'admin'
        });
        console.log('Custom claims set for admin role');

        await prisma.user.create({
            data: {
                id: userRecord.uid,
                email: adminEmail,
                password: adminPassword,
                role: 'admin',
            }
        });

        console.log('✅ Initial admin created successfully!');
        console.log(`Email: ${adminEmail}`);
        console.log(`Password: ${adminPassword}`);
        console.log('⚠️ Please change the password after first login!');

    } catch (error) {
        console.error('❌ Error creating initial admin:', error);
    } finally {
        process.exit(0);
    }
};

// Run the script
createInitialAdmin();