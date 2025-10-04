module.exports = (sequelize, DataTypes) => {
    const Package = sequelize.define('Package', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        active_period_months: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        photo_limit: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        revisions_limit: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        features: {
            type: DataTypes.JSON, // Menyimpan fitur tambahan sebagai JSON
            allowNull: true,
        },
    });

    return Package;
};
