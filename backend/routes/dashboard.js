// Example: backend/routes/dashboard.js
app.get("/api/dashboard/:userId", async (req, res) => {
    const userId = req.params.userId;

    // Enrolled courses
    const enrolledQuery = `
      SELECT c.*
      FROM courses c
      JOIN enrollments e ON e.course_id = c.id
      WHERE e.user_id = ?
    `;

    // Upcoming courses (start date in future)
    const upcomingQuery = `
      SELECT *
      FROM courses
      WHERE start_date > CURDATE()
      ORDER BY start_date ASC
    `;

    try {
        const enrolled = await db.query(enrolledQuery, [userId]);
        const upcoming = await db.query(upcomingQuery);
        res.json({ enrolled: enrolled[0], upcoming: upcoming[0] });
    } catch (err) {
        console.log(err);
        res.status(500).send("Server Error");
    }
});
