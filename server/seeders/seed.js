const db = require('../models');
const bcrypt = require('bcryptjs');

const seedData = async () => {
    try {
        await db.sequelize.sync({ force: true });
        console.log('Semua tabel telah dihapus dan dibuat ulang.');

        // 1. Buat Roles
        const superAdminRole = await db.Role.create({ name: 'Super Admin' });
        const adminRole = await db.Role.create({ name: 'Admin' });
        console.log('Roles "Super Admin" dan "Admin" berhasil dibuat.');

        // 2. Buat User Super Admin Default
        const defaultPassword = 'mimdi123';
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);

        await db.User.create({
            username: 'mimdi',
            password: hashedPassword,
            roleId: superAdminRole.id, // Menggunakan ID dari role yang baru dibuat
            invitation_quota: 999
        });

        console.log('User Super Admin default berhasil dibuat.');
        console.log('=========================================');
        console.log('Silakan login dengan kredensial berikut:');
        console.log(`Username: mimdi`);
        console.log(`Password: ${defaultPassword}`);
        console.log('=========================================');

    } catch (error) {
        console.error('Error saat menjalankan seeder:', error);
    } finally {
        // Tutup koneksi database setelah selesai
        await db.sequelize.close();
        console.log('Koneksi database ditutup.');
    }
};

seedData();