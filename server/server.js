const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const db = require('./models');

// Load env vars
dotenv.config();

// Memuat semua file rute yang kita butuhkan
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const packageRoutes = require('./routes/packageRoutes');
const themeRoutes = require('./routes/themeRoutes');
const orderRoutes = require('./routes/orderRoutes'); // <-- Pastikan ini ada
const invitationRoutes = require('./routes/invitationRoutes'); // <-- Dan ini juga
const clientRoutes = require('./routes/clientRoutes');


const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Mendaftarkan semua rute ke aplikasi Express
app.use('/api/auth', authRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/themes', themeRoutes);
app.use('/api/orders', orderRoutes); // <-- Pastikan baris ini ada
app.use('/api/invitations', invitationRoutes);
app.use('/api/client', clientRoutes);


app.get('/', (req, res) => {
    res.send('API Mimdi Invitation Berjalan!');
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await db.sequelize.sync({ alter: true }); 
        console.log('Database terhubung dan tersinkronisasi...');

        app.listen(PORT, () => {
            console.log(`Server berjalan di lingkungan ${process.env.NODE_ENV} pada port ${PORT}`);
        });
    } catch (error) {
        console.error('Gagal menghubungkan ke database:', error);
        process.exit(1);
    }
};

startServer();

