import React, { lazy } from "react";
import { Route, Routes } from "react-router-dom";

const Approvals = lazy(() => import("./Approvals"));
const CasesToApprove = lazy(() => import("./CasesToApprove"));
const WorkEntries = lazy(() => import("./WorkEntries"));
const Users = lazy(() => import("./Users"));
const App = () => {
  return (
    <Routes>
      <Route path="/approvals" element={<Approvals />} />
      <Route path="/casestoapprove" element={<CasesToApprove />} />
      <Route path="/" element={<WorkEntries />} />
      <Route path="/users" element={<Users />} />
    </Routes>
  );
};

export default App;
