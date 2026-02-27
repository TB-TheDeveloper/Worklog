import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "./AppContextProvider";
import useService from "./service";

const CasesToApprove: React.FC = () => {
  const [confirmId, setConfirmId] = useState<{
    id: number | undefined;
    action: string;
  }>({ id: undefined, action: "" });
  const { entries, users } = useContext(AppContext);
  const { getData } = useService();

  useEffect(() => {
    if (entries.length) return;
    getData();
  }, []);

  const approveOrRejectWorkEntry = async (id: number, action: string) => {
    try {
      const entry = users.find((entry) => entry.id === id);
      if (!entry) {
        console.error(`Entry with id ${id} not found`);
        return;
      }

      const response = await fetch(
        `http://localhost:4000/api/work-entries/${encodeURIComponent(id)}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ action }),
        },
      );

      if (!response.ok) {
        console.error(`Failed to update entry with id ${id}`);
        return;
      }

      getData();
      console.log("Entry updated successfully");
    } catch (error) {
      console.error("Error approving/rejecting work entry:", error);
    }
  };

  return (
    <>
      <div className="p-2 mt-4 max-w-full mx-auto">
        <h1 className="text-2xl font-bold mb-4">Cases To Approve</h1>
        <div className="max-h-[82.5vh] overflow-y-auto">
          <table className="w-full border">
            <thead className="bg-gray-400 sticky top-0">
              <tr>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Job Type</th>
                <th className="p-2 border">Hours</th>
                <th className="p-2 border">Date</th>
                <th className="p-2 border">Approve</th>
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
                  <td className="p-2 text-center border flex flex-row gap-2">
                    <button
                      className="bg-green-500 text-white px-3 py-1 w-4/5 hover:bg-green-400 cursor-pointer rounded"
                      onClick={() => setConfirmId({ id, action: "approved" })}
                    >
                      Approve
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 w-4/5 hover:bg-red-400 cursor-pointer rounded"
                      onClick={() => setConfirmId({ id, action: "rejected" })}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {confirmId.id && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <p>Are you sure you want to {confirmId.action}?</p>

            <div className="flex gap-4 mt-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => {
                  approveOrRejectWorkEntry(confirmId.id!, confirmId.action);
                  setConfirmId({ id: undefined, action: "" });
                }}
              >
                Yes
              </button>

              <button
                className="bg-gray-400 px-4 py-2 rounded"
                onClick={() => setConfirmId({ id: undefined, action: "" })}
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

export default CasesToApprove;
