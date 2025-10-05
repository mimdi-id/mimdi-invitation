const db = require('../models');
const bcrypt = require('bcryptjs');

const seedData = async () => {
    try {
        await db.sequelize.sync({ force: true });
        console.log('✅ Semua tabel telah dihapus dan dibuat ulang.');

        const superAdminRole = await db.Role.create({ name: 'Super Admin' });
        const adminRole = await db.Role.create({ name: 'Admin' });
        const userRole = await db.Role.create({ name: 'User' });
        console.log('✅ Roles "Super Admin", "Admin", dan "User" berhasil dibuat.');

        const defaultPassword = 'mimdi123';
        // Enkripsi password secara eksplisit di sini
        const hashedPassword = await bcrypt.hash(defaultPassword, 10);

        await db.User.create({
            username: 'mimdi',
            password: hashedPassword, // Simpan password yang sudah di-hash
            roleId: superAdminRole.id,
            invitation_quota: 999
        });

        console.log('✅ User Super Admin default berhasil dibuat.');
        console.log('=========================================');
        console.log('Login Super Admin:');
        console.log(`   Username: mimdi`);
        console.log(`   Password: ${defaultPassword}`);
        console.log('=========================================');

    } catch (error) {
        console.error('❌ Error saat menjalankan seeder:', error);
    } finally {
        await db.sequelize.close();
        console.log('🔌 Koneksi database ditutup.');
    }
};

seedData();

