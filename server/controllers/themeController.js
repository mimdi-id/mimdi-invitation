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
    const { name, tier, component_name, config } = req.body;
    
    try {
        const newTheme = await db.Theme.create({
            name,
            tier,
            component_name,
            config: config ? JSON.parse(config) : {},
            // Simpan path gambar pratinjau jika ada
            preview_image_url: req.file ? `/uploads/${req.file.filename}` : null
        });
        res.status(201).json({ success: true, data: newTheme });
    } catch (error) {
        console.error('Error saat membuat tema:', error);
        res.status(500).json({ success: false, error: 'Server Error' });
    }
};

// @desc    Update a theme
// @route   PUT /api/themes/:id
// @access  Private/SuperAdmin
exports.updateTheme = async (req, res) => {
    const { id } = req.params;
    const { name, tier, component_name, config } = req.body;

    try {
        const theme = await db.Theme.findByPk(id);
        if (!theme) {
            return res.status(404).json({ success: false, error: 'Tema tidak ditemukan.' });
        }

        theme.name = name;
        theme.tier = tier;
        theme.component_name = component_name;
        theme.config = config ? JSON.parse(config) : theme.config;
        if (req.file) {
            theme.preview_image_url = `/uploads/${req.file.filename}`;
        }
        
        await theme.save();
        res.status(200).json({ success: true, data: theme });
    } catch (error) {
        console.error('Error saat memperbarui tema:', error);
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
