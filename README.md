# 🎓 Online Distance Learning System

A full-featured web application that enables remote teaching and learning. Built with **Node.js**, **Express**, **MySQL**, and **EJS**, it supports instructors in creating multimedia-rich courses and allows students to enroll, participate, and download completion certificates.

---

## 🚀 Features

### 👩‍🏫 Instructor Panel
- Register and log in
- Create, update, and delete courses
- Upload course media (Videos, PDFs, Images)
- View and reply to student questions

### 👨‍🎓 Student Panel
- Register and log in
- View and enroll in courses
- View multimedia lessons
- Post questions/comments
- Complete courses and download PDF certificate

### 📁 Media Support
- **Video**: MP4 files displayed using `<video>` tags
- **PDF**: Linked and openable in new tabs
- **Image**: Rendered directly within course view

---

## 📁 Project Structure

online-distance-learning/
│
├── controllers/ # Logic for routes and business
├── models/ # DB configuration and query methods
├── public/
│ ├── css/ # Custom styles
│ ├── images/ # Logo and default assets
│ └── uploads/ # Uploaded media files
├── routes/ # Express route files
├── views/
│ ├── auth/ # Login and registration
│ ├── instructor/ # Instructor dashboard & views
│ ├── student/ # Student dashboard & views
│ └── partials/ # Header, footer, navbar
├── .env # Environment variables
├── app.js # Entry point
└── README.md # You're here!


---

## ⚙️ Tech Stack

| Tech           | Purpose                          |
|----------------|----------------------------------|
| Node.js        | Runtime                          |
| Express.js     | Server framework                 |
| MySQL          | Database                         |
| EJS            | Templating engine                |
| multer         | File uploads                     |
| moment.js      | Time formatting                  |
| pdfkit         | PDF certificate generation       |
| express-session| Authentication (sessions)        |

---

## 🛠 Setup & Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/online-distance-learning.git
cd online-distance-learning

2. Install Dependencies
  npm install

3. Create .env File
Create a .env file in the root directory:
  PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=distance_learning
SESSION_SECRET=your_session_secret

4. Setup Database
Create the MySQL database and tables manually or using a schema script:

CREATE DATABASE distance_learning;

USE distance_learning;

-- Users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('student', 'instructor') DEFAULT 'student',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Courses table
CREATE TABLE courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  instructor_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (instructor_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Media files table
CREATE TABLE media_files (
  id INT AUTO_INCREMENT PRIMARY KEY,
  course_id INT NOT NULL,
  filename VARCHAR(255) NOT NULL,
  file_type ENUM('video', 'pdf', 'image'),
  uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- Comments table
CREATE TABLE comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  course_id INT NOT NULL,
  student_id INT NOT NULL,
  comment TEXT NOT NULL,
  instructor_reply TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Completions table
CREATE TABLE completions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  course_id INT NOT NULL,
  completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

5. Run the Server
  node app.js

Visit the app in your browser at http://localhost:3000

Made with ❤️ by [Nwafor miracle]


---

Let me know if you want:
- A version with clickable GitHub links
- Upload instructions to GitHub
- A short version for documentation sites like `jsdoc` or `apidoc`
