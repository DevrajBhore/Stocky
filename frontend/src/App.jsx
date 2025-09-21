// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Nav from "./components/Nav.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Reward from "./pages/Reward.jsx";
import Today from "./pages/Today.jsx";
import Stats from "./pages/Stats.jsx";
import Portfolio from "./pages/Portfolio.jsx";
import Historical from "./pages/Historical.jsx";

export default function App(){
  return (
    <>
      <Nav />
      <Routes>
        <Route index element={<Dashboard/>}/>
        <Route path="/reward" element={<Reward/>}/>
        <Route path="/today" element={<Today/>}/>
        <Route path="/stats" element={<Stats/>}/>
        <Route path="/portfolio" element={<Portfolio/>}/>
        <Route path="/historical" element={<Historical/>}/>
      </Routes>
    </>
  );
}
