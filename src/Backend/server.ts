import express, { type Request, type Response } from "express";
import mysql, { type OkPacket } from "mysql2";

import cors from "cors";
import type { CreateUser, CreateWorkEntryBody, WorkEntry } from "../Types";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// DB connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("DB connection failed:", err);
    process.exit(1);
  }
  console.log("Connected to MySQL");
});

// Get all work entries
app.get("/api/work-entries", (req: Request, res: Response) => {
  const sql = `
    SELECT we.id, u.name, we.units, we.job_type, we.work_date
    FROM work_entries we
    JOIN users u ON we.user_id = u.id
    WHERE we.action IS NULL
    ORDER BY we.work_date DESC
  `;

  db.query<WorkEntry[]>(sql, (err, results) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.json(results);
  });
});

// Create work entry
app.post(
  "/api/work-entries",
  (req: Request<{}, {}, CreateWorkEntryBody>, res: Response) => {
    const { userId, units, jobType, workDate } = req.body;

    const sql = `
      INSERT INTO work_entries (user_id, units, job_type, work_date)
      VALUES (?, ?, ?, ?)
    `;

    db.query(sql, [userId, units, jobType, workDate], (err) => {
      if (err) {
        return res.status(500).json(err);
      }
      res.status(201).json({ message: "Entry created" });
    });
  },
);

app.delete("/api/work-entries/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  const sql = `
    DELETE FROM work_entries
    WHERE id = ?`;

  db.query(sql, [id], (err) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.status(200).json({ message: "Entry deleted" });
  });
});

app.post("/api/user", (req: Request<{}, {}, CreateUser>, res: Response) => {
  const { name } = req.body;

  const sql = `
      INSERT INTO users (name)
      VALUES (?)
    `;

  db.query(sql, [name], (err) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.status(201).json({ message: "User created" });
  });
});

app.get("/api/users", (req: Request, res: Response) => {
  const sql = `
    SELECT id, name
    FROM users
    ORDER BY name
  `;

  db.query<CreateUser[]>(sql, (err, results) => {
    if (err) {
      return res.status(500).json(err);
    }
    res.json(results);
  });
});

app.put(
  "/api/user/:id",
  (req: Request<{ id: string }, {}, CreateUser>, res: Response) => {
    const { id } = req.params;
    const { name } = req.body;

    const userId = parseInt(id, 10);
    if (isNaN(userId)) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    const sql = `
      UPDATE users
      SET name = ?
      WHERE id = ?
    `;

    db.query(sql, [name, userId], (err, result: OkPacket) => {
      if (err) {
        return res.status(500).json(err);
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ message: "User updated successfully" });
    });
  },
);

app.put(
  "/api/work-entries/:id",
  (req: Request<{ id: string }, {}, WorkEntry>, res: Response) => {
    const { id } = req.params;
    const { action } = req.body;

    const workEntryId = parseInt(id, 10);
    if (isNaN(workEntryId)) {
      return res.status(400).json({ message: "Invalid work entry ID" });
    }

    const sql = `
      UPDATE work_entries
      SET action = ?
      WHERE id = ?
    `;

    db.query(sql, [action, workEntryId], (err, result: OkPacket) => {
      if (err) {
        return res.status(500).json(err);
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Work entry not found" });
      }

      res.status(200).json({ message: "Work entry updated successfully" });
    });
  },
);

app.listen(4000, () => {
  console.log("API running on http://localhost:4000");
});
