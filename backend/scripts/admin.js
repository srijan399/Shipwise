// scripts/createInitialAdmin.js
const admin = require('firebase-admin');
require('dotenv').config();

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
    const serviceAccount = {
        type: "service_account",
        project_id: process.env.PROJECT_ID,
        private_key_id: process.env.PRIVATE_KEY_ID,
        private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
        client_email: process.env.CLIENT_EMAIL,
        client_id: process.env.CLIENT_ID,
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
    };

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: `https://${process.env.PROJECT_ID}-default-rtdb.firebaseio.com`
    });
}

const createInitialAdmin = async () => {
    const adminEmail = process.env.INITIAL_ADMIN_EMAIL || 'admin@yourcompany.com';
    const adminPassword = process.env.INITIAL_ADMIN_PASSWORD || 'password';

    try {
        console.log('Creating initial admin user...');

        // Check if user already exists
        try {
            const existingUser = await admin.auth().getUserByEmail(adminEmail);
            console.log('Admin user already exists:', existingUser.uid);
            return;
        } catch (error) {
            // User doesn't exist, continue with creation
            if (error.code !== 'auth/user-not-found') {
                throw error;
            }
        }

        // Create user in Firebase Auth
        const userRecord = await admin.auth().createUser({
            email: adminEmail,
            password: adminPassword,
            emailVerified: true,
            displayName: 'System Administrator'
        });

        console.log('Firebase user created:', userRecord.uid);

        // Option 1: Set custom claims (recommended for Firebase)
        await admin.auth().setCustomUserClaims(userRecord.uid, {
            role: 'admin'
        });
        console.log('Custom claims set for admin role');

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