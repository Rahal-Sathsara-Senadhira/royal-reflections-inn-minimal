-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  room_id INT NOT NULL,
  guest_name VARCHAR(120) NOT NULL,
  guest_email VARCHAR(160) NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  status ENUM('booked','checked_in','checked_out','cancelled') NOT NULL DEFAULT 'booked',
  total_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (room_id) REFERENCES rooms(id)
);

-- Some demo rows (safe with IGNORE to avoid duplicates)
INSERT IGNORE INTO bookings (id, room_id, guest_name, guest_email, check_in, check_out, status, total_price) VALUES
  (1, (SELECT id FROM rooms WHERE number='101' LIMIT 1), 'Alice Johnson', 'alice@demo.com', CURDATE(), DATE_ADD(CURDATE(), INTERVAL 2 DAY), 'booked', 160.00),
  (2, (SELECT id FROM rooms WHERE number='201' LIMIT 1), 'Bob Singh', 'bob@demo.com', DATE_ADD(CURDATE(), INTERVAL 3 DAY), DATE_ADD(CURDATE(), INTERVAL 6 DAY), 'booked', 360.00);
