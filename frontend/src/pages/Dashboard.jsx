// src/pages/Dashboard.jsx
import Card from "../components/Card.jsx";

export default function Dashboard(){
  return (
    <div className="grid2">
      <Card title="Welcome">
        <p>Use the tabs to post rewards and view Today, Stats, Portfolio, and Historical data.</p>
        <p className="helper">Start with <code>usr_demo_1</code>. Run <code>npm run seed:stocks</code> in backend first.</p>
      </Card>
      <Card title="About">
        <ul className="helper" style={{margin:0, paddingLeft:18, listStyle:"disc"}}>
          <li>Vite + React (JavaScript)</li>
          <li>Plain CSS, no UI libraries</li>
          <li>API base: {import.meta.env.VITE_API_URL}</li>
        </ul>
      </Card>
    </div>
  );
}
