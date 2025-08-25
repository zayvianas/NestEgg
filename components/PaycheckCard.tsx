import React from 'react';

type Props = { payDate: string; net: number; assigned: number; left: number; };

export default function PaycheckCard({ payDate, net, assigned, left }: Props) {
  const fmt = (c:number)=> `$${(c/100).toFixed(2)}`;
  const color = left < 0 ? '#b91c1c' : '#065f46';
  return (
    <div style={{border:'1px solid #ddd', borderRadius:8, padding:12, marginBottom:12}}>
      <div><strong>Paycheck:</strong> {new Date(payDate).toDateString()}</div>
      <div>Net: {fmt(net)}</div>
      <div>Assigned: {fmt(assigned)}</div>
      <div style={{color}}>{left < 0 ? `Short by ${fmt(Math.abs(left))}` : `Leftover: ${fmt(left)}`}</div>
    </div>
  );
}
