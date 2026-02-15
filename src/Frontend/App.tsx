import React, { lazy } from "react";
import { Route, Routes } from "react-router-dom";

const WorkEntries = lazy(() => import("./WorkEntries"));
const App = () => {
  return (
    <Routes>
      <Route path="/" element={<WorkEntries />} />
    </Routes>
  );
};

export default App;
