import React, { useEffect, useState } from 'react';
import PaycheckCard from '../components/PaycheckCard';
import BillItem from '../components/BillItem';
import Nav from '../components/Nav';

function firstOfMonthISO(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}-01`;
}

export default function Home(){
  const [data,setData]=useState<any>(null);
  const [month,setMonth]=useState<string>(firstOfMonthISO());

  useEffect(()=>{
    setData(null);
    fetch(`/api/forecast?month=${encodeURIComponent(month)}`)
      .then(r=>r.json())
      .then(setData)
      .catch(err => setData({ error: String(err) }));
  },[month]);

  return (
    <div style={{maxWidth:900, margin:'12px auto', padding:'0 12px'}}>
      <Nav/>
      <h1>NestEgg – This Month</h1>

      <label>
        Month (YYYY‑MM‑01):&nbsp;
        <input
          value={month}
          onChange={(e)=> setMonth(`${e.target.value.slice(0,7)}-01`)}
          placeholder="YYYY-MM-01"
          style={{border:'1px solid #ccc', padding:6}}
        />
      </label>

      {!data ? <p>Loading…</p> : data.error ? (
        <p style={{color:'#b91c1c'}}>Error: {data.error}</p>
      ) : (
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16}}>
          {data.paychecks.map((p:any)=>(
            <div key={p.id}>
              <PaycheckCard payDate={p.payDate} net={p.netPayCents} assigned={p.assignedTotal} left={p.left}/>
              <div style={{paddingLeft:8}}>
                {(data.groups[p.id]||[]).map((b:any)=>(
                  <BillItem key={b.id} name={b.name} dueDate={b.dueDate} amount={b.amountCents}/>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
