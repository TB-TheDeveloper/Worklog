import React, { useContext, useEffect, useState } from "react";

import { AppContext } from "./AppContextProvider";
import useService from "./service";

const Users: React.FC = () => {
  const [newName, setNewName] = useState<string>("");
  const { users, setUsers } = useContext(AppContext);
  const { getUserData } = useService();

  useEffect(() => {
    if (users.length) return;
    getUserData();
  }, []);

  const createUserEntry = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newName,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to create entry:", errorData);
        return;
      }

      const data = await response.json();
      setNewName("");
      getUserData();
      console.log(data);
    } catch (error) {
      console.error("Error creating entry:", error);
    }
  };

  const updateUserEntry = async (id: number) => {
    try {
      const entry = users.find((entry) => entry.id === id);
      if (!entry) {
        console.error(`Entry with id ${id} not found`);
        return;
      }

      const { name } = entry;

      if (!name || name.trim() === "") {
        console.error("Name cannot be empty");
        return;
      }

      const response = await fetch(
        `http://localhost:4000/api/user/${encodeURIComponent(id)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to update entry:", errorData);
        return;
      }

      // Refresh users from server
      getUserData();
      console.log("Entry updated successfully");
    } catch (error) {
      console.error("Error updating entry:", error);
    }
  };

  return (
    <div className="p-2 mt-4 max-w-full mx-auto bg-orange">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <div className="max-h-[82.5vh] overflow-y-auto">
        <table className="w-full border">
          <thead className="bg-gray-400 sticky top-0">
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Id</th>
              <th className="p-2 border">Add/Edit</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border p-0">
                <input
                  className="w-full h-full px-2 border-none outline-none"
                  type="text"
                  value={newName || ""}
                  placeholder="Please Enter Name"
                  onChange={(e) => setNewName(e.target.value)}
                />
              </td>
              <td className="p-2 border bg-gray-300"></td>
              <td className="p-2 border text-center">
                <button
                  className="bg-green-500 text-white px-3 py-1 w-4/5 hover:bg-green-400 cursor-pointer rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
                  onClick={() => createUserEntry()}
                  disabled={!newName}
                  title={!newName ? "Please fill required field(s)" : ""}
                >
                  Add
                </button>
              </td>
            </tr>
            {users.map(({ id, name, isEditing }) => (
              <tr key={id}>
                <td className="p-0 border">
                  <input
                    className="w-full h-full px-2 border-none outline-none"
                    type="text"
                    value={name || ""}
                    placeholder="Please Enter Name"
                    onChange={(e) =>
                      setUsers((prev) => {
                        const index = prev.findIndex((e) => e.id === id);
                        if (index === -1) return prev;

                        const newusers = [...prev];
                        newusers[index] = {
                          ...newusers[index],
                          name: e.target.value,
                        };

                        return newusers;
                      })
                    }
                    disabled={!isEditing}
                  />
                </td>
                <td className="p-2 border">{id}</td>
                <td className="p-2 text-center border ">
                  <button
                    className={`${
                      isEditing
                        ? "bg-green-500 hover:bg-green-400"
                        : "bg-blue-500 hover:bg-blue-400"
                    } text-white px-3 py-1 w-4/5 cursor-pointer rounded`}
                    onClick={() => {
                      if (isEditing) {
                        updateUserEntry(id);
                      }
                      setUsers((prev) => {
                        const index = prev.findIndex((e) => e.id === id);
                        if (index === -1) return prev;

                        const newusers = [...prev];
                        newusers[index] = {
                          ...newusers[index],
                          isEditing: !isEditing,
                        };

                        return newusers;
                      });
                    }}
                  >
                    {!isEditing ? "Edit" : "Save"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
