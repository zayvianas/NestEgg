import React, { useEffect, useState } from 'react';
import Nav from '../components/Nav';

type Paycheck = { id:string; payDate:string; netPayCents:number };

function firstOfMonthISO(d=new Date()){
  const y=d.getFullYear(); const m=String(d.getMonth()+1).padStart(2,'0'); return `${y}-${m}-01`;
}

export default function PaychecksPage(){
  const [month,setMonth]=useState(firstOfMonthISO());
  const [checks,setChecks]=useState<Paycheck[]>([]);
  const [drafts,setDrafts]=useState<Record<string,string>>({});
  const [msg,setMsg]=useState<string>();
  const [err,setErr]=useState<string>();

  const load=async ()=>{
    setMsg(undefined); setErr(undefined);
    try{
      const r = await fetch('/api/forecast?month='+encodeURIComponent(month));
      const ct = r.headers.get('content-type') || '';
      if(!r.ok) {
        const body = ct.includes('application/json') ? JSON.stringify(await r.json()) : await r.text();
        throw new Error('Load failed: '+body.slice(0,200));
      }
      const data = await r.json();
      const list:Paycheck[] = data?.paychecks ?? [];
      setChecks(list);
      setDrafts(prev => {
        const next = {...prev};
        for(const c of list){
          if(next[c.id] === undefined) next[c.id] = (c.netPayCents/100).toString();
        }
        return next;
      });
    }catch(e:any){
      setErr(e?.message || 'Load failed');
    }
  };

  useEffect(()=>{ load(); },[month]);

  const save=async (id:string)=>{
    setMsg(undefined); setErr(undefined);
    try{
      const dollars = drafts[id] ?? '0';
      const netPayCents = Math.round(Number(dollars||'0')*100);
      const r = await fetch('/api/paychecks/'+id,{
        method:'PUT',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ netPayCents })
      });
      const ct = r.headers.get('content-type') || '';
      if(!r.ok){
        const body = ct.includes('application/json') ? JSON.stringify(await r.json()) : await r.text();
        throw new Error('Save failed: '+body.slice(0,200));
      }
      setMsg('Saved.');
      await load();
    }catch(e:any){
      setErr(e?.message || 'Save failed');
    }
  };

  return (
    <div style={{maxWidth:900, margin:'12px auto', padding:'0 12px'}}>
      <Nav/>
      <h1>Paychecks</h1>
      <label>Month (YYYY-MM-01): <input value={month} onChange={e=>setMonth(`${e.target.value.slice(0,7)}-01`)}/></label>
      {msg && <p style={{color:'#065f46'}}>{msg}</p>}
      {err && <p style={{color:'#b91c1c', whiteSpace:'pre-wrap'}}>{err}</p>}
      <div style={{marginTop:12}}>
        {checks.map(c=>(
          <div key={c.id} style={{border:'1px solid #eee', padding:10, marginBottom:8, borderRadius:8, display:'flex', alignItems:'center', gap:12}}>
            <div style={{width:260}}><strong>{new Date(c.payDate).toDateString()}</strong></div>
            <div>Net $</div>
            <input style={{width:120}}
                   value={drafts[c.id] ?? (c.netPayCents/100).toString()}
                   onChange={e=>setDrafts(d=>({...d,[c.id]:e.target.value}))}/>
            <button onClick={()=>save(c.id)}>Save</button>
          </div>
        ))}
        {checks.length===0 && <p>No checks for this month (set your pay schedule first).</p>}
      </div>
    </div>
  );
}
