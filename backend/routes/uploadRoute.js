const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { authenticateToken, requireInstructor } = require('../middleware/auth');

// storage config: keep videos and pdfs under public/media
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let dest = 'public/media/other';
        if (file.mimetype.startsWith('video')) dest = 'public/media/videos';
        else if (file.mimetype === 'application/pdf') dest = 'public/media/pdfs';
        fs.mkdirSync(dest, { recursive: true });
        cb(null, dest);
    },
    filename: function (req, file, cb) {
        const unique = Date.now() + '-' + file.originalname.replace(/\s+/g, '_');
        cb(null, unique);
    }
});

const upload = multer({ storage });

router.post('/', authenticateToken, requireInstructor, upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No file' });
    // return the public path for DB
    const publicPath = '/media/' + req.file.path.split('public/media/')[1].replace(/\\/g, '/');
    res.json({ path: publicPath });
});

module.exports = router;
