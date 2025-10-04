/**
 * Middleware untuk memeriksa apakah pengguna yang login memiliki peran 'Super Admin'.
 * Middleware ini harus digunakan setelah authMiddleware.
 * Data peran pengguna sudah diambil saat login dan tersedia di req.user.role.
 */
const isSuperAdmin = (req, res, next) => {
    try {
        // Memeriksa apakah objek req.user ada (dibuat oleh authMiddleware),
        // lalu memeriksa apakah di dalamnya ada objek role,
        // dan terakhir memeriksa apakah properti 'name' dari objek role itu adalah 'Super Admin'.
        if (req.user && req.user.role && req.user.role.name === 'Super Admin') {
            
            // Jika semua kondisi terpenuhi, berarti pengguna adalah Super Admin.
            // Izinkan permintaan untuk melanjutkan ke controller selanjutnya.
            next();

        } else {
            // Jika salah satu kondisi tidak terpenuhi, pengguna bukan Super Admin.
            // Kirim respons 403 Forbidden (Akses Ditolak).
            res.status(403).json({ success: false, error: 'Akses ditolak. Membutuhkan peran Super Admin.' });
        }
    } catch (err) {
        // Menangani error tak terduga di dalam middleware
        console.error('Error di middleware isSuperAdmin:', err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = isSuperAdmin;

