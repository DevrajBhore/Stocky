// src/components/Nav.jsx
import { NavLink } from "react-router-dom";

export default function Nav(){
  const cls = ({isActive}) => isActive ? "link active" : "link";
  return (
    <div className="nav">
      <div className="brand">Stocky</div>
      <NavLink to="/" className={cls}>Dashboard</NavLink>
      <NavLink to="/reward" className={cls}>Reward</NavLink>
      <NavLink to="/today" className={cls}>Today</NavLink>
      <NavLink to="/stats" className={cls}>Stats</NavLink>
      <NavLink to="/portfolio" className={cls}>Portfolio</NavLink>
      <NavLink to="/historical" className={cls}>Historical</NavLink>
    </div>
  );
}
