USE worklog;

CREATE TABLE work_entries
(
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  units DECIMAL
  (5,2) NOT NULL, -- hours worked
  job_type ENUM
  (
    'consulting',
    'peer_review',
    'training',
    'documentation',
    'quality_assurance'
  ) NOT NULL,
  work_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY
  (user_id) REFERENCES users
  (id)
);
