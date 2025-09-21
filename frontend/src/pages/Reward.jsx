// src/pages/Reward.jsx
import { useState } from "react";
import dayjs from "dayjs";
import Card from "../components/Card.jsx";
import { rewardApi } from "../api.js";

export default function Reward(){
  const [form, setForm] = useState({
    userId: "usr_demo_1",
    symbol: "RELIANCE",
    quantity: "12.5",
    rewardedAt: dayjs().toISOString(),
    campaignId: "",
    reason: ""
  });
  const [resp, setResp] = useState(null);
  const [err, setErr] = useState("");

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault(); setErr(""); setResp(null);
    try{
      const body = {
        userId: form.userId.trim(),
        symbol: form.symbol.trim().toUpperCase(),
        quantity: form.quantity,
        rewardedAt: form.rewardedAt,
        metadata: {
          campaignId: form.campaignId || undefined,
          reason: form.reason || undefined
        }
      };
      const r = await rewardApi(body);
      setResp(r.data);
    }catch(e){
      setErr(e.response?.data?.error || e.message);
    }
  };

  return (
    <>
      <h2>POST /reward</h2>
      <Card>
        <form onSubmit={submit} className="grid3" style={{alignItems:"end"}}>
          <label>userId<input className="input" name="userId" value={form.userId} onChange={onChange}/></label>
          <label>symbol<input className="input" name="symbol" value={form.symbol} onChange={onChange}/></label>
          <label>quantity<input className="input" name="quantity" value={form.quantity} onChange={onChange}/></label>
          <label className="grid2" style={{gridColumn:"1 / span 2"}}>rewardedAt
            <input className="input" name="rewardedAt" value={form.rewardedAt} onChange={onChange}/>
          </label>
          <label>campaignId<input className="input" name="campaignId" value={form.campaignId} onChange={onChange}/></label>
          <label className="grid2" style={{gridColumn:"1 / span 2"}}>reason
            <input className="input" name="reason" value={form.reason} onChange={onChange}/>
          </label>
          <button className="btn" type="submit">Send Reward</button>
        </form>
      </Card>

      {err && <div className="card" style={{borderColor:"#7f1d1d"}}>Error: {err}</div>}
      {resp && <pre className="card code">{JSON.stringify(resp, null, 2)}</pre>}
    </>
  );
}
