-- Create table if it never existed
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin','staff','guest') NOT NULL DEFAULT 'staff',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- If the table exists but some columns are missing, add them
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255) NOT NULL AFTER email,
  ADD COLUMN IF NOT EXISTS role ENUM('admin','staff','guest') NOT NULL DEFAULT 'staff' AFTER password_hash,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP AFTER role;

-- Optional: seed an admin account if it doesn't exist
-- password = admin123
INSERT INTO users (name, email, password_hash, role)
SELECT 'Admin', 'admin@rri.local', '$2a$10$8k3i3dY7mL1b4dFfYcZ8V.Jx8Ma0qfT0z2mS8hS9fQ8x0m3w9N6de', 'admin'
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@rri.local');
