// src/pages/Historical.jsx
import { useState } from "react";
import Card from "../components/Card.jsx";
import { historicalApi } from "../api.js";

export default function Historical(){
  const [userId, setUserId] = useState("usr_demo_1");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");

  const fetchIt = async () => {
    setErr(""); setData(null);
    try{
      const r = await historicalApi(userId.trim(), from.trim(), to.trim());
      setData(r.data);
    }catch(e){
      setErr(e.response?.data?.error || e.message);
    }
  };

  return (
    <>
      <h2>GET /historical-inr/:userId</h2>
      <Card>
        <div className="row">
          <input className="input" placeholder="userId" value={userId} onChange={e=>setUserId(e.target.value)} />
          <input className="input" placeholder="from YYYY-MM-DD" value={from} onChange={e=>setFrom(e.target.value)} />
          <input className="input" placeholder="to YYYY-MM-DD" value={to} onChange={e=>setTo(e.target.value)} />
          <button className="btn" onClick={fetchIt}>Fetch</button>
        </div>
        {err && <p className="helper">Error: {err}</p>}
        {data && (
          <div className="grid2">
            <div className="card" style={{padding:0}}>
              <table className="table">
                <thead><tr><th>Date</th><th>Total Value (INR)</th></tr></thead>
                <tbody>
                  {data.series.map(s=>(
                    <tr key={s.date}><td>{s.date}</td><td>{s.totalValue}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="card">
              <div className="helper">{data.note}</div>
              {/* (Optional) you can add a simple canvas sparkline later if you want */}
            </div>
          </div>
        )}
      </Card>
    </>
  );
}
