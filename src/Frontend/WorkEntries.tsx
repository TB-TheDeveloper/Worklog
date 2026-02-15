import { useEffect, useState } from "react";
import type { WorkEntry } from "../Types";

const WorkEntries: React.FC = () => {
  const [entries, setEntries] = useState<WorkEntry[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("http://localhost:4000/api/work-entries");
        const data = await res.json();
        setEntries([
          ...data,
          {
            name: "John Doe",
            job_type: "Consulting",
            units: 2,
            work_date: "2026-02-14",
            id: 999,
          },
        ]);
      } catch (error) {
        console.error("Failed to fetch work entries:", error);
      }
    })();
  }, []);

  const createWorkEntry = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/work-entries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: 1,
          units: 8,
          jobType: "training",
          workDate: "2026-02-14",
        }),
      });

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error creating entry:", error);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Work Entries</h1>

      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Job Type</th>
            <th className="p-2 border">Hours</th>
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Add/Delete</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e) => (
            <tr key={e.id}>
              <td className="p-2 border">{e.name}</td>
              <td className="p-2 border">{e.job_type}</td>
              <td className="p-2 border">{e.units}</td>
              <td className="p-2 border">{e.work_date}</td>
              <button
                className="bg-green-500 text-white px-3 py-1 rounded"
                onClick={() => createWorkEntry()}
              >
                Add
              </button>
              <button className="bg-red-500 text-white px-3 py-1 rounded ml-2">
                Delete
              </button>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WorkEntries;
