const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const lessonRoutes = require('./routes/lessonRoutes');
const progressRoutes = require('./routes/progressRoutes');
const uploadRoute = require('./routes/uploadRoute');

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Serve static media (PDFs, images, small files)
app.use('/media', express.static(path.join(__dirname, 'public/media')));
// You can keep this for fallback, but it's better to use /stream for videos
app.use('/lessons', express.static(path.join(__dirname, 'public/lessons')));

/* -----------------------------------------------------
   ✅ STREAMING ROUTE — Supports .mp4, .webm (no Range errors)
------------------------------------------------------ */
app.get('/stream/:course/:filename', (req, res) => {
    const { course, filename } = req.params;
    const filePath = path.join(__dirname, 'public', 'lessons', course, filename);

    if (!fs.existsSync(filePath)) {
        return res.status(404).send('Video file not found');
    }

    // Auto-detect content type
    let contentType = 'video/mp4';
    if (filename.toLowerCase().endsWith('.webm')) {
        contentType = 'video/webm';
    } else if (filename.toLowerCase().endsWith('.mkv')) {
        contentType = 'video/x-matroska';
    }

    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (!range) {
        res.writeHead(200, {
            'Content-Length': fileSize,
            'Content-Type': contentType,
        });
        fs.createReadStream(filePath).pipe(res);
        return;
    }

    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    if (start >= fileSize) {
        res.status(416).send(`Requested range not satisfiable\n${start} >= ${fileSize}`);
        return;
    }

    const chunkSize = (end - start) + 1;
    const file = fs.createReadStream(filePath, { start, end });
    const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': contentType,
    };

    res.writeHead(206, head);
    file.pipe(res);
});

/* -----------------------------------------------------
   🧾 VIDEO LISTING ROUTE — Returns all videos in a course folder
------------------------------------------------------ */
app.get('/api/videos/:course', (req, res) => {
    const { course } = req.params;
    const coursePath = path.join(__dirname, 'public', 'lessons', course);

    if (!fs.existsSync(coursePath)) {
        return res.status(404).json({ error: 'Course not found' });
    }

    const files = fs.readdirSync(coursePath).filter(file => {
        return file.endsWith('.mp4') || file.endsWith('.webm') || file.endsWith('.mkv');
    });

    const videoList = files.map(file => ({
        filename: file,
        url: `/stream/${course}/${encodeURIComponent(file)}`,
    }));

    res.json({ course, videos: videoList });
});

/* -----------------------------------------------------
   📚 API ROUTES
------------------------------------------------------ */
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/upload', uploadRoute);

app.get('/', (req, res) => {
    res.send('EduTrack API is running...');
});

/* -----------------------------------------------------
   🚀 START SERVER
------------------------------------------------------ */
const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`✅ Server running on port ${port}`));
