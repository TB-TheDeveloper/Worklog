import { type RowDataPacket } from "mysql2/promise";

export interface CreateWorkEntryBody {
  userId: number;
  units: number;
  jobType: string;
  workDate: string;
}

export interface WorkEntry extends RowDataPacket {
  id: number;
  name: string;
  units: number;
  job_type: string;
  work_date: string;
}
