const db = require('../models');
const Package = db.Package;

// @desc    Get all packages
// @route   GET /api/packages
// @access  Private/SuperAdmin
exports.getAllPackages = async (req, res) => {
    try {
        const packages = await Package.findAll();
        res.status(200).json({ success: true, data: packages });
    } catch (error) {
        console.error('Error fetching packages:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Create a package
// @route   POST /api/packages
// @access  Private/SuperAdmin
exports.createPackage = async (req, res) => {
    try {
        const newPackage = await Package.create(req.body);
        res.status(201).json({ success: true, data: newPackage });
    } catch (error) {
        console.error('Error creating package:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Update a package
// @route   PUT /api/packages/:id
// @access  Private/SuperAdmin
exports.updatePackage = async (req, res) => {
    try {
        const pkg = await Package.findByPk(req.params.id);
        if (!pkg) {
            return res.status(404).json({ success: false, error: 'Paket tidak ditemukan' });
        }
        await pkg.update(req.body);
        res.status(200).json({ success: true, data: pkg });
    } catch (error) {
        console.error('Error updating package:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Delete a package
// @route   DELETE /api/packages/:id
// @access  Private/SuperAdmin
exports.deletePackage = async (req, res) => {
    try {
        const pkg = await Package.findByPk(req.params.id);
        if (!pkg) {
            return res.status(404).json({ success: false, error: 'Paket tidak ditemukan' });
        }
        await pkg.destroy();
        res.status(200).json({ success: true, message: 'Paket berhasil dihapus' });
    } catch (error) {
        console.error('Error deleting package:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
