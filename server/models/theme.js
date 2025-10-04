module.exports = (sequelize, DataTypes) => {
    const Theme = sequelize.define('Theme', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        tier: {
            type: DataTypes.ENUM('Basic', 'Premium', 'Custom'),
            allowNull: false,
        },
        // Menyimpan konfigurasi spesifik tema, seperti warna, font, dll.
        config: {
            type: DataTypes.JSON,
            allowNull: true,
        },
        preview_image_url: {
            type: DataTypes.STRING,
            allowNull: true,
        }
    });

    return Theme;
};
