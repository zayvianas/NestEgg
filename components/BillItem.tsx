import React from 'react';
type Props = { name:string; dueDate:string; amount:number; };
export default function BillItem({name,dueDate,amount}:Props){
  const fmt=(c:number)=>`$${(c/100).toFixed(2)}`;
  return <div style={{display:'flex', justifyContent:'space-between', padding:'6px 0', borderBottom:'1px dashed #eee'}}>
    <span>{name} <small>({new Date(dueDate).toLocaleDateString()})</small></span>
    <span>{fmt(amount)}</span>
  </div>
}
