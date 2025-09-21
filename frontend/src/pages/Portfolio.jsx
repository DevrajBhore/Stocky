// src/pages/Portfolio.jsx
import { useState } from "react";
import Card from "../components/Card.jsx";
import { portfolioApi } from "../api.js";

const inr = (x) => new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:4}).format(Number(x||0));

export default function Portfolio(){
  const [userId, setUserId] = useState("usr_demo_1");
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");

  const fetchIt = async () => {
    setErr(""); setData(null);
    try{
      const r = await portfolioApi(userId.trim());
      setData(r.data);
    }catch(e){
      setErr(e.response?.data?.error || e.message);
    }
  };

  return (
    <>
      <h2>GET /portfolio/:userId</h2>
      <Card>
        <div className="row">
          <input className="input" value={userId} onChange={e=>setUserId(e.target.value)} />
          <button className="btn" onClick={fetchIt}>Fetch</button>
        </div>
        {err && <p className="helper">Error: {err}</p>}
        {data && (
          <>
            <div className="row" style={{justifyContent:"space-between"}}>
              <span className="helper">asOf: {new Date(data.asOf).toLocaleString()}</span>
              <span className="badge">Total: {inr(data.totals?.value || "0")}</span>
            </div>
            <div className="card" style={{padding:0}}>
              <table className="table">
                <thead><tr><th>symbol</th><th>qty</th><th>lastPrice</th><th>value</th></tr></thead>
                <tbody>
                  {data.positions.map(p=>(
                    <tr key={p.symbol}>
                      <td>{p.symbol}</td><td>{p.quantity}</td>
                      <td>{inr(p.lastPrice)}</td><td>{inr(p.value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </Card>
    </>
  );
}
