import React, { useEffect, useMemo, useState } from 'react';
import Nav from '../components/Nav';

type Bill = { id:string; name:string; category:string; amountCents:number; dueDay:number|null; active:boolean };
type Draft = { id?:string; name:string; category:string; amountDollars:string; dueDay:string; active:boolean };

export default function BillsPage(){
  const [bills,setBills]=useState<Bill[]>([]);
  const [loading,setLoading]=useState(false);
  const [msg,setMsg]=useState<string|undefined>();
  const [err,setErr]=useState<string|undefined>();

  // create form (new bill)
  const [newBill,setNewBill]=useState<Draft>({name:'',category:'General',amountDollars:'',dueDay:'',active:true});

  // a map of row drafts keyed by bill id, so typing doesn't ping the server
  const [drafts,setDrafts]=useState<Record<string,Draft>>({});

  const fetchBills = async ()=>{
    setLoading(true); setErr(undefined);
    try {
      const r = await fetch('/api/bills');
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error||'Failed to load');
      setBills(j);
    } catch(e:any){ setErr(String(e.message||e)); }
    finally { setLoading(false); }
  };

  useEffect(()=>{ fetchBills(); },[]);

  const resetNew = ()=> setNewBill({name:'',category:'General',amountDollars:'',dueDay:'',active:true});

  const create = async ()=>{
    setMsg(undefined); setErr(undefined);
    try{
      const payload = {
        name: newBill.name.trim(),
        category: newBill.category.trim() || 'General',
        amountCents: Math.round(parseFloat(newBill.amountDollars||'0')*100),
        dueDay: newBill.dueDay ? parseInt(newBill.dueDay,10) : null
      };
      const r = await fetch('/api/bills',{ method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
      const j = await r.json();
      if(!r.ok) throw new Error(j?.error||'Create failed');
      setMsg('Bill created'); resetNew(); fetchBills();
    }catch(e:any){ setErr(String(e.message||e)); }
  };

  const save = async (id:string)=>{
    const d = drafts[id];
    if(!d) return;
    setMsg(undefined); setErr(undefined);
    try{
      const payload = {
        name: d.name.trim(),
        category: d.category.trim() || 'General',
        amountCents: Math.round(parseFloat(d.amountDollars||'0')*100),
        dueDay: d.dueDay ? parseInt(d.dueDay,10) : null,
        active: !!d.active
      };
      const r = await fetch(`/api/bills/${encodeURIComponent(id)}`,{ method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });
      const j = await r.json();
      if(!r.ok) throw new Error(j?.error||'Update failed');
      setMsg('Saved'); setDrafts(x=>{ const y={...x}; delete y[id]; return y; }); fetchBills();
    }catch(e:any){ setErr(String(e.message||e)); }
  };

  const del = async (id:string)=>{
    setMsg(undefined); setErr(undefined);
    try{
      const r = await fetch(`/api/bills/${encodeURIComponent(id)}`,{ method:'DELETE' });
      const j = await r.json();
      if(!r.ok) throw new Error(j?.error||'Delete failed');
      setMsg('Deleted'); fetchBills();
    }catch(e:any){ setErr(String(e.message||e)); }
  };

  const dollars = (c:number)=> (c/100).toFixed(2);

  return (
    <div style={{maxWidth:900, margin:'12px auto', padding:'0 12px'}}>
      <Nav/>
      <h1>Bills</h1>

      <div style={{border:'1px solid #eee', borderRadius:8, padding:12, marginBottom:16}}>
        <h3>Add Bill</h3>
        <div style={{display:'flex', gap:8, flexWrap:'wrap', alignItems:'center'}}>
          <input placeholder="Name" value={newBill.name} onChange={e=>setNewBill(x=>({...x,name:e.target.value}))}/>
          <input placeholder="Category" value={newBill.category} onChange={e=>setNewBill(x=>({...x,category:e.target.value}))}/>
          <input placeholder="Amount $" value={newBill.amountDollars} onChange={e=>setNewBill(x=>({...x,amountDollars:e.target.value}))}/>
          <input placeholder="Due day (1–31)" value={newBill.dueDay} onChange={e=>setNewBill(x=>({...x,dueDay:e.target.value}))}/>
          <button onClick={create}>Create</button>
        </div>
      </div>

      {msg && <p style={{color:'#065f46'}}>{msg}</p>}
      {err && <p style={{color:'#b91c1c'}}>Error: {err}</p>}
      {loading && <p>Loading…</p>}

      <div>
        {bills.map(b=>{
          const d = drafts[b.id] ?? { id:b.id, name:b.name, category:b.category, amountDollars:dollars(b.amountCents), dueDay:String(b.dueDay??''), active:b.active };
          return (
            <div key={b.id} style={{border:'1px solid #eee', padding:10, marginBottom:8, borderRadius:8, display:'grid', gridTemplateColumns:'200px 160px 140px 120px 1fr', gap:8, alignItems:'center'}}>
              <input value={d.name} onChange={e=>setDrafts(x=>({...x,[b.id]:{...d,name:e.target.value}}))}/>
              <input value={d.category} onChange={e=>setDrafts(x=>({...x,[b.id]:{...d,category:e.target.value}}))}/>
              <input value={d.amountDollars} onChange={e=>setDrafts(x=>({...x,[b.id]:{...d,amountDollars:e.target.value}}))}/>
              <input value={d.dueDay} onChange={e=>setDrafts(x=>({...x,[b.id]:{...d,dueDay:e.target.value}}))}/>
              <div style={{display:'flex', gap:8, alignItems:'center'}}>
                <label><input type="checkbox" checked={d.active} onChange={e=>setDrafts(x=>({...x,[b.id]:{...d,active:e.target.checked}}))}/> active</label>
                <button onClick={()=>save(b.id)}>Save</button>
                <button onClick={()=>del(b.id)} style={{color:'#b91c1c'}}>Delete</button>
              </div>
            </div>
          );
        })}
        {(!loading && bills.length===0) && <p>No bills yet. Add one above.</p>}
      </div>
    </div>
  );
}
