import React, { useEffect, useState } from "react";
import type { CreateUser } from "../Types";

const Users: React.FC = () => {
  const [newName, setNewName] = useState<string>("");
  const [entries, setEntries] = useState<CreateUser[]>([]);
  //const [isEditing, setIsEditing] = useState<boolean>(false);

  const getData = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/users");
      console.log(res);
      const data = (await res.json()) as CreateUser[];
      setEntries(data.map((d) => ({ ...d, isEditing: false })));
    } catch (error) {
      console.error("Failed to fetch users entries:", error);
    }
  };

  useEffect(() => {
    getData();
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
      getData();
      console.log(data);
    } catch (error) {
      console.error("Error creating entry:", error);
    }
  };

  const updateUserEntry = async (id: number) => {
    try {
      const entry = entries.find((entry) => entry.id === id);
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

      // Refresh entries from server
      getData();
      console.log("Entry updated successfully");
    } catch (error) {
      console.error("Error updating entry:", error);
    }
  };

  return (
    <div className="p-2 mt-4 max-w-full mx-auto">
      <h1 className="text-2xl font-bold mb-4">Users</h1>

      <table className="w-full border">
        <thead className="bg-gray-400">
          <tr>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Id</th>
            <th className="p-2 border">Add/Edit</th>
          </tr>
        </thead>
        <tbody>
          {entries.map(({ id, name, isEditing }) => (
            <tr key={id}>
              <td className="p-0 border">
                <input
                  className="w-full h-full px-2 border-none outline-none"
                  type="text"
                  value={name || ""}
                  placeholder="Please Enter Name"
                  onChange={(e) =>
                    setEntries((prev) => {
                      const index = prev.findIndex((e) => e.id === id);
                      if (index === -1) return prev;

                      const newEntries = [...prev];
                      newEntries[index] = {
                        ...newEntries[index],
                        name: e.target.value,
                      };

                      return newEntries;
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
                      : "bg-red-500 hover:bg-red-400"
                  } text-white px-3 py-1 w-4/5 cursor-pointer rounded`}
                  onClick={() => {
                    if (isEditing) {
                      updateUserEntry(id);
                    }
                    setEntries((prev) => {
                      const index = prev.findIndex((e) => e.id === id);
                      if (index === -1) return prev;

                      const newEntries = [...prev];
                      newEntries[index] = {
                        ...newEntries[index],
                        isEditing: !isEditing,
                      };

                      return newEntries;
                    });
                  }}
                >
                  {!isEditing ? "Edit" : "Save"}
                </button>
              </td>
            </tr>
          ))}
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
                title={!newName ? "Please fill require fields" : ""}
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

export default Users;
