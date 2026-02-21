import { useEffect, useState } from "react";
import type { WorkEntry } from "../Types";

const jobTypes = [
  "consulting",
  "peer_review",
  "training",
  "documentation",
  "quality_assurance",
];

const WorkEntries: React.FC = () => {
  const [entries, setEntries] = useState<WorkEntry[]>([]);
  const [newEntry, setNewEntry] = useState<WorkEntry>({} as WorkEntry);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    item: string,
  ) => {
    const { value } = e.target;
    setNewEntry((prev) => ({ ...prev, [item]: value }));
  };

  const getData = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/work-entries");
      const data = await res.json();
      setEntries(data);
    } catch (error) {
      console.error("Failed to fetch work entries:", error);
    }
  };

  useEffect(() => {
    getData();
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
          units: newEntry.units,
          jobType: newEntry.job_type,
          workDate: new Date().toISOString().slice(0, 10),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to create entry:", errorData);
        return; // stop here, do not reset newEntry
      }

      const data = await response.json();
      setNewEntry({} as WorkEntry);
      getData();
      console.log(data);
    } catch (error) {
      console.error("Error creating entry:", error);
    }
  };

  const deleteWorkEntry = async (id: number) => {
    try {
      const response = await fetch(`/api/work-entries/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to delete entry:", errorData);
        return;
      }
      getData();
      console.log("Entry deleted successfully");
    } catch (error) {
      console.error("Error deleting entry:", error);
    }
  };

  const isRequiredFieldsFilled = !!(
    newEntry.name &&
    newEntry.job_type &&
    newEntry.units
  );

  return (
    <div className="p-2 mt-4 max-w-full mx-auto">
      <h1 className="text-2xl font-bold mb-4">Work Entries</h1>

      <table className="w-full border">
        <thead className="bg-gray-400">
          <tr>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Job Type</th>
            <th className="p-2 border">Hours</th>
            <th className="p-2 border">Date</th>
            <th className="p-2 border">Add/Delete</th>
          </tr>
        </thead>
        <tbody>
          {entries.map(({ id, name, job_type, units, work_date }) => (
            <tr key={id}>
              <td className="p-2 border">{name}</td>
              <td className="p-2 border">{job_type}</td>
              <td className="p-2 border">{units}</td>
              <td className="p-2 border">
                {new Date(work_date).toLocaleDateString("en-GB")}
              </td>
              <td className="p-2 text-center border ">
                <button
                  className="bg-red-500 text-white px-3 py-1 w-4/5 hover:bg-red-400 cursor-pointer rounded"
                  onClick={() => deleteWorkEntry(id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          <tr>
            <td className="border p-0">
              <input
                className="w-full h-full px-2 border-none outline-none"
                type="text"
                value={newEntry?.name || ""}
                placeholder="Please Enter Name"
                onChange={(e) => handleChange(e, "name")}
              />
            </td>
            <td className="p-0 border">
              <select
                value={newEntry.job_type || ""}
                onChange={(e) => handleChange(e, "job_type")}
                className="w-full h-full px-2 border-none outline-none"
              >
                <option value="">Select job type</option>
                {jobTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </td>
            <td className="p-0 border">
              <input
                type="number"
                value={newEntry.units || ""}
                className="w-full border-none outline-none"
                min={1}
                onChange={(e) => handleChange(e, "units")}
              />
            </td>
            <td className="p-2 border bg-gray-300"></td>
            <td className="p-2 border text-center">
              <button
                className="bg-green-500 text-white px-3 py-1 w-4/5 hover:bg-green-400 cursor-pointer rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
                onClick={() => createWorkEntry()}
                disabled={!isRequiredFieldsFilled}
                title={
                  !isRequiredFieldsFilled ? "Please fill require fields" : ""
                }
              >
                Add
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default WorkEntries;
