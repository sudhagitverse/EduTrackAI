const express = require('express');
const cors = require('cors');
const path = require('path');
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

// serve uploaded media files
app.use('/media', express.static(__dirname + '/public/media'));
app.use('/lessons', express.static(path.join(__dirname, 'public/lessons')));

// mount routes with /api prefix
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/upload', uploadRoute);

app.get('/', (req, res) => {
    res.send('EduTrack API is running...');
});

const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`Server running on port ${port}`));
