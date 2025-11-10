-- Create room_types and rooms if they don't exist
CREATE TABLE IF NOT EXISTS room_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS rooms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  number VARCHAR(20) NOT NULL UNIQUE,
  type_id INT NOT NULL,
  beds TINYINT NOT NULL DEFAULT 1,
  price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  status ENUM('available','occupied','maintenance') NOT NULL DEFAULT 'available',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (type_id) REFERENCES room_types(id)
);

-- Seed types (ignores if already there)
INSERT IGNORE INTO room_types (id, name) VALUES
  (1,'Standard'),
  (2,'Deluxe'),
  (3,'Suite');

-- Optional demo rooms (safe to keep or remove)
INSERT IGNORE INTO rooms (number, type_id, beds, price, status) VALUES
  ('101', 1, 1, 80.00, 'available'),
  ('102', 1, 2, 95.00, 'occupied'),
  ('201', 2, 1, 120.00, 'available'),
  ('301', 3, 2, 180.00, 'maintenance');
