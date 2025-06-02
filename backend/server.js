const express = require('express');
const PORT = process.env.PORT || 3000;
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.get('/', (req, res) => {
    res.send('Welcome to the backend server!');
});

app.post("/api/auth/signup", (req, res) => {
    const { email, password } = req.body;

    console.log(`User signed up: ${email}`);
    res.status(201).json({ message: 'User signed up successfully', user: { email } });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});