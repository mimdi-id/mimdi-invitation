const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const db = require('./models'); // Import folder models (index.js)

// Load env vars
dotenv.config();

// Route files
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/admins', adminRoutes);

app.get('/', (req, res) => {
    res.send('API Mimdi Invitation Berjalan!');
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        // Sinkronisasi database
        await db.sequelize.sync(); 
        console.log('Database terhubung dan tersinkronisasi...');

        // Jalankan server
        app.listen(PORT, () => {
            console.log(`Server berjalan di lingkungan ${process.env.NODE_ENV} pada port ${PORT}`);
        });
    } catch (error) {
        console.error('Gagal menghubungkan ke database:', error);
        process.exit(1); // Keluar dari aplikasi jika koneksi database gagal
    }
};

startServer();

