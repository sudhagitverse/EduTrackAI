import React, { useState } from 'react';
import API from '../api';

export default function TeacherUpload() {
    const [courseId, setCourseId] = useState('');
    const [title, setTitle] = useState('');
    const [file, setFile] = useState(null);
    const [type, setType] = useState('video');

    async function upload(e) {
        e.preventDefault();
        if (!file || !courseId) return alert('choose file and course id');
        const fd = new FormData();
        fd.append('file', file);
        fd.append('title', title);
        fd.append('content_type', type);
        fd.append('position', 0);

        try {
            // upload file first
            const resFile = await API.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
            // then create lesson with returned path
            const content_url = resFile.data.path; // server returns /media/...
            await API.post(`/lessons/${courseId}`, { title, content_type: type, content_url });
            alert('Uploaded');
        } catch (e) { console.error(e); alert('Error'); }
    }

    return (
        <form onSubmit={upload} style={{ padding: 20 }}>
            <h2>Teacher Upload</h2>
            <input placeholder="Course ID" value={courseId} onChange={e => setCourseId(e.target.value)} /><br />
            <input placeholder="Lesson title" value={title} onChange={e => setTitle(e.target.value)} /><br />
            <select value={type} onChange={e => setType(e.target.value)}>
                <option value="video">video</option>
                <option value="pdf">pdf</option>
                <option value="text">text</option>
            </select><br />
            <input type="file" onChange={e => setFile(e.target.files[0])} /><br />
            <button type="submit">Upload</button>
        </form>
    );
}
