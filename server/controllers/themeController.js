const db = require('../models');
const Theme = db.Theme;

// @desc    Get all themes
// @route   GET /api/themes
// @access  Private/SuperAdmin
exports.getAllThemes = async (req, res) => {
    try {
        const themes = await Theme.findAll();
        res.status(200).json({ success: true, data: themes });
    } catch (error) {
        console.error('Error fetching themes:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Create a theme
// @route   POST /api/themes
// @access  Private/SuperAdmin
exports.createTheme = async (req, res) => {
    try {
        const newTheme = await Theme.create(req.body);
        res.status(201).json({ success: true, data: newTheme });
    } catch (error) {
        console.error('Error creating theme:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Update a theme
// @route   PUT /api/themes/:id
// @access  Private/SuperAdmin
exports.updateTheme = async (req, res) => {
    try {
        const theme = await Theme.findByPk(req.params.id);
        if (!theme) {
            return res.status(404).json({ success: false, error: 'Tema tidak ditemukan' });
        }
        await theme.update(req.body);
        res.status(200).json({ success: true, data: theme });
    } catch (error) {
        console.error('Error updating theme:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Delete a theme
// @route   DELETE /api/themes/:id
// @access  Private/SuperAdmin
exports.deleteTheme = async (req, res) => {
    try {
        const theme = await Theme.findByPk(req.params.id);
        if (!theme) {
            return res.status(404).json({ success: false, error: 'Tema tidak ditemukan' });
        }
        await theme.destroy();
        res.status(200).json({ success: true, message: 'Tema berhasil dihapus' });
    } catch (error) {
        console.error('Error deleting theme:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};
