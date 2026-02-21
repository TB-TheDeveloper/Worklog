import { useContext, useEffect, useState } from "react";
import type { WorkEntry } from "../Types";
import { AppContext } from "./AppContextProvider";
import useService from "./service";

const jobTypes = [
  "consulting",
  "peer_review",
  "training",
  "documentation",
  "quality_assurance",
];

const WorkEntries: React.FC = () => {
  const [newEntry, setNewEntry] = useState<WorkEntry>({} as WorkEntry);
  const { entries, users } = useContext(AppContext);
  const { getData, getUserData } = useService();
  const [confirmId, setConfirmId] = useState<number | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    item: string,
  ) => {
    const { value } = e.target;
    setNewEntry((prev) => ({ ...prev, [item]: value }));
  };

  useEffect(() => {
    if (entries.length) return;
    getData();
  }, []);

  useEffect(() => {
    if (users.length) return;
    getUserData();
  }, []);

  const createWorkEntry = async () => {
    try {
      console.log("Creating entry with data:", newEntry);
      const response = await fetch("http://localhost:4000/api/work-entries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: newEntry.name,
          units: newEntry.units,
          jobType: newEntry.job_type,
          workDate: new Date().toISOString().slice(0, 10),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to create entry:", errorData);
        return;
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
      const response = await fetch(
        `http://localhost:4000/api/work-entries/${id}`,
        {
          method: "DELETE",
        },
      );

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
    <>
      <div className="p-2 mt-4 max-w-full mx-auto">
        <h1 className="text-2xl font-bold mb-4">Work Entries</h1>
        <div className="max-h-[82.5vh] overflow-y-auto">
          <table className="w-full border">
            <thead className="bg-gray-400 sticky top-0">
              <tr>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Job Type</th>
                <th className="p-2 border">Hours</th>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Add/Delete</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-0">
                  <select
                    value={newEntry.name || ""}
                    onChange={(e) => handleChange(e, "name")}
                    className="w-full h-full px-2 border-none outline-none"
                  >
                    <option value="">Select user</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
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
                      !isRequiredFieldsFilled
                        ? "Please fill required field(s)"
                        : ""
                    }
                  >
                    Add
                  </button>
                </td>
              </tr>
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
                      onClick={() => setConfirmId(id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {confirmId !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <p>Are you sure you want to delete?</p>

            <div className="flex gap-4 mt-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => {
                  deleteWorkEntry(confirmId);
                  setConfirmId(null);
                }}
              >
                Yes
              </button>

              <button
                className="bg-gray-400 px-4 py-2 rounded"
                onClick={() => setConfirmId(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WorkEntries;
