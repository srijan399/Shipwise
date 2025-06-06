const prismaClient = require("@prisma/client");
const { parse } = require("dotenv");
const prisma = new prismaClient.PrismaClient();

const getTransporters = async (req, res) => {
    try {
        const transporters = await prisma.transporter.findMany();
        res.json({ transporters: transporters, ok: true });
    } catch (error) {
        console.error('Error fetching transporters:', error);
        res.status(500).json({ error: 'Failed to fetch transporters' });
    }
}

const createTransporter = (req, res) => {
    const body = req.body;
    const { name, contact, vehicleType, capacity, status } = body;

    if (!name || !contact || !vehicleType || !capacity || !status) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    prisma.transporter.create({
        data: {
            name,
            contact,
            vehicleType,
            capacity: parseInt(capacity),
            status
        }
    })
        .then(transporter => {
            res.status(201).json({ message: 'Transporter created successfully', transporter });
        })
        .catch(error => {
            console.error('Error creating transporter:', error);
            res.status(500).json({ error: 'Failed to create transporter' });
        });
}

const deleteTransporter = async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.transporter.delete({
            where: { id: id }
        });
        res.status(200).json({ message: 'Transporter deleted successfully', ok: true });
    } catch (error) {
        console.error('Error deleting transporter:', error);
        res.status(500).json({ error: 'Failed to delete transporter', ok: false });
    }
}

module.exports = {
    getTransporters,
    createTransporter,
    deleteTransporter
}