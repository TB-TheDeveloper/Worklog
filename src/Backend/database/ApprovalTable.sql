USE worklog;

CREATE TABLE approvals
(
  id INT
  AUTO_INCREMENT PRIMARY KEY,
  work_entry_id INT NOT NULL,
  supervisor_id INT NOT NULL,
  action ENUM
  ('approved', 'rejected') NOT NULL,
  comment TEXT,
  action_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY
  (work_entry_id) REFERENCES work_entries
  (id),
  FOREIGN KEY
  (supervisor_id) REFERENCES users
  (id)
);

ALTER TABLE work_entries
ADD COLUMN action ENUM('approved', 'rejected') NULL;
