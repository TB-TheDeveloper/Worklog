import { type RowDataPacket } from "mysql2/promise";

export interface Approvals {
  id: number;
  work_entry_id: number;
  supervisor_id: number;
  action: string;
  comment: string;
  action_date: Date;
}

export interface CreateWorkEntryBody {
  userId: number;
  units: number;
  jobType: string;
  workDate: string;
  action: string;
}

export interface CreateUser extends RowDataPacket {
  id: number;
  isEditing: boolean;
  name: string;
}

export interface WorkEntry extends RowDataPacket {
  id: number;
  name: string;
  units: number;
  job_type: string;
  work_date: string;
}
