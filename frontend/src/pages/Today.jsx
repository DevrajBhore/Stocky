// src/pages/Today.jsx
import { useState } from "react";
import Card from "../components/Card.jsx";
import { todayApi } from "../api.js";

export default function Today(){
  const [userId, setUserId] = useState("usr_demo_1");
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");

  const fetchIt = async () => {
    setErr(""); setData(null);
    try{
      const r = await todayApi(userId.trim());
      setData(r.data);
    }catch(e){
      setErr(e.response?.data?.error || e.message);
    }
  };

  return (
    <>
      <h2>GET /today-stocks/:userId</h2>
      <Card>
        <div className="row">
          <input className="input" value={userId} onChange={e=>setUserId(e.target.value)} />
          <button className="btn" onClick={fetchIt}>Fetch</button>
        </div>
        {err && <p className="helper">Error: {err}</p>}
        {data && (
          <div>
            <p className="helper">User: {data.userId} • Date: {data.date}</p>
            <div className="card" style={{padding:0}}>
              <table className="table">
                <thead><tr><th>rewardId</th><th>symbol</th><th>qty</th><th>time</th><th>campaign</th></tr></thead>
                <tbody>
                  {data.items.map(it => (
                    <tr key={it.rewardId}>
                      <td>{it.rewardId}</td>
                      <td>{it.symbol}</td>
                      <td>{it.quantity}</td>
                      <td>{new Date(it.rewardedAt).toLocaleString()}</td>
                      <td>{it.campaign?.id || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Card>
    </>
  );
}
