const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const db = require('./models');

// Load env vars
dotenv.config();

// Memuat semua file rute
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const packageRoutes = require('./routes/packageRoutes');
const themeRoutes = require('./routes/themeRoutes');
const orderRoutes = require('./routes/orderRoutes');
const invitationRoutes = require('./routes/invitationRoutes');
const clientRoutes = require('./routes/clientRoutes');
const rsvpRoutes = require('./routes/rsvpRoutes');

const app = express();

// --- PERBAIKAN KRITIS DI SINI: KONFIGURASI CORS YANG LEBIH BAIK ---
// Konfigurasi ini secara eksplisit memberitahu server untuk mengizinkan
// permintaan dari origin frontend kita.
const corsOptions = {
  origin: 'http://localhost:5173', // Izinkan hanya alamat ini
  optionsSuccessStatus: 200 
};
app.use(cors(corsOptions));
// -----------------------------------------------------------------

// Middleware
app.use(express.json());

// Middleware untuk menyajikan file statis dari folder 'uploads'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mendaftarkan semua rute
app.use('/api/auth', authRoutes);
app.use('/api/admins', adminRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/themes', themeRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/invitations', invitationRoutes);
app.use('/api/client', clientRoutes);
app.use('/api/rsvps', rsvpRoutes);

// Rute dasar
app.get('/', (req, res) => {
    res.send('API Mimdi Invitation Berjalan!');
});

const PORT = process.env.PORT || 5000;

// Fungsi untuk memulai server
const startServer = async () => {
    try {
        await db.sequelize.sync({ alter: true }); 
        console.log('Database terhubung dan tersinkronisasi...');
        app.listen(PORT, () => {
            console.log(`Server berjalan di lingkungan ${process.env.NODE_ENV} pada port ${PORT}`);
        });
    } catch (error) {
        console.error('Gagal menghubungkan atau menyinkronkan database:', error);
        process.exit(1);
    }
};

startServer();

