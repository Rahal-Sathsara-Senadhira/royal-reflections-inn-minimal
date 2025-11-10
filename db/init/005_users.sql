-- Users table (safe if it already exists)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin','staff','guest') NOT NULL DEFAULT 'staff',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Optional: seed an admin (only if email not taken)
INSERT IGNORE INTO users (name, email, password_hash, role)
VALUES ('Admin', 'admin@rri.local', '$2a$10$8k3i3dY7mL1b4dFfYcZ8V.Jx8Ma0qfT0z2mS8hS9fQ8x0m3w9N6de', 'admin');
-- password for this seed hash = admin123
