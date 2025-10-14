-- schema_swayam.sql
CREATE DATABASE IF NOT EXISTS edutrack_ai;
USE edutrack_ai;

-- users
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150),
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  role ENUM('student','instructor') DEFAULT 'student',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- courses
CREATE TABLE IF NOT EXISTS courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  instructor VARCHAR(150),
  start_date DATETIME,
  end_date DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- lessons: lessons have content_type and content_url. release_date controls unlocking.
CREATE TABLE IF NOT EXISTS lessons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  course_id INT,
  title VARCHAR(255),
  content_type ENUM('video','pdf','text') DEFAULT 'video',
  content_url TEXT,          -- path like /media/videos/xxx.mp4 or HTML text for 'text'
  release_date DATETIME,     -- lesson unlock time (NULL = available)
  position INT DEFAULT 0,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- enrollments
CREATE TABLE IF NOT EXISTS enrollments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  course_id INT,
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  UNIQUE KEY (user_id, course_id)
);

-- progress: track completed lessons
CREATE TABLE IF NOT EXISTS progress (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  lesson_id INT,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
  UNIQUE KEY (user_id, lesson_id)
);
CREATE TABLE course_content (
    id INT AUTO_INCREMENT PRIMARY KEY,
    course_id INT,
    type ENUM('video', 'pdf', 'quiz'),
    title VARCHAR(255),
    file_path VARCHAR(255),
    FOREIGN KEY(course_id) REFERENCES courses(id)
);


-- quizzes (optional)
CREATE TABLE IF NOT EXISTS quizzes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lesson_id INT,
  question TEXT,
  options JSON,
  answer VARCHAR(255),
  FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
);
