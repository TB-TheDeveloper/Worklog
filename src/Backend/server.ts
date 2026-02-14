import express, { type Request, type Response } from "express";
import mysql from "mysql2";

import cors from "cors";
import type { CreateWorkEntryBody, WorkEntry } from "../Types";
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

app.listen(4000, () => {
  console.log("API running on http://localhost:4000");
});
