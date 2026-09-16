create database portfolio_db;
use portfolio_db;
CREATE TABLE admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE profile (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    title VARCHAR(150),
    about TEXT,
    email VARCHAR(150),
    phone VARCHAR(30),
    location VARCHAR(200),
    profile_image VARCHAR(255),
    resume VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE education (
    id INT AUTO_INCREMENT PRIMARY KEY,
    degree VARCHAR(200) NOT NULL,
    institution VARCHAR(250),
    board VARCHAR(150),
    start_year YEAR,
    end_year YEAR,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    skill_name VARCHAR(100) NOT NULL,
    skill_level INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(1000) NOT NULL,
    description TEXT,
    technologies VARCHAR(500),
    github_url VARCHAR(1000),
    live_url VARCHAR(500),
    image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE certificates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    organization VARCHAR(200),
    issue_date DATE,
    certificate_file VARCHAR(255),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE social_links (
    id INT AUTO_INCREMENT PRIMARY KEY,
    platform VARCHAR(100) NOT NULL,
    url VARCHAR(500) NOT NULL,
    icon VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    subject VARCHAR(250),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO profile
(name, title, about, email, phone, location)
VALUES
(
    'Devjoyti Ball',
    'Frontend Developer',
    'I am a frontend developer with knowledge of designing website pages using HTML, CSS, and JavaScript. I am also interested in full-stack web development and enjoy creating responsive and user-friendly websites.',
    'devjoytiball.24@gmail.com',
    '7992208181',
    'Madhupur, Jharkhand, India'
);
INSERT INTO education
(degree, institution, board, start_year, end_year)
VALUES
(
    'Secondary (Class X)',
    'Mothers International Academy',
    'CBSE',
    2019,
    2020
);
INSERT INTO education
(degree, institution, board, start_year, end_year)
VALUES
(
    'Senior Secondary (Class XII)',
    'Mothers International Academy',
    'CBSE',
    2021,
    2022
);
INSERT INTO education
(degree, institution, board, start_year, end_year)
VALUES
(
    'B.Tech in Computer Science & Engineering',
    'Bengal College of Engineering and Technology',
    NULL,
    2023,
    2027
);
INSERT INTO skills (skill_name, skill_level)
VALUES
('HTML', 90),
('CSS', 85),
('JavaScript', 80),
('Bootstrap', 85),
('Node.js', 75),
('MySQL', 75),
('C', 70),
('Python', 70);
use portfolio_db;
INSERT INTO projects
(title, description, technologies, github_url, live_url)
VALUES
(
    'Tic Tac Toe Game',
    'A responsive Tic Tac Toe game built using HTML, CSS and JavaScript.',
    'HTML, CSS, JavaScript',
    NULL,
    'https://devjoytiball24.github.io/Tic-Tac-Toe/'
),
(
    'Rock Paper Scissors Game',
    'A responsive Rock Paper Scissors game built using HTML, CSS and JavaScript.',
    'HTML, CSS, JavaScript',
    NULL,
    'https://devjoytiball24.github.io/Rock-Paper-Scissors/'
),
(
    'Portfolio Website',
    'A personal portfolio website showcasing my skills, projects, certificates and resume.',
    'HTML, CSS, JavaScript, Bootstrap',
    NULL,
    'https://devjoytiball.github.io/decodelab/'
);
INSERT INTO social_links (platform, url, icon)
VALUES
(
    'LinkedIn',
    'www.linkedin.com/in/devjoyti-ball-71a228291',
    'linkedin'
);
use portfolio_db;
SELECT id, title, image FROM projects;
UPDATE projects
SET image = 'tic-tac-toe.jpg'
WHERE title = 'Tic Tac Toe Game';

UPDATE projects
SET image = 'rock-paper-scissors.jpg'
WHERE title = 'Rock Paper Scissors Game';

UPDATE projects
SET image = 'portfolio.jpg'
WHERE title = 'Portfolio Website';
use portfolio_db;
SELECT id, title, image FROM projects
ORDER BY id;

delete from projects
where id in (4,5,6);
use portfolio_db;
DESCRIBE certificates;
use portfolio_db;
delete from certificates;
INSERT INTO certificates
(title, organization, issue_date, description, certificate_file)
VALUES

(
    'Python Full Stack Development With Project Virtual Internship',
    'EduSkills Academy',
    '2026-06-30',
    'Successfully completed an 8-weeks Python Full Stack Development virtual internship with project.',
    'python-full-stack.jpg'
),

(
    'Full Stack Development Virtual Internship',
    'DecodeLabs',
    '2026-09-04',
    'Successfully completed the DecodeLabs Virtual Internship Program in Full Stack Development.',
    'full-stack-decode-labs.jpg'
),

(
    'Cloud Virtual Internship',
    'AWS Academy',
    '2025-12-31',
    'Successfully completed a 10-week Cloud Virtual Internship with curriculum provided by AWS Academy.',
    'cloud-aws.jpg'
);
select*from certificates;
use portfolio_db;
select id,title,certificate_file from certificates;
use portfolio_db;
update certificates
set certificate_file='web-development.jpg'
where title='Full Stack Development Virtual Internship';
select id,title,certificate_file from certificates;
use portfolio_db;
update certificates
set certificate_file='python.jpg'
where id=1;
select id,title,certificate_file from certificates;
update certificates
set certificate_file='javascript.jpg'
where id=3;
select id,title,certificate_file from certificates;
use portfolio_db;
CREATE TABLE contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
DESCRIBE contact_messages;
use portfolio_db;
select*FROM contact_messages;
use portfolio_db;
describe admins;
use portfolio_db;
INSERT INTO admins
(username, password)
VALUES
(
    'admin',
    '$2b$10$6gwXpPa5ihMqq2L7Y001eOjoKwG.a7TWy.jJODiqU0dwhnSLL/O/G'
);
SELECT id, username, created_at
FROM admins;
use portfolio_db;
CREATE TABLE projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    technologies VARCHAR(500),
    github_url VARCHAR(500),
    live_url VARCHAR(500),
    image VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
use portfolio_db;
DESCRIBE projects;
use portfolio_db;
CREATE TABLE certificates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    issuer VARCHAR(255),
    description TEXT,
    certificate_image VARCHAR(500),
    certificate_url VARCHAR(500),
    issue_date VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
use portfolio_db;
select id,title,certificate_image
from certificates;
update certificates
set certificate_image='javascript.jpg'
WHERE id =3;
update certificates
set certificate_image='python.jpg'
WHERE id =2;
update certificates
set certificate_image='web-development.jpg'
WHERE id =1;
use portfolio_db;
DESCRIBE certificates;
use portfolio_db;
CREATE TABLE certificates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    issuer VARCHAR(255),
    description TEXT,
    certificate_image VARCHAR(500),
    certificate_url VARCHAR(500),
    issue_date VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
describe certificates;
use portfolio_db;
CREATE TABLE resume (
    id INT AUTO_INCREMENT PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

show tables;
use portfolio_db;
select*from portfolio_db.resume;
use portfolio_db;

drop table if EXISTS resume;
CREATE TABLE resume (
    id INT AUTO_INCREMENT PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
show Tables;
select*from resume;

USE portfolio_db;

CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150),
    phone VARCHAR(20),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
show tables;
describe messages;
drop table if EXISTS messages;
USE portfolio_db;

CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150),
    phone VARCHAR(20),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
use portfolio_db;
show tables;
SELECT COUNT(*) FROM projects;

SELECT COUNT(*) FROM certificates;

SELECT COUNT(*) FROM messages;

SELECT COUNT(*) FROM resume;
USE portfolio_db;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
USE portfolio_db;

SHOW TABLES;
use portfolio_db;
describe admins;
USE portfolio_db;

DESCRIBE projects;
USE portfolio_db;

SELECT id, title, image FROM projects;
use portfolio_db;
SELECT*from messages;