import React, { lazy } from "react";
import { Route, Routes } from "react-router-dom";

const WorkEntries = lazy(() => import("./WorkEntries"));
const Users = lazy(() => import("./Users"));
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<WorkEntries />} />
      <Route path="/users" element={<Users />} />
    </Routes>
  );
};

export default App;
