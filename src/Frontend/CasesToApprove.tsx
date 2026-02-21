import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "./AppContextProvider";
import useService from "./service";

const CasesToApprove: React.FC = () => {
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const { entries, users } = useContext(AppContext);
  const { getData, getUserData } = useService();

  useEffect(() => {
    if (entries.length) return;
    getData();
  }, []);

  const approveWorkEntry = (id: number) => {};

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
                  <td className="p-2 text-center border ">
                    <button
                      className="bg-green-500 text-white px-3 py-1 w-4/5 hover:bg-green-400 cursor-pointer rounded"
                      onClick={() => setConfirmId(id)}
                    >
                      Approve
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
            <p>Are you sure you want to approve?</p>

            <div className="flex gap-4 mt-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={() => {
                  approveWorkEntry(confirmId);
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

export default CasesToApprove;
