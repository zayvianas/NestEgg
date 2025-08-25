import Link from "next/link";
export default function Nav(){
  const linkStyle: React.CSSProperties = { marginRight: 14, textDecoration:'none' };
  const bar: React.CSSProperties = { padding:'10px 14px', borderBottom:'1px solid #eee', marginBottom:16 };
  return (
    <nav style={bar}>
      <Link href="/" style={linkStyle}>Forecast</Link>
      <Link href="/bills" style={linkStyle}>Bills</Link>
      <Link href="/paychecks" style={linkStyle}>Paychecks</Link>
      <span style={{color:'#888'}}> | NestEgg</span>
    </nav>
  );
}
