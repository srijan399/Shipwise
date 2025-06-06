const admin = require('firebase-admin');
const { serviceAccount } = require("./service")
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

module.exports = { admin };