import { useCallback, useContext } from "react";
import type { CreateUser } from "../Types";
import { AppContext } from "./AppContextProvider";

interface serviceOutput {
  getData: () => Promise<void>;
  getUserData: () => Promise<void>;
}

const useService = (): serviceOutput => {
  const { setEntries, setUsers } = useContext(AppContext);

  const getData = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:4000/api/work-entries");
      const data = await res.json();
      setEntries(data);
    } catch (error) {
      console.error("Failed to fetch work entries:", error);
    }
  }, []);

  const getUserData = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:4000/api/users");
      const data = (await res.json()) as CreateUser[];
      setUsers(data.map((d) => ({ ...d, isEditing: false })));
    } catch (error) {
      console.error("Failed to fetch users users:", error);
    }
  }, []);

  return {
    getData,
    getUserData,
  };
};

export default useService;
