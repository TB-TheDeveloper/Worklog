import React, { createContext, useMemo, useState, type ReactNode } from "react";
import type { CreateUser, WorkEntry } from "../Types";

interface AppContextType {
  approvals: WorkEntry[];
  entries: WorkEntry[];
  setApprovals: React.Dispatch<React.SetStateAction<WorkEntry[]>>;
  setEntries: React.Dispatch<React.SetStateAction<WorkEntry[]>>;
  setUsers: React.Dispatch<React.SetStateAction<CreateUser[]>>;
  users: CreateUser[];
}

export const AppContext = createContext<AppContextType>({
  approvals: [],
  entries: [],
  setApprovals: () => {},
  setEntries: () => {},
  users: [],
  setUsers: () => {},
});

interface AppProviderProps {
  children: ReactNode;
}

const AppContextProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [users, setUsers] = useState<CreateUser[]>([]);
  const [entries, setEntries] = useState<WorkEntry[]>([]);
  const [approvals, setApprovals] = useState<WorkEntry[]>([]);

  const values = useMemo(
    () => ({
      approvals,
      entries,
      setApprovals,
      setEntries,
      setUsers,
      users,
    }),
    [approvals, entries, users],
  );

  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
};

export default AppContextProvider;
