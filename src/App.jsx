import "./App.css";
import Dashboard from "./pages/Dashboard";
import Keywords from "./pages/Keywords";
import { Routes, Route } from "react-router-dom";
import Database from "./pages/Data-base";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="keywords" element={<Keywords />} />
        <Route path="database" element={<Database />} />
      </Routes>
    </>
  );
}

export default App;
