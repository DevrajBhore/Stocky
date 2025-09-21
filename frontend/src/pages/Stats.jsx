// src/pages/Stats.jsx
import { useState } from "react";
import Card from "../components/Card.jsx";
import { statsApi } from "../api.js";

const inr = (x) => new Intl.NumberFormat("en-IN",{style:"currency",currency:"INR",maximumFractionDigits:4}).format(Number(x||0));

export default function Stats(){
  const [userId, setUserId] = useState("usr_demo_1");
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");

  const fetchIt = async () => {
    setErr(""); setData(null);
    try{
      const r = await statsApi(userId.trim());
      setData(r.data);
    }catch(e){
      setErr(e.response?.data?.error || e.message);
    }
  };

  return (
    <>
      <h2>GET /stats/:userId</h2>
      <Card>
        <div className="row">
          <input className="input" value={userId} onChange={e=>setUserId(e.target.value)} />
          <button className="btn" onClick={fetchIt}>Fetch</button>
        </div>
        {err && <p className="helper">Error: {err}</p>}
        {data && (
          <div className="grid2">
            <div className="card">
              <div className="helper" style={{marginBottom:8}}>Today by Symbol</div>
              {data.today.bySymbol.length ? data.today.bySymbol.map(r=>(
                <div key={r.symbol} className="row" style={{justifyContent:"space-between"}}>
                  <span>{r.symbol}</span><span className="badge">{r.quantity}</span>
                </div>
              )) : <div className="helper">No rewards today</div>}
              <div className="helper" style={{marginTop:8}}>asOf: {new Date(data.today.asOf).toLocaleString()}</div>
            </div>
            <div className="card">
              <div className="helper" style={{marginBottom:8}}>Portfolio Value</div>
              <div style={{fontSize:24,fontWeight:700}}>{inr(data.portfolio.valueINR)}</div>
              <div className="helper" style={{marginTop:8}}>
                asOf: {new Date(data.portfolio.asOf).toLocaleString()} • source: {data.portfolio.pricingSource}
              </div>
            </div>
          </div>
        )}
      </Card>
    </>
  );
}
